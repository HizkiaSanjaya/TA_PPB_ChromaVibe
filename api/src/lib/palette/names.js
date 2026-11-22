/**
 * Nama palet dibentuk dari dua kata yang dipilih deterministik.
 * Tujuannya bukan keindahan bahasa, tetapi supaya daftar palet terasa
 * digarap dan setiap hasil tetap punya identitas saat dibagikan.
 */
const KOSAKATA = {
  y2k: {
    depan: ['Transit', 'Krom', 'Disket', 'Pixel', 'Neon', 'Fajar'],
    belakang: ['Neon', 'Kilau', 'Metalik', 'Malam', 'Pop', 'Milenium'],
  },
  elegant: {
    depan: ['Sutra', 'Marmer', 'Senja', 'Krem', 'Lilin', 'Pualam'],
    belakang: ['Lembut', 'Anggun', 'Teduh', 'Klasik', 'Mewah', 'Sunyi'],
  },
  classic: {
    depan: ['Dermaga', 'Arsip', 'Botol', 'Marun', 'Katedral', 'Pesisir'],
    belakang: ['Klasik', 'Agung', 'Tenang', 'Formal', 'Tua', 'Akademik'],
  },
  energetic: {
    depan: ['Kilat', 'Sirine', 'Deru', 'Pesta', 'Pagi', 'Sorak'],
    belakang: ['Cepat', 'Menyala', 'Ledak', 'Tegang', 'Ceria', 'Gencar'],
  },
  pastel: {
    depan: ['Awan', 'Gula', 'Kapas', 'Sorbet', 'Kelopak', 'Embun'],
    belakang: ['Lembut', 'Manis', 'Pucat', 'Tenang', 'Susu', 'Ringan'],
  },
  cyberpunk: {
    depan: ['Grid', 'Volt', 'Kabut', 'Saraf', 'Sirkuit', 'Bawah'],
    belakang: ['Neon', 'Nokturnal', 'Krom', 'Digital', 'Listrik', 'Bayangan'],
  },
  earthy: {
    depan: ['Terakota', 'Zaitun', 'Gandum', 'Kayu', 'Bata', 'Lembah'],
    belakang: ['Hangat', 'Tanah', 'Panen', 'Teduh', 'Gurun', 'Rempah'],
  },
  minimalis: {
    depan: ['Kertas', 'Kapur', 'Garis', 'Ruang', 'Dinding', 'Nada'],
    belakang: ['Bersih', 'Polos', 'Hening', 'Tipis', 'Netral', 'Sunyi'],
  },
  brutalism: {
    depan: ['Beton', 'Blok', 'Tembok', 'Palu', 'Spanduk', 'Gerbang'],
    belakang: ['Mentah', 'Kasar', 'Berat', 'Tegas', 'Kaku', 'Terang'],
  },
  vintage: {
    depan: ['Sepia', 'Album', 'Loteng', 'Tembakau', 'Pasar', 'Surat'],
    belakang: ['Usang', 'Pudar', 'Silam', 'Lembap', 'Tua', 'Hangat'],
  },
}

export function buatNama(tema, acak) {
  const daftar = KOSAKATA[tema] ?? KOSAKATA.elegant
  const ambil = (kata) => kata[Math.floor(acak() * kata.length) % kata.length]

  const depan = ambil(daftar.depan)
  let belakang = ambil(daftar.belakang)

  // Dua kata kembar seperti "Neon Neon" terbaca seperti salah ketik.
  if (belakang === depan) {
    const lain = daftar.belakang.filter((kata) => kata !== depan)
    belakang = lain[Math.floor(acak() * lain.length) % lain.length]
  }

  return `${depan} ${belakang}`
}
