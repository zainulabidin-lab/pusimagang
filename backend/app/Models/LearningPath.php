<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LearningPath extends Model
{
    use HasFactory;

    protected $fillable = ['competency_id', 'title', 'description', 'order_num'];

    public function competency()
    {
        return $this->belongsTo(Competency::class);
    }

    public function items()
    {
        return $this->hasMany(LearningPathItem::class)->orderBy('order_num');
    }
}
