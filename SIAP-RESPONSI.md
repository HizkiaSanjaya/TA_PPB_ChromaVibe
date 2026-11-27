# Siap Responsi

Dokumen ini untuk dibaca 15 menit sebelum masuk. Isinya urutan demo, letak fitur,
isi tiap berkas, dan jawaban pertanyaan yang paling mungkin muncul.

Dua berkas pendamping, jangan lupa dibuka:

- `PETA-KODE.md` — fitur ada di berkas dan baris mana
- `INVENTARIS-FUNGSI.md` — isi lengkap tiap berkas, semua fungsi dan barisnya

Keduanya dibuat otomatis dari kode. Nomornya tidak akan meleset.

---

## 1. Sebelum berangkat

Kerjakan berurutan. Kalau ada yang gagal, selesaikan dulu sebelum masuk ruang.

**Pastikan Supabase tidak sedang tidur.** Proyek gratis Supabase di-_pause_ kalau
seminggu tidak dipakai. Buka dasbor Supabase, atau panggil alamat ini di browser:

```
https://ta-ppb-chroma-vibe.vercel.app/health
```

Harus muncul `"status":"ok"`. Kalau gagal atau lambat sekali, buka dasbor Supabase
dan pulihkan proyeknya. Tunggu sampai hijau.

**Buka aplikasi di HP sekali.** Pakai Chrome. Pastikan daftar tema muncul, dan
aplikasinya sudah terpasang di layar utama. Ini yang akan ditunjukkan saat demo.

**Siapkan dua terminal laptop.** Karena PowerShell di laptopmu memblokir skrip,
pakai `npm.cmd`, bukan `npm`:

Terminal pertama:

```
cd "D:\Kuliah\5_Praktikum Pemroraman Perangkat Bergerak\TA"
npm.cmd run dev
```

Tunggu sampai muncul `ChromaVibe API berjalan di http://localhost:3001`.

Terminal kedua, tab baru:

```
npm.cmd run dev:web
```

Tunggu sampai muncul `http://localhost:5173`, lalu buka di browser.

Kalau lupa cara memperbaiki PowerShell, ada di bagian 6.

**Siapkan GitHub di tab browser.** Buka repositori yang sudah login, supaya kalau
diminta menunjukkan riwayat commit, tinggal pindah tab.

---

## 2. Alur demo, urutan klik dan kalimatnya

Ini urutan yang aku sarankan. Total sekitar tujuh menit.

**Pembuka, jangan langsung klik.** Katakan dulu masalahnya.

> "Aplikasi ini untuk orang yang mau bikin tampilan web tapi bingung mau pakai
> warna apa. Biasanya orang berhenti di satu warna yang dia suka, terus bingung
> dipasangkan dengan apa dan tulisannya masih kebaca atau tidak. Di sini dia
> cukup pilih satu warna dan satu tema, sisanya disusun otomatis."

**Langkah 1. Beranda.**

Tunjukkan sepuluh kartu tema. Sebut bahwa tiap kartu bentuknya beda, bukan cuma
warnanya, karena karakternya beda. Sebut juga lima tab di bawah.

> "Ada lima tab: Beranda, Panduan, Generator, Koleksi, Tentang."

**Langkah 2. Buka satu tema, misalnya Brutalism.**

Tunjukkan enam palet contoh.

> "Isinya dari API, bukan data yang ditulis di tampilan."

**Langkah 3. Buka satu palet.**

Tunjukkan miniatur antarmuka dan lima peran warna beserta kodenya. Jangan berhenti
di kotak warna, tunjukkan bahwa yang di atasnya adalah contoh pemakaian.

> "Lima warna ini punya tugas masing-masing: latar, kartu, warna utama, warna
> kedua, dan teks. Yang ditampilkan di atas bukan kotak warna, tapi contoh
> pemakaiannya."

**Langkah 4. Tekan Simpan, lalu buka tab Koleksi.**

> "Tersimpan di perangkat, tidak perlu akun. Jadi tetap ada walau internet mati."

**Langkah 5. Buka tab Generator. Ini bagian paling penting, jangan terburu-buru.**

Tunjukkan tiga hal berurutan:

1. Pilih warna dari daftar nama, misalnya Merah.
2. Pilih tema Brutalism, tunjukkan hasilnya.
3. Ganti tema ke Elegant, tunjukkan hasilnya berubah jelas.

Kalimat kuncinya:

> "Bedanya kelihatan. Brutalism membolehkan warna pekat, Elegant membatasinya jadi
> lebih kalem. Tema yang menentukan seberapa pekat warna boleh tampil."

Lalu tunjukkan pengatur kecerahan 10 sampai 100 persen, dan roda harmoni.

> "Kecerahan mengatur warna pilihannya. Latar otomatis menyesuaikan, karena kalau
> tidak, tulisannya tidak akan terbaca."

**Langkah 6. Tab Panduan.**

Tunjukkan bagian "Tema mengubah kepekatan warna" lebih dulu. Empat kartu di situ
memakai warna dasar merah yang sama, tapi hasilnya beda: Brutalism pekat, Elegant
pucat, Cyberpunk gelap menyala, Minimalis nyaris tanpa warna. Ini bukti paling
cepat bahwa tema bukan sekadar ganti warna.

> "Warna dasarnya sama, yang beda aturannya. Tema yang menentukan seberapa pekat
> warna boleh tampil. Bagian bawahnya enam harmoni, juga pakai warna dasar yang
> sama, jadi yang berubah cuma warna keduanya."

**Langkah 7. Tab Tentang.** Sebut penyusun, lalu tunjukkan daftar endpoint.

**Langkah 8. Pasang ke HP.** Tunjukkan aplikasi di layar utama, buka dari ikonnya,
tunjukkan bahwa tidak ada bilah alamat. Sebut bahwa halaman yang sudah dibuka
masih bisa dibuka saat internet dimatikan.

---

## 3. Fitur ada di mana

Tabel ini untuk dipakai kalau penguji menunjuk layar lalu bertanya "kodenya mana".

| Yang ditunjuk           | Berkas                                  | Baris |
| ----------------------- | --------------------------------------- | ----- |
| Navigasi bawah lima tab | `web/src/components/BottomNav.tsx`      | 8     |
| Daftar rute halaman     | `web/src/App.tsx`                       | 17    |
| Daftar tema di beranda  | `web/src/pages/Beranda.tsx`             | 30    |
| Daftar palet per tema   | `web/src/pages/DetailTema.tsx`          | 89    |
| Rincian palet           | `web/src/pages/DetailPalet.tsx`         | 78    |
| Pilihan warna bernama   | `web/src/data/warna-umum.ts`            | 9     |
| Pengatur kecerahan      | `api/src/lib/palette/generator.js`      | 91    |
| Roda warna harmoni      | `web/src/components/RodaWarna.tsx`      | 13    |
| Halaman Panduan         | `web/src/pages/Panduan.tsx`             | 37    |
| Simpan ke koleksi       | `web/src/hooks/useKoleksi.ts`           | 55    |
| Pemasangan PWA          | `web/src/hooks/usePasang.ts`            | 21    |
| Cache dan offline       | `web/src/sw.ts`                         | 32    |
| Rumus keterbacaan       | `api/src/lib/color/contrast.js`         | 9     |
| Konversi warna          | `api/src/lib/color/space.js`            | 153   |
| Daftar endpoint         | `api/src/app.js`                        | 65    |
| Validasi masukan        | `api/src/validators/palet.validator.js` | 14    |

---

## 4. Kalau disuruh menjelaskan satu berkas

Ini yang paling bikin panik, padahal mudah kalau tahu polanya. Semua berkas di
proyek ini punya pola yang sama: bagian atas berisi impor, lalu konstanta, lalu
fungsi utama, lalu fungsi pembantu.

Kalau berkas yang dibuka tidak ada di hafalanmu, buka `INVENTARIS-FUNGSI.md`,
cari nama berkasnya, lalu baca tabelnya. Semua fungsi dan barisnya ada di sana.

Enam berkas yang paling mungkin dibuka, beserta isinya:

**`api/src/lib/palette/generator.js`** — inti aplikasi, 292 baris.
Fungsi `tegakkanKontras` baris 34 (menggeser kecerahan sampai lolos uji),
`sidikPalet` baris 48 (membuat id palet dari isinya), `buatPalet` baris 58
(menyusun satu palet), `buatDaftarPalet` baris 246 (menyusun beberapa palet
sekaligus), `saranWarnaTema` baris 283 (warna awal per tema).

**`api/src/lib/color/space.js`** — 159 baris, semua konversi warna.
Yang sering ditanya: `hexKeOklch` baris 153 (dari kode hex jadi tiga angka),
`oklchKeHex` baris 149 (kebalikannya), `petakanGamut` baris 125 (menurunkan
kepekatan kalau warnanya di luar jangkauan layar).

**`api/src/lib/color/contrast.js`** — 50 baris, hitungan keterbacaan.
`luminansiRelatif` baris 4, `rasioKontras` baris 9, `nilaiWcag` baris 21,
`periksaPasangan` baris 32.

**`web/src/pages/Generator.tsx`** — 419 baris, berkas terpanjang di sisi tampilan.
Bagian atas: konstanta bawaan dan dua fungsi kecil (`keSeed`, `keTerang`).
Komponen `KartuHasil` baris 35 (tampilan satu palet di daftar hasil).
Komponen `Generator` baris 63 (seluruh halaman), dengan fungsi dalam `ubah` baris
84 (menulis pengaturan ke URL) dan `terapkanTeks` baris 93 (membaca kode hex yang
diketik).

**`web/src/sw.ts`** — 189 baris, service worker.
Empat pendengar: `install` baris 32, `activate` baris 49, `fetch` baris 147,
`message` baris 169. Fungsi pembantu: `simpan` baris 61, `pangkasCacheApi` baris
72, `layaniApi` baris 86, `layaniNavigasi` baris 113, `layaniAset` baris 137.

**`api/src/app.js`** — 92 baris, titik masuk server.
Middleware CORS baris 23, header cache baris 27, rute `/` baris 34, `/health`
baris 54, tiga router baris 65 sampai 67, penangan 404 baris 69, penangan galat
baris 73.

Kalau ditanya "ini kelas atau fungsi", jawab saja apa adanya. Hampir semuanya
fungsi. Yang benar-benar kelas hanya dua: `ApiError` di
`api/src/utils/ApiError.js` dan `KesalahanApi` di `web/src/api/client.ts`.

---

## 5. Pertanyaan yang paling mungkin muncul

**Kenapa frontend dan backend dipisah?**
Karena syaratnya minta API buatan sendiri. Kalau semua digabung, tidak ada API
yang bisa dipanggil. Selain itu, API-nya jadi bisa dipakai aplikasi lain, dan
keduanya bisa diperbaiki sendiri-sendiri.

**Mana yang frontend, mana yang backend?**
Yang di layar dan bisa diklik, folder `web/`. Yang isinya JSON, folder `api/`.

**Kenapa pakai OKLCH, bukan HSL?**
Di HSL, dua warna yang angkanya sama bisa kelihatan beda terangnya, terutama
kuning dan biru. Di OKLCH, angka terang yang sama terasa sama di semua warna.
Jadi rencana terang-gelap tiap tema bisa diandalkan.

**Bagaimana aplikasi memastikan tulisan terbaca?**
Setelah lima warna tersusun, aplikasi menghitung perbedaan terang tiap pasangan.
Teks dan warna utama wajib 4,5 banding 1 terhadap latar dan kartu. Kalau belum,
kecerahannya digeser sedikit demi sedikit sampai lolos. Jadi bukan hanya
diperiksa, tapi dipaksa lolos. Angka 4,5 itu standar WCAG, bukan angka buatan
sendiri.

**Kenapa generator pakai GET, bukan POST?**
Karena hasilnya bisa diulang dan tidak ada data yang ditulis. GET bisa disimpan
di cache, dan alamatnya bisa dibagikan. POST kehilangan keduanya tanpa
keuntungan apa pun.

**Kenapa hasilnya selalu sama untuk pengaturan yang sama?**
Karena angka acaknya diberi benih dari kombinasi warna, tema, harmoni, dan
kecerahan. Bukan acak bebas.

**Dari mana angka tema dan warnanya?**
Disusun sendiri, bukan menyalin dari situs mana pun. Dasarnya pemahaman umum soal
gaya tersebut. Yang dijamin aplikasi bukan selera, tapi keterbacaan, dan itu
diuji otomatis.

**Kenapa temanya cuma sepuluh?**
Tema itu konfigurasi angka, bukan isi database. Nambah tema ke-11 cukup nambah
satu objek di `api/src/lib/palette/themes.js`, tanpa menyentuh kode lain.

**Kenapa nama palet seperti "Merah Kasar"?**
Dibentuk dari keluarga warna yang dihitung dari posisinya, ditambah kata sifat
tema. Supaya tiap palet bisa disebut tanpa membacakan enam kode hex.

**Kenapa favorit tidak disimpan di database?**
Karena tidak ada login. Menyimpan di server memaksa membuat identitas perangkat,
dan itu tidak sepadan. Disimpan di `localStorage`, jadi tetap ada tanpa jaringan.

**Apa yang terjadi kalau Supabase mati?**
API memakai berkas contoh di `api/src/data/palet.kurasi.json` dan menulis satu
peringatan di log. Demo tetap jalan.

**Apakah PWA-nya benar-benar bekerja?**
Ya. Ada manifest dengan tiga ikon dan `display: standalone`, ada service worker
yang menyimpan kerangka aplikasi dan jawaban API. Sudah diuji dengan mematikan
server, halaman yang pernah dibuka tetap tampil.

**Apakah kunci database aman?**
Kunci rahasia Supabase hanya dipakai di sisi server, disimpan sebagai environment
variable, dan tidak pernah dikirim ke browser. Berkas `.env` tidak ikut diunggah
ke GitHub.

**Apa yang belum ada?**
Ini jawaban jujur, lebih baik disiapkan. Belum ada login, belum bisa menambah
palet dari dalam aplikasi, semua endpoint hanya membaca, dan tema belum
berdasarkan riset desain.

---

## 6. Kalau yang ditanya backend dan database

Bagian ini yang paling sering ditanya karena syarat tugasnya menuntut API sendiri.
Semua angka dan perilaku di bawah sudah diperiksa langsung ke alamat produksi,
bukan dari ingatan.

### Alur satu permintaan, dari klik sampai data tampil

Ini jawaban untuk "bagaimana hubungan BE dan FE". Sebutkan berurutan, jangan
melompat.

1. Pengguna membuka Beranda. Komponen `Beranda` memanggil `api.daftarTema()`.
2. `api.daftarTema()` ada di `web/src/api/client.ts` baris 45. Fungsi itu
   memanggil `ambil()` baris 15, yang menyusun alamat
   `${DASAR_API}/api/v1/themes` lalu memakai `fetch`.
3. `DASAR_API` baris 3 diambil dari `import.meta.env.VITE_API_URL`. Nilai itu
   ditanam saat build, jadi di produksi isinya
   `https://ta-ppb-chroma-vibe.vercel.app`. Sudah kuperiksa: alamat itu memang
   ada di dalam bundel JavaScript yang disajikan Vercel.
4. Permintaan masuk ke Express. `api/src/app.js` baris 65 meneruskan ke
   `tema.routes.js`, yang memanggil `listTema`.
5. `listTema` baris 27 di `api/src/controllers/tema.controller.js` menghitung
   jumlah palet lewat `hitungPaletPerTema()`, lalu menyusun data dari `TEMA`.
6. `hitungPaletPerTema()` di `api/src/config/sumber-data.js` baris 101 memilih
   jalur: Supabase kalau terkonfigurasi, berkas contoh kalau tidak.
7. Hasilnya dibungkus `ok()` di `api/src/utils/response.js` baris 1, jadi
   bentuknya selalu `{ success, message, data }`.
8. Kembali di browser, `ambil()` memeriksa `respons.ok` dan `isi.success`, lalu
   mengembalikan `isi.data` saja. Komponen tidak pernah menyentuh bentuk
   pembungkusnya.
9. React Query menyimpan hasilnya di cache, dan React menggambar kartu.

Kalimat ringkas yang bisa diucapkan:

> "Frontend tidak pernah bicara langsung ke database. Dia hanya bicara ke API
> lewat fetch. API yang memegang kunci database, memvalidasi masukan, dan
> membungkus jawaban jadi bentuk yang seragam."

### Di mana mereka bertukar informasi

Bukan lewat file bersama, bukan lewat import. Lewat HTTP dengan format JSON.
Buktinya bisa ditunjukkan dengan membuka DevTools, tab Network, lalu memilih satu
permintaan `themes`. Akan terlihat isi jawaban yang sama persis dengan yang
dipakai tampilan.

Kontraknya ada di dua tempat: bentuk yang dikirim API, dan bentuk yang
diharapkan tampilan. Yang kedua ditulis di `web/src/api/types.ts`. Kalau bentuk
data di API berubah, berkas itu yang harus ikut diubah. Ini alasan sebenarnya
kenapa versi cache service worker perlu dinaikkan setiap kali bentuk data
berubah, karena kalau tidak, tampilan bisa menerima bentuk lama dari cache.

### Express dipakai untuk apa

Express adalah kerangka kerja HTTP untuk Node.js. Tanpa Express, semua hal
berikut harus ditulis manual memakai modul `http` bawaan Node.

| Yang Express kerjakan di proyek ini          | Letaknya                                |
| -------------------------------------------- | --------------------------------------- |
| Membaca URL dan memilih penangan yang sesuai | `app.use('/api/v1/themes', temaRoutes)` |
| Mengurai query string jadi objek             | `req.query` di `generatePalet`          |
| Mengurai badan JSON                          | `express.json({ limit: '32kb' })`       |
| Menyisipkan middleware berurutan             | CORS, header cache, lalu rute           |
| Mengumpulkan galat ke satu tempat            | `app.use((err, req, res, next) => ...)` |
| Mengirim jawaban JSON dengan kode status     | `res.status(200).json(...)`             |

Yang paling sering ditanya: kenapa Express dan bukan yang lain. Jawabannya
sederhana. Express dipakai karena rutenya ringkas, middleware-nya jelas, dan
didukung Vercel sebagai fungsi Node tanpa konfigurasi tambahan. Untuk API tujuh
endpoint, menukar kerangka kerja tidak memberi keuntungan apa pun.

### Kenapa frontend dan backend sama-sama di Vercel

Karena keduanya adalah dua proyek Vercel yang terpisah, bukan satu. Yang sama
hanya penyedianya, bukan prosesnya.

|                   | API                                    | PWA                                  |
| ----------------- | -------------------------------------- | ------------------------------------ |
| Folder            | `api/`                                 | `web/`                               |
| Alamat            | `ta-ppb-chroma-vibe.vercel.app`        | `ta-ppb-chroma-vibe-nixt.vercel.app` |
| Jenis             | Fungsi Node (`@vercel/node`)           | Berkas statis hasil build Vite       |
| Konfigurasi       | `api/vercel.json`                      | `web/vercel.json`                    |
| Isi `vercel.json` | Semua rute diarahkan ke `api/index.js` | Semua rute diarahkan ke `index.html` |
| Repo GitHub       | sama                                   | sama                                 |

Alasan memilih Vercel untuk keduanya: satu akun, satu riwayat commit, deploy
otomatis dari `main`, dan paket gratisnya cukup. Yang penting ditegaskan, keduanya
tetap bisa dipisah kapan saja. API bisa dipindah ke tempat lain tanpa menyentuh
tampilan, cukup ganti `VITE_API_URL` lalu build ulang.

Bukti bahwa keduanya benar-benar terpisah: alamatnya beda, dan API punya
`vercel.json` sendiri yang mengarahkan seluruh permintaan ke satu fungsi Node.

### Kenapa API memakai satu fungsi untuk semua rute

Karena Vercel menjalankan fungsi Node per permintaan. Satu berkas `api/index.js`
yang mengekspor aplikasi Express sudah cukup, lalu `api/vercel.json` mengarahkan
seluruh rute ke berkas itu. Di laptop, `src/server.js` yang menyalakan pendengar
HTTP. Perbedaan ini yang membuat kode yang sama bisa jalan di dua tempat.

### Bagaimana keamanan sambungannya

Dua hal yang sudah aktif dan bisa dibuktikan.

**CORS dikunci.** `api/src/app.js` baris 12 membaca `CORS_ORIGIN` dari environment
variable, dipisah koma. Aku uji langsung ke produksi:

- Permintaan dengan `Origin: https://ta-ppb-chroma-vibe-nixt.vercel.app`
  mendapat `access-control-allow-origin` yang sama dengan alamat itu.
- Permintaan dengan origin asing tidak mendapat header itu sama sekali, sehingga
  browser menolak membacanya.

**Kunci database tidak pernah sampai ke browser.** `SUPABASE_SERVICE_ROLE_KEY`
hanya dibaca di `api/src/config/supabase.js` baris 4. Sudah kuperiksa bundel
JavaScript yang dikirim ke browser: yang ada hanya alamat API, tidak ada kunci
Supabase.

Satu hal yang jujur perlu disebut: API ini tidak punya autentikasi, karena semua
endpoint hanya membaca dan datanya memang publik. Kalau nanti ada endpoint tulis,
autentikasi harus ditambahkan sebelum endpoint itu dibuat.

### Database: apa yang disimpan dan apa yang tidak

Ini bagian yang paling mungkin ditanya. Satu tabel saja.

```sql
create table palet (
  id uuid primary key default gen_random_uuid(),
  tema_slug text not null,
  slug text not null unique,
  nama text not null,
  harmoni text not null,
  warna jsonb not null,
  pasangan_kontras jsonb not null default '[]'::jsonb,
  ringkasan jsonb,
  dibuat_pada timestamptz not null default now()
);
create index idx_palet_tema_slug on palet (tema_slug);
```

Yang perlu dijelaskan satu per satu kalau ditanya.

**Kenapa hanya satu tabel.** Tema dan harmoni tidak disimpan di database karena
keduanya konfigurasi kode, bukan data yang berubah oleh pengguna. Tema ada di
`api/src/lib/palette/themes.js`, harmoni di `api/src/lib/color/harmony.js`.
Kalau diduplikasi ke tabel, akan ada dua sumber kebenaran yang cepat melenceng.
Alasan ini juga ditulis sebagai komentar di baris 4 `supabase/schema.sql`.

**Kenapa `warna` bertipe `jsonb`, bukan tabel terpisah.** Lima warna selalu
dibaca bersama sebagai satu kesatuan dan tidak pernah dicari satu per satu.
Memecahnya jadi tabel `warna` akan menambah satu join tanpa manfaat. `jsonb`
dipilih, bukan `json`, karena `jsonb` menyimpan dalam bentuk terurai sehingga
bisa diindeks dan dibaca lebih cepat.

**Kenapa `id` bertipe `uuid`.** Supaya id tidak bisa ditebak dan tidak bentrok
kalau data dibangun ulang. Nilainya diturunkan dari slug secara deterministik
saat seed, bukan dibiarkan acak, supaya tautan `/palet/:id` tetap sama antara
berkas contoh dan tabel Supabase.

**Kenapa ada indeks di `tema_slug`.** Karena satu-satunya penyaringan yang sering
dilakukan adalah "palet milik tema ini". Tanpa indeks, Postgres memindai 60 baris.
Dengan 60 baris bedanya belum terasa, tapi ini kebiasaan yang benar untuk tabel
yang nanti tumbuh.

**Kenapa `pasangan_kontras` disimpan, bukan dihitung ulang.** Hasil hitungannya
sudah pasti untuk palet kurasi, jadi menyimpan hasil akhirnya membuat API cukup
mengirim data. Generator tetap menghitung sendiri karena masukannya bebas.

**Kenapa RLS diaktifkan padahal server memakai service role.** Karena service
role melewati RLS, jadi RLS bukan pengaman untuk server. Yang diamankan adalah
akses langsung dari luar. Kebijakan `palet_baca_publik` hanya mengizinkan
`select` untuk role `anon`, sehingga tidak ada yang bisa menulis lewat kunci
publik. Ini juga yang membuat data bisa diperiksa dari dasbor Supabase.

**Kenapa ada blok `grant`.** Tabel yang dibuat lewat SQL Editor tidak otomatis
mendapat hak akses untuk role API. Tanpa `grant`, permintaan gagal dengan kode
`42501 permission denied` walau kuncinya benar. Ini kesalahan nyata yang pernah
terjadi di proyek ini dan sudah diperbaiki di `schema.sql` baris 29 sampai 31.

### Bagaimana data masuk ke database

Bukan lewat aplikasi, tapi lewat seed yang dijalankan manual.

`npm run seed` menjalankan `api/scripts/bangun-seed.js`, yang memakai generator
yang sama dengan API untuk membuat 60 palet kurasi, lalu menulis
`supabase/seed.sql`. Berkas itu berisi 60 baris `insert` dengan
`on conflict (slug) do update`, jadi menjalankannya dua kali tidak menggandakan
data. Jalankan isinya di SQL Editor Supabase.

Yang perlu disebut: 60 palet itu hasil hitungan generator, bukan angka karangan.
Karena itu ada `npm run seed:build`, bukan sekadar berkas SQL yang ditulis tangan.

### Endpoint yang ada, dan bukti bahwa hanya membaca

Tujuh endpoint, semuanya `GET`.

```
GET /health
GET /api/v1/themes
GET /api/v1/themes/:slug
GET /api/v1/themes/:slug/palettes
GET /api/v1/harmoni
GET /api/v1/palettes
GET /api/v1/palettes/generate?base=&tema=&harmoni=&jumlah=&seed=
GET /api/v1/palettes/:id
```

Sudah kuuji langsung ke produksi:

- `POST /api/v1/palettes` membalas `404 Endpoint tidak ditemukan`, karena tidak
  ada rute tulis yang didaftarkan.
- `GET /api/v1/palettes/generate?base=ZZZ` membalas `400` dengan
  `{"field":"base","message":"Warna primer harus format #RRGGBB"}`.
- `GET /api/v1/palettes/tidak-ada` membalas `404 Palet tidak ditemukan`.

Tiga contoh itu bagus untuk didemokan karena menunjukkan validasi dan penanganan
galat bekerja, bukan hanya jalur bahagia.

### Kalau Supabase mati atau belum diisi

`api/src/config/supabase.js` baris 6 hanya membuat klien kalau dua variabel
lingkungan terisi. Kalau tidak, `supabase` bernilai `null`, dan
`sumber-data.js` otomatis memakai `api/src/data/palet.kurasi.json` sambil menulis
satu peringatan di log. Aplikasi tetap jalan penuh.

Ini keputusan sadar, bukan kebetulan: demo tidak boleh gagal hanya karena proyek
gratis Supabase sedang tidur. Kalau ditanya apa bedanya data contoh dan data
Supabase, jawab bahwa isinya sama, karena keduanya dibangun dari seed yang sama,
hanya tempat penyimpanannya yang berbeda.

### Kenapa tidak ada Prisma atau ORM

Karena yang dibutuhkan hanya membaca satu tabel dan menyaring dengan satu kolom.
`@supabase/supabase-js` sudah menyediakan itu. Menambah Prisma berarti menambah
skema terpisah, proses generate, dan satu lapisan yang harus dijelaskan saat
responsi, tanpa keuntungan yang sepadan.

### Pertanyaan lanjutan yang mungkin muncul

**Kalau data ditulis dari dua tempat, bagaimana konsistensinya?**
Saat ini hanya satu tempat yang menulis, yaitu seed manual. Aplikasi tidak
menulis apa pun. Karena itu tidak ada risiko bentrok.

**Kenapa tidak ada migrasi seperti Flyway atau Prisma Migrate?**
Karena skemanya satu tabel dan berubah sangat jarang. Berkas `schema.sql` yang
idempoten, memakai `create table if not exists`, sudah cukup. Kalau tabelnya
bertambah banyak, migrasi berversi baru masuk akal.

**Kalau 60 palet jadi 60.000, apa yang berubah?**
Yang pertama diubah adalah paginasi pada `GET /api/v1/palettes`, karena sekarang
endpoint itu mengirim seluruh baris. Indeks `tema_slug` sudah siap. `jsonb` masih
memadai karena pembacaan selalu utuh per baris.

**Apakah API bisa dipakai aplikasi lain?**
Bisa, dan itu salah satu alasan API dipisah. Cukup panggil alamatnya, tidak perlu
tahu isi kodenya. Yang membatasi hanya CORS, dan daftar origin yang diizinkan
bisa ditambah lewat `CORS_ORIGIN` tanpa mengubah kode.

---

## 7. Kalau ada yang error saat demo

Siapkan tiga pemulihan ini. Ketiganya sudah pernah kejadian.

**Muncul tulisan "Server tidak terjangkau".**
Server API sedang tidak bisa dihubungi. Kalau demo pakai alamat Vercel, tunggu
beberapa detik lalu tekan Muat ulang. Kalau demo pakai laptop, periksa terminal
pertama masih jalan atau tidak.

**Daftar tema kosong, padahal internet ada.**
Service worker menyimpan versi lama. Tutup aplikasinya, buka lagi. Kalau masih,
buka di jendela penyamaran.

**PowerShell menolak menjalankan npm.**
Jangan pakai `npm`, pakai `npm.cmd`. Contoh:

```
npm.cmd run dev
npm.cmd run dev:web
```

Kalau ingin permanen, jalankan sekali:

```
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Sebutkan ke penguji bahwa itu kebijakan Windows, bukan kesalahan aplikasi.

**Tombol pasang aplikasi tidak muncul.**
Memang begitu di iPhone dan di browser dalam aplikasi seperti WhatsApp. Yang
didemokan sebaiknya HP Android dengan Chrome. Di iPhone caranya lewat menu
Bagikan di Safari, lalu Tambahkan ke Layar Utama.

---

## 8. Yang jangan dilakukan

Jangan mengklaim sesuatu yang belum diuji. Kalau ditanya dan kamu tidak tahu,
jawab: "Belum saya coba, tapi kalau dilihat dari kodenya ada di berkas ini."
Itu jauh lebih baik daripada mengarang.

Jangan membaca kode baris per baris saat demo. Tunjukkan berkasnya, sebutkan
fungsi utamanya, lalu berhenti.

Jangan lupa menyebutkan angka yang bisa dibuktikan: tujuh endpoint, sepuluh tema,
enam harmoni, 60 palet contoh, 24 uji otomatis lulus.
