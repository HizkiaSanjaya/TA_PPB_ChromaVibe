# ChromaVibe

Aplikasi rekomendasi palet warna web berbasis estetika tema dan harmoni kontras.
Pengguna memilih satu warna primer dan satu tema seperti Y2K, Elegant, atau Cyberpunk.
Sistem menyusun lima peran warna: latar, permukaan, primer, aksen, dan teks. Setiap
pasangan teks dan latar diuji dengan rumus kontras WCAG, lalu diberi nilai AA atau AAA.

Dibuat oleh Hizkia Yosefha Wetrawatri Sanjaya (21120124130091), Kelompok 03 Shift 01,
sebagai Tugas Akhir Praktikum Pemrograman Perangkat Bergerak dengan platform
**Progressive Web App**.

| Layanan | Alamat |
| --- | --- |
| Aplikasi (PWA) | https://ta-ppb-chroma-vibe-nixt.vercel.app |
| API | https://ta-ppb-chroma-vibe.vercel.app |
| Repositori | https://github.com/HizkiaSanjaya/TA_PPB_ChromaVibe |

## Struktur repositori

```
api/                     REST API (Node.js, Express, Zod)
  src/lib/color/         konversi OKLCH, kontras WCAG, skema harmoni, PRNG
  src/lib/palette/       konfigurasi tema, generator, penamaan palet
  src/controllers/       logika permintaan
  src/routes/            pemetaan URL
  src/validators/        skema Zod
  src/data/              data contoh palet kurasi (dibangun otomatis)
  tests/                 uji unit dengan node:test
web/                     PWA (React, TypeScript, Vite, Tailwind)
  src/pages/             delapan halaman
  src/components/        komponen antarmuka bersama
  src/api/               klien HTTP dan tipe data
  src/sw.ts              service worker tulis tangan (precache, cache API, offline)
  scripts/               pembuat ikon PWA tanpa dependensi
supabase/
  schema.sql             DDL tabel palet
  seed.sql               data awal, dibangun otomatis
scripts/
  peta-kode.mjs          pembuat PETA-KODE.md, menghitung nomor baris otomatis
```

## Cara menjalankan

```bash
npm run instal          # pasang dependensi api/ dan web/
cp api/.env.example api/.env
cp web/.env.example web/.env
npm run dev             # API di http://localhost:3001
npm run dev:web         # PWA di http://localhost:5173
```

Uji dan pemeriksaan sebelum commit:

```bash
npm test                # 16 uji unit: konversi warna, kontras, determinisme
npm run check           # ESLint dan Prettier
npm run peta            # menghitung ulang PETA-KODE.md
```

`PETA-KODE.md` memetakan fitur ke berkas dan nomor baris, dipakai saat responsi. Nomornya
dihitung langsung dari sumber oleh `npm run peta`, jadi tidak basi saat kode berubah.

## Endpoint API

Semua endpoint memakai `GET` karena hasilnya deterministik, sehingga bisa di-cache
oleh service worker dan URL-nya bisa dibagikan. Bentuk respons selalu
`{ success, message, data }`.

| Endpoint | Kegunaan |
| --- | --- |
| `GET /api/v1/themes` | Daftar sepuluh tema beserta saran warna primer |
| `GET /api/v1/themes/:slug` | Detail satu tema |
| `GET /api/v1/themes/:slug/palettes` | Palet kurasi pada satu tema |
| `GET /api/v1/harmoni` | Enam skema harmoni warna |
| `GET /api/v1/palettes` | Seluruh palet kurasi |
| `GET /api/v1/palettes/generate` | Buat palet baru dari warna primer |
| `GET /api/v1/palettes/:id` | Detail satu palet kurasi |

Sepuluh tema tersedia: `y2k`, `elegant`, `classic`, `energetic`, `pastel`, `cyberpunk`,
`earthy`, `minimalis`, `brutalism`, dan `vintage`. Semuanya didefinisikan di
`api/src/lib/palette/themes.js` sebagai konfigurasi angka, bukan kode terpisah. Setiap tema
memiliki enam palet kurasi, jadi totalnya 60.

Halaman Generator juga menerima `terang` (10 sampai 100). Angka kecil membuat warna pilihan
lebih gelap, angka besar lebih terang, dan latar palet otomatis dipasang di sisi berlawanan
agar teksnya tetap lolos ambang keterbacaan.

Parameter `generate`: `base` (hex wajib), `tema` (wajib), `harmoni` (bawaan `triadik`),
`jumlah` 1 sampai 5, `seed` bilangan bulat, dan `terang` 10 sampai 100 untuk mengatur
kecerahan warna pilihan pengguna.

```bash
curl "http://localhost:3001/api/v1/palettes/generate?base=3B82F6&tema=y2k&harmoni=triadik&jumlah=3&seed=42"
```

## Cara kerja mesin warna

1. Warna primer dikonversi dari sRGB ke OKLab, lalu ke OKLCH. OKLCH dipakai karena
   kenaikan *lightness* yang sama terasa setara di seluruh *hue*, tidak seperti HSL yang
   menipu pada kuning dan biru.
2. Tema memberi pagar berupa rentang *chroma*, rencana *lightness* untuk latar dan teks,
   serta besaran jitter pada *hue*.
3. Skema harmoni menggeser *hue* primer sebesar offset tetap untuk memperoleh warna aksen.
4. Setiap warna dipetakan ke dalam gamut sRGB dengan menurunkan *chroma* secara iteratif,
   bukan memotong kanal, agar *hue* tidak bergeser.
5. Pasangan teks terhadap latar wajib mencapai 4.5 banding 1, sedangkan warna primer dan
   aksen terhadap latar wajib mencapai 3 banding 1. Bila belum, *lightness*-nya digeser
   bertahap sampai lolos.
6. Generator memakai PRNG berbenih, jadi kombinasi input yang sama selalu menghasilkan
   palet dan `id` yang sama. Sifat ini yang membuat palet hasil generator bisa dibuka
   kembali dari koleksi tanpa disimpan di server.

Seluruh 60 palet kurasi di `api/src/data/palet.kurasi.json` dihasilkan oleh fungsi yang
sama dan lolos 100 persen pasangan kontras. Berkas itu dibangun ulang dengan:

```bash
npm run seed
```

## Basis data

`schema.sql` berisi satu tabel, `palet`, dengan kolom `warna`, `pasangan_kontras`, dan
`ringkasan` bertipe `jsonb`. Tema tidak disimpan di tabel karena definisinya adalah
konfigurasi kode, sehingga tidak ada dua sumber kebenaran.

Proyek Supabase yang dipakai: `https://okwfivpuwyypaeehbvef.supabase.co`. Selama
`SUPABASE_SERVICE_ROLE_KEY` kosong, API otomatis memakai data contoh dari
`api/src/data/palet.kurasi.json` dan menulis satu peringatan di log, sehingga demo tetap
bisa jalan tanpa basis data.

Langkah menyiapkan Supabase:

1. Jalankan `supabase/schema.sql` di SQL Editor. Berkas ini memuat `GRANT` untuk role
   `anon`, `authenticated`, dan `service_role`. Tanpa blok itu, permintaan gagal dengan
   kode `42501 permission denied` walau kuncinya benar.
2. Jalankan `supabase/seed.sql` untuk mengisi 60 palet kurasi.
3. Isi `SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY` pada environment variables.
4. Nyalakan ulang API. Peringatan data contoh tidak muncul lagi.

Id palet kurasi diturunkan dari slug lewat MD5, bukan dibiarkan acak oleh Postgres. Dengan
begitu JSON cadangan dan tabel Supabase memakai uuid yang sama, sehingga tautan `/palet/:id`
dan palet yang sudah tersimpan di koleksi tetap valid walau sumber data berganti.

Kunci `SUPABASE_SERVICE_ROLE_KEY` hanya dipakai di sisi server dan tidak pernah dikirim
ke klien.

## Pemasangan sebagai PWA

Buka aplikasi di browser ponsel, lalu pilih "Tambahkan ke layar utama" atau "Install app".
Progressive Web App ini memiliki manifest, ikon 192 dan 512 termasuk versi *maskable*,
serta *service worker* yang menyimpan kerangka aplikasi dan hasil API.

Strategi cache dikerjakan oleh `web/src/sw.ts` yang ditulis tangan, bukan dibangkitkan
otomatis, supaya setiap keputusan bisa dijelaskan saat responsi:

- Kerangka aplikasi (HTML, CSS, JS, ikon) di-*precache* saat instalasi, dengan URL
  dideduplikasi karena `Cache.addAll` menolak daftar berisi entri kembar.
- `GET /api/v1/**` memakai *stale while revalidate* dengan batas 80 entri. Jawaban lama
  tetap sah karena hasil generator deterministik.
- Navigasi memakai *network first*, lalu jatuh ke cache halaman yang pernah dibuka, lalu
  ke `index.html` dari *precache*.
- Saat jaringan mati dan permintaan belum pernah dimuat, API mengembalikan `503` dengan
  pesan JSON yang jelas, bukan halaman galat bawaan browser.

Halaman yang pernah dibuka tetap tampil saat jaringan mati, dan ada penanda "Mode offline"
di bagian atas.

## Deployment

API dan PWA dipisah agar masing-masing punya `vercel.json` sendiri.

```bash
# API
cd api
npx vercel --prod

# PWA
cd web
# isi VITE_API_URL dengan URL API hasil deployment di atas
npx vercel --prod
```

Untuk PWA, tambahkan `rewrite` ke `index.html` agar rute seperti `/tema/y2k` tidak 404
saat dibuka langsung. Konfigurasi berikut disimpan sebagai `vercel.json` di dalam `web/`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## Kriteria tugas akhir

| Ketentuan | Pemenuhan |
| --- | --- |
| Memakai API buatan sendiri | `api/` dengan 7 endpoint, dokumentasi di atas |
| Bottom navigation bar | Lima tab: Beranda, Jelajah, Generator, Koleksi, Tentang |
| Minimal 5 halaman | 8 rute: beranda, jelajah, detail tema, detail palet, generator, koleksi, tentang, 404 |
| 2 halaman daftar dengan detail | Tema ke palet, dan koleksi ke detail palet |
| Halaman profil atau tentang | Halaman Tentang berisi penyusun, teknologi, dan daftar endpoint |
| Source code di GitHub | Repositori ini |
| PWA di-deploy ke hosting gratis | Vercel |

## Catatan pengujian

- `npm test` menjalankan 16 uji: putaran konversi hex ke OKLCH dan kembali, nilai acuan
  kontras WCAG, kontras teks minimum pada seluruh tema, dan determinisme generator.
- Lighthouse untuk beranda, generator, tentang, detail tema, dan detail palet: 100 pada
  aksesibilitas, praktik terbaik, dan SEO.
- Mode offline diuji dengan mematikan server API lalu memuat ulang halaman. Daftar tema
  tetap tampil dari cache.

## Lisensi

Dibuat untuk keperluan akademik, Praktikum Pemrograman Perangkat Bergerak,
Teknik Komputer Universitas Diponegoro.
