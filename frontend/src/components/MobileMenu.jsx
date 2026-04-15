import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function MobileMenu({ children, showOnMobile = true }) {
  const [isOpen, setIsOpen] = useState(false)

  if (!showOnMobile) return null

  return (
    <>
      {/* Hamburger Button - Only visible on mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex-shrink-0 p-2 rounded-lg hover:bg-slate-100 transition"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-slate-900" />
        ) : (
          <Menu className="h-6 w-6 text-slate-900" />
        )}
      </button>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Panel */}
          <div className="fixed left-0 top-0 z-50 h-screen w-72 bg-gradient-to-b from-slate-50 to-white shadow-2xl md:hidden">
            <div className="flex flex-col h-full">
              <div className="p-4 flex-grow flex flex-col">
                {children}
              </div>
              {/* Fixed Back Button at Bottom */}
              <div className="p-4 pt-0 border-t border-slate-200 bg-white">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <svg className="h-5 w-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Close Menu
                </button>
              </div>
            </div>
          </div>
        </>
      )}

    </>
  )
}
