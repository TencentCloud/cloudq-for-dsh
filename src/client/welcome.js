import { openCredentialDialog } from './credential-dialog.js'

export function groupInspirations(value) {
  const groups = new Map()
  for (const item of Array.isArray(value) ? value : []) {
    if (!item || typeof item.Title !== 'string' || typeof item.Prompt !== 'string' || !item.Prompt.trim()) continue
    const category = Number(item.Category)
    if (!Number.isFinite(category)) continue
    if (!groups.has(category)) groups.set(category, { id: category, name: String(item.CategoryName || '推荐问题'), items: [] })
    groups.get(category).items.push(item)
  }
  return [...groups.values()].sort((a, b) => a.id - b.id)
}

const STYLE = `
.dsh-cloudq-welcome-head,
.dsh-cloudq-welcome-bottom { box-sizing:border-box; width:calc(100% - 2 * var(--dsh-composer-side-clearance, 16px)); max-width:var(--dsh-composer-card-max-width, 100%); margin-inline:auto; }
.dsh-cloudq-welcome-head { display:flex; align-items:center; gap:20px; margin-block:0 22px; text-align:left; }
.dsh-cloudq-welcome-avatar { width:72px; height:72px; object-fit:contain; flex:none; }
.dsh-cloudq-welcome-head h1 { margin:0 0 8px; font-size:26px; font-weight:600; color:var(--dsw-alias-label-primary,#1d2129); }
.dsh-cloudq-welcome-head p { margin:0; font-size:13px; color:var(--dsw-alias-label-secondary,#626a76); }
.dsh-cloudq-welcome-link { border:0; background:none; color:var(--dsw-alias-state-business-primary,#006eff); cursor:pointer; font:inherit; margin-left:10px; }
.dsh-cloudq-welcome-bottom { min-width:0; color:var(--dsw-alias-label-primary,#1d2129); }
.dsh-cloudq-promotion { margin:16px 0 48px; padding:14px 16px 22px; border-radius:12px; background:var(--dsw-alias-interactive-bg-hover,#f6f7f9); position:relative; }
.dsh-cloudq-promotion-slide { display:flex; align-items:center; gap:12px; }
.dsh-cloudq-promotion-slide[hidden] { display:none; }
.dsh-cloudq-promotion-copy { flex:1; min-width:0; font-size:13px; }
.dsh-cloudq-promotion-copy p { margin:5px 0 0; font-size:12px; color:var(--dsw-alias-label-secondary,#626a76); }
.dsh-cloudq-promotion a { font-size:12px; padding:6px 12px; border-radius:20px; background:var(--dsw-alias-label-primary,#222); color:var(--dsw-alias-bg-card,#fff); text-decoration:none; white-space:nowrap; }
.dsh-cloudq-promotion-dots { position:absolute; bottom:5px; left:50%; transform:translateX(-50%); display:flex; gap:4px; }
.dsh-cloudq-promotion-dots button { border:0; background:none; padding:5px; cursor:pointer; }
.dsh-cloudq-promotion-dots button::after { content:''; display:block; width:10px; height:3px; border-radius:4px; background:var(--dsw-alias-label-secondary,#626a76); opacity:.3; }
.dsh-cloudq-promotion-dots button[aria-pressed=true]::after { width:20px; opacity:1; }
.dsh-cloudq-welcome-tabs { display:flex; gap:4px; overflow-x:auto; padding:4px; border-radius:24px; background:var(--dsw-alias-interactive-bg-hover,#f6f7f9); width:fit-content; max-width:100%; margin-bottom:20px; }
.dsh-cloudq-welcome-tabs button { flex:none; border:0; background:none; color:inherit; font:inherit; font-size:12px; padding:7px 14px; border-radius:20px; cursor:pointer; }
.dsh-cloudq-welcome-tabs button[aria-selected=true] { background:#b8edf2; color:#153846; }
.dsh-cloudq-welcome-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:14px; }
.dsh-cloudq-welcome-card { padding:20px; min-height:120px; border:1px solid var(--dsw-alias-border-l2,#e1e4e8); border-radius:12px; background:var(--dsw-alias-bg-card,#fff); color:inherit; cursor:pointer; text-align:left; font:inherit; }
.dsh-cloudq-welcome-card:hover { border-color:var(--dsw-alias-state-business-primary,#006eff); box-shadow:0 4px 16px #006eff0d; }
.dsh-cloudq-welcome-card strong { font-size:14px; font-weight:500; display:block; }
.dsh-cloudq-welcome-card p { font-size:12px; line-height:1.7; margin:14px 0 0; color:var(--dsw-alias-label-secondary,#626a76); }
.dsh-cloudq-welcome-status { font-size:13px; color:var(--dsw-alias-label-secondary,#626a76); padding:12px 0; }
.dsh-cloudq-welcome-notice { display:flex; flex-wrap:wrap; align-items:center; gap:20px; padding:24px; border:1px solid var(--dsw-alias-border-l2,#e1e4e8); border-radius:16px; background:var(--dsw-alias-bg-card,#fff); text-align:left; }
.dsh-cloudq-welcome-notice-copy { flex:1; min-width:180px; }
.dsh-cloudq-welcome-notice strong { font-size:15px; font-weight:600; }
.dsh-cloudq-welcome-notice p { margin:8px 0 0; font-size:13px; line-height:1.7; color:var(--dsw-alias-label-secondary,#626a76); }
.dsh-cloudq-welcome-notice-action { border:0; border-radius:8px; padding:10px 16px; font:inherit; font-size:13px; color:#fff; background:var(--dsw-alias-state-business-primary,#006eff); cursor:pointer; }
.dsh-cloudq-credential-dialog { box-sizing:border-box; width:min(480px,calc(100vw - 32px)); max-height:calc(100vh - 48px); overflow:auto; padding:28px; border:1px solid var(--dsw-alias-border-l2,#e1e4e8); border-radius:18px; background:var(--dsw-alias-bg-card,#fff); color:var(--dsw-alias-label-primary,#1d2129); box-shadow:0 24px 80px #0003; font-family:inherit; }
.dsh-cloudq-credential-dialog::backdrop { background:#10182866; backdrop-filter:blur(3px); }
.dsh-cloudq-credential-dialog h2 { font-size:20px; margin:0 0 10px; }
.dsh-cloudq-credential-dialog p { font-size:13px; line-height:1.7; color:var(--dsw-alias-label-secondary,#626a76); }
.dsh-cloudq-credential-dialog a { color:var(--dsw-alias-state-business-primary,#006eff); font-size:13px; }
.dsh-cloudq-credential-dialog label { display:block; margin-top:20px; font-size:13px; font-weight:500; }
.dsh-cloudq-credential-dialog input { box-sizing:border-box; width:100%; display:block; margin-top:8px; padding:10px 12px; border-radius:8px; border:1px solid var(--dsw-alias-border-l2,#e1e4e8); background:var(--dsw-alias-bg-card,#fff); color:inherit; font:inherit; }
.dsh-cloudq-credential-dialog input:focus { outline:2px solid var(--dsw-alias-state-business-primary,#006eff); outline-offset:2px; }
.dsh-cloudq-credential-actions { display:flex; justify-content:flex-end; flex-wrap:wrap; gap:8px; margin-top:20px; }
.dsh-cloudq-credential-actions button { border:1px solid var(--dsw-alias-border-l2,#e1e4e8); border-radius:8px; padding:9px 14px; background:var(--dsw-alias-bg-card,#fff); color:inherit; cursor:pointer; }
.dsh-cloudq-credential-actions button.is-primary { background:var(--dsw-alias-state-business-primary,#006eff); color:#fff; border-color:transparent; }
.dsh-cloudq-credential-actions button:disabled { opacity:.55; cursor:wait; }
.dsh-cloudq-credential-feedback[data-kind=error] { color:var(--dsw-alias-state-error-text,#d93026); }
.dsh-cloudq-credential-feedback[data-kind=success] { color:var(--dsw-alias-state-success-text,#15803d); }
body.dsh-cloudq-mode-active [data-cloudq-welcome-host] { width:100%; max-width:800px; margin:0 auto; }
body.dsh-cloudq-mode-active [data-cloudq-welcome-host] > [class*=heroWorkspaceRow] { display:flex !important; }
body.dsh-cloudq-mode-active [data-cloudq-welcome-host] [class*=titleGroup],
body.dsh-cloudq-mode-active [data-cloudq-welcome-host] [class*=headlineText],
body.dsh-cloudq-mode-active [data-cloudq-welcome-host] [class*=fishHitbox] { display:none !important; }
body.dsh-cloudq-mode-active [data-cloudq-welcome-host] [class*=headline] { display:none; }
body.dsh-cloudq-mode-active [data-cloudq-welcome-host] [class*=root][class*=hero] { transform:none; }
body[data-ds-dark-theme] .dsh-cloudq-welcome-tabs button[aria-selected=true] { background:#214e59; color:#bcf3f4; }
@media(max-width:1100px) { .dsh-cloudq-welcome-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media(max-width:600px) { .dsh-cloudq-welcome-grid { grid-template-columns:1fr; } .dsh-cloudq-welcome-head h1 { font-size:22px; } .dsh-cloudq-promotion { margin-bottom:28px; } }
`

export function createWelcome({ loadInspirations, onArchitecture, onDraft, credentialRequest }) {
  let closeDialog = null
  const element = (tag, className, text) => {
    const node = document.createElement(tag)
    node.className = className
    if (text) node.textContent = text
    return node
  }
  const header = element('section', 'dsh-cloudq-welcome-head')
  header.dataset.cloudqHero = 'true'
  const style = element('style', '')
  style.textContent = STYLE
  const avatar = element('img', 'dsh-cloudq-welcome-avatar')
  avatar.src = '/api/dsh-cloudq/welcome.png'
  avatar.alt = 'CloudQ'
  const heading = element('div', '')
  const subtitle = element('p', '', '你的云端架构顾问')
  const architecture = element('button', 'dsh-cloudq-welcome-link', '查看云架构')
  architecture.type = 'button'
  architecture.dataset.testid = 'cloudq-welcome-architecture'
  architecture.addEventListener('click', onArchitecture)
  subtitle.append(architecture)
  heading.append(element('h1', '', '你好，我是 CloudQ'), subtitle)
  header.append(style, avatar, heading)

  const bottom = element('section', 'dsh-cloudq-welcome-bottom')
  bottom.dataset.testid = 'cloudq-welcome-content'
  const banner = element('div', 'dsh-cloudq-promotion')
  banner.setAttribute('aria-label', 'CloudQ 推荐入口')
  const promotions = [
    { title: '在 WorkBuddy 中体验 CloudQ', description: '在熟悉的工作台中发现更多云端智能能力', action: '了解 WorkBuddy', url: 'https://www.codebuddy.cn/work/' },
    { title: '了解 CloudQ 计费规则', description: '按需使用云端智能顾问，了解服务用量与计费说明', action: '查看规则', url: 'https://cloud.tencent.com/document/product/1264/137720' },
  ]
  const dots = element('div', 'dsh-cloudq-promotion-dots')
  let selected = 0
  let hovered = false
  const slides = promotions.map((item, index) => {
    const slide = element('div', 'dsh-cloudq-promotion-slide')
    const copy = element('div', 'dsh-cloudq-promotion-copy')
    copy.append(element('strong', '', item.title), element('p', '', item.description))
    const link = element('a', '', item.action)
    link.href = item.url
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.dataset.testid = `cloudq-promotion-link-${index}`
    slide.append(copy, link)
    const dot = element('button', '')
    dot.type = 'button'
    dot.setAttribute('aria-label', `查看推荐 ${index + 1}`)
    dot.dataset.testid = `cloudq-promotion-dot-${index}`
    dot.addEventListener('click', () => show(index))
    dots.append(dot)
    banner.append(slide)
    return slide
  })
  const show = (index) => {
    selected = index
    slides.forEach((slide, i) => { slide.hidden = i !== index })
    ;[...dots.children].forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === index)))
  }
  show(0)
  banner.append(dots)
  banner.addEventListener('mouseenter', () => { hovered = true })
  banner.addEventListener('mouseleave', () => { hovered = false })
  const timer = window.setInterval(() => {
    if (!document.hidden && !hovered && !banner.contains(document.activeElement)
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) show((selected + 1) % slides.length)
  }, 5000)

  const content = element('div', '')
  content.setAttribute('aria-live', 'polite')
  bottom.append(banner, content)
  let disposed = false
  let sequence = 0
  const load = async () => {
    const request = ++sequence
    content.replaceChildren(element('p', 'dsh-cloudq-welcome-status', '正在获取推荐问题…'))
    try {
      const data = await loadInspirations()
      if (disposed || request !== sequence) return
      const groups = groupInspirations(data?.inspirations)
      if (!groups.length) {
        content.replaceChildren(element('p', 'dsh-cloudq-welcome-status', '暂无推荐问题，你可以直接向 CloudQ 提问。'))
        return
      }
      const tabs = element('div', 'dsh-cloudq-welcome-tabs')
      tabs.setAttribute('role', 'tablist')
      tabs.setAttribute('aria-label', '问题分类')
      const grid = element('div', 'dsh-cloudq-welcome-grid')
      grid.setAttribute('role', 'tabpanel')
      const select = (group) => {
        for (const tab of tabs.children) tab.setAttribute('aria-selected', String(tab.dataset.category === String(group.id)))
        grid.setAttribute('aria-label', group.name)
        grid.replaceChildren(...group.items.slice(0, 6).map((item, index) => {
          const card = element('button', 'dsh-cloudq-welcome-card')
          card.type = 'button'
          card.dataset.testid = `cloudq-welcome-card-${group.id}-${index}`
          card.append(element('strong', '', item.Title), element('p', '', typeof item.Description === 'string' ? item.Description : ''))
          card.addEventListener('click', () => onDraft(item.Prompt))
          return card
        }))
      }
      for (const group of groups) {
        const tab = element('button', '', group.name)
        tab.type = 'button'
        tab.setAttribute('role', 'tab')
        tab.dataset.category = String(group.id)
        tab.dataset.testid = `cloudq-welcome-category-${group.id}`
        tab.addEventListener('click', () => select(group))
        tabs.append(tab)
      }
      select(groups[0])
      content.replaceChildren(tabs, grid)
    } catch (error) {
      if (disposed || request !== sequence) return
      const authError = ['NeedAuth', 'CredentialExpired', 'AuthFailure'].includes(error?.code)
      const card = element('div', 'dsh-cloudq-welcome-notice')
      const copy = element('div', 'dsh-cloudq-welcome-notice-copy')
      copy.append(
        element('strong', '', authError ? '连接你的云端智能顾问' : '推荐问题暂时不可用'),
        element('p', '', authError
          ? '配置有效的腾讯云 AK/SK，即可获取专属推荐问题与云资源信息。'
          : '暂时无法加载数据，请检查网络后重试。'),
      )
      const action = element('button', 'dsh-cloudq-welcome-notice-action', authError ? '配置 AK/SK' : '重新加载')
      action.type = 'button'
      action.dataset.testid = authError ? 'cloudq-welcome-configure' : 'cloudq-welcome-retry'
      action.addEventListener('click', () => {
        if (authError) {
          closeDialog?.()
          closeDialog = openCredentialDialog({ request: credentialRequest, onSaved: () => { void load() } })
        } else void load()
      })
      card.append(copy, action)
      content.replaceChildren(card)
    }
  }
  void load()
  return { header, bottom, dispose() { disposed = true; closeDialog?.(); window.clearInterval(timer); header.remove(); bottom.remove() } }
}
