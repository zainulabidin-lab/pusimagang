<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Competencies (Keahlian spesifik, misal: Instalasi Windows, Crimping)
        Schema::create('competencies', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g. Hardware, Network, Linux, dll
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 2. Question Categories
        Schema::create('question_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        // 3. Question Banks
        Schema::create('question_banks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_category_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('competency_id')->nullable()->constrained()->nullOnDelete();
            $table->integer('level')->default(1);
            $table->enum('difficulty', ['easy', 'medium', 'hard'])->default('medium');
            $table->text('question_text');
            $table->text('explanation')->nullable();
            $table->timestamps();
        });

        // 4. Question Options
        Schema::create('question_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_bank_id')->constrained()->cascadeOnDelete();
            $table->text('option_text');
            $table->boolean('is_correct')->default(false);
            $table->timestamps();
        });

        // 5. Question Tags
        Schema::create('question_tags', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_bank_id')->constrained()->cascadeOnDelete();
            $table->string('tag_name');
            $table->timestamps();
        });

        // 6. Attempts (Sesi Ujian)
        Schema::create('attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['pre_test', 'practice', 'post_test']);
            $table->enum('status', ['on-going', 'completed'])->default('on-going');
            $table->timestamp('start_time')->useCurrent();
            $table->timestamp('end_time')->nullable();
            $table->decimal('score', 5, 2)->nullable();
            $table->timestamps();
        });

        // 7. Attempt Answers
        Schema::create('attempt_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attempt_id')->constrained()->cascadeOnDelete();
            $table->foreignId('question_bank_id')->constrained()->cascadeOnDelete();
            $table->foreignId('question_option_id')->nullable()->constrained()->cascadeOnDelete();
            $table->boolean('is_correct')->default(false);
            $table->timestamps();
        });

        // 8. Skill Progress (Statistik Mastery per Anak Magang)
        Schema::create('skill_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('competency_id')->constrained()->cascadeOnDelete();
            $table->decimal('mastery_percentage', 5, 2)->default(0);
            $table->integer('xp')->default(0);
            $table->timestamps();
            
            $table->unique(['user_id', 'competency_id']);
        });

        // 9. Learning Paths
        Schema::create('learning_paths', function (Blueprint $table) {
            $table->id();
            $table->foreignId('competency_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('order_num')->default(0);
            $table->timestamps();
        });

        // 10. Learning Path Items (Video, PDF, dll)
        Schema::create('learning_path_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('learning_path_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->enum('type', ['video', 'pdf', 'quiz', 'task']);
            $table->string('content_url')->nullable();
            $table->text('content_text')->nullable();
            $table->integer('order_num')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('learning_path_items');
        Schema::dropIfExists('learning_paths');
        Schema::dropIfExists('skill_progress');
        Schema::dropIfExists('attempt_answers');
        Schema::dropIfExists('attempts');
        Schema::dropIfExists('question_tags');
        Schema::dropIfExists('question_options');
        Schema::dropIfExists('question_banks');
        Schema::dropIfExists('question_categories');
        Schema::dropIfExists('competencies');
    }
};
