<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('location')->nullable();
            $table->string('category')->nullable();
            $table->foreignId('division_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            $table->date('deadline')->nullable();
            $table->foreignId('mentor_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('intern_id')->constrained('users')->cascadeOnDelete();
            $table->enum('status', ['todo', 'progress', 'review', 'done'])->default('todo');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('task_checklists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained()->cascadeOnDelete();
            $table->string('description');
            $table->boolean('is_completed')->default(false);
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        Schema::create('task_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->text('comment');
            $table->timestamps();
        });

        Schema::create('task_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('file_path');
            $table->string('file_name');
            $table->string('file_type')->nullable();
            $table->timestamps();
        });

        Schema::create('task_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('action'); // created, moved, checklist_checked, review_requested, revised, approved
            $table->text('details')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('task_logs');
        Schema::dropIfExists('task_files');
        Schema::dropIfExists('task_comments');
        Schema::dropIfExists('task_checklists');
        Schema::dropIfExists('tasks');
    }
};
