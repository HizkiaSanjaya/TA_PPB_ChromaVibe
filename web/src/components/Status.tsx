export function Memuat({ pesan = 'Memuat data' }: { pesan?: string }) {
  return (
    <div
      role="status"
      className="flex items-center gap-2.5 rounded-xl border border-garis bg-panel/50 p-4"
    >
      <span className="size-4 animate-spin rounded-full border-2 border-garis border-t-brand" />
      <span className="text-xs text-redup">{pesan}</span>
    </div>
  )
}

export function Galat({ pesan, ulangi }: { pesan: string; ulangi?: () => void }) {
  return (
    <div role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/8 p-4">
      <p className="text-xs leading-relaxed text-rose-200">{pesan}</p>
      {ulangi && (
        <button
          type="button"
          onClick={ulangi}
          className="mt-2.5 min-h-8 rounded-lg border border-rose-400/40 px-2.5 text-xs font-medium text-rose-100 transition hover:bg-rose-500/15"
        >
          Coba lagi
        </button>
      )}
    </div>
  )
}

export function Kosong({ judul, pesan }: { judul: string; pesan: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-garis bg-panel/40 px-5 py-10 text-center">
      <p className="text-sm font-semibold">{judul}</p>
      <p className="mx-auto mt-1.5 max-w-[28ch] text-xs leading-relaxed text-redup">{pesan}</p>
    </div>
  )
}
