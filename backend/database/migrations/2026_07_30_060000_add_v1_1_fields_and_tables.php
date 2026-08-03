<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Update daily_logbooks
        Schema::table('daily_logbooks', function (Blueprint $table) {
            $table->time('start_time')->nullable()->after('date');
            $table->time('end_time')->nullable()->after('start_time');
            $table->string('mood')->nullable()->after('documentation_path');
        });

        // 2. Update task_templates
        Schema::table('task_templates', function (Blueprint $table) {
            $table->string('sop_video_url')->nullable();
            $table->string('sop_pdf_path')->nullable();
            $table->string('sop_document_link')->nullable();
        });

        // 3. Create knowledge_bases table
        Schema::create('knowledge_bases', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category'); // Hardware, Network, Server, Office, Troubleshooting
            $table->text('content');
            $table->string('icon')->default('Book');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('knowledge_bases');

        Schema::table('task_templates', function (Blueprint $table) {
            $table->dropColumn(['sop_video_url', 'sop_pdf_path', 'sop_document_link']);
        });

        Schema::table('daily_logbooks', function (Blueprint $table) {
            $table->dropColumn(['start_time', 'end_time', 'mood']);
        });
    }
};
