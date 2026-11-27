import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import { api } from '../api/client'
import { KepalaHalaman } from '../components/KepalaHalaman'
import { PratinjauPalet } from '../components/PratinjauPalet'
import { Galat, Memuat } from '../components/Status'
import { TautanGaris, TombolAksi } from '../components/Tombol'
import { TombolSalin } from '../components/TombolSalin'
import { hapusPalet, simpanPalet, useKoleksi } from '../hooks/useKoleksi'
import { daftarHex, KETERANGAN_PERAN, LABEL_PERAN } from '../utils/warna'

export function DetailPalet() {
  const { id = '' } = useParams()
  const koleksi = useKoleksi()
  const tersimpan = koleksi.find((item) => item.id === id) ?? null

  const kueri = useQuery({
    queryKey: ['palet', id],
    queryFn: () => api.detailPalet(id),
    enabled: id.length > 0 && tersimpan === null,
    retry: false,
  })

  const palet = tersimpan ?? kueri.data

  if (!palet) {
    if (kueri.isPending && id.length > 0) {
      return <Memuat pesan="Memuat detail palet" />
    }

    return (
      <>
        <KepalaHalaman judul="Palet tidak ditemukan" kembali={{ ke: '/', label: 'Beranda' }} />
        <Galat
          pesan={
            (kueri.error as Error | null)?.message ??
            'Palet ini tidak tersimpan di server. Palet hasil generator hanya bisa dibuka kembali setelah disimpan ke koleksi.'
          }
          ulangi={() => void kueri.refetch()}
        />
        <div className="mt-3">
          <TautanGaris to="/generator">Buka Generator</TautanGaris>
        </div>
      </>
    )
  }

  const sudahTersimpan = koleksi.some((item) => item.id === palet.id)

  return (
    <div>
      <KepalaHalaman
        judul={palet.nama}
        keterangan={`Tema ${palet.tema_nama} dengan harmoni ${palet.harmoni_nama}.`}
        kembali={{ ke: `/tema/${palet.tema}`, label: `Tema ${palet.tema_nama}` }}
      />

      <section aria-label="Pratinjau palet" className="mb-6">
        <PratinjauPalet palet={palet} />

        <div className="mt-3 flex justify-end">
          <TombolAksi
            onClick={() => (sudahTersimpan ? hapusPalet(palet.id) : simpanPalet(palet))}
            utama={!sudahTersimpan}
            className="min-h-9 px-3 text-xs"
          >
            {sudahTersimpan ? 'Hapus dari koleksi' : 'Simpan ke koleksi'}
          </TombolAksi>
        </div>
      </section>

      <section aria-labelledby="judul-peran" className="mb-6">
        <h2 id="judul-peran" className="mb-2.5 text-sm font-semibold">
          Lima peran warna
        </h2>
        <ul className="space-y-2">
          {palet.warna.map((warna) => (
            <li
              key={warna.peran}
              className="flex items-center gap-3 rounded-xl border border-garis bg-panel/50 p-2.5"
            >
              <span
                className="size-10 shrink-0 rounded-lg ring-1 ring-white/15"
                style={{ backgroundColor: warna.hex }}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold">{LABEL_PERAN[warna.peran]}</p>
                <p className="truncate text-[11px] text-redup">{KETERANGAN_PERAN[warna.peran]}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <code className="font-mono text-[11px] text-teks">{warna.hex}</code>
                <TombolSalin teks={warna.hex} label="Salin" className="min-h-7 px-2 text-[10px]" />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="judul-kode">
        <h2 id="judul-kode" className="mb-2.5 text-sm font-semibold">
          Semua kode warna
        </h2>
        <p className="mb-2 font-mono text-[10px] leading-relaxed text-redup">
          {daftarHex(palet).join(' · ')}
        </p>
        <TombolSalin
          teks={daftarHex(palet).join(', ')}
          label="Salin semua kode"
          className="min-h-10"
        />
      </section>
    </div>
  )
}
