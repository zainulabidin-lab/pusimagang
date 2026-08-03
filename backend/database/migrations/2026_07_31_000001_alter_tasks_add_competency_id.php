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
        Schema::table('tasks', function (Blueprint $table) {
            $table->foreignId('competency_id')->nullable()->constrained()->nullOnDelete()->after('division_id');
            // Adding xp_reward to know how much skill progress is gained upon completion
            $table->integer('xp_reward')->default(0)->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropForeign(['competency_id']);
            $table->dropColumn(['competency_id', 'xp_reward']);
        });
    }
};
