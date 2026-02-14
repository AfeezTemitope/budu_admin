import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Eye, EyeOff, Loader, AlertCircle } from 'lucide-react'
import { authService } from '../../api'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) { setError('Please enter your email and password'); return }
    setLoading(true)
    setError('')
    try {
      await authService.login(email, password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed. Check your credentials.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-befa-green/10 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-befa-green" />
          </div>
          <h1 className="text-xl font-bold text-white">BEFA Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to the management portal</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-400">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@befa.com"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-500 hover:border-zinc-600 focus:border-befa-green/60 focus:ring-1 focus:ring-befa-green/25 outline-hidden transition-colors" autoFocus />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-400">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 pr-10 text-sm text-white placeholder:text-gray-500 hover:border-zinc-600 focus:border-befa-green/60 focus:ring-1 focus:ring-befa-green/25 outline-hidden transition-colors"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin(e)} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button onClick={handleLogin} disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-befa-green text-black text-sm font-semibold rounded-lg hover:bg-befa-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
            {loading ? (<><Loader className="w-4 h-4 animate-spin" />Signing in...</>) : 'Sign In'}
          </button>
        </div>
        <p className="text-center text-[11px] text-gray-600 mt-6">Budu Elite Football Academy © {new Date().getFullYear()}</p>
      </div>
    </div>
  )
}