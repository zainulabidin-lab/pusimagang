@echo off
color 0B
echo =========================================================
echo PUSIM MAGANG ENTERPRISE - AUTO SYNC WORKFLOW
echo =========================================================
echo.
echo Aplikasi ini akan secara otomatis memantau (watch) setiap 
echo perubahan kode React yang kamu lakukan.
echo.
echo Setiap kali kamu menyimpan file (Ctrl + S), sistem akan:
echo 1. Melakukan build ulang secara cepat (Hot Build)
echo 2. Menyalin hasilnya langsung ke backend/public Laragon
echo.
echo Biarkan jendela hitam ini tetap terbuka saat kamu ngoding!
echo (Tekan Ctrl + C jika ingin mematikan)
echo.
echo Memulai Vite Watcher...
echo.
cd frontend
npx vite build --watch
