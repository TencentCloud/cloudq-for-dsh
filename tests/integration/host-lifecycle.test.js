import { describe, expect, it, vi } from 'vitest'
import { apply, inject } from '../../src/index.js'

describe('CloudQ Host lifecycle', () => {
  it('registers every contribution through effects and disposes it', () => {
    const effectDisposers = []
    const routeDisposers = []
    const settingsDisposers = []
    const skillDisposer = vi.fn()
    const routes = []
    const ctx = {
      baseUrl: new URL('file:///tmp/dsh-profile/').href,
      // Mirror Cordis fiber semantics: the effect callback's direct return
      // value must be a disposer; registrations inside the callback are
      // collected by Cordis itself. Returning a register() result from an
      // arrow function causes Cordis to reject the effect as invalid.
      effect(factory, label) {
        const dispose = factory()
        if (typeof dispose !== 'function' && dispose !== undefined && dispose !== null) {
          throw new TypeError(`Invalid effect: ${label}`)
        }
        if (typeof dispose === 'function') effectDisposers.push(dispose)
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

    expect(() => apply(ctx)).not.toThrow()

    expect(inject).toEqual(['skills', 'webServer', 'settings', 'sessionQuery'])
    expect(ctx.settings.register).toHaveBeenCalledTimes(2)
    expect(ctx.skills.register).toHaveBeenCalledOnce()
    expect(routes.map(route => route.path)).toContain('/api/dsh-cloudq/credential')
    expect(routes.map(route => route.path)).toContain('/api/dsh-cloudq/plugins/toggle')
    expect(routes.map(route => route.path)).toContain('/api/dsh-cloudq/architecture/list')

    for (const dispose of effectDisposers.reverse()) dispose()
    for (const dispose of routeDisposers) expect(dispose).toHaveBeenCalledOnce()
  })
})
