<?php

namespace App\Repositories;

use App\Models\Task;

class TaskRepository extends BaseRepository
{
    public function __construct(Task $task)
    {
        parent::__construct($task);
    }

    public function getTasksByUserRole($user)
    {
        $query = $this->model->with(['intern', 'interns', 'mentor', 'checklists']);
        
        if ($user->role === 'intern') {
            $query->where(function ($q) use ($user) {
                $q->where('intern_id', $user->id)
                  ->orWhereHas('interns', function ($query) use ($user) {
                      $query->where('users.id', $user->id);
                  });
            });
        } elseif ($user->role === 'mentor') {
            $query->where('mentor_id', $user->id);
        }

        return $query->get();
    }
}
