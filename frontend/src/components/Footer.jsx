export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-8 border-t border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100/70 px-3 py-6 md:px-5 md:py-8">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.4), 0 0 40px rgba(99, 102, 241, 0.2); }
          50% { box-shadow: 0 0 30px rgba(99, 102, 241, 0.6), 0 0 60px rgba(99, 102, 241, 0.3); }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        .badge-container {
          animation: float 3s ease-in-out infinite;
        }

        .badge-core {
          animation: glow 2s ease-in-out infinite;
        }

        .badge-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }
      `}</style>

      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:items-center md:justify-center">
          {/* Left section */}
          <div className="w-full text-center">
            <p className="text-sm text-slate-600 mx-auto max-w-md">
              © {currentYear} Placement Portal. All rights reserved.
            </p>
          </div>

          {/* Center section with advanced badge */}
          <div className="badge-container inline-block">
            <div className="badge-core relative inline-flex items-center gap-1.5 rounded-lg border border-indigo-200/50 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
              {/* Background gradient overlay */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-400/20 via-purple-400/20 to-indigo-400/20 blur-xl" />

              {/* Badge shimmer effect */}
              <div className="badge-shimmer absolute inset-0 rounded-lg" />

              {/* Content */}
              <div className="relative flex items-center gap-1.5">
                {/* Animated dot */}
                <div className="relative h-1.5 w-1.5">
                  <div className="absolute inset-0 rounded-full bg-cyan-300 animate-pulse" />
                  <div className="absolute inset-0.5 rounded-full bg-cyan-400" />
                </div>

                {/* Text with letter spacing */}
                <span className="tracking-wide font-mono text-xs">MT</span>

                {/* Accent dot */}
                <div className="h-2 w-2 rounded-full bg-gradient-to-r from-cyan-300 to-sky-300 opacity-80" />
              </div>
            </div>
          </div>

          {/* Right section
          <div className="text-center text-sm text-slate-600 md:text-right">
            <p>Built with care for your future</p>
          </div>*/}
        </div>
      </div>
    </footer>
  )
}
