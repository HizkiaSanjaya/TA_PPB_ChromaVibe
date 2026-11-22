import { Router } from 'express'

import { generatePalet, getPalet, listPaletKurasi } from '../controllers/palet.controller.js'

const router = Router()

// Rute statis wajib didaftarkan sebelum rute dinamis.
router.get('/generate', generatePalet)
router.get('/', listPaletKurasi)
router.get('/:id', getPalet)

export default router
