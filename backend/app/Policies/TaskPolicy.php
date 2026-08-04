<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Task;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TaskPolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Task $task): bool
    {
        if ($user->role === 'intern') {
            return $task->intern_id === $user->id || $task->interns()->where('users.id', $user->id)->exists();
        }
        
        if ($user->role === 'mentor') {
            return $task->mentor_id === $user->id;
        }

        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Task $task): bool
    {
        return $this->view($user, $task);
    }
}
