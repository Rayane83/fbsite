import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import AppToaster from '@/components/ui/toaster'
import { useApp } from '@/context/AppContext'
import { useMe } from '@/hooks/useMe'
import Login from './Login'

const API_BASE = import.meta.env.VITE_API_URL || ''

export default function Dashboard() {
  const { me, loading } = useMe()
  const { entreprise } = useApp()
  const [summary, setSummary] = useState<any>(null)
  const guildId = '1404608015230832742'
  useEffect(() => {
    ;(async () => {
      const res = await fetch(
        `${API_BASE}/api/dashboard/summary/${guildId}?entreprise=${encodeURIComponent(entreprise)}`,
        { credentials: 'include' }
      )
      setSummary(await res.json())
    })()
  }, [entreprise])

  if (loading) return <div className="container py-6">Chargement…</div>
  if (!me) return <Login />

  return (
    <div>
      <Header />
      <main className="container py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { k: 'CA Brut', v: summary?.ca_brut },
            { k: 'Dépenses', v: summary?.depenses },
            { k: 'Bénéfice', v: summary?.benefice },
            { k: "Taux d'imposition", v: `${summary?.taux_imposition ?? '—'}%` },
            { k: 'Montant Impôts', v: summary?.montant_impots },
            { k: 'Employés', v: summary?.employee_count }
          ].map((c, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 shadow-soft">
              <div className="opacity-70 text-sm">{c.k}</div>
              <div className="text-2xl font-semibold">{c.v ?? '—'}</div>
            </div>
          ))}
        </div>
      </main>
      <AppToaster />
    </div>
  )
}
