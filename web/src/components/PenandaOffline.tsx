import { useEffect, useState } from 'react'

/**
 * navigator.onLine hanya melaporkan status jaringan perangkat, bukan apakah
 * server API benar-benar bisa dihubungi. Karena itu kegagalan fetch dari klien
 * juga dilaporkan sebagai offline lewat kejadian `chromavibe:jaringan-gagal`.
 */
export function PenandaOffline() {
  const [daring, setDaring] = useState(() => navigator.onLine)

  useEffect(() => {
    const naik = () => setDaring(true)
    const turun = () => setDaring(false)

    window.addEventListener('online', naik)
    window.addEventListener('offline', turun)
    window.addEventListener('chromavibe:jaringan-gagal', turun)

    return () => {
      window.removeEventListener('online', naik)
      window.removeEventListener('offline', turun)
      window.removeEventListener('chromavibe:jaringan-gagal', turun)
    }
  }, [])

  if (daring) return null

  return (
    <div
      role="status"
      className="border-b border-garis bg-panel px-4 py-2 text-center text-[11px] text-teks"
    >
      Koneksi ke server terputus. Data yang tampil berasal dari simpanan sementara.
    </div>
  )
}
