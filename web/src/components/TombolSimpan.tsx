import type { Palet } from '../api/types'
import { hapusPalet, simpanPalet, useKoleksi } from '../hooks/useKoleksi'
import { TombolAksi } from './Tombol'

export function TombolSimpan({ palet }: { palet: Palet }) {
  const koleksi = useKoleksi()
  const sudah = koleksi.some((item) => item.id === palet.id)

  return (
    <TombolAksi
      onClick={() => (sudah ? hapusPalet(palet.id) : simpanPalet(palet))}
      utama={!sudah}
      className="min-h-9 px-3 text-xs"
    >
      {sudah ? 'Tersimpan' : 'Simpan'}
    </TombolAksi>
  )
}
