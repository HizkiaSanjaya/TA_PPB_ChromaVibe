/**
 * Skema harmoni warna. Offset dihitung dalam derajat hue OKLCH.
 * Offset pertama selalu 0 karena mewakili warna primer pengguna.
 */
export const HARMONI = [
  {
    slug: 'komplementer',
    nama: 'Komplementer',
    offset: [0, 180],
    deskripsi:
      'Warna kedua diambil dari seberang roda warna. Kontras paling kuat dan paling mencolok.',
  },
  {
    slug: 'analog',
    nama: 'Analog',
    offset: [0, 30, -30],
    deskripsi: 'Warna kedua diambil dari tetangga dekat. Terasa tenang dan menyatu.',
  },
  {
    slug: 'triadik',
    nama: 'Triadik',
    offset: [0, 120, 240],
    deskripsi: 'Tiga warna berjarak sama di roda. Seimbang, tidak monoton, tidak menabrak.',
  },
  {
    slug: 'split',
    nama: 'Split Komplementer',
    offset: [0, 150, 210],
    deskripsi: 'Seberang roda warna dipecah jadi dua. Tegang, tetapi tidak sekasar komplementer.',
  },
  {
    slug: 'tetradik',
    nama: 'Tetradik',
    offset: [0, 90, 180, 270],
    deskripsi: 'Empat warna menyebar di roda. Kaya dan dinamis, butuh keberanian memakainya.',
  },
  {
    slug: 'monokrom',
    nama: 'Monokromatik',
    offset: [0],
    deskripsi: 'Satu warna saja. Bedanya hanya di tingkat gelap dan terang, jadi paling aman.',
  },
]

export const SLUG_HARMONI = HARMONI.map((item) => item.slug)

export function ambilHarmoni(slug) {
  return HARMONI.find((item) => item.slug === slug) ?? null
}
