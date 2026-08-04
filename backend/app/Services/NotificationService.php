<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use App\Models\Notification;
use Illuminate\Database\Eloquent\Collection;

class NotificationService implements BaseServiceInterface
{
    /**
     * Get recent notifications for a user.
     */
    public function getNotifications(User $user, int $limit = 20): Collection
    {
        return Notification::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->take($limit)
            ->get();
    }

    /**
     * Mark a specific notification as read.
     */
    public function markAsRead(User $user, int $notificationId): void
    {
        $notification = Notification::where('user_id', $user->id)->findOrFail($notificationId);
        $notification->update(['is_read' => true]);
    }

    /**
     * Mark all notifications as read for a user.
     */
    public function markAllAsRead(User $user): void
    {
        Notification::where('user_id', $user->id)->update(['is_read' => true]);
    }
}
