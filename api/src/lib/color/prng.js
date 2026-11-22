/**
 * Generator acak deterministik.
 *
 * Palet wajib bisa direproduksi persis dari kombinasi input yang sama, karena
 * hasilnya dipakai pada URL yang dibagikan dan cache service worker.
 * Math.random tidak memenuhi syarat itu.
 */

export function hashString(teks) {
  let hash = 0x811c9dc5
  for (let i = 0; i < teks.length; i += 1) {
    hash ^= teks.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

export function buatPrng(benih) {
  let status = typeof benih === 'number' ? benih >>> 0 : hashString(String(benih))

  return function acak() {
    status = (status + 0x6d2b79f5) | 0
    let t = Math.imul(status ^ (status >>> 15), 1 | status)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
