import { Home, LogOut, PlusCircle } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const items = [
  { label: 'Dashboard', to: '/faculty/dashboard', icon: Home },
  { label: 'Opportunities', to: '/faculty/opportunities', icon: PlusCircle },
]

export default function Sidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  return (
    <aside className="glass-panel h-fit p-2 md:p-4 md:sticky md:top-24 shadow-lg shadow-slate-300/20">
      <nav className="flex flex-col gap-2 md:space-y-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-1 md:gap-2 rounded-lg px-2 py-1.5 md:px-3 md:py-2 text-xs md:text-sm font-semibold transition ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-sky-500 text-white shadow-md shadow-indigo-500/30'
                  : 'text-slate-700 hover:bg-slate-100'
              }`
            }
          >
            <item.icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <span className="hidden md:inline">{item.label}</span>
            <span className="md:hidden text-xs font-medium">{item.label.split(' ')[0]}</span>
          </NavLink>
        ))}
        <button
          onClick={() => {
            logout()
            navigate('/')
          }}
          className="flex items-center gap-1 md:gap-2 rounded-lg px-2 py-1.5 md:px-3 md:py-2 text-xs md:text-sm font-semibold text-rose-700 transition hover:bg-rose-50 md:w-full"
        >
          <LogOut className="h-3.5 w-3.5 md:h-4 md:w-4" />
          <span className="hidden md:inline">Logout</span>
          <span className="md:hidden text-xs font-medium">Log Out</span>
        </button>
      </nav>
    </aside>
  )

}
