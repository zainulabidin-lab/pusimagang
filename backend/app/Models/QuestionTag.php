<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuestionTag extends Model
{
    use HasFactory;

    protected $fillable = ['question_bank_id', 'tag_name'];

    public function question()
    {
        return $this->belongsTo(QuestionBank::class, 'question_bank_id');
    }
}
