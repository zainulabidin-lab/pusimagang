<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TaskChecklist;
use Illuminate\Http\Request;

class TaskChecklistController extends Controller
{
    public function store(Request $request, $taskId)
    {
        $validated = $request->validate([
            'description' => 'required|string',
        ]);

        $checklist = TaskChecklist::create([
            'task_id' => $taskId,
            'description' => $validated['description'],
            'is_completed' => false,
            'order' => TaskChecklist::where('task_id', $taskId)->max('order') + 1,
        ]);

        return response()->json(['data' => $checklist]);
    }

    public function toggle($taskId, $id)
    {
        $user = request()->user();
        $task = \App\Models\Task::where('id', $taskId)->where(function ($query) use ($user) {
            if ($user->role === 'intern') {
                $query->where('intern_id', $user->id)
                      ->orWhereHas('interns', function ($q) use ($user) {
                          $q->where('users.id', $user->id);
                      });
            } elseif ($user->role === 'mentor') {
                $query->where('mentor_id', $user->id);
            }
        })->first();

        if (!$task) {
            return response()->json(['message' => 'Task tidak ditemukan atau Anda tidak memiliki akses.'], 404);
        }

        $checklist = TaskChecklist::where('task_id', $taskId)->findOrFail($id);
        $checklist->is_completed = !$checklist->is_completed;
        $checklist->save();

        // Catat ke Timeline
        \App\Models\TaskLog::create([
            'task_id' => $taskId,
            'user_id' => request()->user()->id,
            'action' => 'checklist_checked',
            'details' => 'Menandai checklist: ' . $checklist->description,
        ]);

        return response()->json(['data' => $checklist]);
    }
}
