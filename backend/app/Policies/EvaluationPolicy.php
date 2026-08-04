<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;

class EvaluationPolicy
{
    /**
     * Determine whether the user can create an evaluation.
     */
    public function create(User $user): bool
    {
        return in_array($user->role, ['mentor', 'admin'], true);
    }
}
