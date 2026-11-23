import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

import { api } from '../api/client'
import { LogoCv } from '../components/Ikon'
import { PratinjauPalet } from '../components/PratinjauPalet'
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
    isi: 'Lima warna langsung bisa dipakai. Setiap tulisan dijamin terbaca, dan kodenya siap disalin.',
  },
]

/** Palet sorotan dipilih dari tanggal, jadi berganti sendiri tiap hari tanpa server tambahan. */
function indeksSorotan(jumlah: number) {
  const hari = Math.floor(Date.now() / 86_400_000)
  return jumlah > 0 ? hari % jumlah : 0
}

export function Beranda() {
  const tema = useQuery({ queryKey: ['tema'], queryFn: api.daftarTema })
  const temaSorotan = tema.data?.find((item) => item.slug === 'brutalism') ?? tema.data?.[0]

  const sorotan = useQuery({
    queryKey: ['palet-tema', temaSorotan?.slug],
    queryFn: () => api.paletTema(temaSorotan!.slug),
    enabled: Boolean(temaSorotan?.slug),
  })

  const paletSorotan = sorotan.data?.[indeksSorotan(sorotan.data.length)] ?? null

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

        <h1 className="mt-7 text-[34px] font-bold leading-[1.05] tracking-tight">
          Satu warna.
          <br />
          Lima yang
          <br />
          <span className="relative inline-block">
            saling cocok.
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

        {/* Contoh hasil langsung di beranda, supaya terlihat sebelum mencoba. */}
        {sorotan.data && paletSorotan && (
          <Link
            to={`/palet/${paletSorotan.id}`}
            className="mt-7 block rounded-2xl border border-garis bg-panel/50 p-3 transition hover:border-brand/50"
          >
            <div className="mb-2 flex items-baseline justify-between gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-redup">
                Contoh hasil
              </p>
              <p className="truncate font-mono text-[10px] text-redup">{paletSorotan.nama}</p>
            </div>
            <PratinjauPalet palet={paletSorotan} />
          </Link>
        )}
        {sorotan.isPending && temaSorotan && (
          <div className="mt-7">
            <Memuat pesan="Menyiapkan contoh" />
          </div>
        )}
      </header>

      <section aria-label="Ringkasan aplikasi">
        <dl className="grid grid-cols-3 gap-2">
          {[
            { angka: tema.data?.length ?? '—', label: 'tema' },
            {
              angka: tema.data ? tema.data.reduce((n, item) => n + item.jumlah_palet, 0) : '—',
              label: 'palet siap pakai',
            },
            { angka: '5', label: 'warna per palet' },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-garis bg-panel/40 px-2.5 py-3 text-center"
            >
              <dt className="text-xl font-bold tabular-nums">{item.angka}</dt>
              <dd className="mt-0.5 text-[10px] leading-tight text-redup">{item.label}</dd>
            </div>
          ))}
        </dl>
      </section>

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
          <ul className="grid grid-cols-2 gap-3">
            {tema.data.map((item) => (
              <li key={item.slug}>
                <Link
                  to={`/tema/${item.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-garis bg-panel/60 transition hover:-translate-y-0.5 hover:border-brand/60"
                >
                  <div className="flex h-20" aria-hidden="true">
                    {item.saran_base.map((hex) => (
                      <span key={hex} className="flex-1" style={{ backgroundColor: hex }} />
                    ))}
                  </div>
                  <div className="flex flex-1 flex-col p-3">
                    <p className="text-sm font-semibold">{item.nama}</p>
                    <p className="mt-1 line-clamp-2 flex-1 text-[11px] leading-relaxed text-redup">
                      {item.deskripsi}
                    </p>
                    <p className="mt-2 text-[10px] font-medium uppercase tracking-wider text-redup">
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

      <section
        aria-labelledby="judul-ajakan"
        className="rounded-2xl border border-garis bg-panel/60 p-4"
      >
        <h2 id="judul-ajakan" className="text-base font-semibold">
          Belum ada warna di kepala?
        </h2>
        <p className="mt-1.5 text-xs leading-relaxed text-redup">
          Mulai dari tema yang paling menarik, lalu ganti warnanya sampai cocok. Semua hasil tetap
          lolos uji keterbacaan.
        </p>
        <div className="mt-3">
          <TautanUtama to="/generator" className="w-full">
            Mulai dari Generator
          </TautanUtama>
        </div>
      </section>

      <footer className="pb-2 text-center text-[10px] text-redup">
        {KONFIGURASI.namaAplikasi} versi {KONFIGURASI.versi} · {KONFIGURASI.mataKuliah}
      </footer>
    </div>
  )
}
