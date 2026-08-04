<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Services\TaskService;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    protected $taskService;

    public function __construct(TaskService $taskService)
    {
        $this->taskService = $taskService;
    }

    public function index(Request $request)
    {
        $tasks = $this->taskService->getAllTasks($request->user());
        return response()->json(['data' => $tasks]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:low,medium,high',
            'deadline' => 'nullable|date',
            'intern_ids' => 'required|array|min:1',
            'intern_ids.*' => 'exists:users,id',
            'template_id' => 'nullable|exists:task_templates,id',
            'competency_id' => 'nullable|exists:competencies,id',
            'difficulty' => 'nullable|in:easy,medium,hard',
        ]);

        $user = clone $request->user();
        $user->load('internProfile');

        $mentorId = $user->role === 'intern' ? $user->internProfile->mentor_id : $user->id;

        if (empty($mentorId)) {
            return response()->json([
                'message' => 'Anda belum memiliki Mentor pembimbing. Silakan hubungi Admin.'
            ], 422);
        }

        $task = Task::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? '',
            'priority' => $validated['priority'],
            'deadline' => $validated['deadline'] ?? null,
            'mentor_id' => $mentorId,
            'intern_id' => $validated['intern_ids'][0], // Use first intern as primary
            'status' => 'todo',
            'competency_id' => $validated['competency_id'] ?? null,
            'difficulty' => $validated['difficulty'] ?? 'easy',
        ]);

        // Attach all selected interns
        $task->interns()->attach($validated['intern_ids']);

        // Auto-generate checklist from template if provided
        if (!empty($validated['template_id'])) {
            $templateItems = \App\Models\TaskTemplateItem::where('task_template_id', $validated['template_id'])
                                ->orderBy('order')->get();
            
            foreach ($templateItems as $item) {
                \App\Models\TaskChecklist::create([
                    'task_id' => $task->id,
                    'description' => $item->description,
                    'is_completed' => false,
                    'order' => $item->order,
                ]);
            }
        }

        \App\Models\TaskLog::create([
            'task_id' => $task->id,
            'user_id' => $user->id,
            'action' => 'created',
            'details' => 'Membuat task baru' . (!empty($validated['template_id']) ? ' menggunakan template' : ''),
        ]);

        return response()->json(['data' => $task], 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $user = $request->user();
        
        $task = Task::where('id', $id)->where(function ($query) use ($user) {
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
        
        $request->validate([
            'status' => 'required|in:todo,progress,review,done'
        ]);

        $oldStatus = $task->status;
        $task->status = $request->input('status');
        $task->save();

        \App\Models\TaskLog::create([
            'task_id' => $task->id,
            'user_id' => $request->user()->id,
            'action' => 'moved',
            'details' => $task->status,
        ]);

        // Gamification: Add points if task is done and wasn't done before
        if ($task->status === 'done' && $oldStatus !== 'done') {
            $internProfile = \App\Models\InternProfile::where('user_id', $task->intern_id)->first();
            if ($internProfile) {
                $internProfile->increment('points', 10);
                
                // Update badge based on points
                $points = $internProfile->points;
                if ($points >= 500) $internProfile->update(['badge' => 'Legend']);
                elseif ($points >= 250) $internProfile->update(['badge' => 'Expert']);
                elseif ($points >= 100) $internProfile->update(['badge' => 'Pro']);
                elseif ($points >= 50) $internProfile->update(['badge' => 'Rising Star']);
                
                // Add Mastery XP if task is linked to a competency
                $xpMsg = '';
                if ($task->competency_id) {
                    $xpToAdd = $task->difficulty === 'hard' ? 50 : ($task->difficulty === 'medium' ? 25 : 10);
                    $skillProgress = \App\Models\SkillProgress::firstOrCreate(
                        ['user_id' => $task->intern_id, 'competency_id' => $task->competency_id]
                    );
                    $skillProgress->increment('xp', $xpToAdd);
                    
                    // Slightly increase mastery percentage based on XP (diminishing returns logic could be here, for now just simple addition up to 100)
                    $newMastery = min(100, $skillProgress->mastery_percentage + ($xpToAdd * 0.1));
                    $skillProgress->update(['mastery_percentage' => $newMastery]);
                    
                    $xpMsg = " dan +{$xpToAdd} XP Kompetensi";
                }

                \App\Models\Notification::create([
                    'id' => (string) \Illuminate\Support\Str::uuid(),
                    'user_id' => $task->intern_id,
                    'title' => 'Task Disetujui! 🎉',
                    'message' => 'Anda mendapatkan +10 Poin' . $xpMsg . ' karena menyelesaikan task "' . $task->title . '"',
                    'type' => 'success'
                ]);
            }
        } elseif ($task->status === 'review' && $oldStatus !== 'review') {
            \App\Models\Notification::create([
                'id' => (string) \Illuminate\Support\Str::uuid(),
                'user_id' => $task->mentor_id,
                'title' => 'Review Task',
                'message' => 'Anak magang telah mengajukan review untuk task "' . $task->title . '"',
                'type' => 'info'
            ]);
        }

        return response()->json(['message' => 'Status updated']);
    }
}
