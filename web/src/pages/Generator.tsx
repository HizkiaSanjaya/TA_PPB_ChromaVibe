import { keepPreviousData, useQueries, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { api } from '../api/client'
import type { Palet } from '../api/types'
import { LencanaKontras } from '../components/LencanaKontras'
import { PratinjauPalet, LegendaPalet } from '../components/PratinjauPalet'
import { RodaWarna, bacaHarmoni } from '../components/RodaWarna'
import { Galat, Memuat } from '../components/Status'
import { TombolAksi } from '../components/Tombol'
import { TombolSalin } from '../components/TombolSalin'
import { TombolSimpan } from '../components/TombolSimpan'
import { TINGKAT_KECERAHAN, WARNA_UMUM, namaWarna } from '../data/warna-umum'
import { daftarHex, hexKeCss, LABEL_PERAN, normalisasiHex } from '../utils/warna'

const TEMA_BAWAAN = 'y2k'
const HARMONI_BAWAAN = 'triadik'
const WARNA_BAWAAN = '#7C5CFF'
const PER_KOMBINASI = 5
const JARAK_SEED = 977

function keSeed(nilai: string | null) {
  const angka = Number(nilai)
  if (!Number.isFinite(angka) || angka < 0) return 1
  return Math.floor(angka)
}

/** Kecerahan hanya dikirim kalau pengguna benar-benar memilih tingkat tertentu. */
function keTerang(nilai: string | null) {
  const angka = Number(nilai)
  if (!nilai || !Number.isFinite(angka)) return null
  return Math.min(100, Math.max(10, Math.round(angka)))
}

function KartuHasil({ palet }: { palet: Palet }) {
  const total = palet.pasangan_kontras.length
  const lolos = palet.pasangan_kontras.filter((item) => item.lolos).length

  return (
    <article className="rounded-2xl border border-garis bg-panel/60 p-3">
      <PratinjauPalet palet={palet} ringkas />
      <LegendaPalet palet={palet} />

      <div className="mt-2.5 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{palet.nama}</p>
          <p className="mt-0.5 text-[11px] text-redup">
            {lolos === total
              ? `Aman dibaca ${lolos}/${total} — tidak ada tulisan yang terlalu samar`
              : `Perlu dicek ${lolos}/${total} — ada tulisan yang kurang terbaca`}
          </p>
        </div>
        <TombolSimpan palet={palet} />
      </div>

      <details className="mt-2.5 border-t border-garis/70 pt-2">
        <summary className="tautan cursor-pointer list-none text-[11px] font-medium text-teks [&::-webkit-details-marker]:hidden">
          Angka keterbacaan dan salin warna
        </summary>
        <ul className="mt-2 space-y-1">
          {palet.pasangan_kontras.map((pasangan) => (
            <li
              key={`${pasangan.peran_depan}-${pasangan.peran_belakang}`}
              className="flex items-center justify-between gap-2"
            >
              <span className="truncate text-[11px] text-redup">
                {LABEL_PERAN[pasangan.peran_depan]} di atas{' '}
                {LABEL_PERAN[pasangan.peran_belakang].toLowerCase()}
              </span>
              <LencanaKontras nilai={pasangan.nilai} rasio={pasangan.rasio} />
            </li>
          ))}
        </ul>
        <div className="mt-2.5 flex flex-wrap gap-2">
          <TombolSalin
            teks={daftarHex(palet).join(', ')}
            label="Salin hex"
            className="min-h-8 px-2 text-[10px]"
          />
          <TombolSalin
            teks={hexKeCss(palet)}
            label="Salin CSS"
            className="min-h-8 px-2 text-[10px]"
          />
        </div>
      </details>
    </article>
  )
}

export function Generator() {
  const [cari, setCari] = useSearchParams()

  const base = normalisasiHex(cari.get('base')) ?? WARNA_BAWAAN
  const tema = cari.get('tema') ?? TEMA_BAWAAN
  const harmoni = cari.get('harmoni') ?? HARMONI_BAWAAN
  const seed = keSeed(cari.get('seed'))
  const terang = keTerang(cari.get('terang'))

  const [teksHex, setTeksHex] = useState(base)
  const [kombinasi, setKombinasi] = useState(0)

  useEffect(() => {
    setTeksHex(base)
  }, [base])

  // Rangkaian tambahan dibuang saat warna, tema, harmoni, kecerahan, atau benih berubah.
  useEffect(() => {
    setKombinasi(0)
  }, [base, tema, harmoni, seed, terang])

  function ubah(patch: Record<string, string | number | null>) {
    const berikut = new URLSearchParams(cari)
    for (const [kunci, nilai] of Object.entries(patch)) {
      if (nilai === null) berikut.delete(kunci)
      else berikut.set(kunci, String(nilai))
    }
    setCari(berikut, { replace: true })
  }

  function terapkanTeks() {
    const bersih = normalisasiHex(teksHex)
    if (bersih) ubah({ base: bersih })
    else setTeksHex(base)
  }

  const daftarTema = useQuery({ queryKey: ['tema'], queryFn: api.daftarTema })
  const daftarHarmoni = useQuery({ queryKey: ['harmoni'], queryFn: api.daftarHarmoni })

  // Setiap rangkaian memakai benih yang berbeda, lalu hasilnya digabung.
  // Dengan begitu pengguna bisa menambah kombinasi tanpa kehilangan yang lama.
  const benihRangkaian = Array.from({ length: kombinasi + 1 }, (_, i) => seed + i * JARAK_SEED)

  const rangkaian = useQueries({
    queries: benihRangkaian.map((nilaiSeed) => ({
      queryKey: ['generate', base, tema, harmoni, nilaiSeed, terang],
      queryFn: () =>
        api.buatPalet({
          base,
          tema,
          harmoni,
          jumlah: PER_KOMBINASI,
          seed: nilaiSeed,
          ...(terang ? { terang } : {}),
        }),
      placeholderData: keepPreviousData,
    })),
  })

  const semuaPalet: Palet[] = []
  const sudahAda = new Set<string>()

  for (const kueri of rangkaian) {
    for (const palet of kueri.data?.palet ?? []) {
      if (!sudahAda.has(palet.id)) {
        sudahAda.add(palet.id)
        semuaPalet.push(palet)
      }
    }
  }

  const memuat = rangkaian.some((kueri) => kueri.isPending)
  const galat = rangkaian.find((kueri) => kueri.isError)?.error as Error | undefined
  const menyegarkan = rangkaian.some((kueri) => kueri.isFetching)

  const temaTerpilih = daftarTema.data?.find((item) => item.slug === tema)
  const harmoniTerpilih = daftarHarmoni.data?.find((item) => item.slug === harmoni)

  return (
    <div>
      <header className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight">Generator</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-redup">
          Satu warna primer, satu tema, satu skema harmoni. Hasilnya bisa direproduksi dengan warna,
          tema, dan <em>seed</em> yang sama.
        </p>
      </header>

      <section aria-label="Pengaturan palet" className="space-y-4">
        <div className="rounded-2xl border border-garis bg-panel/60 p-3.5">
          <div className="flex items-baseline justify-between gap-2">
            <label htmlFor="warna-primer" className="text-xs font-semibold">
              Warna dasar
            </label>
            {namaWarna(base) && <span className="text-[11px] text-redup">{namaWarna(base)}</span>}
          </div>

          <fieldset className="mt-2">
            <legend className="text-[10px] uppercase tracking-wider text-redup">
              Pilih langsung
            </legend>
            <div className="mt-1.5 grid grid-cols-4 gap-1.5">
              {WARNA_UMUM.map((warna) => {
                const aktif = warna.hex.toUpperCase() === base.toUpperCase()
                return (
                  <button
                    key={warna.hex}
                    type="button"
                    onClick={() => ubah({ base: warna.hex })}
                    aria-pressed={aktif}
                    className={`flex flex-col items-center gap-1 rounded-lg border p-1.5 transition ${
                      aktif
                        ? 'border-brand bg-brand/10'
                        : 'border-garis bg-panel/40 hover:border-redup'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="size-6 rounded-md ring-1 ring-white/20"
                      style={{ backgroundColor: warna.hex }}
                    />
                    <span className="text-[9px] leading-tight text-redup">{warna.nama}</span>
                  </button>
                )
              })}
            </div>
          </fieldset>

          <div className="mt-3 flex items-center gap-2.5">
            <input
              id="warna-primer"
              type="color"
              value={base}
              onChange={(peristiwa) => ubah({ base: peristiwa.target.value.toUpperCase() })}
              className="size-11 shrink-0 cursor-pointer rounded-lg border border-garis bg-transparent p-0"
              aria-label="Pilih warna dasar lewat pemilih warna"
            />
            <input
              value={teksHex}
              onChange={(peristiwa) => setTeksHex(peristiwa.target.value)}
              onBlur={terapkanTeks}
              onKeyDown={(peristiwa) => {
                if (peristiwa.key === 'Enter') terapkanTeks()
              }}
              maxLength={7}
              spellCheck={false}
              aria-label="Kode hex warna dasar"
              className="h-11 min-w-0 flex-1 rounded-lg border border-garis bg-latar-2 px-3 font-mono text-sm uppercase tracking-wide outline-none focus:border-brand"
            />
            <TombolAksi
              onClick={() =>
                ubah({
                  base: WARNA_UMUM[Math.floor(Math.random() * WARNA_UMUM.length)].hex,
                })
              }
              className="min-h-11 px-3 text-xs"
            >
              Acak
            </TombolAksi>
          </div>

          <fieldset className="mt-3">
            <legend className="flex w-full items-baseline justify-between gap-2 text-[10px] uppercase tracking-wider text-redup">
              <span>Kecerahan warna</span>
              <span className="normal-case tracking-normal">
                {terang === null ? 'sesuai warna asli' : `${terang}%`}
              </span>
            </legend>
            <div className="mt-1.5 grid grid-cols-5 gap-1">
              {TINGKAT_KECERAHAN.map((nilai) => (
                <button
                  key={nilai}
                  type="button"
                  onClick={() => ubah({ terang: nilai })}
                  aria-pressed={terang === nilai}
                  className={`min-h-8 rounded-md border text-[10px] font-semibold transition ${
                    terang === nilai
                      ? 'border-brand bg-brand/15 text-white'
                      : 'border-garis bg-panel/40 text-redup hover:border-redup hover:text-teks'
                  }`}
                >
                  {nilai}%
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => ubah({ terang: null })}
              aria-pressed={terang === null}
              className={`mt-1.5 w-full min-h-8 rounded-md border text-[10px] font-medium transition ${
                terang === null
                  ? 'border-brand bg-brand/15 text-white'
                  : 'border-garis bg-panel/40 text-redup hover:border-redup hover:text-teks'
              }`}
            >
              Pakai kecerahan asli warna
            </button>
            <p className="mt-1.5 text-[10px] leading-relaxed text-redup">
              Angka kecil membuat warna lebih gelap, angka besar lebih terang. Latar palet otomatis
              menyesuaikan agar teksnya tetap terbaca.
            </p>
          </fieldset>

          {temaTerpilih && (
            <div className="mt-3">
              <p className="text-[10px] uppercase tracking-wider text-redup">
                Saran warna tema {temaTerpilih.nama}
              </p>
              <div className="mt-1.5 flex gap-2">
                {temaTerpilih.saran_base.map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => ubah({ base: hex })}
                    aria-label={`Pakai warna ${hex}`}
                    className="size-9 rounded-lg ring-1 ring-white/15 transition hover:scale-105"
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <fieldset>
          <legend className="text-xs font-semibold">Tema</legend>
          {daftarTema.isPending && <Memuat pesan="Memuat tema" />}
          {daftarTema.isError && (
            <Galat
              pesan={(daftarTema.error as Error).message}
              ulangi={() => void daftarTema.refetch()}
            />
          )}
          {daftarTema.data && (
            <div className="geser-sentuh mt-2 flex gap-2 overflow-x-auto pb-1">
              {daftarTema.data.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => ubah({ tema: item.slug })}
                  aria-pressed={item.slug === tema}
                  className={`shrink-0 rounded-xl border px-3 py-2 text-left transition ${
                    item.slug === tema
                      ? 'border-brand bg-brand/10'
                      : 'border-garis bg-panel/40 hover:border-brand/50'
                  }`}
                >
                  <span className="block text-xs font-semibold">{item.nama}</span>
                  <span className="mt-1.5 flex gap-1">
                    {item.saran_base.map((hex) => (
                      <span
                        key={hex}
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </span>
                </button>
              ))}
            </div>
          )}
        </fieldset>

        <fieldset>
          <legend className="text-xs font-semibold">Harmoni</legend>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {daftarHarmoni.data?.map((item) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => ubah({ harmoni: item.slug })}
                aria-pressed={item.slug === harmoni}
                className={`min-h-9 rounded-full border px-3 text-xs font-medium transition ${
                  item.slug === harmoni
                    ? 'border-brand bg-brand/10 text-white'
                    : 'border-garis bg-transparent text-redup hover:border-redup hover:text-teks'
                }`}
              >
                {item.nama}
              </button>
            ))}
          </div>

          {/* Roda warna membuat perbedaan antar harmoni terlihat, bukan hanya terbaca. */}
          {semuaPalet.length > 0 && (
            <div className="mt-3 flex items-center gap-3 rounded-xl border border-garis bg-panel/40 p-3">
              <RodaWarna palet={semuaPalet[0]} ukuran={104} />
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-teks">{harmoniTerpilih?.nama}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-redup">
                  {bacaHarmoni(semuaPalet[0])}
                </p>
                <p className="mt-1 text-[10px] leading-relaxed text-redup">
                  Titik besar adalah warna pilihanmu, titik kecil adalah warna kedua. Ganti harmoni
                  untuk melihat kedua titik itu berpindah.
                </p>
              </div>
            </div>
          )}

          {harmoniTerpilih && (
            <div className="mt-2 rounded-lg border border-garis bg-panel/40 px-2.5 py-2">
              <p className="text-[11px] leading-relaxed text-teks">{harmoniTerpilih.deskripsi}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-redup">{harmoniTerpilih.saran}</p>
            </div>
          )}
        </fieldset>
      </section>

      <section aria-labelledby="judul-hasil" className="mt-7">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 id="judul-hasil" className="text-base font-semibold">
            Hasil
          </h2>
          <button
            type="button"
            onClick={() => ubah({ seed: Math.floor(Math.random() * 99991) + 1 })}
            className="tautan rounded-lg px-2 py-1 text-xs font-medium text-teks"
          >
            Variasikan
          </button>
        </div>

        <p className="mb-3 rounded-lg border border-garis bg-panel/40 px-2.5 py-2 text-[10px] leading-relaxed text-redup">
          <span className="font-semibold text-teks">Arti angka pada kartu.</span> Setiap palet diuji
          dengan enam pasangan warna, misalnya teks di atas latar, atau judul di atas kartu. Tulisan
          &ldquo;6/6&rdquo; berarti keenam pasangan itu lolos, jadi tidak ada tulisan yang terlalu
          samar untuk dibaca. Nama seperti &ldquo;Oranye Kasar&rdquo; dibentuk dari warna dasar
          ditambah kata sifat temanya, supaya tiap palet bisa disebut tanpa menyebut kode hex.
        </p>

        {memuat && semuaPalet.length === 0 && <Memuat pesan="Menyusun palet" />}
        {galat && <Galat pesan={galat.message} ulangi={() => void rangkaian[0]?.refetch()} />}

        {semuaPalet.length > 0 && (
          <>
            <ul className={`space-y-2.5 ${menyegarkan ? 'opacity-70' : ''}`}>
              {semuaPalet.map((palet) => (
                <li key={palet.id}>
                  <KartuHasil palet={palet} />
                </li>
              ))}
            </ul>

            <div className="mt-3">
              <TombolAksi
                onClick={() => setKombinasi((nilai) => nilai + 1)}
                className="w-full text-xs"
                nonaktif={menyegarkan}
              >
                Tampilkan {PER_KOMBINASI} kombinasi lain
              </TombolAksi>
              <p className="mt-2 text-[10px] leading-relaxed text-redup">
                {semuaPalet.length} palet dari {kombinasi + 1} putaran. Setiap putaran memakai kunci
                berbeda, jadi kombinasinya tidak mengulang yang sudah tampil.
              </p>
            </div>
          </>
        )}

        <p className="mt-3 text-[10px] leading-relaxed text-redup">
          Warna {base}
          {namaWarna(base) ? ` (${namaWarna(base)})` : ''}
          {terang !== null ? ` · kecerahan ${terang}%` : ''} · tema {temaTerpilih?.nama ?? tema} ·
          harmoni {harmoniTerpilih?.nama ?? harmoni}
        </p>
      </section>
    </div>
  )
}
