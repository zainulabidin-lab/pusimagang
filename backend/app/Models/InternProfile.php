<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class InternProfile extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'mentor_id',
        'school_id',
        'points',
        'badge',
        'major_id',
        'start_date',
        'end_date',
        'address',
        'phone',
        'status'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function mentor()
    {
        return $this->belongsTo(User::class, 'mentor_id');
    }

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function major()
    {
        return $this->belongsTo(Major::class);
    }

    public function division()
    {
        return $this->belongsTo(Division::class);
    }
}
