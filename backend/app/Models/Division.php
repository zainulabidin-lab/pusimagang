<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['name', 'description'])]
class Division extends Model
{
    use HasFactory, SoftDeletes;

    public function mentors()
    {
        return $this->hasMany(Mentor::class);
    }

    public function internProfiles()
    {
        return $this->hasMany(InternProfile::class);
    }
}
