import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { BottomNav } from './BottomNav'
import { PenandaOffline } from './PenandaOffline'
import { useGeserTab } from '../hooks/useGeserTab'

function GulirKeAtas() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export function Layout() {
  useGeserTab()

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[460px] flex-col border-x border-garis/50 bg-latar/30">
      <GulirKeAtas />
      <PenandaOffline />
      <main className="flex-1 px-4 pb-28 pt-6">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
