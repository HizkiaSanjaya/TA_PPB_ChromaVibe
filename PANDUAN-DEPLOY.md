# Panduan Deploy

Tiga layanan yang dipakai: GitHub untuk sumber kode, Supabase untuk basis data, Vercel
untuk hosting API dan PWA. Kerjakan berurutan.

## 1. GitHub

```bash
cd "D:\Kuliah\5_Praktikum Pemroraman Perangkat Bergerak\TA"
git remote -v          # sudah terpasang ke repositori ini
git status
git add .
git commit -m "pesan"
git push
```

Pastikan berkas `.env` tidak ikut terkirim. Berkas `.gitignore` sudah mengecualikannya.
Periksa dengan `git status` sebelum commit.

Riwayat repositori ini sudah dipecah menjadi tujuh commit bertema: lapisan warna, tema dan
generator, endpoint, skema basis data, PWA, lalu dokumentasi. Pertahankan pola itu untuk
perubahan berikutnya, jangan menumpuk semuanya dalam satu commit.

## 2. Supabase

1. Proyek sudah dibuat: `https://okwfivpuwyypaeehbvef.supabase.co`.
2. Buka SQL Editor, tempel seluruh isi `supabase/schema.sql`, lalu Run.
3. Tempel seluruh isi `supabase/seed.sql`, lalu Run. Ini mengisi 30 palet kurasi.
4. Buka Project Settings, API Keys. Kunci `service_role` disimpan hanya di `api/.env` lokal`n   dan di Environment Variables Vercel, tidak pernah di berkas yang di-commit.
5. Jangan pakai kunci `anon` untuk server. Kunci `service_role` melewati Row Level Security
   dan hanya boleh berada di environment variables Vercel.

Bila isi palet diubah, jalankan `npm run seed` lalu ulangi langkah 3. Skrip itu menulis
ulang `supabase/seed.sql` dengan `on conflict (slug) do update`, sehingga aman dijalankan
berkali-kali: baris lama diperbarui, bukan diduplikasi.

## 3. Vercel untuk API

```bash
cd "D:\Kuliah\5_Praktikum Pemroraman Perangkat Bergerak\TA\api"
npx vercel
```

Saat diminta, atur:

| Pertanyaan | Isi |
| --- | --- |
| Set up and deploy | Y |
| Which scope | akun pribadi |
| Link to existing project | N |
| Project name | chromavibe-api |
| Directory | `.` (folder `api` saat ini) |
| Override settings | N |

Tambahkan environment variables pada dasbor Vercel, menu Settings lalu Environment
Variables:

```
SUPABASE_URL=https://okwfivpuwyypaeehbvef.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
CORS_ORIGIN=https://chromavibe.vercel.app
PORT=3001
```

`CORS_ORIGIN` boleh berisi beberapa alamat dipisah koma, misalnya juga
`http://localhost:5173` untuk pengembangan. Setelah variabel tersimpan, jalankan
`npx vercel --prod` dan uji:

```bash
curl "https://chromavibe-api.vercel.app/api/v1/themes"
```

Bila muncul galat 503 dengan pesan Supabase belum dikonfigurasi, artinya environment
variables belum terbaca. Nyalakan ulang deployment, jangan menambal controller.

## 4. Vercel untuk PWA

Sebelum deploy, isi `web/.env` dengan URL API hasil langkah 3:

```
VITE_API_URL=https://chromavibe-api.vercel.app
```

Lalu:

```bash
cd "D:\Kuliah\5_Praktikum Pemroraman Perangkat Bergerak\TA\web"
npm run build
npx vercel
```

Atur project name `chromavibe`, directory `.`. Berkas `web/vercel.json` sudah memuat
*rewrite* ke `index.html` supaya rute seperti `/tema/y2k` tidak 404 ketika dibuka
langsung atau dimuat ulang.

Kembali ke dasbor API, perbarui `CORS_ORIGIN` dengan alamat PWA yang sebenarnya, lalu
deploy ulang API. Tanpa langkah ini, browser akan memblokir permintaan karena berbeda
*origin*.

## 5. Pemeriksaan akhir

1. Buka alamat PWA di ponsel. Daftar tema harus muncul.
2. Buka satu tema, satu palet, lalu tekan Simpan.
3. Buka tab Koleksi, pastikan palet tersimpan.
4. Pasang ke layar utama, buka dalam mode *standalone*, pastikan tidak ada bilah alamat.
5. Matikan data seluler, muat ulang aplikasi. Kerangka aplikasi dan palet yang pernah
   dibuka harus tetap tampil, dengan penanda "Mode offline" di atas.
6. Jalankan Lighthouse pada mode *mobile*. Sasaran: aksesibilitas, praktik terbaik, dan
   SEO bernilai 100, serta aplikasi terdeteksi *installable*.

## 6. Yang perlu diperbarui sebelum dikumpulkan

- `web/src/konfigurasi.ts`: nama, NIM, nama asisten, tautan repositori.
- `web/.env`: `VITE_API_URL` menuju alamat API produksi.
- `README.md`: tambahkan tautan deploy dan tangkapan layar bila ada.
- Kolom GitHub dan tautan deploy pada lembar asistensi.
