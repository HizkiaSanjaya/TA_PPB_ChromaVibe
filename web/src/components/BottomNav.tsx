import { NavLink } from 'react-router-dom'

import { IkonBeranda, IkonGenerator, IkonJelajah, IkonKoleksi, IkonTentang } from './Ikon'

/**
 * Lima tab, dengan Generator di tengah karena itu halaman utama aplikasi.
 */
const ITEM = [
  { ke: '/', label: 'Beranda', ikon: <IkonBeranda />, persis: true },
  { ke: '/jelajah', label: 'Jelajah', ikon: <IkonJelajah />, persis: false },
  { ke: '/generator', label: 'Generator', ikon: <IkonGenerator />, persis: false },
  { ke: '/koleksi', label: 'Koleksi', ikon: <IkonKoleksi />, persis: false },
  { ke: '/tentang', label: 'Tentang', ikon: <IkonTentang />, persis: false },
]

export function BottomNav() {
  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[460px] border-t border-garis bg-latar/95 backdrop-blur-md"
    >
      <ul className="aman-bawah grid grid-cols-5">
        {ITEM.map((item) => (
          <li key={item.ke}>
            <NavLink
              to={item.ke}
              end={item.persis}
              className="relative flex min-h-14 flex-col items-center justify-center gap-0.5 px-0.5 pt-1.5 text-[10px] font-medium"
            >
              {({ isActive }) => (
                <>
                  <span
                    aria-hidden="true"
                    className={`absolute top-0 h-[2px] w-6 rounded-full transition-colors ${
                      isActive ? 'bg-brand' : 'bg-transparent'
                    }`}
                  />
                  <span className={isActive ? 'text-brand' : 'text-redup'}>{item.ikon}</span>
                  <span className={isActive ? 'text-teks' : 'text-redup'}>{item.label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
