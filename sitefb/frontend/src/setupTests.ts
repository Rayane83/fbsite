import '@testing-library/jest-dom'
import { vi } from 'vitest'

beforeEach(() => {
  vi.spyOn(global, 'fetch').mockImplementation((input: RequestInfo | URL) => {
    const url = typeof input === 'string' ? input : input.toString()
    const data = url.includes('/api/auth/discord/me') ? {} : []
    return Promise.resolve({
      ok: true,
      json: async () => data
    } as any)
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})
