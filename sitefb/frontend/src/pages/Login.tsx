import { useState } from 'react'
import { Button } from '@/components/ui/button'

const API_BASE = import.meta.env.VITE_API_URL || ''

export default function Login() {
  const [loading, setLoading] = useState(false)
  const login = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/discord/login`, { credentials: 'include' })
      const data = await res.json()
      if (data.auth_url) window.location.href = data.auth_url
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="container min-h-[80vh] grid place-items-center">
      <div className="bg-card border border-border rounded-xl p-6 shadow-soft w-full max-w-md text-center space-y-6">
        <img src="/logo.png" alt="logo" className="mx-auto w-24 h-24" />
        <div>
          <h1 className="text-2xl font-semibold">Connexion</h1>
          <p className="opacity-80 text-sm">Se connecter avec Discord pour accéder au portail.</p>
        </div>
        <Button className="w-full" onClick={login} disabled={loading}>
          {loading ? 'Redirection…' : 'Se connecter avec Discord'}
        </Button>
      </div>
    </div>
  )
}
