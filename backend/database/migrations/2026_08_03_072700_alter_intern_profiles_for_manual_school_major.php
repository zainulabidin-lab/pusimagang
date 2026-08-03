<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Step 1: Add new string columns
        Schema::table('intern_profiles', function (Blueprint $table) {
            $table->string('school_name')->nullable()->after('school_id');
            $table->string('major_name')->nullable()->after('major_id');
        });

        // Step 2: Migrate data from related tables
        // For each intern profile, find their school and major, and copy the name
        $profiles = DB::table('intern_profiles')->get();
        foreach ($profiles as $profile) {
            $schoolName = null;
            $majorName = null;
            
            if ($profile->school_id) {
                $school = DB::table('schools')->where('id', $profile->school_id)->first();
                if ($school) {
                    $schoolName = $school->name;
                }
            }
            
            if ($profile->major_id) {
                $major = DB::table('majors')->where('id', $profile->major_id)->first();
                if ($major) {
                    $majorName = $major->name;
                }
            }
            
            DB::table('intern_profiles')
                ->where('id', $profile->id)
                ->update([
                    'school_name' => $schoolName,
                    'major_name' => $majorName,
                ]);
        }

        // Step 3: Drop old foreign keys and columns
        Schema::table('intern_profiles', function (Blueprint $table) {
            $table->dropForeign(['school_id']);
            $table->dropForeign(['major_id']);
            $table->dropColumn('school_id');
            $table->dropColumn('major_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('intern_profiles', function (Blueprint $table) {
            $table->foreignId('school_id')->nullable()->constrained('schools')->nullOnDelete();
            $table->foreignId('major_id')->nullable()->constrained('majors')->nullOnDelete();
        });
        
        Schema::table('intern_profiles', function (Blueprint $table) {
            $table->dropColumn('school_name');
            $table->dropColumn('major_name');
        });
    }
};
