import { useEffect, useRef, useState } from 'react'

interface Props {
  teks: string
  label?: string
  className?: string
}

export function TombolSalin({ teks, label = 'Salin', className = '' }: Props) {
  const [tersalin, setTersalin] = useState(false)
  const pewaktu = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (pewaktu.current) window.clearTimeout(pewaktu.current)
    },
    []
  )

  async function salin() {
    try {
      await navigator.clipboard.writeText(teks)
    } catch {
      const area = document.createElement('textarea')
      area.value = teks
      area.setAttribute('readonly', '')
      area.style.position = 'fixed'
      area.style.opacity = '0'
      document.body.appendChild(area)
      area.select()
      document.execCommand('copy')
      document.body.removeChild(area)
    }

    setTersalin(true)
    if (pewaktu.current) window.clearTimeout(pewaktu.current)
    pewaktu.current = window.setTimeout(() => setTersalin(false), 1600)
  }

  return (
    <button
      type="button"
      onClick={salin}
      className={`inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-garis bg-panel-2/80 px-2.5 text-xs font-medium text-teks transition hover:border-brand/60 hover:text-white active:scale-[0.98] ${className}`}
    >
      {tersalin ? 'Tersalin' : label}
    </button>
  )
}
