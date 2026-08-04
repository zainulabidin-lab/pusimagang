<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class MentorService implements BaseServiceInterface
{
    /**
     * Get all active mentors with their profiles and divisions.
     */
    public function getAllMentors(): Collection
    {
        return User::where('role', 'mentor')
            ->where('is_approved', true) // assuming mentors are approved
            ->with(['mentorProfile.division'])
            ->get();
    }
}
