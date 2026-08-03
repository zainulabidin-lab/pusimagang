<?php

namespace App\Services;

use App\Repositories\TaskRepository;
use App\Models\TaskTemplate;
use Illuminate\Support\Facades\DB;
use App\Models\TaskChecklist;
use App\Models\TaskLog;

class TaskService
{
    protected $taskRepo;

    public function __construct(TaskRepository $taskRepo)
    {
        $this->taskRepo = $taskRepo;
    }

    public function getAllTasks($user)
    {
        return $this->taskRepo->getTasksByUserRole($user);
    }

    public function createTaskFromTemplate(array $data, $templateId, $userId)
    {
        return DB::transaction(function () use ($data, $templateId, $userId) {
            $task = $this->taskRepo->create($data);
            
            if ($templateId) {
                $template = TaskTemplate::with('items')->find($templateId);
                if ($template) {
                    foreach ($template->items as $item) {
                        TaskChecklist::create([
                            'task_id' => $task->id,
                            'description' => $item->description,
                            'order' => $item->order
                        ]);
                    }
                }
            }

            TaskLog::create([
                'task_id' => $task->id,
                'user_id' => $userId,
                'action' => 'created',
                'details' => 'Task berhasil dibuat'
            ]);

            return $task->load('checklists');
        });
    }

    public function moveKanbanTask($taskId, $newStatus, $userId)
    {
        $task = $this->taskRepo->find($taskId);
        $oldStatus = $task->status;
        $task->status = $newStatus;
        $task->save();

        TaskLog::create([
            'task_id' => $task->id,
            'user_id' => $userId,
            'action' => 'moved',
            'details' => "Task dipindah dari $oldStatus ke $newStatus"
        ]);

        return $task;
    }

    public function checkChecklist($checklistId, $isCompleted, $userId)
    {
        $checklist = TaskChecklist::findOrFail($checklistId);
        $checklist->is_completed = $isCompleted;
        $checklist->save();

        $task = $this->taskRepo->find($checklist->task_id);
        
        // Auto-progress calculation logic can be added here
        
        TaskLog::create([
            'task_id' => $task->id,
            'user_id' => $userId,
            'action' => 'checklist_checked',
            'details' => "Checklist: {$checklist->description} ditandai " . ($isCompleted ? 'selesai' : 'belum selesai')
        ]);

        return $task->load('checklists');
    }
}
