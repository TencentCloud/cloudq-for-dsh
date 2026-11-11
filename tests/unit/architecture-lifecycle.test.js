import { afterEach, describe, expect, it, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { mountArchitectureViewer } from '../../src/client/architecture-viewer.js'

class Element {
  children = []
  dataset = {}
  attributes = {}
  events = {}
  classList = { add: vi.fn(), remove: vi.fn() }
  append(...nodes) { this.children.push(...nodes) }
  replaceChildren(...nodes) { this.children = nodes }
  setAttribute(key, value) { this.attributes[key] = value }
  addEventListener(key, handler) { this.events[key] = handler }
  remove() { this.removed = true }
  focus() {}
}

function setup(ready = Promise.resolve()) {
  const editor = {
    ready: vi.fn(() => ready), destroy: vi.fn(), loadShapes: vi.fn(), setUneditable: vi.fn(),
    initWithTPLGraphData: vi.fn((_, options) => { options.callback(); return true }),
    zoomGraphFit: vi.fn(), refreshViewport: vi.fn(), setDarkMode: vi.fn(), resetDarkMode: vi.fn(),
    getMode: vi.fn(() => 'SIGMA_GRAPH_MODE_2D'),
  }
  let dark = true
  const observers = []
  class Observer {
    disconnect = vi.fn()
    observe = vi.fn()
    constructor(callback) { this.callback = callback; observers.push(this) }
  }
  const doc = {
    createElement: () => new Element(), createElementNS: () => new Element(),
    addEventListener: vi.fn(), removeEventListener: vi.fn(),
    body: { hasAttribute: () => dark }, fullscreenElement: null,
  }
  vi.stubGlobal('document', doc)
  vi.stubGlobal('window', { Tessera: { default: class { constructor() { return editor } } }, setTimeout, clearTimeout })
  vi.stubGlobal('MutationObserver', Observer)
  vi.stubGlobal('ResizeObserver', Observer)
  const container = new Element()
  const request = vi.fn(async url => url.includes('/detail') ? { data: { Detail: '{"graph":{}}' } }
    : { data: { ProductDiagramList: [{ Name: 'cvm' }] } })
  const dispose = mountArchitectureViewer(container, { archId: 'arch-test', name: 'Test', request, onBack: vi.fn() })
  return { editor, observers, doc, container, dispose, setDark: value => { dark = value } }
}
const settle = async () => { for (let i = 0; i < 12; i++) await Promise.resolve() }
afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers() })

describe('read-only viewer lifecycle', () => {
  it('applies live themes and releases the renderer and observers', async () => {
    const env = setup()
    await settle()
    expect(env.editor.setUneditable).toHaveBeenCalledOnce()
    expect(env.editor.setDarkMode).toHaveBeenCalledOnce()
    env.setDark(false)
    env.observers[0].callback()
    expect(env.editor.resetDarkMode).toHaveBeenCalledOnce()
    env.dispose()
    expect(env.editor.destroy).toHaveBeenCalledOnce()
    for (const observer of env.observers) expect(observer.disconnect).toHaveBeenCalledOnce()
    expect(env.doc.removeEventListener).toHaveBeenCalledWith('fullscreenchange', expect.any(Function))
    expect(env.container.classList.remove).toHaveBeenCalledWith('cq-arch-detail-body')
  })
  it('times out a renderer that never becomes ready', async () => {
    vi.useFakeTimers()
    const env = setup(new Promise(() => {}))
    await settle()
    await vi.advanceTimersByTimeAsync(15001)
    expect(env.editor.destroy).toHaveBeenCalledOnce()
    expect(env.editor.loadShapes).not.toHaveBeenCalled()
    env.dispose()
  })
  it('unmount during initialization does not later render a graph', async () => {
    let resolveReady
    const env = setup(new Promise(resolve => { resolveReady = resolve }))
    await settle()
    env.dispose()
    resolveReady()
    await settle()
    expect(env.editor.destroy).toHaveBeenCalledOnce()
    expect(env.editor.initWithTPLGraphData).not.toHaveBeenCalled()
  })
  it('ships only editor-scoped keydown registration', () => {
    const runtime = readFileSync(new URL('../../assets/tessera/editor.js', import.meta.url), 'utf8')
    expect(runtime).toContain("add(el, 'keydown', this.onKeyDown)")
    expect(runtime).not.toContain("add(window, 'keydown', this.onKeyDown)")
  })
})
