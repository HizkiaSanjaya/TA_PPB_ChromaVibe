# Inventaris Fungsi per Berkas

Dibuat otomatis oleh `npm run fungsi`. Nomor baris dihitung langsung dari kode,
jadi selalu sesuai berkas terakhir.

Cara pakai saat responsi: kalau penguji membuka satu berkas dan bertanya
"isinya apa saja", sebutkan dulu tujuan berkasnya, lalu fungsi utamanya, lalu
fungsi pembantunya. Kolom terakhir menunjukkan bedanya.

## `api/src/app.js`

Titik masuk server: middleware, daftar rute, penanganan galat

Jumlah baris: 92. Isi: 10 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 12 | `daftarOrigin` | fungsi dalam |
| 27 | `(tanpa nama)` | middleware |
| 34 | `/` | rute |
| 54 | `/health` | rute |
| 65 | `/api/v1/themes` | router |
| 66 | `/api/v1/palettes` | router |
| 67 | `/api/v1` | router |
| 69 | `(tanpa nama)` | middleware |
| 73 | `(tanpa nama)` | penangan galat |
| 92 | `(tanpa nama)` | ekspor bawaan |

## `api/src/config/sumber-data.js`

Pintu data palet: Supabase atau berkas contoh

Jumlah baris: 119. Isi: 8 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 21 | `muatContoh` | fungsi dalam |
| 26 | `memakaiSupabase` | fungsi |
| 34 | `lengkapiNama` | fungsi dalam |
| 42 | `petakanBaris` | fungsi dalam |
| 55 | `peringatanContoh` | fungsi dalam |
| 63 | `ambilPaletKurasi` | fungsi |
| 79 | `ambilPaletById` | fungsi |
| 101 | `hitungPaletPerTema` | fungsi |

## `api/src/config/supabase.js`

Membuat koneksi Supabase, gagal jika kunci kosong

Jumlah baris: 23. Isi: 2 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 8 | `supabase` | konstanta |
| 14 | `requireSupabase` | fungsi |

## `api/src/controllers/palet.controller.js`

Menjawab permintaan palet dan generator

Jumlah baris: 44. Isi: 5 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 11 | `listPaletKurasi` | handler rute |
| 16 | `listPaletTema` | handler rute |
| 24 | `getPalet` | handler rute |
| 33 | `generatePalet` | handler rute |
| 42 | `listHarmoni` | handler rute |

## `api/src/controllers/tema.controller.js`

Menjawab permintaan daftar dan detail tema

Jumlah baris: 53. Isi: 3 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 10 | `paletContoh` | fungsi dalam |
| 27 | `listTema` | handler rute |
| 40 | `getTema` | handler rute |

## `api/src/lib/color/contrast.js`

Rumus keterbacaan WCAG

Jumlah baris: 50. Isi: 5 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 4 | `luminansiRelatif` | fungsi |
| 9 | `rasioKontras` | fungsi |
| 17 | `bulatkanRasio` | fungsi |
| 21 | `nilaiWcag` | fungsi |
| 32 | `periksaPasangan` | fungsi |

## `api/src/lib/color/harmony.js`

Enam skema harmoni

Jumlah baris: 58. Isi: 3 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 9 | `HARMONI` | konstanta larik |
| 54 | `SLUG_HARMONI` | konstanta |
| 56 | `ambilHarmoni` | fungsi |

## `api/src/lib/color/prng.js`

Angka acak berbenih yang bisa diulang

Jumlah baris: 27. Isi: 2 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 9 | `hashString` | fungsi |
| 18 | `buatPrng` | fungsi |

## `api/src/lib/color/space.js`

Konversi warna hex, OKLab, dan OKLCH

Jumlah baris: 159. Isi: 16 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 12 | `batasi` | fungsi |
| 16 | `normalkanHue` | fungsi |
| 21 | `keLinear` | fungsi |
| 25 | `keSrgb` | fungsi |
| 29 | `parseHex` | fungsi |
| 50 | `rgbKeHex` | fungsi |
| 59 | `rgbKeOklab` | fungsi |
| 79 | `oklabKeLinearRgb` | fungsi |
| 95 | `oklabKeOklch` | fungsi |
| 101 | `oklchKeOklab` | fungsi |
| 107 | `oklchKeRgb` | fungsi |
| 116 | `dalamGamut` | fungsi |
| 125 | `petakanGamut` | fungsi |
| 149 | `oklchKeHex` | fungsi |
| 153 | `hexKeOklch` | fungsi |
| 157 | `bulatkanWarna` | fungsi |

## `api/src/lib/palette/generator.js`

Inti penyusun palet

Jumlah baris: 292. Isi: 5 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 34 | `tegakkanKontras` | fungsi dalam |
| 48 | `sidikPalet` | fungsi dalam |
| 58 | `buatPalet` | fungsi |
| 246 | `buatDaftarPalet` | fungsi |
| 283 | `saranWarnaTema` | fungsi |

## `api/src/lib/palette/names.js`

Penamaan palet dari warna dan tema

Jumlah baris: 59. Isi: 2 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 43 | `namaKeluargaWarna` | fungsi dalam |
| 55 | `buatNama` | fungsi |

## `api/src/lib/palette/themes.js`

Sepuluh tema sebagai konfigurasi angka

Jumlah baris: 135. Isi: 3 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 8 | `TEMA` | konstanta larik |
| 131 | `SLUG_TEMA` | konstanta |
| 133 | `ambilTema` | fungsi |

## `api/src/routes/meta.routes.js`

Pemetaan URL daftar harmoni

Jumlah baris: 9. Isi: 2 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 7 | `/harmoni` | rute |
| 9 | `(tanpa nama)` | ekspor bawaan |

## `api/src/routes/palet.routes.js`

Pemetaan URL palet dan generator

Jumlah baris: 12. Isi: 4 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 8 | `/generate` | rute |
| 9 | `/` | rute |
| 10 | `/:id` | rute |
| 12 | `(tanpa nama)` | ekspor bawaan |

## `api/src/routes/tema.routes.js`

Pemetaan URL tema

Jumlah baris: 12. Isi: 4 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 8 | `/` | rute |
| 9 | `/:slug` | rute |
| 10 | `/:slug/palettes` | rute |
| 12 | `(tanpa nama)` | ekspor bawaan |

## `api/src/server.js`

Menyalakan server di port dari .env

Jumlah baris: 8. Isi: 0 penanda.

_Tidak ada fungsi, hanya isi langsung._

## `api/src/utils/ApiError.js`

Kelas galat yang membawa kode status

Jumlah baris: 7. Isi: 1 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 1 | `ApiError` | kelas |

## `api/src/utils/asyncHandler.js`

Pembungkus agar galat async masuk middleware

Jumlah baris: 2. Isi: 1 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 1 | `asyncHandler` | konstanta |

## `api/src/utils/response.js`

Pembungkus bentuk respons seragam

Jumlah baris: 11. Isi: 3 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 1 | `ok` | fungsi |
| 5 | `created` | fungsi |
| 9 | `noContent` | fungsi |

## `api/src/validators/palet.validator.js`

Aturan validasi masukan generator

Jumlah baris: 50. Isi: 2 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 14 | `generateQuerySchema` | skema validasi |
| 44 | `paletParamSchema` | skema validasi |

## `web/src/App.tsx`

Daftar rute halaman

Jumlah baris: 28. Isi: 1 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 13 | `App` | komponen utama |

## `web/src/api/client.ts`

Penghubung ke API dan daftar endpoint

Jumlah baris: 61. Isi: 4 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 3 | `DASAR_API` | konstanta |
| 8 | `KesalahanApi` | kelas |
| 15 | `ambil` | fungsi dalam |
| 44 | `api` | konstanta objek |

## `web/src/api/types.ts`

Bentuk data yang dikirim API

Jumlah baris: 91. Isi: 11 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 1 | `PeranWarna` | tipe data |
| 3 | `NilaiKontras` | tipe data |
| 5 | `Warna` | tipe data |
| 11 | `PasanganKontras` | tipe data |
| 22 | `RingkasanPalet` | tipe data |
| 29 | `Palet` | tipe data |
| 42 | `Tema` | tipe data |
| 65 | `SkemaHarmoni` | tipe data |
| 73 | `MasukanGenerate` | tipe data |
| 82 | `HasilGenerate` | tipe data |
| 87 | `ResponsApi` | tipe data |

## `web/src/components/BottomNav.tsx`

Navigasi bawah lima tab

Jumlah baris: 48. Isi: 1 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 16 | `BottomNav` | fungsi |

## `web/src/components/Ikon.tsx`

Kumpulan ikon SVG

Jumlah baris: 121. Isi: 7 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 1 | `IkonBeranda` | fungsi |
| 20 | `IkonGenerator` | fungsi |
| 38 | `IkonKoleksi` | fungsi |
| 55 | `IkonPanduan` | fungsi |
| 73 | `IkonTentang` | fungsi |
| 92 | `IkonPanah` | fungsi |
| 109 | `LogoCv` | fungsi |

## `web/src/components/KartuTema.tsx`

Kartu tema bergaya cuplikan antarmuka

Jumlah baris: 259. Isi: 2 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 18 | `KartuTema` | fungsi |
| 231 | `warnaTema` | fungsi |

## `web/src/components/KepalaHalaman.tsx`

Judul halaman dan tombol kembali

Jumlah baris: 27. Isi: 1 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 11 | `KepalaHalaman` | fungsi |

## `web/src/components/Layout.tsx`

Kerangka halaman, nav, dan penanda offline

Jumlah baris: 28. Isi: 2 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 7 | `GulirKeAtas` | fungsi dalam |
| 17 | `Layout` | fungsi |

## `web/src/components/PenandaOffline.tsx`

Pemberitahuan saat server tidak terjangkau

Jumlah baris: 46. Isi: 1 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 9 | `PenandaOffline` | fungsi |

## `web/src/components/PratinjauPalet.tsx`

Miniatur antarmuka dari lima warna

Jumlah baris: 113. Isi: 3 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 12 | `teksAman` | fungsi dalam |
| 29 | `PratinjauPalet` | fungsi |
| 87 | `LegendaPalet` | fungsi |

## `web/src/components/RodaWarna.tsx`

Roda warna untuk menjelaskan harmoni

Jumlah baris: 84. Isi: 2 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 13 | `RodaWarna` | fungsi |
| 70 | `bacaHarmoni` | fungsi |

## `web/src/components/Status.tsx`

Tampilan memuat, galat, dan kosong

Jumlah baris: 37. Isi: 3 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 1 | `Memuat` | fungsi |
| 13 | `Galat` | fungsi |
| 30 | `Kosong` | fungsi |

## `web/src/components/StripWarna.tsx`

Deretan warna dalam satu baris

Jumlah baris: 21. Isi: 1 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 8 | `StripWarna` | fungsi |

## `web/src/components/Tombol.tsx`

Tiga jenis tombol dan tautan

Jumlah baris: 61. Isi: 3 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 7 | `TautanUtama` | fungsi |
| 23 | `TautanGaris` | fungsi |
| 34 | `TombolAksi` | fungsi |

## `web/src/components/TombolSalin.tsx`

Tombol salin ke papan klip

Jumlah baris: 49. Isi: 1 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 9 | `TombolSalin` | fungsi |

## `web/src/components/TombolSimpan.tsx`

Tombol simpan ke koleksi

Jumlah baris: 18. Isi: 1 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 5 | `TombolSimpan` | fungsi |

## `web/src/data/warna-umum.ts`

Daftar warna bernama dan tingkat kecerahan

Jumlah baris: 35. Isi: 3 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 9 | `WARNA_UMUM` | konstanta larik |
| 30 | `TINGKAT_KECERAHAN` | konstanta larik |
| 32 | `namaWarna` | fungsi |

## `web/src/hooks/useKoleksi.ts`

Menyimpan palet di perangkat

Jumlah baris: 74. Isi: 9 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 7 | `baca` | fungsi dalam |
| 23 | `langganan` | fungsi dalam |
| 30 | `umumkan` | fungsi dalam |
| 34 | `simpanKePenyimpanan` | fungsi dalam |
| 51 | `useKoleksi` | fungsi |
| 55 | `simpanPalet` | fungsi |
| 62 | `hapusPalet` | fungsi |
| 68 | `adaDiKoleksi` | fungsi |
| 72 | `cariPaletKoleksi` | fungsi |

## `web/src/hooks/usePasang.ts`

Status pemasangan PWA

Jumlah baris: 62. Isi: 1 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 21 | `usePasang` | fungsi |

## `web/src/konfigurasi.ts`

Identitas aplikasi dan penyusun

Jumlah baris: 15. Isi: 1 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 3 | `KONFIGURASI` | konstanta objek |

## `web/src/main.tsx`

Menempelkan React ke halaman

Jumlah baris: 31. Isi: 0 penanda.

_Tidak ada fungsi, hanya isi langsung._

## `web/src/pages/Beranda.tsx`

Daftar tema

Jumlah baris: 135. Isi: 1 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 29 | `Beranda` | fungsi |

## `web/src/pages/DetailPalet.tsx`

Rincian satu palet

Jumlah baris: 115. Isi: 1 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 13 | `DetailPalet` | fungsi |

## `web/src/pages/DetailTema.tsx`

Daftar palet dalam satu tema

Jumlah baris: 107. Isi: 1 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 11 | `DetailTema` | fungsi |

## `web/src/pages/Generator.tsx`

Pembuat palet baru

Jumlah baris: 419. Isi: 4 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 22 | `keSeed` | fungsi dalam |
| 29 | `keTerang` | fungsi dalam |
| 35 | `KartuHasil` | fungsi dalam |
| 63 | `Generator` | fungsi |

## `web/src/pages/Koleksi.tsx`

Palet yang disimpan

Jumlah baris: 78. Isi: 1 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 9 | `Koleksi` | fungsi |

## `web/src/pages/Panduan.tsx`

Penjelasan lima warna dan enam harmoni

Jumlah baris: 159. Isi: 1 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 19 | `Panduan` | fungsi |

## `web/src/pages/Tentang.tsx`

Profil aplikasi dan penyusun

Jumlah baris: 209. Isi: 1 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 33 | `Tentang` | fungsi |

## `web/src/pages/TidakDitemukan.tsx`

Halaman 404

Jumlah baris: 19. Isi: 1 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 3 | `TidakDitemukan` | fungsi |

## `web/src/sw.ts`

Service worker: cache, offline, pembaruan

Jumlah baris: 189. Isi: 9 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 32 | `install` | pendengar service worker |
| 49 | `activate` | pendengar service worker |
| 61 | `simpan` | fungsi dalam |
| 72 | `pangkasCacheApi` | fungsi dalam |
| 86 | `layaniApi` | fungsi dalam |
| 113 | `layaniNavigasi` | fungsi dalam |
| 137 | `layaniAset` | fungsi dalam |
| 147 | `fetch` | pendengar service worker |
| 169 | `message` | pendengar service worker |

## `web/src/utils/warna.ts`

Bantuan warna: label, rasio, ekspor CSS

Jumlah baris: 92. Isi: 11 penanda.

| Baris | Nama | Jenis |
| --- | --- | --- |
| 19 | `kanal` | fungsi dalam |
| 23 | `keRgb` | fungsi dalam |
| 32 | `luminansi` | fungsi |
| 37 | `rasioKontras` | fungsi |
| 46 | `teksDiAtas` | fungsi |
| 52 | `ambilHex` | fungsi |
| 56 | `hexKeCss` | fungsi |
| 64 | `hexKeTailwind` | fungsi |
| 70 | `(tanpa nama)` | ekspor bawaan |
| 83 | `daftarHex` | fungsi |
| 87 | `normalisasiHex` | fungsi |

## `web/src/vite-env.d.ts`

Jumlah baris: 9. Isi: 0 penanda.

_Tidak ada fungsi, hanya isi langsung._

---

Total 52 berkas, 170 penanda fungsi dan kelas.

Untuk memperbarui berkas ini setelah menyunting kode:

```bash
npm run fungsi
```
