<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Attributes\Fillable;

class TaskTemplate extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'sop_video_url',
        'sop_pdf_path',
        'sop_document_link',
    ];

    public function items()
    {
        return $this->hasMany(TaskTemplateItem::class);
    }
}
