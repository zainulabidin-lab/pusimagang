<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DailyLogbook;
use App\Services\LogbookService;
use App\Http\Requests\Logbook\StoreLogbookRequest;
use App\Http\Requests\Logbook\ApproveLogbookRequest;
use App\Http\Resources\LogbookResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class LogbookController extends Controller
{
    /**
     * @var LogbookService
     */
    protected LogbookService $logbookService;

    /**
     * LogbookController constructor.
     *
     * @param LogbookService $logbookService
     */
    public function __construct(LogbookService $logbookService)
    {
        $this->logbookService = $logbookService;
    }

    /**
     * Display a listing of the logbooks.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $logbooks = $this->logbookService->getAllLogbooks($request->user());
        return $this->sendSuccess(LogbookResource::collection($logbooks));
    }

    /**
     * Store a newly created logbook in storage.
     *
     * @param StoreLogbookRequest $request
     * @return JsonResponse
     */
    public function store(StoreLogbookRequest $request): JsonResponse
    {
        $logbook = $this->logbookService->storeLogbook(
            $request->user(), 
            $request->validated(), 
            $request->file('documentation_photo')
        );

        return $this->sendSuccess(new LogbookResource($logbook), 'Logbook berhasil disimpan', 201);
    }

    /**
     * Approve or reject a logbook.
     *
     * @param ApproveLogbookRequest $request
     * @param int|string $id
     * @return JsonResponse
     */
    public function approve(ApproveLogbookRequest $request, $id): JsonResponse
    {
        $logbook = DailyLogbook::findOrFail($id);

        $this->authorize('approve', $logbook);

        $updatedLogbook = $this->logbookService->approveLogbook(
            $logbook,
            $request->validated('status'),
            $request->validated('mentor_notes')
        );

        return $this->sendSuccess(new LogbookResource($updatedLogbook), 'Logbook status updated');
    }
}
