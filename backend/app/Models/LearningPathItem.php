<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LearningPathItem extends Model
{
    use HasFactory;

    protected $fillable = ['learning_path_id', 'title', 'type', 'content_url', 'content_text', 'order_num'];

    public function learningPath()
    {
        return $this->belongsTo(LearningPath::class);
    }
}
