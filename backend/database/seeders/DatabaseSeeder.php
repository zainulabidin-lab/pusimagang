<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Division;
use App\Models\School;
use App\Models\Major;
use App\Models\Mentor;
use App\Models\InternProfile;
use App\Models\Task;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Divisions, Schools, Majors
        $div1 = Division::create(['name' => 'IT & Software Development', 'description' => 'Software and Web Dev']);
        $div2 = Division::create(['name' => 'Multimedia & Design', 'description' => 'Graphic Design and UI/UX']);

        $school1 = School::create(['name' => 'SMK Telkom Malang', 'address' => 'Jl. Danau Ranau']);
        $school2 = School::create(['name' => 'Universitas Brawijaya', 'address' => 'Jl. Veteran']);
        $school3 = School::create(['name' => 'SMKN 10 Malang', 'address' => 'Malang']);
        $school4 = School::create(['name' => 'SMKN 1 Turen', 'address' => 'Turen']);

        $major1 = Major::create(['name' => 'Rekayasa Perangkat Lunak']);
        $major2 = Major::create(['name' => 'Sistem Informasi']);
        $major3 = Major::create(['name' => 'Teknik Komputer dan Jaringan']);

        // 2. Create Users
        $admin = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@unmer.ac.id',
            'password' => Hash::make('password'),
            'role' => 'admin'
        ]);

        $mentor1 = User::create([
            'name' => 'Pak Budi (Mentor IT)',
            'email' => 'budi.mentor@unmer.ac.id',
            'password' => Hash::make('password'),
            'role' => 'mentor'
        ]);
        
        $mentorProfile = Mentor::create([
            'user_id' => $mentor1->id,
            'division_id' => $div1->id,
            'phone' => '08123456789'
        ]);

        $intern1 = User::create([
            'name' => 'Andi Siswa',
            'email' => 'andi.intern@unmer.ac.id',
            'password' => Hash::make('password'),
            'role' => 'intern',
            'is_approved' => true
        ]);

        $internProfile1 = InternProfile::create([
            'user_id' => $intern1->id,
            'mentor_id' => $mentor1->id,
            'school_id' => $school1->id,
            'major_id' => $major1->id,
            'division_id' => $div1->id,
            'phone' => '08987654321',
            'start_date' => '2026-07-01',
            'end_date' => '2026-10-01',
            'status' => 'active'
        ]);

        // 3. Create Sample Tasks for Kanban
        Task::create([
            'title' => 'Setup Local Environment',
            'description' => 'Install XAMPP/Laragon dan Node.js',
            'priority' => 'high',
            'status' => 'done',
            'division_id' => $div1->id,
            'mentor_id' => $mentor1->id,
            'intern_id' => $intern1->id,
        ]);

        Task::create([
            'title' => 'Desain ERD Database',
            'description' => 'Membuat relasi tabel untuk aplikasi Magang',
            'priority' => 'high',
            'status' => 'review',
            'division_id' => $div1->id,
            'mentor_id' => $mentor1->id,
            'intern_id' => $intern1->id,
        ]);

        $task3 = Task::create([
            'title' => 'Implementasi API Login',
            'description' => 'Membuat endpoint login dengan Sanctum',
            'priority' => 'medium',
            'status' => 'progress',
            'division_id' => $div1->id,
            'mentor_id' => $mentor1->id,
            'intern_id' => $intern1->id,
        ]);

        $task4 = Task::create([
            'title' => 'Desain UI Kanban',
            'description' => 'Buat halaman Task Board di React',
            'priority' => 'medium',
            'status' => 'todo',
            'division_id' => $div1->id,
            'mentor_id' => $mentor1->id,
            'intern_id' => $intern1->id,
        ]);

        // 4. Create Sample Checklists
        \App\Models\TaskChecklist::create([
            'task_id' => $task3->id,
            'description' => 'Install package Laravel Sanctum',
            'is_completed' => true,
            'order' => 1
        ]);
        
        \App\Models\TaskChecklist::create([
            'task_id' => $task3->id,
            'description' => 'Setup konfigurasi Auth Middleware',
            'is_completed' => false,
            'order' => 2
        ]);

        \App\Models\TaskChecklist::create([
            'task_id' => $task4->id,
            'description' => 'Desain Wireframe di Figma',
            'is_completed' => false,
            'order' => 1
        ]);

        $this->call([
            CompetencySeeder::class,
        ]);
    }
}
