import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import MobileWeekNav from './MobileWeekNav'

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 lg:h-dvh lg:max-h-dvh lg:overflow-hidden">
      <TopBar />
      <MobileWeekNav />
      <div className="mx-auto flex w-full max-w-[1600px] flex-1 lg:min-h-0">
        <Sidebar />
        <main className="main-scroll min-w-0 flex-1 p-4 pb-20 lg:overflow-y-auto lg:overscroll-y-contain lg:p-5 lg:pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
