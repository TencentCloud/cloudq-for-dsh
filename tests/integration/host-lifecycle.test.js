import { describe, expect, it, vi } from 'vitest'
import { apply, inject } from '../../src/index.js'

describe('CloudQ Host lifecycle', () => {
  it('registers every contribution through effects and disposes it', () => {
    const disposers = []
    const routeDisposers = []
    const settingsDisposers = []
    const skillDisposer = vi.fn()
    const routes = []
    const ctx = {
      baseUrl: new URL('file:///tmp/dsh-profile/').href,
      effect(factory) {
        const dispose = factory()
        if (typeof dispose === 'function') disposers.push(dispose)
      },
      settings: {
        register: vi.fn(() => {
          const dispose = vi.fn()
          settingsDisposers.push(dispose)
          return dispose
        }),
      },
      skills: {
        register: vi.fn(() => skillDisposer),
      },
      webServer: {
        register: vi.fn((route) => {
          routes.push(route)
          const dispose = vi.fn()
          routeDisposers.push(dispose)
          return dispose
        }),
      },
    }

    apply(ctx)

    expect(inject).toEqual(['skills', 'webServer', 'settings', 'sessionQuery'])
    expect(ctx.settings.register).toHaveBeenCalledTimes(2)
    expect(ctx.skills.register).toHaveBeenCalledOnce()
    expect(routes.map(route => route.path)).toContain('/api/dsh-cloudq/credential')
    expect(routes.map(route => route.path)).toContain('/api/dsh-cloudq/plugins/toggle')
    expect(routes.map(route => route.path)).toContain('/api/dsh-cloudq/architecture/list')

    for (const dispose of disposers.reverse()) dispose()
    for (const dispose of settingsDisposers) expect(dispose).toHaveBeenCalledOnce()
    expect(skillDisposer).toHaveBeenCalledOnce()
    for (const dispose of routeDisposers) expect(dispose).toHaveBeenCalledOnce()
  })
})
