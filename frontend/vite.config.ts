import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Custom plugin to copy files to Laravel public directory
function copyToLaravel() {
  return {
    name: 'copy-to-laravel',
    closeBundle() {
      const src = path.resolve(__dirname, 'dist');
      const dest = path.resolve(__dirname, '../backend/public');
      
      console.log(`\n[Auto-Sync] Menyalin hasil build ke backend/public...`);
      
      const copyRecursiveSync = (src: string, dest: string) => {
        if (!fs.existsSync(src)) return;
        const stats = fs.statSync(src);
        const isDirectory = stats.isDirectory();
        if (isDirectory) {
          if (!fs.existsSync(dest)) fs.mkdirSync(dest);
          fs.readdirSync(src).forEach((childItemName: string) => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
          });
        } else {
          fs.copyFileSync(src, dest);
        }
      };
      
      try {
        copyRecursiveSync(src, dest);
        console.log('[Auto-Sync] Berhasil disalin!');
      } catch (err) {
        console.error('[Auto-Sync] Gagal menyalin:', err);
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), copyToLaravel()],
  server: {
    port: 80,
    host: true,
    allowedHosts: [
      'pusimagang.unmer.ac.id',
      'localhost',
      '10.2.15.44'
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/storage': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
