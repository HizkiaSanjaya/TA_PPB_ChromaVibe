import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

import { api } from '../api/client'
import { LogoCv } from '../components/Ikon'
import { KartuTema, warnaTema } from '../components/KartuTema'
import { Galat, Memuat } from '../components/Status'
import { TautanGaris, TautanUtama } from '../components/Tombol'
import { KONFIGURASI } from '../konfigurasi'

const LANGKAH = [
  {
    nomor: '01',
    judul: 'Pilih warna',
    isi: 'Ambil satu warna dari daftar nama, pemilih warna, atau ketik kodenya. Atur juga mau gelap atau terang.',
  },
  {
    nomor: '02',
    judul: 'Pilih tema',
    isi: 'Tema menentukan karakter: neon, lembut, mentah, atau klasik. Sepuluh pilihan, tinggal coba.',
  },
  {
    nomor: '03',
    judul: 'Pakai hasilnya',
    isi: 'Lima warna siap dipakai. Setiap tulisan dijamin terbaca, dan kodenya bisa disalin.',
  },
]

export function Beranda() {
  const tema = useQuery({ queryKey: ['tema'], queryFn: api.daftarTema })

  return (
    <div className="space-y-10">
      <header>
        <div className="flex items-center gap-2.5">
          <LogoCv />
          <span className="text-sm font-semibold tracking-tight">{KONFIGURASI.namaAplikasi}</span>
          <span className="rounded-full border border-garis px-2 py-0.5 text-[10px] font-medium tracking-wide text-redup">
            PWA
          </span>
        </div>

        <h1 className="mt-7 text-[32px] font-bold leading-[1.08] tracking-tight">
          Satu warna,
          <br />
          lima yang saling
          <br />
          <span className="relative inline-block">
            cocok.
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-1 -z-10 h-3 bg-brand/25"
            />
          </span>
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-redup">
          Pilih satu warna dan satu tema. ChromaVibe menyusun lima warna yang bekerja bersama, lalu
          memastikan setiap tulisan tetap terbaca di atasnya.
        </p>

        <div className="mt-5 flex flex-wrap gap-2.5">
          <TautanUtama to="/generator" className="flex-1 sm:flex-none">
            Coba Generator
          </TautanUtama>
          <TautanGaris to="/tentang">Cara kerja</TautanGaris>
        </div>
      </header>

      <section aria-labelledby="judul-tema">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 id="judul-tema" className="text-base font-semibold">
            Pilih tema
          </h2>
          <span className="text-xs text-redup">ketuk untuk melihat</span>
        </div>

        {tema.isPending && <Memuat pesan="Memuat daftar tema" />}
        {tema.isError && (
          <Galat pesan={(tema.error as Error).message} ulangi={() => void tema.refetch()} />
        )}

        {tema.data && (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {tema.data.map((item) => {
              const warna = warnaTema(item)
              if (!warna) return null

              return (
                <li key={item.slug}>
                  <Link
                    to={`/tema/${item.slug}`}
                    className="block overflow-hidden rounded-2xl border border-garis transition hover:-translate-y-0.5 hover:border-brand/60"
                  >
                    <KartuTema tema={item} warna={warna} />
                    <div className="bg-panel/60 p-3">
                      <p className="text-sm font-semibold">{item.nama}</p>
                      <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-redup">
                        {item.deskripsi}
                      </p>
                    </div>
                  </Link>
                </li>
              )
            })}
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
