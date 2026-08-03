<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Competency extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description'];

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function questionBanks()
    {
        return $this->hasMany(QuestionBank::class);
    }

    public function skillProgress()
    {
        return $this->hasMany(SkillProgress::class);
    }

    public function learningPaths()
    {
        return $this->hasMany(LearningPath::class);
    }
}
