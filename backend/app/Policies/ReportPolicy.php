<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;

class ReportPolicy
{
    /**
     * Determine if the user can view the given intern's report.
     *
     * @param User $user The authenticated user.
     * @param int $internId The ID of the intern whose report is being viewed.
     */
    public function view(User $user, int $internId): bool
    {
        // Admin can view all reports
        if ($user->role === 'admin') {
            return true;
        }

        // Intern can only view their own report
        if ($user->role === 'intern') {
            return $user->id === $internId;
        }

        // Mentor can only view reports of interns assigned to them
        if ($user->role === 'mentor') {
            $intern = User::with('internProfile')->find($internId);
            if ($intern && $intern->internProfile && $intern->internProfile->mentor_id === $user->id) {
                return true;
            }
        }

        return false;
    }
}
