import test from 'node:test'
import assert from 'node:assert/strict'

import {
  dalamGamut,
  hexKeOklch,
  oklchKeHex,
  parseHex,
  petakanGamut,
} from '../src/lib/color/space.js'

const CONTOH = [
  '#FF0000',
  '#00FF00',
  '#0000FF',
  '#3B82F6',
  '#F7B7D2',
  '#1B4332',
  '#C9A227',
  '#FFFFFF',
  '#000000',
  '#767676',
]

function bedaKanal(hexA, hexB) {
  const a = parseHex(hexA)
  const b = parseHex(hexB)
  return Math.max(Math.abs(a.r - b.r), Math.abs(a.g - b.g), Math.abs(a.b - b.b)) * 255
}

test('putaran hex ke OKLCH dan kembali tidak menggeser warna', () => {
  for (const hex of CONTOH) {
    const balik = oklchKeHex(hexKeOklch(hex))
    assert.ok(bedaKanal(balik, hex) <= 1, `${hex} berubah menjadi ${balik}`)
  }
})

test('merah sRGB sesuai nilai acuan OKLCH', () => {
  const { L, C, h } = hexKeOklch('#FF0000')
  assert.ok(Math.abs(L - 0.6279) < 0.005, `L = ${L}`)
  assert.ok(Math.abs(C - 0.2577) < 0.005, `C = ${C}`)
  assert.ok(Math.abs(h - 29.23) < 0.5, `h = ${h}`)
})

test('putih dan hitam berada di ujung lightness', () => {
  assert.equal(oklchKeHex({ L: 1, C: 0, h: 0 }), '#FFFFFF')
  assert.equal(oklchKeHex({ L: 0, C: 0, h: 0 }), '#000000')
})

test('warna di luar gamut diturunkan kromanya, bukan dipotong kanalnya', () => {
  const mustahil = { L: 0.7, C: 0.4, h: 150 }
  assert.equal(dalamGamut(mustahil), false)

  const hasil = petakanGamut(mustahil)
  assert.equal(hasil.L, 0.7)
  assert.equal(hasil.h, 150)
  assert.ok(hasil.C < 0.4)
  assert.equal(dalamGamut(hasil), true)
})

test('hex tidak valid ditolak dengan pesan jelas', () => {
  assert.throws(() => parseHex('#GGGGGG'), /tidak valid/)
  assert.throws(() => parseHex('merah'), /tidak valid/)
})
