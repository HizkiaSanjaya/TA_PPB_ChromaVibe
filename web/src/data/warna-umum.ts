/**
 * Warna-warna yang namanya dikenal orang sehari-hari.
 *
 * Pemilih warna berbentuk koordinat (hue, chroma, lightness) akurat, tetapi
 * tidak membantu orang yang hanya ingin "yang merah". Daftar ini menjadi jalan
 * masuk cepat, sedangkan pemilih koordinat tetap tersedia untuk yang butuh
 * warna persis.
 */
export const WARNA_UMUM = [
  { nama: 'Merah', hex: '#E53935' },
  { nama: 'Merah tua', hex: '#8E1B1B' },
  { nama: 'Jingga', hex: '#FB8C00' },
  { nama: 'Kuning', hex: '#FDD835' },
  { nama: 'Hijau', hex: '#43A047' },
  { nama: 'Hijau tua', hex: '#1B5E20' },
  { nama: 'Toska', hex: '#00ACC1' },
  { nama: 'Biru', hex: '#1E88E5' },
  { nama: 'Biru tua', hex: '#1A237E' },
  { nama: 'Ungu', hex: '#8E24AA' },
  { nama: 'Merah muda', hex: '#EC407A' },
  { nama: 'Coklat', hex: '#6D4C41' },
  { nama: 'Emas', hex: '#C9A227' },
  { nama: 'Perak', hex: '#B0BEC5' },
  { nama: 'Abu', hex: '#757575' },
  { nama: 'Hitam', hex: '#111111' },
  { nama: 'Putih', hex: '#F5F5F5' },
]

/** Sepuluh tingkat kecerahan, dari paling gelap ke paling terang. */
export const TINGKAT_KECERAHAN = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

export function namaWarna(hex: string) {
  const cocok = WARNA_UMUM.find((item) => item.hex.toUpperCase() === hex.toUpperCase())
  return cocok?.nama ?? null
}
