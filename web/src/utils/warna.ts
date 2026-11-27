import type { Palet, PeranWarna } from '../api/types'

export const LABEL_PERAN: Record<PeranWarna, string> = {
  background: 'Latar',
  surface: 'Kartu',
  base: 'Warna utama',
  accent: 'Warna kedua',
  text: 'Teks',
}

export const KETERANGAN_PERAN: Record<PeranWarna, string> = {
  background: 'Dasar halaman, area paling belakang',
  surface: 'Kotak tempat isi, seperti kartu dan panel',
  base: 'Warna utama dari pilihanmu, dipakai di tombol',
  accent: 'Warna pendamping untuk garis dan sorotan',
  text: 'Warna tulisan dan ikon di atas latar',
}

function kanal(nilai: number) {
  return nilai <= 0.03928 ? nilai / 12.92 : ((nilai + 0.055) / 1.055) ** 2.4
}

function keRgb(hex: string): [number, number, number] {
  const bersih = hex.replace('#', '')
  return [
    parseInt(bersih.slice(0, 2), 16) / 255,
    parseInt(bersih.slice(2, 4), 16) / 255,
    parseInt(bersih.slice(4, 6), 16) / 255,
  ]
}

export function luminansi(hex: string) {
  const [r, g, b] = keRgb(hex)
  return 0.2126 * kanal(r) + 0.7152 * kanal(g) + 0.0722 * kanal(b)
}

export function rasioKontras(hexA: string, hexB: string) {
  const a = luminansi(hexA)
  const b = luminansi(hexB)
  const terang = Math.max(a, b)
  const gelap = Math.min(a, b)
  return (terang + 0.05) / (gelap + 0.05)
}

/** Warna teks yang paling aman di atas sebuah warna latar. */
export function teksDiAtas(hex: string) {
  // Hitam dan putih murni dipakai karena keduanya memberi rasio tertinggi.
  // Memakai hitam keabu-abuan seperti #08080E bisa jatuh di bawah 4.5.
  return rasioKontras(hex, '#FFFFFF') >= rasioKontras(hex, '#000000') ? '#FFFFFF' : '#000000'
}

export function ambilHex(palet: Palet, peran: PeranWarna) {
  return palet.warna.find((item) => item.peran === peran)?.hex ?? '#000000'
}

export function daftarHex(palet: Palet) {
  return palet.warna.map((item) => item.hex)
}

export function normalisasiHex(nilai: string | null): string | null {
  if (!nilai) return null
  const bersih = nilai.trim().replace(/^#/, '')
  if (!/^[0-9a-fA-F]{6}$/.test(bersih)) return null
  return `#${bersih.toUpperCase()}`
}
