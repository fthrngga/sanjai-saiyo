# Panduan Deployment Laravel + React/Vite di Railway

Dokumen ini berisi panduan lengkap langkah-demi-langkah untuk mendeploy proyek **Sanjai Saiyo** ke platform **Railway** menggunakan builder bawaan **Nixpacks** yang sudah kita konfigurasi di berkas `nixpacks.toml`.

---

## 📋 Persiapan Awal
Sebelum memulai di dashboard Railway, pastikan Anda memiliki:
1. Akun [Railway.app](https://railway.app).
2. Repositori GitHub proyek ini yang sudah terhubung (atau Anda memiliki akses ke `fthrngga/sanjai-saiyo`).
3. Branch target yang ingin dideploy (misalnya `dev-dijah`).

---

## 🚀 Langkah-Langkah Deployment

### Langkah 1: Buat Proyek Baru di Railway
1. Masuk ke dashboard Railway, klik **New Project** di pojok kanan atas.
2. Pilih **Deploy from GitHub repo**.
3. Pilih repositori `fthrngga/sanjai-saiyo`.
4. Pilih branch yang ingin dideploy (contoh: `dev-dijah`).
5. Klik **Deploy Now** (Jangan khawatir jika build pertama gagal karena variabel lingkungan belum dikonfigurasi).

### Langkah 2: Tambahkan Database MySQL di Railway
Karena Railway menggunakan sistem file ephemeral (data lokal akan hilang setiap kali deploy ulang), kita wajib menggunakan database terpisah.
1. Di dalam proyek Railway Anda, klik **+ Add** -> **Database** -> **Add MySQL**.
2. Railway akan membuat layanan MySQL baru secara otomatis dalam hitungan detik.
3. Setelah database aktif, klik pada layanan MySQL tersebut, buka tab **Variables** untuk melihat kredensial koneksi database.

### Langkah 3: Konfigurasi Variabel Lingkungan (Environment Variables)
Buka layanan utama aplikasi web Anda di Railway, pilih tab **Variables**, lalu klik **Raw Editor** untuk menyalin (paste) variabel berikut sekaligus. sesuaikan nilainya:

```env
APP_NAME="Sanjai Saiyo"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://domain-railway-anda.up.railway.app # (Ganti dengan domain dari Railway nanti)

# APP_KEY wajib diisi dengan string 32-karakter yang aman.
# Anda bisa mendapatkannya dari berkas .env lokal Anda, atau buat baru lewat terminal lokal dengan perintah:
# php artisan key:generate --show
APP_KEY=base64:xxxx...

# Kredensial Database (Gunakan variabel referensi otomatis dari Railway untuk MySQL)
DB_CONNECTION=mysql
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_DATABASE=${{MySQL.MYSQLDATABASE}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}

# Konfigurasi Storage & Session
BROADCAST_CONNECTION=log
FILESYSTEM_DISK=public
QUEUE_CONNECTION=sync
SESSION_DRIVER=database
SESSION_LIFETIME=120
```

*Tip: Menggunakan format `${{MySQL.MYSQLHOST}}` memudahkan karena Railway akan otomatis menghubungkan kredensial MySQL secara dinamis tanpa perlu menuliskan password manual secara statis.*

### Langkah 4: Konfigurasi Release Command (Validasi Database & Seeder Otomatis)
Agar database dimigrasikan secara otomatis pada setiap proses deployment baru:
1. Buka layanan utama aplikasi web Anda di Railway.
2. Masuk ke menu **Settings**.
3. Gulir ke bawah hingga bagian **Deploy**.
4. Cari kolom **Release Command**, lalu isi dengan salah satu perintah berikut sesuai kebutuhan Anda:
   * **Opsi A: Hanya Migrasi (Sangat Direkomendasikan untuk produksi)**:
     ```bash
     php artisan migrate --force
     ```
   * **Opsi B: Migrasi + Seeder Otomatis (Gunakan jika seeder aman dijalankan berulang kali)**:
     ```bash
     php artisan migrate --seed --force
     ```
     *(Catatan: Pastikan kode Seeder Anda bersifat aman/tidak menduplikasi data jika dijalankan berkali-kali pada setiap deploy).*
5. Klik **Save**.
*Catatan: Railway akan menjalankan perintah ini di kontainer sementara sebelum aplikasi Anda aktif. Jika migrasi gagal, deployment lama tetap berjalan aman (Zero Downtime Deployment).*

### Langkah 5: Hubungkan Domain & Selesai
1. Di tab **Settings** pada layanan utama Anda, cari bagian **Environment** -> **Domains**.
2. Klik **Generate Domain** untuk mendapatkan subdomain gratis dari Railway (misal: `sanjai-saiyo-production.up.railway.app`).
3. Salin domain tersebut dan pastikan Anda memperbarui variabel `APP_URL` di tab **Variables** menggunakan domain baru ini.
4. Railway akan memicu redeployment otomatis. Tunggu hingga proses build selesai.

---

## 🛠️ Penanganan Masalah & Tips Produksi

### 1. Bagaimana cara menjalankan Seed Data awal?
Jika Anda baru pertama kali mendeploy dan membutuhkan data awal (seperti admin default atau produk awal), Anda bisa menjalankan seeder lewat Railway CLI secara remote:
```bash
railway run php artisan db:seed --force
```
Atau tambahkan sementara di **Release Command**: `php artisan migrate:fresh --seed --force` (⚠️ **PERINGATAN**: Ini akan menghapus semua data yang ada, gunakan hanya saat inisialisasi pertama kali!).

### 2. Konfigurasi Link Simbolik (Storage Link)
Laravel menyimpan file upload di `storage/app/public` yang harus di-link ke `public/storage`.
* Di Railway, karena sistem file bersifat ephemeral (sementara), gambar yang diunggah secara lokal akan hilang saat deploy ulang.
* **Solusi Terbaik**: Untuk jangka panjang, disarankan mengonfigurasi penyimpanan cloud seperti AWS S3 atau Cloudinary.
* Untuk link lokal, Nixpacks akan otomatis membuat link selama proses build jika dijalankan perintah berikut dalam langkah build:
  ```bash
  php artisan storage:link
  ```
  *(Sudah ditangani secara otomatis di framework).*
