import { useEffect, useState } from 'react'

interface PeristiwaPasang extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/**
 * Menangkap peristiwa beforeinstallprompt.
 *
 * Chrome hanya memancarkannya bila syarat keterpasangan terpenuhi: manifest
 * lengkap, ikon 192 dan 512, service worker aktif, dan situs disajikan lewat
 * HTTPS. Kalau tombol di halaman Tentang tidak muncul, itu petunjuk bahwa
 * syarat tersebut belum terpenuhi di peramban pengguna, bukan karena tombolnya
 * rusak. Peramban dalam aplikasi seperti Instagram atau WhatsApp tidak pernah
 * memancarkan peristiwa ini.
 */
export function usePasang() {
  const [peristiwa, setPeristiwa] = useState<PeristiwaPasang | null>(null)
  const [berdiriSendiri, setBerdiriSendiri] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(display-mode: standalone)')
    setBerdiriSendiri(media.matches)

    const tangkap = (e: Event) => {
      e.preventDefault()
      setPeristiwa(e as PeristiwaPasang)
    }

    const selesai = () => {
      setPeristiwa(null)
      setBerdiriSendiri(true)
    }

    const pantauMode = (e: MediaQueryListEvent) => setBerdiriSendiri(e.matches)

    window.addEventListener('beforeinstallprompt', tangkap)
    window.addEventListener('appinstalled', selesai)
    media.addEventListener('change', pantauMode)

    return () => {
      window.removeEventListener('beforeinstallprompt', tangkap)
      window.removeEventListener('appinstalled', selesai)
      media.removeEventListener('change', pantauMode)
    }
  }, [])

  async function pasang() {
    if (!peristiwa) return
    await peristiwa.prompt()
    const pilihan = await peristiwa.userChoice
    if (pilihan.outcome === 'accepted') setPeristiwa(null)
  }

  return { bisaPasang: Boolean(peristiwa) && !berdiriSendiri, berdiriSendiri, pasang }
}
