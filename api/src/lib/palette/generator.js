import { createHash } from 'node:crypto'

import { batasi, bulatkanWarna, hexKeOklch, normalkanHue, oklchKeHex } from '../color/space.js'
import { bulatkanRasio, periksaPasangan, rasioKontras } from '../color/contrast.js'
import { ambilHarmoni } from '../color/harmony.js'
import { buatPrng } from '../color/prng.js'
import { ambilTema } from './themes.js'
import { buatNama } from './names.js'

/**
 * Urutan periksa disengaja. Teks wajib 4.5 banding satu, sedangkan warna
 * antarmuka cukup 3 banding satu sesuai WCAG untuk komponen non-teks.
 */
const PASANGAN_DIPERIKSA = [
  ['text', 'background', 4.5],
  ['text', 'surface', 4.5],
  ['base', 'background', 3],
  ['base', 'surface', 3],
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
 * Menghasilkan satu palet utuh dari satu warna primer.
 * Fungsi ini murni: input sama selalu menghasilkan keluaran sama.
 */
export function buatPalet({ base, tema, harmoni = 'triadik', seed = 0, indeks = 0 }) {
  const konfigurasi = ambilTema(tema)
  if (!konfigurasi) throw new Error(`Tema tidak dikenal: ${tema}`)

  const skemaHarmoni = ambilHarmoni(harmoni)
  if (!skemaHarmoni) throw new Error(`Harmoni tidak dikenal: ${harmoni}`)

  const acak = buatPrng(`${String(base).toUpperCase()}|${tema}|${harmoni}|${seed}|${indeks}`)
  const dasar = hexKeOklch(base)

  // Indeks menentukan variasi dalam satu rangkaian. Variasi harus cukup besar,
  // karena pergeseran lima derajat membuat lima palet terlihat identik.
  const variasi = indeks % 5
  const geserLatar = (variasi - 2) * 0.016

  const jitter = (acak() * 2 - 1) * konfigurasi.jitter
  const hueDasar = normalkanHue(dasar.h + jitter)

  const offset = skemaHarmoni.offset
  const pilihanAksen = offset.length > 1 ? offset.length - 1 : 1
  const posisiAksen = offset.length > 1 ? 1 + (variasi % pilihanAksen) : 0
  const hueAksen = normalkanHue(hueDasar + offset[posisiAksen] + (acak() * 2 - 1) * 3)

  const warnaDasar = {
    L: batasi(
      0.45 * dasar.L +
        0.55 * konfigurasi.lightness.aksen +
        (variasi - 2) * 0.06 +
        (acak() - 0.5) * 0.04,
      0.12,
      0.94
    ),
    C: batasi(dasar.C, konfigurasi.chroma[0], konfigurasi.chroma[1]),
    h: hueDasar,
  }

  const warnaBackground = {
    L: batasi(konfigurasi.lightness.background + geserLatar, 0.06, 0.995),
    C: Math.min(konfigurasi.chroma[0] * 0.16, 0.016),
    h: normalkanHue(hueDasar + (acak() - 0.5) * 6),
  }

  const warnaSurface = {
    L: batasi(konfigurasi.lightness.surface + geserLatar, 0.06, 1),
    C: Math.min(konfigurasi.chroma[0] * 0.26, 0.028),
    h: normalkanHue(hueDasar + (acak() - 0.5) * 6),
  }

  const hexBackground = oklchKeHex(warnaBackground)
  const hexSurface = oklchKeHex(warnaSurface)

  // Pada monokrom, warna primer dan aksen berbagi hue. Satu-satunya pembeda
  // adalah kecerahan, jadi keduanya digeser ke arah berlawanan agar terlihat
  // sebagai dua anak tangga, bukan dua warna yang sama.
  const arahAksen = harmoni === 'monokrom' ? -1 : 1

  let warnaAksen = {
    L: batasi(
      konfigurasi.lightness.aksen + arahAksen * (variasi - 2) * 0.055 + (acak() - 0.5) * 0.04,
      0.1,
      0.95
    ),
    C: batasi(warnaDasar.C * (1.05 + acak() * 0.25), konfigurasi.chroma[0], konfigurasi.chroma[1]),
    h: hueAksen,
  }

  // Aksen dan warna primer wajib cukup kontras sebagai komponen antarmuka,
  // apa pun temanya. Surface diperiksa lebih dulu karena pada tema gelap ia
  // lebih terang dari background, sehingga menjadi batas yang lebih ketat.
  warnaAksen = tegakkanKontras(warnaAksen, hexSurface, 3, konfigurasi.gelap)
  warnaAksen = tegakkanKontras(warnaAksen, hexBackground, 3, konfigurasi.gelap)

  // Warna primer dan aksen harus bisa dibedakan mata. Pada skema monokromatik
  // keduanya berbagi hue yang sama, jadi jarak lightness yang memisahkan.
  warnaDasar.L =
    Math.abs(warnaDasar.L - warnaAksen.L) < 0.14
      ? batasi(konfigurasi.gelap ? warnaAksen.L - 0.22 : warnaAksen.L + 0.22, 0.06, 0.94)
      : warnaDasar.L

  warnaDasar.L = tegakkanKontras(warnaDasar, hexSurface, 3, konfigurasi.gelap).L
  warnaDasar.L = tegakkanKontras(warnaDasar, hexBackground, 3, konfigurasi.gelap).L

  let warnaTeks = { L: konfigurasi.lightness.teks, C: 0.006, h: hueDasar }
  warnaTeks = tegakkanKontras(warnaTeks, hexSurface, 4.5, konfigurasi.gelap)
  warnaTeks = tegakkanKontras(warnaTeks, hexBackground, 4.5, konfigurasi.gelap)

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
    nama: buatNama(tema, acak),
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
 * Menghasilkan beberapa palet sekaligus. Setiap indeks menggeser posisi hue
 * pada skema harmoni supaya hasilnya tidak terasa sebagai duplikat.
 */
/**
 * Menghasilkan beberapa palet sekaligus, dijamin berbeda satu sama lain.
 *
 * Kandidat diuji berurutan sampai jumlah terpenuhi. Palet yang warna atau
 * namanya kembar dilewati, lalu kandidat berikutnya dicoba. Karena urutannya
 * tetap, hasilnya masih deterministik untuk masukan yang sama.
 */
export function buatDaftarPalet({ base, tema, harmoni = 'triadik', jumlah = 1, seed = 0 }) {
  const hasil = []
  const sidik = new Set()
  const nama = new Set()

  let kandidat = 0
  const batas = jumlah * 16

  while (hasil.length < jumlah && kandidat < batas) {
    const palet = buatPalet({ base, tema, harmoni, seed, indeks: kandidat })
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
