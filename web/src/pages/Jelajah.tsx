import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { api } from '../api/client'
import { KepalaHalaman } from '../components/KepalaHalaman'
import { Galat, Kosong, Memuat } from '../components/Status'
import { StripWarna } from '../components/StripWarna'
import { daftarHex } from '../utils/warna'

const SEMUA = 'semua'

/**
 * Daftar seluruh palet kurasi dari semua tema.
 *
 * Halaman tema hanya menampilkan satu tema. Di sini pengguna bisa membandingkan
 * palet antar tema, lalu menyaring sesuai yang sedang dicari.
 */
export function Jelajah() {
  const [tema, setTema] = useState(SEMUA)

  const daftarTema = useQuery({ queryKey: ['tema'], queryFn: api.daftarTema })
  const palet = useQuery({ queryKey: ['semua-palet'], queryFn: api.semuaPalet })

  const tersaring = palet.data?.filter((item) => tema === SEMUA || item.tema === tema) ?? []

  return (
    <div>
      <KepalaHalaman
        judul="Jelajah"
        keterangan="Seluruh palet contoh dari sepuluh tema, dalam satu daftar."
      />

      <div className="geser-sentuh mb-4 flex gap-1.5 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setTema(SEMUA)}
          aria-pressed={tema === SEMUA}
          className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
            tema === SEMUA
              ? 'border-brand bg-brand/10 text-white'
              : 'border-garis bg-panel/40 text-redup hover:border-redup hover:text-teks'
          }`}
        >
          Semua
        </button>

        {daftarTema.data?.map((item) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => setTema(item.slug)}
            aria-pressed={tema === item.slug}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              tema === item.slug
                ? 'border-brand bg-brand/10 text-white'
                : 'border-garis bg-panel/40 text-redup hover:border-redup hover:text-teks'
            }`}
          >
            {item.nama}
          </button>
        ))}
      </div>

      {palet.isPending && <Memuat pesan="Memuat palet" />}
      {palet.isError && (
        <Galat pesan={(palet.error as Error).message} ulangi={() => void palet.refetch()} />
      )}

      {palet.data && tersaring.length === 0 && (
        <Kosong
          judul="Belum ada palet"
          pesan="Tema ini belum punya palet contoh. Coba pilih tema lain."
        />
      )}

      {tersaring.length > 0 && (
        <>
          <p className="mb-2.5 text-xs text-redup">{tersaring.length} palet</p>

          <ul className="space-y-2.5">
            {tersaring.map((item) => (
              <li key={item.id}>
                <Link
                  to={`/palet/${item.id}`}
                  state={{ dari: '/jelajah' }}
                  className="block rounded-2xl border border-garis bg-panel/60 p-3 transition hover:border-brand/60"
                >
                  <StripWarna warna={daftarHex(item)} tinggi="h-12" />
                  <div className="mt-2.5 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{item.nama}</p>
                      <p className="mt-0.5 text-[11px] text-redup">
                        {item.tema_nama} · {item.harmoni_nama}
                      </p>
                    </div>
                    <span className="tautan shrink-0 text-[11px] font-medium text-teks">
                      Detail
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
