import type { Palet } from '../api/types'
import { ambilHex, LABEL_PERAN, teksDiAtas } from '../utils/warna'

interface Props {
  palet: Palet
  ringkas?: boolean
}

/**
 * Pratinjau palet dalam bentuk antarmuka mini, bukan deretan kotak warna.
 *
 * Kotak warna terpisah sulit dinilai sebagai satu kesatuan, jadi warnanya
 * ditumpuk seperti halaman sungguhan: latar paling belakang, kartu di atasnya,
 * judul memakai warna utama, isi teks memakai warna teks, dan keterangan kecil
 * memakai warna kedua. Setiap peran benar-benar dipakai, bukan sekadar dipajang.
 */
export function PratinjauPalet({ palet, ringkas = false }: Props) {
  const background = ambilHex(palet, 'background')
  const surface = ambilHex(palet, 'surface')
  const base = ambilHex(palet, 'base')
  const accent = ambilHex(palet, 'accent')
  const text = ambilHex(palet, 'text')

  return (
    <div
      className="overflow-hidden rounded-xl ring-1 ring-white/10"
      style={{ backgroundColor: background }}
    >
      <div className={ringkas ? 'p-2.5' : 'p-3.5'}>
        <div className="rounded-lg p-3" style={{ backgroundColor: surface }}>
          <p
            className="text-[9px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: accent }}
          >
            Warna kedua
          </p>

          <p
            className={ringkas ? 'mt-1 text-[15px] font-bold' : 'mt-1.5 text-lg font-bold'}
            style={{ color: base }}
          >
            Judul memakai warna utama
          </p>

          <p className="mt-1 text-[11px] leading-relaxed" style={{ color: text }}>
            Isi tulisan memakai warna teks. Ukurannya lebih kecil daripada judul, tetapi
            keterbacaannya tetap dijamin.
          </p>

          <p className="mt-1.5 text-[10px] font-medium leading-relaxed" style={{ color: accent }}>
            Keterangan kecil memakai warna kedua.
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className="rounded-md px-2.5 py-1.5 text-[11px] font-semibold"
              style={{ backgroundColor: base, color: teksDiAtas(base) }}
            >
              Tombol
            </span>
            <span
              className="rounded-md border px-2.5 py-1.5 text-[11px] font-semibold"
              style={{ borderColor: accent, color: accent }}
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
 * Daftar lima warna beserta nama dan kodenya. Dipakai di kartu hasil supaya
 * pengguna tahu warna apa saja yang sedang dilihat, bukan hanya melihat contoh.
 */
export function LegendaPalet({ palet }: { palet: Palet }) {
  const surface = ambilHex(palet, 'surface')

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
          <span className="text-[10px] font-medium" style={{ color: ambilHex(palet, 'text') }}>
            {LABEL_PERAN[warna.peran]}
          </span>
          <code
            className="ml-auto font-mono text-[10px]"
            style={{ color: ambilHex(palet, 'text') }}
          >
            {warna.hex}
          </code>
        </li>
      ))}
    </ul>
  )
}
