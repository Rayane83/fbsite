import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/button'

const API_BASE = import.meta.env.VITE_API_URL || ''

export default function Header() {
  const navigate = useNavigate()
  const { entreprise, setEntreprise, enterprises } = useApp()
  const logout = async () => {
    await fetch(`${API_BASE}/api/auth/discord/logout`, { method: 'POST', credentials: 'include' })
    navigate('/')
  }
  const [isSuperadmin, setIsSuperadmin] = useState(false)
  useEffect(() => {
    ;(async () => {
      try {
        const r = await fetch(`${API_BASE}/api/admin/discord-config`, { credentials: 'include' })
        setIsSuperadmin(r.ok)
      } catch {
        setIsSuperadmin(false)
      }
    })()
  }, [])

  return (
    <header className="border-b border-border">
      <div className="container flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="logo" className="w-8 h-8" />
          <Link to="/dashboard" className="font-semibold tracking-wide">
            Flashback Fa
          </Link>
        </div>
        <nav className="flex items-center gap-3 text-sm opacity-90">
          <Link to="/dashboard" className="hover:opacity-100">
            Dashboard
          </Link>
          <Link to="/dotations" className="hover:opacity-100">
            Dotations
          </Link>
          <Link to="/entreprises" className="hover:opacity-100">
            Entreprises
          </Link>
          <Link to="/impots" className="hover:opacity-100">
            Impôts
          </Link>
          <Link to="/documents" className="hover:opacity-100">
            Documents
          </Link>
          <Link to="/archives" className="hover:opacity-100">
            Archives
          </Link>
          <Link to="/blanchiment" className="hover:opacity-100">
            Blanchiment
          </Link>
          <Link to="/staff-config" className="hover:opacity-100">
            Staff
          </Link>
          <Link to="/company-config" className="hover:opacity-100">
            Company
          </Link>
          {isSuperadmin && (
            <Link to="/superadmin" className="hover:opacity-100 text-red-300">
              Superadmin
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-2">
          <select className="input" value={entreprise} onChange={e => setEntreprise(e.target.value)}>
            {enterprises.length ? (
              enterprises.map(e => <option key={e.key}>{e.name}</option>)
            ) : (
              <option>EntrepriseA</option>
            )}
          </select>
          <Button onClick={logout}>Déconnexion</Button>
        </div>
      </div>
    </header>
  )
}
