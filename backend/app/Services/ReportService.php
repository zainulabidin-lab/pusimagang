<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use App\Models\Evaluation;
use App\Models\DailyLogbook;
use App\Models\Task;

class ReportService implements BaseServiceInterface
{
    /**
     * Generate a comprehensive report for an intern.
     */
    public function generateInternReport(int $internId): array
    {
        // Fetch Intern Profile
        $intern = User::where('role', 'intern')
            ->with(['internProfile'])
            ->findOrFail($internId);

        // Mentor logic (from InternProfile)
        $mentorId = $intern->internProfile ? $intern->internProfile->mentor_id : null;
        $mentor = null;
        if ($mentorId) {
            $mentor = User::with(['mentorProfile.division'])->find($mentorId);
        }

        // Fetch Final Evaluation
        $evaluation = Evaluation::where('intern_id', $intern->id)->first();

        // Fetch Approved Logbooks
        $logbooks = DailyLogbook::where('intern_id', $intern->id)
            ->where('status', 'approved')
            ->orderBy('date', 'asc')
            ->get(['id', 'date', 'activity', 'mentor_notes', 'created_at']);

        // Fetch Tasks Summary
        $totalTasks = Task::where('intern_id', $intern->id)->count();
        $doneTasks = Task::where('intern_id', $intern->id)->where('status', 'done')->count();

        return [
            'intern' => $intern->toArray(),
            'mentor' => $mentor ? $mentor->toArray() : null,
            'evaluation' => $evaluation ? $evaluation->toArray() : null,
            'logbooks' => $logbooks->toArray(),
            'tasks_summary' => [
                'total' => $totalTasks,
                'done' => $doneTasks,
            ],
        ];
    }
}
