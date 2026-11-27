import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

import { IkonBeranda, IkonGenerator, IkonKoleksi, IkonPanduan, IkonTentang } from './Ikon'
import { TAB } from '../navigasi'

const IKON: Record<string, ReactNode> = {
  '/': <IkonBeranda />,
  '/panduan': <IkonPanduan />,
  '/generator': <IkonGenerator />,
  '/koleksi': <IkonKoleksi />,
  '/tentang': <IkonTentang />,
}

/**
 * Lima tab, dengan Generator di tengah karena itu halaman utama aplikasi.
 * Urutannya diambil dari `src/navigasi.ts` supaya sama dengan gestur geser.
 */
export function BottomNav() {
  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[460px] border-t border-garis bg-latar/95 backdrop-blur-md"
    >
      <ul className="aman-bawah grid grid-cols-5">
        {TAB.map((item) => (
          <li key={item.ke}>
            <NavLink
              to={item.ke}
              end={item.ke === '/'}
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
                  <span className={isActive ? 'text-brand' : 'text-redup'}>{IKON[item.ke]}</span>
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
