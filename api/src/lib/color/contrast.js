import { keLinear, parseHex } from './space.js'

/** Luminansi relatif sesuai definisi WCAG 2.1 butir 1.4.3. */
export function luminansiRelatif(hex) {
  const { r, g, b } = parseHex(hex)
  return 0.2126 * keLinear(r) + 0.7152 * keLinear(g) + 0.0722 * keLinear(b)
}

export function rasioKontras(hexDepan, hexBelakang) {
  const depan = luminansiRelatif(hexDepan)
  const belakang = luminansiRelatif(hexBelakang)
  const terang = Math.max(depan, belakang)
  const gelap = Math.min(depan, belakang)
  return (terang + 0.05) / (gelap + 0.05)
}

export function bulatkanRasio(rasio) {
  return Math.round(rasio * 100) / 100
}

export function nilaiWcag(rasio) {
  if (rasio >= 7) return 'AAA'
  if (rasio >= 4.5) return 'AA'
  if (rasio >= 3) return 'AA-Large'
  return 'Gagal'
}

/**
 * Memeriksa seluruh pasangan teks dan latar pada satu palet.
 * Ambang 4.5 dipakai untuk teks normal, 3.0 untuk komponen antarmuka.
 */
export function periksaPasangan(warna, pasangan) {
  return pasangan.map(([peranDepan, peranBelakang, ambang]) => {
    const depan = warna.find((item) => item.peran === peranDepan)
    const belakang = warna.find((item) => item.peran === peranBelakang)
    const rasio = rasioKontras(depan.hex, belakang.hex)
    const lolos = rasio >= ambang

    return {
      depan: depan.hex,
      belakang: belakang.hex,
      peran_depan: peranDepan,
      peran_belakang: peranBelakang,
      rasio: bulatkanRasio(rasio),
      ambang,
      nilai: nilaiWcag(rasio),
      lolos,
    }
  })
}
