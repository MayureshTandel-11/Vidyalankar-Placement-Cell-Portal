import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useMobileMenu } from '../context/MobileMenuContext'

export default function Navbar({ mode = 'student' }) {
  const navigate = useNavigate()
  const { user, token, logout } = useAuth()
  const { isOpen } = useMobileMenu()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const location = useLocation();
  const isPortalPage = location.pathname === '/dashboard';

  return (
    <header className={`glass-panel sticky top-0 z-50 flex w-full items-center justify-between gap-3 px-5 py-4 ${isOpen ? 'hidden md:flex' : ''}`}>
      {mode === 'student' ? (
        <Link to="/dashboard" className={`inline-flex items-center gap-2 text-lg font-bold text-slate-900 ${isPortalPage ? 'cursor-default' : ''}`} onClick={(e) => {
          if (isPortalPage) e.preventDefault();
        }}>
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-indigo-500 shadow shadow-indigo-400/80" />
          <span className="hidden sm:inline">Placement Portal</span>
          <span className="sm:hidden text-base">Placement Portal</span>
        </Link>
      ) : (
        <span className="inline-flex items-center gap-2 text-lg font-bold text-slate-900 cursor-default select-none">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-indigo-500 shadow shadow-indigo-400/80" />
          <span className="hidden sm:inline">Placement Portal</span>
          <span className="sm:hidden text-base">Placement Portal</span>
        </span>
      )}

      <nav className="flex items-center gap-2">
        {mode === 'student' ? (
          <>
            <Link to="/dashboard" className="hidden md:inline-block rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
              Student Dashboard
            </Link>
            <Link to="/" className="hidden md:block rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-indigo-700">
              Back
            </Link>
          </>
        ) : (
          <>
            <Link to="/faculty/dashboard" className="hidden md:inline-block rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
              Dashboard
            </Link>
            <span className="hidden text-sm text-slate-600 md:inline">
              <svg className="h-5 w-5 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6.5-2.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM12.483 10.434a.5.5 0 00-.736-.374l-3.656 2.183a.5.5 0 00-.21.287l-.693 1.979a.5.5 0 00.668.388l2.317-1.298a.5.5 0 00.273-.273l3.654-2.183a.5.5 0 00.374-.736l-1.657-1.962z" clipRule="evenodd"/>
              </svg>
            </span>
            {token && (
              <button
                onClick={handleLogout}
                className="hidden md:block rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Logout
              </button>
            )}
          </>
        )}
      </nav>
    </header>
  )
}
