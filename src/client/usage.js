export function creditNumber(value) {
  if (value === null || value === undefined || value === '') return null
  const number = Number(value)
  return Number.isFinite(number) && number >= 0 ? number : null
}

export function creditPercent(used, total) {
  const u = creditNumber(used)
  const t = creditNumber(total)
  return u === null || t === null || t === 0 ? 0 : Math.min(100, Math.max(0, Math.round(u / t * 100)))
}

const STYLE = `
.cq-usage { color:var(--dsw-alias-label-primary,#252a30); font-size:13px; background:var(--dsw-alias-bg-sub,#f5f6fa); padding:8px; border-radius:12px; }
.cq-usage * { box-sizing:border-box; }
.cq-usage h2 { font-size:16px; margin:8px 0 16px; }
.cq-usage h3 { font-size:14px; margin:24px 0 12px; }
.cq-usage h4 { font-size:15px; margin:0 0 6px; }
.cq-usage-card { padding:18px; background:var(--dsw-alias-bg-card,#fff); border:1px solid var(--dsw-alias-border-l2,#e4e7ed); border-radius:12px; }
.cq-usage-row { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; }
.cq-usage-muted { color:var(--dsw-alias-label-secondary,#808794); font-size:12px; line-height:1.7; }
.cq-usage-actions { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
.cq-usage button,.cq-usage select,.cq-usage input,.cq-usage a { font:inherit; }
.cq-usage button,.cq-usage select,.cq-usage input { padding:6px 9px; border:1px solid var(--dsw-alias-border-l2,#e4e7ed); border-radius:6px; background:var(--dsw-alias-bg-card,#fff); color:inherit; }
.cq-usage button { cursor:pointer; font-size:12px; line-height:18px; transition:background .15s,border-color .15s; }
.cq-usage button:hover:not(:disabled) { background:var(--dsw-alias-interactive-bg-hover,#f5f7fa); }
.cq-usage button:focus-visible { outline:2px solid var(--dsw-alias-state-business-primary,#006eff); outline-offset:2px; }
.cq-usage-range-picker { position:relative; flex:none; }
.cq-usage button.cq-usage-range-trigger { display:flex; gap:16px; align-items:center; min-width:112px; height:32px; padding:0 12px; text-align:left; border-radius:6px; }
.cq-usage-range-trigger::after { content:''; width:5px; height:5px; border-right:1.5px solid currentColor; border-bottom:1.5px solid currentColor; transform:rotate(45deg) translateY(-2px); margin-left:auto; opacity:.6; }
.cq-usage-range-trigger[aria-expanded=true] { border-color:var(--dsw-alias-state-business-primary,#006eff); }
.cq-usage-range-menu { position:absolute; top:calc(100% + 6px); left:0; z-index:10; min-width:160px; padding:5px; border:1px solid var(--dsw-alias-border-l2,#e4e7ed); border-radius:8px; background:var(--dsw-alias-bg-card,#fff); box-shadow:0 6px 24px #0000001a; }
.cq-usage-range-menu[hidden],.cq-usage-custom-range[hidden] { display:none; }
.cq-usage-range-menu button { display:flex; align-items:center; width:100%; min-height:32px; padding:6px 10px; border:0; border-radius:4px; text-align:left; }
.cq-usage-range-menu button[aria-selected=true] { background:var(--dsw-alias-interactive-bg-hover,#eef5ff); color:var(--dsw-alias-state-business-primary,#006eff); }
.cq-usage-range-menu button[aria-selected=true]::after { content:'✓'; margin-left:auto; font-size:12px; }
.cq-usage-custom-range { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.cq-usage-custom-range input { height:32px; padding:0 8px; font-size:12px; min-width:0; border-radius:6px; color-scheme:light; }
body[data-ds-dark-theme] .cq-usage-custom-range input { color-scheme:dark; }
.cq-usage button.cq-usage-query { height:32px; padding:0 14px; color:#fff; background:var(--dsw-alias-state-business-primary,#006eff); border-color:transparent; }
.cq-usage button.cq-usage-query:hover { filter:brightness(1.08); background:var(--dsw-alias-state-business-primary,#006eff); }
.cq-usage button:disabled { opacity:.5; cursor:default; }
.cq-usage a { color:var(--dsw-alias-state-business-primary,#006eff); text-decoration:none; }
.cq-usage a.cq-usage-primary { padding:7px 12px; border-radius:6px; background:var(--dsw-alias-label-primary,#252a30); color:var(--dsw-alias-bg-card,#fff); }
.cq-usage-meter { margin-top:22px; }
.cq-usage-meter progress { display:block; width:100%; height:5px; margin-top:8px; border:0; border-radius:8px; overflow:hidden; appearance:none; background:var(--dsw-alias-interactive-bg-hover,#eff1f4); }
.cq-usage-meter progress::-webkit-progress-bar { background:var(--dsw-alias-interactive-bg-hover,#eff1f4); }
.cq-usage-meter progress::-webkit-progress-value { background:#94cbbb; border-radius:8px; }
.cq-usage-meter progress::-moz-progress-bar { background:#94cbbb; }
.cq-usage-pack { padding:14px 0; border-bottom:1px solid var(--dsw-alias-border-l2,#e4e7ed); }
.cq-usage-pack:last-child { border-bottom:0; }
.cq-usage-pack.is-inactive { opacity:.55; }
.cq-usage-table-wrap { overflow-x:auto; margin-top:14px; }
.cq-usage table { width:100%; border-collapse:collapse; min-width:460px; font-size:12px; }
.cq-usage th { background:var(--dsw-alias-interactive-bg-hover,#f7f8fa); font-weight:500; text-align:left; }
.cq-usage td,.cq-usage th { padding:12px 9px; border-bottom:1px solid var(--dsw-alias-border-l2,#e4e7ed); }
.cq-usage td:first-child { max-width:240px; overflow-wrap:anywhere; }
.cq-usage td:last-child { text-align:right; white-space:nowrap; }
.cq-usage-pagination { display:flex; gap:10px; justify-content:flex-end; align-items:center; margin-top:14px; }
.cq-usage-error { color:var(--dsw-alias-state-error-text,#c53c36); line-height:1.6; margin-bottom:10px; }
`

export function mountUsage(container, request) {
  let disposed = false
  let sequence = 0
  let page = 0
  let total = 0
  const limit = 10
  const node = (tag, text, cls = '') => {
    const el = document.createElement(tag)
    el.className = cls
    if (text !== undefined) el.textContent = String(text)
    return el
  }
  const number = value => creditNumber(value) === null ? '—' : creditNumber(value).toLocaleString('zh-CN', { maximumFractionDigits: 2 })
  const link = (text, href, primary = false) => {
    const el = node('a', text, primary ? 'cq-usage-primary' : '')
    el.href = href
    el.target = '_blank'
    el.rel = 'noopener noreferrer'
    el.title = '请核对控制台登录账号与插件凭证所属账号一致'
    return el
  }
  const button = (text, testid, click) => {
    const el = node('button', text)
    el.type = 'button'
    el.dataset.testid = testid
    el.addEventListener('click', click)
    return el
  }
  const active = () => !disposed && root.isConnected
  const meter = (used, maximum, remaining) => {
    const box = node('div', undefined, 'cq-usage-meter')
    const row = node('div', undefined, 'cq-usage-row')
    row.append(node('span', `${number(used)} / ${number(maximum)} 积分`), node('span', `${number(remaining)} 剩余`))
    const progress = node('progress')
    progress.max = 100
    progress.value = creditPercent(used, maximum)
    progress.setAttribute('aria-label', '积分使用比例')
    box.append(row, progress)
    return box
  }
  const root = node('section', undefined, 'cq-usage')
  const style = node('style', STYLE)
  const plan = node('div', '正在加载套餐…', 'cq-usage-card')
  const packs = node('div', '正在加载加量包…', 'cq-usage-card')
  const details = node('div', undefined, 'cq-usage-card')
  root.append(style, node('h2', '套餐和用量'), node('h3', '订阅计划'), plan, node('h3', '积分加量包'), packs, node('h3', '用量明细'), details)
  container.replaceChildren(root)

  const loadCredits = async () => {
    plan.textContent = '正在加载套餐…'
    packs.textContent = '正在加载加量包…'
    try {
      const result = await request('/api/dsh-cloudq/credits')
      if (!active()) return
      const data = result?.credits
      if (!data || ![0, 1, 2, 3].includes(data.Status)) throw new Error('套餐信息不完整，请稍后重试。')
      const status = data.Status
      const row = node('div', undefined, 'cq-usage-row')
      const info = node('div')
      info.append(node('h4', data.ResourceName || (status === 0 ? '免费体验版' : '订阅套餐')),
        node('div', status === 0 ? '积分刷新时间：每月 1 日' : `到期时间：${data.ExpireTime || '—'} · ${['', '使用中', '即将到期', '已过期'][status]}`, 'cq-usage-muted'))
      const actions = node('div', undefined, 'cq-usage-actions')
      actions.append(link('前往购买页', 'https://buy.cloud.tencent.com/advisor?lang=zh'),
        link(status === 0 || status === 3 ? '升级套餐' : '管理套餐', 'https://console.cloud.tencent.com/advisor/cloudq?tab=usage', true))
      row.append(info, actions)
      plan.replaceChildren(row, meter(data.PlanUsed, data.PlanTotal, data.PlanRemain),
        node('p', '购买和续费在官方页面完成，请核对登录账号与插件凭证所属账号一致。', 'cq-usage-muted'))
      if (status === 3) plan.append(node('p', '订阅已过期，历史套餐额度不可用，请前往控制台确认当前可用额度。', 'cq-usage-muted'))
      packs.replaceChildren()
      const packActions = node('div', undefined, 'cq-usage-row')
      packActions.append(node('span', `加量包累计使用 ${number(data.PackUsed)} / ${number(data.PackTotal)} 积分`, 'cq-usage-muted'))
      if (status === 1 || status === 2) packActions.append(link('购买加量包', 'https://buy.cloud.tencent.com/advisor?mode=credit&lang=zh', true))
      else {
        const disabled = button('升级后可购买', 'cloudq-pack-disabled', () => {})
        disabled.disabled = true
        packActions.append(disabled)
      }
      packs.append(packActions)
      const items = Array.isArray(data.ActivePacks) ? data.ActivePacks : []
      for (const item of items) {
        if (!item || typeof item !== 'object') continue
        const pack = node('div', undefined, `cq-usage-pack${item.Status === 1 ? '' : ' is-inactive'}`)
        const remaining = creditNumber(item.Total) === null || creditNumber(item.Used) === null ? null : Math.max(0, Number(item.Total) - Number(item.Used))
        pack.append(node('div', `${({ 1: '生效中', 2: '已耗尽', 3: '已过期', 4: '已退费', 5: '已冻结' })[item.Status] || '状态未知'} · 到期时间：${item.ExpireTime || '—'}`, 'cq-usage-muted'), meter(item.Used, item.Total, remaining))
        packs.append(pack)
      }
      if (!items.length) packs.append(node('p', status === 0 || status === 3 ? '升级订阅版本后可购买积分加量包。' : '暂无有效加量包。', 'cq-usage-muted'))
      plan.append(button('刷新套餐', 'cloudq-plan-refresh', () => { void loadCredits() }))
    } catch (error) {
      if (!active()) return
      plan.replaceChildren(node('div', `套餐信息加载失败：${error?.message || '未知错误'}`, 'cq-usage-error'), button('重试', 'cloudq-plan-retry', () => { void loadCredits() }))
      packs.textContent = '套餐信息暂不可用，无法确定加量包购买资格。'
    }
  }

  const dateString = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  const today = new Date()
  const end = node('input')
  const start = node('input')
  for (const [input, name] of [[start, '开始日期'], [end, '结束日期']]) {
    input.type = 'date'
    input.setAttribute('aria-label', name)
    input.max = dateString(today)
  }
  end.value = dateString(today)
  const initial = new Date(today)
  initial.setDate(initial.getDate() - 29)
  start.value = dateString(initial)
  const filter = node('div', undefined, 'cq-usage-actions')
  const ranges = node('div', undefined, 'cq-usage-range-picker')
  const rangeTrigger = button('最近 1 月', 'cloudq-usage-range', () => {
    const open = rangeMenu.hidden
    rangeMenu.hidden = !open
    rangeTrigger.setAttribute('aria-expanded', String(open))
    if (open) rangeMenu.querySelector('[aria-selected="true"]')?.focus()
  })
  rangeTrigger.className = 'cq-usage-range-trigger'
  rangeTrigger.setAttribute('aria-haspopup', 'listbox')
  rangeTrigger.setAttribute('aria-expanded', 'false')
  const rangeMenu = node('div', undefined, 'cq-usage-range-menu')
  rangeMenu.setAttribute('role', 'listbox')
  rangeMenu.setAttribute('aria-label', '时间范围')
  rangeMenu.hidden = true
  const custom = node('div', undefined, 'cq-usage-custom-range')
  custom.hidden = true
  const closeRange = () => {
    rangeMenu.hidden = true
    rangeTrigger.setAttribute('aria-expanded', 'false')
  }
  for (const [value, label] of [['30', '最近 1 月'], ['7', '最近 7 天'], ['1', '今天'], ['custom', '自定义时间']]) {
    const option = button(label, `cloudq-usage-range-${value}`, () => {
      for (const item of rangeMenu.children) item.setAttribute('aria-selected', String(item === option))
      rangeTrigger.textContent = label
      custom.hidden = value !== 'custom'
      closeRange()
      rangeTrigger.focus()
      if (value === 'custom') {
        start.focus()
        return
      }
      const current = new Date()
      end.value = dateString(current)
      current.setDate(current.getDate() - Number(value) + 1)
      start.value = dateString(current)
      page = 0
      void loadDetails()
    })
    option.setAttribute('role', 'option')
    option.setAttribute('aria-selected', String(value === '30'))
    rangeMenu.append(option)
  }
  const outside = (event) => { if (!ranges.contains(event.target)) closeRange() }
  const keyboard = (event) => {
    if (rangeMenu.hidden) return
    if (event.key === 'Escape') {
      event.preventDefault()
      closeRange()
      rangeTrigger.focus()
    } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault()
      const options = [...rangeMenu.children]
      const index = options.indexOf(document.activeElement)
      const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1
        : (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length
      options[nextIndex].focus()
    }
  }
  document.addEventListener('pointerdown', outside)
  ranges.addEventListener('keydown', keyboard)
  ranges.addEventListener('focusout', (event) => { if (!ranges.contains(event.relatedTarget)) closeRange() })
  ranges.append(rangeTrigger, rangeMenu)
  const rows = node('div', undefined, 'cq-usage-table-wrap')
  const pagination = node('div', undefined, 'cq-usage-pagination')
  const pageText = node('span')
  const prev = button('上一页', 'cloudq-usage-prev', () => { page--; void loadDetails() })
  const next = button('下一页', 'cloudq-usage-next', () => { page++; void loadDetails() })
  const query = button('查询', 'cloudq-usage-query', () => { page = 0; void loadDetails() })
  start.dataset.testid = 'cloudq-usage-start'
  end.dataset.testid = 'cloudq-usage-end'
  query.className = 'cq-usage-query'
  custom.append(start, node('span', '至', 'cq-usage-muted'), end, query)
  filter.append(ranges, custom)
  pagination.append(prev, pageText, next)
  details.append(filter, node('p', '数据同步存在一定延迟（30 分钟内）', 'cq-usage-muted'), rows, pagination)
  const loadDetails = async () => {
    const seq = ++sequence
    const from = Date.parse(start.value)
    const to = Date.parse(end.value)
    prev.disabled = true
    next.disabled = true
    pageText.textContent = ''
    if (!Number.isFinite(from) || !Number.isFinite(to) || from > to || to - from > 30 * 86400000 || end.value > dateString(new Date())) {
      rows.replaceChildren(node('div', '请选择有效日期，起止跨度不能超过31天，结束日期不能晚于今天。', 'cq-usage-error'))
      return
    }
    rows.textContent = '正在加载用量明细…'
    try {
      const params = new URLSearchParams({ start: `${start.value} 00:00:00`, end: `${end.value} 23:59:59`, limit: String(limit), offset: String(page * limit), detailOnly: 'true' })
      const result = await request(`/api/dsh-cloudq/usage?${params}`)
      if (!active() || seq !== sequence) return
      total = creditNumber(result?.total) ?? 0
      const entries = Array.isArray(result?.detail) ? result.detail : []
      const table = node('table')
      const head = node('thead')
      const tr = node('tr')
      for (const text of ['提问', '来源', '时间', '积分消耗']) tr.append(node('th', text))
      head.append(tr)
      const body = node('tbody')
      for (const item of entries) {
        if (!item || typeof item !== 'object') continue
        const row = node('tr')
        for (const text of [item.Message || '—', item.Channel || '—', item.StartTime || '—', number(item.Credits)]) row.append(node('td', text))
        body.append(row)
      }
      table.append(head, body)
      rows.replaceChildren(entries.length ? table : node('p', '所选时间范围暂无用量记录。', 'cq-usage-muted'))
      prev.disabled = page === 0
      next.disabled = (page + 1) * limit >= total
      pageText.textContent = `第 ${page + 1} / ${Math.max(1, Math.ceil(total / limit))} 页 · 共 ${total} 条`
    } catch (error) {
      if (!active() || seq !== sequence) return
      rows.replaceChildren(node('div', `明细加载失败：${error?.message || '未知错误'}`, 'cq-usage-error'), button('重试', 'cloudq-usage-retry', () => { void loadDetails() }))
    }
  }
  void loadCredits()
  void loadDetails()
  return () => {
    disposed = true
    sequence++
    document.removeEventListener('pointerdown', outside)
    root.remove()
  }
}
