<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\NotificationService;
use App\Http\Resources\NotificationResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    protected NotificationService $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Get user notifications.
     */
    public function index(Request $request): JsonResponse
    {
        $notifications = $this->notificationService->getNotifications($request->user());

        return response()->json([
            'data' => NotificationResource::collection($notifications)
        ]);
    }

    /**
     * Mark a notification as read.
     */
    public function markAsRead(Request $request, int $id): JsonResponse
    {
        $this->notificationService->markAsRead($request->user(), $id);

        return response()->json([
            'message' => 'Tandai dibaca'
        ]);
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        $this->notificationService->markAllAsRead($request->user());

        return response()->json([
            'message' => 'Semua ditandai dibaca'
        ]);
    }
}
