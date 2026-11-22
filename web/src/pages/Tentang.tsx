import { LogoCv } from '../components/Ikon'
import { KONFIGURASI } from '../konfigurasi'

const TEKNOLOGI = [
  { nama: 'React 19', isi: 'Antarmuka berbasis komponen' },
  { nama: 'TypeScript', isi: 'Tipe statis pada seluruh kode' },
  { nama: 'Vite', isi: 'Bundler dan server pengembangan' },
  { nama: 'Tailwind CSS 4', isi: 'Sistem utilitas tampilan' },
  { nama: 'React Router', isi: 'Navigasi antar halaman' },
  { nama: 'TanStack Query', isi: 'Cache dan status permintaan' },
  { nama: 'vite-plugin-pwa', isi: 'Manifest dan service worker' },
  { nama: 'Express', isi: 'REST API di sisi server' },
  { nama: 'Supabase', isi: 'Basis data Postgres palet kurasi' },
  { nama: 'OKLCH', isi: 'Ruang warna untuk harmoni' },
]

const ENDPOINT = [
  { metode: 'GET', jalur: '/api/v1/themes', isi: 'Daftar tema' },
  { metode: 'GET', jalur: '/api/v1/themes/:slug/palettes', isi: 'Palet per tema' },
  { metode: 'GET', jalur: '/api/v1/palettes/generate', isi: 'Buat palet baru' },
  { metode: 'GET', jalur: '/api/v1/palettes/:id', isi: 'Detail palet' },
]

const LANGKAH = [
  'Pilih warna primer pada halaman Generator, atau pakai salah satu saran warna tema.',
  'Tentukan tema untuk membatasi chroma dan rencana lightness.',
  'Pilih skema harmoni untuk menentukan jarak hue warna aksen.',
  'Tekan Simpan pada hasil yang cocok, lalu buka lewat tab Koleksi.',
]

export function Tentang() {
  return (
    <div className="space-y-7">
      <header>
        <div className="flex items-center gap-2.5">
          <LogoCv />
          <span className="text-sm font-semibold tracking-tight">{KONFIGURASI.namaAplikasi}</span>
          <span className="rounded-full border border-garis px-2 py-0.5 text-[10px] text-redup">
            v{KONFIGURASI.versi}
          </span>
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight">Tentang aplikasi</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-redup">{KONFIGURASI.tagline}</p>
      </header>

      <section aria-labelledby="tentang-ide">
        <h2 id="tentang-ide" className="mb-2 text-sm font-semibold">
          Ide dasar
        </h2>
        <p className="text-sm leading-relaxed text-redup">
          Pemilih warna biasa memberi satu warna tanpa memberi kepastian apakah warna itu terbaca.
          ChromaVibe bekerja sebaliknya. Warna primer diperlakukan sebagai jangkar <em>hue</em>,
          tema menerjemahkan kata sifat estetika menjadi batas <em>chroma</em> dan rencana{' '}
          <em>lightness</em>, lalu setiap pasangan teks dan latar diuji dengan rumus kontras WCAG.
          Perhitungan dilakukan pada ruang warna OKLCH karena jarak terangnya sejalan dengan
          persepsi mata, bukan pada HSL yang menipu di <em>hue</em> kuning dan biru.
        </p>
      </section>

      <section aria-labelledby="tentang-praktikan">
        <h2 id="tentang-praktikan" className="mb-2 text-sm font-semibold">
          Penyusun
        </h2>
        <dl className="divide-y divide-garis overflow-hidden rounded-2xl border border-garis bg-panel/50 text-xs">
          {[
            ['Nama', KONFIGURASI.praktikan],
            ['NIM', KONFIGURASI.nim],
            ['Kelompok', `${KONFIGURASI.kelompok} / Shift ${KONFIGURASI.shift}`],
            ['Mata kuliah', KONFIGURASI.mataKuliah],
            ['Institusi', KONFIGURASI.institusi],
          ].map(([label, nilai]) => (
            <div key={label} className="px-3.5 py-2.5">
              <dt className="text-[10px] uppercase tracking-wider text-redup">{label}</dt>
              <dd className="mt-0.5 font-medium leading-snug break-words">{nilai}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="tentang-teknologi">
        <h2 id="tentang-teknologi" className="mb-2 text-sm font-semibold">
          Dibangun dengan
        </h2>
        <ul className="grid grid-cols-2 gap-2">
          {TEKNOLOGI.map((item) => (
            <li key={item.nama} className="rounded-xl border border-garis bg-panel/40 p-2.5">
              <p className="text-xs font-semibold">{item.nama}</p>
              <p className="mt-0.5 text-[10px] leading-relaxed text-redup">{item.isi}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="tentang-api">
        <h2 id="tentang-api" className="mb-2 text-sm font-semibold">
          API yang dipakai
        </h2>
        <div className="rounded-2xl border border-garis bg-panel/50 p-3">
          <p className="break-all font-mono text-[10px] text-brand">{KONFIGURASI.urlApi}</p>
          <ul className="mt-2.5 space-y-1.5">
            {ENDPOINT.map((item) => (
              <li key={item.jalur} className="flex items-baseline gap-2">
                <span className="rounded bg-panel-2 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-redup">
                  {item.metode}
                </span>
                <code className="min-w-0 flex-1 break-all font-mono text-[10px] text-teks/90">
                  {item.jalur}
                </code>
                <span className="shrink-0 text-[10px] text-redup">{item.isi}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="tentang-pakai">
        <h2 id="tentang-pakai" className="mb-2 text-sm font-semibold">
          Cara pakai
        </h2>
        <ol className="space-y-2">
          {LANGKAH.map((langkah, indeks) => (
            <li key={langkah} className="flex gap-2.5 text-xs leading-relaxed text-redup">
              <span className="font-mono text-[10px] font-semibold text-brand">
                {String(indeks + 1).padStart(2, '0')}
              </span>
              {langkah}
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="tentang-tautan">
        <h2 id="tentang-tautan" className="mb-2 text-sm font-semibold">
          Tautan
        </h2>
        <a
          href={KONFIGURASI.repoGithub}
          target="_blank"
          rel="noreferrer noopener"
          className="flex items-center justify-between rounded-xl border border-garis bg-panel/50 px-3.5 py-3 text-xs font-medium transition hover:border-brand/60 hover:text-white"
        >
          Repositori GitHub
          <span className="text-redup">buka</span>
        </a>
        <p className="mt-2 text-[10px] leading-relaxed text-redup">
          Aplikasi ini adalah PWA, jadi bisa dipasang ke layar utama lewat menu browser. Palet
          favorit tidak dikirim ke server, hanya disimpan di perangkat.
        </p>
      </section>

      <footer className="pb-2 text-center text-[10px] text-redup">
        {KONFIGURASI.namaAplikasi} v{KONFIGURASI.versi} · {KONFIGURASI.institusi}
      </footer>
    </div>
  )
}
