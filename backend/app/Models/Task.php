<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['title', 'description', 'location', 'category', 'division_id', 'priority', 'deadline', 'mentor_id', 'intern_id', 'status'])]
class Task extends Model
{
    use HasFactory, SoftDeletes;

    protected function casts(): array
    {
        return [
            'deadline' => 'date',
        ];
    }

    public function division()
    {
        return $this->belongsTo(Division::class);
    }

    public function competency()
    {
        return $this->belongsTo(Competency::class);
    }

    public function mentor()
    {
        return $this->belongsTo(User::class, 'mentor_id');
    }

    public function checklists()
    {
        return $this->hasMany(TaskChecklist::class)->orderBy('order');
    }

    public function logs()
    {
        return $this->hasMany(TaskLog::class)->latest();
    }

    public function intern()
    {
        return $this->belongsTo(User::class, 'intern_id');
    }

    public function interns()
    {
        return $this->belongsToMany(User::class, 'task_user', 'task_id', 'user_id');
    }

    public function comments()
    {
        return $this->hasMany(TaskComment::class);
    }

    public function files()
    {
        return $this->hasMany(TaskFile::class);
    }
}
