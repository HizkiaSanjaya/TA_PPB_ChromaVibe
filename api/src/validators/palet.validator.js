import { z } from 'zod'

import { SLUG_HARMONI } from '../lib/color/harmony.js'
import { SLUG_TEMA } from '../lib/palette/themes.js'

const hexString = z
  .string({
    required_error: 'Warna primer wajib dikirim',
    invalid_type_error: 'Warna primer harus string',
  })
  .trim()
  .regex(/^#?[0-9a-fA-F]{6}$/, 'Warna primer harus format #RRGGBB')

export const generateQuerySchema = z.object({
  base: hexString,
  tema: z.enum(SLUG_TEMA, {
    errorMap: () => ({ message: `Tema harus salah satu dari: ${SLUG_TEMA.join(', ')}` }),
  }),
  harmoni: z
    .enum(SLUG_HARMONI, {
      errorMap: () => ({ message: `Harmoni harus salah satu dari: ${SLUG_HARMONI.join(', ')}` }),
    })
    .default('triadik'),
  jumlah: z.coerce
    .number({ invalid_type_error: 'Jumlah harus angka' })
    .int('Jumlah harus bilangan bulat')
    .min(1, 'Jumlah minimal 1')
    .max(5, 'Jumlah maksimal 5')
    .default(1),
  seed: z.coerce
    .number({ invalid_type_error: 'Seed harus angka' })
    .int('Seed harus bilangan bulat')
    .min(0, 'Seed tidak boleh negatif')
    .max(2_000_000_000, 'Seed terlalu besar')
    .default(0),
})

export const paletParamSchema = z.object({
  id: z
    .string()
    .min(1, 'Id palet wajib diisi')
    .max(64, 'Id palet terlalu panjang')
    .regex(/^[A-Za-z0-9_-]+$/, 'Id palet hanya boleh berisi huruf, angka, garis bawah, dan strip'),
})
