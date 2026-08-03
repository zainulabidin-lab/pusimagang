<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TaskTemplate;
use App\Models\TaskTemplateItem;

class TaskTemplateSeeder extends Seeder
{
    public function run(): void
    {
        // Template 1: Frontend
        $t1 = TaskTemplate::firstOrCreate([
            'name' => 'Slicing UI Dashboard',
            'description' => 'Konversi desain Figma ke React menggunakan Tailwind/CSS.'
        ]);
        if ($t1->wasRecentlyCreated) {
            TaskTemplateItem::create(['task_template_id' => $t1->id, 'description' => 'Setup project React / Vite', 'order' => 1]);
            TaskTemplateItem::create(['task_template_id' => $t1->id, 'description' => 'Buat komponen Navbar & Sidebar', 'order' => 2]);
            TaskTemplateItem::create(['task_template_id' => $t1->id, 'description' => 'Slicing layout utama', 'order' => 3]);
            TaskTemplateItem::create(['task_template_id' => $t1->id, 'description' => 'Uji responsivitas di Mobile & Desktop', 'order' => 4]);
        }

        // Template 2: Backend
        $t2 = TaskTemplate::firstOrCreate([
            'name' => 'Pembuatan REST API Auth',
            'description' => 'Membuat sistem registrasi dan login menggunakan Laravel Sanctum.'
        ]);
        if ($t2->wasRecentlyCreated) {
            TaskTemplateItem::create(['task_template_id' => $t2->id, 'description' => 'Setup konfigurasi database & migration', 'order' => 1]);
            TaskTemplateItem::create(['task_template_id' => $t2->id, 'description' => 'Install dan konfigurasi Laravel Sanctum', 'order' => 2]);
            TaskTemplateItem::create(['task_template_id' => $t2->id, 'description' => 'Buat AuthController (Login & Register)', 'order' => 3]);
            TaskTemplateItem::create(['task_template_id' => $t2->id, 'description' => 'Uji endpoint menggunakan Postman', 'order' => 4]);
        }

        // Template 3: Networking/Hardware
        $t3 = TaskTemplate::firstOrCreate([
            'name' => 'Setup Mikrotik Dasar',
            'description' => 'Konfigurasi IP, Gateway, dan DNS pada router Mikrotik.'
        ]);
        if ($t3->wasRecentlyCreated) {
            TaskTemplateItem::create(['task_template_id' => $t3->id, 'description' => 'Reset konfigurasi default', 'order' => 1]);
            TaskTemplateItem::create(['task_template_id' => $t3->id, 'description' => 'Setting IP Address di interface Public & Local', 'order' => 2]);
            TaskTemplateItem::create(['task_template_id' => $t3->id, 'description' => 'Setting IP Route (Gateway)', 'order' => 3]);
            TaskTemplateItem::create(['task_template_id' => $t3->id, 'description' => 'Setting DNS dan NAT Masquerade', 'order' => 4]);
            TaskTemplateItem::create(['task_template_id' => $t3->id, 'description' => 'Ping dari terminal untuk uji koneksi', 'order' => 5]);
        }
    }
}
