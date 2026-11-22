import type { HasilGenerate, MasukanGenerate, Palet, ResponsApi, SkemaHarmoni, Tema } from './types'

export const DASAR_API = (import.meta.env.VITE_API_URL ?? 'http://localhost:3001').replace(
  /\/+$/,
  ''
)

export class KesalahanApi extends Error {
  constructor(pesan: string) {
    super(pesan)
    this.name = 'KesalahanApi'
  }
}

async function ambil<T>(jalur: string): Promise<T> {
  let respons: Response

  try {
    respons = await fetch(`${DASAR_API}/api/v1${jalur}`, {
      headers: { Accept: 'application/json' },
    })
  } catch {
    window.dispatchEvent(new Event('chromavibe:jaringan-gagal'))
    throw new KesalahanApi('Tidak dapat menghubungi server. Periksa koneksi internet atau URL API.')
  }

  const isi = (await respons.json().catch(() => null)) as ResponsApi<T> | null

  if (respons.status === 503) {
    window.dispatchEvent(new Event('chromavibe:jaringan-gagal'))
  }

  if (!respons.ok || !isi?.success) {
    throw new KesalahanApi(isi?.message ?? `Permintaan gagal dengan status ${respons.status}`)
  }

  return isi.data
}

export const api = {
  daftarTema: () => ambil<Tema[]>('/themes'),
  detailTema: (slug: string) => ambil<Tema>(`/themes/${slug}`),
  paletTema: (slug: string) => ambil<Palet[]>(`/themes/${slug}/palettes`),
  detailPalet: (id: string) => ambil<Palet>(`/palettes/${id}`),
  daftarHarmoni: () => ambil<SkemaHarmoni[]>('/harmoni'),
  buatPalet: (masukan: MasukanGenerate) => {
    const kueri = new URLSearchParams({
      base: masukan.base,
      tema: masukan.tema,
      harmoni: masukan.harmoni,
      jumlah: String(masukan.jumlah),
      seed: String(masukan.seed),
    })
    return ambil<HasilGenerate>(`/palettes/generate?${kueri.toString()}`)
  },
}
