import { Loader2 } from 'lucide-react'

export function PrimaryButton({ children, loading, className = '', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 px-4 py-2.5 font-semibold text-white shadow-lg shadow-indigo-500/25 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/35 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}

export function SectionTitle({ title, subtitle }) {
  return (
    <div className="space-y-1">
      <h1 className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 bg-clip-text text-2xl font-extrabold text-transparent md:text-3xl">
        {title}
      </h1>
      {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
    </div>
  )
}

export function StatusMessage({ type = 'success', message }) {
  const tone =
    type === 'error'
      ? 'border-rose-200 bg-rose-50 text-rose-700'
      : 'border-emerald-200 bg-emerald-50 text-emerald-700'
  return <div className={`rounded-xl border px-4 py-3 text-sm shadow-sm ${tone}`}>{message}</div>
}

export function EmptyState({ title, subtitle }) {
  return (
    <div className="glass-panel p-8 text-center">
      <p className="text-lg font-semibold text-slate-800">{title}</p>
      <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
    </div>
  )
}

export function Spinner() {
  return <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
}

export function Modal({ isOpen, onClose, title, children, type }) {
  if (!isOpen) return null

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex p-4 items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div className="w-full max-w-2xl mx-auto max-h-[90vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Fixed Header */}
        <div className="flex items-start justify-between gap-4 p-6 pb-4 border-b border-slate-200 bg-white/95 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 break-words overflow-wrap-anywhere hyphens-auto pr-4 leading-tight">
              {title}
            </h2>
            {type && (
              <p className="mt-1.5 text-sm text-slate-600">
                Opportunity Type: <span className="font-semibold text-indigo-600">{type}</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 -mr-1"
            aria-label="Close modal"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8 scrollbar-thin scrollbar-thumb-slate-400 scrollbar-thumb-rounded-full scrollbar-track-slate-100 hover:scrollbar-thumb-slate-500">
          <div className="min-h-full max-w-full prose prose-sm sm:prose leading-relaxed text-slate-700">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
