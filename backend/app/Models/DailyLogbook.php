<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

class DailyLogbook extends Model
{
    use HasFactory;

    protected $fillable = [
        'intern_id',
        'date',
        'start_time',
        'end_time',
        'time',
        'activity',
        'result',
        'obstacle',
        'mood',
        'documentation_path',
        'status',
        'mentor_notes',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date:Y-m-d',
            'time' => 'datetime:H:i',
        ];
    }

    public function intern()
    {
        return $this->belongsTo(User::class, 'intern_id');
    }
}
