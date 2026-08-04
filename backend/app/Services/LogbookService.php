<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\DailyLogbook;
use App\Models\User;
use App\Models\InternProfile;
use App\Models\Notification;
use Illuminate\Http\UploadedFile;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class LogbookService implements BaseServiceInterface
{
    /**
     * Get all logbooks for a user.
     *
     * @param User $user
     * @return Collection
     */
    public function getAllLogbooks(User $user): Collection
    {
        $query = DailyLogbook::with('intern');
        
        if ($user->role === 'intern') {
            $query->where('intern_id', $user->id);
        } elseif ($user->role === 'mentor') {
            $query->whereHas('intern.internProfile', function ($q) use ($user) {
                $q->where('mentor_id', $user->id);
            });
        }

        return $query->orderBy('date', 'desc')->get();
    }

    /**
     * Store a newly created logbook.
     *
     * @param User $user
     * @param array $data
     * @param UploadedFile|null $file
     * @return DailyLogbook
     */
    public function storeLogbook(User $user, array $data, ?UploadedFile $file): DailyLogbook
    {
        return DB::transaction(function () use ($user, $data, $file) {
            $data['time'] = $data['start_time'];
            $data['intern_id'] = $user->id;

            if ($file) {
                $path = $file->store('logbooks', 'public');
                $data['documentation_path'] = '/storage/' . $path;
            }

            $logbook = DailyLogbook::create($data);

            $this->applyGamification($user);

            return $logbook;
        });
    }

    /**
     * Approve or reject a logbook.
     *
     * @param DailyLogbook $logbook
     * @param string $status
     * @param string|null $mentorNotes
     * @return DailyLogbook
     */
    public function approveLogbook(DailyLogbook $logbook, string $status, ?string $mentorNotes): DailyLogbook
    {
        $logbook->update([
            'status' => $status,
            'mentor_notes' => $mentorNotes
        ]);

        $statusText = $status === 'approved' ? 'Disetujui' : 'Ditolak';
        Notification::create([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'user_id' => $logbook->intern_id,
            'title' => 'Status Logbook Diperbarui',
            'message' => "Logbook tanggal {$logbook->date->format('d M Y')} telah {$statusText} oleh Mentor.",
            'type' => 'task_approved',
            'link' => '/logbook'
        ]);

        return $logbook;
    }

    /**
     * Apply gamification for filling a logbook.
     *
     * @param User $user
     * @return void
     */
    protected function applyGamification(User $user): void
    {
        $internProfile = InternProfile::where('user_id', $user->id)->first();
        if (!$internProfile) {
            return;
        }

        $internProfile->increment('points', 2);
        
        $points = $internProfile->points;
        if ($points >= 500) $internProfile->update(['badge' => 'Legend']);
        elseif ($points >= 250) $internProfile->update(['badge' => 'Expert']);
        elseif ($points >= 100) $internProfile->update(['badge' => 'Pro']);
        elseif ($points >= 50) $internProfile->update(['badge' => 'Rising Star']);
    }
}
