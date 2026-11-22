import { useEffect, useState } from 'react'

interface PeristiwaPasang extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

declare global {
  interface Window {
    __cvPromptPasang?: PeristiwaPasang | null
  }
}

/**
 * Status keterpasangan PWA.
 *
 * Peristiwa beforeinstallprompt ditangkap lebih dulu oleh skrip di index.html,
 * karena React bisa kalah cepat dan kehilangan peristiwa tersebut. Hook ini
 * hanya membaca simpanan itu dan menunggu pemberitahuan berikutnya.
 */
export function usePasang() {
  const [peristiwa, setPeristiwa] = useState<PeristiwaPasang | null>(
    () => window.__cvPromptPasang ?? null
  )
  const [berdiriSendiri, setBerdiriSendiri] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(display-mode: standalone)')
    const iosTerpasang =
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true
    setBerdiriSendiri(media.matches || iosTerpasang)

    const ambil = () => setPeristiwa(window.__cvPromptPasang ?? null)
    const ditutup = () => setPeristiwa(null)
    const pantauMode = (e: MediaQueryListEvent) => setBerdiriSendiri(e.matches)

    window.addEventListener('chromavibe:pasang-tersedia', ambil)
    window.addEventListener('chromavibe:terpasang', ditutup)
    media.addEventListener('change', pantauMode)

    return () => {
      window.removeEventListener('chromavibe:pasang-tersedia', ambil)
      window.removeEventListener('chromavibe:terpasang', ditutup)
      media.removeEventListener('change', pantauMode)
    }
  }, [])

  async function pasang() {
    const tersedia = peristiwa ?? window.__cvPromptPasang ?? null
    if (!tersedia) return

    await tersedia.prompt()
    const pilihan = await tersedia.userChoice

    window.__cvPromptPasang = null
    setPeristiwa(null)

    if (pilihan.outcome === 'accepted') setBerdiriSendiri(true)
  }

  return { bisaPasang: Boolean(peristiwa) && !berdiriSendiri, berdiriSendiri, pasang }
}
