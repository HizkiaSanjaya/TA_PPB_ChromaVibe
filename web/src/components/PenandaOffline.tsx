import { useEffect, useState } from 'react'

/**
 * Penanda koneksi server.
 * navigator.onLine cuma tahu status jaringan perangkat, belum tentu server
 * terjangkau. Karena itu penanda ini ikut mendengar kegagalan dan pemulihan
 * permintaan dari klien.
 */
export function PenandaOffline() {
  const [terputus, setTerputus] = useState(false)

  useEffect(() => {
    const gagal = () => setTerputus(true)
    const pulih = () => setTerputus(false)

    window.addEventListener('chromavibe:jaringan-gagal', gagal)
    window.addEventListener('chromavibe:jaringan-pulih', pulih)
    window.addEventListener('online', pulih)

    return () => {
      window.removeEventListener('chromavibe:jaringan-gagal', gagal)
      window.removeEventListener('chromavibe:jaringan-pulih', pulih)
      window.removeEventListener('online', pulih)
    }
  }, [])

  if (!terputus) return null

  return (
    <div
      role="status"
      className="flex items-center justify-between gap-3 border-b border-garis bg-panel px-4 py-2"
    >
      <p className="text-[11px] leading-snug text-teks">
        Server tidak terjangkau. Data yang tampil berasal dari simpanan sementara.
      </p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="shrink-0 rounded-md border border-garis px-2 py-1 text-[10px] font-semibold text-teks transition hover:border-redup"
      >
        Muat ulang
      </button>
    </div>
  )
}
