<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AssessmentService;
use App\Http\Requests\Assessment\StoreEvaluationRequest;
use App\Http\Resources\EvaluationResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Evaluation;

class EvaluationController extends Controller
{
    /**
     * @var AssessmentService
     */
    protected AssessmentService $assessmentService;

    /**
     * EvaluationController constructor.
     *
     * @param AssessmentService $assessmentService
     */
    public function __construct(AssessmentService $assessmentService)
    {
        $this->assessmentService = $assessmentService;
    }

    /**
     * Display a listing of evaluations.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $evaluations = $this->assessmentService->getAllEvaluations($request->user());
        return $this->sendSuccess(EvaluationResource::collection($evaluations));
    }

    /**
     * Store a newly created evaluation in storage.
     *
     * @param StoreEvaluationRequest $request
     * @return JsonResponse
     */
    public function store(StoreEvaluationRequest $request): JsonResponse
    {
        $this->authorize('create', Evaluation::class);

        $evaluation = $this->assessmentService->storeEvaluation(
            $request->user(), 
            $request->validated()
        );

        return $this->sendSuccess(new EvaluationResource($evaluation), 'Penilaian berhasil disimpan', 201);
    }
}
