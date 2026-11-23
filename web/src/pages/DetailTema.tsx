import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'

import { api } from '../api/client'
import { KepalaHalaman } from '../components/KepalaHalaman'
import { LencanaKontras, PilSkor } from '../components/LencanaKontras'
import { Galat, Kosong, Memuat } from '../components/Status'
import { StripWarna } from '../components/StripWarna'
import { TautanUtama } from '../components/Tombol'
import { daftarHex } from '../utils/warna'

export function DetailTema() {
  const { slug = '' } = useParams()

  const tema = useQuery({
    queryKey: ['tema', slug],
    queryFn: () => api.detailTema(slug),
    enabled: slug.length > 0,
  })

  const palet = useQuery({
    queryKey: ['palet-tema', slug],
    queryFn: () => api.paletTema(slug),
    enabled: slug.length > 0,
  })

  if (tema.isPending) {
    return <Memuat pesan="Memuat detail tema" />
  }

  if (tema.isError) {
    return (
      <>
        <KepalaHalaman judul="Tema tidak terbuka" kembali={{ ke: '/', label: 'Beranda' }} />
        <Galat pesan={(tema.error as Error).message} ulangi={() => void tema.refetch()} />
      </>
    )
  }

  return (
    <div>
      <KepalaHalaman
        judul={tema.data.nama}
        keterangan={tema.data.deskripsi}
        kembali={{ ke: '/', label: 'Beranda' }}
      />

      <div className="mb-5 flex flex-wrap gap-1.5">
        {tema.data.kataKunci.map((kata) => (
          <span
            key={kata}
            className="rounded-full border border-garis bg-panel/60 px-2.5 py-1 text-[11px] text-redup"
          >
            {kata}
          </span>
        ))}
        <span className="rounded-full border border-garis bg-panel/60 px-2.5 py-1 text-[11px] font-medium text-redup">
          {tema.data.gelap ? 'tema gelap' : 'tema terang'}
        </span>
      </div>

      <TautanUtama to={`/generator?tema=${tema.data.slug}`} className="mb-4 w-full">
        Buat palet baru dari tema ini
      </TautanUtama>

      <details className="mb-5 rounded-xl border border-garis bg-panel/40 px-3 py-2">
        <summary className="cursor-pointer list-none text-[11px] font-medium text-redup [&::-webkit-details-marker]:hidden">
          Cara membaca angka di kartu
        </summary>
        <p className="mt-1.5 text-[11px] leading-relaxed text-redup">
          Angka seperti <span className="text-teks">16,3 : 1</span> adalah perbedaan terang antara
          teks dan latarnya. Semakin besar, semakin mudah dibaca. Nilai 4,5 ke atas sudah aman.
          Label <span className="text-teks">6/6</span> berarti keenam pasangan warna lolos uji.
        </p>
      </details>

      <section aria-labelledby="judul-palet">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 id="judul-palet" className="text-base font-semibold">
            Palet kurasi
          </h2>
          {palet.data && <span className="text-xs text-redup">{palet.data.length} palet</span>}
        </div>

        {palet.isPending && <Memuat pesan="Memuat palet" />}
        {palet.isError && (
          <Galat pesan={(palet.error as Error).message} ulangi={() => void palet.refetch()} />
        )}

        {palet.data && palet.data.length === 0 && (
          <Kosong
            judul="Belum ada palet kurasi"
            pesan="Tema ini belum memiliki palet contoh. Buat palet sendiri lewat Generator."
          />
        )}

        <ul className="space-y-2.5">
          {palet.data?.map((item) => (
            <li key={item.id}>
              <Link
                to={`/palet/${item.id}`}
                state={{ dari: `/tema/${slug}` }}
                className="block rounded-2xl border border-garis bg-panel/60 p-3 transition hover:border-brand/60 hover:bg-panel"
              >
                <StripWarna warna={daftarHex(item)} tinggi="h-11" />
                <div className="mt-2.5 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{item.nama}</p>
                    <p className="mt-0.5 text-[11px] text-redup">Harmoni {item.harmoni_nama}</p>
                  </div>
                  <PilSkor
                    skor={item.ringkasan.skor_aksesibilitas}
                    total={item.pasangan_kontras.length}
                  />
                </div>
                <div className="mt-2.5 flex items-center justify-between border-t border-garis/70 pt-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <LencanaKontras
                      nilai={item.ringkasan.teks_lolos_aa ? 'AA' : 'Gagal'}
                      rasio={item.ringkasan.rasio_teks_terendah}
                    />
                    <span className="text-[11px] text-redup">teks paling sulit dibaca</span>
                  </div>
                  <span className="tautan text-[11px] font-medium text-teks">Detail</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
