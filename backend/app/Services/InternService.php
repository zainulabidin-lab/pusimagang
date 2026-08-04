<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use App\Exceptions\BusinessException;

class InternService implements BaseServiceInterface
{
    /**
     * Get list of pending interns waiting for approval.
     */
    public function getPendingInterns(): Collection
    {
        return User::where('role', 'intern')
            ->where('is_approved', false)
            ->with(['internProfile'])
            ->get();
    }

    /**
     * Approve an intern and assign mentor and division.
     */
    public function approveIntern(User $intern, array $data): void
    {
        if ($intern->is_approved) {
            throw new BusinessException('Akun siswa magang sudah disetujui sebelumnya.', 400);
        }

        DB::transaction(function () use ($intern, $data) {
            $intern->is_approved = true;
            $intern->save();

            if ($intern->internProfile) {
                $intern->internProfile->mentor_id = $data['mentor_id'];
                $intern->internProfile->division_id = $data['division_id'];
                $intern->internProfile->save();
            }
        });
    }

    /**
     * Reject and delete a pending intern.
     */
    public function rejectIntern(User $intern): void
    {
        if ($intern->is_approved) {
            throw new BusinessException('Siswa magang yang sudah aktif tidak bisa ditolak.', 400);
        }

        DB::transaction(function () use ($intern) {
            if ($intern->internProfile) {
                $intern->internProfile->delete();
            }
            $intern->delete();
        });
    }
}
