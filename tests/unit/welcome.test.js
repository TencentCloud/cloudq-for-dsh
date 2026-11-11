import { describe, expect, it } from 'vitest'
import { groupInspirations } from '../../src/client/welcome.js'

describe('welcome inspiration categories', () => {
  it('handles absent and malformed responses', () => {
    for (const value of [null, undefined, {}, 'invalid', [null, {}, { Title: 'x', Prompt: '' }]]) {
      expect(groupInspirations(value)).toEqual([])
    }
  })

  it('sorts dynamic categories and preserves the upstream prompts', () => {
    const first = { Category: 2, CategoryName: '架构治理', Title: '架构评估', Prompt: '评估架构', Description: '查看风险' }
    const second = { Category: 1, CategoryName: 'FinOps', Title: '成本分析', Prompt: '分析成本' }
    const third = { ...first, Title: '架构详情', Prompt: '查看详情' }
    expect(groupInspirations([first, second, third])).toEqual([
      { id: 1, name: 'FinOps', items: [second] },
      { id: 2, name: '架构治理', items: [first, third] },
    ])
  })

  it('ignores unusable prompts and invalid category identifiers', () => {
    expect(groupInspirations([
      { Category: 'wrong', Title: 'x', Prompt: 'hello' },
      { Category: 1, Title: 'x', Prompt: '   ' },
      { Category: 1, Title: 123, Prompt: 'hello' },
    ])).toEqual([])
  })

  it('supports numeric strings without inventing business categories', () => {
    const item = { Category: '8', Title: '测试', Prompt: '测试问题' }
    expect(groupInspirations([item])).toEqual([{ id: 8, name: '推荐问题', items: [item] }])
  })
})
