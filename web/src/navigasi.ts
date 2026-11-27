/**
 * Daftar tab navigasi bawah. Dipakai dua tempat: `BottomNav` untuk menggambar
 * tombolnya, dan `useGeserTab` untuk tahu urutan halaman saat jari digeser.
 * Satu daftar supaya keduanya tidak pernah berbeda urutan.
 */
export const TAB = [
  { ke: '/', label: 'Beranda' },
  { ke: '/panduan', label: 'Panduan' },
  { ke: '/generator', label: 'Generator' },
  { ke: '/koleksi', label: 'Koleksi' },
  { ke: '/tentang', label: 'Tentang' },
] as const
