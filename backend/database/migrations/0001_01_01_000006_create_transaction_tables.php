<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_logbooks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('intern_id')->constrained('users')->cascadeOnDelete();
            $table->date('date');
            $table->time('time');
            $table->text('activity');
            $table->text('result')->nullable();
            $table->text('obstacle')->nullable();
            $table->string('documentation_path')->nullable();
            $table->timestamps();
        });

        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained()->cascadeOnDelete();
            $table->foreignId('mentor_id')->constrained('users')->cascadeOnDelete();
            $table->integer('score_discipline')->default(0);
            $table->integer('score_speed')->default(0);
            $table->integer('score_neatness')->default(0);
            $table->integer('score_communication')->default(0);
            $table->integer('score_problem_solving')->default(0);
            $table->integer('score_teamwork')->default(0);
            $table->integer('score_initiative')->default(0);
            $table->text('mentor_notes')->nullable();
            $table->integer('total_score')->default(0);
            $table->timestamps();
        });

        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('message');
            $table->string('type'); // new_task, deadline_tomorrow, deadline_today, task_revised, task_approved
            $table->string('link')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('daily_logbooks');
    }
};
