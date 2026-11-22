import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { buatPalet } from '../src/lib/palette/generator.js'
import { ambilTema } from '../src/lib/palette/themes.js'

/**
 * Palet kurasi untuk halaman daftar. Warnanya tetap dihasilkan generator,
 * bukan ditulis tangan, supaya palet yang tampil di aplikasi selalu lolos
 * aturan kontras yang sama dengan palet buatan pengguna.
 */
const KURASI = [
  { tema: 'y2k', base: '#FF2E88', harmoni: 'triadik' },
  { tema: 'y2k', base: '#00E5FF', harmoni: 'komplementer' },
  { tema: 'y2k', base: '#B8FF00', harmoni: 'analog' },
  { tema: 'elegant', base: '#C9A227', harmoni: 'analog' },
  { tema: 'elegant', base: '#7C6F64', harmoni: 'monokrom' },
  { tema: 'elegant', base: '#2F4858', harmoni: 'split' },
  { tema: 'classic', base: '#1F3A5F', harmoni: 'triadik' },
  { tema: 'classic', base: '#7B2D26', harmoni: 'komplementer' },
  { tema: 'classic', base: '#1B4332', harmoni: 'analog' },
  { tema: 'energetic', base: '#FF6B00', harmoni: 'triadik' },
  { tema: 'energetic', base: '#FFD400', harmoni: 'analog' },
  { tema: 'energetic', base: '#E63946', harmoni: 'split' },
  { tema: 'pastel', base: '#A8C7FA', harmoni: 'analog' },
  { tema: 'pastel', base: '#F7B7D2', harmoni: 'monokrom' },
  { tema: 'pastel', base: '#BFE3C0', harmoni: 'triadik' },
  { tema: 'cyberpunk', base: '#00F0FF', harmoni: 'komplementer' },
  { tema: 'cyberpunk', base: '#FF2BD6', harmoni: 'analog' },
  { tema: 'cyberpunk', base: '#7A5CFF', harmoni: 'tetradik' },
  { tema: 'earthy', base: '#A65C3A', harmoni: 'analog' },
  { tema: 'earthy', base: '#B4892E', harmoni: 'triadik' },
  { tema: 'earthy', base: '#6B7A4F', harmoni: 'monokrom' },
  { tema: 'minimalis', base: '#4B5563', harmoni: 'monokrom' },
  { tema: 'minimalis', base: '#8A8F98', harmoni: 'analog' },
  { tema: 'minimalis', base: '#2F3437', harmoni: 'split' },
  { tema: 'brutalism', base: '#FF3B00', harmoni: 'komplementer' },
  { tema: 'brutalism', base: '#0044FF', harmoni: 'triadik' },
  { tema: 'brutalism', base: '#00C853', harmoni: 'analog' },
  { tema: 'vintage', base: '#A0522D', harmoni: 'analog' },
  { tema: 'vintage', base: '#7A6A3A', harmoni: 'triadik' },
  { tema: 'vintage', base: '#5B4B3A', harmoni: 'monokrom' },
]

const SEED = 2026

const hitunganTema = {}
const kurasi = []

for (const item of KURASI) {
  hitunganTema[item.tema] = (hitunganTema[item.tema] ?? 0) + 1
  const urutan = hitunganTema[item.tema]
  const indeks = urutan - 1

  const palet = buatPalet({
    base: item.base,
    tema: item.tema,
    harmoni: item.harmoni,
    seed: SEED,
    indeks,
  })

  kurasi.push({
    id: `kurasi-${item.tema}-${urutan}`,
    slug: `${item.tema}-${urutan}`,
    tema: item.tema,
    tema_nama: ambilTema(item.tema)?.nama ?? item.tema,
    nama: palet.nama,
    harmoni: palet.harmoni,
    harmoni_nama: palet.harmoni_nama,
    warna: palet.warna,
    pasangan_kontras: palet.pasangan_kontras,
    ringkasan: palet.ringkasan,
  })
}

const jalurJson = fileURLToPath(new URL('../src/data/palet.kurasi.json', import.meta.url))
mkdirSync(fileURLToPath(new URL('../src/data', import.meta.url)), { recursive: true })
writeFileSync(jalurJson, `${JSON.stringify(kurasi, null, 2)}\n`, 'utf8')

const kutip = (teks) => `'${String(teks).replace(/'/g, "''")}'`
const json = (nilai) => `$json$${JSON.stringify(nilai)}$json$`

const barisSql = kurasi
  .map(
    (item) =>
      `  (${kutip(item.tema)}, ${kutip(item.slug)}, ${kutip(item.nama)}, ${kutip(
        item.harmoni
      )}, ${json(item.warna)}, ${json(item.pasangan_kontras)}, ${json(item.ringkasan)})`
  )
  .join(',\n')

const sql = `-- Dihasilkan otomatis oleh npm run seed:build. Jangan disunting manual.
insert into palet (tema_slug, slug, nama, harmoni, warna, pasangan_kontras, ringkasan)
values
${barisSql}
on conflict (slug) do nothing;
`

const jalurSql = fileURLToPath(new URL('../../supabase/seed.sql', import.meta.url))
mkdirSync(fileURLToPath(new URL('../../supabase', import.meta.url)), { recursive: true })
writeFileSync(jalurSql, sql, 'utf8')

console.log(`Selesai. ${kurasi.length} palet kurasi ditulis ke:`)
console.log(`  ${jalurJson}`)
console.log(`  ${jalurSql}`)
