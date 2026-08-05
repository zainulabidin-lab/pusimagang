<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Task;
use App\Models\TaskChecklist;
use App\Models\User;
use App\Models\TaskLog;
use App\Models\InternProfile;
use App\Models\SkillProgress;
use App\Models\Notification;
use App\Models\TaskTemplateItem;
use Illuminate\Support\Str;
use App\Exceptions\BusinessException;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Collection;

class TaskService implements BaseServiceInterface
{
    /**
     * Get all tasks for a user
     * 
     * @param User $user
     * @return Collection
     */
    public function getAllTasks(User $user): Collection
    {
        $query = Task::with(['interns', 'mentor', 'checklists', 'comments.user']);

        if ($user->role === 'intern') {
            $query->where('intern_id', $user->id)
                  ->orWhereHas('interns', function ($q) use ($user) {
                      $q->where('users.id', $user->id);
                  });
        } elseif ($user->role === 'mentor') {
            $query->where('mentor_id', $user->id);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    /**
     * Create a new task.
     *
     * @param User $user
     * @param array $data
     * @return Task
     * @throws BusinessException
     */
    public function storeTask(User $user, array $data): Task
    {
        $user->load('internProfile');
        $mentorId = $user->role === 'intern' ? $user->internProfile->mentor_id : $user->id;

        if (empty($mentorId)) {
            throw new BusinessException('Anda belum memiliki Mentor pembimbing. Silakan hubungi Admin.', 422);
        }

        return DB::transaction(function () use ($user, $mentorId, $data) {
            $task = Task::create([
                'title' => $data['title'],
                'description' => $data['description'] ?? '',
                'priority' => $data['priority'],
                'deadline' => $data['deadline'] ?? null,
                'mentor_id' => $mentorId,
                'intern_id' => $data['intern_ids'][0],
                'status' => 'todo',
                'competency_id' => $data['competency_id'] ?? null,
                'difficulty' => $data['difficulty'] ?? 'easy',
            ]);

            $task->interns()->attach($data['intern_ids']);

            if (!empty($data['template_id'])) {
                $templateItems = TaskTemplateItem::where('task_template_id', $data['template_id'])
                                    ->orderBy('order')->get();
                
                foreach ($templateItems as $item) {
                    TaskChecklist::create([
                        'task_id' => $task->id,
                        'description' => $item->description,
                        'is_completed' => false,
                        'order' => $item->order,
                    ]);
                }
            }

            TaskLog::create([
                'task_id' => $task->id,
                'user_id' => $user->id,
                'action' => 'created',
                'details' => 'Membuat task baru' . (!empty($data['template_id']) ? ' menggunakan template' : ''),
            ]);

            return $task->load(['interns', 'checklists']);
        });
    }

    /**
     * Update an existing task.
     *
     * @param Task $task
     * @param User $user
     * @param array $data
     * @return Task
     */
    public function updateTask(Task $task, User $user, array $data): Task
    {
        return DB::transaction(function () use ($task, $user, $data) {
            $task->update([
                'title' => $data['title'],
                'description' => $data['description'] ?? '',
                'priority' => $data['priority'],
                'deadline' => $data['deadline'] ?? null,
                'competency_id' => $data['competency_id'] ?? null,
                'difficulty' => $data['difficulty'] ?? 'easy',
            ]);

            if (isset($data['intern_ids'])) {
                $task->interns()->sync($data['intern_ids']);
            }

            TaskLog::create([
                'task_id' => $task->id,
                'user_id' => $user->id,
                'action' => 'updated',
                'details' => 'Memperbarui detail task',
            ]);

            return $task->load(['interns', 'checklists']);
        });
    }

    /**
     * Update task status and handle gamification.
     *
     * @param Task $task
     * @param string $status
     * @param User $user
     * @return void
     */
    public function updateTaskStatus(Task $task, string $status, User $user): void
    {
        $oldStatus = $task->status;
        $task->status = $status;
        $task->save();

        TaskLog::create([
            'task_id' => $task->id,
            'user_id' => $user->id,
            'action' => 'moved',
            'details' => $status,
        ]);

        if ($status === 'done' && $oldStatus !== 'done') {
            $this->applyGamification($task);
        } elseif ($status === 'review' && $oldStatus !== 'review') {
            Notification::create([
                'id' => (string) Str::uuid(),
                'user_id' => $task->mentor_id,
                'title' => 'Review Task',
                'message' => 'Anak magang telah mengajukan review untuk task "' . $task->title . '"',
                'type' => 'info'
            ]);
        }
    }

    /**
     * Apply gamification rules when a task is completed.
     *
     * @param Task $task
     * @return void
     */
    protected function applyGamification(Task $task): void
    {
        $internProfile = InternProfile::where('user_id', $task->intern_id)->first();
        if (!$internProfile) return;

        $internProfile->increment('points', 10);
        $points = $internProfile->points;

        if ($points >= 500) $internProfile->update(['badge' => 'Legend']);
        elseif ($points >= 250) $internProfile->update(['badge' => 'Expert']);
        elseif ($points >= 100) $internProfile->update(['badge' => 'Pro']);
        elseif ($points >= 50) $internProfile->update(['badge' => 'Rising Star']);
        
        $xpMsg = '';
        if ($task->competency_id) {
            $xpToAdd = $task->difficulty === 'hard' ? 50 : ($task->difficulty === 'medium' ? 25 : 10);
            $skillProgress = SkillProgress::firstOrCreate(
                ['user_id' => $task->intern_id, 'competency_id' => $task->competency_id]
            );
            $skillProgress->increment('xp', $xpToAdd);
            
            $newMastery = min(100, $skillProgress->mastery_percentage + ($xpToAdd * 0.1));
            $skillProgress->update(['mastery_percentage' => $newMastery]);
            
            $xpMsg = " dan +{$xpToAdd} XP Kompetensi";
        }

        Notification::create([
            'id' => (string) Str::uuid(),
            'user_id' => $task->intern_id,
            'title' => 'Task Disetujui! 🎉',
            'message' => 'Anda mendapatkan +10 Poin' . $xpMsg . ' karena menyelesaikan task "' . $task->title . '"',
            'type' => 'success'
        ]);
    }

    /**
     * Store a new checklist item.
     *
     * @param Task $task
     * @param string $description
     * @return TaskChecklist
     */
    public function storeChecklist(Task $task, string $description): TaskChecklist
    {
        return TaskChecklist::create([
            'task_id' => $task->id,
            'description' => $description,
            'is_completed' => false,
            'order' => TaskChecklist::where('task_id', $task->id)->max('order') + 1,
        ]);
    }

    /**
     * Toggle checklist completion.
     *
     * @param TaskChecklist $checklist
     * @param User $user
     * @return TaskChecklist
     */
    public function toggleChecklist(TaskChecklist $checklist, User $user): TaskChecklist
    {
        $checklist->is_completed = !$checklist->is_completed;
        $checklist->save();

        TaskLog::create([
            'task_id' => $checklist->task_id,
            'user_id' => $user->id,
            'action' => 'checklist_checked',
            'details' => 'Menandai checklist: ' . $checklist->description,
        ]);

        return $checklist;
    }
}
