/**
 * Skema harmoni warna. Offset dihitung dalam derajat hue OKLCH.
 * Offset pertama selalu 0 karena mewakili warna primer pengguna.
 */
export const HARMONI = [
  {
    slug: 'komplementer',
    nama: 'Komplementer',
    offset: [0, 180],
    deskripsi: 'Dua hue berlawanan, kontras maksimal dan paling berani.',
  },
  {
    slug: 'analog',
    nama: 'Analog',
    offset: [0, 30, -30],
    deskripsi: 'Hue bertetangga, terasa tenang dan menyatu.',
  },
  {
    slug: 'triadik',
    nama: 'Triadik',
    offset: [0, 120, 240],
    deskripsi: 'Tiga hue berjarak sama, seimbang tanpa monoton.',
  },
  {
    slug: 'split',
    nama: 'Split Komplementer',
    offset: [0, 150, 210],
    deskripsi: 'Komplementer yang dipecah, tegang tetapi tidak kasar.',
  },
  {
    slug: 'tetradik',
    nama: 'Tetradik',
    offset: [0, 90, 180, 270],
    deskripsi: 'Empat hue pada dua sumbu, kaya dan dinamis.',
  },
  {
    slug: 'monokrom',
    nama: 'Monokromatik',
    offset: [0],
    deskripsi: 'Satu hue dengan anak tangga kecerahan, rapi dan aman.',
  },
]

export const SLUG_HARMONI = HARMONI.map((item) => item.slug)

export function ambilHarmoni(slug) {
  return HARMONI.find((item) => item.slug === slug) ?? null
}
