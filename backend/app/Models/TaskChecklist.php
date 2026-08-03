<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['task_id', 'description', 'is_completed', 'order'])]
class TaskChecklist extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'is_completed' => 'boolean',
        ];
    }

    public function task()
    {
        return $this->belongsTo(Task::class);
    }
}
