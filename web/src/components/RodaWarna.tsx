import type { Palet } from '../api/types'

interface Props {
  palet: Palet
  ukuran?: number
}

/**
 * Roda warna dengan posisi hue tiap warna.
 * Nama harmoni tidak berarti bagi orang awam, jadi perbedaannya ditunjukkan
 * lewat posisi titik pada roda.
 */
export function RodaWarna({ palet, ukuran = 132 }: Props) {
  const jari = ukuran / 2
  const titik = palet.warna
    .filter((warna) => warna.peran === 'base' || warna.peran === 'accent')
    .map((warna) => ({
      peran: warna.peran,
      hex: warna.hex,
      hue: warna.oklch[2],
    }))

  return (
    <div
      className="relative shrink-0 rounded-full ring-1 ring-garis"
      style={{
        width: ukuran,
        height: ukuran,
        background:
          'conic-gradient(from 0deg, #ff4d4d, #ffd400, #7dff4d, #00e5ff, #4d6bff, #c44dff, #ff4d4d)',
      }}
      role="img"
      aria-label={`Roda warna. ${titik
        .map(
          (t) =>
            `${t.peran === 'base' ? 'warna utama' : 'warna kedua'} pada ${Math.round(t.hue)} derajat`
        )
        .join(', ')}`}
    >
      <div
        className="absolute rounded-full bg-latar"
        style={{
          inset: ukuran * 0.19,
        }}
      />
      {titik.map((t) => {
        const sudut = (t.hue * Math.PI) / 180
        const jarak = jari * 0.72
        const x = jari + Math.cos(sudut) * jarak
        const y = jari + Math.sin(sudut) * jarak

        return (
          <span
            key={t.peran}
            className="absolute size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-latar ring-1 ring-white/60"
            style={{
              left: x,
              top: y,
              backgroundColor: t.hex,
            }}
            aria-hidden="true"
          />
        )
      })}
    </div>
  )
}

/** Keterangan singkat posisi kedua titik pada roda, memakai bahasa sehari-hari. */
export function bacaHarmoni(palet: Palet) {
  const dasar = palet.warna.find((w) => w.peran === 'base')
  const aksen = palet.warna.find((w) => w.peran === 'accent')
  if (!dasar || !aksen) return ''

  let selisih = Math.abs(dasar.oklch[2] - aksen.oklch[2])
  if (selisih > 180) selisih = 360 - selisih

  if (selisih < 20) return 'Dua warna masih satu keluarga, dibedakan lewat gelap terangnya'
  if (selisih < 60) return 'Dua warna bertetangga di roda, terasa menyatu'
  if (selisih < 100) return 'Dua warna berjarak sedang, sudah terlihat berbeda'
  if (selisih < 130) return 'Dua warna berjarak cukup jauh, terasa dinamis'
  if (selisih < 160) return 'Dua warna hampir berseberangan, terasa tegang'
  return 'Dua warna berseberangan, kontras paling kuat'
}
