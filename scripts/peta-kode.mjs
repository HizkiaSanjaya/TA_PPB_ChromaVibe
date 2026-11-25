import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * Pembuat PETA-KODE.md.
 *
 * Nomor baris ditulis manual gampang basi. Skrip ini mencarinya langsung dari
 * berkas sumber setiap kali dijalankan, jadi kalau kode bergeser cukup jalankan
 * ulang `npm run peta` alih-alih menyunting tabel satu per satu.
 */

const AKAR = fileURLToPath(new URL("..", import.meta.url));

const BAGIAN = [
  {
    judul: "A. Syarat tugas akhir, satu per satu",
    keterangan:
      "Bagian ini yang paling sering ditanya. Setiap syarat dipetakan ke berkas dan baris yang membuktikannya.",
    entri: [
      {
        tanya: "Memakai API buatan sendiri",
        berkas: "api/src/app.js",
        penanda: "app.use('/api/v1/themes'",
        catatan:
          'Tiga router dipasang di bawah prefiks /api/v1. Daftar lengkap endpoint ada di route "/" pada berkas yang sama.',
      },
      {
        tanya: "Bottom navigation bar",
        berkas: "web/src/components/BottomNav.tsx",
        penanda: "const ITEM = [",
        catatan:
          "Lima tab: Beranda, Panduan, Generator, Koleksi, Tentang. Generator ditaruh di tengah karena itu halaman utama. Tab aktif ditentukan NavLink lewat isActive.",
      },
      {
        tanya: "Minimal lima halaman",
        berkas: "web/src/App.tsx",
        penanda: "<Route index element={<Beranda />} />",
        catatan:
          "Delapan rute terdaftar di bawah ini: beranda, panduan, detail tema, detail palet, generator, koleksi, tentang, dan 404.",
      },
      {
        tanya: "Daftar pertama, yaitu tema",
        berkas: "web/src/pages/Beranda.tsx",
        penanda: "api.daftarTema",
        catatan:
          "Data diambil dari GET /api/v1/themes lewat TanStack Query, lalu dirender sebagai kartu yang bisa diklik.",
      },
      {
        tanya: "Detail dari daftar pertama",
        berkas: "web/src/pages/DetailTema.tsx",
        penanda: "api.paletTema(slug)",
        catatan:
          "Slug dibaca dari URL lewat useParams, lalu palet kurasi tema itu dimuat. Inilah daftar kedua.",
      },
      {
        tanya: "Daftar kedua, yaitu palet per tema",
        berkas: "web/src/pages/DetailTema.tsx",
        penanda: "to={`/palet/${item.id}`}",
        catatan:
          "Setiap item palet menuju halaman detailnya sendiri. Jadi ada dua pasang daftar dan detail.",
      },
      {
        tanya: "Pilihan warna umum dan kecerahan",
        berkas: "web/src/data/warna-umum.ts",
        penanda: "export const WARNA_UMUM",
        catatan:
          "Daftar tujuh belas warna bernama untuk pengguna awam, ditambah sepuluh tingkat kecerahan. Pemilih warna koordinat tetap ada untuk yang butuh warna persis.",
      },
      {
        tanya: "Halaman Panduan: arti lima warna dan enam harmoni",
        berkas: "web/src/pages/Panduan.tsx",
        penanda: "export function Panduan",
        catatan:
          "Menjelaskan tugas lima warna dan perbedaan enam harmoni, memakai contoh yang dihitung langsung oleh API. Ada juga kode CSS siap salin.",
      },
      {
        tanya: "Kecerahan mengubah warna dan latar",
        berkas: "api/src/lib/palette/generator.js",
        penanda: "const kecerahanPengguna",
        catatan:
          "Angka 10 sampai 100 diubah menjadi kecerahan warna pilihan pengguna. Latar otomatis dipasang di sisi berlawanan agar teksnya tetap terbaca.",
      },
      {
        tanya: "Kenapa lima palet bisa terlihat sama, dan apa yang diperbaiki",
        berkas: "api/src/lib/palette/generator.js",
        penanda: "const sebar = (i) => (i * EMAS) % 1",
        catatan:
          "Latar berangkat dari kepekatan tema masing-masing, lalu digeser menjauhi ujung memakai perbandingan emas. Titik awalnya tetap membawa ciri tema, tetapi tiap indeks mendapat nilai berbeda sehingga tidak ada latar kembar.",
      },
      {
        tanya: "Kenapa nama palet seperti Oranye Kasar",
        berkas: "api/src/lib/palette/names.js",
        penanda: "export function buatNama",
        catatan:
          "Nama dibentuk dari keluarga warna (Merah, Oranye, Kuning, dan seterusnya, ditentukan oleh hue) ditambah kata sifat tema. Tujuannya supaya tiap palet bisa disebut tanpa menyebut kode hex.",
      },
      {
        tanya: "Kenapa judul pratinjau bisa memakai warna utama",
        berkas: "api/src/lib/palette/generator.js",
        penanda: "const PASANGAN_DIPERIKSA",
        catatan:
          "Warna utama dan warna kedua wajib 4.5 banding 1 terhadap latar dan kartu, bukan hanya 3. Syarat itu yang membuat keduanya layak dipakai sebagai tulisan, bukan sekadar latar tombol.",
      },
      {
        tanya: "Roda warna untuk menjelaskan harmoni",
        berkas: "web/src/components/RodaWarna.tsx",
        penanda: "export function RodaWarna",
        catatan:
          "Menampilkan posisi hue warna utama dan warna kedua pada lingkaran, supaya perbedaan harmoni terlihat, bukan hanya terbaca sebagai nama.",
      },
      {
        tanya: "Kenapa monokrom dulu menghasilkan dua warna sama",
        berkas: "api/src/lib/palette/generator.js",
        penanda: "Math.abs(warnaDasar.L - warnaAksen.L) < 0.14",
        catatan:
          "Pada monokrom kedua warna berbagi hue, jadi hanya kecerahan yang memisahkan. Pemisahan dilakukan setelah kontras ditegakkan, kalau tidak, aturan kontras akan menariknya kembali.",
      },
      {
        tanya: "Halaman detail palet ada di mana",
        berkas: "web/src/pages/DetailPalet.tsx",
        penanda: "palet.warna.map",
        catatan:
          "Menampilkan pratinjau berbentuk antarmuka mini, lima peran warna beserta kodenya, dan tombol ekspor CSS.",
      },
      {
        tanya: "Halaman profil atau tentang",
        berkas: "web/src/pages/Tentang.tsx",
        penanda: "const TEKNOLOGI = [",
        catatan:
          "Memuat penyusun, ide dasar, teknologi, daftar endpoint, dan tautan repositori. Nama serta NIM diambil dari src/konfigurasi.ts.",
      },
      {
        tanya: "PWA dan manifest",
        berkas: "web/vite.config.ts",
        penanda: "manifest: {",
        catatan:
          "Nama, ikon 192 dan 512 termasuk maskable, display standalone, serta warna tema. Dihasilkan menjadi manifest.webmanifest saat build.",
      },
      {
        tanya: "Service worker dan cache offline",
        berkas: "web/src/sw.ts",
        penanda: "sw.addEventListener('fetch'",
        catatan:
          "Tiga cabang: permintaan /api/v1, navigasi halaman, dan aset. Strategi cache dijelaskan pada fungsi layaniApi di berkas yang sama.",
      },
    ],
  },
  {
    judul: "B. Tampilan dan navigasi",
    keterangan:
      "Kalau asisten menunjuk layar lalu bertanya kode mana yang menggambarnya.",
    entri: [
      {
        tanya: "Kerangka halaman dan bottom nav dipasang",
        berkas: "web/src/components/Layout.tsx",
        penanda: "<BottomNav />",
        catatan:
          "Nav dipasang sekali di layout induk, jadi tidak dibongkar-pasang saat pindah halaman.",
      },
      {
        tanya: "Tab aktif dan aria untuk pembaca layar",
        berkas: "web/src/components/BottomNav.tsx",
        penanda: "<NavLink",
        catatan:
          'NavLink memberi aria-current="page" otomatis, dan tampilan aktif ditandai garis atas serta warna teks.',
      },
      {
        tanya: "Tombol Generator dan perubahan tema",
        berkas: "web/src/pages/Generator.tsx",
        penanda: "useSearchParams",
        catatan:
          "Seluruh pengaturan disimpan di URL, bukan state lokal, sehingga hasil bisa dibagikan dan tetap ada setelah muat ulang.",
      },
      {
        tanya: "Permintaan ke API dari Generator",
        berkas: "web/src/pages/Generator.tsx",
        penanda: "api.buatPalet",
        catatan:
          "TanStack Query memanggil api.buatPalet dengan base, tema, harmoni, jumlah, seed, dan kecerahan sebagai kunci cache.",
      },
      {
        tanya: "Menyimpan palet ke koleksi",
        berkas: "web/src/hooks/useKoleksi.ts",
        penanda: "export function simpanPalet",
        catatan:
          "Disimpan ke localStorage dengan kunci chromavibe:koleksi:v1. Pembaca lain diberi tahu lewat useSyncExternalStore.",
      },
      {
        tanya: "Halaman koleksi membaca penyimpanan lokal",
        berkas: "web/src/hooks/useKoleksi.ts",
        penanda: "const KUNCI",
        catatan:
          "Kunci penyimpanan dan pembacaan awal. Tidak ada permintaan jaringan di halaman koleksi.",
      },
      {
        tanya: "Tombol simpan di kartu hasil",
        berkas: "web/src/components/TombolSimpan.tsx",
        penanda: "simpanPalet(palet)",
        catatan:
          "Satu komponen kecil yang membaca status koleksi, jadi tombol langsung berubah jadi Tersimpan.",
      },
      {
        tanya: "Tombol salin hex, CSS, dan Tailwind",
        berkas: "web/src/components/TombolSalin.tsx",
        penanda: "navigator.clipboard.writeText",
        catatan:
          "Memakai Clipboard API dengan fallback textarea untuk browser lama. Umpan balik Tersalin muncul 1,6 detik.",
      },
      {
        tanya: "Isi teks ekspor CSS",
        berkas: "web/src/utils/warna.ts",
        penanda: "export function hexKeCss",
        catatan:
          "Menghasilkan custom properties per peran warna. Versi Tailwind ada di fungsi berikutnya, hexKeTailwind.",
      },
      {
        tanya: "Pratinjau palet yang dipakai sungguhan",
        berkas: "web/src/pages/DetailPalet.tsx",
        penanda: "palet.warna.map",
        catatan:
          "Lima peran warna dirender berurutan dengan label, keterangan, dan kode hex yang bisa disalin.",
      },
    ],
  },
  {
    judul: "C. API dan validasi",
    keterangan: "Bagian server: rute, controller, skema, dan bentuk respons.",
    entri: [
      {
        tanya: "Rute generator dan urutannya",
        berkas: "api/src/routes/palet.routes.js",
        penanda: "router.get('/generate'",
        catatan:
          "/generate sengaja didaftarkan sebelum /:id. Kalau terbalik, kata generate akan dianggap id palet.",
      },
      {
        tanya: "Daftar palet per tema",
        berkas: "api/src/routes/tema.routes.js",
        penanda: "router.get('/:slug/palettes'",
        catatan:
          "Tiga rute tema: daftar, detail, dan palet per tema. Validasi slug dilakukan di controller.",
      },
      {
        tanya: "Daftar skema harmoni",
        berkas: "api/src/routes/meta.routes.js",
        penanda: "router.get('/harmoni'",
        catatan:
          "Meta dipisah dari tema dan palet agar tetap bisa dipakai aplikasi lain.",
      },
      {
        tanya: "Controller generator",
        berkas: "api/src/controllers/palet.controller.js",
        penanda: "export const generatePalet",
        catatan:
          "Memvalidasi query, menormalkan hex, memanggil generator, lalu membungkus hasilnya dengan ok().",
      },
      {
        tanya: "Validasi masuk sebelum logika berjalan",
        berkas: "api/src/controllers/palet.controller.js",
        penanda: "generateQuerySchema.parse",
        catatan:
          "Skema Zod dipanggil di baris pertama controller. Bila gagal, middleware error mengubahnya menjadi 400.",
      },
      {
        tanya: "Aturan validasi warna primer",
        berkas: "api/src/validators/palet.validator.js",
        penanda: "regex(/^#?[0-9a-fA-F]{6}$/",
        catatan:
          "Hex boleh tanpa tanda pagar, tetapi harus enam digit. Tema dan harmoni dibatasi enum dari konfigurasi.",
      },
      {
        tanya: "Penanganan galat terpusat",
        berkas: "api/src/app.js",
        penanda: "if (err instanceof ZodError)",
        catatan:
          "ZodError menjadi 400 dengan daftar field, ApiError memakai statusCode-nya, sisanya 500.",
      },
      {
        tanya: "Bentuk respons yang seragam",
        berkas: "api/src/utils/response.js",
        penanda: "export function ok",
        catatan:
          "Selalu { success, message, data }, sehingga klien cukup punya satu jalur baca.",
      },
      {
        tanya: "CORS untuk PWA yang beda origin",
        berkas: "api/src/app.js",
        penanda: "app.use(cors(opsiCors))",
        catatan:
          "Origin diambil dari CORS_ORIGIN. Tanpa ini, permintaan dari Vercel diblokir browser walau curl berhasil.",
      },
      {
        tanya: "Header cache pada respons GET",
        berkas: "api/src/app.js",
        penanda: "Cache-Control",
        catatan:
          "Lima menit segar, sepuluh menit stale-while-revalidate. Aman karena semua endpoint GET bersifat deterministik.",
      },
      {
        tanya: "Pembungkus async agar galat masuk middleware",
        berkas: "api/src/utils/asyncHandler.js",
        penanda: "export const asyncHandler",
        catatan:
          "Express 4 tidak menangkap penolakan promise. Pembungkus ini meneruskannya ke next().",
      },
    ],
  },
  {
    judul: "D. Mesin warna, inti yang ditanyakan penguji",
    keterangan:
      "Urutan penjelasan yang enak dipakai: konversi, tema, harmoni, gamut, lalu kontras.",
    entri: [
      {
        tanya: "Konversi sRGB ke OKLab",
        berkas: "api/src/lib/color/space.js",
        penanda: "export function rgbKeOklab",
        catatan:
          "Dekode gamma, matriks ke LMS, akar pangkat tiga, lalu matriks ke OKLab. Semua konstanta mengikuti spesifikasi Björn Ottosson.",
      },
      {
        tanya: "Konversi balik ke hex",
        berkas: "api/src/lib/color/space.js",
        penanda: "export function oklchKeHex",
        catatan:
          "Selalu melewati petakanGamut lebih dulu, jadi hasilnya tidak pernah terpotong di luar rentang.",
      },
      {
        tanya: "Memetakan warna ke dalam gamut sRGB",
        berkas: "api/src/lib/color/space.js",
        penanda: "export function petakanGamut",
        catatan:
          "Chroma diturunkan lewat pencarian biner 24 langkah. Lightness dan hue tidak diubah, jadi warna tidak kusam atau bergeser.",
      },
      {
        tanya: "Membaca kode hex dari pengguna",
        berkas: "api/src/lib/color/space.js",
        penanda: "export function parseHex",
        catatan:
          "Menerima tiga atau enam digit dengan atau tanpa pagar, dan melempar pesan jelas untuk masukan salah.",
      },
      {
        tanya: "Rumus kontras WCAG",
        berkas: "api/src/lib/color/contrast.js",
        penanda: "export function rasioKontras",
        catatan:
          "Selisih luminansi relatif ditambah 0,05. Luminansi memakai bobot 0,2126 merah, 0,7152 hijau, 0,0722 biru.",
      },
      {
        tanya: "Memberi nilai AA atau AAA",
        berkas: "api/src/lib/color/contrast.js",
        penanda: "export function nilaiWcag",
        catatan:
          "Ambang 7 untuk AAA, 4,5 untuk AA, 3 untuk teks besar, di bawah itu gagal.",
      },
      {
        tanya: "Daftar tema sebagai konfigurasi angka",
        berkas: "api/src/lib/palette/themes.js",
        penanda: "export const TEMA = [",
        catatan:
          "Tiap tema hanya berisi rentang chroma, rencana lightness per peran, klaster hue, dan jitter. Menambah tema berarti menambah satu objek di sini.",
      },
      {
        tanya: "Contoh tema Minimalis dan Brutalism",
        berkas: "api/src/lib/palette/themes.js",
        penanda: "slug: 'minimalis'",
        catatan:
          "Minimalis menyisakan chroma 0,008 sampai 0,035. Brutalism memakai chroma 0,26 sampai 0,34 dengan jitter nol.",
      },
      {
        tanya: "Fungsi utama pembuat palet",
        berkas: "api/src/lib/palette/generator.js",
        penanda: "export function buatPalet",
        catatan:
          "Masukan satu warna primer, keluaran lima peran warna beserta tabel kontras dan skor. Semua perhitungan ada di fungsi ini.",
      },
      {
        tanya: "Benih acak yang deterministik",
        berkas: "api/src/lib/palette/generator.js",
        penanda: "buatPrng(`",
        catatan:
          "Benih dibentuk dari base, tema, harmoni, seed, dan indeks. Input sama selalu menghasilkan palet dan id yang sama.",
      },
      {
        tanya: "PRNG yang dipakai",
        berkas: "api/src/lib/color/prng.js",
        penanda: "export function buatPrng",
        catatan:
          "mulberry32. Math.random tidak dipakai karena tidak bisa direproduksi, padahal URL hasil harus bisa dibagikan.",
      },
      {
        tanya: "Menegakkan kontras, bukan hanya memeriksa",
        berkas: "api/src/lib/palette/generator.js",
        penanda: "function tegakkanKontras",
        catatan:
          "Lightness digeser 0,02 per langkah menjauhi latar sampai ambang terpenuhi, maksimal 40 langkah.",
      },
      {
        tanya: "Enam pasangan yang diuji",
        berkas: "api/src/lib/palette/generator.js",
        penanda: "const PASANGAN_DIPERIKSA",
        catatan:
          "Teks terhadap latar dan permukaan pada 4,5. Primer dan aksen terhadap latar dan permukaan pada 3.",
      },
      {
        tanya: "Skema harmoni warna",
        berkas: "api/src/lib/color/harmony.js",
        penanda: "export const HARMONI = [",
        catatan:
          "Enam skema sebagai offset hue: komplementer, analog, triadik, split, tetradik, monokrom.",
      },
      {
        tanya: "Saran warna primer per tema",
        berkas: "api/src/lib/palette/generator.js",
        penanda: "export function saranWarnaTema",
        catatan:
          "Diambil dari klaster hue tema. Dipakai halaman Generator sebagai titik awal saat pengguna belum memilih warna.",
      },
      {
        tanya: "Nama palet yang tidak itu-itu saja",
        berkas: "api/src/lib/palette/names.js",
        penanda: "export function buatNama",
        catatan:
          "Kosakata per tema, dipilih memakai PRNG yang sama, termasuk menghindari kata kembar seperti Neon Neon.",
      },
    ],
  },
  {
    judul: "E. Data dan PWA",
    keterangan:
      "Sumber data palet kurasi serta perilaku aplikasi saat jaringan mati.",
    entri: [
      {
        tanya: "Saklar Supabase dan data contoh",
        berkas: "api/src/config/sumber-data.js",
        penanda: "export async function ambilPaletKurasi",
        catatan:
          "Kalau kredensial belum diisi, membaca JSON contoh. Controller tidak perlu tahu sumbernya.",
      },
      {
        tanya: "Pemeriksaan kredensial Supabase",
        berkas: "api/src/config/supabase.js",
        penanda: "export function requireSupabase",
        catatan:
          "Melempar 503 kalau belum dikonfigurasi. Kunci service role tidak pernah keluar dari proses server.",
      },
      {
        tanya: "Pembangkit palet kurasi",
        berkas: "api/scripts/bangun-seed.js",
        penanda: "const KURASI",
        catatan:
          "Tiga puluh pasangan warna dan tema. Warnanya tetap hasil generator, bukan ditulis tangan.",
      },
      {
        tanya: "Skema tabel Supabase",
        berkas: "supabase/schema.sql",
        penanda: "create table if not exists palet",
        catatan:
          "Satu tabel dengan kolom jsonb untuk warna, pasangan kontras, dan ringkasan.",
      },
      {
        tanya: "Alamat API di sisi klien",
        berkas: "web/src/api/client.ts",
        penanda: "export const DASAR_API",
        catatan:
          "Dibaca dari VITE_API_URL. Tidak ada URL yang ditanam langsung di kode sumber.",
      },
      {
        tanya: "Menangkap kegagalan jaringan di klien",
        berkas: "web/src/api/client.ts",
        penanda: "chromavibe:jaringan-gagal",
        catatan:
          "fetch yang gagal, atau balasan 503 dari service worker, memicu kejadian ini untuk menampilkan penanda offline.",
      },
      {
        tanya: "Penanda offline di atas halaman",
        berkas: "web/src/components/PenandaOffline.tsx",
        penanda: "chromavibe:jaringan-gagal",
        catatan:
          "navigator.onLine saja tidak cukup, karena perangkat bisa tersambung WiFi tetapi server API mati.",
      },
      {
        tanya: "Cache kerangka aplikasi saat instalasi",
        berkas: "web/src/sw.ts",
        penanda: "sw.addEventListener('install'",
        catatan:
          "Daftar berkas dari manifest Vite dideduplikasi, karena Cache.addAll menolak daftar berisi URL kembar.",
      },
      {
        tanya: "Strategi cache untuk permintaan API",
        berkas: "web/src/sw.ts",
        penanda: "async function layaniApi",
        catatan:
          "Stale while revalidate: jawab dari cache, perbarui di latar. Aman karena hasil generator deterministik.",
      },
      {
        tanya: "Jatuh ke halaman tersimpan saat offline",
        berkas: "web/src/sw.ts",
        penanda: "async function layaniNavigasi",
        catatan:
          "Network first, lalu cache halaman yang pernah dibuka, lalu index.html dari precache.",
      },
    ],
  },
  {
    judul: "F. Pengujian, bukti yang bisa ditunjukkan",
    keterangan:
      "Jalankan `npm test` di folder api, lalu tunjuk berkas uji yang relevan.",
    entri: [
      {
        tanya: "Bukti konversi warna tidak merusak nilai",
        berkas: "api/tests/color.test.js",
        penanda: "putaran hex ke OKLCH",
        catatan:
          "Sepuluh warna diuji bolak-balik dengan toleransi satu tingkat dari 255, plus nilai acuan merah dan penanganan di luar gamut.",
      },
      {
        tanya: "Bukti rumus kontras benar",
        berkas: "api/tests/kontras.test.js",
        penanda: "#767676",
        catatan:
          "Hitam di atas putih harus tepat 21, dan abu 767676 di atas putih harus 4,54 sesuai acuan WCAG.",
      },
      {
        tanya: "Bukti generator deterministik",
        berkas: "api/tests/generator.test.js",
        penanda: "input yang sama menghasilkan palet identik",
        catatan:
          "Dua pemanggilan identik dibandingkan id, warna, dan namanya. Ada juga uji seed berbeda menghasilkan palet berbeda.",
      },
      {
        tanya: "Bukti teks selalu lolos kontras di semua tema",
        berkas: "api/tests/generator.test.js",
        penanda: "teks pada setiap tema",
        catatan:
          "Sepuluh tema dikali lima warna primer. Rasio teks terhadap latar dan permukaan wajib minimal 4,5.",
      },
    ],
  },
];

function pecahBaris(berkas) {
  try {
    return readFileSync(`${AKAR}${berkas}`, "utf8").split("\n");
  } catch {
    return null;
  }
}

function cariBaris(baris, penanda) {
  const indeks = baris.findIndex((isi) => isi.includes(penanda));
  return indeks === -1 ? null : indeks + 1;
}

const gagal = [];
const baris = [];

baris.push("# Peta Kode ChromaVibe");
baris.push("");
baris.push(
  "Dokumen ini memetakan fitur ke berkas dan nomor baris, dipakai saat responsi. Nomor baris",
);
baris.push(
  "dihitung langsung dari berkas sumber oleh `npm run peta`, jadi selalu sesuai kode terakhir.",
);
baris.push("");
baris.push(
  "Satu hal yang perlu diingat: jangan menghafal nomor baris, hafalkan nama berkasnya. Kalau",
);
baris.push(
  "nomor bergeser setelah kamu menyunting kode, jalankan `npm run peta` lagi dan tabel ini",
);
baris.push("diperbarui otomatis.");
baris.push("");

for (const bagian of BAGIAN) {
  baris.push(`## ${bagian.judul}`);
  baris.push("");
  baris.push(bagian.keterangan);
  baris.push("");
  baris.push("| Kalau ditanya | Berkas | Baris | Yang dijelaskan |");
  baris.push("| --- | --- | --- | --- |");

  for (const entri of bagian.entri) {
    const isi = pecahBaris(entri.berkas);
    if (!isi) {
      gagal.push(`${entri.berkas} tidak terbaca`);
      continue;
    }

    const nomor = cariBaris(isi, entri.penanda);
    if (nomor === null)
      gagal.push(`${entri.berkas} tidak memuat penanda "${entri.penanda}"`);

    baris.push(
      `| ${entri.tanya} | \`${entri.berkas}\` | ${nomor ?? "-"} | ${entri.catatan} |`,
    );
  }

  baris.push("");
}

baris.push(
  "## Urutan menjelaskan satu permintaan, dari layar sampai basis data",
);
baris.push("");
baris.push(
  "Kalau asisten minta ditelusuri, ikuti urutan ini. Jangan melompat ke generator sebelum",
);
baris.push("menyebut siapa yang memanggilnya.");
baris.push("");
baris.push(
  "1. Pengguna menekan tombol di `web/src/pages/Generator.tsx`. Pengaturan ditulis ke URL.",
);
baris.push(
  "2. `web/src/api/client.ts` menyusun `GET /api/v1/palettes/generate` dan memanggil fetch.",
);
baris.push(
  "3. `web/src/sw.ts` melihat path `/api/v1/`, lalu menjawab dari cache atau meneruskan.",
);
baris.push(
  "4. `api/src/routes/palet.routes.js` mencocokkan rute ke controller.",
);
baris.push(
  "5. `api/src/validators/palet.validator.js` memeriksa query lewat Zod.",
);
baris.push(
  "6. `api/src/lib/palette/generator.js` menyusun lima peran warna dan menegakkan kontras.",
);
baris.push(
  "7. `api/src/lib/color/space.js` mengonversi OKLCH ke hex di dalam gamut sRGB.",
);
baris.push(
  "8. `api/src/utils/response.js` membungkus hasil, lalu klien merender kartu.",
);
baris.push("");
baris.push(
  "## Tujuh pertanyaan yang hampir pasti muncul, beserta jawaban lisannya",
);
baris.push("");
baris.push("**Kenapa memakai OKLCH, bukan HSL?**");
baris.push(
  "HSL menipu secara perseptual. Dua warna dengan lightness HSL 50 persen bisa terlihat sangat",
);
baris.push(
  "berbeda tingkat keterangannya, terutama pada kuning dan biru. Di OKLCH, kenaikan lightness",
);
baris.push(
  "yang sama terasa setara di seluruh hue, jadi rencana lightness sebuah tema bisa diandalkan.",
);
baris.push("");
baris.push("**Bagaimana palet dijamin terbaca?**");
baris.push(
  "Ada dua aturan setelah warna disusun: teks terhadap latar dan permukaan minimal 4,5 banding",
);
baris.push(
  "1, sedangkan primer dan aksen minimal 3 banding 1. Bila belum, lightness digeser bertahap",
);
baris.push(
  "sampai lolos. Uji otomatis memeriksa aturan itu pada sepuluh tema dan lima warna primer.",
);
baris.push("");
baris.push("**Kenapa endpoint generator memakai GET, bukan POST?**");
baris.push(
  "Karena hasilnya deterministik. GET bisa di-cache HTTP dan oleh service worker, URL-nya bisa",
);
baris.push(
  "dibagikan, dan halaman tetap menampilkan hasil terakhir saat offline. Tidak ada data yang",
);
baris.push("ditulis ke server, jadi POST tidak memberi keuntungan apa pun.");
baris.push("");
baris.push("**Di mana buktinya hasil selalu sama untuk input yang sama?**");
baris.push(
  "Di `api/src/lib/color/prng.js`, PRNG diberi benih dari kombinasi input. Ujinya ada di",
);
baris.push(
  "`api/tests/generator.test.js`, membandingkan id, warna, dan nama dari dua pemanggilan.",
);
baris.push("");
baris.push("**Mengapa palet favorit tidak disimpan di Supabase?**");
baris.push(
  "Tidak ada autentikasi, jadi menyimpannya di server memaksa pembuatan identitas perangkat.",
);
baris.push(
  "Favorit disimpan di localStorage lewat `web/src/hooks/useKoleksi.ts`, tetap bekerja tanpa",
);
baris.push("jaringan dan tanpa akun.");
baris.push("");
baris.push("**Kenapa antarmukanya hampir tanpa warna?**");
baris.push(
  "Seluruh chrome aplikasi memakai skala abu-abu netral di `web/src/index.css`. Satu-satunya",
);
baris.push(
  "warna di layar adalah palet yang sedang dinilai, supaya mata tidak berebut antara warna",
);
baris.push("merek aplikasi dan warna objek yang diuji.");
baris.push("");
baris.push("**Apa yang terjadi kalau Supabase belum diisi?**");
baris.push(
  "API memakai data contoh dari `api/src/data/palet.kurasi.json` dan menulis satu peringatan di",
);
baris.push(
  "log. Data itu dibangun generator yang sama lewat `npm run seed`, jadi bukan angka karangan.",
);
baris.push("");
baris.push("**Apa itu harmoni, dan seberapa besar pengaruhnya?**");
baris.push(
  "Harmoni adalah aturan jarak hue antara warna primer pengguna dan warna aksen. Jaraknya diukur",
);
baris.push(
  "dalam derajat pada lingkaran warna OKLCH, lalu diubah menjadi enam pilihan: komplementer 180",
);
baris.push(
  "derajat, analog lebih kurang 30, triadik 120 dan 240, split 150 dan 210, tetradik empat sumbu,",
);
baris.push(
  "dan monokrom tanpa pergeseran. Pengaruhnya besar pada warna aksen, tetapi tidak mengubah latar",
);
baris.push(
  "maupun teks, karena keduanya diatur tema. Ringkasnya: tema mengatur terang-gelap dan seberapa",
);
baris.push("pekat warnanya, harmoni mengatur posisi hue aksen.");
baris.push("");
baris.push(
  "**Kenapa beranda dimulai dari memilih tema, bukan langsung generator?**",
);
baris.push(
  "Tema adalah sumbu yang paling mudah dipahami orang awam, dan ia yang menentukan apakah hasilnya",
);
baris.push(
  "terasa seperti Y2K, Brutalism, atau Elegant. Kalau pengguna diarahkan ke pemilih warna lebih",
);
baris.push(
  "dulu, satu warna tanpa konteks tidak memberi gambaran apa pun. Beranda menampilkan sepuluh",
);
baris.push(
  "tema sebagai daftar yang bisa ditelusuri, lalu halaman tema menawarkan tombol menuju Generator",
);
baris.push("dengan tema tersebut sudah terpilih.");
baris.push("");
baris.push(
  "**Kenapa lima palet bisa terlihat sama, dan apa yang diperbaiki?**",
);
baris.push(
  "Versi pertama hanya menggeser hue lima derajat per variasi, sedangkan latar dan permukaan",
);
baris.push(
  "dikunci tema, sehingga kelima palet nyaris identik. Sekarang variasi menggeser anak tangga",
);
baris.push(
  "kecerahan latar, kecerahan warna primer, dan posisi aksen pada skema harmoni. Khusus monokrom,",
);
baris.push(
  "primer dan aksen digeser ke arah berlawanan supaya terbaca sebagai dua tingkat kecerahan.",
);
baris.push(
  "`buatDaftarPalet` juga menolak kandidat yang warnanya atau namanya kembar, dan uji otomatis",
);
baris.push("memastikan lima palet selalu berbeda untuk setiap tema.");
baris.push("");
baris.push("## Kalau nomor baris bergeser");
baris.push("");
baris.push("```bash");
baris.push("npm run peta");
baris.push("```");
baris.push("");
baris.push(
  "Perintah itu menghitung ulang seluruh nomor di dokumen ini. Kalau ada penanda yang hilang,",
);
baris.push(
  "skrip akan menyebut nama berkas dan penandanya supaya mudah dibetulkan.",
);
baris.push("");

writeFileSync(`${AKAR}PETA-KODE.md`, `${baris.join("\n")}`, "utf8");

if (gagal.length > 0) {
  console.error("Penanda berikut tidak ditemukan:");
  for (const item of gagal) console.error(`  - ${item}`);
  process.exitCode = 1;
} else {
  console.log(
    `PETA-KODE.md dibuat. ${BAGIAN.length} bagian, semua penanda ketemu.`,
  );
}
