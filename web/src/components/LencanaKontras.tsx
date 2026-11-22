import type { NilaiKontras } from '../api/types'

const GAYA: Record<NilaiKontras, string> = {
  AAA: 'border-emerald-500/35 bg-emerald-500/12 text-emerald-300',
  AA: 'border-lime-500/35 bg-lime-500/12 text-lime-300',
  'AA-Large': 'border-amber-500/35 bg-amber-500/12 text-amber-300',
  Gagal: 'border-rose-500/35 bg-rose-500/12 text-rose-300',
}

export function LencanaKontras({ nilai, rasio }: { nilai: NilaiKontras; rasio: number }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${GAYA[nilai]}`}
    >
      {nilai}
      <span className="font-mono text-[10px] font-normal opacity-80">{rasio.toFixed(2)}</span>
    </span>
  )
}

export function PilSkor({ skor }: { skor: number }) {
  const gaya =
    skor >= 100
      ? 'border-emerald-500/35 bg-emerald-500/12 text-emerald-300'
      : skor >= 80
        ? 'border-amber-500/35 bg-amber-500/12 text-amber-300'
        : 'border-rose-500/35 bg-rose-500/12 text-rose-300'

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold tabular-nums ${gaya}`}
      title={`${skor} persen pasangan warna lolos ambang kontras`}
    >
      {skor}%
    </span>
  )
}
