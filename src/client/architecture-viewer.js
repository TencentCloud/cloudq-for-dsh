export function parseArchitectureDetail(value) {
  const detail = typeof value === 'string' ? JSON.parse(value) : value
  if (!detail || typeof detail !== 'object' || Array.isArray(detail)) throw new Error('架构详情格式不正确')
  return detail
}

export function productShapes(value) {
  if (!Array.isArray(value) || !value.length) throw new Error('产品图元列表为空')
  return value.filter(item => item && typeof item === 'object' && !Array.isArray(item)).map(item =>
    Object.fromEntries(Object.entries(item).filter(([key]) => !['__proto__', 'constructor', 'prototype'].includes(key)).map(([key, val]) => [key.charAt(0).toLowerCase() + key.slice(1), val])))
}

let runtimePromise = null
function loadTessera() {
  if (typeof window.Tessera?.default === 'function') return Promise.resolve(window.Tessera)
  if (runtimePromise) return runtimePromise
  runtimePromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = '/api/dsh-cloudq/tessera/editor.js'
    script.async = true
    const timer = window.setTimeout(() => finish(new Error('渲染引擎加载超时')), 15000)
    const finish = (error) => {
      window.clearTimeout(timer)
      script.onload = null
      script.onerror = null
      if (error) { script.remove(); reject(error) }
      else resolve(window.Tessera)
    }
    script.onload = () => finish(typeof window.Tessera?.default === 'function' ? null : new Error('渲染引擎不可用'))
    script.onerror = () => finish(new Error('渲染引擎加载失败'))
    document.head.append(script)
  }).catch(error => { runtimePromise = null; throw error })
  return runtimePromise
}

export function mountArchitectureViewer(container, { archId, name, request, onBack }) {
  let disposed = false
  let editor = null
  let observer = null
  let timeout = 0
  let rejectFrame = null
  const create = (tag, text, cls = '') => {
    const node = document.createElement(tag)
    node.className = cls
    if (text) node.textContent = text
    return node
  }
  const root = create('section', '', 'cq-arch-viewer')
  const style = create('style', `
.dsh-cloudq-panel__body.cq-arch-detail-body { position:relative; padding:0; overflow:hidden; }
.cq-arch-detail-body > .cq-arch-viewer { position:absolute; inset:0; }
.cq-arch-viewer { min-width:0; min-height:0; background:var(--dsw-alias-bg-card,#fff); border:0; border-radius:0; overflow:hidden; color:var(--dsw-alias-label-primary,#252a30); }
.cq-arch-viewer:fullscreen { height:100vh; width:100vw; border-radius:0; }
.cq-arch-viewer-top { position:absolute; top:12px; left:12px; right:12px; z-index:3; display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap; pointer-events:none; }
.cq-arch-viewer-tools { display:flex; align-items:center; gap:2px; padding:4px; border:1px solid var(--dsw-alias-border-l2,#e4e7ed); border-radius:8px; box-shadow:0 2px 10px #0000000a; background:var(--dsw-alias-bg-card,#fff); pointer-events:auto; }
.cq-arch-viewer-tools button { display:grid; place-items:center; width:32px; height:32px; border:0; border-radius:5px; background:transparent; color:inherit; cursor:pointer; }
.cq-arch-viewer-tools button:hover { background:var(--dsw-alias-interactive-bg-hover,#f3f5f8); }
.cq-arch-viewer-tools button:disabled { opacity:.35; cursor:default; }
.cq-arch-viewer-tools button:focus-visible { outline:2px solid #006eff; }
.cq-arch-viewer-tools button[data-testid=cloudq-arch-mode] { font:600 12px/1 system-ui,sans-serif; }
.cq-arch-tool { position:relative; display:inline-flex; }
.cq-arch-tool-tip { display:none; position:absolute; left:0; top:calc(100% + 8px); z-index:5; width:max-content; max-width:220px; padding:7px 10px; border-radius:6px; background:#20252eee; color:#fff; box-shadow:0 4px 14px #0002; font-size:12px; line-height:18px; white-space:normal; }
.cq-arch-tool:not(.is-tip-dismissed):hover .cq-arch-tool-tip,
.cq-arch-tool:not(.is-tip-dismissed):focus-within .cq-arch-tool-tip { display:block; }
.cq-arch-viewer-top a { align-self:start; padding:10px 12px; border:1px solid var(--dsw-alias-border-l2,#e4e7ed); border-radius:8px; background:var(--dsw-alias-bg-card,#fff); color:var(--dsw-alias-state-business-primary,#006eff); text-decoration:none; font-size:12px; pointer-events:auto; }
.cq-arch-canvas { position:absolute; inset:0; }
.cq-arch-viewer-status { position:absolute; z-index:2; inset:70px 16px 40px; display:flex; align-items:center; justify-content:center; text-align:center; font-size:13px; color:var(--dsw-alias-label-secondary,#737b87); pointer-events:none; }
.cq-arch-viewer-status[hidden] { display:none; }
.cq-arch-viewer-caption { position:absolute; z-index:2; bottom:12px; left:16px; right:16px; font-size:12px; pointer-events:none; color:var(--dsw-alias-label-secondary,#737b87); }
.cq-arch-viewer [id='sigma-c-container'] { display:none !important; }
`)
  const top = create('div', '', 'cq-arch-viewer-top')
  const tools = create('div', '', 'cq-arch-viewer-tools')
  tools.setAttribute('role', 'toolbar')
  tools.setAttribute('aria-label', '只读架构图工具栏')
  const status = create('div', '正在加载架构详情与渲染引擎…', 'cq-arch-viewer-status')
  status.setAttribute('role', 'status')
  const canvas = create('div', '', 'cq-arch-canvas')
  canvas.tabIndex = 0
  canvas.setAttribute('aria-label', '只读架构画布')
  canvas.addEventListener('pointerdown', () => canvas.focus({ preventScroll: true }))
  const controls = []
  const paths = {
    back: 'M15 5l-7 7 7 7',
    fit: 'M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5M8 8h8v8H8z',
    plus: 'M5 12h14M12 5v14',
    minus: 'M5 12h14',
    fullscreen: 'M8 3H3v5M16 3h5v5M21 16v5h-5M8 21H3v-5',
  }
  const button = (key, label, action, needsReady = true) => {
    const node = create('button')
    node.type = 'button'
    const wrapper = create('span', '', 'cq-arch-tool')
    const tooltip = create('span', label, 'cq-arch-tool-tip')
    tooltip.id = `cloudq-arch-tip-${key}`
    tooltip.setAttribute('role', 'tooltip')
    node.setAttribute('aria-describedby', tooltip.id)
    node.setAttribute('aria-label', label)
    node.dataset.testid = `cloudq-arch-${key}`
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('viewBox', '0 0 24 24')
    svg.setAttribute('width', '17')
    svg.setAttribute('height', '17')
    svg.setAttribute('fill', 'none')
    svg.setAttribute('stroke', 'currentColor')
    svg.setAttribute('stroke-width', '1.5')
    const path = document.createElementNS(svg.namespaceURI, 'path')
    if (paths[key]) {
      path.setAttribute('d', paths[key])
      svg.append(path)
      node.append(svg)
    }
    node.disabled = needsReady
    if (needsReady) controls.push(node)
    node.addEventListener('click', async () => {
      try { await action() } catch {
        if (!disposed) { status.hidden = false; status.textContent = '操作未完成，请重试或在云顾问查看。' }
      }
    })
    wrapper.append(node, tooltip)
    wrapper.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') wrapper.classList.add('is-tip-dismissed')
    })
    wrapper.addEventListener('mouseenter', () => wrapper.classList.remove('is-tip-dismissed'))
    wrapper.addEventListener('focusin', () => wrapper.classList.remove('is-tip-dismissed'))
    tools.append(wrapper)
    return { node, tooltip }
  }
  button('back', '返回架构列表', onBack, false)
  const syncMode = () => {
    const current = editor?.getMode?.() === 'SIGMA_GRAPH_MODE_2D' ? '2D' : '3D'
    const target = current === '2D' ? '3D' : '2D'
    mode.node.textContent = current
    const description = `当前为 ${current}，点击切换为 ${target} 视图`
    mode.node.setAttribute('aria-label', description)
    mode.tooltip.textContent = description
  }
  const mode = button('mode', '切换 2D / 3D 视图', () => {
    editor.toggleMode()
    syncMode()
  })
  mode.node.textContent = '3D'
  button('fit', '适应画布', () => editor.zoomGraphFit())
  button('plus', '放大', () => {
    const scale = Number(editor.getGlobalValue()?.scale) || 1
    editor.scaleStep(Math.max(0.05, scale / 1.25) - scale)
  })
  button('minus', '缩小', () => {
    const scale = Number(editor.getGlobalValue()?.scale) || 1
    editor.scaleStep(Math.min(20, scale * 1.25) - scale)
  })
  button('fullscreen', '切换全屏', async () => {
    if (document.fullscreenElement === root) await document.exitFullscreen()
    else await root.requestFullscreen()
  })
  const external = create('a', '在云顾问查看 ↗')
  external.href = `https://console.cloud.tencent.com/advisor?archId=${encodeURIComponent(archId)}`
  external.target = '_blank'
  external.rel = 'noopener noreferrer'
  external.dataset.testid = 'cloudq-arch-console'
  top.append(tools, external)
  root.append(style, canvas, top, status, create('div', `${name || '架构详情'} · 只读模式`, 'cq-arch-viewer-caption'))
  container.classList.add('cq-arch-detail-body')
  container.replaceChildren(root)
  const resize = () => {
    try { editor?.refreshViewport() } catch { /* The renderer may already be disposed. */ }
  }
  let themeObserver = null
  let appliedDark = null
  const syncTheme = () => {
    if (disposed || !editor) return
    const dark = document.body.hasAttribute('data-ds-dark-theme')
    if (dark === appliedDark) return
    try {
      if (dark) editor.setDarkMode()
      else editor.resetDarkMode()
      appliedDark = dark
    } catch {
      status.hidden = false
      status.textContent = '画布主题同步失败，请返回列表后重试。'
    }
  }
  document.addEventListener('fullscreenchange', resize)
  const initialize = async () => {
    try {
      const [runtime, detailResult, shapesResult] = await Promise.all([
        loadTessera(),
        request(`/api/dsh-cloudq/architecture/detail?archId=${encodeURIComponent(archId)}`),
        request('/api/dsh-cloudq/architecture/shapes'),
      ])
      if (disposed) return
      const detail = parseArchitectureDetail(detailResult?.data?.Detail)
      if (!Object.keys(detail).length) { status.textContent = '该架构暂无图形内容。'; return }
      const shapes = productShapes(shapesResult?.data?.ProductDiagramList)
      const TessEditor = runtime.default
      editor = new TessEditor(canvas, { mode: '3d', localSave: false, lang: 'zh', showCategoryLabel: true,
        defaultStyles: { fontSize: 16, geometry: 'manual' }, fitGroupHeader: true, groupTitlePosition: 'outside' })
      const current = editor
      await Promise.race([
        current.ready(),
        new Promise((_, reject) => {
          rejectFrame = reject
          timeout = window.setTimeout(() => reject(new Error('图形引擎初始化超时')), 15000)
        }),
      ])
      window.clearTimeout(timeout)
      rejectFrame = null
      if (disposed) return
      syncTheme()
      themeObserver = new MutationObserver(syncTheme)
      themeObserver.observe(document.body, { attributes: true, attributeFilter: ['data-ds-dark-theme'] })
      current.loadShapes(shapes)
      current.setUneditable()
      await new Promise((resolve, reject) => {
        rejectFrame = reject
        timeout = window.setTimeout(() => reject(new Error('架构渲染超时')), 20000)
        const accepted = current.initWithTPLGraphData(detail, { callback: () => {
          window.clearTimeout(timeout)
          rejectFrame = null
          resolve()
        } })
        if (accepted === false) reject(new Error('架构数据无法渲染'))
      })
      if (disposed) return
      current.zoomGraphFit()
      syncMode()
      status.hidden = true
      controls.forEach(control => { control.disabled = false })
      observer = new ResizeObserver(resize)
      observer.observe(canvas)
    } catch (error) {
      if (disposed) return
      status.hidden = false
      status.textContent = `架构详情加载失败：${error?.message || '当前浏览器无法初始化图形引擎'}。可点击右上角在云顾问查看。`
      themeObserver?.disconnect()
      try { editor?.destroy() } catch { /* Release best effort. */ }
      editor = null
    } finally {
      window.clearTimeout(timeout)
      rejectFrame = null
    }
  }
  void initialize()
  return () => {
    disposed = true
    window.clearTimeout(timeout)
    rejectFrame?.(new Error('viewer disposed'))
    observer?.disconnect()
    themeObserver?.disconnect()
    document.removeEventListener('fullscreenchange', resize)
    if (document.fullscreenElement === root) void document.exitFullscreen().catch(() => {})
    try { editor?.destroy() } catch { /* Release best effort. */ }
    editor = null
    container.classList.remove('cq-arch-detail-body')
    root.remove()
  }
}
