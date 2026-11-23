import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import { api } from '../api/client'
import { KepalaHalaman } from '../components/KepalaHalaman'
import { LencanaKontras, PilSkor } from '../components/LencanaKontras'
import { PratinjauPalet } from '../components/PratinjauPalet'
import { Galat, Memuat } from '../components/Status'
import { TautanGaris, TombolAksi } from '../components/Tombol'
import { TombolSalin } from '../components/TombolSalin'
import { hapusPalet, simpanPalet, useKoleksi } from '../hooks/useKoleksi'
import { daftarHex, hexKeCss, hexKeTailwind, KETERANGAN_PERAN, LABEL_PERAN } from '../utils/warna'

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

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <PilSkor
              skor={palet.ringkasan.skor_aksesibilitas}
              total={palet.pasangan_kontras.length}
            />
            <span className="text-[11px] text-redup">pasangan aman dibaca</span>
          </div>
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

      <section aria-labelledby="judul-kontras" className="mb-6">
        <h2 id="judul-kontras" className="mb-2.5 text-sm font-semibold">
          Apakah warnanya mudah dibaca?
        </h2>
        <p className="mb-2.5 text-[11px] leading-relaxed text-redup">
          Setiap baris menguji satu pasangan: warna teks di atas warna latarnya. Angka di kanan
          menunjukkan seberapa berbeda tingkat terang keduanya. Semakin besar, semakin jelas tulisan
          terbaca. Angka 4,5 ke atas sudah aman untuk teks biasa.
        </p>
        <ul className="space-y-1.5">
          {palet.pasangan_kontras.map((pasangan) => (
            <li
              key={`${pasangan.peran_depan}-${pasangan.peran_belakang}`}
              className="flex items-center justify-between gap-2 rounded-xl border border-garis bg-panel/40 p-2.5"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="flex shrink-0 -space-x-1.5" aria-hidden="true">
                  <span
                    className="size-6 rounded-full ring-2 ring-panel"
                    style={{ backgroundColor: pasangan.depan }}
                  />
                  <span
                    className="size-6 rounded-full ring-2 ring-panel"
                    style={{ backgroundColor: pasangan.belakang }}
                  />
                </span>
                <span className="truncate text-[11px] text-redup">
                  {LABEL_PERAN[pasangan.peran_depan]} di atas{' '}
                  {LABEL_PERAN[pasangan.peran_belakang].toLowerCase()}
                </span>
              </div>
              <LencanaKontras nilai={pasangan.nilai} rasio={pasangan.rasio} />
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[10px] leading-relaxed text-redup">
          Patokan yang dipakai: 4,5 banding 1 untuk teks biasa dan 3 banding 1 untuk tombol serta
          batas komponen. Ini mengikuti pedoman keterbacaan WCAG 2.1.
        </p>
      </section>

      <section aria-labelledby="judul-ekspor">
        <h2 id="judul-ekspor" className="mb-2.5 text-sm font-semibold">
          Ekspor
        </h2>
        <div className="grid grid-cols-2 gap-2">
          <TombolSalin teks={hexKeCss(palet)} label="Salin CSS" className="min-h-11" />
          <TombolSalin teks={hexKeTailwind(palet)} label="Salin Tailwind" className="min-h-11" />
        </div>
        <p className="mt-2 font-mono text-[10px] leading-relaxed text-redup">
          {daftarHex(palet).join(' · ')}
        </p>
      </section>
    </div>
  )
}
