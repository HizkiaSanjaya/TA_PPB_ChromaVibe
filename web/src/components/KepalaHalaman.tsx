import { Link } from 'react-router-dom'

import { IkonPanah } from './Ikon'

interface Props {
  judul: string
  keterangan?: string
  kembali?: { ke: string; label: string }
}

export function KepalaHalaman({ judul, keterangan, kembali }: Props) {
  return (
    <header className="mb-5">
      {kembali && (
        <Link
          to={kembali.ke}
          className="-ml-1 inline-flex min-h-9 items-center gap-0.5 rounded-lg py-1 pl-0.5 pr-2 text-xs font-medium text-redup transition hover:text-teks"
        >
          <IkonPanah />
          {kembali.label}
        </Link>
      )}
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">{judul}</h1>
      {keterangan && <p className="mt-1.5 text-sm leading-relaxed text-redup">{keterangan}</p>}
    </header>
  )
}
