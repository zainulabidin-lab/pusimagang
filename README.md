# 🚀 PUSIM Magang Enterprise v2.0

Sistem Manajemen Magang berskala Enterprise, didesain khusus untuk Pusat Sistem Informasi Manajemen (PUSIM). PUSIM Magang mengintegrasikan pengelolaan harian *interns*, evaluasi *mentors*, dan pelacakan kinerja terpusat dengan UI/UX premium kelas satu.

## 🌟 Fitur Utama
- **Role-Based Access Control (RBAC)** (Admin, Mentor, Intern)
- **Interactive Task Kanban Board** (Drag & Drop, Sub-checklists)
- **Executive KPI Dashboard** (Grafik Real-time & Milestone Progress)
- **Logbook & Assessment System** (Wizard Form, Daily Tracking)
- **Gamified Leaderboard & Competency Tracking**

## 📚 Dokumentasi
Sistem ini telah dilengkapi dengan pedoman dokumentasi arsitektur dan penyebaran:
1. [Installation Guide](docs/INSTALLATION.md) - Panduan cara instalasi di mesin *Local*.
2. [Deployment Guide](docs/DEPLOYMENT.md) - Panduan *Deploy* ke *Production*.
3. [Architecture Overview](docs/ARCHITECTURE.md) - Struktur Monolith (React + Laravel).
4. [API Overview](docs/API_OVERVIEW.md) - Dokumentasi Komunikasi Klien-Server.
5. [Troubleshooting Guide](docs/TROUBLESHOOTING.md) - Pemecahan masalah (CORS, Token, Build).

## 🛠️ Stack Teknologi
- **Frontend**: React 18, Vite, Lucide Icons (Vanilla CSS System)
- **Backend**: Laravel 11, Sanctum (REST API)
- **Database**: SQLite (Dev) / MySQL (Prod)

## 🤝 Kontribusi
Aplikasi ini diarsiteki dengan prinsip SOLID, DRY, dan pemisahan komponen *React* yang terstruktur. Jika Anda ingin melakukan improvisasi, pastikan mempertahankan standar UI *Enterprise* (tanpa memodifikasi `index.css` tanpa persetujuan tim *Design System*).

---
© 2026 PUSIM (Pusat Sistem Informasi Manajemen) - All Rights Reserved.
