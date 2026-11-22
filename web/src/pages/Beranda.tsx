import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

import { api } from '../api/client'
import { LogoCv } from '../components/Ikon'
import { Galat, Memuat } from '../components/Status'
import { StripWarna } from '../components/StripWarna'
import { TautanUtama } from '../components/Tombol'
import { KONFIGURASI } from '../konfigurasi'

const LANGKAH = [
  {
    nomor: '01',
    judul: 'Tentukan warna primer',
    isi: 'Ambil satu warna dari color picker atau ketik kode hex. Warna ini menjadi jangkar hue seluruh palet.',
  },
  {
    nomor: '02',
    judul: 'Pilih tema dan harmoni',
    isi: 'Tema membatasi chroma dan rencana lightness. Harmoni menentukan jarak hue untuk warna aksen.',
  },
  {
    nomor: '03',
    judul: 'Baca hasil uji kontras',
    isi: 'Setiap pasangan teks dan latar diberi nilai AA atau AAA. Palet yang belum lolos digeser kecerahannya sampai memenuhi ambang.',
  },
]

export function Beranda() {
  const tema = useQuery({ queryKey: ['tema'], queryFn: api.daftarTema })

  return (
    <div className="space-y-9">
      <header>
        <div className="flex items-center gap-2.5">
          <LogoCv />
          <span className="text-sm font-semibold tracking-tight">{KONFIGURASI.namaAplikasi}</span>
          <span className="rounded-full border border-garis px-2 py-0.5 text-[10px] font-medium tracking-wide text-redup">
            PWA
          </span>
        </div>

        <h1 className="mt-6 text-[28px] font-semibold leading-[1.15] tracking-tight">
          Satu warna primer,
          <br />
          satu tema, lima peran.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-redup">
          Pilih warna dan tema, sisanya dihitung. Lima peran warna disusun dari satu jangkar hue,
          lalu setiap pasangan teks dan latar diuji dengan ambang kontras WCAG sebelum palet
          ditampilkan.
        </p>

        <div className="mt-5 flex flex-wrap gap-2.5">
          <TautanUtama to="/generator">Mulai dari Generator</TautanUtama>
          <Link
            to="/tentang"
            className="inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-medium text-redup transition hover:text-teks"
          >
            Cara kerja
          </Link>
        </div>
      </header>

      <section aria-labelledby="judul-tema">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 id="judul-tema" className="text-base font-semibold">
            Tema
          </h2>
          {tema.data && <span className="text-xs text-redup">{tema.data.length} tema</span>}
        </div>

        {tema.isPending && <Memuat pesan="Memuat daftar tema" />}
        {tema.isError && (
          <Galat pesan={(tema.error as Error).message} ulangi={() => void tema.refetch()} />
        )}

        {tema.data && (
          <ul className="grid grid-cols-2 gap-3">
            {tema.data.map((item) => (
              <li key={item.slug}>
                <Link
                  to={`/tema/${item.slug}`}
                  className="group block h-full overflow-hidden rounded-2xl border border-garis bg-panel/60 transition hover:border-brand/60 hover:bg-panel"
                >
                  <StripWarna warna={item.saran_base} tinggi="h-16" bulat="rounded-none" />
                  <div className="p-3">
                    <p className="text-sm font-semibold">{item.nama}</p>
                    <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-redup">
                      {item.deskripsi}
                    </p>
                    <p className="mt-2.5 text-[10px] font-medium uppercase tracking-wider text-redup">
                      {item.jumlah_palet} palet
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="judul-cara">
        <h2 id="judul-cara" className="mb-3 text-base font-semibold">
          Tiga langkah
        </h2>
        <ol className="space-y-2.5">
          {LANGKAH.map((langkah) => (
            <li
              key={langkah.nomor}
              className="flex gap-3 rounded-2xl border border-garis bg-panel/40 p-3.5"
            >
              <span className="font-mono text-xs font-semibold text-brand">{langkah.nomor}</span>
              <div>
                <p className="text-sm font-medium">{langkah.judul}</p>
                <p className="mt-1 text-xs leading-relaxed text-redup">{langkah.isi}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <footer className="pb-2 text-center text-[10px] text-redup">
        {KONFIGURASI.namaAplikasi} versi {KONFIGURASI.versi} · {KONFIGURASI.mataKuliah}
      </footer>
    </div>
  )
}
