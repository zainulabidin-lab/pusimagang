<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TaskLog;
use App\Models\DailyLogbook;
use Illuminate\Http\Request;

class ActivityFeedController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // 1. Fetch TaskLogs
        $taskQuery = TaskLog::with(['user', 'task.intern']);
        if ($user->role === 'intern') {
            $taskQuery->whereHas('task', function($q) use ($user) {
                $q->where('intern_id', $user->id);
            });
        } elseif ($user->role === 'mentor') {
            $taskQuery->whereHas('task', function($q) use ($user) {
                $q->where('mentor_id', $user->id);
            });
        }
        $taskQuery->where('created_at', '>=', '2026-08-03 00:00:00');
        
        $taskLogs = $taskQuery->latest()->take(30)->get()->map(function($log) {
            return [
                'id' => 'task_log_' . $log->id,
                'type' => 'task',
                'actor' => $log->user ? $log->user->name : 'System',
                'target' => $log->task ? $log->task->title : 'Unknown Task',
                'action' => $log->action,
                'details' => $log->details,
                'created_at' => $log->created_at,
            ];
        });

        // 2. Fetch Logbooks
        $logbookQuery = DailyLogbook::with('intern');
        if ($user->role === 'intern') {
            $logbookQuery->where('intern_id', $user->id);
        } elseif ($user->role === 'mentor') {
            $logbookQuery->whereHas('intern.internProfile', function ($q) use ($user) {
                $q->where('mentor_id', $user->id);
            });
        }
        $logbookQuery->where('created_at', '>=', '2026-08-03 00:00:00');

        $logbooks = $logbookQuery->latest('created_at')->take(30)->get()->map(function($logbook) {
            $action = 'Submitted logbook';
            if ($logbook->status === 'approved') $action = 'Logbook approved';
            if ($logbook->status === 'rejected') $action = 'Logbook rejected';
            return [
                'id' => 'logbook_' . $logbook->id,
                'type' => 'logbook',
                'actor' => $logbook->intern ? $logbook->intern->name : 'Unknown',
                'target' => 'Logbook ' . $logbook->date->format('Y-m-d'),
                'action' => $action,
                'details' => strlen((string) $logbook->activity) > 100 ? substr((string) $logbook->activity, 0, 100) . '...' : $logbook->activity,
                'created_at' => $logbook->updated_at > $logbook->created_at ? $logbook->updated_at : $logbook->created_at,
            ];
        });

        // 3. Merge and Sort
        $merged = $taskLogs->concat($logbooks)->sortByDesc('created_at')->take(50)->values();

        return response()->json(['data' => $merged]);
    }
}
