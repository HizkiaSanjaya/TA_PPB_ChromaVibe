import { createHash } from 'node:crypto'

import { batasi, bulatkanWarna, hexKeOklch, normalkanHue, oklchKeHex } from '../color/space.js'
import {
  bulatkanRasio,
  luminansiRelatif,
  periksaPasangan,
  rasioKontras,
} from '../color/contrast.js'
import { ambilHarmoni } from '../color/harmony.js'
import { buatPrng } from '../color/prng.js'
import { ambilTema } from './themes.js'
import { buatNama } from './names.js'

// Ambang berbeda sesuai pemakaian. Teks dan warna utama dipakai sebagai
// tulisan, jadi wajib 4.5. Warna kedua dipakai sebagai isian dan garis, cukup 3
// sesuai WCAG untuk komponen non-teks. Kalau dipaksa 4.5, warna cerah seperti
// kuning jadi nyaris hitam dan kehilangan kepekatannya.
const PASANGAN_DIPERIKSA = [
  ['text', 'background', 4.5],
  ['text', 'surface', 4.5],
  ['base', 'background', 4.5],
  ['base', 'surface', 4.5],
  ['accent', 'background', 3],
  ['accent', 'surface', 3],
]

const URUTAN_PERAN = ['background', 'surface', 'base', 'accent', 'text']

/**
 * Menaikkan atau menurunkan lightness sampai ambang kontras tercapai.
 * Arah geser mengikuti gelap terangnya latar, bukan selera.
 */
function tegakkanKontras(warna, hexLatar, ambang, gelap) {
  let hasil = { ...warna }
  const arah = gelap ? 0.02 : -0.02

  for (let langkah = 0; langkah < 40; langkah += 1) {
    if (rasioKontras(oklchKeHex(hasil), hexLatar) >= ambang) break
    const lightness = batasi(hasil.L + arah, 0.02, 0.995)
    if (lightness === hasil.L) break
    hasil = { ...hasil, L: lightness }
  }

  return hasil
}

function sidikPalet(warna, tema, harmoni, seed, indeks) {
  const bahan = JSON.stringify({ warna, tema, harmoni, seed, indeks })
  return createHash('sha256').update(bahan).digest('hex').slice(0, 10)
}

/**
 * Menghasilkan satu palet dari satu warna primer. Deterministik: input sama
 * selalu menghasilkan keluaran sama. `terang` 10 sampai 100 menggantikan
 * kecerahan warna pilihan; kalau kosong, kecerahan asli yang dipakai.
 */
export function buatPalet({
  base,
  tema,
  harmoni = 'triadik',
  seed = 0,
  indeks = 0,
  terang = null,
}) {
  const konfigurasi = ambilTema(tema)
  if (!konfigurasi) throw new Error(`Tema tidak dikenal: ${tema}`)

  const skemaHarmoni = ambilHarmoni(harmoni)
  if (!skemaHarmoni) throw new Error(`Harmoni tidak dikenal: ${harmoni}`)

  const acak = buatPrng(`${String(base).toUpperCase()}|${tema}|${harmoni}|${seed}|${indeks}`)
  const dasar = hexKeOklch(base)

  // Indeks menentukan variasi dalam satu rangkaian. Pergeseran latar naik terus
  // mengikuti indeks, bukan berulang tiap beberapa langkah, supaya palet tidak
  // mendapat latar yang sama ketika ada kandidat ditolak karena nama kembar.
  const dasarGelap = konfigurasi.lightness.background <= 0.5
  const geserDasar = (dasarGelap ? 1 : -1) * indeks * 0.04

  const jitter = (acak() * 2 - 1) * konfigurasi.jitter
  const hueDasar = normalkanHue(dasar.h + jitter)

  const offset = skemaHarmoni.offset
  const pilihanAksen = offset.length > 1 ? offset.length - 1 : 1
  const posisiAksen = offset.length > 1 ? 1 + (indeks % pilihanAksen) : 0
  const hueAksen = normalkanHue(hueDasar + offset[posisiAksen] + (acak() * 2 - 1) * 6)

  // Kecerahan: 10 persen berarti warna sangat gelap, 100 persen sangat terang.
  // Angka ini mengatur warna pilihan pengguna, bukan latar.
  const kecerahanPengguna =
    terang === null ? dasar.L : 0.15 + ((batasi(terang, 10, 100) - 10) / 90) * 0.8

  // Geseran variasi tidak dipakai saat pengguna menentukan kecerahan sendiri,
  // karena akan melawan angka yang baru saja dia pilih.
  const geserDasarAktif = terang === null ? geserDasar : 0

  // Warna pilihan pengguna harus tetap dominan. Sebelumnya 55 persen
  // kecerahannya diambil dari tema, sehingga warna merah, hijau, dan biru
  // hasilnya nyaris sama.
  const warnaDasar = {
    L: batasi(
      0.85 * kecerahanPengguna +
        0.15 * konfigurasi.lightness.aksen +
        geserDasarAktif +
        (acak() - 0.5) * 0.03,
      0.1,
      0.95
    ),
    C: batasi(dasar.C, konfigurasi.chroma[0] * 0.7, konfigurasi.chroma[1]),
    h: hueDasar,
  }

  // Latar harus berada di sisi berlawanan dari kecerahan warna, kalau tidak
  // aturan kontras akan menolak warnanya dan tombol kecerahan terasa mati.
  // Warna terang dipasang di latar gelap, warna gelap di latar terang.
  //
  // Titik awalnya tetap kepekatan tema masing-masing, supaya Elegant dan
  // Brutalism tidak jadi sama. Pergeserannya memakai perbandingan emas dan
  // hanya bergerak menjauh dari ujung, sehingga tiap indeks berbeda tanpa
  // mentok di batas.
  const EMAS = 0.6180339887498949
  const sebar = (i) => (i * EMAS) % 1

  let latarL
  let surfaceL

  if (terang === null) {
    latarL = dasarGelap
      ? konfigurasi.lightness.background + sebar(indeks) * 0.06
      : konfigurasi.lightness.background - sebar(indeks) * 0.075

    surfaceL = dasarGelap ? Math.min(0.24, latarL + 0.06) : Math.min(0.995, latarL + 0.02)
  } else {
    const inginGelap = kecerahanPengguna >= 0.55

    latarL = inginGelap ? 0.1 + sebar(indeks) * 0.1 : 0.98 - sebar(indeks) * 0.12
    surfaceL = inginGelap ? Math.min(0.24, latarL + 0.06) : Math.min(0.995, latarL + 0.012)
  }

  // Latar dan kartu ikut diwarnai hue pilihan pengguna. Sebelumnya kromanya
  // hanya 0,016 sehingga praktis abu-abu, dan semua tema terang terlihat sama.
  const warnaBackground = {
    L: batasi(latarL, 0.06, 0.995),
    C: Math.min(konfigurasi.chroma[0] * 0.5, 0.05),
    h: normalkanHue(hueDasar + (acak() - 0.5) * 8),
  }

  const warnaSurface = {
    L: batasi(surfaceL, 0.06, 1),
    C: Math.min(konfigurasi.chroma[0] * 0.75, 0.07),
    h: normalkanHue(hueDasar + (acak() - 0.5) * 8),
  }

  const hexBackground = oklchKeHex(warnaBackground)
  const hexSurface = oklchKeHex(warnaSurface)

  // Arah penggeseran kontras ditentukan dari latar yang benar-benar dipakai,
  // bukan dari label tema. Kalau kecerahan membalik latar, arahnya ikut berubah.
  const latarGelap = luminansiRelatif(hexBackground) < 0.35

  // Pada monokrom, warna utama dan warna kedua berbagi hue. Satu-satunya
  // pembeda adalah kecerahan, jadi keduanya digeser ke arah berlawanan.
  const arahAksen = harmoni === 'monokrom' ? -1 : 1

  let warnaAksen = {
    L: batasi(
      konfigurasi.lightness.aksen + arahAksen * indeks * 0.03 + (acak() - 0.5) * 0.04,
      0.1,
      0.95
    ),
    C: batasi(warnaDasar.C * (1.05 + acak() * 0.25), konfigurasi.chroma[0], konfigurasi.chroma[1]),
    h: hueAksen,
  }

  // Warna primer ditegakkan lebih dulu supaya posisinya final.
  warnaDasar.L = tegakkanKontras(warnaDasar, hexSurface, 4.5, latarGelap).L
  warnaDasar.L = tegakkanKontras(warnaDasar, hexBackground, 4.5, latarGelap).L

  // Warna kedua cukup 3 banding 1, sesuai pemakaiannya sebagai isian dan garis.
  // Ambang rendah ini yang membuat warnanya tetap pekat, bukan menjadi hitam.
  warnaAksen = tegakkanKontras(warnaAksen, hexSurface, 3, latarGelap)
  warnaAksen = tegakkanKontras(warnaAksen, hexBackground, 3, latarGelap)

  // Khusus monokrom, kedua warna berbagi hue, jadi hanya kecerahan yang bisa
  // memisahkan. Pada skema lain, perbedaan hue sudah cukup dan kecerahan tidak
  // perlu digeser, karena menggesernya justru menghilangkan kepekatan warna.
  if (harmoni === 'monokrom' && Math.abs(warnaDasar.L - warnaAksen.L) < 0.14) {
    warnaAksen.L = batasi(latarGelap ? warnaDasar.L + 0.3 : warnaDasar.L - 0.3, 0.05, 0.97)
    warnaAksen = tegakkanKontras(warnaAksen, hexSurface, 3, latarGelap)
    warnaAksen = tegakkanKontras(warnaAksen, hexBackground, 3, latarGelap)
  }

  let warnaTeks = { L: konfigurasi.lightness.teks, C: 0.006, h: hueDasar }
  warnaTeks = tegakkanKontras(warnaTeks, hexSurface, 4.5, latarGelap)
  warnaTeks = tegakkanKontras(warnaTeks, hexBackground, 4.5, latarGelap)

  const mentah = {
    background: warnaBackground,
    surface: warnaSurface,
    base: warnaDasar,
    accent: warnaAksen,
    text: warnaTeks,
  }

  const warna = URUTAN_PERAN.map((peran) => ({
    peran,
    hex: oklchKeHex(mentah[peran]),
    oklch: bulatkanWarna(mentah[peran]),
  }))

  const pasangan_kontras = periksaPasangan(warna, PASANGAN_DIPERIKSA)
  const pasanganTeks = pasangan_kontras.filter((item) => item.peran_depan === 'text')
  const pasanganAksen = pasangan_kontras.filter((item) => item.peran_depan === 'accent')
  const jumlahLolos = pasangan_kontras.filter((item) => item.lolos).length

  return {
    id: `gen_${sidikPalet(
      warna.map((item) => item.hex),
      tema,
      harmoni,
      seed,
      indeks
    )}`,
    nama: buatNama(tema, acak, { hue: hueDasar, kroma: warnaDasar.C }),
    tema,
    tema_nama: konfigurasi.nama,
    harmoni,
    harmoni_nama: skemaHarmoni.nama,
    warna,
    pasangan_kontras,
    ringkasan: {
      teks_lolos_aa: pasanganTeks.every((item) => item.lolos),
      aksen_lolos: pasanganAksen.every((item) => item.lolos),
      rasio_teks_terendah: bulatkanRasio(Math.min(...pasanganTeks.map((item) => item.rasio))),
      skor_aksesibilitas: Math.round((jumlahLolos / pasangan_kontras.length) * 100),
    },
  }
}

/**
 * Menghasilkan beberapa palet yang dijamin berbeda satu sama lain.
 * Kandidat kembar (warna atau nama) dilewati, lalu kandidat berikutnya dicoba.
 * Urutannya tetap, jadi hasilnya masih deterministik.
 */
export function buatDaftarPalet({
  base,
  tema,
  harmoni = 'triadik',
  jumlah = 1,
  seed = 0,
  terang = null,
}) {
  const hasil = []
  const sidik = new Set()
  const nama = new Set()

  let kandidat = 0
  const batas = jumlah * 16

  while (hasil.length < jumlah && kandidat < batas) {
    const palet = buatPalet({ base, tema, harmoni, seed, indeks: kandidat, terang })
    const kunci = palet.warna.map((item) => item.hex).join(',')

    if (!sidik.has(kunci) && !nama.has(palet.nama)) {
      sidik.add(kunci)
      nama.add(palet.nama)
      hasil.push(palet)
    }

    kandidat += 1
  }

  return hasil
}

const CADANGAN_HUE = [12, 130, 250]

/**
 * Saran warna primer diambil dari klaster hue tema. Halaman Generator memakainya
 * sebagai titik awal saat pengguna belum menentukan warna sendiri.
 */
export function saranWarnaTema(tema) {
  const konfigurasi = ambilTema(tema)
  if (!konfigurasi) return []

  const klaster = konfigurasi.hueKlaster ?? CADANGAN_HUE
  const chroma = (konfigurasi.chroma[0] + konfigurasi.chroma[1]) / 2
  const lightness = konfigurasi.gelap ? 0.66 : 0.55

  return klaster.map((hue) => oklchKeHex({ L: lightness, C: chroma, h: hue }))
}
