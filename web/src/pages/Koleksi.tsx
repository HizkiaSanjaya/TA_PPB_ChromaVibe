import { Link } from 'react-router-dom'

import { Kosong } from '../components/Status'
import { StripWarna } from '../components/StripWarna'
import { TautanUtama } from '../components/Tombol'
import { hapusPalet, useKoleksi } from '../hooks/useKoleksi'
import { daftarHex } from '../utils/warna'

export function Koleksi() {
  const koleksi = useKoleksi()

  return (
    <div>
      <header className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight">Koleksi</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-redup">
          Palet yang kamu simpan disimpan di perangkat ini lewat <code>localStorage</code>, jadi
          tetap tersedia tanpa akun dan tanpa koneksi.
        </p>
      </header>

      {koleksi.length === 0 ? (
        <>
          <Kosong
            judul="Belum ada palet tersimpan"
            pesan="Buka Generator atau halaman detail palet, lalu tekan tombol Simpan."
          />
          <div className="mt-3">
            <TautanUtama to="/generator" className="w-full">
              Buka Generator
            </TautanUtama>
          </div>
        </>
      ) : (
        <>
          <ul className="space-y-2.5">
            {koleksi.map((palet) => (
              <li
                key={palet.id}
                className="rounded-2xl border border-garis bg-panel/60 p-3 transition hover:border-brand/50"
              >
                <Link to={`/palet/${palet.id}`} className="block">
                  <StripWarna warna={daftarHex(palet)} tinggi="h-14" />
                  <div className="mt-2.5 min-w-0">
                    <p className="truncate text-sm font-semibold">{palet.nama}</p>
                    <p className="mt-0.5 text-[11px] text-redup">
                      {palet.tema_nama} · {palet.harmoni_nama}
                    </p>
                  </div>
                </Link>

                <div className="mt-2.5 flex items-center justify-between border-t border-garis/70 pt-2">
                  <Link
                    to={`/palet/${palet.id}`}
                    className="tautan text-[11px] font-medium text-teks"
                  >
                    Buka detail
                  </Link>
                  <button
                    type="button"
                    onClick={() => hapusPalet(palet.id)}
                    className="min-h-8 rounded-lg px-2 text-[11px] font-medium text-rose-300 transition hover:bg-rose-500/10"
                  >
                    Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-3 text-[11px] text-redup">
            {koleksi.length} palet tersimpan di perangkat ini.
          </p>
        </>
      )}
    </div>
  )
}
