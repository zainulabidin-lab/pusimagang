<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TaskLog;
use Illuminate\Http\Request;

class ActivityFeedController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = TaskLog::with(['user', 'task.intern']);

        if ($user->role === 'intern') {
            $query->whereHas('task', function($q) use ($user) {
                $q->where('intern_id', $user->id);
            });
        } elseif ($user->role === 'mentor') {
            $query->whereHas('task', function($q) use ($user) {
                $q->where('mentor_id', $user->id);
            });
        }

        $logs = $query->latest()->take(20)->get();

        return response()->json(['data' => $logs]);
    }
}
