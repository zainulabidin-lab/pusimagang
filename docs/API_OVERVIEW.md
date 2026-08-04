# 🌐 API Overview

Seluruh komunikasi antara Frontend (React) dan Backend (Laravel) berjalan melalui sekumpulan *RESTful API* yang dikelompokkan berdasarkan modul fungsional. Seluruh URL API diawali dengan `/api`.

## Struktur Respons Standar
Semua *endpoint* akan mengembalikan JSON dengan struktur konsisten:
```json
{
  "success": true,
  "message": "Deskripsi sukses atau error",
  "data": { ... } // Payload data (objek atau array)
}
```

## Daftar Endpoint (Singkat)

### 1. Authentication (`/api/auth/*`)
- `POST /api/login` : Autentikasi User (Rate Limit: 5/min)
- `POST /api/register` : Registrasi akun anak magang (Rate Limit: 5/min)
- `GET /api/me` : Mendapatkan profil *user* yang sedang aktif
- `POST /api/logout` : Menghapus sesi / *revoke token*

### 2. Dashboard (`/api/dashboard`)
- `GET /api/dashboard` : Mengambil data metrik (Task, Logbook, Checklist) sesuai dengan peran (*Role-based metrics*).

### 3. Task Management (`/api/tasks/*`)
- `GET /api/tasks` : List semua *task* pengguna
- `POST /api/tasks` : Buat *task* baru (Admin/Supervisor/Intern)
- `GET /api/tasks/{id}` : Detail suatu *task*
- `PATCH /api/tasks/{id}/status` : Update status *task* (todo, progress, review, done)
- `POST /api/tasks/{id}/checklists` : Tambah *sub-task/checklist*
- `PATCH /api/tasks/{task_id}/checklists/{check_id}/toggle` : Centang checklist (Dilindungi IDOR)

### 4. Logbook & Reporting (`/api/logbook/*`)
- `GET /api/logbooks` : Riwayat Logbook
- `POST /api/logbooks` : Pembuatan Logbook baru (Khusus anak magang)
- `PATCH /api/logbooks/{id}/approve` : *Approval* oleh Supervisor

### 5. Master Data (`/api/master/*`)
- `GET /api/master/interns` : List profil anak magang
- `GET /api/master/templates` : List SOP Template
- `GET /api/master/competencies` : List kompetensi untuk penilaian

### 6. Admin Panel (`/api/admin/*`)
- `GET /api/admin/pending-interns` : Daftar akun baru yang butuh verifikasi
- `PATCH /api/admin/approve-intern/{id}` : Setujui akun
- `DELETE /api/admin/reject-intern/{id}` : Tolak (hapus permanen) pendaftaran

> **Keamanan:** Sebagian besar endpoint dilindungi oleh Middleware `auth:sanctum`. Selalu sertakan *header* `Authorization: Bearer {token}`.
