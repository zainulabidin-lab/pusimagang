<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttemptAnswer extends Model
{
    use HasFactory;

    protected $fillable = ['attempt_id', 'question_bank_id', 'question_option_id', 'is_correct'];

    protected $casts = [
        'is_correct' => 'boolean',
    ];

    public function attempt()
    {
        return $this->belongsTo(Attempt::class);
    }

    public function question()
    {
        return $this->belongsTo(QuestionBank::class, 'question_bank_id');
    }

    public function option()
    {
        return $this->belongsTo(QuestionOption::class, 'question_option_id');
    }
}
