import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import AppToaster from '@/components/ui/toaster'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useApp } from '@/context/AppContext'
import { toCSV, download } from '@/utils/export'
import { toast } from 'sonner'
import { useMe } from '@/hooks/useMe'
import Login from './Login'

const API_BASE = import.meta.env.VITE_API_URL || ''

export default function DotationsPage() {
  const { me, loading } = useMe()
  const { entreprise, guildId } = useApp()
  if (loading) return <div className="container py-6">Chargement…</div>
  if (!me) return <Login />
  return (
    <div>
      <Header />
      <main className="container py-6">
        <Dotations entreprise={entreprise} guildId={guildId} />
      </main>
      <AppToaster />
    </div>
  )
}

function Dotations({ entreprise, guildId }: { entreprise: string; guildId: string }) {
  const [rows, setRows] = useState<any[]>([])
  const [meta, setMeta] = useState<any>({ solde_actuel: 0, expenses: 0, withdrawals: 0, commissions: 0, inter_invoices: 0 })
  const [config, setConfig] = useState<any>({
    salaire_pourcentage: 0.1,
    prime_paliers: [
      { min: 1000, prime: 50 },
      { min: 3000, prime: 150 }
    ]
  })
  useEffect(() => {
    ;(async () => {
      const res = await fetch(`${API_BASE}/api/dotation/${guildId}?entreprise=${encodeURIComponent(entreprise)}`, {
        credentials: 'include'
      })
      const data = await res.json()
      setRows(data.rows || [])
      if (data.meta) setMeta(data.meta)
    })()
  }, [entreprise])

  const computePrime = (ca: number) => {
    const eligible = config.prime_paliers.filter((p: any) => ca >= p.min).map((p: any) => p.prime)
    return eligible.length ? Math.max(...eligible) : 0
  }

  const exportCSV = () => {
    const mapped = rows.map(r => {
      const ca_total = Number(r.run || 0) + Number(r.facture || 0) + Number(r.vente || 0)
      const salaire = Number((ca_total * Number(config.salaire_pourcentage || 0)).toFixed(2))
      const prime = computePrime(ca_total)
      return {
        Employe: r.name,
        Run: r.run,
        Facture: r.facture,
        Vente: r.vente,
        CA_Total: ca_total,
        Salaire: salaire,
        Prime: prime
      }
    })
    download(`dotations_${entreprise}.csv`, toCSV(mapped), 'text/csv')
    toast.success('Export CSV généré')
  }

  const save = async () => {
    const payload = { entreprise, rows: rows.map(({ id, ca_total, salaire, prime, ...rest }) => rest), config, ...meta }
    const res = await fetch(`${API_BASE}/api/dotation/${guildId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    })
    const data = await res.json()
    toast.success(`Sauvé: CA ${data.totals.ca_total} | Salaire ${data.totals.salaire} | Prime ${data.totals.prime}`)
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-soft space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Dotations</h2>
        <div className="flex gap-2">
          <Button onClick={exportCSV} variant="outline">
            Exporter CSV
          </Button>
          <Button onClick={save}>Enregistrer</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <label className="text-sm opacity-80">
          Solde actuel
          <Input
            className="w-full"
            type="number"
            value={meta.solde_actuel}
            onChange={e => setMeta({ ...meta, solde_actuel: parseFloat(e.target.value) })}
          />
        </label>
        <label className="text-sm opacity-80">
          Dépenses
          <Input
            className="w-full"
            type="number"
            value={meta.expenses}
            onChange={e => setMeta({ ...meta, expenses: parseFloat(e.target.value) })}
          />
        </label>
        <label className="text-sm opacity-80">
          Retraits
          <Input
            className="w-full"
            type="number"
            value={meta.withdrawals}
            onChange={e => setMeta({ ...meta, withdrawals: parseFloat(e.target.value) })}
          />
        </label>
        <label className="text-sm opacity-80">
          Commissions
          <Input
            className="w-full"
            type="number"
            value={meta.commissions}
            onChange={e => setMeta({ ...meta, commissions: parseFloat(e.target.value) })}
          />
        </label>
        <label className="text-sm opacity-80">
          Inter-factures
          <Input
            className="w-full"
            type="number"
            value={meta.inter_invoices}
            onChange={e => setMeta({ ...meta, inter_invoices: parseFloat(e.target.value) })}
          />
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="opacity-80 text-left">
            <tr>
              <th className="p-2">Nom</th>
              <th className="p-2">Run</th>
              <th className="p-2">Facture</th>
              <th className="p-2">Vente</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="border-t border-border">
                <td className="p-2">
                  <Input
                    className="w-full"
                    value={row.name}
                    onChange={e => {
                      const v = e.target.value
                      setRows(r => r.map((x, i) => (i === idx ? { ...x, name: v } : x)))
                    }}
                  />
                </td>
                <td className="p-2">
                  <Input
                    className="w-full"
                    type="number"
                    value={row.run}
                    onChange={e => {
                      const v = parseFloat(e.target.value || '0')
                      setRows(r => r.map((x, i) => (i === idx ? { ...x, run: v } : x)))
                    }}
                  />
                </td>
                <td className="p-2">
                  <Input
                    className="w-full"
                    type="number"
                    value={row.facture}
                    onChange={e => {
                      const v = parseFloat(e.target.value || '0')
                      setRows(r => r.map((x, i) => (i === idx ? { ...x, facture: v } : x)))
                    }}
                  />
                </td>
                <td className="p-2">
                  <Input
                    className="w-full"
                    type="number"
                    value={row.vente}
                    onChange={e => {
                      const v = parseFloat(e.target.value || '0')
                      setRows(r => r.map((x, i) => (i === idx ? { ...x, vente: v } : x)))
                    }}
                  />
                </td>
                <td className="p-2 text-right">
                  <Button onClick={() => setRows(r => r.filter((_, i) => i !== idx))}>Supprimer</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <Button onClick={() => setRows(r => [...r, { name: '', run: 0, facture: 0, vente: 0 }])}>Ajouter une ligne</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="text-sm opacity-80">
          % Salaire sur CA
          <Input
            className="w-full"
            type="number"
            step="0.01"
            min={0}
            max={1}
            value={config.salaire_pourcentage}
            onChange={e => setConfig({ ...config, salaire_pourcentage: parseFloat(e.target.value) })}
          />
        </label>
        <div className="text-sm opacity-80">
          Paliers prime (ex: 1000→50, 3000→150)
          <div className="mt-2 space-y-2">
            {config.prime_paliers.map((p: any, i: number) => (
              <div key={i} className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min CA"
                  value={p.min}
                  onChange={e => {
                    const v = parseFloat(e.target.value || '0')
                    setConfig((c: any) => ({
                      ...c,
                      prime_paliers: c.prime_paliers.map((x: any, ix: number) => (ix === i ? { ...x, min: v } : x))
                    }))
                  }}
                />
                <Input
                  type="number"
                  placeholder="Prime"
                  value={p.prime}
                  onChange={e => {
                    const v = parseFloat(e.target.value || '0')
                    setConfig((c: any) => ({
                      ...c,
                      prime_paliers: c.prime_paliers.map((x: any, ix: number) => (ix === i ? { ...x, prime: v } : x))
                    }))
                  }}
                />
              </div>
            ))}
            <Button onClick={() => setConfig((c: any) => ({ ...c, prime_paliers: [...c.prime_paliers, { min: 0, prime: 0 }] }))}>
              Ajouter palier
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
