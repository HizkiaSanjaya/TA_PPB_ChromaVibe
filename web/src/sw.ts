/**
 * Service worker ChromaVibe.
 *
 * Ditulis tangan, bukan dibangkitkan, supaya setiap keputusan cache terlihat
 * dan bisa dipertanggungjawabkan saat responsi. Daftar berkas kerangka aplikasi
 * disuntikkan oleh vite-plugin-pwa lewat self.__WB_MANIFEST.
 */

interface BerkasManifest {
  url: string
  revision: string | null
}

interface WorkerGlobalScope {
  __WB_MANIFEST: BerkasManifest[]
}

const sw = self as unknown as ServiceWorkerGlobalScope

// Akhiran versi ikut dinaikkan setiap kali bentuk data API atau isi kerangka
// berubah. Tanpa ini, service worker bisa menyajikan jawaban lama tanpa field
// baru, dan halaman tampak kosong walau server sudah benar.
const CACHE_KERANGKA = 'chromavibe-kerangka-v5'
const CACHE_API = 'chromavibe-api-v5'
const CACHE_RUNTIME = 'chromavibe-runtime-v5'

const SEMUA_CACHE = new Set([CACHE_KERANGKA, CACHE_API, CACHE_RUNTIME])

const BATAS_API_ENTRIES = 80
const UMUR_API_MS = 7 * 24 * 60 * 60 * 1000

sw.addEventListener('install', (peristiwa) => {
  peristiwa.waitUntil(
    (async () => {
      const daftar = self.__WB_MANIFEST ?? []
      // Cache.addAll menolak daftar berisi URL ganda, dan manifest dari Vite
      // memang bisa memuat entri kembar saat includeAssets beririsan dengan glob.
      const unik = [
        ...new Set(daftar.map((berkas) => new URL(berkas.url, sw.location.origin).href)),
      ]

      const cache = await caches.open(CACHE_KERANGKA)
      await cache.addAll(unik)
      await sw.skipWaiting()
    })()
  )
})

sw.addEventListener('activate', (peristiwa) => {
  peristiwa.waitUntil(
    (async () => {
      const nama = await caches.keys()
      const usang = nama.filter((item) => !SEMUA_CACHE.has(item))
      await Promise.all(usang.map((item) => caches.delete(item)))
      await sw.clients.claim()
    })()
  )
})

/** Menyimpan respons tanpa pernah menggagalkan permintaan bila penyimpanan penuh. */
async function simpan(namaCache: string, kunci: Request, respons: Response) {
  if (!respons || respons.status !== 200) return

  try {
    const cache = await caches.open(namaCache)
    await cache.put(kunci, respons.clone())
  } catch {
    // Kuota penuh atau mode privat. Permintaan tetap dilayani dari jaringan.
  }
}

async function pangkasCacheApi() {
  const cache = await caches.open(CACHE_API)
  const kunci = await cache.keys()
  if (kunci.length <= BATAS_API_ENTRIES) return

  const berlebih = kunci.length - BATAS_API_ENTRIES
  await Promise.all(kunci.slice(0, berlebih).map((item) => cache.delete(item)))
}

/**
 * Stale while revalidate: jawab dari cache bila ada, lalu perbarui di latar.
 * Aman untuk ChromaVibe karena hasil generator deterministik, sehingga jawaban
 * lama untuk input yang sama memang jawaban yang benar.
 */
async function layaniApi(permintaan: Request): Promise<Response> {
  const cache = await caches.open(CACHE_API)
  const tersimpan = await cache.match(permintaan)

  const dariJaringan = fetch(permintaan)
    .then(async (respons) => {
      await simpan(CACHE_API, permintaan, respons)
      await pangkasCacheApi()
      return respons
    })
    .catch(() => null)

  if (tersimpan) return tersimpan

  const respons = await dariJaringan
  if (respons) return respons

  return new Response(
    JSON.stringify({
      success: false,
      message: 'Tidak ada koneksi dan permintaan ini belum pernah dimuat.',
    }),
    { status: 503, headers: { 'Content-Type': 'application/json' } }
  )
}

/** Halaman yang sudah dibuka tetap tampil saat jaringan mati. */
async function layaniNavigasi(permintaan: Request): Promise<Response> {
  try {
    const respons = await fetch(permintaan)
    await simpan(CACHE_RUNTIME, permintaan, respons)
    return respons
  } catch {
    const cacheRuntime = await caches.open(CACHE_RUNTIME)
    const tersimpan = await cacheRuntime.match(permintaan)
    if (tersimpan) return tersimpan

    const kerangka = await caches.open(CACHE_KERANGKA)
    const indexHtml =
      (await kerangka.match(new URL('index.html', sw.location.origin).href)) ??
      (await kerangka.match('/index.html'))

    if (indexHtml) return indexHtml

    return new Response('Aplikasi belum tersimpan untuk mode offline.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }
}

async function layaniAset(permintaan: Request): Promise<Response> {
  const cacheKerangka = await caches.open(CACHE_KERANGKA)
  const tersimpan = await cacheKerangka.match(permintaan)
  if (tersimpan) return tersimpan

  const respons = await fetch(permintaan)
  await simpan(CACHE_RUNTIME, permintaan, respons)
  return respons
}

sw.addEventListener('fetch', (peristiwa) => {
  const { request } = peristiwa
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  if (url.pathname.startsWith('/api/v1/')) {
    peristiwa.respondWith(layaniApi(request))
    return
  }

  if (request.mode === 'navigate') {
    peristiwa.respondWith(layaniNavigasi(request))
    return
  }

  if (url.origin === sw.location.origin) {
    peristiwa.respondWith(layaniAset(request))
  }
})

// Menghapus entri API yang kedaluwarsa saat service worker dibangunkan kembali.
sw.addEventListener('message', (peristiwa) => {
  if (peristiwa.data === 'bersihkan-cache-api') {
    peristiwa.waitUntil(
      (async () => {
        const cache = await caches.open(CACHE_API)
        const kunci = await cache.keys()
        const batas = Date.now() - UMUR_API_MS

        await Promise.all(
          kunci.map(async (kunciPermintaan) => {
            const respons = await cache.match(kunciPermintaan)
            const tanggal = respons?.headers.get('date')
            if (tanggal && new Date(tanggal).getTime() < batas) {
              await cache.delete(kunciPermintaan)
            }
          })
        )
      })()
    )
  }
})
