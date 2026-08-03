<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['task_template_id', 'description', 'order'])]
class TaskTemplateItem extends Model
{
    use HasFactory;

    public function template()
    {
        return $this->belongsTo(TaskTemplate::class, 'task_template_id');
    }
}
