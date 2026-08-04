# 🚀 Deployment Guide (Production)

Dokumen ini menjelaskan langkah-langkah mendeploy aplikasi PUSIM Magang v2.0 ke lingkungan *Production* (cPanel, VPS, atau Platform PaaS).

## 1. Persiapan Build (Frontend)
Karena arsitektur yang digunakan adalah *Monolith Deployment* (React di-build dan di-serve oleh Laravel), lakukan proses build pada sisi frontend terlebih dahulu.
```bash
cd frontend
npm install
npm run build
```
Proses ini akan menghasilkan file statis (JS, CSS, Assets) di direktori `backend/public/assets` dan memperbarui `backend/public/index.html`. 

## 2. Persiapan Backend (Laravel)
Pindahkan seluruh isi direktori `backend` ke server *Production*.
1. Atur `.env` untuk *Production*:
   ```env
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://magang.domain.com
   DB_CONNECTION=mysql # Atau sesuaikan
   ```
2. Jalankan instalasi dependensi (tanpa modul *dev*):
   ```bash
   composer install --optimize-autoloader --no-dev
   ```
3. Konfigurasikan *Key* dan Migrasi:
   ```bash
   php artisan key:generate
   php artisan migrate --force
   ```
   *(Opsional: Jangan jalankan `--seed` di production jika data riil sudah ada).*

## 3. Optimisasi Cache (Penting!)
Di lingkungan *Production*, Laravel harus dioptimasi agar memuat konfigurasi dan rute dari RAM/Cache alih-alih membaca disk:
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

## 4. Izin Storage & Symlink
Pastikan folder `storage` dan `bootstrap/cache` memiliki izin *write* oleh *web server* (misalnya `www-data` atau `nginx`):
```bash
chmod -R 775 storage bootstrap/cache
```
Buat *symlink* ke folder `public/storage` agar aset foto/dokumen dapat diakses:
```bash
php artisan storage:link
```

## 5. Web Server Configuration (Nginx / Apache)
Pastikan *document root* web server mengarah ke folder `backend/public`.

**Contoh Nginx:**
```nginx
server {
    listen 80;
    server_name magang.domain.com;
    root /var/www/pusimmagang/backend/public;

    index index.php index.html index.htm;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
    }
}
```

## 6. Selesai
Aplikasi sekarang berjalan di lingkungan produksi. Pastikan sertifikat SSL/HTTPS diaktifkan.
