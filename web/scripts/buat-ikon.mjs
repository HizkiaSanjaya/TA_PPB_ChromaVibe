import { mkdirSync, writeFileSync } from 'node:fs'
import { deflateSync } from 'node:zlib'
import { fileURLToPath } from 'node:url'

/**
 * Pembuat ikon PWA tanpa dependensi lukis apa pun.
 * PNG ditulis langsung dari kanal RGBA, jadi tidak perlu berkas biner dari luar.
 */

const LATAR = [11, 11, 18, 255]
const BAR = [
  [255, 46, 136, 255],
  [255, 126, 102, 255],
  [255, 212, 0, 255],
  [0, 229, 255, 255],
  [184, 255, 0, 255],
]
const TRANSPARAN = [0, 0, 0, 0]

const TABEL_CRC = (() => {
  const tabel = new Uint32Array(256)
  for (let n = 0; n < 256; n += 1) {
    let c = n
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    }
    tabel[n] = c >>> 0
  }
  return tabel
})()

function crc32(buffer) {
  let c = 0xffffffff
  for (const bit of buffer) {
    c = TABEL_CRC[(c ^ bit) & 0xff] ^ (c >>> 8)
  }
  return (c ^ 0xffffffff) >>> 0
}

function potongan(tipe, data) {
  const panjang = Buffer.alloc(4)
  panjang.writeUInt32BE(data.length)

  const isi = Buffer.concat([Buffer.from(tipe, 'ascii'), data])

  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(isi))

  return Buffer.concat([panjang, isi, crc])
}

function buatPng(lebar, tinggi, pewarna) {
  const kanal = 4
  const mentah = Buffer.alloc((lebar * kanal + 1) * tinggi)
  let posisi = 0

  for (let y = 0; y < tinggi; y += 1) {
    mentah[posisi] = 0
    posisi += 1
    for (let x = 0; x < lebar; x += 1) {
      const [r, g, b, a] = pewarna(x, y)
      mentah[posisi] = r
      mentah[posisi + 1] = g
      mentah[posisi + 2] = b
      mentah[posisi + 3] = a
      posisi += 4
    }
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(lebar, 0)
  ihdr.writeUInt32BE(tinggi, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    potongan('IHDR', ihdr),
    potongan('IDAT', deflateSync(mentah, { level: 9 })),
    potongan('IEND', Buffer.alloc(0)),
  ])
}

function dalamKotakBulat(x, y, kiri, atas, lebar, tinggi, radius) {
  const kanan = kiri + lebar
  const bawah = atas + tinggi
  if (x < kiri || x > kanan || y < atas || y > bawah) return false

  const dx = Math.min(Math.max(x, kiri + radius), kanan - radius)
  const dy = Math.min(Math.max(y, atas + radius), bawah - radius)

  return (x - dx) ** 2 + (y - dy) ** 2 <= radius ** 2
}

function pewarnaIkon(ukuran, { maskable = false } = {}) {
  const radiusLatar = maskable ? 0 : Math.round(ukuran * 0.22)
  const skalaKonten = maskable ? 0.62 : 0.72
  const lebarBar = Math.round(ukuran * 0.085)
  const jarak = Math.round(ukuran * 0.035)
  const totalLebar = lebarBar * 5 + jarak * 4
  const kiriKonten = Math.round((ukuran - totalLebar) / 2)
  const tinggiMaks = ukuran * skalaKonten
  const pola = [0.6, 0.82, 1, 0.82, 0.6]

  return (x, y) => {
    if (!maskable && !dalamKotakBulat(x, y, 0, 0, ukuran - 1, ukuran - 1, radiusLatar)) {
      return TRANSPARAN
    }

    for (let i = 0; i < 5; i += 1) {
      const tinggi = Math.round(tinggiMaks * pola[i])
      const kiri = kiriKonten + i * (lebarBar + jarak)
      const atas = Math.round((ukuran - tinggi) / 2)
      const radiusBar = Math.round(lebarBar / 2)

      if (dalamKotakBulat(x, y, kiri, atas, lebarBar - 1, tinggi, radiusBar)) {
        return BAR[i]
      }
    }

    return LATAR
  }
}

const folder = fileURLToPath(new URL('../public', import.meta.url))
mkdirSync(folder, { recursive: true })

const berkas = [
  { nama: 'pwa-192x192.png', ukuran: 192, maskable: false },
  { nama: 'pwa-512x512.png', ukuran: 512, maskable: false },
  { nama: 'maskable-512x512.png', ukuran: 512, maskable: true },
  { nama: 'apple-touch-icon.png', ukuran: 180, maskable: true },
  { nama: 'favicon.png', ukuran: 64, maskable: false },
]

for (const item of berkas) {
  const gambar = buatPng(item.ukuran, item.ukuran, pewarnaIkon(item.ukuran, item))
  writeFileSync(`${folder}/${item.nama}`, gambar)
  console.log(`dibuat public/${item.nama} (${gambar.length} bita)`)
}
