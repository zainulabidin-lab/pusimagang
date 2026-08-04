<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;
use App\Models\Attempt;

class AttemptPolicy
{
    /**
     * Determine whether the user can submit an attempt.
     */
    public function submit(User $user, Attempt $attempt): bool
    {
        return $user->id === $attempt->user_id;
    }
}
