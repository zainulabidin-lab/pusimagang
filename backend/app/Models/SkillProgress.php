<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SkillProgress extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'competency_id', 'mastery_percentage', 'xp'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function competency()
    {
        return $this->belongsTo(Competency::class);
    }
}
