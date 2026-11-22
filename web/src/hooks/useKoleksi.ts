import { useSyncExternalStore } from 'react'

import type { Palet } from '../api/types'

const KUNCI = 'chromavibe:koleksi:v1'

function baca(): Palet[] {
  if (typeof window === 'undefined') return []

  try {
    const mentah = window.localStorage.getItem(KUNCI)
    if (!mentah) return []
    const hasil = JSON.parse(mentah)
    return Array.isArray(hasil) ? (hasil as Palet[]) : []
  } catch {
    return []
  }
}

let daftar: Palet[] = baca()
const pendengar = new Set<() => void>()

function langganan(fn: () => void) {
  pendengar.add(fn)
  return () => {
    pendengar.delete(fn)
  }
}

function umumkan() {
  for (const fn of pendengar) fn()
}

function simpanKePenyimpanan() {
  try {
    window.localStorage.setItem(KUNCI, JSON.stringify(daftar))
  } catch {
    // Penyimpanan penuh atau diblokir mode privat. Daftar tetap hidup di memori.
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (peristiwa) => {
    if (peristiwa.key === KUNCI) {
      daftar = baca()
      umumkan()
    }
  })
}

export function useKoleksi() {
  return useSyncExternalStore(langganan, () => daftar)
}

export function simpanPalet(palet: Palet) {
  if (daftar.some((item) => item.id === palet.id)) return
  daftar = [palet, ...daftar]
  simpanKePenyimpanan()
  umumkan()
}

export function hapusPalet(id: string) {
  daftar = daftar.filter((item) => item.id !== id)
  simpanKePenyimpanan()
  umumkan()
}

export function adaDiKoleksi(id: string) {
  return daftar.some((item) => item.id === id)
}

export function cariPaletKoleksi(id: string) {
  return daftar.find((item) => item.id === id) ?? null
}
