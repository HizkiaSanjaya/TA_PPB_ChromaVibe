import { TautanGaris, TautanUtama } from '../components/Tombol'

export function TidakDitemukan() {
  return (
    <div className="pt-10">
      <p className="font-mono text-xs text-brand">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Halaman tidak ditemukan</h1>
      <p className="mt-1.5 text-sm leading-relaxed text-redup">
        Alamat ini tidak cocok dengan halaman mana pun di ChromaVibe. Kembali ke beranda, atau
        langsung susun palet baru.
      </p>

      <div className="mt-5 flex flex-wrap gap-2.5">
        <TautanUtama to="/">Ke Beranda</TautanUtama>
        <TautanGaris to="/generator">Buka Generator</TautanGaris>
      </div>
    </div>
  )
}
