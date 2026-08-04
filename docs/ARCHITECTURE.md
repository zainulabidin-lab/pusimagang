# 🏛️ Architecture Overview - PUSIM Magang v2.0

## 1. Top-Level Architecture
PUSIM Magang v2.0 menggunakan arsitektur **React Monolith dengan Laravel API**. 
- **Frontend (Client-side):** Menggunakan React 18 (dengan Vite) untuk *Single Page Application* (SPA). Menyediakan *User Interface* yang reaktif dan interaktif.
- **Backend (Server-side):** Menggunakan Laravel 11. Menyediakan *RESTful API* dan bertindak sebagai pengelola basis data, otentikasi, dan logika bisnis utama.

## 2. Directory Structure
Repositori ini dipisahkan menjadi dua pilar utama (Mono-repo):

```
pusimmagang/
│
├── backend/               # Kode utama Laravel (Server)
│   ├── app/               # Logic (Controllers, Models, Services)
│   ├── config/            # Konfigurasi sistem
│   ├── database/          # Migrations & Seeders
│   ├── routes/            # API Endpoints
│   └── public/            # Document Root (Melayani build dari frontend)
│
├── frontend/              # Kode utama React (Client)
│   ├── src/
│   │   ├── components/    # Reusable UI (Design System)
│   │   ├── pages/         # Modul Halaman
│   │   ├── services/      # Konfigurasi Axios API (api.ts)
│   │   └── contexts/      # React Context (AuthContext)
│   ├── dist/              # Hasil build sementara
│   └── vite.config.ts     # Konfigurasi Vite (Auto-copy ke backend/public)
│
└── docs/                  # Dokumentasi Sistem
```

## 3. Data Flow & Authentication
- Autentikasi dikelola oleh **Laravel Sanctum**.
- Ketika pengguna berhasil _login_, backend mengeluarkan **Bearer Token**.
- Token disimpan di `localStorage` frontend dan disematkan secara otomatis di *header* HTTP menggunakan *Axios Request Interceptor*.
- Jika akses kadaluarsa (HTTP `401`), *Axios Response Interceptor* secara otomatis membersihkan `localStorage` dan menendang *user* ke `/login`.

## 4. Frontend Design System (Component Library)
- Tidak menggunakan Tailwind CSS. 
- Memakai pendekatan **Vanilla CSS Variables** murni yang dipusatkan di `index.css`.
- Desain diprioritaskan untuk UI *Enterprise* ala Vercel/Linear (Glassmorphism, Dark Mode Ready, Spacing konsisten).
- Komponen berada di `frontend/src/components/ui/` yang bersifat sangat modular.

## 5. Security & Validation
- **Backend Validation:** Mengandalkan *Laravel Request Validation* untuk memastikan integritas tipe data.
- **IDOR Protection:** Pengecekan *ownership* diberlakukan via Eloquent Relationship (contoh: `$user->tasks()->findOrFail($id)`).
- **Mass Assignment:** Model dilindungi dengan tipe Data Object (PHP 8 atribut/fillable array).
- **Rate Limiting:** Menggunakan middleware `throttle` (contoh `throttle:5,1` pada endpoint otentikasi) untuk mencegah *Brute Force*.
