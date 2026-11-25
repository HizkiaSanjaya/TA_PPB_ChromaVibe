# Peta Kode ChromaVibe

Dokumen ini memetakan fitur ke berkas dan nomor baris, dipakai saat responsi. Nomor baris
dihitung langsung dari berkas sumber oleh `npm run peta`, jadi selalu sesuai kode terakhir.

Satu hal yang perlu diingat: jangan menghafal nomor baris, hafalkan nama berkasnya. Kalau
nomor bergeser setelah kamu menyunting kode, jalankan `npm run peta` lagi dan tabel ini
diperbarui otomatis.

## A. Syarat tugas akhir, satu per satu

Bagian ini yang paling sering ditanya. Setiap syarat dipetakan ke berkas dan baris yang membuktikannya.

| Kalau ditanya | Berkas | Baris | Yang dijelaskan |
| --- | --- | --- | --- |
| Memakai API buatan sendiri | `api/src/app.js` | 65 | Tiga router dipasang di bawah prefiks /api/v1. Daftar lengkap endpoint ada di route "/" pada berkas yang sama. |
| Bottom navigation bar | `web/src/components/BottomNav.tsx` | 8 | Lima tab: Beranda, Panduan, Generator, Koleksi, Tentang. Generator ditaruh di tengah karena itu halaman utama. Tab aktif ditentukan NavLink lewat isActive. |
| Minimal lima halaman | `web/src/App.tsx` | 17 | Delapan rute terdaftar di bawah ini: beranda, panduan, detail tema, detail palet, generator, koleksi, tentang, dan 404. |
| Daftar pertama, yaitu tema | `web/src/pages/Beranda.tsx` | 30 | Data diambil dari GET /api/v1/themes lewat TanStack Query, lalu dirender sebagai kartu yang bisa diklik. |
| Detail dari daftar pertama | `web/src/pages/DetailTema.tsx` | 22 | Slug dibaca dari URL lewat useParams, lalu palet kurasi tema itu dimuat. Inilah daftar kedua. |
| Daftar kedua, yaitu palet per tema | `web/src/pages/DetailTema.tsx` | 89 | Setiap item palet menuju halaman detailnya sendiri. Jadi ada dua pasang daftar dan detail. |
| Pilihan warna umum dan kecerahan | `web/src/data/warna-umum.ts` | 9 | Daftar tujuh belas warna bernama untuk pengguna awam, ditambah sepuluh tingkat kecerahan. Pemilih warna koordinat tetap ada untuk yang butuh warna persis. |
| Halaman Panduan: arti lima warna dan enam harmoni | `web/src/pages/Panduan.tsx` | 19 | Menjelaskan tugas lima warna dan perbedaan enam harmoni, memakai contoh yang dihitung langsung oleh API. Ada juga kode CSS siap salin. |
| Kecerahan mengubah warna dan latar | `api/src/lib/palette/generator.js` | 91 | Angka 10 sampai 100 diubah menjadi kecerahan warna pilihan pengguna. Latar otomatis dipasang di sisi berlawanan agar teksnya tetap terbaca. |
| Kenapa lima palet bisa terlihat sama, dan apa yang diperbaiki | `api/src/lib/palette/generator.js` | 123 | Latar berangkat dari kepekatan tema masing-masing, lalu digeser menjauhi ujung memakai perbandingan emas. Titik awalnya tetap membawa ciri tema, tetapi tiap indeks mendapat nilai berbeda sehingga tidak ada latar kembar. |
| Kenapa nama palet seperti Oranye Kasar | `api/src/lib/palette/names.js` | 55 | Nama dibentuk dari keluarga warna (Merah, Oranye, Kuning, dan seterusnya, ditentukan oleh hue) ditambah kata sifat tema. Tujuannya supaya tiap palet bisa disebut tanpa menyebut kode hex. |
| Kenapa judul pratinjau bisa memakai warna utama | `api/src/lib/palette/generator.js` | 19 | Warna utama dan warna kedua wajib 4.5 banding 1 terhadap latar dan kartu, bukan hanya 3. Syarat itu yang membuat keduanya layak dipakai sebagai tulisan, bukan sekadar latar tombol. |
| Roda warna untuk menjelaskan harmoni | `web/src/components/RodaWarna.tsx` | 13 | Menampilkan posisi hue warna utama dan warna kedua pada lingkaran, supaya perbedaan harmoni terlihat, bukan hanya terbaca sebagai nama. |
| Kenapa monokrom dulu menghasilkan dua warna sama | `api/src/lib/palette/generator.js` | 188 | Pada monokrom kedua warna berbagi hue, jadi hanya kecerahan yang memisahkan. Pemisahan dilakukan setelah kontras ditegakkan, kalau tidak, aturan kontras akan menariknya kembali. |
| Halaman detail palet ada di mana | `web/src/pages/DetailPalet.tsx` | 78 | Menampilkan pratinjau berbentuk antarmuka mini, lima peran warna beserta kodenya, dan tombol ekspor CSS. |
| Halaman profil atau tentang | `web/src/pages/Tentang.tsx` | 6 | Memuat penyusun, ide dasar, teknologi, daftar endpoint, dan tautan repositori. Nama serta NIM diambil dari src/konfigurasi.ts. |
| PWA dan manifest | `web/vite.config.ts` | 20 | Nama, ikon 192 dan 512 termasuk maskable, display standalone, serta warna tema. Dihasilkan menjadi manifest.webmanifest saat build. |
| Service worker dan cache offline | `web/src/sw.ts` | 147 | Tiga cabang: permintaan /api/v1, navigasi halaman, dan aset. Strategi cache dijelaskan pada fungsi layaniApi di berkas yang sama. |

## B. Tampilan dan navigasi

Kalau asisten menunjuk layar lalu bertanya kode mana yang menggambarnya.

| Kalau ditanya | Berkas | Baris | Yang dijelaskan |
| --- | --- | --- | --- |
| Kerangka halaman dan bottom nav dipasang | `web/src/components/Layout.tsx` | 25 | Nav dipasang sekali di layout induk, jadi tidak dibongkar-pasang saat pindah halaman. |
| Tab aktif dan aria untuk pembaca layar | `web/src/components/BottomNav.tsx` | 25 | NavLink memberi aria-current="page" otomatis, dan tampilan aktif ditandai garis atas serta warna teks. |
| Tombol Generator dan perubahan tema | `web/src/pages/Generator.tsx` | 3 | Seluruh pengaturan disimpan di URL, bukan state lokal, sehingga hasil bisa dibagikan dan tetap ada setelah muat ulang. |
| Permintaan ke API dari Generator | `web/src/pages/Generator.tsx` | 110 | TanStack Query memanggil api.buatPalet dengan base, tema, harmoni, jumlah, seed, dan kecerahan sebagai kunci cache. |
| Menyimpan palet ke koleksi | `web/src/hooks/useKoleksi.ts` | 55 | Disimpan ke localStorage dengan kunci chromavibe:koleksi:v1. Pembaca lain diberi tahu lewat useSyncExternalStore. |
| Halaman koleksi membaca penyimpanan lokal | `web/src/hooks/useKoleksi.ts` | 5 | Kunci penyimpanan dan pembacaan awal. Tidak ada permintaan jaringan di halaman koleksi. |
| Tombol simpan di kartu hasil | `web/src/components/TombolSimpan.tsx` | 11 | Satu komponen kecil yang membaca status koleksi, jadi tombol langsung berubah jadi Tersimpan. |
| Tombol salin hex, CSS, dan Tailwind | `web/src/components/TombolSalin.tsx` | 22 | Memakai Clipboard API dengan fallback textarea untuk browser lama. Umpan balik Tersalin muncul 1,6 detik. |
| Isi teks ekspor CSS | `web/src/utils/warna.ts` | 56 | Menghasilkan custom properties per peran warna. Versi Tailwind ada di fungsi berikutnya, hexKeTailwind. |
| Pratinjau palet yang dipakai sungguhan | `web/src/pages/DetailPalet.tsx` | 78 | Lima peran warna dirender berurutan dengan label, keterangan, dan kode hex yang bisa disalin. |

## C. API dan validasi

Bagian server: rute, controller, skema, dan bentuk respons.

| Kalau ditanya | Berkas | Baris | Yang dijelaskan |
| --- | --- | --- | --- |
| Rute generator dan urutannya | `api/src/routes/palet.routes.js` | 8 | /generate sengaja didaftarkan sebelum /:id. Kalau terbalik, kata generate akan dianggap id palet. |
| Daftar palet per tema | `api/src/routes/tema.routes.js` | 10 | Tiga rute tema: daftar, detail, dan palet per tema. Validasi slug dilakukan di controller. |
| Daftar skema harmoni | `api/src/routes/meta.routes.js` | 7 | Meta dipisah dari tema dan palet agar tetap bisa dipakai aplikasi lain. |
| Controller generator | `api/src/controllers/palet.controller.js` | 33 | Memvalidasi query, menormalkan hex, memanggil generator, lalu membungkus hasilnya dengan ok(). |
| Validasi masuk sebelum logika berjalan | `api/src/controllers/palet.controller.js` | 34 | Skema Zod dipanggil di baris pertama controller. Bila gagal, middleware error mengubahnya menjadi 400. |
| Aturan validasi warna primer | `api/src/validators/palet.validator.js` | 12 | Hex boleh tanpa tanda pagar, tetapi harus enam digit. Tema dan harmoni dibatasi enum dari konfigurasi. |
| Penanganan galat terpusat | `api/src/app.js` | 74 | ZodError menjadi 400 dengan daftar field, ApiError memakai statusCode-nya, sisanya 500. |
| Bentuk respons yang seragam | `api/src/utils/response.js` | 1 | Selalu { success, message, data }, sehingga klien cukup punya satu jalur baca. |
| CORS untuk PWA yang beda origin | `api/src/app.js` | 23 | Origin diambil dari CORS_ORIGIN. Tanpa ini, permintaan dari Vercel diblokir browser walau curl berhasil. |
| Header cache pada respons GET | `api/src/app.js` | 29 | Lima menit segar, sepuluh menit stale-while-revalidate. Aman karena semua endpoint GET bersifat deterministik. |
| Pembungkus async agar galat masuk middleware | `api/src/utils/asyncHandler.js` | 1 | Express 4 tidak menangkap penolakan promise. Pembungkus ini meneruskannya ke next(). |

## D. Mesin warna, inti yang ditanyakan penguji

Urutan penjelasan yang enak dipakai: konversi, tema, harmoni, gamut, lalu kontras.

| Kalau ditanya | Berkas | Baris | Yang dijelaskan |
| --- | --- | --- | --- |
| Konversi sRGB ke OKLab | `api/src/lib/color/space.js` | 59 | Dekode gamma, matriks ke LMS, akar pangkat tiga, lalu matriks ke OKLab. Semua konstanta mengikuti spesifikasi Björn Ottosson. |
| Konversi balik ke hex | `api/src/lib/color/space.js` | 149 | Selalu melewati petakanGamut lebih dulu, jadi hasilnya tidak pernah terpotong di luar rentang. |
| Memetakan warna ke dalam gamut sRGB | `api/src/lib/color/space.js` | 125 | Chroma diturunkan lewat pencarian biner 24 langkah. Lightness dan hue tidak diubah, jadi warna tidak kusam atau bergeser. |
| Membaca kode hex dari pengguna | `api/src/lib/color/space.js` | 29 | Menerima tiga atau enam digit dengan atau tanpa pagar, dan melempar pesan jelas untuk masukan salah. |
| Rumus kontras WCAG | `api/src/lib/color/contrast.js` | 9 | Selisih luminansi relatif ditambah 0,05. Luminansi memakai bobot 0,2126 merah, 0,7152 hijau, 0,0722 biru. |
| Memberi nilai AA atau AAA | `api/src/lib/color/contrast.js` | 21 | Ambang 7 untuk AAA, 4,5 untuk AA, 3 untuk teks besar, di bawah itu gagal. |
| Daftar tema sebagai konfigurasi angka | `api/src/lib/palette/themes.js` | 8 | Tiap tema hanya berisi rentang chroma, rencana lightness per peran, klaster hue, dan jitter. Menambah tema berarti menambah satu objek di sini. |
| Contoh tema Minimalis dan Brutalism | `api/src/lib/palette/themes.js` | 94 | Minimalis menyisakan chroma 0,008 sampai 0,035. Brutalism memakai chroma 0,26 sampai 0,34 dengan jitter nol. |
| Fungsi utama pembuat palet | `api/src/lib/palette/generator.js` | 58 | Masukan satu warna primer, keluaran lima peran warna beserta tabel kontras dan skor. Semua perhitungan ada di fungsi ini. |
| Benih acak yang deterministik | `api/src/lib/palette/generator.js` | 72 | Benih dibentuk dari base, tema, harmoni, seed, dan indeks. Input sama selalu menghasilkan palet dan id yang sama. |
| PRNG yang dipakai | `api/src/lib/color/prng.js` | 18 | mulberry32. Math.random tidak dipakai karena tidak bisa direproduksi, padahal URL hasil harus bisa dibagikan. |
| Menegakkan kontras, bukan hanya memeriksa | `api/src/lib/palette/generator.js` | 34 | Lightness digeser 0,02 per langkah menjauhi latar sampai ambang terpenuhi, maksimal 40 langkah. |
| Enam pasangan yang diuji | `api/src/lib/palette/generator.js` | 19 | Teks terhadap latar dan permukaan pada 4,5. Primer dan aksen terhadap latar dan permukaan pada 3. |
| Skema harmoni warna | `api/src/lib/color/harmony.js` | 9 | Enam skema sebagai offset hue: komplementer, analog, triadik, split, tetradik, monokrom. |
| Saran warna primer per tema | `api/src/lib/palette/generator.js` | 283 | Diambil dari klaster hue tema. Dipakai halaman Generator sebagai titik awal saat pengguna belum memilih warna. |
| Nama palet yang tidak itu-itu saja | `api/src/lib/palette/names.js` | 55 | Kosakata per tema, dipilih memakai PRNG yang sama, termasuk menghindari kata kembar seperti Neon Neon. |

## E. Data dan PWA

Sumber data palet kurasi serta perilaku aplikasi saat jaringan mati.

| Kalau ditanya | Berkas | Baris | Yang dijelaskan |
| --- | --- | --- | --- |
| Saklar Supabase dan data contoh | `api/src/config/sumber-data.js` | 63 | Kalau kredensial belum diisi, membaca JSON contoh. Controller tidak perlu tahu sumbernya. |
| Pemeriksaan kredensial Supabase | `api/src/config/supabase.js` | 14 | Melempar 503 kalau belum dikonfigurasi. Kunci service role tidak pernah keluar dari proses server. |
| Pembangkit palet kurasi | `api/scripts/bangun-seed.js` | 13 | Tiga puluh pasangan warna dan tema. Warnanya tetap hasil generator, bukan ditulis tangan. |
| Skema tabel Supabase | `supabase/schema.sql` | 10 | Satu tabel dengan kolom jsonb untuk warna, pasangan kontras, dan ringkasan. |
| Alamat API di sisi klien | `web/src/api/client.ts` | 3 | Dibaca dari VITE_API_URL. Tidak ada URL yang ditanam langsung di kode sumber. |
| Menangkap kegagalan jaringan di klien | `web/src/api/client.ts` | 23 | fetch yang gagal, atau balasan 503 dari service worker, memicu kejadian ini untuk menampilkan penanda offline. |
| Penanda offline di atas halaman | `web/src/components/PenandaOffline.tsx` | 16 | navigator.onLine saja tidak cukup, karena perangkat bisa tersambung WiFi tetapi server API mati. |
| Cache kerangka aplikasi saat instalasi | `web/src/sw.ts` | 32 | Daftar berkas dari manifest Vite dideduplikasi, karena Cache.addAll menolak daftar berisi URL kembar. |
| Strategi cache untuk permintaan API | `web/src/sw.ts` | 86 | Stale while revalidate: jawab dari cache, perbarui di latar. Aman karena hasil generator deterministik. |
| Jatuh ke halaman tersimpan saat offline | `web/src/sw.ts` | 113 | Network first, lalu cache halaman yang pernah dibuka, lalu index.html dari precache. |

## F. Pengujian, bukti yang bisa ditunjukkan

Jalankan `npm test` di folder api, lalu tunjuk berkas uji yang relevan.

| Kalau ditanya | Berkas | Baris | Yang dijelaskan |
| --- | --- | --- | --- |
| Bukti konversi warna tidak merusak nilai | `api/tests/color.test.js` | 31 | Sepuluh warna diuji bolak-balik dengan toleransi satu tingkat dari 255, plus nilai acuan merah dan penanganan di luar gamut. |
| Bukti rumus kontras benar | `api/tests/kontras.test.js` | 16 | Hitam di atas putih harus tepat 21, dan abu 767676 di atas putih harus 4,54 sesuai acuan WCAG. |
| Bukti generator deterministik | `api/tests/generator.test.js` | 10 | Dua pemanggilan identik dibandingkan id, warna, dan namanya. Ada juga uji seed berbeda menghasilkan palet berbeda. |
| Bukti teks selalu lolos kontras di semua tema | `api/tests/generator.test.js` | 44 | Sepuluh tema dikali lima warna primer. Rasio teks terhadap latar dan permukaan wajib minimal 4,5. |

## Urutan menjelaskan satu permintaan, dari layar sampai basis data

Kalau asisten minta ditelusuri, ikuti urutan ini. Jangan melompat ke generator sebelum
menyebut siapa yang memanggilnya.

1. Pengguna menekan tombol di `web/src/pages/Generator.tsx`. Pengaturan ditulis ke URL.
2. `web/src/api/client.ts` menyusun `GET /api/v1/palettes/generate` dan memanggil fetch.
3. `web/src/sw.ts` melihat path `/api/v1/`, lalu menjawab dari cache atau meneruskan.
4. `api/src/routes/palet.routes.js` mencocokkan rute ke controller.
5. `api/src/validators/palet.validator.js` memeriksa query lewat Zod.
6. `api/src/lib/palette/generator.js` menyusun lima peran warna dan menegakkan kontras.
7. `api/src/lib/color/space.js` mengonversi OKLCH ke hex di dalam gamut sRGB.
8. `api/src/utils/response.js` membungkus hasil, lalu klien merender kartu.

## Tujuh pertanyaan yang hampir pasti muncul, beserta jawaban lisannya

**Kenapa memakai OKLCH, bukan HSL?**
HSL menipu secara perseptual. Dua warna dengan lightness HSL 50 persen bisa terlihat sangat
berbeda tingkat keterangannya, terutama pada kuning dan biru. Di OKLCH, kenaikan lightness
yang sama terasa setara di seluruh hue, jadi rencana lightness sebuah tema bisa diandalkan.

**Bagaimana palet dijamin terbaca?**
Ada dua aturan setelah warna disusun: teks terhadap latar dan permukaan minimal 4,5 banding
1, sedangkan primer dan aksen minimal 3 banding 1. Bila belum, lightness digeser bertahap
sampai lolos. Uji otomatis memeriksa aturan itu pada sepuluh tema dan lima warna primer.

**Kenapa endpoint generator memakai GET, bukan POST?**
Karena hasilnya deterministik. GET bisa di-cache HTTP dan oleh service worker, URL-nya bisa
dibagikan, dan halaman tetap menampilkan hasil terakhir saat offline. Tidak ada data yang
ditulis ke server, jadi POST tidak memberi keuntungan apa pun.

**Di mana buktinya hasil selalu sama untuk input yang sama?**
Di `api/src/lib/color/prng.js`, PRNG diberi benih dari kombinasi input. Ujinya ada di
`api/tests/generator.test.js`, membandingkan id, warna, dan nama dari dua pemanggilan.

**Mengapa palet favorit tidak disimpan di Supabase?**
Tidak ada autentikasi, jadi menyimpannya di server memaksa pembuatan identitas perangkat.
Favorit disimpan di localStorage lewat `web/src/hooks/useKoleksi.ts`, tetap bekerja tanpa
jaringan dan tanpa akun.

**Kenapa antarmukanya hampir tanpa warna?**
Seluruh chrome aplikasi memakai skala abu-abu netral di `web/src/index.css`. Satu-satunya
warna di layar adalah palet yang sedang dinilai, supaya mata tidak berebut antara warna
merek aplikasi dan warna objek yang diuji.

**Apa yang terjadi kalau Supabase belum diisi?**
API memakai data contoh dari `api/src/data/palet.kurasi.json` dan menulis satu peringatan di
log. Data itu dibangun generator yang sama lewat `npm run seed`, jadi bukan angka karangan.

**Apa itu harmoni, dan seberapa besar pengaruhnya?**
Harmoni adalah aturan jarak hue antara warna primer pengguna dan warna aksen. Jaraknya diukur
dalam derajat pada lingkaran warna OKLCH, lalu diubah menjadi enam pilihan: komplementer 180
derajat, analog lebih kurang 30, triadik 120 dan 240, split 150 dan 210, tetradik empat sumbu,
dan monokrom tanpa pergeseran. Pengaruhnya besar pada warna aksen, tetapi tidak mengubah latar
maupun teks, karena keduanya diatur tema. Ringkasnya: tema mengatur terang-gelap dan seberapa
pekat warnanya, harmoni mengatur posisi hue aksen.

**Kenapa beranda dimulai dari memilih tema, bukan langsung generator?**
Tema adalah sumbu yang paling mudah dipahami orang awam, dan ia yang menentukan apakah hasilnya
terasa seperti Y2K, Brutalism, atau Elegant. Kalau pengguna diarahkan ke pemilih warna lebih
dulu, satu warna tanpa konteks tidak memberi gambaran apa pun. Beranda menampilkan sepuluh
tema sebagai daftar yang bisa ditelusuri, lalu halaman tema menawarkan tombol menuju Generator
dengan tema tersebut sudah terpilih.

**Kenapa lima palet bisa terlihat sama, dan apa yang diperbaiki?**
Versi pertama hanya menggeser hue lima derajat per variasi, sedangkan latar dan permukaan
dikunci tema, sehingga kelima palet nyaris identik. Sekarang variasi menggeser anak tangga
kecerahan latar, kecerahan warna primer, dan posisi aksen pada skema harmoni. Khusus monokrom,
primer dan aksen digeser ke arah berlawanan supaya terbaca sebagai dua tingkat kecerahan.
`buatDaftarPalet` juga menolak kandidat yang warnanya atau namanya kembar, dan uji otomatis
memastikan lima palet selalu berbeda untuk setiap tema.

## Kalau nomor baris bergeser

```bash
npm run peta
```

Perintah itu menghitung ulang seluruh nomor di dokumen ini. Kalau ada penanda yang hilang,
skrip akan menyebut nama berkas dan penandanya supaya mudah dibetulkan.
