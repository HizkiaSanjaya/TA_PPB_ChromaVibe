import { Router } from 'express'

import { getTema, listTema } from '../controllers/tema.controller.js'
import { listPaletTema } from '../controllers/palet.controller.js'

const router = Router()

router.get('/', listTema)
router.get('/:slug', getTema)
router.get('/:slug/palettes', listPaletTema)

export default router
