/**
 * Konversi warna berbasis OKLab/OKLCH.
 *
 * HSL tidak dipakai karena lightness-nya tidak sejalan dengan persepsi mata.
 * Kuning dan biru pada HSL lightness 50% memiliki keterangan yang jauh berbeda,
 * sehingga rencana lightness sebuah tema tidak bisa diandalkan. OKLCH membuat
 * kenaikan L yang sama terasa setara di seluruh hue.
 */

const TOLERANSI_GAMUT = 1e-4

export function batasi(nilai, minimum, maksimum) {
  return Math.min(Math.max(nilai, minimum), maksimum)
}

export function normalkanHue(hue) {
  const hasil = hue % 360
  return hasil < 0 ? hasil + 360 : hasil
}

export function keLinear(kanal) {
  return kanal <= 0.04045 ? kanal / 12.92 : ((kanal + 0.055) / 1.055) ** 2.4
}

export function keSrgb(kanal) {
  return kanal <= 0.0031308 ? kanal * 12.92 : 1.055 * kanal ** (1 / 2.4) - 0.055
}

export function parseHex(hex) {
  const bersih = String(hex).trim().replace(/^#/, '')
  const lengkap =
    bersih.length === 3
      ? bersih
          .split('')
          .map((huruf) => huruf + huruf)
          .join('')
      : bersih

  if (!/^[0-9a-fA-F]{6}$/.test(lengkap)) {
    throw new Error(`Kode hex tidak valid: ${hex}. Gunakan format #RRGGBB.`)
  }

  return {
    r: parseInt(lengkap.slice(0, 2), 16) / 255,
    g: parseInt(lengkap.slice(2, 4), 16) / 255,
    b: parseInt(lengkap.slice(4, 6), 16) / 255,
  }
}

export function rgbKeHex({ r, g, b }) {
  const kanal = (nilai) =>
    Math.round(batasi(nilai, 0, 1) * 255)
      .toString(16)
      .padStart(2, '0')

  return `#${kanal(r)}${kanal(g)}${kanal(b)}`.toUpperCase()
}

export function rgbKeOklab({ r, g, b }) {
  const lr = keLinear(r)
  const lg = keLinear(g)
  const lb = keLinear(b)

  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb

  const l_ = Math.cbrt(l)
  const m_ = Math.cbrt(m)
  const s_ = Math.cbrt(s)

  return {
    L: 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  }
}

export function oklabKeLinearRgb({ L, a, b }) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b

  const l = l_ * l_ * l_
  const m = m_ * m_ * m_
  const s = s_ * s_ * s_

  return {
    r: 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  }
}

export function oklabKeOklch({ L, a, b }) {
  const C = Math.hypot(a, b)
  const hue = (Math.atan2(b, a) * 180) / Math.PI
  return { L, C, h: C < 1e-6 ? 0 : normalkanHue(hue) }
}

export function oklchKeOklab({ L, C, h }) {
  const radian = (normalkanHue(h) * Math.PI) / 180
  return { L, a: C * Math.cos(radian), b: C * Math.sin(radian) }
}

/** Menghasilkan kanal sRGB 0 sampai 1 tanpa pemotongan, bisa keluar gamut. */
export function oklchKeRgb({ L, C, h }) {
  const linear = oklabKeLinearRgb(oklchKeOklab({ L, C, h }))
  return {
    r: keSrgb(linear.r),
    g: keSrgb(linear.g),
    b: keSrgb(linear.b),
  }
}

export function dalamGamut(oklch, toleransi = TOLERANSI_GAMUT) {
  const { r, g, b } = oklchKeRgb(oklch)
  return [r, g, b].every((kanal) => kanal >= -toleransi && kanal <= 1 + toleransi)
}

/**
 * Memetakan warna ke dalam gamut sRGB dengan menurunkan chroma, bukan memotong
 * kanal. Pemotongan kanal menggeser hue dan membuat hasil terlihat kotor.
 */
export function petakanGamut({ L, C, h }) {
  const lightness = batasi(L, 0, 1)
  const kroma = Math.max(0, C)
  const hue = normalkanHue(h)

  if (dalamGamut({ L: lightness, C: kroma, h: hue })) {
    return { L: lightness, C: kroma, h: hue }
  }

  let bawah = 0
  let atas = kroma

  for (let langkah = 0; langkah < 24; langkah += 1) {
    const tengah = (bawah + atas) / 2
    if (dalamGamut({ L: lightness, C: tengah, h: hue })) {
      bawah = tengah
    } else {
      atas = tengah
    }
  }

  return { L: lightness, C: bawah, h: hue }
}

export function oklchKeHex(oklch) {
  return rgbKeHex(oklchKeRgb(petakanGamut(oklch)))
}

export function hexKeOklch(hex) {
  return oklabKeOklch(rgbKeOklab(parseHex(hex)))
}

export function bulatkanWarna({ L, C, h }) {
  return [Math.round(L * 1000) / 1000, Math.round(C * 1000) / 1000, Math.round(h * 10) / 10]
}
