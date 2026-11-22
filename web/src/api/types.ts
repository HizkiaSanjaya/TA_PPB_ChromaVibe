export type PeranWarna = 'background' | 'surface' | 'base' | 'accent' | 'text'

export type NilaiKontras = 'AAA' | 'AA' | 'AA-Large' | 'Gagal'

export interface Warna {
  peran: PeranWarna
  hex: string
  oklch: [number, number, number]
}

export interface PasanganKontras {
  depan: string
  belakang: string
  peran_depan: PeranWarna
  peran_belakang: PeranWarna
  rasio: number
  ambang: number
  nilai: NilaiKontras
  lolos: boolean
}

export interface RingkasanPalet {
  teks_lolos_aa: boolean
  aksen_lolos: boolean
  rasio_teks_terendah: number
  skor_aksesibilitas: number
}

export interface Palet {
  id: string
  tema: string
  tema_nama: string
  slug?: string
  nama: string
  harmoni: string
  harmoni_nama: string
  warna: Warna[]
  pasangan_kontras: PasanganKontras[]
  ringkasan: RingkasanPalet
}

export interface Tema {
  slug: string
  nama: string
  deskripsi: string
  kataKunci: string[]
  gelap: boolean
  hueKlaster: number[] | null
  chroma: [number, number]
  lightness: {
    background: number
    surface: number
    aksen: number
    teks: number
  }
  jitter: number
  saran_base: string[]
  jumlah_palet: number
}

export interface SkemaHarmoni {
  slug: string
  nama: string
  offset: number[]
  deskripsi: string
}

export interface MasukanGenerate {
  base: string
  tema: string
  harmoni: string
  jumlah: number
  seed: number
}

export interface HasilGenerate {
  input: MasukanGenerate
  palet: Palet[]
}

export interface ResponsApi<T> {
  success: boolean
  message: string
  data: T
}
