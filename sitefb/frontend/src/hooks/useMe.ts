import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || ''

export function useMe() {
  const [me, setMe] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/discord/me`, { credentials: 'include' })
        if (res.ok) setMe(await res.json())
      } finally {
        setLoading(false)
      }
    })()
  }, [])
  return { me, loading }
}
