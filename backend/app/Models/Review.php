<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['task_id', 'mentor_id', 'score_discipline', 'score_speed', 'score_neatness', 'score_communication', 'score_problem_solving', 'score_teamwork', 'score_initiative', 'mentor_notes', 'total_score'])]
class Review extends Model
{
    use HasFactory;

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function mentor()
    {
        return $this->belongsTo(User::class, 'mentor_id');
    }
}
