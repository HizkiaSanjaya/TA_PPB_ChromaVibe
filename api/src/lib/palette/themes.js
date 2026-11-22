/**
 * Setiap tema adalah bahasa visual yang diterjemahkan menjadi batasan angka.
 * Tema tidak menentukan warna akhir, ia hanya memberi pagar pada chroma,
 * rencana lightness, dan klaster hue yang boleh dipakai.
 *
 * hueKlaster null berarti hue mengikuti warna primer pengguna apa adanya.
 */
export const TEMA = [
  {
    slug: 'y2k',
    nama: 'Y2K',
    deskripsi:
      'Nostalgia pergantian milenium. Saturasi tinggi, kilau metalik, dan latar gelap yang dramatis.',
    kataKunci: ['neon', 'metalik', 'futuristik', 'nostalgia'],
    gelap: true,
    hueKlaster: [190, 320, 90],
    chroma: [0.16, 0.3],
    lightness: { background: 0.15, surface: 0.21, aksen: 0.74, teks: 0.97 },
    jitter: 7,
  },
  {
    slug: 'elegant',
    nama: 'Elegant',
    deskripsi:
      'Kesan mahal lewat kroma rendah dan latar pucat. Warna aksen cenderung menyerupai emas tua atau tinta.',
    kataKunci: ['anggun', 'tenang', 'mewah', 'minimal'],
    gelap: false,
    hueKlaster: [30, 265, 45],
    chroma: [0.02, 0.07],
    lightness: { background: 0.965, surface: 0.985, aksen: 0.4, teks: 0.24 },
    jitter: 3,
  },
  {
    slug: 'classic',
    nama: 'Classic',
    deskripsi:
      'Warna institusional yang tidak lekang waktu. Navy, marun, dan hijau botol di atas latar krem.',
    kataKunci: ['formal', 'klasik', 'akademik', 'stabil'],
    gelap: false,
    hueKlaster: [250, 15, 150],
    chroma: [0.07, 0.13],
    lightness: { background: 0.955, surface: 0.985, aksen: 0.36, teks: 0.2 },
    jitter: 4,
  },
  {
    slug: 'energetic',
    nama: 'Energetic',
    deskripsi:
      'Warna hangat dengan saturasi tinggi. Dirancang untuk antarmuka yang ingin terasa bergerak.',
    kataKunci: ['ceria', 'hangat', 'berani', 'muda'],
    gelap: false,
    hueKlaster: null,
    chroma: [0.19, 0.31],
    lightness: { background: 0.975, surface: 0.995, aksen: 0.68, teks: 0.17 },
    jitter: 8,
  },
  {
    slug: 'pastel',
    nama: 'Pastel Soft',
    deskripsi:
      'Lembut dan rendah kroma. Latar sangat pucat, sedangkan aksen diturunkan secukupnya agar tetap terbaca sebagai komponen antarmuka.',
    kataKunci: ['lembut', 'manis', 'pucat', 'ringan'],
    gelap: false,
    hueKlaster: null,
    chroma: [0.05, 0.1],
    lightness: { background: 0.955, surface: 0.98, aksen: 0.82, teks: 0.32 },
    jitter: 5,
  },
  {
    slug: 'cyberpunk',
    nama: 'Cyberpunk',
    deskripsi:
      'Neon di atas aspal. Kroma mendekati batas gamut sRGB, latar gelap, dan aksen yang menyala.',
    kataKunci: ['neon', 'gelap', 'teknologi', 'berisik'],
    gelap: true,
    hueKlaster: [300, 180],
    chroma: [0.22, 0.35],
    lightness: { background: 0.16, surface: 0.22, aksen: 0.8, teks: 0.98 },
    jitter: 5,
  },
  {
    slug: 'earthy',
    nama: 'Earthy Retro',
    deskripsi:
      'Terakota, mustard, dan zaitun. Palet yang terasa seperti kertas tua dan tanah kering.',
    kataKunci: ['hangat', 'organik', 'vintage', 'tenang'],
    gelap: false,
    hueKlaster: [70, 30],
    chroma: [0.05, 0.12],
    lightness: { background: 0.93, surface: 0.96, aksen: 0.5, teks: 0.24 },
    jitter: 6,
  },
  {
    slug: 'minimalis',
    nama: 'Minimalis',
    deskripsi:
      'Hampir tanpa warna. Kroma ditekan sampai menyisakan bisikan hue, dan seluruh ketegangan dipindahkan ke jarak kecerahan.',
    kataKunci: ['bersih', 'sepi', 'netral', 'tertata'],
    gelap: false,
    hueKlaster: null,
    chroma: [0.008, 0.035],
    lightness: { background: 0.99, surface: 1, aksen: 0.26, teks: 0.15 },
    jitter: 1,
  },
  {
    slug: 'brutalism',
    nama: 'Brutalism',
    deskripsi:
      'Putih mentah, hitam pekat, satu warna yang berteriak. Tanpa gradasi, tanpa kelembutan, tanpa kompromi.',
    kataKunci: ['kasar', 'mentah', 'berteriak', 'tegas'],
    gelap: false,
    hueKlaster: null,
    chroma: [0.26, 0.34],
    lightness: { background: 0.985, surface: 1, aksen: 0.58, teks: 0.08 },
    jitter: 0,
  },
  {
    slug: 'vintage',
    nama: 'Vintage Paper',
    deskripsi:
      'Kertas yang menguning dimakan waktu. Kroma rendah, hue hangat, dan latar yang lebih tua dari isinya.',
    kataKunci: ['usang', 'hangat', 'kertas', 'pudar'],
    gelap: false,
    hueKlaster: [35, 85, 10],
    chroma: [0.025, 0.075],
    lightness: { background: 0.9, surface: 0.95, aksen: 0.38, teks: 0.24 },
    jitter: 3,
  },
]

export const SLUG_TEMA = TEMA.map((item) => item.slug)

export function ambilTema(slug) {
  return TEMA.find((item) => item.slug === slug) ?? null
}
