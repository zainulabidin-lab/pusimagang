<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attempt;
use App\Models\QuestionBank;
use App\Models\SkillProgress;
use App\Services\CbtService;
use App\Http\Requests\Cbt\StartPracticeRequest;
use App\Http\Requests\Cbt\SubmitAttemptRequest;
use App\Http\Requests\Cbt\StoreQuestionRequest;
use App\Http\Resources\QuestionResource;
use App\Http\Resources\AttemptResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CompetencyController extends Controller
{
    protected CbtService $cbtService;

    public function __construct(CbtService $cbtService)
    {
        $this->cbtService = $cbtService;
    }

    /**
     * Get Competency Overview Stats
     */
    public function getOverview(Request $request): JsonResponse
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
                    'average_mastery' => round((float)$averageMastery),
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
        $modulesLearned = $skillProgress->count();

        return response()->json([
            'data' => [
                'role' => $user->role,
                'average_mastery' => round((float)$averageMastery),
                'total_xp' => $totalXp,
                'modules_learned' => $modulesLearned
            ]
        ]);
    }

    /**
     * Get Competency Skill Matrix
     */
    public function getSkillMatrix(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $skills = SkillProgress::with('competency')
            ->where('user_id', $user->id)
            ->get();
            
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
    public function getLearningPaths(Request $request): JsonResponse
    {
        $competencies = \App\Models\Competency::with(['learningPaths.items'])->get();
        return response()->json(['data' => $competencies]);
    }

    /**
     * Start Pre Test
     */
    public function startPreTest(Request $request): JsonResponse
    {
        $result = $this->cbtService->startPreTest($request->user());

        return response()->json([
            'data' => [
                'attempt_id' => $result['attempt']->id,
                'questions' => QuestionResource::collection($result['questions'])
            ]
        ]);
    }

    /**
     * Submit Pre Test Answers
     */
    public function submitPreTest(SubmitAttemptRequest $request, $attemptId): JsonResponse
    {
        $attempt = Attempt::where('user_id', $request->user()->id)->findOrFail($attemptId);
        
        $this->authorize('submit', $attempt);

        $result = $this->cbtService->submitPreTest(
            $request->user(), 
            $attempt, 
            $request->validated('answers')
        );

        return response()->json([
            'message' => 'Pre-Test berhasil disubmit',
            'data' => $result
        ]);
    }

    /**
     * Get Practice Categories
     */
    public function practiceCategories(): JsonResponse
    {
        $categories = \App\Models\QuestionCategory::withCount('questionBanks')->get();
        return response()->json(['data' => $categories]);
    }

    /**
     * Start Practice
     */
    public function startPractice(StartPracticeRequest $request): JsonResponse
    {
        $result = $this->cbtService->startPractice(
            $request->user(), 
            $request->validated('category_id')
        );

        return response()->json([
            'data' => [
                'attempt_id' => $result['attempt']->id,
                'questions' => QuestionResource::collection($result['questions'])
            ]
        ]);
    }

    /**
     * Submit Practice
     */
    public function submitPractice(SubmitAttemptRequest $request, $attemptId): JsonResponse
    {
        $attempt = Attempt::where('user_id', $request->user()->id)
            ->where('type', 'practice')
            ->findOrFail($attemptId);

        $this->authorize('submit', $attempt);

        $result = $this->cbtService->submitPractice(
            $request->user(), 
            $attempt, 
            $request->validated('answers')
        );

        return response()->json([
            'message' => 'Latihan selesai',
            'data' => $result
        ]);
    }

    /**
     * Admin/Mentor: Add a new Question
     */
    public function storeQuestion(StoreQuestionRequest $request): JsonResponse
    {
        $this->authorize('create', QuestionBank::class);

        $question = $this->cbtService->storeQuestion($request->validated());

        return response()->json([
            'message' => 'Soal berhasil ditambahkan',
            // Return raw data for admin context to see is_correct mappings
            'data' => $question
        ]);
    }
}
