<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = Notification::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->take(20)
            ->get();
        return response()->json(['data' => $notifications]);
    }

    public function markAsRead(Request $request, $id)
    {
        $notification = Notification::where('user_id', $request->user()->id)->findOrFail($id);
        $notification->update(['is_read' => true]);
        return response()->json(['message' => 'Tandai dibaca']);
    }

    public function markAllAsRead(Request $request)
    {
        Notification::where('user_id', $request->user()->id)->update(['is_read' => true]);
        return response()->json(['message' => 'Semua ditandai dibaca']);
    }
}
