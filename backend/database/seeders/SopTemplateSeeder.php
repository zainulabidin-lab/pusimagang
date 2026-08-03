<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SopTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $templates = [
            [
                'name' => 'Setup Environment Lokal',
                'description' => 'Prosedur pertama saat baru masuk ke proyek PUSIM. Panduan menyiapkan aplikasi di laptop lokal.',
                'items' => [
                    'Clone repository aplikasi dari GitLab/GitHub',
                    'Duplikasi file .env.example menjadi .env',
                    'Konfigurasi kredensial database lokal di file .env',
                    'Jalankan perintah composer install dan npm install',
                    'Jalankan php artisan key:generate dan php artisan migrate --seed',
                    'Jalankan server lokal (php artisan serve / npm run dev) dan pastikan aplikasi bisa diakses tanpa error'
                ]
            ],
            [
                'name' => 'Membuat Halaman UI / Frontend',
                'description' => 'SOP standar ketika ditugaskan membuat antarmuka halaman baru.',
                'items' => [
                    'Buat branch baru dari branch develop (contoh: feat/nama-halaman)',
                    'Lakukan slicing desain dari Figma ke HTML/CSS/React (sesuaikan komponen)',
                    'Pastikan desain responsif dan tidak berantakan jika dibuka di layar HP',
                    'Uji coba interaksi dasar (tombol bisa diklik, form bisa diinput)',
                    'Lakukan commit, push ke repository, lalu buat Pull Request (PR)',
                    'Minta review ke Mentor/Senior'
                ]
            ],
            [
                'name' => 'Membuat API Endpoint Backend',
                'description' => 'SOP standar ketika ditugaskan membuat fungsi atau API baru di Backend (Laravel).',
                'items' => [
                    'Buat file Migration dan Model (php artisan make:model NamaModel -m)',
                    'Buat Controller dan definisikan route di file api.php',
                    'Tulis validasi request (Form Request) untuk memastikan data aman',
                    'Uji API endpoint menggunakan Postman / Insomnia secara mandiri',
                    'Tulis dokumentasi API jika diperlukan (Swagger/Postman Collection)',
                    'Buat Pull Request dan pastikan tidak ada kode yang merusak fitur lain'
                ]
            ],
            [
                'name' => 'Fixing Bug Aplikasi',
                'description' => 'Panduan sistematis dalam menyelesaikan laporan error atau bug.',
                'items' => [
                    'Baca detail laporan error dan cobalah mereproduksi bug di komputer lokal',
                    'Temukan penyebab utama (root cause) melalui error logs atau fitur inspect element',
                    'Lakukan perbaikan kode pada branch terpisah (contoh: fix/nama-bug)',
                    'Uji coba kembali dan pastikan bug tersebut benar-benar hilang (tidak muncul lagi)',
                    'Buat Pull Request (PR) dan sertakan bukti screenshot/video bahwa bug telah diperbaiki'
                ]
            ],
            [
                'name' => 'Instalasi & Konfigurasi Server Lokal',
                'description' => 'SOP (TKJ) untuk melakukan instalasi dan setup awal server (Linux/Windows) pada infrastruktur kantor.',
                'items' => [
                    'Persiapkan file ISO dan buat Bootable Media (Flashdisk) / Siapkan VM',
                    'Lakukan instalasi OS Server (misal: Ubuntu Server) sesuai standar PUSIM',
                    'Konfigurasi Network: atur IP Static, Subnet, Gateway, dan DNS',
                    'Update dan upgrade seluruh package repository sistem',
                    'Setup layanan dasar (SSH, UFW/Firewall, NTP)',
                    'Catat IP Address, Akun, dan Password ke dalam dokumen internal/logbook'
                ]
            ],
            [
                'name' => 'Konfigurasi Jaringan & Router (Mikrotik)',
                'description' => 'SOP (TKJ) standar untuk setup router Mikrotik pada suatu segmen jaringan.',
                'items' => [
                    'Reset konfigurasi router Mikrotik (No Default Config)',
                    'Konfigurasi Interface (beri nama WAN, LAN) dan berikan IP Address',
                    'Konfigurasi DNS dan routing dasar (Default Gateway)',
                    'Setup NAT (Firewall) agar jaringan lokal bisa mengakses internet',
                    'Setup DHCP Server pada interface LAN',
                    'Lakukan pengujian koneksi internet dari sisi client (Ping/Traceroute)'
                ]
            ],
            [
                'name' => 'Maintenance & Troubleshooting Hardware',
                'description' => 'SOP (TKJ) untuk penanganan keluhan kerusakan komputer atau perangkat jaringan.',
                'items' => [
                    'Identifikasi keluhan: cek gejala kerusakan (mati total, blue screen, no network, dll)',
                    'Lakukan pengecekan fisik (kabel listrik, kabel LAN, RAM, kipas pendingin)',
                    'Bersihkan komponen hardware dari debu (jika diperlukan)',
                    'Lakukan penggantian suku cadang (sparepart) jika ada komponen yang teridentifikasi rusak',
                    'Rakit kembali, nyalakan PC/perangkat, dan lakukan pengujian',
                    'Catat hasil perbaikan pada Berita Acara atau laporan logbook harian'
                ]
            ],
            [
                'name' => 'Instalasi Ulang Windows (Reinstall OS)',
                'description' => 'SOP standar untuk melakukan instalasi ulang (format) sistem operasi Windows pada PC/Laptop client.',
                'items' => [
                    'Backup Data Penting: pindahkan data dari folder Documents, Desktop, dan Downloads ke Drive D atau Harddisk Eksternal',
                    'Siapkan Bootable Media: gunakan Rufus atau Media Creation Tool untuk membuat flashdisk installer Windows',
                    'Konfigurasi BIOS/UEFI: ubah urutan Boot Priority agar membaca Flashdisk pada urutan pertama',
                    'Proses Instalasi: hapus/format partisi Drive C lama (System) dan lakukan instalasi pada partisi yang bersih',
                    'Install Driver & Aplikasi: pasang driver (VGA, Audio, LAN) dan aplikasi esensial (Office, Browser, PDF Reader)',
                    'Restore Data: kembalikan data backup dan pastikan komputer dapat digunakan dengan normal'
                ]
            ]
        ];

        foreach ($templates as $t) {
            $template = \App\Models\TaskTemplate::firstOrCreate(
                ['name' => $t['name']],
                ['description' => $t['description']]
            );

            // Clear old items if exists to avoid duplication inside template
            \App\Models\TaskTemplateItem::where('task_template_id', $template->id)->delete();

            foreach ($t['items'] as $index => $itemText) {
                \App\Models\TaskTemplateItem::create([
                    'task_template_id' => $template->id,
                    'description' => $itemText,
                    'order' => $index + 1
                ]);
            }
        }
    }
}
