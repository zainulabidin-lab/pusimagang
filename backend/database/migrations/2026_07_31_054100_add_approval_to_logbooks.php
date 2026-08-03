<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('daily_logbooks', function (Blueprint $table) {
            $table->string('status')->default('pending')->after('documentation_path'); // pending, approved, rejected
            $table->text('mentor_notes')->nullable()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('daily_logbooks', function (Blueprint $table) {
            $table->dropColumn(['status', 'mentor_notes']);
        });
    }
};
