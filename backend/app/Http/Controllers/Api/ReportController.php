<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ReportService;
use App\Http\Resources\ReportResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class ReportController extends Controller
{
    protected ReportService $reportService;

    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    /**
     * Get comprehensive intern report.
     */
    public function getInternReport(Request $request, int $id): JsonResponse
    {
        Gate::authorize('view-report', $id);

        $data = $this->reportService->generateInternReport($id);

        return response()->json([
            'data' => new ReportResource($data)
        ]);
    }
}
