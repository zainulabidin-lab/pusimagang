<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuestionBank extends Model
{
    use HasFactory;

    protected $fillable = ['question_category_id', 'competency_id', 'level', 'difficulty', 'question_text', 'explanation'];

    public function category()
    {
        return $this->belongsTo(QuestionCategory::class, 'question_category_id');
    }

    public function competency()
    {
        return $this->belongsTo(Competency::class);
    }

    public function options()
    {
        return $this->hasMany(QuestionOption::class);
    }

    public function tags()
    {
        return $this->hasMany(QuestionTag::class);
    }
}
