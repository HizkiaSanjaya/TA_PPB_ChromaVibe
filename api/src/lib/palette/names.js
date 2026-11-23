/**
 * Nama palet dibentuk dari dua bagian: nama keluarga warna dan kata sifat tema.
 *
 * Contoh: "Oranye Tegas" untuk Brutalism, "Biru Anggun" untuk Elegant.
 * Dipakai nama seperti ini supaya palet yang berbeda bisa disebut tanpa harus
 * menunjuk kode hex, dan supaya namanya tetap masuk akal kalau dibaca orang lain.
 */

/**
 * Batas hue dalam derajat untuk menamai keluarga warna.
 * Angkanya mengikuti posisi warna pada ruang OKLCH: merah murni ada di sekitar
 * 28 derajat, kuning di sekitar 100, biru di sekitar 255.
 */
const KELUARGA_WARNA = [
  { bawah: 345, batas: 360, nama: 'Merah' },
  { bawah: 0, batas: 40, nama: 'Merah' },
  { bawah: 40, batas: 70, nama: 'Oranye' },
  { bawah: 70, batas: 105, nama: 'Kuning' },
  { bawah: 105, batas: 150, nama: 'Hijau' },
  { bawah: 150, batas: 195, nama: 'Tosca' },
  { bawah: 195, batas: 235, nama: 'Biru langit' },
  { bawah: 235, batas: 285, nama: 'Biru' },
  { bawah: 285, batas: 320, nama: 'Ungu' },
  { bawah: 320, batas: 345, nama: 'Magenta' },
]

/** Kata sifat yang mewakili karakter tiap tema. Minimal enam supaya lima palet
 *  dalam satu tampilan selalu bisa diberi nama berbeda. */
const SIFAT_TEMA = {
  y2k: ['Neon', 'Metalik', 'Retro', 'Kilau', 'Pop', 'Milenium'],
  elegant: ['Anggun', 'Teduh', 'Mewah', 'Lembut', 'Sunyi', 'Pualam'],
  classic: ['Formal', 'Klasik', 'Tegas', 'Agung', 'Tenang', 'Arsip'],
  energetic: ['Ceria', 'Menyala', 'Gencar', 'Cepat', 'Sorak', 'Pesta'],
  pastel: ['Lembut', 'Manis', 'Ringan', 'Pucat', 'Embun', 'Sorbet'],
  cyberpunk: ['Digital', 'Nokturnal', 'Listrik', 'Krom', 'Saraf', 'Volt'],
  earthy: ['Hangat', 'Tanah', 'Panen', 'Rempah', 'Gurun', 'Teduh'],
  minimalis: ['Polos', 'Hening', 'Bersih', 'Tipis', 'Netral', 'Ruang'],
  brutalism: ['Mentah', 'Kasar', 'Berat', 'Kaku', 'Tegas', 'Beton'],
  vintage: ['Usang', 'Pudar', 'Silam', 'Lembap', 'Tua', 'Album'],
}

/** Warna dengan kepekatan sangat rendah lebih tepat disebut abu-abu. */
function namaKeluargaWarna(hue, kroma) {
  if (kroma < 0.02) return 'Abu'
  if (kroma < 0.04) return 'Abu berpendar'

  const cocok = KELUARGA_WARNA.find((item) => hue >= item.bawah && hue < item.batas)
  return cocok ? cocok.nama : 'Merah'
}

/**
 * Nama palet dari warna dasar dan tema.
 * `acak` dipakai untuk memilih kata sifat, sisanya ditentukan oleh warna.
 */
export function buatNama(tema, acak, { hue, kroma }) {
  const daftar = SIFAT_TEMA[tema] ?? SIFAT_TEMA.elegant
  const sifat = daftar[Math.floor(acak() * daftar.length) % daftar.length]
  return `${namaKeluargaWarna(hue, kroma)} ${sifat}`
}
