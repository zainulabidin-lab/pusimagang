<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Determine if the given user can manage intern approvals.
     * We allow 'admin' and 'mentor' (non-interns) to manage based on previous logic.
     */
    public function manage(User $user): bool
    {
        return $user->role !== 'intern';
    }
}
