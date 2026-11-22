interface Props {
  warna: string[]
  tinggi?: string
  className?: string
  bulat?: string
}

export function StripWarna({
  warna,
  tinggi = 'h-12',
  className = '',
  bulat = 'rounded-xl',
}: Props) {
  return (
    <div className={`flex overflow-hidden ${tinggi} ${bulat} ${className}`} aria-hidden="true">
      {warna.map((hex, indeks) => (
        <span key={`${hex}-${indeks}`} className="flex-1" style={{ backgroundColor: hex }} />
      ))}
    </div>
  )
}
