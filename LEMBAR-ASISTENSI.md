# Lembar Asistensi Tugas Akhir

Salin isi di bawah ke lembar asistensi resmi praktikum. Bagian yang perlu kamu lengkapi
sudah ditandai.

## Identitas

| Kolom | Isi |
| --- | --- |
| Judul Tugas Akhir | ChromaVibe: Aplikasi Rekomendasi Palet Warna Web Berbasis Estetika Tema dan Harmoni Kontras |
| Platform | Progressive Web App (PWA) |
| Nama Praktikan | Hizkia Yosefha Wetrawatri Sanjaya |
| NIM | 21120124130091 |
| Kelas / Shift | Kelompok 03, Shift 01 |
| Asisten Pembimbing | _(lengkapi)_ |
| Tanggal Bimbingan | _(lengkapi, usulkan 23 November 2026)_ |
| Link GitHub | https://github.com/HizkiaSanjaya/TA_PPB_ChromaVibe |
| Link Deploy | https://ta-ppb-chroma-vibe-nixt.vercel.app |
| Link API | https://ta-ppb-chroma-vibe.vercel.app |

## Catatan Bimbingan

Tulis ringkas apa yang diperiksa asisten pada kolom catatan, lalu minta tanda tangan.
Poin berikut memudahkan asisten memeriksa.

1. **API sendiri.** Dua proses berjalan: API pada folder `api/`, PWA pada folder `web/`.
   Tunjukkan `GET /api/v1/themes` di browser dan satu permintaan
   `GET /api/v1/palettes/generate?base=3B82F6&tema=y2k&harmoni=triadik&jumlah=3&seed=42`.
2. **Bottom navigation.** Empat tab tampil di semua halaman, tab aktif ditandai garis dan
   warna, serta memakai `aria-current` dari `NavLink`.
3. **Jumlah halaman.** Tujuh rute: beranda, detail tema, detail palet, generator, koleksi,
   tentang, dan halaman 404.
4. **Daftar dan detail.** Dua alur: beranda menuju detail tema menuju detail palet, serta
   koleksi menuju detail palet. Tunjukkan keduanya.
5. **Halaman profil.** Halaman Tentang memuat penyusun, teknologi, daftar endpoint, dan
   tautan repositori.
6. **GitHub.** Repositori dengan riwayat commit yang bertahap, bukan satu commit besar.
7. **PWA terpasang.** Tunjukkan tombol "Install app" atau "Tambahkan ke layar utama" pada
   browser ponsel, lalu buka dalam mode *standalone*.
8. **Bukti pengujian.** Jalankan `npm test` di folder `api/`, tunjukkan 16 uji lulus.
9. **Peta kode.** Buka `PETA-KODE.md` yang memuat berkas dan nomor baris setiap fitur. Kalau
   asisten menunjuk satu baris, nomornya bisa langsung dicari di situ.

## Pertanyaan yang sering muncul saat responsi

**Mengapa memakai OKLCH dan bukan HSL?**
HSL menipu secara perseptual. Dua warna dengan HSL *lightness* 50% bisa terlihat sangat
berbeda tingkat keterangannya, terutama pada kuning dan biru. Pada OKLCH, kenaikan
*lightness* 0.1 terasa setara di semua *hue*, sehingga rencana *lightness* sebuah tema
bisa diandalkan. Implementasi konversinya ada di `api/src/lib/color/space.js`.

**Mengapa endpoint generator memakai GET dan bukan POST?**
Hasilnya deterministik. Kombinasi input yang sama selalu menghasilkan palet yang sama,
jadi `GET` bisa disimpan di cache HTTP dan di-cache *service worker*. URL-nya juga bisa
dibagikan. Kalau memakai `POST`, Workbox tidak akan menyimpannya dan aplikasi kehilangan
kemampuan menampilkan hasil terakhir saat offline.

**Bagaimana palet dijamin terbaca?**
Setelah warna disusun, dua aturan dijalankan. Teks, warna utama, dan warna kedua terhadap
latar serta permukaan wajib mencapai 4.5 banding 1. Bila belum, kecerahannya digeser
bertahap sampai lolos. Warna utama sengaja dinaikkan dari 3 ke 4.5 supaya bisa dipakai
sebagai judul, bukan hanya sebagai latar tombol.

**Dari mana angka tema dan warnanya diambil?**
Disusun sendiri, bukan diambil dari situs mana pun. Setiap tema adalah konfigurasi angka:
rentang kepekatan warna, tingkat gelap untuk latar dan teks, serta besar pergeseran hue.
Angkanya ditentukan dari pemahaman umum tentang gaya tersebut, misalnya Y2K identik dengan
neon di atas latar gelap. Yang dijamin aplikasi bukan selera, melainkan keterbacaan: setiap
palet pasti lolos ambang kontras, dan itu diuji otomatis.

**Kenapa mengganti harmoni terasa tidak berpengaruh?**
Karena harmoni hanya mengubah satu dari lima warna, yaitu warna kedua. Latar dan warna utama
tetap. Supaya perbedaannya terlihat, halaman Generator menampilkan roda warna dengan dua
titik: titik besar warna pilihan pengguna, titik kecil warna kedua. Mengganti harmoni
memindahkan titik kecil itu, dan jaraknya dinyatakan dalam derajat.

**Kenapa rekomendasi terbatas?**
Yang terbatas hanya daftar tema (10), skema harmoni (6), dan palet kurasi (60 di database).
Palet hasil generator tidak disimpan dan tidak dibatasi, karena dihitung saat diminta dari
kombinasi warna, tema, kecerahan, dan kunci. Batasnya praktis hanya variasi yang bisa
dihasilkan, dan semuanya tetap lolos uji keterbacaan.

**Mengapa palet favorit tidak disimpan di Supabase?**
Tidak ada autentikasi pengguna. Menyimpan favorit di server memaksa pembuatan identitas
perangkat, dan biaya waktunya lebih besar daripada nilainya. Favorit disimpan di
`localStorage` lewat satu *store* kecil, sehingga tetap bekerja tanpa jaringan.

**Apa yang terjadi kalau Supabase belum diisi?**
API memakai data contoh di `api/src/data/palet.kurasi.json` dan menulis satu peringatan di
log. Data contoh itu dibangun oleh generator yang sama, jadi isinya bukan angka karangan.
Berkasnya dibuat ulang dengan `npm run seed`.

**Mengapa jumlah tema dibatasi sepuluh?**
Sepuluh tema sudah cukup beragam untuk menunjukkan bahwa tema hanyalah konfigurasi angka. Menambah tema ke-11 cukup menambahkan satu objek di `api/src/lib/palette/themes.js`, tanpa menyentuh kode generator, rute, maupun tampilan.

## Rencana demo saat responsi (sekitar 5 menit)

1. Buka beranda, sebutkan sepuluh tema dan bahwa setiap kartu berasal dari API.
2. Buka satu tema, tunjukkan enam palet kurasi beserta skor kontras.
3. Buka satu palet, tunjukkan pratinjau, lima peran warna, dan tabel kontras.
4. Tekan Simpan, lalu buka tab Koleksi untuk menunjukkan alur daftar kedua.
5. Buka Generator, ganti tema ke Cyberpunk, tekan Variasikan, tunjukkan nama palet berubah.
6. Buka Tentang, sebutkan penyusun dan daftar endpoint.
7. Pasang aplikasi ke layar utama untuk membuktikan sifat PWA.
