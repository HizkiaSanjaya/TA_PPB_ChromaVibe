import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Pembuat INVENTARIS-FUNGSI.md.
 *
 * Menelusuri seluruh berkas sumber, lalu mencatat fungsi, komponen, kelas, dan
 * middleware beserta nomor barisnya. Dipakai saat responsi kalau penguji
 * membuka satu berkas dan bertanya "isinya apa saja".
 */

const AKAR = fileURLToPath(new URL('..', import.meta.url))
const FOLDER = ['api/src', 'web/src']
const EKSTENSI = /\.(js|ts|tsx)$/

function telusuri(folder) {
  const hasil = []

  for (const nama of readdirSync(join(AKAR, folder))) {
    const penuh = join(AKAR, folder, nama)
    if (statSync(penuh).isDirectory()) hasil.push(...telusuri(join(folder, nama)))
    else if (EKSTENSI.test(nama)) hasil.push(`${folder}/${nama}`.replace(/\\/g, '/'))
  }

  return hasil
}

/**
 * Daftar pola pengenal. `hanyaAtas` berarti pola itu diabaikan kalau barisnya
 * menjorok, supaya variabel di dalam fungsi tidak ikut terhitung.
 */
const POLA = [
  { regex: /^export default function (\w+)/, jenis: 'komponen utama' },
  { regex: /^export default /, jenis: 'ekspor bawaan' },
  { regex: /^export async function (\w+)/, jenis: 'fungsi' },
  { regex: /^export function (\w+)/, jenis: 'fungsi' },
  { regex: /^export const (\w+) = asyncHandler/, jenis: 'handler rute' },
  { regex: /^export const (\w+) = z\./, jenis: 'skema validasi' },
  { regex: /^export const (\w+) = \[/, jenis: 'konstanta larik' },
  { regex: /^export const (\w+) = \{/, jenis: 'konstanta objek' },
  { regex: /^export const (\w+) = /, jenis: 'konstanta' },
  { regex: /^export class (\w+)/, jenis: 'kelas' },
  { regex: /^export interface (\w+)/, jenis: 'tipe data' },
  { regex: /^export type (\w+)/, jenis: 'tipe data' },
  { regex: /^async function (\w+)/, jenis: 'fungsi dalam', hanyaAtas: true },
  { regex: /^function (\w+)/, jenis: 'fungsi dalam', hanyaAtas: true },
  { regex: /^const (\w+) = \(/, jenis: 'fungsi dalam', hanyaAtas: true },
  { regex: /^app\.get\('([^']+)'/, jenis: 'rute' },
  { regex: /^app\.use\('([^']+)'/, jenis: 'router' },
  { regex: /^app\.use\(\(err/, jenis: 'penangan galat' },
  { regex: /^app\.use\(\(req/, jenis: 'middleware' },
  { regex: /^router\.get\('([^']+)'/, jenis: 'rute' },
  { regex: /^sw\.addEventListener\('(\w+)'/, jenis: 'pendengar service worker' },
]

function bacaIsi(berkas) {
  const baris = readFileSync(join(AKAR, berkas), 'utf8').split('\n')

  // Berkas yang diakhiri baris baru menghasilkan satu elemen kosong di ujung.
  // Buang supaya jumlah baris sama dengan yang terlihat di editor.
  if (baris.at(-1) === '') baris.pop()

  const hasil = []

  for (let i = 0; i < baris.length; i += 1) {
    const mentah = baris[i]
    const isi = mentah.trim()
    const menjorok = /^\s/.test(mentah)

    for (const { regex, jenis, hanyaAtas } of POLA) {
      if (hanyaAtas && menjorok) continue

      const cocok = regex.exec(isi)
      if (!cocok) continue

      hasil.push({ nama: cocok[1] ?? '(tanpa nama)', jenis, baris: i + 1 })
      break
    }
  }

  return { jumlahBaris: baris.length, daftar: hasil }
}

const KETERANGAN = {
  'api/src/app.js': 'Titik masuk server: middleware, daftar rute, penanganan galat',
  'api/src/server.js': 'Menyalakan server di port dari .env',
  'api/src/config/supabase.js': 'Membuat koneksi Supabase, gagal jika kunci kosong',
  'api/src/config/sumber-data.js': 'Pintu data palet: Supabase atau berkas contoh',
  'api/src/controllers/tema.controller.js': 'Menjawab permintaan daftar dan detail tema',
  'api/src/controllers/palet.controller.js': 'Menjawab permintaan palet dan generator',
  'api/src/routes/tema.routes.js': 'Pemetaan URL tema',
  'api/src/routes/palet.routes.js': 'Pemetaan URL palet dan generator',
  'api/src/routes/meta.routes.js': 'Pemetaan URL daftar harmoni',
  'api/src/validators/palet.validator.js': 'Aturan validasi masukan generator',
  'api/src/utils/ApiError.js': 'Kelas galat yang membawa kode status',
  'api/src/utils/asyncHandler.js': 'Pembungkus agar galat async masuk middleware',
  'api/src/utils/response.js': 'Pembungkus bentuk respons seragam',
  'api/src/lib/color/space.js': 'Konversi warna hex, OKLab, dan OKLCH',
  'api/src/lib/color/contrast.js': 'Rumus keterbacaan WCAG',
  'api/src/lib/color/harmony.js': 'Enam skema harmoni',
  'api/src/lib/color/prng.js': 'Angka acak berbenih yang bisa diulang',
  'api/src/lib/palette/generator.js': 'Inti penyusun palet',
  'api/src/lib/palette/themes.js': 'Sepuluh tema sebagai konfigurasi angka',
  'api/src/lib/palette/names.js': 'Penamaan palet dari warna dan tema',
  'web/src/main.tsx': 'Menempelkan React ke halaman',
  'web/src/App.tsx': 'Daftar rute halaman',
  'web/src/sw.ts': 'Service worker: cache, offline, pembaruan',
  'web/src/index.css': 'Token warna dan aturan dasar tampilan',
  'web/src/konfigurasi.ts': 'Identitas aplikasi dan penyusun',
  'web/src/api/client.ts': 'Penghubung ke API dan daftar endpoint',
  'web/src/api/types.ts': 'Bentuk data yang dikirim API',
  'web/src/utils/warna.ts': 'Bantuan warna: label, rasio, ekspor CSS',
  'web/src/data/warna-umum.ts': 'Daftar warna bernama dan tingkat kecerahan',
  'web/src/hooks/useKoleksi.ts': 'Menyimpan palet di perangkat',
  'web/src/hooks/usePasang.ts': 'Status pemasangan PWA',
  'web/src/components/BottomNav.tsx': 'Navigasi bawah lima tab',
  'web/src/components/Layout.tsx': 'Kerangka halaman, nav, dan penanda offline',
  'web/src/components/Ikon.tsx': 'Kumpulan ikon SVG',
  'web/src/components/KartuTema.tsx': 'Kartu tema bergaya cuplikan antarmuka',
  'web/src/components/PratinjauPalet.tsx': 'Miniatur antarmuka dari lima warna',
  'web/src/components/RodaWarna.tsx': 'Roda warna untuk menjelaskan harmoni',
  'web/src/components/Status.tsx': 'Tampilan memuat, galat, dan kosong',
  'web/src/components/Tombol.tsx': 'Tiga jenis tombol dan tautan',
  'web/src/components/TombolSalin.tsx': 'Tombol salin ke papan klip',
  'web/src/components/TombolSimpan.tsx': 'Tombol simpan ke koleksi',
  'web/src/components/StripWarna.tsx': 'Deretan warna dalam satu baris',
  'web/src/components/KepalaHalaman.tsx': 'Judul halaman dan tombol kembali',
  'web/src/components/PenandaOffline.tsx': 'Pemberitahuan saat server tidak terjangkau',
  'web/src/pages/Beranda.tsx': 'Daftar tema',
  'web/src/pages/DetailTema.tsx': 'Daftar palet dalam satu tema',
  'web/src/pages/DetailPalet.tsx': 'Rincian satu palet',
  'web/src/pages/Generator.tsx': 'Pembuat palet baru',
  'web/src/pages/Koleksi.tsx': 'Palet yang disimpan',
  'web/src/pages/Panduan.tsx': 'Penjelasan lima warna dan enam harmoni',
  'web/src/pages/Tentang.tsx': 'Profil aplikasi dan penyusun',
  'web/src/pages/TidakDitemukan.tsx': 'Halaman 404',
}

const semua = [...telusuri(FOLDER[0]), ...telusuri(FOLDER[1])].sort()

let keluaran = `# Inventaris Fungsi per Berkas

Dibuat otomatis oleh \`npm run fungsi\`. Nomor baris dihitung langsung dari kode,
jadi selalu sesuai berkas terakhir.

Cara pakai saat responsi: kalau penguji membuka satu berkas dan bertanya
"isinya apa saja", sebutkan dulu tujuan berkasnya, lalu fungsi utamanya, lalu
fungsi pembantunya. Kolom terakhir menunjukkan bedanya.

`

let total = 0

for (const berkas of semua) {
  const { jumlahBaris, daftar } = bacaIsi(berkas)
  total += daftar.length

  keluaran += `## \`${berkas}\`\n\n`
  if (KETERANGAN[berkas]) keluaran += `${KETERANGAN[berkas]}\n\n`
  keluaran += `Jumlah baris: ${jumlahBaris}. Isi: ${daftar.length} penanda.\n\n`

  if (daftar.length === 0) {
    keluaran += '_Tidak ada fungsi, hanya isi langsung._\n\n'
    continue
  }

  keluaran += '| Baris | Nama | Jenis |\n| --- | --- | --- |\n'
  for (const item of daftar) {
    keluaran += `| ${item.baris} | \`${item.nama}\` | ${item.jenis} |\n`
  }
  keluaran += '\n'
}

keluaran += `---

Total ${semua.length} berkas, ${total} penanda fungsi dan kelas.

Untuk memperbarui berkas ini setelah menyunting kode:

\`\`\`bash
npm run fungsi
\`\`\`
`

writeFileSync(join(AKAR, 'INVENTARIS-FUNGSI.md'), keluaran, 'utf8')
console.log(`INVENTARIS-FUNGSI.md dibuat. ${semua.length} berkas, ${total} penanda.`)
