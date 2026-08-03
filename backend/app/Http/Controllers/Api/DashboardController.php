<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\DailyLogbook;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        $taskQuery = Task::query();
        $logbookQuery = DailyLogbook::query();

        if ($user->role === 'intern') {
            $taskQuery->where('intern_id', $user->id);
            $logbookQuery->where('intern_id', $user->id);
        } elseif ($user->role === 'mentor') {
            $taskQuery->where('mentor_id', $user->id);
            $logbookQuery->whereHas('intern.internProfile', function ($q) use ($user) {
                $q->where('mentor_id', $user->id);
            });
        }

        $lateQuery = clone $taskQuery;
        $activeCount = (clone $taskQuery)->whereIn('status', ['todo', 'progress'])->count();
        $reviewCount = (clone $taskQuery)->where('status', 'review')->count();
        $completedCount = (clone $taskQuery)->where('status', 'done')->count();
        $totalLogbooks = $logbookQuery->count();

        // New V1.1 Metrics
        $lateTasks = $lateQuery->where('deadline', '<', now()->format('Y-m-d'))
            ->where('status', '!=', 'done')
            ->count();

        // Weekly Deadlines for Interns
        $weeklyDeadlines = [];
        if ($user->role === 'intern') {
            $weeklyDeadlines = (clone $taskQuery)->where('status', '!=', 'done')
                ->whereNotNull('deadline')
                ->whereBetween('deadline', [now()->format('Y-m-d'), now()->addDays(7)->format('Y-m-d')])
                ->orderBy('deadline', 'asc')
                ->get(['id', 'title', 'deadline', 'status']);
        }

        // Mentor Interns Progress
        $internsProgress = [];
        if ($user->role === 'mentor') {
            $internsProgress = \App\Models\User::where('role', 'intern')
                ->whereHas('internProfile', function ($q) use ($user) {
                    $q->where('mentor_id', $user->id);
                })
                ->withCount([
                    'tasks as total_tasks',
                    'tasks as done_tasks' => function ($query) {
                        $query->where('status', 'done');
                    },
                    'tasks as review_tasks' => function ($query) {
                        $query->where('status', 'review');
                    }
                ])
                ->get()
                ->map(function ($intern) {
                    $progress = $intern->total_tasks > 0 ? round(($intern->done_tasks / $intern->total_tasks) * 100) : 0;
                    return [
                        'id' => $intern->id,
                        'name' => $intern->name,
                        'total_tasks' => $intern->total_tasks,
                        'review_tasks' => $intern->review_tasks,
                        'done_tasks' => $intern->done_tasks,
                        'progress_percentage' => $progress,
                    ];
                });
        }

        // Leaderboard for all users
        $leaderboard = \App\Models\User::where('role', 'intern')
            ->with('internProfile')
            ->get()
            ->map(function ($intern) {
                return [
                    'id' => $intern->id,
                    'name' => $intern->name,
                    'points' => $intern->internProfile ? $intern->internProfile->points : 0,
                    'badge' => $intern->internProfile ? $intern->internProfile->badge : null,
                ];
            })
            ->sortByDesc('points')
            ->take(5)
            ->values();

        return response()->json([
            'data' => [
                'active_tasks' => $activeCount,
                'review_tasks' => $reviewCount,
                'completed_tasks' => $completedCount,
                'late_tasks' => $lateTasks,
                'total_logbooks' => $totalLogbooks,
                'weekly_deadlines' => $weeklyDeadlines,
                'interns_progress' => $internsProgress,
                'leaderboard' => $leaderboard,
            ]
        ]);
    }
}
