<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attempt;
use App\Models\AttemptAnswer;
use App\Models\QuestionBank;
use App\Models\SkillProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CompetencyController extends Controller
{
    /**
     * Get Competency Overview Stats
     */
    public function getOverview(Request $request)
    {
        $user = $request->user();
        
        if ($user->role === 'admin' || $user->role === 'mentor') {
            $interns = \App\Models\User::where('role', 'intern')->with('skillProgress')->get();
            
            $internStats = $interns->map(function ($intern) {
                $averageMastery = $intern->skillProgress->avg('mastery_percentage') ?? 0;
                $totalXp = $intern->skillProgress->sum('xp') ?? 0;
                $modulesLearned = $intern->skillProgress->count();
                
                return [
                    'id' => $intern->id,
                    'name' => $intern->name,
                    'email' => $intern->email,
                    'average_mastery' => round($averageMastery),
                    'total_xp' => $totalXp,
                    'modules_learned' => $modulesLearned,
                ];
            });

            return response()->json([
                'data' => [
                    'role' => $user->role,
                    'interns' => $internStats
                ]
            ]);
        }
        
        $skillProgress = SkillProgress::where('user_id', $user->id)->get();
        
        $averageMastery = $skillProgress->avg('mastery_percentage') ?? 0;
        $totalXp = $skillProgress->sum('xp') ?? 0;
        $modulesLearned = $skillProgress->count(); // Simply count how many competencies they have progress in

        return response()->json([
            'data' => [
                'role' => $user->role,
                'average_mastery' => round($averageMastery),
                'total_xp' => $totalXp,
                'modules_learned' => $modulesLearned
            ]
        ]);
    }

    /**
     * Get Competency Skill Matrix
     */
    public function getSkillMatrix(Request $request)
    {
        $user = $request->user();
        
        $skills = SkillProgress::with('competency')
            ->where('user_id', $user->id)
            ->get();
            
        // Get all available competencies even if user hasn't started them
        $allCompetencies = \App\Models\Competency::all();
        
        $matrix = $allCompetencies->map(function ($comp) use ($skills) {
            $userSkill = $skills->where('competency_id', $comp->id)->first();
            return [
                'competency_id' => $comp->id,
                'competency_name' => $comp->name,
                'description' => $comp->description,
                'mastery_percentage' => $userSkill ? $userSkill->mastery_percentage : 0,
                'xp' => $userSkill ? $userSkill->xp : 0,
            ];
        });

        return response()->json([
            'data' => $matrix
        ]);
    }

    /**
     * Get Learning Paths
     */
    public function getLearningPaths(Request $request)
    {
        // For V2.0, we just group LearningPaths by Competency
        $competencies = \App\Models\Competency::with(['learningPaths.items'])->get();
        return response()->json(['data' => $competencies]);
    }

    /**
     * Start Pre Test (Generate 10 random questions)
     */
    public function startPreTest(Request $request)
    {
        $user = $request->user();

        // Check if user already completed pre test
        if ($user->has_completed_pre_test) {
            return response()->json(['message' => 'Anda sudah menyelesaikan Pre-Test'], 400);
        }

        // Check if there's an ongoing pre_test
        $attempt = Attempt::where('user_id', $user->id)
            ->where('type', 'pre_test')
            ->where('status', 'on-going')
            ->first();

        if (!$attempt) {
            $attempt = Attempt::create([
                'user_id' => $user->id,
                'type' => 'pre_test',
                'status' => 'on-going',
            ]);
        }

        // Get 10 random questions from QuestionBank
        $questions = QuestionBank::inRandomOrder()->take(10)->with(['options' => function($q) {
            $q->select('id', 'question_bank_id', 'option_text'); // Do not expose is_correct!
        }])->get();

        return response()->json([
            'data' => [
                'attempt_id' => $attempt->id,
                'questions' => $questions
            ]
        ]);
    }

    /**
     * Submit Pre Test Answers
     */
    public function submitPreTest(Request $request, $attemptId)
    {
        $user = $request->user();
        
        $request->validate([
            'answers' => 'required|array',
            'answers.*.question_bank_id' => 'required|exists:question_banks,id',
            'answers.*.question_option_id' => 'required|exists:question_options,id',
        ]);

        $attempt = Attempt::where('user_id', $user->id)->where('id', $attemptId)->firstOrFail();
        
        if ($attempt->status === 'completed') {
            return response()->json(['message' => 'Ujian sudah disubmit sebelumnya'], 400);
        }

        DB::beginTransaction();
        try {
            $correctCount = 0;
            $totalQuestions = count($request->answers);
            
            // Track mastery per category
            $categoryScores = [];

            foreach ($request->answers as $ans) {
                // Determine if correct
                $question = QuestionBank::with('options')->find($ans['question_bank_id']);
                $selectedOption = $question->options->where('id', $ans['question_option_id'])->first();
                $isCorrect = $selectedOption ? $selectedOption->is_correct : false;

                if ($isCorrect) {
                    $correctCount++;
                    // Add point to category score tracking
                    if (!isset($categoryScores[$question->competency_id])) {
                        $categoryScores[$question->competency_id] = ['correct' => 0, 'total' => 0];
                    }
                    $categoryScores[$question->competency_id]['correct']++;
                }

                if (!isset($categoryScores[$question->competency_id])) {
                    $categoryScores[$question->competency_id] = ['correct' => 0, 'total' => 0];
                }
                $categoryScores[$question->competency_id]['total']++;

                // Save answer record
                AttemptAnswer::create([
                    'attempt_id' => $attempt->id,
                    'question_bank_id' => $ans['question_bank_id'],
                    'question_option_id' => $ans['question_option_id'],
                    'is_correct' => $isCorrect
                ]);
            }

            $finalScore = $totalQuestions > 0 ? ($correctCount / $totalQuestions) * 100 : 0;

            $attempt->update([
                'status' => 'completed',
                'end_time' => now(),
                'score' => $finalScore
            ]);

            // Update Skill Progress based on category scores
            foreach ($categoryScores as $competencyId => $data) {
                $mastery = $data['total'] > 0 ? ($data['correct'] / $data['total']) * 100 : 0;
                
                // For pre-test, we just set the initial baseline
                SkillProgress::updateOrCreate(
                    ['user_id' => $user->id, 'competency_id' => $competencyId],
                    ['mastery_percentage' => $mastery] // Just a simple initial mapping
                );
            }

            DB::commit();

            return response()->json([
                'message' => 'Pre-Test berhasil disubmit',
                'data' => [
                    'score' => $finalScore
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Terjadi kesalahan sistem: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get Practice Categories
     */
    public function practiceCategories()
    {
        $categories = \App\Models\QuestionCategory::withCount('questionBanks')->get();
        return response()->json(['data' => $categories]);
    }

    /**
     * Start Practice
     */
    public function startPractice(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:question_categories,id'
        ]);

        $user = $request->user();

        $attempt = Attempt::create([
            'user_id' => $user->id,
            'type' => 'practice',
            'status' => 'on-going',
        ]);

        // Get 5 random questions for practice
        $questions = QuestionBank::where('question_category_id', $request->category_id)
            ->inRandomOrder()
            ->take(5)
            ->with(['options' => function($q) {
                $q->select('id', 'question_bank_id', 'option_text'); 
            }])->get();

        return response()->json([
            'data' => [
                'attempt_id' => $attempt->id,
                'questions' => $questions
            ]
        ]);
    }

    /**
     * Submit Practice
     */
    public function submitPractice(Request $request, $attemptId)
    {
        $user = $request->user();
        
        $request->validate([
            'answers' => 'required|array',
            'answers.*.question_bank_id' => 'required|exists:question_banks,id',
            'answers.*.question_option_id' => 'required|exists:question_options,id',
        ]);

        $attempt = Attempt::where('user_id', $user->id)->where('id', $attemptId)->where('type', 'practice')->firstOrFail();
        
        if ($attempt->status === 'completed') {
            return response()->json(['message' => 'Latihan sudah disubmit sebelumnya'], 400);
        }

        DB::beginTransaction();
        try {
            $correctCount = 0;
            $totalQuestions = count($request->answers);
            
            // To provide feedback on wrong answers during practice, we'll return the correct option ids
            $feedbacks = [];
            $xpGained = 0;

            foreach ($request->answers as $ans) {
                $question = QuestionBank::with('options')->find($ans['question_bank_id']);
                $selectedOption = $question->options->where('id', $ans['question_option_id'])->first();
                $isCorrect = $selectedOption ? $selectedOption->is_correct : false;

                if ($isCorrect) {
                    $correctCount++;
                    $xpGained += 5; // 5 XP per correct answer in practice
                }

                AttemptAnswer::create([
                    'attempt_id' => $attempt->id,
                    'question_bank_id' => $ans['question_bank_id'],
                    'question_option_id' => $ans['question_option_id'],
                    'is_correct' => $isCorrect
                ]);

                // Determine correct option for feedback
                $correctOption = $question->options->where('is_correct', true)->first();
                $feedbacks[] = [
                    'question_bank_id' => $question->id,
                    'is_correct' => $isCorrect,
                    'correct_option_id' => $correctOption ? $correctOption->id : null,
                    'explanation' => $question->explanation
                ];
            }

            $finalScore = $totalQuestions > 0 ? ($correctCount / $totalQuestions) * 100 : 0;

            $attempt->update([
                'status' => 'completed',
                'end_time' => now(),
                'score' => $finalScore
            ]);

            // Practice only gives XP, doesn't override mastery percentage
            if ($xpGained > 0 && isset($request->answers[0])) {
                $firstQuestion = QuestionBank::find($request->answers[0]['question_bank_id']);
                if ($firstQuestion && $firstQuestion->competency_id) {
                    $skillProgress = SkillProgress::firstOrCreate(
                        ['user_id' => $user->id, 'competency_id' => $firstQuestion->competency_id]
                    );
                    $skillProgress->increment('xp', $xpGained);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Latihan selesai',
                'data' => [
                    'score' => $finalScore,
                    'xp_gained' => $xpGained,
                    'feedbacks' => $feedbacks
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Terjadi kesalahan sistem: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Admin/Mentor: Add a new Question
     */
    public function storeQuestion(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'admin' && $user->role !== 'mentor') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'category_id' => 'required|exists:question_categories,id',
            'question_text' => 'required|string',
            'explanation' => 'nullable|string',
            'options' => 'required|array|min:4',
            'options.*.text' => 'required|string',
            'options.*.is_correct' => 'required|boolean',
        ]);

        // check if at least one is correct
        $hasCorrect = collect($request->options)->contains('is_correct', true);
        if (!$hasCorrect) {
            return response()->json(['message' => 'Minimal satu opsi jawaban harus benar.'], 400);
        }

        DB::beginTransaction();
        try {
            $question = QuestionBank::create([
                'question_category_id' => $request->category_id,
                'question_text' => $request->question_text,
                'explanation' => $request->explanation,
                'level' => 'beginner', // default
                'difficulty' => 1 // default
            ]);

            foreach ($request->options as $opt) {
                \App\Models\QuestionOption::create([
                    'question_bank_id' => $question->id,
                    'option_text' => $opt['text'],
                    'is_correct' => $opt['is_correct']
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Soal berhasil ditambahkan',
                'data' => $question->load('options')
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Terjadi kesalahan sistem: ' . $e->getMessage()], 500);
        }
    }
}
