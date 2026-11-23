import type { Palet } from '../api/types'
import { ambilHex, LABEL_PERAN, teksDiAtas } from '../utils/warna'

interface Props {
  palet: Palet
  ringkas?: boolean
}

/**
 * Pratinjau palet dalam bentuk antarmuka mini, bukan deretan kotak warna.
 *
 * Kotak warna terpisah sulit dinilai sebagai satu kesatuan. Komponen ini
 * menumpuk kelima peran seperti halaman sungguhan: latar paling belakang,
 * kartu di atasnya, teks sebagai isi, primer untuk tombol utama, dan aksen
 * untuk tombol kedua. Dengan begitu pengguna melihat apakah warnanya menyatu.
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
            style={{ color: text }}
          >
            Contoh antarmuka
          </p>
          <p
            className={ringkas ? 'mt-1 text-sm font-semibold' : 'mt-1.5 text-base font-semibold'}
            style={{ color: text }}
          >
            Judul di atas kartu
          </p>
          <p className="mt-1 text-[11px] leading-relaxed" style={{ color: text, opacity: 0.85 }}>
            Isi teks memakai warna yang sama dengan judul, diturunkan kepekatannya.
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className="rounded-md px-2.5 py-1.5 text-[11px] font-semibold"
              style={{ backgroundColor: base, color: teksDiAtas(base) }}
            >
              Tombol primer
            </span>
            {/*
              Warna aksen hanya dijamin 3 banding 1 terhadap latar, cukup untuk
              batas komponen tetapi belum tentu untuk teks kecil. Karena itu
              aksen dipakai sebagai garis dan titik, sedangkan teksnya memakai
              warna teks palet yang sudah dijamin 4.5 banding 1.
            */}
            <span
              className="flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[11px] font-semibold"
              style={{ borderColor: accent, color: text }}
            >
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full"
                style={{ backgroundColor: accent }}
              />
              Tombol sekunder
            </span>
          </div>
        </div>

        {!ringkas && (
          <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5">
            {palet.warna.map((warna) => (
              <div key={warna.peran} className="flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className="size-2.5 shrink-0 rounded-full ring-1 ring-white/25"
                  style={{ backgroundColor: warna.hex }}
                />
                <dt className="text-[10px]" style={{ color: text }}>
                  {LABEL_PERAN[warna.peran]}
                </dt>
                <dd className="ml-auto font-mono text-[10px]" style={{ color: text }}>
                  {warna.hex}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  )
}
