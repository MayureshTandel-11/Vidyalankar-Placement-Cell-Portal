import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { PrimaryButton, StatusMessage } from '../components/ui'
import Footer from '../components/Footer'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Basic validation
    if (!form.email.trim() || !form.password.trim()) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:5001/api/faculty/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }
      login(data.token, data.user)
      toast.success('Logged in successfully')
      navigate('/faculty/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50 p-3 md:p-5">
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md">
        <div className="glass-panel p-8 shadow-lg shadow-slate-200/60">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mb-6 inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-indigo-700"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to role selection
          </button>

          <div className="text-center">
            <h1 className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 bg-clip-text text-2xl font-extrabold text-transparent md:text-3xl">
              Placement Portal
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-600">Faculty sign in</p>
            <p className="mt-1 text-xs text-slate-500">Use your VSIT placement faculty account</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && <StatusMessage type="error" message={error} />}
            <div className="space-y-1.5">
              <label htmlFor="faculty-email" className="block text-sm font-semibold text-slate-700">
                Email
              </label>
              <input
                id="faculty-email"
                className="input-modern w-full"
                type="email"
                autoComplete="username"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="faculty-password" className="block text-sm font-semibold text-slate-700">
                Password
              </label>
              <input
                id="faculty-password"
                className="input-modern w-full"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <PrimaryButton type="submit" loading={loading} disabled={loading} className="w-full py-3">
              Sign in
            </PrimaryButton>
          </form>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
