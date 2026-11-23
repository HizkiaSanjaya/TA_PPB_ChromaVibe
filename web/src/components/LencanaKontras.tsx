import type { NilaiKontras } from '../api/types'

/** Istilah WCAG diterjemahkan ke bahasa sehari-hari, istilah aslinya tetap ditampilkan. */
const GAYA: Record<NilaiKontras, { kelas: string; label: string; arti: string }> = {
  AAA: {
    kelas: 'border-emerald-500/35 bg-emerald-500/12 text-emerald-300',
    label: 'Sangat jelas',
    arti: 'Teks sangat mudah dibaca, lolos standar tertinggi (AAA).',
  },
  AA: {
    kelas: 'border-lime-500/35 bg-lime-500/12 text-lime-300',
    label: 'Jelas',
    arti: 'Teks mudah dibaca, lolos standar minimum yang dianjurkan (AA).',
  },
  'AA-Large': {
    kelas: 'border-amber-500/35 bg-amber-500/12 text-amber-300',
    label: 'Cukup',
    arti: 'Hanya aman untuk teks besar atau tebal, belum untuk teks kecil.',
  },
  Gagal: {
    kelas: 'border-rose-500/35 bg-rose-500/12 text-rose-300',
    label: 'Kurang',
    arti: 'Teks terlalu samar terhadap latarnya, sulit dibaca.',
  },
}

export function LencanaKontras({ nilai, rasio }: { nilai: NilaiKontras; rasio: number }) {
  const gaya = GAYA[nilai]

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${gaya.kelas}`}
      title={`${gaya.arti} Angka ${rasio.toFixed(2)} berarti tingkat perbedaan terang antara teks dan latarnya.`}
    >
      {gaya.label}
      <span className="font-mono text-[10px] font-normal opacity-80">{rasio.toFixed(1)} : 1</span>
    </span>
  )
}

export function PilSkor({ skor, total }: { skor: number; total?: number }) {
  const gaya =
    skor >= 100
      ? 'border-emerald-500/35 bg-emerald-500/12 text-emerald-300'
      : skor >= 80
        ? 'border-amber-500/35 bg-amber-500/12 text-amber-300'
        : 'border-rose-500/35 bg-rose-500/12 text-rose-300'

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold tabular-nums ${gaya}`}
      title={
        total
          ? `${skor}% dari ${total} pasangan warna lolos uji keterbacaan`
          : `${skor} persen pemeriksaan keterbacaan lolos`
      }
    >
      {total ? `${Math.round((skor / 100) * total)}/${total}` : `${skor}%`}
    </span>
  )
}
