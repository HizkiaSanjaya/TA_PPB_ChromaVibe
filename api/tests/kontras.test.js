import test from 'node:test'
import assert from 'node:assert/strict'

import { nilaiWcag, rasioKontras } from '../src/lib/color/contrast.js'

test('hitam dan putih menghasilkan rasio maksimum 21 banding 1', () => {
  assert.equal(rasioKontras('#000000', '#FFFFFF'), 21)
})

test('rasio tidak bergantung urutan warna', () => {
  const a = rasioKontras('#1B4332', '#FFFFFF')
  const b = rasioKontras('#FFFFFF', '#1B4332')
  assert.ok(Math.abs(a - b) < 1e-9)
})

test('abu #767676 di atas putih sesuai nilai acuan WCAG', () => {
  const rasio = rasioKontras('#767676', '#FFFFFF')
  assert.ok(Math.abs(rasio - 4.54) < 0.02, `rasio = ${rasio}`)
})

test('ambang WCAG dipetakan dengan benar', () => {
  assert.equal(nilaiWcag(21), 'AAA')
  assert.equal(nilaiWcag(7), 'AAA')
  assert.equal(nilaiWcag(6.9), 'AA')
  assert.equal(nilaiWcag(4.5), 'AA')
  assert.equal(nilaiWcag(4.49), 'AA-Large')
  assert.equal(nilaiWcag(3), 'AA-Large')
  assert.equal(nilaiWcag(2.99), 'Gagal')
})
