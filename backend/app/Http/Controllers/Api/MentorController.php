<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\MentorService;
use App\Http\Resources\MentorResource;
use Illuminate\Http\JsonResponse;

class MentorController extends Controller
{
    protected MentorService $mentorService;

    public function __construct(MentorService $mentorService)
    {
        $this->mentorService = $mentorService;
    }

    /**
     * Get a list of all active mentors.
     */
    public function index(): JsonResponse
    {
        $mentors = $this->mentorService->getAllMentors();

        return response()->json([
            'data' => MentorResource::collection($mentors)
        ]);
    }
}
