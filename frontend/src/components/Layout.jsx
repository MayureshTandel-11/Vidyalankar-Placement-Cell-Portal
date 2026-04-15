import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Footer from './Footer'
import MobileMenu from './MobileMenu'

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50">
      <div className="flex-1 px-3 py-4 md:px-5 md:py-5">
        <div className="w-full space-y-5">
          <div className="flex items-center justify-between gap-3">
            <MobileMenu showOnMobile={true}>
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Menu</h3>
                <Sidebar />
              </div>
            </MobileMenu>
            <Navbar mode="faculty" />
          </div>
          <div className="grid gap-5 lg:grid-cols-[270px_1fr]">
            <aside className="hidden lg:block">
              <Sidebar />
            </aside>
            <main className="space-y-5">{children}</main>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
