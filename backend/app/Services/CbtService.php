<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use App\Models\Attempt;
use App\Models\QuestionBank;
use App\Models\QuestionOption;
use App\Models\AttemptAnswer;
use App\Models\SkillProgress;
use App\Exceptions\BusinessException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class CbtService implements BaseServiceInterface
{
    /**
     * Start a new pre-test attempt.
     *
     * @param User $user
     * @return array
     * @throws BusinessException
     */
    public function startPreTest(User $user): array
    {
        if ($user->has_completed_pre_test) {
            throw new BusinessException('Anda sudah menyelesaikan Pre-Test', 400);
        }

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

        $questions = QuestionBank::inRandomOrder()->take(10)->with('options')->get();

        return [
            'attempt' => $attempt,
            'questions' => $questions
        ];
    }

    /**
     * Submit pre-test attempt.
     *
     * @param User $user
     * @param Attempt $attempt
     * @param array $answers
     * @return array
     * @throws BusinessException
     */
    public function submitPreTest(User $user, Attempt $attempt, array $answers): array
    {
        if ($attempt->status === 'completed') {
            throw new BusinessException('Ujian sudah disubmit sebelumnya', 400);
        }

        return DB::transaction(function () use ($user, $attempt, $answers) {
            $correctCount = 0;
            $totalQuestions = count($answers);
            $categoryScores = [];

            foreach ($answers as $ans) {
                $question = QuestionBank::with('options')->find($ans['question_bank_id']);
                $selectedOption = $question->options->where('id', $ans['question_option_id'])->first();
                $isCorrect = $selectedOption ? $selectedOption->is_correct : false;

                if ($isCorrect) {
                    $correctCount++;
                    if (!isset($categoryScores[$question->competency_id])) {
                        $categoryScores[$question->competency_id] = ['correct' => 0, 'total' => 0];
                    }
                    $categoryScores[$question->competency_id]['correct']++;
                }

                if (!isset($categoryScores[$question->competency_id])) {
                    $categoryScores[$question->competency_id] = ['correct' => 0, 'total' => 0];
                }
                $categoryScores[$question->competency_id]['total']++;

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

            foreach ($categoryScores as $competencyId => $data) {
                if ($competencyId) {
                    $mastery = $data['total'] > 0 ? ($data['correct'] / $data['total']) * 100 : 0;
                    SkillProgress::updateOrCreate(
                        ['user_id' => $user->id, 'competency_id' => $competencyId],
                        ['mastery_percentage' => $mastery]
                    );
                }
            }

            return ['score' => $finalScore];
        });
    }

    /**
     * Start a new practice attempt.
     *
     * @param User $user
     * @param int|string $categoryId
     * @return array
     */
    public function startPractice(User $user, $categoryId): array
    {
        $attempt = Attempt::create([
            'user_id' => $user->id,
            'type' => 'practice',
            'status' => 'on-going',
        ]);

        $questions = QuestionBank::where('question_category_id', $categoryId)
            ->inRandomOrder()
            ->take(5)
            ->with('options')->get();

        return [
            'attempt' => $attempt,
            'questions' => $questions
        ];
    }

    /**
     * Submit practice attempt.
     *
     * @param User $user
     * @param Attempt $attempt
     * @param array $answers
     * @return array
     * @throws BusinessException
     */
    public function submitPractice(User $user, Attempt $attempt, array $answers): array
    {
        if ($attempt->status === 'completed') {
            throw new BusinessException('Latihan sudah disubmit sebelumnya', 400);
        }

        return DB::transaction(function () use ($user, $attempt, $answers) {
            $correctCount = 0;
            $totalQuestions = count($answers);
            $feedbacks = [];
            $xpGained = 0;

            foreach ($answers as $ans) {
                $question = QuestionBank::with('options')->find($ans['question_bank_id']);
                $selectedOption = $question->options->where('id', $ans['question_option_id'])->first();
                $isCorrect = $selectedOption ? $selectedOption->is_correct : false;

                if ($isCorrect) {
                    $correctCount++;
                    $xpGained += 5;
                }

                AttemptAnswer::create([
                    'attempt_id' => $attempt->id,
                    'question_bank_id' => $ans['question_bank_id'],
                    'question_option_id' => $ans['question_option_id'],
                    'is_correct' => $isCorrect
                ]);

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

            if ($xpGained > 0 && isset($answers[0])) {
                $firstQuestion = QuestionBank::find($answers[0]['question_bank_id']);
                if ($firstQuestion && $firstQuestion->competency_id) {
                    $skillProgress = SkillProgress::firstOrCreate(
                        ['user_id' => $user->id, 'competency_id' => $firstQuestion->competency_id]
                    );
                    $skillProgress->increment('xp', $xpGained);
                }
            }

            return [
                'score' => $finalScore,
                'xp_gained' => $xpGained,
                'feedbacks' => $feedbacks
            ];
        });
    }

    /**
     * Store a new question in the QuestionBank.
     *
     * @param array $data
     * @return QuestionBank
     * @throws BusinessException
     */
    public function storeQuestion(array $data): QuestionBank
    {
        $hasCorrect = collect($data['options'])->contains('is_correct', true);
        if (!$hasCorrect) {
            throw new BusinessException('Minimal satu opsi jawaban harus benar.', 400);
        }

        return DB::transaction(function () use ($data) {
            $question = QuestionBank::create([
                'question_category_id' => $data['category_id'],
                'question_text' => $data['question_text'],
                'explanation' => $data['explanation'] ?? null,
                'level' => 'beginner',
                'difficulty' => 1
            ]);

            foreach ($data['options'] as $opt) {
                QuestionOption::create([
                    'question_bank_id' => $question->id,
                    'option_text' => $opt['text'],
                    'is_correct' => $opt['is_correct']
                ]);
            }

            return $question->load('options');
        });
    }
}
