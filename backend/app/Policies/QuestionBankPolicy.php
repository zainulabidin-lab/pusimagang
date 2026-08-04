<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;
use App\Models\QuestionBank;

class QuestionBankPolicy
{
    /**
     * Determine whether the user can create a question.
     */
    public function create(User $user): bool
    {
        return in_array($user->role, ['mentor', 'admin'], true);
    }
}
