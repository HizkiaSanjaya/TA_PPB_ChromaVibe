import { Router } from 'express'

import { listHarmoni } from '../controllers/palet.controller.js'

const router = Router()

router.get('/harmoni', listHarmoni)

export default router
