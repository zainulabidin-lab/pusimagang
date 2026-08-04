<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ReportService;
use App\Http\Resources\ReportResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

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
        // Add policy check later if needed, assume admin/mentor can access.
        $data = $this->reportService->generateInternReport($id);

        return response()->json([
            'data' => new ReportResource($data)
        ]);
    }
}
