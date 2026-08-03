# 🎓 PUSIM Magang Enterprise (V1.2)

Selamat datang di repositori **PUSIM Magang**, sebuah platform Sistem Manajemen Magang Terpadu berskala *Enterprise* yang dirancang khusus untuk memonitor, mengelola, dan mengevaluasi kinerja anak magang di Pusat Sistem Informasi (PUSIM).

Aplikasi ini dibangun menggunakan arsitektur modern (API-driven) yang memisahkan antara backend dan frontend untuk skalabilitas dan performa maksimal.

---

## 🚀 Teknologi Utama (Tech Stack)

Aplikasi ini mengadopsi tumpukan teknologi modern:
- **Backend (API):** Laravel 11 (PHP 8.2+) dengan sistem autentikasi Laravel Sanctum.
- **Frontend (SPA):** React 18, TypeScript, dan Vite bundler.
- **Styling:** CSS Murni dengan sistem variabel CSS kustom (*Modern UI, Glassmorphism, Animations*).
- **Icons:** Lucide React.
- **Database:** MySQL.

---

## 🌟 Modul & Fitur Utama

Sistem ini menerapkan **Role-Based Access Control (RBAC)** secara ketat, membedakan hak akses dan antarmuka antara `admin`, `mentor`, dan `intern` (anak magang).

### 1. Dashboard Interaktif 📊
- Ringkasan metrik kinerja (Task aktif, selesai, terlambat, dll).
- Indikator progres penyelesaian magang berbentuk lingkaran (*Circular Progress Bar*).
- Panel khusus Mentor untuk memantau performa tiap anak magang bimbingannya.

### 2. Task Board (Manajemen Tugas Kanban & Kolaborasi) 📝
- Sistem *Kanban Board* (Todo, In Progress, Review, Done) bergaya Trello.
- **Tugas Kolaboratif:** Mentor dapat menugaskan satu *Task* kepada lebih dari satu anak magang sekaligus (Multi-Assign). Anak magang juga dapat mengundang teman satu timnya untuk mengerjakan tugas bersama.
- Fitur *Checklist* di dalam setiap Task untuk memecah tugas besar menjadi langkah kecil.
- *Activity Log* spesifik pada setiap Task.

### 3. Logbook Harian (Jurnal Kehadiran) 📖
- Pengganti absensi manual. Anak magang wajib mengisi aktivitas yang dilakukan beserta hambatannya setiap hari (Default jam 07:30 - 15:00).
- Dilengkapi dengan *upload* foto dokumentasi (kompresi otomatis) dan pelaporan *Mood* harian.
- **Smart View:** Tampilan daftar logbook akan dikelompokkan (Grouped) berdasarkan nama anak magang jika diakses oleh Mentor/Admin, sehingga mempermudah *tracking* performa tiap individu.
- Mentor dapat memberikan catatan (notes) dan status Approve/Reject pada logbook anak magang.

### 4. SOP Management (Pusat Standar Operasional) 📋 *(Baru)*
- Menu khusus untuk Admin & Mentor mengelola *Task Templates*.
- Memudahkan pembuatan tugas dengan menyediakan SOP yang sudah tersistem (misal: SOP Setup Lokal, SOP Instalasi Windows, SOP TKJ Mikrotik, dll).
- Saat membuat *Task* baru, *checklist* akan terisi otomatis berdasarkan SOP yang dipilih.

### 5. Gamifikasi (Sistem Poin & Badge) 🏆
- Peningkatan motivasi melalui sistem apresiasi otomatis:
  - **+10 Poin** untuk setiap penyelesaian Task.
  - **+2 Poin** untuk setiap pengisian Logbook harian.
- Pemberian *Badge* gelar secara otomatis (Rising Star, Pro, Expert, Legend).
- **Leaderboard** (Papan Peringkat) Top 5 anak magang ditampilkan di Dashboard.

### 6. Penilaian Akhir & Rapor (Evaluation) 🏅
- Modul *grading* bagi Mentor untuk menilai 4 aspek: **Teknis, Komunikasi, Disiplin, dan Problem Solving**.
- Sistem kalkulasi *Final Grade* (A, B, C, D) otomatis.
- **Cetak Laporan (Print to PDF)** berformat A4 resmi ber-kop surat PUSIM, berisi rincian nilai, portofolio task, logbook, dan tanda tangan digital.

### 7. Activity Feed & Smart Notifications 🔔
- Umpan aktivitas (Activity Feed) layaknya linimasa sosial media yang merekam jejak audit semua pengguna (pembuatan tugas, perubahan status, dll).
- Notifikasi lonceng dinamis (*real-time UX*) di Topbar untuk memberitahu anak magang apabila tugas disetujui atau mendapat poin baru.

---

## 📂 Struktur Direktori Proyek

Proyek ini dipisah menjadi dua *folder* utama di dalam direktori `pusimmagang`:

1. `/backend` (Laravel API)
   - Menyediakan RESTful API berformat JSON.
   - Mengatur validasi bisnis, migrasi database, dan manipulasi data.
2. `/frontend` (React SPA)
   - Bertindak sebagai klien yang mengkonsumsi API.
   - Bertanggung jawab penuh terhadap visual (UI/UX) dan *routing* aplikasi (React Router).

---

## 🛠️ Cara Menjalankan di Lingkungan Lokal (Development)

Pastikan layanan database MySQL (Laragon/XAMPP) sudah berjalan.

**1. Menjalankan Backend:**
Buka terminal baru di *folder* `backend`, lalu jalankan:
```bash
php artisan serve --port=8080
```
*(Backend API akan berjalan di http://127.0.0.1:8080)*

**2. Menjalankan Frontend:**
Buka terminal baru di *folder* `frontend`, lalu jalankan:
```bash
npm run dev
```
*(Frontend UI akan berjalan di alamat lokal yang diberikan Vite, biasanya http://localhost:5173)*

---

*Didokumentasikan secara otomatis pada tanggal 30 Juli 2026. Aplikasi ini siap digunakan dan terus dikembangkan untuk mendukung produktivitas magang di lingkungan PUSIM.*
