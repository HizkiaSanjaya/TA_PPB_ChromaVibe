import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { api } from '../api/client'
import type { Palet } from '../api/types'
import { LencanaKontras } from '../components/LencanaKontras'
import { Galat, Memuat } from '../components/Status'
import { StripWarna } from '../components/StripWarna'
import { TombolAksi } from '../components/Tombol'
import { TombolSalin } from '../components/TombolSalin'
import { TombolSimpan } from '../components/TombolSimpan'
import { daftarHex, hexKeCss, LABEL_PERAN, normalisasiHex } from '../utils/warna'

const TEMA_BAWAAN = 'y2k'
const HARMONI_BAWAAN = 'triadik'
const JUMLAH_BAWAAN = 3
const WARNA_BAWAAN = '#7C5CFF'

const CONTOH_WARNA = [
  '#FF2E88',
  '#00E5FF',
  '#FFD400',
  '#7C5CFF',
  '#22C55E',
  '#FF6B00',
  '#E63946',
  '#A8C7FA',
  '#B4892E',
  '#00F0FF',
  '#F7B7D2',
  '#6B7A4F',
]

function keJumlah(nilai: string | null) {
  const angka = Number(nilai)
  if (!Number.isFinite(angka)) return JUMLAH_BAWAAN
  return Math.min(5, Math.max(1, Math.round(angka)))
}

function keSeed(nilai: string | null) {
  const angka = Number(nilai)
  if (!Number.isFinite(angka) || angka < 0) return 1
  return Math.floor(angka)
}

function KartuHasil({ palet }: { palet: Palet }) {
  return (
    <article className="rounded-2xl border border-garis bg-panel/60 p-3">
      <StripWarna warna={daftarHex(palet)} tinggi="h-20" />

      <div className="mt-2.5 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{palet.nama}</p>
          <p className="mt-0.5 text-[11px] text-redup">
            {palet.harmoni_nama} · {palet.ringkasan.skor_aksesibilitas}% pasangan lolos
          </p>
        </div>
        <TombolSimpan palet={palet} />
      </div>

      <details className="mt-2.5 border-t border-garis/70 pt-2">
        <summary className="tautan cursor-pointer list-none text-[11px] font-medium text-teks [&::-webkit-details-marker]:hidden">
          Detail kontras
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
  const jumlah = keJumlah(cari.get('jumlah'))
  const seed = keSeed(cari.get('seed'))

  const [teksHex, setTeksHex] = useState(base)

  useEffect(() => {
    setTeksHex(base)
  }, [base])

  function ubah(patch: Record<string, string | number>) {
    const berikut = new URLSearchParams(cari)
    for (const [kunci, nilai] of Object.entries(patch)) {
      berikut.set(kunci, String(nilai))
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

  const hasil = useQuery({
    queryKey: ['generate', base, tema, harmoni, jumlah, seed],
    queryFn: () => api.buatPalet({ base, tema, harmoni, jumlah, seed }),
    placeholderData: keepPreviousData,
  })

  const temaTerpilih = daftarTema.data?.find((item) => item.slug === tema)
  const harmoniTerpilih = daftarHarmoni.data?.find((item) => item.slug === harmoni)

  return (
    <div>
      <header className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight">Generator</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-redup">
          Satu warna primer, satu tema, satu skema harmoni. Hasilnya selalu bisa direproduksi dengan
          kombinasi dan <em>seed</em> yang sama.
        </p>
      </header>

      <section aria-label="Pengaturan palet" className="space-y-4">
        <div className="rounded-2xl border border-garis bg-panel/60 p-3.5">
          <label htmlFor="warna-primer" className="text-xs font-semibold">
            Warna primer
          </label>
          <div className="mt-2 flex items-center gap-2.5">
            <input
              id="warna-primer"
              type="color"
              value={base}
              onChange={(peristiwa) => ubah({ base: peristiwa.target.value.toUpperCase() })}
              className="size-12 shrink-0 cursor-pointer rounded-xl border border-garis bg-transparent p-0"
              aria-label="Pilih warna primer lewat pemilih warna"
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
              aria-label="Kode hex warna primer"
              className="h-11 min-w-0 flex-1 rounded-xl border border-garis bg-latar-2 px-3 font-mono text-sm uppercase tracking-wide outline-none focus:border-brand"
            />
            <TombolAksi
              onClick={() =>
                ubah({
                  base: CONTOH_WARNA[Math.floor(Math.random() * CONTOH_WARNA.length)],
                })
              }
              className="min-h-11 px-3 text-xs"
            >
              Acak
            </TombolAksi>
          </div>

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
          {harmoniTerpilih && (
            <p className="mt-1.5 text-[11px] leading-relaxed text-redup">
              {harmoniTerpilih.deskripsi}
            </p>
          )}
        </fieldset>

        <fieldset>
          <legend className="text-xs font-semibold">Jumlah palet</legend>
          <div className="mt-2 inline-flex rounded-xl border border-garis p-0.5">
            {[1, 3, 5].map((nilai) => (
              <button
                key={nilai}
                type="button"
                onClick={() => ubah({ jumlah: nilai })}
                aria-pressed={jumlah === nilai}
                className={`min-h-8 w-11 rounded-lg text-xs font-semibold transition ${
                  jumlah === nilai ? 'bg-brand text-ink' : 'text-redup hover:text-teks'
                }`}
              >
                {nilai}
              </button>
            ))}
          </div>
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

        {hasil.isPending && <Memuat pesan="Menyusun palet" />}
        {hasil.isError && (
          <Galat pesan={(hasil.error as Error).message} ulangi={() => void hasil.refetch()} />
        )}

        {hasil.data && (
          <ul className={`space-y-2.5 ${hasil.isFetching ? 'opacity-70' : ''}`}>
            {hasil.data.palet.map((palet) => (
              <li key={palet.id}>
                <KartuHasil palet={palet} />
              </li>
            ))}
          </ul>
        )}

        <p className="mt-3 font-mono text-[10px] leading-relaxed text-redup">
          base {base} · tema {tema} · harmoni {harmoni} · seed {seed}
        </p>
      </section>
    </div>
  )
}
