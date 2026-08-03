<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evaluation extends Model
{
    use HasFactory;

    protected $fillable = [
        'intern_id',
        'mentor_id',
        'technical_score',
        'communication_score',
        'discipline_score',
        'problem_solving_score',
        'final_grade',
        'notes',
    ];

    public function intern()
    {
        return $this->belongsTo(User::class, 'intern_id');
    }

    public function mentor()
    {
        return $this->belongsTo(User::class, 'mentor_id');
    }
}
