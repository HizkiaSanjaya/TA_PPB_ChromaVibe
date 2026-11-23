import type { Tema } from '../api/types'
import { teksDiAtas } from '../utils/warna'

interface Warna {
  background: string
  surface: string
  base: string
  accent: string
  text: string
}

interface Props {
  tema: Tema
  warna: Warna
}

// Kartu tema berupa cuplikan antarmuka. Yang membedakan tema bukan cuma warna,
// tapi juga sudut, tebal garis, dan bentuk hurufnya.
export function KartuTema({ tema, warna }: Props) {
  const warnaKedua = teksDiAtas(warna.accent)

  // Setiap tema punya bentuk sendiri, mengikuti ciri yang melekat padanya.
  const gaya = (() => {
    switch (tema.slug) {
      case 'elegant':
        return {
          sudut: 'rounded-sm',
          huruf: 'font-serif tracking-[0.18em] uppercase',
          garis: `1px solid ${warna.accent}`,
          aksen: (
            <span
              className="mt-1.5 block h-px w-8"
              style={{ backgroundColor: warna.accent }}
              aria-hidden="true"
            />
          ),
        }
      case 'brutalism':
        return {
          sudut: '',
          huruf: 'font-black uppercase tracking-tight',
          garis: `3px solid ${warna.text}`,
          aksen: (
            <span
              className="mt-1.5 block h-2 w-10"
              style={{ backgroundColor: warna.base }}
              aria-hidden="true"
            />
          ),
        }
      case 'y2k':
        return {
          sudut: 'rounded-xl',
          huruf: 'font-bold uppercase tracking-wider',
          garis: `1px solid ${warna.accent}66`,
          aksen: (
            <span className="mt-1.5 flex gap-1" aria-hidden="true">
              {[warna.base, warna.accent, warna.text].map((c) => (
                <span key={c} className="h-1 w-4 rounded-full" style={{ backgroundColor: c }} />
              ))}
            </span>
          ),
        }
      case 'cyberpunk':
        return {
          sudut: 'rounded-none',
          huruf: 'font-mono font-bold uppercase tracking-[0.2em]',
          garis: `1px solid ${warna.accent}`,
          aksen: (
            <span
              className="mt-1.5 block font-mono text-[8px] uppercase tracking-widest"
              style={{ color: warna.accent }}
              aria-hidden="true"
            >
              ● online
            </span>
          ),
        }
      case 'minimalis':
        return {
          sudut: 'rounded',
          huruf: 'font-light tracking-[0.3em] uppercase',
          garis: `1px solid ${warna.accent}33`,
          aksen: (
            <span
              className="mt-2 block h-px w-full"
              style={{ backgroundColor: `${warna.text}22` }}
              aria-hidden="true"
            />
          ),
        }
      case 'vintage':
        return {
          sudut: 'rounded',
          huruf: 'font-serif italic',
          garis: `1px dashed ${warna.accent}`,
          aksen: (
            <span
              className="mt-1 block text-[8px] uppercase tracking-[0.2em]"
              style={{ color: warna.accent }}
              aria-hidden="true"
            >
              est. 1998
            </span>
          ),
        }
      case 'classic':
        return {
          sudut: 'rounded-sm',
          huruf: 'font-serif tracking-wide',
          garis: `2px solid ${warna.base}`,
          aksen: (
            <span
              className="mt-1.5 block h-px w-12"
              style={{ backgroundColor: warna.accent }}
              aria-hidden="true"
            />
          ),
        }
      case 'energetic':
        return {
          sudut: 'rounded-md',
          huruf: 'font-extrabold uppercase tracking-tight',
          garis: `2px solid ${warna.base}`,
          aksen: (
            <span
              className="mt-1.5 block h-1.5 w-12 rounded-sm"
              style={{ backgroundColor: warna.accent }}
              aria-hidden="true"
            />
          ),
        }
      case 'pastel':
        return {
          sudut: 'rounded-2xl',
          huruf: 'font-medium tracking-wide',
          garis: `1px solid ${warna.accent}55`,
          aksen: (
            <span className="mt-1.5 flex gap-1" aria-hidden="true">
              {[warna.base, warna.accent].map((c) => (
                <span key={c} className="size-2 rounded-full" style={{ backgroundColor: c }} />
              ))}
            </span>
          ),
        }
      default:
        return {
          sudut: 'rounded-lg',
          huruf: 'font-semibold tracking-normal',
          garis: `1px solid ${warna.accent}66`,
          aksen: (
            <span
              className="mt-1.5 block h-1 w-6"
              style={{ backgroundColor: warna.accent }}
              aria-hidden="true"
            />
          ),
        }
    }
  })()

  return (
    <div
      className={`relative overflow-hidden ${gaya.sudut || 'rounded-none'}`}
      style={{ backgroundColor: warna.background }}
    >
      {/* Latar belakang ikut membentuk karakter: garis miring untuk Brutalism,
          titik-titik untuk Y2K, dan bersih untuk Minimalis. */}
      {tema.slug === 'brutalism' && (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, ${warna.base}22 0 6px, transparent 6px 12px)`,
          }}
        />
      )}
      {tema.slug === 'y2k' && (
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(${warna.accent} 1px, transparent 1px)`,
            backgroundSize: '8px 8px',
          }}
        />
      )}

      <div className="relative p-3">
        <div
          className={`p-2.5 ${gaya.sudut}`}
          style={{ backgroundColor: warna.surface, border: gaya.garis }}
        >
          {/* Huruf contoh, bukan nama tema. Nama sudah tertulis di bawah kartu,
              dan tipografi inilah yang paling jelas memperlihatkan karakter. */}
          <p className={`${gaya.huruf} text-2xl leading-none`} style={{ color: warna.text }}>
            Aa
          </p>
          {gaya.aksen}
          <p
            className="mt-2 text-[9px] leading-relaxed"
            style={{ color: warna.text, opacity: 0.72 }}
          >
            {tema.kataKunci.slice(0, 2).join(' · ')}
          </p>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span
            className="text-[8px] font-medium uppercase tracking-wider"
            style={{ color: warna.text, opacity: 0.7 }}
          >
            {tema.jumlah_palet} palet
          </span>
          <span
            className="rounded-full px-1.5 py-0.5 text-[8px] font-bold"
            style={{ backgroundColor: warna.accent, color: warnaKedua }}
          >
            {tema.contoh?.skor ?? 0}%
          </span>
        </div>
      </div>
    </div>
  )
}

/** Mengubah larik warna dari API menjadi objek per peran. */
export function warnaTema(tema: Tema): Warna | null {
  const contoh = tema.contoh
  if (!contoh) return null

  const ambil = (peran: string) => contoh.warna.find((w) => w.peran === peran)?.hex

  const background = ambil('background')
  const surface = ambil('surface')
  const base = ambil('base')
  const accent = ambil('accent')
  const text = ambil('text')

  if (!background || !surface || !base || !accent || !text) return null

  return { background, surface, base, accent, text }
}
