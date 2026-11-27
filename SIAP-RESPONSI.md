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

## 6. Kalau ada yang error saat demo

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

## 7. Yang jangan dilakukan

Jangan mengklaim sesuatu yang belum diuji. Kalau ditanya dan kamu tidak tahu,
jawab: "Belum saya coba, tapi kalau dilihat dari kodenya ada di berkas ini."
Itu jauh lebih baik daripada mengarang.

Jangan membaca kode baris per baris saat demo. Tunjukkan berkasnya, sebutkan
fungsi utamanya, lalu berhenti.

Jangan lupa menyebutkan angka yang bisa dibuktikan: tujuh endpoint, sepuluh tema,
enam harmoni, 60 palet contoh, 24 uji otomatis lulus.
