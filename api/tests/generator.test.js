import test from 'node:test'
import assert from 'node:assert/strict'

import { buatDaftarPalet, buatPalet } from '../src/lib/palette/generator.js'
import { TEMA } from '../src/lib/palette/themes.js'
import { rasioKontras } from '../src/lib/color/contrast.js'

const HEX = /^#[0-9A-F]{6}$/

test('input yang sama menghasilkan palet identik', () => {
  const masukan = { base: '#3B82F6', tema: 'y2k', harmoni: 'triadik', seed: 42, indeks: 0 }
  const a = buatPalet(masukan)
  const b = buatPalet(masukan)

  assert.equal(a.id, b.id)
  assert.deepEqual(a.warna, b.warna)
  assert.equal(a.nama, b.nama)
})

test('seed berbeda menghasilkan palet berbeda', () => {
  const dasar = { base: '#3B82F6', tema: 'y2k', harmoni: 'triadik', indeks: 0 }
  const a = buatPalet({ ...dasar, seed: 1 })
  const b = buatPalet({ ...dasar, seed: 2 })

  assert.notEqual(a.id, b.id)
  assert.notDeepEqual(
    a.warna.map((item) => item.hex),
    b.warna.map((item) => item.hex)
  )
})

test('setiap palet berisi lima peran dengan hex valid', () => {
  const palet = buatPalet({ base: '#C9A227', tema: 'elegant', harmoni: 'analog' })
  const peran = palet.warna.map((item) => item.peran)

  assert.deepEqual(peran, ['background', 'surface', 'base', 'accent', 'text'])
  for (const item of palet.warna) {
    assert.match(item.hex, HEX)
    assert.equal(item.oklch.length, 3)
  }
  assert.match(palet.id, /^gen_[0-9a-f]{10}$/)
})

test('teks pada setiap tema tetap lolos ambang 4.5 banding 1', () => {
  const dasar = ['#3B82F6', '#FF6B00', '#22C55E', '#111827', '#D946EF']

  for (const tema of TEMA.map((item) => item.slug)) {
    for (const base of dasar) {
      const palet = buatPalet({ base, tema, harmoni: 'triadik', seed: 7 })
      const teks = palet.warna.find((item) => item.peran === 'text').hex
      const background = palet.warna.find((item) => item.peran === 'background').hex
      const surface = palet.warna.find((item) => item.peran === 'surface').hex

      assert.ok(
        rasioKontras(teks, background) >= 4.5,
        `tema ${tema} base ${base} gagal kontras teks terhadap background`
      )
      assert.ok(
        rasioKontras(teks, surface) >= 4.5,
        `tema ${tema} base ${base} gagal kontras teks terhadap surface`
      )
      assert.equal(palet.ringkasan.teks_lolos_aa, true)
    }
  }
})

test('latar tema gelap benar-benar lebih gelap dari teksnya', () => {
  for (const slug of ['y2k', 'cyberpunk']) {
    const palet = buatPalet({ base: '#FF2E88', tema: slug, harmoni: 'analog' })
    const background = palet.warna.find((item) => item.peran === 'background')
    const teks = palet.warna.find((item) => item.peran === 'text')

    assert.ok(background.oklch[0] < 0.3, `${slug} latar tidak gelap`)
    assert.ok(teks.oklch[0] > 0.85, `${slug} teks tidak terang`)
  }
})

test('jumlah palet mengikuti permintaan dan tidak identik satu sama lain', () => {
  const daftar = buatDaftarPalet({
    base: '#FF2E88',
    tema: 'y2k',
    harmoni: 'triadik',
    jumlah: 3,
    seed: 11,
  })

  assert.equal(daftar.length, 3)
  const kumpulanHex = daftar.map((item) => item.warna.map((warna) => warna.hex).join(','))
  assert.equal(new Set(kumpulanHex).size, 3)
})

test('lima palet dalam satu rangkaian berbeda dan bernama unik', () => {
  for (const tema of TEMA.map((item) => item.slug)) {
    for (const harmoni of ['monokrom', 'triadik', 'analog']) {
      const daftar = buatDaftarPalet({ base: '#7C5CFF', tema, harmoni, jumlah: 5, seed: 11 })

      assert.equal(daftar.length, 5, `${tema}/${harmoni} tidak menghasilkan 5 palet`)

      const warna = daftar.map((item) => item.warna.map((w) => w.hex).join(','))
      assert.equal(new Set(warna).size, 5, `${tema}/${harmoni} punya palet kembar`)

      const nama = daftar.map((item) => item.nama)
      assert.equal(new Set(nama).size, 5, `${tema}/${harmoni} punya nama kembar`)
    }
  }
})

test('kecerahan mengubah terang warna dan tetap lolos kontras', () => {
  const gelap = buatPalet({ base: '#E53935', tema: 'elegant', harmoni: 'triadik', terang: 10 })
  const terang = buatPalet({ base: '#E53935', tema: 'elegant', harmoni: 'triadik', terang: 100 })

  const Lgelap = gelap.warna.find((item) => item.peran === 'base').oklch[0]
  const Lterang = terang.warna.find((item) => item.peran === 'base').oklch[0]

  assert.ok(Lterang > Lgelap + 0.3, `kecerahan tidak berubah: ${Lgelap} vs ${Lterang}`)

  for (const tingkat of [10, 30, 50, 70, 90, 100]) {
    for (const tema of ['y2k', 'elegant', 'brutalism', 'minimalis']) {
      const palet = buatPalet({ base: '#E53935', tema, harmoni: 'triadik', terang: tingkat })
      assert.equal(
        palet.ringkasan.skor_aksesibilitas,
        100,
        `${tema} dengan kecerahan ${tingkat} gagal kontras`
      )
    }
  }
})

test('lima palet selalu punya latar berbeda, termasuk saat kecerahan diatur', () => {
  for (const tema of TEMA.map((item) => item.slug)) {
    for (const terang of [null, 10, 50, 100]) {
      const daftar = buatDaftarPalet({
        base: '#E53935',
        tema,
        harmoni: 'triadik',
        jumlah: 5,
        seed: 0,
        terang,
      })

      const latar = daftar.map((item) => item.warna[0].hex)
      assert.equal(
        new Set(latar).size,
        5,
        `${tema} dengan kecerahan ${terang} punya latar kembar: ${latar.join(' ')}`
      )
    }
  }
})

test('tema berbeda menghasilkan latar berbeda untuk warna yang sama', () => {
  const latar = TEMA.map((tema) => {
    const palet = buatPalet({ base: '#E53935', tema: tema.slug, harmoni: 'triadik' })
    return palet.warna.find((item) => item.peran === 'background').hex
  })

  assert.equal(new Set(latar).size, TEMA.length, `latar antar tema kembar: ${latar.join(' ')}`)
})

test('warna berbeda menghasilkan palet berbeda dalam tema yang sama', () => {
  const merah = buatPalet({ base: '#E53935', tema: 'brutalism', harmoni: 'triadik' })
  const biru = buatPalet({ base: '#1E88E5', tema: 'brutalism', harmoni: 'triadik' })

  const latarMerah = merah.warna.find((item) => item.peran === 'background').hex
  const latarBiru = biru.warna.find((item) => item.peran === 'background').hex

  assert.notEqual(latarMerah, latarBiru, 'latar tidak mengikuti warna pilihan pengguna')
})

test('warna utama layak jadi tulisan, warna kedua layak jadi komponen', () => {
  for (const tema of TEMA.map((item) => item.slug)) {
    for (const base of ['#E53935', '#1E88E5', '#FDD835', '#8E24AA', '#F5F5F5', '#111111']) {
      const palet = buatPalet({ base, tema, harmoni: 'triadik' })
      const kartu = palet.warna.find((item) => item.peran === 'surface').hex
      const utama = palet.warna.find((item) => item.peran === 'base').hex
      const kedua = palet.warna.find((item) => item.peran === 'accent').hex

      // Warna utama dipakai sebagai judul, jadi wajib 4.5.
      assert.ok(
        rasioKontras(utama, kartu) >= 4.5,
        `${tema} ${base}: warna utama tidak layak jadi judul (${utama} di atas ${kartu})`
      )

      // Warna kedua dipakai sebagai isian dan garis, cukup 3 sesuai WCAG untuk
      // komponen non-teks. Memaksakan 4.5 membuat warna cerah jadi hitam.
      assert.ok(
        rasioKontras(kedua, kartu) >= 3,
        `${tema} ${base}: warna kedua tidak layak jadi komponen (${kedua} di atas ${kartu})`
      )
    }
  }
})

test('monokrom tetap membedakan warna utama dan warna kedua', () => {
  for (const tema of ['elegant', 'brutalism', 'y2k', 'minimalis', 'pastel']) {
    const palet = buatPalet({ base: '#E53935', tema, harmoni: 'monokrom' })
    const utama = palet.warna.find((item) => item.peran === 'base')
    const kedua = palet.warna.find((item) => item.peran === 'accent')

    // Jarak diukur di ruang OKLab, bukan hanya selisih gelap, karena warna
    // pucat bisa dibedakan lewat kepekatan walau tingkat gelapnya mirip.
    const [L1, C1, h1] = utama.oklch
    const [L2, C2, h2] = kedua.oklch
    const rad = Math.PI / 180
    const a1 = C1 * Math.cos(h1 * rad)
    const b1 = C1 * Math.sin(h1 * rad)
    const a2 = C2 * Math.cos(h2 * rad)
    const b2 = C2 * Math.sin(h2 * rad)
    const jarak = Math.hypot(L1 - L2, a1 - a2, b1 - b2)

    assert.notEqual(utama.hex, kedua.hex, `${tema}: warna utama dan kedua sama persis`)
    assert.ok(
      jarak > 0.12,
      `${tema}: warna utama dan kedua terlalu mirip (jarak ${jarak.toFixed(3)})`
    )
  }
})

test('warna utama dan warna kedua tetap terpisah, termasuk monokrom', () => {
  for (const tema of ['elegant', 'brutalism', 'y2k', 'minimalis', 'pastel']) {
    const palet = buatPalet({ base: '#E53935', tema, harmoni: 'monokrom' })
    const utama = palet.warna.find((item) => item.peran === 'base')
    const kedua = palet.warna.find((item) => item.peran === 'accent')

    assert.notEqual(utama.hex, kedua.hex, `${tema}: warna utama dan kedua sama persis`)

    // Dihitung sebagai jarak warna, bukan hanya selisih gelap, karena dua warna
    // bisa dibedakan lewat kepekatan walau tingkat gelapnya mirip.
    const rad = Math.PI / 180
    const jarak = Math.hypot(
      utama.oklch[0] - kedua.oklch[0],
      utama.oklch[1] * Math.cos(utama.oklch[2] * rad) -
        kedua.oklch[1] * Math.cos(kedua.oklch[2] * rad),
      utama.oklch[1] * Math.sin(utama.oklch[2] * rad) -
        kedua.oklch[1] * Math.sin(kedua.oklch[2] * rad)
    )

    assert.ok(jarak > 0.12, `${tema}: warna utama dan kedua terlalu mirip (${jarak.toFixed(3)})`)
  }
})

test('tema dan harmoni yang tidak dikenal ditolak', () => {
  assert.throws(
    () => buatPalet({ base: '#3B82F6', tema: 'tidak-ada', harmoni: 'triadik' }),
    /Tema tidak dikenal/
  )
  assert.throws(
    () => buatPalet({ base: '#3B82F6', tema: 'y2k', harmoni: 'tidak-ada' }),
    /Harmoni tidak dikenal/
  )
})
