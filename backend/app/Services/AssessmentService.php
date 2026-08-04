<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Evaluation;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class AssessmentService implements BaseServiceInterface
{
    /**
     * Get all evaluations based on user role.
     *
     * @param User $user
     * @return Collection
     */
    public function getAllEvaluations(User $user): Collection
    {
        $query = Evaluation::with(['intern', 'mentor']);
        
        if ($user->role === 'intern') {
            $query->where('intern_id', $user->id);
        } elseif ($user->role === 'mentor') {
            $query->where('mentor_id', $user->id);
        }
        
        return $query->latest()->get();
    }

    /**
     * Store a new evaluation.
     *
     * @param User $mentor
     * @param array $data
     * @return Evaluation
     */
    public function storeEvaluation(User $mentor, array $data): Evaluation
    {
        if (Evaluation::where('intern_id', $data['intern_id'])->exists()) {
            throw new \App\Exceptions\BusinessException('Siswa ini sudah diberikan evaluasi akhir.', 400);
        }

        return DB::transaction(function () use ($mentor, $data) {
            $data['mentor_id'] = $mentor->id;
            
            $average = $this->calculateAverageScore($data);
            $data['final_grade'] = $this->calculateFinalGrade($average);
            
            return Evaluation::create($data);
        });
    }

    /**
     * Calculate the average score.
     *
     * @param array $data
     * @return float
     */
    protected function calculateAverageScore(array $data): float
    {
        return ($data['technical_score'] + 
                $data['communication_score'] + 
                $data['discipline_score'] + 
                $data['problem_solving_score']) / 4;
    }

    /**
     * Convert numerical average to a letter grade.
     *
     * @param float $average
     * @return string
     */
    protected function calculateFinalGrade(float $average): string
    {
        if ($average >= 85) return 'A';
        if ($average >= 70) return 'B';
        if ($average >= 55) return 'C';
        return 'D';
    }
}
