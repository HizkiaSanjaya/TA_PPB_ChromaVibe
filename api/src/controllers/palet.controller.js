import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ok } from '../utils/response.js'
import { ambilTema } from '../lib/palette/themes.js'
import { buatDaftarPalet } from '../lib/palette/generator.js'
import { HARMONI } from '../lib/color/harmony.js'
import { parseHex, rgbKeHex } from '../lib/color/space.js'
import { generateQuerySchema, paletParamSchema } from '../validators/palet.validator.js'
import { ambilPaletById, ambilPaletKurasi } from '../config/sumber-data.js'

export const listPaletKurasi = asyncHandler(async (req, res) => {
  const data = await ambilPaletKurasi()
  return ok(res, data, 'Daftar palet kurasi berhasil diambil')
})

export const listPaletTema = asyncHandler(async (req, res) => {
  const tema = ambilTema(req.params.slug)
  if (!tema) throw new ApiError(404, 'Tema tidak ditemukan')

  const data = await ambilPaletKurasi(tema.slug)
  return ok(res, data, `Daftar palet tema ${tema.nama} berhasil diambil`)
})

export const getPalet = asyncHandler(async (req, res) => {
  const { id } = paletParamSchema.parse(req.params)

  const data = await ambilPaletById(id)
  if (!data) throw new ApiError(404, 'Palet tidak ditemukan')

  return ok(res, data, 'Detail palet berhasil diambil')
})

export const generatePalet = asyncHandler(async (req, res) => {
  const input = generateQuerySchema.parse(req.query)
  const base = rgbKeHex(parseHex(input.base))

  const palet = buatDaftarPalet({ ...input, base, terang: input.terang ?? null })

  return ok(res, { input: { ...input, base }, palet }, `${palet.length} palet berhasil dibuat`)
})

export const listHarmoni = asyncHandler(async (req, res) => {
  return ok(res, HARMONI, 'Daftar skema harmoni berhasil diambil')
})
