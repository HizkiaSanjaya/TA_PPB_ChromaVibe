import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ok } from '../utils/response.js'
import { TEMA, ambilTema } from '../lib/palette/themes.js'
import { saranWarnaTema } from '../lib/palette/generator.js'
import { hitungPaletPerTema } from '../config/sumber-data.js'

export const listTema = asyncHandler(async (req, res) => {
  const hitungan = await hitungPaletPerTema()

  const data = TEMA.map((tema) => ({
    ...tema,
    saran_base: saranWarnaTema(tema.slug),
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
    jumlah_palet: hitungan[tema.slug] ?? 0,
  }

  return ok(res, data, 'Detail tema berhasil diambil')
})
