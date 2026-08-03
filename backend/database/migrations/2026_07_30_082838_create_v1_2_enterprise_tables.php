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
        // Tables were already created in a previous run before crashing
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evaluations');
        
        Schema::table('intern_profiles', function (Blueprint $table) {
            $table->dropColumn(['points', 'badge']);
        });
    }
};
