# 🚀 Installation Guide - PUSIM Magang v2.0

Panduan instalasi ini akan membantu Anda menjalankan PUSIM Magang v2.0 di lingkungan pengembangan (*Development Environment*) lokal Anda.

## 📋 Persyaratan Sistem
Pastikan sistem Anda memenuhi persyaratan minimum berikut:
- **PHP** >= 8.2 (Laragon disarankan untuk Windows)
- **Composer** >= 2.0
- **Node.js** >= 18 (Disarankan v20 LTS)
- **NPM** >= 9.x
- **MySQL** >= 8.0 atau MariaDB >= 10.4 (atau SQLite untuk uji coba lokal)
- **Git**

## 🔧 Langkah Instalasi Backend (Laravel)
1. Pindah ke direktori backend:
   ```bash
   cd backend
   ```
2. Install dependensi PHP dengan Composer:
   ```bash
   composer install
   ```
3. Salin file `.env.example` ke `.env`:
   ```bash
   cp .env.example .env
   ```
4. *Generate* *Application Key*:
   ```bash
   php artisan key:generate
   ```
5. Buat dan konfigurasikan *database* di file `.env`. (Secara *default*, sistem akan mencoba menggunakan koneksi `sqlite` jika tidak diubah).
6. Jalankan Migrasi dan *Seeder* (Untuk mendapatkan *dummy data* admin, mentor, dan intern):
   ```bash
   php artisan migrate:fresh --seed
   ```
7. Jalankan *server* Laravel (atau akses via virtual host Laragon):
   ```bash
   php artisan serve
   ```

## 💻 Langkah Instalasi Frontend (React + Vite)
1. Pindah ke direktori frontend:
   ```bash
   cd frontend
   ```
2. Install dependensi Javascript:
   ```bash
   npm install
   ```
3. Salin konfigurasi lokal (jika diperlukan), pastikan `.env` (jika ada) menunjuk ke `http://localhost:8000/api` atau domain backend Anda.
4. Jalankan *server* Vite:
   ```bash
   npm run dev
   ```

Aplikasi sekarang dapat diakses di browser melalui URL yang ditampilkan oleh Vite (biasanya `http://localhost:5173`).

---
> **Otomatisasi Lokal (Windows):** Jika Anda ingin menjalankan *build* Vite secara otomatis dan melempar asetnya ke dalam folder public Laravel, Anda dapat menggunakan script `auto-build.bat` di direktori *root*.
