<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['name', 'email', 'password', 'role', 'is_approved'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $appends = ['has_completed_pre_test'];

    public function getHasCompletedPreTestAttribute()
    {
        if ($this->role !== 'intern') return true;
        
        return $this->attempts()
                    ->where('type', 'pre_test')
                    ->where('status', 'completed')
                    ->exists();
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function internProfile()
    {
        return $this->hasOne(InternProfile::class);
    }

    public function mentorProfile()
    {
        return $this->hasOne(Mentor::class);
    }

    public function attempts()
    {
        return $this->hasMany(Attempt::class);
    }

    public function skillProgress()
    {
        return $this->hasMany(SkillProgress::class);
    }
}
