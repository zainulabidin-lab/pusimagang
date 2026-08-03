# 🎓 PUSIM Magang Enterprise (v2.0)

![CI/CD Pipeline](https://github.com/zainulabidin-lab/pusimagang/actions/workflows/ci.yml/badge.svg)

Selamat datang di repositori **PUSIM Magang Enterprise v2.0**, sebuah platform Sistem Manajemen Magang Terpadu berskala *Enterprise* yang dirancang khusus untuk memonitor, mengelola, dan mengevaluasi kinerja anak magang di Pusat Sistem Informasi (PUSIM).

Aplikasi ini dibangun menggunakan arsitektur modern (API-driven) dan telah melalui perombakan UI/UX besar-besaran (Phase 5) untuk menghadirkan pengalaman pengguna sekelas aplikasi enterprise profesional (terinspirasi dari Linear, Notion, dan Vercel).

---

## 🚀 Teknologi Utama (Tech Stack)

Aplikasi ini mengadopsi tumpukan teknologi modern:
- **Backend (API):** Laravel 11 (PHP 8.2+) dengan autentikasi Sanctum.
- **Frontend (SPA):** React 18, TypeScript, dan Vite bundler.
- **Styling:** Vanilla CSS dengan arsitektur Design System kustom (*Design Tokens, Glassmorphism, Micro-animations*).
- **Komponen UI:** Custom Enterprise Component Library (Drawer, Timeline, FilterBar, StepProgress, Bento Grid).
- **Icons:** Lucide React.
- **Database:** MySQL.
- **CI/CD:** GitHub Actions (Otomatisasi Build & Testing).

---

## 🌟 Fitur & Pengalaman Pengguna Baru (v2.0)

Pembaruan v2.0 berfokus pada **Enterprise Workflow Experience**, meminimalkan *click*, memandu pengguna secara natural, dan menerapkan prinsip *progressive disclosure*.

### 1. Executive Dashboard (Mission Control) 📊
- Desain *Bento Grid* premium yang responsif.
- **Dynamic Hero Section:** Menyapa pengguna sesuai waktu dan role.
- **Visual Analytics:** Grafik aktivitas mingguan dan distribusi tugas (menggunakan Recharts).
- **Action Center & Timeline:** Daftar *deadline* terdekat dan umpan aktivitas *real-time*.

### 2. Task Board (Manajemen Tugas Kanban & Kolaborasi) 📝
- Sistem *Kanban Board* (Todo, In Progress, Review, Done).
- **Contextual Drawers:** Pembuatan dan detail tugas kini menggunakan *side drawer*, sehingga pengguna tidak kehilangan konteks dari papan Kanban.
- **Visual Approval Workflow:** Indikator progres langkah demi langkah (Assigned -> In Progress -> Under Review -> Done).
- **Tugas Kolaboratif (Multi-Assign):** Mentor dapat menugaskan satu *Task* kepada banyak anak magang sekaligus.

### 3. Logbook Harian (Timeline Interaktif) 📖
- Dirombak dari tampilan daftar biasa menjadi **Timeline Layout** yang elegan.
- **Smart Filtering:** Dilengkapi *FilterBar* terpadu untuk pencarian dan penyaringan berdasarkan status.
- Anak magang melaporkan aktivitas, hambatan, foto dokumentasi, dan pelaporan *Mood* harian melalui Drawer.
- Mentor dapat memberikan catatan (notes) dan status *Approve/Reject* dengan cepat.

### 4. Penilaian Akhir (Progressive Evaluation) 🏅
- Menggunakan *Step-by-step Wizard* (Intern -> Scores -> Review) untuk mengisi rubrik penilaian.
- Visualisasi nilai akhir (A, B, C, D) menggunakan *Circular Progress* yang dinamis.
- Cetak Laporan (Print to PDF) resmi ber-kop surat PUSIM.

### 5. Registrasi & SOP Management 📋
- **Registration Wizard:** Registrasi kini dibagi menjadi 3 langkah progresif (Akun -> Edukasi -> Konfirmasi) untuk mengurangi beban kognitif pengguna.
- **SOP Templates:** Modul manajemen standar operasional untuk mempercepat pembuatan tugas yang berulang, lengkap dengan *checklist* otomatis.

### 6. Gamifikasi (Sistem Poin & Badge) 🏆
- Peningkatan motivasi melalui sistem apresiasi otomatis:
  - **+10 Poin** (Task) dan **+2 Poin** (Logbook).
- Pemberian *Badge* gelar secara otomatis (Rising Star, Pro, Expert, Legend) yang dipajang di *Leaderboard* Dashboard.

---

## 📂 Struktur Direktori Proyek

Proyek ini dipisah menjadi dua *folder* utama di dalam repositori:

1. `/backend` (Laravel API)
   - Menyediakan RESTful API berformat JSON.
2. `/frontend` (React SPA)
   - Bertindak sebagai klien yang mengkonsumsi API, berisi *Enterprise Component Library* (di `src/components/ui`).
3. `/.github/workflows`
   - Berisi file konfigurasi GitHub Actions (`ci.yml`) untuk CI/CD.

---

## 🛠️ Cara Menjalankan di Lingkungan Lokal (Development)

Pastikan layanan database MySQL (Laragon/XAMPP) sudah berjalan.

**1. Menjalankan Backend:**
Buka terminal baru di *folder* `backend`, lalu jalankan:
```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve --port=8080
```
*(Backend API akan berjalan di http://127.0.0.1:8080)*

**2. Menjalankan Frontend:**
Buka terminal baru di *folder* `frontend`, lalu jalankan:
```bash
npm install
npm run dev
```
*(Frontend UI akan berjalan di alamat lokal yang diberikan Vite, biasanya http://localhost:5173)*

---

*Pembaruan v2.0 didokumentasikan pada bulan Agustus 2026. PUSIM Magang Enterprise terus dikembangkan untuk menjadi standar emas dalam manajemen magang industri.*
