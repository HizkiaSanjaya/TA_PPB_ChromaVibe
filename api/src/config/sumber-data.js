import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { supabase } from './supabase.js'
import { ApiError } from '../utils/ApiError.js'
import { ambilTema } from '../lib/palette/themes.js'
import { ambilHarmoni } from '../lib/color/harmony.js'

/**
 * Satu pintu akses data palet kurasi.
 *
 * Bila Supabase terisi, seluruh pembacaan lewat tabel `palet`. Bila belum,
 * berkas contoh dipakai supaya aplikasi tetap bisa didemokan saat asistensi.
 * Data contoh dibangun oleh `npm run seed:build`, jadi isinya palet asli hasil
 * generator, bukan angka karangan.
 */
const jalurContoh = fileURLToPath(new URL('../data/palet.kurasi.json', import.meta.url))
let contoh = null
let pernahPeringatan = false

function muatContoh() {
  if (!contoh) contoh = JSON.parse(readFileSync(jalurContoh, 'utf8'))
  return contoh
}

export function memakaiSupabase() {
  return Boolean(supabase)
}

/**
 * Nama tema dan harmoni ditempel di sini supaya klien tidak perlu tabel
 * terjemahan sendiri. Slug tetap dikirim karena dipakai untuk navigasi.
 */
function lengkapiNama(palet) {
  return {
    ...palet,
    tema_nama: ambilTema(palet.tema)?.nama ?? palet.tema,
    harmoni_nama: ambilHarmoni(palet.harmoni)?.nama ?? palet.harmoni,
  }
}

function petakanBaris(baris) {
  return lengkapiNama({
    id: baris.id,
    tema: baris.tema_slug,
    slug: baris.slug,
    nama: baris.nama,
    harmoni: baris.harmoni,
    warna: baris.warna,
    pasangan_kontras: baris.pasangan_kontras ?? [],
    ringkasan: baris.ringkasan ?? null,
  })
}

function peringatanContoh() {
  if (pernahPeringatan) return
  pernahPeringatan = true
  console.warn(
    '[ChromaVibe] Supabase belum dikonfigurasi, memakai data contoh src/data/palet.kurasi.json'
  )
}

export async function ambilPaletKurasi(temaSlug) {
  if (supabase) {
    let kueri = supabase.from('palet').select('*').order('slug')
    if (temaSlug) kueri = kueri.eq('tema_slug', temaSlug)

    const { data, error } = await kueri
    if (error) throw new ApiError(500, error.message)

    return data.map(petakanBaris)
  }

  peringatanContoh()
  const semua = muatContoh().map(lengkapiNama)
  return temaSlug ? semua.filter((item) => item.tema === temaSlug) : semua
}

export async function ambilPaletById(id) {
  if (supabase) {
    const { data, error } = await supabase.from('palet').select('*').eq('id', id).maybeSingle()
    if (error) throw new ApiError(500, error.message)
    return data ? petakanBaris(data) : null
  }

  peringatanContoh()
  const ketemu = muatContoh().find((item) => item.id === id)
  return ketemu ? lengkapiNama(ketemu) : null
}

export async function hitungPaletPerTema() {
  const hitungan = {}

  if (supabase) {
    const { data, error } = await supabase.from('palet').select('tema_slug')
    if (error) throw new ApiError(500, error.message)

    for (const baris of data) {
      hitungan[baris.tema_slug] = (hitungan[baris.tema_slug] ?? 0) + 1
    }
    return hitungan
  }

  peringatanContoh()
  for (const item of muatContoh()) {
    hitungan[item.tema] = (hitungan[item.tema] ?? 0) + 1
  }
  return hitungan
}
