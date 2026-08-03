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
