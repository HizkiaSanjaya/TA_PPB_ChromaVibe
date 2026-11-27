import { useQueries, useQuery } from '@tanstack/react-query'

import { api } from '../api/client'
import { KepalaHalaman } from '../components/KepalaHalaman'
import { PratinjauPalet } from '../components/PratinjauPalet'
import { RodaWarna, bacaHarmoni } from '../components/RodaWarna'
import { Galat, Memuat } from '../components/Status'
import { TombolSalin } from '../components/TombolSalin'
import { ambilHex, hexKeCss, KETERANGAN_PERAN, LABEL_PERAN } from '../utils/warna'

// Satu warna dasar dipakai untuk semua contoh harmoni, supaya bedanya murni
// berasal dari harmoni, bukan dari warna yang berbeda.
const CONTOH_BASE = '#E53935'
const CONTOH_TEMA = 'brutalism'

// Empat tema dengan watak paling berlawanan, dipakai untuk memperlihatkan bahwa
// tema membatasi seberapa pekat warna boleh tampil. Kalimat ringkasnya adalah
// parafrase dari `deskripsi` di api/src/lib/palette/themes.js.
const TEMA_BANDING = [
  { slug: 'brutalism', nama: 'Brutalism', ringkas: 'Warna dibiarkan pekat dan berteriak.' },
  { slug: 'elegant', nama: 'Elegant', ringkas: 'Warna ditahan pucat, kesannya tenang dan mahal.' },
  {
    slug: 'cyberpunk',
    nama: 'Cyberpunk',
    ringkas: 'Latar gelap, warna kedua menyala seperti neon.',
  },
  {
    slug: 'minimalis',
    nama: 'Minimalis',
    ringkas: 'Hampir tanpa warna, bedanya hanya terang dan gelap.',
  },
]

/**
 * Halaman Panduan: menjelaskan arti lima warna dan enam harmoni, memakai
 * contoh yang benar-benar dihitung oleh API, bukan gambar statis.
 */
export function Panduan() {
  const harmoni = useQuery({ queryKey: ['harmoni'], queryFn: api.daftarHarmoni })

  const contoh = useQueries({
    queries: (harmoni.data ?? []).map((item) => ({
      queryKey: ['panduan-harmoni', item.slug],
      queryFn: () =>
        api.buatPalet({
          base: CONTOH_BASE,
          tema: CONTOH_TEMA,
          harmoni: item.slug,
          jumlah: 1,
          seed: 1,
        }),
    })),
  })

  // Harmoni dikunci supaya yang berbeda antar kartu hanya temanya.
  const banding = useQueries({
    queries: TEMA_BANDING.map((item) => ({
      queryKey: ['panduan-tema', item.slug],
      queryFn: () =>
        api.buatPalet({
          base: CONTOH_BASE,
          tema: item.slug,
          harmoni: 'komplementer',
          jumlah: 1,
          seed: 1,
        }),
    })),
  })

  const paletContoh = contoh[0]?.data?.palet[0] ?? null

  return (
    <div className="space-y-7">
      <KepalaHalaman
        judul="Panduan"
        keterangan="Arti lima warna, cara memakainya, bedanya tema, dan bedanya enam harmoni."
      />

      <section aria-labelledby="judul-peran">
        <h2 id="judul-peran" className="mb-2.5 text-base font-semibold">
          Lima warna dan tugasnya
        </h2>
        <ul className="space-y-1.5">
          {(['background', 'surface', 'base', 'accent', 'text'] as const).map((peran) => (
            <li
              key={peran}
              className="flex items-center gap-2.5 rounded-lg border border-garis bg-panel/40 p-2"
            >
              <span
                aria-hidden="true"
                className="size-7 shrink-0 rounded ring-1 ring-white/20"
                style={{
                  backgroundColor: paletContoh ? ambilHex(paletContoh, peran) : '#777',
                }}
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold">{LABEL_PERAN[peran]}</p>
                <p className="text-[10px] leading-snug text-redup">{KETERANGAN_PERAN[peran]}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="judul-pakai">
        <h2 id="judul-pakai" className="mb-1 text-base font-semibold">
          Cara memakainya
        </h2>
        <p className="mb-2.5 text-xs leading-relaxed text-redup">
          Salin kode di bawah ke berkas CSS, lalu panggil namanya dengan{' '}
          <code className="text-teks">var(--warna-base)</code> untuk warna utama, atau{' '}
          <code className="text-teks">var(--warna-text)</code> untuk tulisan.
        </p>

        {(() => {
          if (contoh.some((item) => item.isPending)) return <Memuat pesan="Menyiapkan contoh" />
          if (!paletContoh) {
            return (
              <Galat
                pesan={(contoh[0]?.error as Error | undefined)?.message ?? 'Contoh gagal dimuat.'}
                ulangi={() => void contoh[0]?.refetch()}
              />
            )
          }

          const kode = hexKeCss(paletContoh)

          return (
            <div className="rounded-xl border border-garis bg-panel/40 p-2.5">
              <pre className="overflow-x-auto text-[10px] leading-relaxed text-redup">
                <code>{kode}</code>
              </pre>
              <TombolSalin
                teks={kode}
                label="Salin CSS"
                className="mt-2 min-h-8 px-2 text-[10px]"
              />
            </div>
          )
        })()}
      </section>

      <section aria-labelledby="judul-tema">
        <h2 id="judul-tema" className="mb-1 text-base font-semibold">
          Tema mengubah kepekatan warna
        </h2>
        <p className="mb-2.5 text-xs leading-relaxed text-redup">
          Empat contoh di bawah memakai warna dasar merah yang sama. Yang berubah hanya batas
          kepekatan dan kecerahannya, jadi kelihatan bahwa tema yang menentukan seberapa keras warna
          boleh tampil.
        </p>

        <ul className="grid gap-2 sm:grid-cols-2">
          {TEMA_BANDING.map((item, urutan) => {
            const palet = banding[urutan]?.data?.palet[0]
            const gagal = banding[urutan]?.isError

            return (
              <li key={item.slug} className="rounded-xl border border-garis bg-panel/40 p-2.5">
                {palet ? (
                  <PratinjauPalet palet={palet} ringkas />
                ) : (
                  <div className="flex h-[104px] items-center justify-center rounded-xl border border-garis text-[10px] text-redup">
                    {gagal ? 'Gagal dimuat' : 'Menyiapkan…'}
                  </div>
                )}
                <p className="mt-2 text-xs font-semibold">{item.nama}</p>
                <p className="mt-0.5 text-[10px] leading-snug text-redup">{item.ringkas}</p>
              </li>
            )
          })}
        </ul>
      </section>

      <section aria-labelledby="judul-harmoni">
        <h2 id="judul-harmoni" className="mb-1 text-base font-semibold">
          Enam harmoni
        </h2>
        <p className="mb-2.5 text-xs leading-relaxed text-redup">
          Semua contoh memakai warna dasar merah yang sama. Yang berubah hanya warna keduanya, jadi
          perbedaan tiap harmoni terlihat langsung.
        </p>

        {harmoni.isPending && <Memuat pesan="Memuat harmoni" />}
        {harmoni.isError && (
          <Galat pesan={(harmoni.error as Error).message} ulangi={() => void harmoni.refetch()} />
        )}

        {harmoni.data && (
          <ul className="space-y-2">
            {harmoni.data.map((item, urutan) => {
              const palet = contoh[urutan]?.data?.palet[0]
              const saatMemuat = contoh[urutan]?.isPending

              return (
                <li
                  key={item.slug}
                  className="flex items-start gap-3 rounded-xl border border-garis bg-panel/40 p-2.5"
                >
                  {palet ? (
                    <RodaWarna palet={palet} ukuran={64} />
                  ) : (
                    <span className="size-16 shrink-0 rounded-full border border-garis" />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold">{item.nama}</p>
                    <p className="mt-0.5 text-[10px] leading-snug text-redup">{item.deskripsi}</p>
                    <p className="mt-1 text-[10px] leading-snug text-redup">
                      {palet ? bacaHarmoni(palet) : saatMemuat ? 'Menghitung…' : '—'}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <p className="rounded-xl border border-garis bg-panel/40 px-3 py-2 text-[10px] leading-relaxed text-redup">
        Butuh palet sendiri? Buka tab Generator, pilih warna dan tema, lalu simpan yang cocok ke
        Koleksi.
      </p>
    </div>
  )
}
