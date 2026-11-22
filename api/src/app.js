import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { ZodError } from 'zod'

import temaRoutes from './routes/tema.routes.js'
import paletRoutes from './routes/palet.routes.js'
import metaRoutes from './routes/meta.routes.js'

const app = express()

const daftarOrigin = (process.env.CORS_ORIGIN ?? '*')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean)

const opsiCors =
  daftarOrigin.length === 0 || daftarOrigin.includes('*')
    ? {}
    : { origin: daftarOrigin, methods: ['GET'] }

app.disable('x-powered-by')
app.use(cors(opsiCors))
app.use(express.json({ limit: '32kb' }))

/** Hasil GET bersifat deterministik, jadi aman di-cache lapisan host maupun service worker. */
app.use((req, res, next) => {
  if (req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600')
  }
  next()
})

app.get('/', (req, res) => {
  res.json({
    success: true,
    name: 'ChromaVibe API',
    version: '1.0.0',
    description: 'Rekomendasi palet warna berbasis estetika tema dan harmoni kontras',
    endpoints: {
      'GET /health': 'Cek kesehatan layanan',
      'GET /api/v1/themes': 'Daftar tema beserta jumlah palet',
      'GET /api/v1/themes/:slug': 'Detail satu tema',
      'GET /api/v1/themes/:slug/palettes': 'Daftar palet kurasi pada satu tema',
      'GET /api/v1/harmoni': 'Daftar skema harmoni warna',
      'GET /api/v1/palettes': 'Seluruh palet kurasi',
      'GET /api/v1/palettes/generate?base=&tema=&harmoni=&jumlah=&seed=':
        'Buat palet baru dari satu warna primer',
      'GET /api/v1/palettes/:id': 'Detail satu palet kurasi',
    },
  })
})

app.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      service: 'chromavibe-api',
      timestamp: new Date().toISOString(),
    },
  })
})

app.use('/api/v1/themes', temaRoutes)
app.use('/api/v1/palettes', paletRoutes)
app.use('/api/v1', metaRoutes)

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' })
})

app.use((err, req, res, next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validasi input gagal',
      errors: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    })
  }

  const statusCode = err.statusCode || 500
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Terjadi kesalahan pada server',
  })
})

export default app
