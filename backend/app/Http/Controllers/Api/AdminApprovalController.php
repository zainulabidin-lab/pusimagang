<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\InternService;
use App\Http\Requests\Intern\ApproveInternRequest;
use App\Http\Resources\InternResource;
use Illuminate\Http\JsonResponse;

class AdminApprovalController extends Controller
{
    protected InternService $internService;

    public function __construct(InternService $internService)
    {
        $this->internService = $internService;
    }

    /**
     * Get all pending interns.
     */
    public function pendingInterns(): JsonResponse
    {
        $this->authorize('manage', User::class);

        $interns = $this->internService->getPendingInterns();

        return response()->json([
            'data' => InternResource::collection($interns)
        ]);
    }

    /**
     * Approve an intern.
     */
    public function approveIntern(ApproveInternRequest $request, int $id): JsonResponse
    {
        $this->authorize('manage', User::class);

        $user = User::findOrFail($id);
        
        $this->internService->approveIntern($user, $request->validated());

        return response()->json([
            'message' => 'Akun berhasil disetujui.'
        ]);
    }

    /**
     * Reject an intern.
     */
    public function rejectIntern(int $id): JsonResponse
    {
        $this->authorize('manage', User::class);

        $user = User::findOrFail($id);
        
        $this->internService->rejectIntern($user);

        return response()->json([
            'message' => 'Akun berhasil ditolak dan dihapus.'
        ]);
    }
}
