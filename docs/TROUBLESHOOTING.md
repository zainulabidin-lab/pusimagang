# 🛠️ Troubleshooting Guide

Jika Anda menemui kendala saat mengembangkan atau mendeploy aplikasi PUSIM Magang v2.0, silakan lihat daftar masalah umum di bawah ini.

## 1. CORS Error (Cross-Origin Resource Sharing)
**Masalah:** Saat Frontend mencoba menghubungi API, *browser Console* menampilkan _CORS Policy Error_.
**Penyebab:** Konfigurasi origin di Laravel tidak mengenali URL *Frontend*.
**Solusi:** Buka `backend/config/cors.php`, pastikan URL Vite (misalnya `http://localhost:5173`) tercantum dalam *array* `allowed_origins`.

## 2. Token Expired & Layar Kosong
**Masalah:** *User* lama tidak membuka aplikasi, namun saat aplikasi dibuka kembali (tanpa *logout*), aplikasi macet/kosong.
**Solusi:** Ini adalah fitur keamanan otomatis. Mulai Phase 9, sistem telah memiliki *Global 401 Interceptor*. Jika ini tetap macet di sisi Anda, coba panggil fungsi `localStorage.clear()` di *Console browser*, lalu *refresh* (F5).

## 3. Database Connection Refused / 1045 Access Denied
**Masalah:** Muncul peringatan `SQLSTATE[HY000] [1045] Access denied for user 'root'@'localhost'`.
**Solusi:** 
- Pastikan konfigurasi `.env` bagian `DB_USERNAME` dan `DB_PASSWORD` benar.
- Pastikan *service MySQL/MariaDB* berjalan di Laragon/XAMPP.
- Hapus *cache config* jika baru mengubah `.env`: `php artisan config:clear`.

## 4. Vite Tidak Memperbarui Tampilan (Build Tidak Terbaca)
**Masalah:** Sudah melakukan perubahan di kode React, namun setelah `npm run build`, Laravel tidak menampilkan perubahan.
**Penyebab:** *Browser Cache* atau Anda lupa me-*replace* file di folder `backend/public/assets`.
**Solusi:**
- *Hard Refresh browser* (Ctrl + F5).
- Pastikan eksekusi script `npm run build` berhasil 100%. (Disarankan menggunakan `auto-build.bat` agar otomatis tereksekusi setiap kali *Save*).

## 5. Storage / Gambar Upload Tidak Muncul (Error 404)
**Masalah:** Pasca-deployment, avatar profil atau foto logbook tidak bisa dimuat.
**Solusi:** Jalankan `php artisan storage:link`. Ini akan membuat jalan pintas (*symlink*) dari `storage/app/public` menuju `public/storage`. Pada sistem Linux/VPS, pastikan hak akses folder *storage* bernilai 775.

## 6. Route Not Found (404) API
**Penyebab:** *Cache route* belum di- *update*.
**Solusi:** Jalankan `php artisan route:clear`.
