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
 *
 * `terang` (10 sampai 100) menggantikan kecerahan warna pilihan pengguna.
 * Bila kosong, kecerahan asli warna yang dipakai.
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

  // Indeks menentukan variasi dalam satu rangkaian. Siklusnya tujuh, bukan lima,
  // supaya palet kelima tidak mengulang latar palet pertama ketika ada kandidat
  // yang ditolak karena kembar.
  const variasi = indeks % 7
  const dasarGelap = konfigurasi.lightness.background <= 0.5
  const geserDasar = (dasarGelap ? 1 : -1) * variasi * 0.05

  const jitter = (acak() * 2 - 1) * konfigurasi.jitter
  const hueDasar = normalkanHue(dasar.h + jitter)

  const offset = skemaHarmoni.offset
  const pilihanAksen = offset.length > 1 ? offset.length - 1 : 1
  const posisiAksen = offset.length > 1 ? 1 + (variasi % pilihanAksen) : 0
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
  let latarL = konfigurasi.lightness.background
  let surfaceL = konfigurasi.lightness.surface
  let geserLatar

  if (terang === null) {
    // Tanpa pengaturan kecerahan, latar bergerak menjauhi ujung tema.
    geserLatar = (dasarGelap ? 1 : -1) * variasi * 0.032
  } else {
    const inginGelap = kecerahanPengguna >= 0.55
    latarL = inginGelap ? 0.1 : 0.98
    surfaceL = inginGelap ? 0.17 : 1

    // Setelah dibalik, arah geser harus mengikuti latar yang baru. Kalau tetap
    // memakai arah tema, pergeserannya menabrak batas dan semua palet menjadi
    // sama persis. Nilai variasi dipakai langsung, bukan variasi - 2, supaya
    // tidak ada palet yang kembali ke titik awal dan terlihat kembar.
    geserLatar = (inginGelap ? 1 : -1) * (variasi + 1) * (inginGelap ? 0.022 : 0.011)
  }

  // Latar dan kartu ikut diwarnai hue pilihan pengguna. Sebelumnya kromanya
  // hanya 0,016 sehingga praktis abu-abu, dan semua tema terang terlihat sama.
  const warnaBackground = {
    L: batasi(latarL + geserLatar, 0.06, 0.995),
    C: Math.min(konfigurasi.chroma[0] * 0.5, 0.05),
    h: normalkanHue(hueDasar + (acak() - 0.5) * 8),
  }

  const warnaSurface = {
    L: batasi(surfaceL + geserLatar, 0.06, 1),
    C: Math.min(konfigurasi.chroma[0] * 0.75, 0.07),
    h: normalkanHue(hueDasar + (acak() - 0.5) * 8),
  }

  const hexBackground = oklchKeHex(warnaBackground)
  const hexSurface = oklchKeHex(warnaSurface)

  // Arah penggeseran kontras ditentukan dari latar yang benar-benar dipakai,
  // bukan dari label tema. Kalau kecerahan membalik latar, arahnya ikut berubah.
  const latarGelap = luminansiRelatif(hexBackground) < 0.35

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

  // Warna primer ditegakkan lebih dulu supaya posisinya final. Aksen kemudian
  // disesuaikan terhadap warna primer itu, lalu kontras aksen diperiksa lagi.
  // Urutan ini penting: menggeser aksen setelah pemeriksaan kontras membuat
  // hasilnya bisa gagal, dan itu yang dulu menurunkan skor menjadi 67.
  warnaDasar.L = tegakkanKontras(warnaDasar, hexSurface, 3, latarGelap).L
  warnaDasar.L = tegakkanKontras(warnaDasar, hexBackground, 3, latarGelap).L

  // Warna primer dan aksen harus bisa dibedakan mata. Pada monokrom keduanya
  // berbagi hue yang sama, jadi jarak kecerahan yang memisahkan.
  if (Math.abs(warnaDasar.L - warnaAksen.L) < 0.14) {
    warnaAksen.L = batasi(latarGelap ? warnaDasar.L - 0.26 : warnaDasar.L + 0.26, 0.06, 0.94)
  }

  warnaAksen = tegakkanKontras(warnaAksen, hexSurface, 3, latarGelap)
  warnaAksen = tegakkanKontras(warnaAksen, hexBackground, 3, latarGelap)

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
