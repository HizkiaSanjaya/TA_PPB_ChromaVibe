import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { TAB } from '../navigasi'

const AMBANG = 60
const BATAS_WAKTU = 800
const NISBAH = 1.4

function adaGeserMendatar(awal: EventTarget | null) {
  if (!(awal instanceof Element)) return false

  let simpul: Element | null = awal

  while (simpul && simpul !== document.body) {
    if (simpul.hasAttribute('data-tanpa-geser')) return true

    const nama = simpul.tagName
    if (nama === 'INPUT' || nama === 'TEXTAREA' || nama === 'SELECT') return true

    const gaya = window.getComputedStyle(simpul)
    const bisaDigeser = gaya.overflowX === 'auto' || gaya.overflowX === 'scroll'
    if (bisaDigeser && simpul.scrollWidth > simpul.clientWidth + 2) return true

    simpul = simpul.parentElement
  }

  return false
}

export function useGeserTab() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const urutan = TAB.findIndex((item) => item.ke === pathname)

  useEffect(() => {
    if (urutan === -1) return

    let awalX = 0
    let awalY = 0
    let awalWaktu = 0
    let lewati = false

    const mulai = (peristiwa: TouchEvent) => {
      if (peristiwa.touches.length !== 1) {
        lewati = true
        return
      }

      const sentuh = peristiwa.touches[0]
      awalX = sentuh.clientX
      awalY = sentuh.clientY
      awalWaktu = Date.now()
      lewati = adaGeserMendatar(peristiwa.target)
    }

    const batal = () => {
      lewati = true
    }

    const selesai = (peristiwa: TouchEvent) => {
      if (lewati) return

      const sentuh = peristiwa.changedTouches[0]
      if (!sentuh) return
      if (Date.now() - awalWaktu > BATAS_WAKTU) return

      const geserX = sentuh.clientX - awalX
      const geserY = sentuh.clientY - awalY

      if (Math.abs(geserX) < AMBANG) return
      if (Math.abs(geserX) < Math.abs(geserY) * NISBAH) return

      // Geser ke kiri berarti maju ke tab berikutnya.
      const tujuan = geserX < 0 ? urutan + 1 : urutan - 1
      if (tujuan < 0 || tujuan >= TAB.length) return

      navigate(TAB[tujuan].ke)
    }

    window.addEventListener('touchstart', mulai, { passive: true })
    window.addEventListener('touchend', selesai, { passive: true })
    window.addEventListener('touchcancel', batal, { passive: true })

    return () => {
      window.removeEventListener('touchstart', mulai)
      window.removeEventListener('touchend', selesai)
      window.removeEventListener('touchcancel', batal)
    }
  }, [urutan, navigate])
}
