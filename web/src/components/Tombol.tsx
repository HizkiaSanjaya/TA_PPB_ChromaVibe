import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

const DASAR =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60'

export function TautanUtama({
  to,
  children,
  className = '',
}: {
  to: string
  children: ReactNode
  className?: string
}) {
  return (
    <Link to={to} className={`${DASAR} bg-brand text-ink hover:bg-white ${className}`}>
      {children}
    </Link>
  )
}

export function TautanGaris({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className={`${DASAR} border border-garis bg-transparent text-teks hover:border-redup`}
    >
      {children}
    </Link>
  )
}

export function TombolAksi({
  onClick,
  children,
  utama = false,
  nonaktif = false,
  className = '',
}: {
  onClick: () => void
  children: ReactNode
  utama?: boolean
  nonaktif?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={nonaktif}
      className={`${DASAR} ${
        utama
          ? 'bg-brand text-ink hover:bg-white'
          : 'border border-garis bg-transparent text-teks hover:border-redup'
      } ${className}`}
    >
      {children}
    </button>
  )
}
