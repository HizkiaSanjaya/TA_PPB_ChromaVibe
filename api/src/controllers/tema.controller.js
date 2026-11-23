import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ok } from '../utils/response.js'
import { TEMA, ambilTema } from '../lib/palette/themes.js'
import { buatPalet, saranWarnaTema } from '../lib/palette/generator.js'
import { hitungPaletPerTema } from '../config/sumber-data.js'

// Satu palet contoh per tema untuk kartu di beranda. Dihitung dari saran warna
// tema itu sendiri, jadi tidak perlu disimpan di basis data.
function paletContoh(slug) {
  const saran = saranWarnaTema(slug)
  if (saran.length === 0) return null

  const { warna, ringkasan } = buatPalet({
    base: saran[0],
    tema: slug,
    harmoni: 'triadik',
    seed: 7,
  })

  return {
    warna: warna.map((item) => ({ peran: item.peran, hex: item.hex })),
    skor: ringkasan.skor_aksesibilitas,
  }
}

export const listTema = asyncHandler(async (req, res) => {
  const hitungan = await hitungPaletPerTema()

  const data = TEMA.map((tema) => ({
    ...tema,
    saran_base: saranWarnaTema(tema.slug),
    contoh: paletContoh(tema.slug),
    jumlah_palet: hitungan[tema.slug] ?? 0,
  }))

  return ok(res, data, 'Daftar tema berhasil diambil')
})

export const getTema = asyncHandler(async (req, res) => {
  const tema = ambilTema(req.params.slug)
  if (!tema) throw new ApiError(404, 'Tema tidak ditemukan')

  const hitungan = await hitungPaletPerTema()
  const data = {
    ...tema,
    saran_base: saranWarnaTema(tema.slug),
    contoh: paletContoh(tema.slug),
    jumlah_palet: hitungan[tema.slug] ?? 0,
  }

  return ok(res, data, 'Detail tema berhasil diambil')
})
