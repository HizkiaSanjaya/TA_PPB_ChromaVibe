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
 *
 * Versi ringkas dipakai di kartu hasil: hanya judul, satu baris isi, dan dua
 * tombol. Keterangan panjang dibuang karena lima kartu bertumpuk membuat
 * halaman penuh tulisan.
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
      <div className={ringkas ? 'p-2' : 'p-3.5'}>
        <div
          className={ringkas ? 'rounded-lg p-2.5' : 'rounded-lg p-3'}
          style={{ backgroundColor: surface }}
        >
          <p
            className={ringkas ? 'text-[15px] font-bold leading-tight' : 'text-lg font-bold'}
            style={{ color: base }}
          >
            Judul
          </p>

          <p
            className={`${ringkas ? 'mt-0.5' : 'mt-1'} text-[11px] leading-relaxed`}
            style={{ color: text }}
          >
            Isi tulisan
          </p>

          <div className={`${ringkas ? 'mt-2' : 'mt-3'} flex flex-wrap items-center gap-2`}>
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
        </div>
      </div>
    </div>
  )
}

/**
 * Daftar lima warna dalam satu baris ringkas.
 * Nama peran hanya muncul saat kursor diarahkan atau dibaca pembaca layar,
 * supaya kartu hasil tidak penuh tulisan.
 */
export function LegendaPalet({ palet }: { palet: Palet }) {
  const surface = ambilHex(palet, 'surface')
  const text = ambilHex(palet, 'text')

  return (
    <ul className="mt-1.5 flex flex-wrap gap-1">
      {palet.warna.map((warna) => (
        <li
          key={warna.peran}
          className="flex items-center gap-1 rounded px-1 py-0.5"
          style={{ backgroundColor: surface }}
          title={LABEL_PERAN[warna.peran]}
        >
          <span
            aria-hidden="true"
            className="size-2.5 rounded-full ring-1 ring-black/20"
            style={{ backgroundColor: warna.hex }}
          />
          <code className="font-mono text-[9px]" style={{ color: text }}>
            {warna.hex.replace('#', '')}
          </code>
          <span className="sr-only">{LABEL_PERAN[warna.peran]}</span>
        </li>
      ))}
    </ul>
  )
}
