import { Route, Routes } from 'react-router-dom'

import { Layout } from './components/Layout'
import { Beranda } from './pages/Beranda'
import { DetailPalet } from './pages/DetailPalet'
import { DetailTema } from './pages/DetailTema'
import { Generator } from './pages/Generator'
import { Koleksi } from './pages/Koleksi'
import { Panduan } from './pages/Panduan'
import { Tentang } from './pages/Tentang'
import { TidakDitemukan } from './pages/TidakDitemukan'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Beranda />} />
        <Route path="panduan" element={<Panduan />} />
        <Route path="tema/:slug" element={<DetailTema />} />
        <Route path="palet/:id" element={<DetailPalet />} />
        <Route path="generator" element={<Generator />} />
        <Route path="koleksi" element={<Koleksi />} />
        <Route path="tentang" element={<Tentang />} />
        <Route path="*" element={<TidakDitemukan />} />
      </Route>
    </Routes>
  )
}
