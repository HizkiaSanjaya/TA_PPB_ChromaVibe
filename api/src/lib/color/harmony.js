/**
 * Skema harmoni warna. Offset dihitung dalam derajat hue OKLCH.
 * Offset pertama selalu 0 karena mewakili warna pilihan pengguna.
 *
 * `deskripsi` menjelaskan posisi warna kedua, `saran` menjelaskan kapan
 * sebaiknya dipakai. Keduanya ditulis dengan contoh warna nyata supaya bisa
 * dipahami tanpa perlu tahu istilah roda warna.
 */
export const HARMONI = [
  {
    slug: 'komplementer',
    nama: 'Komplementer',
    offset: [0, 180],
    deskripsi: 'Warna kedua berseberangan, seperti biru dengan jingga atau merah dengan hijau.',
    saran: 'Pilih ini kalau ingin palet yang paling mencolok dan berani.',
  },
  {
    slug: 'analog',
    nama: 'Analog',
    offset: [0, 30, -30],
    deskripsi: 'Warna kedua bersebelahan, seperti biru dengan biru kehijauan.',
    saran: 'Pilih ini kalau ingin hasil yang tenang dan tidak ramai.',
  },
  {
    slug: 'triadik',
    nama: 'Triadik',
    offset: [0, 120, 240],
    deskripsi: 'Warna kedua berjarak sepertiga lingkaran, seperti merah dengan hijau dan biru.',
    saran: 'Pilihan tengah. Cukup berbeda, tapi tidak bertabrakan.',
  },
  {
    slug: 'split',
    nama: 'Split Komplementer',
    offset: [0, 150, 210],
    deskripsi: 'Berseberangan tapi digeser sedikit, seperti merah dengan hijau kebiruan.',
    saran: 'Pilih ini kalau komplementer terasa terlalu tajam.',
  },
  {
    slug: 'tetradik',
    nama: 'Tetradik',
    offset: [0, 90, 180, 270],
    deskripsi: 'Warna kedua berjarak seperempat lingkaran, seperti ungu dengan kuning kehijauan.',
    saran: 'Palet paling ramai. Cocok untuk tampilan yang ingin terasa hidup.',
  },
  {
    slug: 'monokrom',
    nama: 'Monokromatik',
    offset: [0],
    deskripsi: 'Warna kedua masih keluarga yang sama, hanya beda gelap terang.',
    saran: 'Paling aman. Cocok kalau tidak ingin dua warna yang jauh berbeda.',
  },
]

export const SLUG_HARMONI = HARMONI.map((item) => item.slug)

export function ambilHarmoni(slug) {
  return HARMONI.find((item) => item.slug === slug) ?? null
}
