import { Outlet, useLocation } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function Layout() {
  const { pathname } = useLocation()
  const hideNav = pathname.startsWith('/dish/')

  return (
    <div className="app-shell">
      <div className="phone-frame">
        <main className={`page ${hideNav ? 'page-full' : ''}`}>
          <Outlet />
        </main>
        {!hideNav && <BottomNav />}
      </div>
    </div>
  )
}
