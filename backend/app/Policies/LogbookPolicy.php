<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\DailyLogbook;
use App\Models\User;
use App\Models\InternProfile;

class LogbookPolicy
{
    /**
     * Determine whether the user can approve the logbook.
     */
    public function approve(User $user, DailyLogbook $logbook): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        if ($user->role === 'mentor') {
            return InternProfile::where('user_id', $logbook->intern_id)
                ->where('mentor_id', $user->id)
                ->exists();
        }

        return false;
    }
}
