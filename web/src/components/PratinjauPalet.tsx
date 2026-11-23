import type { Palet } from '../api/types'
import { ambilHex, LABEL_PERAN, rasioKontras, teksDiAtas } from '../utils/warna'

interface Props {
  palet: Palet
  ringkas?: boolean
}

/**
 * Pilih warna tulisan yang paling kontras di atas sebuah bidang warna.
 */
function teksAman(hex: string, kandidat: string[]) {
  const urut = kandidat
    .map((warna) => ({ warna, rasio: rasioKontras(hex, warna) }))
    .sort((a, b) => b.rasio - a.rasio)

  return urut[0] && urut[0].rasio >= 4.5 ? urut[0].warna : teksDiAtas(hex)
}

/**
 * Pratinjau palet berupa antarmuka mini.
 * Warna utama untuk judul (jaminan 4.5), warna teks untuk isi, warna kedua
 * untuk isian bidang dan garis (jaminan 3, sesuai komponen non-teks).
 */
export function PratinjauPalet({ palet, ringkas = false }: Props) {
  const background = ambilHex(palet, 'background')
  const surface = ambilHex(palet, 'surface')
  const base = ambilHex(palet, 'base')
  const accent = ambilHex(palet, 'accent')
  const text = ambilHex(palet, 'text')

  const diAtasAksen = teksAman(accent, [background, surface, text, '#FFFFFF', '#000000'])

  return (
    <div
      className="overflow-hidden rounded-xl ring-1 ring-white/10"
      style={{ backgroundColor: background }}
    >
      <div className={ringkas ? 'p-2.5' : 'p-3.5'}>
        <div className="rounded-lg p-3" style={{ backgroundColor: surface }}>
          <div className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="size-2 rounded-full"
              style={{ backgroundColor: accent }}
            />
            <p
              className="text-[9px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: text }}
            >
              Warna kedua sebagai titik
            </p>
          </div>

          <p
            className={ringkas ? 'mt-1 text-[15px] font-bold' : 'mt-1.5 text-lg font-bold'}
            style={{ color: base }}
          >
            Judul memakai warna utama
          </p>

          <p className="mt-1 text-[11px] leading-relaxed" style={{ color: text }}>
            Isi tulisan memakai warna teks, supaya selalu mudah dibaca.
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className="rounded-md px-2.5 py-1.5 text-[11px] font-semibold"
              style={{ backgroundColor: base, color: teksDiAtas(base) }}
            >
              Tombol
            </span>
            <span
              className="rounded-md px-2.5 py-1.5 text-[11px] font-semibold"
              style={{ backgroundColor: accent, color: diAtasAksen }}
            >
              Tombol kedua
            </span>
          </div>

          {/* Warna kedua sebagai garis tebal, pemakaian yang sah pada 3 banding 1. */}
          <div className="mt-3 flex items-stretch gap-2">
            <span
              aria-hidden="true"
              className="w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: accent }}
            />
            <p className="text-[10px] leading-relaxed" style={{ color: text }}>
              Garis di kiri memakai warna kedua. Bidang berwarna ini aman untuk komponen, bukan
              untuk tulisan kecil.
            </p>
          </div>
        </div>

        {!ringkas && (
          <div
            className="mt-2 flex items-center justify-between rounded-md px-2 py-1"
            style={{ backgroundColor: accent, color: diAtasAksen }}
          >
            <span className="text-[9px] font-semibold uppercase tracking-wider">Warna kedua</span>
            <span className="font-mono text-[9px]">{accent}</span>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Daftar lima warna beserta nama dan kodenya. Dipakai di kartu hasil supaya
 * pengguna tahu warna apa saja yang sedang dilihat, bukan hanya melihat contoh.
 */
export function LegendaPalet({ palet }: { palet: Palet }) {
  const surface = ambilHex(palet, 'surface')
  const text = ambilHex(palet, 'text')

  return (
    <ul className="mt-2 grid grid-cols-1 gap-1">
      {palet.warna.map((warna) => (
        <li
          key={warna.peran}
          className="flex items-center gap-2 rounded-md px-1.5 py-1"
          style={{ backgroundColor: surface }}
        >
          <span
            aria-hidden="true"
            className="size-4 shrink-0 rounded ring-1 ring-black/20"
            style={{ backgroundColor: warna.hex }}
          />
          <span className="text-[10px] font-medium" style={{ color: text }}>
            {LABEL_PERAN[warna.peran]}
          </span>
          <code className="ml-auto font-mono text-[10px]" style={{ color: text }}>
            {warna.hex}
          </code>
        </li>
      ))}
    </ul>
  )
}
