import { describe, expect, it } from 'vitest'
import { creditNumber, creditPercent } from '../../src/client/usage.js'

describe('credit display values', () => {
  it('keeps unavailable quotas distinct from zero', () => {
    for (const value of [null, undefined, '', 'invalid', Infinity, -1]) expect(creditNumber(value)).toBeNull()
    expect(creditNumber(0)).toBe(0)
    expect(creditNumber('1000')).toBe(1000)
  })
  it('bounds credit progress and handles missing quotas', () => {
    expect(creditPercent(393.94, 1000)).toBe(39)
    expect(creditPercent(2000, 1000)).toBe(100)
    expect(creditPercent(0, 0)).toBe(0)
    expect(creditPercent(null, 1000)).toBe(0)
    expect(creditPercent(10, undefined)).toBe(0)
    expect(creditPercent(-1, 1000)).toBe(0)
  })
})
