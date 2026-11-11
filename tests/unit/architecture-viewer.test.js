import { describe, expect, it } from 'vitest'
import { parseArchitectureDetail, productShapes } from '../../src/client/architecture-viewer.js'

describe('architecture viewer data', () => {
  it('parses real detail objects rather than treating them as SVG', () => {
    expect(parseArchitectureDetail('{"graph":{}}')).toEqual({ graph: {} })
    expect(parseArchitectureDetail('{}')).toEqual({})
    for (const value of [null, 'null', '[]', 'invalid', 3]) {
      expect(() => parseArchitectureDetail(value)).toThrow()
    }
  })
  it('normalizes top-level registry keys without changing SVG data', () => {
    expect(productShapes([{ Name: 'cvm', Data: { d2: '<svg/>', d3: '<svg/>' } }])).toEqual([
      { name: 'cvm', data: { d2: '<svg/>', d3: '<svg/>' } },
    ])
    expect(() => productShapes([])).toThrow()
    expect(() => productShapes(null)).toThrow()
    expect(productShapes([null, { Name: 'cvm' }])).toEqual([{ name: 'cvm' }])
  })
})
