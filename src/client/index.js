Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })

let react = require('react')
react = __toESM(react, 1)
let react_jsx_runtime = require('react/jsx-runtime')

function __toESM(mod, isNodeMode, target) {
  target = mod != null ? __create(getProtoOf(mod)) : {}
  if (mod && mod.__esModule) return mod
  __copyProps(target, mod)
  return target
}
function __create(obj) { return Object.create(obj) }
function getProtoOf(obj) { return obj && obj.__proto__ ? obj.__proto__ : null }
function __copyProps(to, from) {
  for (var keys = Object.keys(from), i = 0, n = keys.length, key; i < n; i++) {
    key = keys[i]
    Object.defineProperty(to, key, Object.getOwnPropertyDescriptor(from, key))
  }
  return to
}

const PACKAGE_ID = 'dsh-cloudq'
const STYLE_ID = 'dsh-cloudq-styles'

// Same visual language as the dsh-cos attachment trigger: a square icon
// button in the composer tool row, using the shared design tokens.
const CSS = `
/* DSH signals dark mode through body[data-ds-dark-theme]; the --dsw-alias-*
   tokens are intentionally only defined there so light mode keeps using the
   per-usage fallbacks (pixel-identical), while dark mode resolves them here. */
body[data-ds-dark-theme] {
  --dsw-alias-bg-card: #212123;
  --dsw-alias-bg-inverse: #f2f3f5;
  --dsw-alias-bg-layer-2: #262629;
  --dsw-alias-bg-layer-3: #212123;
  --dsw-alias-bg-sub: #1b1b1e;
  --dsw-alias-border-l1: #2a2a2e;
  --dsw-alias-border-l2: #343439;
  --dsw-alias-button-elevated-fill: #2c2c31;
  --dsw-alias-interactive-bg: rgba(91, 141, 239, .16);
  --dsw-alias-interactive-bg-hover: #2a2b30;
  --dsw-alias-interactive-border: #43434a;
  --dsw-alias-label-inverse: #0f0f0f;
  --dsw-alias-label-primary: #ecedf0;
  --dsw-alias-label-secondary: #a4a7ad;
  --dsw-alias-label-tertiary: #7e838b;
  --dsw-alias-state-business-primary: #5b8def;
  --dsw-alias-state-business-primary-bg: rgba(91, 141, 239, .16);
  --dsw-alias-state-danger: #e5635c;
  --dsw-alias-state-danger-bg: rgba(213, 73, 65, .18);
  --dsw-alias-state-success-bg: rgba(34, 197, 94, .16);
  --dsw-alias-state-success-text: #4ade80;
  --dsw-alias-state-warning-bg: rgba(245, 158, 11, .16);
  --dsw-alias-state-warning-text: #f2b04a;
}
body[data-ds-dark-theme] .dsh-cloudq-arch__preview {
  background-color: #1b1b1e;
  background-image:
linear-gradient(30deg, transparent 49.5%, #2c2c31 49.5%, #2c2c31 50.5%, transparent 50.5%),
linear-gradient(-30deg, transparent 49.5%, #2c2c31 49.5%, #2c2c31 50.5%, transparent 50.5%);
}
.dsh-cloudq-trigger {
  display: inline-flex;
  height: 30px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--dsw-alias-label-secondary, #626a76);
  cursor: pointer;
}
.dsh-cloudq-trigger--idle {
  width: 30px;
}
.dsh-cloudq-trigger:hover {
  background: var(--dsw-alias-interactive-bg-hover, #eef1f5);
  color: var(--dsw-alias-state-business-primary, #315efb);
}
.dsh-cloudq-trigger:focus-visible {
  outline: 2px solid var(--dsw-alias-state-business-primary, #315efb);
  outline-offset: 2px;
}
.dsh-cloudq-trigger svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.dsh-cloudq-trigger--active {
  background: var(--dsw-alias-interactive-bg, #f2f5ff);
  color: var(--dsw-alias-state-business-primary, #315efb);
}
.dsh-cloudq-trigger--active:hover {
  background: var(--dsw-alias-interactive-bg-hover, #e8eeff);
  color: var(--dsw-alias-state-business-primary, #315efb);
}
.dsh-cloudq-label {
  padding: 0 8px;
  font-size: 12px;
  font-weight: 500;
  line-height: 30px;
  white-space: nowrap;
}
.dsh-cloudq-tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 1300;
  padding: 4px 8px;
  border-radius: 6px;
  background: var(--dsw-alias-bg-inverse, #1d2129);
  color: var(--dsw-alias-label-inverse, #fff);
  font-size: 12px;
  line-height: 18px;
  white-space: nowrap;
  pointer-events: none;
}
/* ---- settings card ---- */
.dsh-cloudq-settings-card {
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l2, #e1e4e8);
  border-radius: 12px;
  background: var(--dsw-alias-bg-layer-3, #fff);
  color: var(--dsw-alias-label-primary, #17191c);
}
.dsh-cloudq-settings-card *,
.dsh-cloudq-settings-card *::before,
.dsh-cloudq-settings-card *::after {
  box-sizing: border-box;
}
.dsh-cloudq-settings-card__summary {
  padding: 15px 16px;
}
.dsh-cloudq-settings-card__summary-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  text-align: left;
}
.dsh-cloudq-settings-card__summary-trigger:focus-visible {
  outline: 2px solid var(--dsw-alias-state-business-primary, #315efb);
  outline-offset: 3px;
  border-radius: 4px;
}
.dsh-cloudq-settings-card__summary-title {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.dsh-cloudq-settings-card__summary-title strong {
  font-size: 15px;
  font-weight: 650;
}
.dsh-cloudq-settings-card__summary-title small {
  display: block;
  font-size: 13px;
  color: var(--dsw-alias-label-tertiary, #8b919c);
}
.dsh-cloudq-settings-card__summary-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: none;
}
.dsh-cloudq-settings-card__chevron {
  font-size: 18px;
  transition: transform .16s ease;
  color: var(--dsw-alias-label-tertiary, #8b919c);
}
.dsh-cloudq-settings-card__chevron.is-open {
  transform: rotate(180deg);
}
.dsh-cloudq-settings-card__badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
  line-height: 20px;
  font-weight: 500;
}
.dsh-cloudq-settings-card__badge--ok {
  background: var(--dsw-alias-state-success-bg, #e8f7ee);
  color: var(--dsw-alias-state-success-text, #0f7b3d);
}
.dsh-cloudq-settings-card__badge--warn {
  background: var(--dsw-alias-state-warning-bg, #fff4e5);
  color: var(--dsw-alias-state-warning-text, #b25e09);
}
.dsh-cloudq-settings-card__badge--off {
  background: var(--dsw-alias-bg-layer-2, #f2f4f8);
  color: var(--dsw-alias-label-secondary, #626a76);
}
.dsh-cloudq-settings-card__badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}
.dsh-cloudq-settings-card__body {
  margin: 0 16px;
  padding: 16px 0;
  border-top: 1px solid var(--dsw-alias-border-l2, #e1e4e8);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.dsh-cloudq-settings-card__rows {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  line-height: 20px;
  color: var(--dsw-alias-label-secondary, #626a76);
}
.dsh-cloudq-settings-card__row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.dsh-cloudq-settings-card__row-key {
  min-width: 96px;
  color: var(--dsw-alias-label-tertiary, #9aa1ab);
}
.dsh-cloudq-settings-card__row-val {
  color: var(--dsw-alias-label-primary, #1d2129);
  word-break: break-all;
}
.dsh-cloudq-settings-card__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.dsh-cloudq-settings-card__actions--stacked {
  flex-direction: column;
  align-items: stretch;
}
.dsh-cloudq-settings-card__actions--stacked button {
  align-self: flex-end;
}
.dsh-cloudq-settings-card__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: 0 16px;
  border: 1px solid var(--dsw-alias-interactive-border, #cdd3da);
  border-radius: 6px;
  background: var(--dsw-alias-bg-card, #fff);
  color: var(--dsw-alias-label-primary, #1d2129);
  font-size: 13px;
  cursor: pointer;
}
.dsh-cloudq-settings-card__btn:hover {
  border-color: var(--dsw-alias-state-business-primary, #315efb);
  color: var(--dsw-alias-state-business-primary, #315efb);
}
.dsh-cloudq-settings-card__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.dsh-cloudq-settings-card__btn--primary {
  border-color: var(--dsw-alias-state-business-primary, #315efb);
  background: var(--dsw-alias-state-business-primary, #315efb);
  color: #fff;
}
.dsh-cloudq-settings-card__btn--primary:hover {
  background: #2448d4;
  border-color: #2448d4;
  color: #fff;
}
.dsh-cloudq-settings-card__btn--danger:hover {
  border-color: var(--dsw-alias-state-danger, #d54941);
  color: var(--dsw-alias-state-danger, #d54941);
}
.dsh-cloudq-settings-card__input {
  width: 100%;
  height: 32px;
  padding: 0 12px;
  border: 1px solid var(--dsw-alias-interactive-border, #cdd3da);
  border-radius: 6px;
  background: var(--dsw-alias-bg-card, #fff);
  color: var(--dsw-alias-label-primary, #1d2129);
  font-size: 13px;
  outline: none;
}
.dsh-cloudq-settings-card__input:focus {
  border-color: var(--dsw-alias-state-business-primary, #315efb);
}
.dsh-cloudq-settings-card__hint {
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-tertiary, #9aa1ab);
}
.dsh-cloudq-settings-card__feedback {
  font-size: 12px;
  line-height: 18px;
}
.dsh-cloudq-settings-card__feedback--error {
  color: var(--dsw-alias-state-danger, #d54941);
}
.dsh-cloudq-settings-card__feedback--success {
  color: var(--dsw-alias-state-success-text, #0f7b3d);
}
/* ---- manual AK/SK form ---- */
.dsh-cloudq-settings-card__field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 0;
}
.dsh-cloudq-settings-card__field + .dsh-cloudq-settings-card__field {
  border-top: 1px solid var(--dsw-alias-border-l2, #e1e4e8);
}
.dsh-cloudq-settings-card__label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary, #1d2129);
}
.dsh-cloudq-settings-card__required {
  display: inline-flex;
  align-items: center;
  height: 18px;
  padding: 0 6px;
  border-radius: 3px;
  background: var(--dsw-alias-state-danger-bg, #fdecec);
  color: var(--dsw-alias-state-danger, #d54941);
  font-size: 11px;
  font-weight: 500;
}
.dsh-cloudq-settings-card__form-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid var(--dsw-alias-border-l2, #e1e4e8);
}
/* ---- sidebar entry (replaces the former COS entry slot) ---- */
.dsh-cloudq-sidebar-btn {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 38px;
  padding: 8px 16px;
  margin: 0 2px 8px;
  box-sizing: border-box;
  border: 1px solid var(--dsw-alias-border-l2, #e1e4e8);
  border-radius: 12px;
  background: var(--dsw-alias-button-elevated-fill, #fff);
  color: var(--dsw-alias-label-primary, #1d2129);
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  cursor: pointer;
  overflow: hidden;
  font-family: inherit;
}
.dsh-cloudq-sidebar-btn:hover {
  background: var(--dsw-alias-interactive-bg-hover, #eef1f5);
}
.dsh-cloudq-sidebar-btn svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
  flex: none;
}
.dsh-cloudq-sidebar-btn__icon {
  width: 18px;
  height: 18px;
  flex: none;
  object-fit: contain;
}
.dsh-cloudq-sidebar-btn__label {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* Persisted CloudQ marker shown on rows whose session id is in the registry. */
.dsh-cloudq-session-badge {
  flex: none;
  display: inline-flex;
  align-items: center;
  height: 18px;
  padding: 0 5px;
  margin-right: 4px;
  border-radius: 3px;
  background: #e8f2ff;
  color: #006eff;
  font-size: 10px;
  font-weight: 500;
  line-height: 18px;
  white-space: nowrap;
}
/* ---- plugin manager card ---- */
.dsh-cloudq-pm__rows {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.dsh-cloudq-pm__row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border: 1px solid var(--dsw-alias-border-l2, #e1e4e8);
  border-radius: 6px;
  background: var(--dsw-alias-bg-card, #fff);
}
.dsh-cloudq-pm__row-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.dsh-cloudq-pm__row-name {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary, #1d2129);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dsh-cloudq-pm__row-tag {
  flex: none;
  padding: 0 6px;
  height: 18px;
  line-height: 18px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}
.dsh-cloudq-pm__row-tag--off {
  background: var(--dsw-alias-state-danger, #d54941);
  color: #fff;
}
.dsh-cloudq-pm__row-bundle {
  font-size: 11px;
  color: var(--dsw-alias-label-tertiary, #9aa1ab);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dsh-cloudq-pm__switch {
  position: relative;
  flex: none;
  width: 34px;
  height: 20px;
  border-radius: 10px;
  border: 1px solid var(--dsw-alias-interactive-border, #cdd3da);
  background: var(--dsw-alias-bg-sub, #f0f2f5);
  cursor: pointer;
  transition: background 0.15s ease;
  padding: 0;
}
.dsh-cloudq-pm__switch::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  transition: transform 0.15s ease;
}
.dsh-cloudq-pm__switch--on {
  border-color: var(--dsw-alias-state-business-primary, #315efb);
  background: var(--dsw-alias-state-business-primary, #315efb);
}
.dsh-cloudq-pm__switch--on::after {
  transform: translateX(14px);
}
.dsh-cloudq-pm__switch:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.dsh-cloudq-pm__state {
  flex: none;
  width: 44px;
  text-align: right;
  font-size: 12px;
  color: var(--dsw-alias-label-tertiary, #9aa1ab);
}
.dsh-cloudq-pm__state--off {
  color: var(--dsw-alias-state-danger, #d54941);
}
.dsh-cloudq-pm__reload {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 8px 10px;
  margin-bottom: 8px;
  border: 1px solid var(--dsw-alias-state-business-primary, #315efb);
  border-radius: 6px;
  background: rgba(49, 94, 251, 0.06);
  font-size: 12px;
  color: var(--dsw-alias-label-primary, #1d2129);
}
.dsh-cloudq-pm__reload-text {
  flex: 1;
  min-width: 0;
}
.dsh-cloudq-pm__reload-cancel,
.dsh-cloudq-pm__reload-now {
  flex: none;
  height: 24px;
  padding: 0 10px;
  font-size: 12px;
  border-radius: 4px;
  border: 1px solid var(--dsw-alias-interactive-border, #cdd3da);
  background: var(--dsw-alias-bg-card, #fff);
  color: var(--dsw-alias-label-primary, #1d2129);
  cursor: pointer;
}
.dsh-cloudq-pm__reload-now {
  border-color: var(--dsw-alias-state-business-primary, #315efb);
  color: var(--dsw-alias-state-business-primary, #315efb);
}
`

function installStyles() {
  if (document.getElementById(STYLE_ID) !== null) return () => {}
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.dataset.plugin = PACKAGE_ID
  style.textContent = CSS
  document.head.appendChild(style)
  return () => { style.remove() }
}

// ------------------------------------------------------------------
// CloudQ session registry (module-level, persists across reloads)
// ------------------------------------------------------------------

const CLOUDQ_STORAGE_KEY = 'dsh-cloudq.sessions'
const API_CLOUDQ_SESSIONS = '/api/dsh-cloudq/sessions'

function loadCloudqSessions() {
  try {
    const raw = window.localStorage.getItem(CLOUDQ_STORAGE_KEY)
    const list = raw ? JSON.parse(raw) : []
    return new Set(Array.isArray(list) ? list : [])
  } catch {
    return new Set()
  }
}

function saveCloudqSessions(sessions) {
  try {
    window.localStorage.setItem(CLOUDQ_STORAGE_KEY, JSON.stringify(Array.from(sessions)))
  } catch {
    // ignore quota/private-mode failures
  }
}

let cloudqSessions = loadCloudqSessions()

function markCloudqSession(sessionId) {
  if (!sessionId) return
  cloudqSessions.add(sessionId)
  saveCloudqSessions(cloudqSessions)
  // Keep every presentation of the registry in sync immediately: the
  // sidebar badge and active-session header action both observe this event.
  window.dispatchEvent(new CustomEvent('dsh-cloudq:sessions-changed'))
}

function unmarkCloudqSession(sessionId) {
  if (!sessionId || !cloudqSessions.delete(sessionId)) return
  saveCloudqSessions(cloudqSessions)
  window.dispatchEvent(new CustomEvent('dsh-cloudq:sessions-changed'))
}

function isCloudqSession(sessionId) {
  return !!sessionId && cloudqSessions.has(sessionId)
}

let cloudqHistorySync = null
let reconcileQueued = false
function reconcileCloudqSessionsFromHost() {
  // A scan started before new events landed returns stale evidence; queue one
  // follow-up instead of dropping the trigger so fresh sessions are picked up
  // as soon as the in-flight request settles.
  if (cloudqHistorySync) {
    reconcileQueued = true
    return cloudqHistorySync
  }
  cloudqHistorySync = cloudqRequest(API_CLOUDQ_SESSIONS, undefined, 60000)
    .then((response) => {
      const detected = new Set(Array.isArray(response?.sessionIds) ? response.sessionIds : [])
      const known = new Set(Array.isArray(response?.knownIds) ? response.knownIds : [])
      // Only ever add ids here: the client's mode-entry mark is authoritative,
      // and host log evidence merely backfills sessions marked on other
      // browsers. Absence of evidence proves nothing — a scan can race the
      // turn that writes it, and a model may legitimately never invoke the
      // skill tool in a CloudQ session. The only safe deletion is for ids
      // whose session log no longer exists on disk at all.
      if (known.size > 0) {
        for (const sessionId of Array.from(cloudqSessions)) {
          if (!known.has(sessionId)) cloudqSessions.delete(sessionId)
        }
      }
      for (const sessionId of detected) cloudqSessions.add(sessionId)
      saveCloudqSessions(cloudqSessions)
      window.dispatchEvent(new CustomEvent('dsh-cloudq:sessions-changed'))
      return detected
    })
    .catch(() => new Set())
    .finally(() => {
      cloudqHistorySync = null
      if (reconcileQueued) {
        reconcileQueued = false
        void reconcileCloudqSessionsFromHost()
      }
    })
  return cloudqHistorySync
}

// The composer claim placed in CloudQ sessions only; a normal session
// never shows it. Primed once per session so later user edits or
// hero-question picks are never overwritten by a re-render.
const CLOUDQ_DRAFT = '/cloudq '
const cloudqDraftPrimed = new Set()

// The input-bar seat is now a pure read-out: it shows the active
// "CloudQ" label (disabled) while the current conversation is a CloudQ
// session, and renders nothing otherwise. Entry into CloudQ mode lives
// on the sidebar button, which starts a fresh session and walks the
// bundled skill. The seat also reconciles the composer draft with the
// session's CloudQ state: entering primes the `/cloudq` claim once, and
// a session that stops being CloudQ drops the claim text.
function CloudQButton(props) {
  const sessionId = props?.session?.sessionId
  const draft = props?.input?.draft
  const actions = props?.inputActions

  const isCloudq = isCloudqSession(sessionId)

  // Keep the composer draft aligned with the session's CloudQ state:
  // entering CloudQ primes the skill claim once; a session that stops
  // being CloudQ (native New Session reuses the blank composer) drops it.
  if (sessionId && actions?.setDraft) {
    if (isCloudq && !cloudqDraftPrimed.has(sessionId)) {
      if (draft === '' || draft === CLOUDQ_DRAFT) {
        cloudqDraftPrimed.add(sessionId)
        try {
          actions.setDraft(CLOUDQ_DRAFT)
        } catch {
          // Composer may not yet be ready; the session is already marked.
        }
      }
    } else if (!isCloudq && cloudqDraftPrimed.has(sessionId)) {
      cloudqDraftPrimed.delete(sessionId)
      if (draft === CLOUDQ_DRAFT) {
        try {
          actions.setDraft('')
        } catch {
          // Composer busy; the mark is already gone.
        }
      }
    }
  }

  // The composer seat no longer renders a visible "CloudQ" badge in the
  // input bar. CloudQ mode is conveyed by the sidebar entry being active,
  // the `/cloudq` draft claim, and the CloudQ hero pane — the input row
  // itself stays clean. Draft reconciliation above still runs.
  if (!isCloudq) return null
  return null
}

// CloudQBridge: invisible React component that listens for DOM-issued
// CustomEvents and drives the framework's inputActions:
// - `dsh-cloudq:draft` (raised by the hero question pane) forwards a
//   prompt into the composer;
// - `dsh-cloudq:clear-draft` (raised when a session leaves CloudQ mode)
//   drops the `/cloudq` claim from the current composer.
// This is the only safe way to drive the React-controlled composer from
// a DOM-only entry, because the input state machine is session-scoped and
// can only be touched via the slot's owner share. Refs keep the listener
// closures reading the latest values without re-registering per change.
function CloudQBridge(props) {
  const actionsRef = react.useRef(props?.inputActions)
  actionsRef.current = props?.inputActions
  const sessionIdRef = react.useRef(props?.session?.sessionId)
  sessionIdRef.current = props?.session?.sessionId
  const draftRef = react.useRef(props?.input?.draft)
  draftRef.current = props?.input?.draft

  react.useEffect(() => {
    const onDraft = (event) => {
      const text = typeof event?.detail === 'string' ? event.detail : ''
      const actions = actionsRef.current
      if (text && actions?.setDraft) {
        try {
          actions.setDraft(text)
        } catch {
          // Composer busy; the user can retry once it is idle.
        }
      }
    }
    // A session leaving CloudQ must drop the claim text from the reused
    // composer: the native New Session flow reuses a blank session, so
    // CloudQButton may never re-render to reconcile it.
    const onClearDraft = (event) => {
      const targetId = typeof event?.detail === 'string' ? event.detail : ''
      if (!targetId || targetId !== sessionIdRef.current) return
      const actions = actionsRef.current
      if (actions?.setDraft && draftRef.current === CLOUDQ_DRAFT) {
        try {
          actions.setDraft('')
        } catch {
          // Composer busy; the mark is already gone and the draft is
          // reconciled on the next render anyway.
        }
      }
    }
    window.addEventListener('dsh-cloudq:draft', onDraft)
    window.addEventListener('dsh-cloudq:clear-draft', onClearDraft)
    return () => {
      window.removeEventListener('dsh-cloudq:draft', onDraft)
      window.removeEventListener('dsh-cloudq:clear-draft', onClearDraft)
    }
  }, [])
  return null
}

// ------------------------------------------------------------------
// Sidebar entry (DOM-injected next to the "New Session" button)
// ------------------------------------------------------------------

// The host marks a session as CloudQ when its sidebar button is pressed.
// Client-side we only need the current session id; it comes through the
// CloudQModeObserver below, which re-runs the CloudQButton seat.
const SIDEBAR_SELECTOR = '[class*=newSession]'
const CLOUDQ_LOGO_URL = '/api/dsh-cloudq/logo.png'

let cloudqCtx = null
let cloudqStartOperation = 0

function startCloudqSession() {
  if (!cloudqCtx?.workspaces || !cloudqCtx?.sessions?.list) return
  const operation = ++cloudqStartOperation
  const before = cloudqCtx.sessions.list.getSnapshot()
  const beforeId = before?.current
  const beforeSummary = beforeId ? before?.byId?.[beforeId] : undefined

  // DSH intentionally reuses the selected blank session. Its id is already
  // final, so mark it synchronously and avoid waiting for a change that
  // will never happen.
  if (beforeId && beforeSummary?.blank) {
    markCloudqSession(beforeId)
    cloudqCtx.workspaces.startSession()
    return
  }

  let unsubscribe = null
  let timer = 0
  const finish = () => {
    if (unsubscribe) unsubscribe()
    unsubscribe = null
    if (timer) window.clearTimeout(timer)
    timer = 0
  }
  const observeTarget = () => {
    if (operation !== cloudqStartOperation) {
      finish()
      return
    }
    const next = cloudqCtx.sessions.list.getSnapshot()
    const nextId = next?.current
    // A CloudQ start must land on a different provisional blank session.
    // This prevents an unrelated manual navigation to existing history
    // from being mistaken for the result of this operation.
    if (!nextId || nextId === beforeId || !next?.byId?.[nextId]?.blank) return
    markCloudqSession(nextId)
    finish()
  }

  unsubscribe = cloudqCtx.sessions.list.subscribe(observeTarget)
  timer = window.setTimeout(finish, 10000)
  try {
    cloudqCtx.workspaces.startSession()
    // Some hosts publish synchronously before startSession returns.
    observeTarget()
  } catch {
    finish()
  }
}

function createSidebarButton() {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'dsh-cloudq-sidebar-btn'
  button.setAttribute('aria-label', '进入 CloudQ 模式')

  const icon = document.createElement('img')
  icon.src = CLOUDQ_LOGO_URL
  icon.alt = ''
  icon.className = 'dsh-cloudq-sidebar-btn__icon'
  const label = document.createElement('span')
  label.className = 'dsh-cloudq-sidebar-btn__label'
  label.textContent = 'CloudQ'
  button.append(icon, label)

  button.addEventListener('click', startCloudqSession)
  return button
}

function installSidebarButton() {
  if (document.getElementById('dsh-cloudq-sidebar-entry')) return () => {}

  let button = null
  let observer = null
  let disposed = false

  const place = () => {
    if (disposed || document.getElementById('dsh-cloudq-sidebar-entry')) return
    const host = document.querySelector(SIDEBAR_SELECTOR)
    if (!host || !host.parentElement) {
      // Sidebar not mounted yet; retry shortly.
      window.setTimeout(place, 500)
      return
    }
    button = createSidebarButton()
    button.id = 'dsh-cloudq-sidebar-entry'
    host.insertAdjacentElement('afterend', button)

    observer = new MutationObserver(() => {
      if (button && !button.isConnected && !disposed) {
        const freshHost = document.querySelector(SIDEBAR_SELECTOR)
        if (freshHost) freshHost.insertAdjacentElement('afterend', button)
      }
    })
    observer.observe(host.parentElement, { childList: true, subtree: true })
  }

  place()

  return () => {
    disposed = true
    if (observer) observer.disconnect()
    if (button) button.remove()
  }
}

/** Build the exact visible row order from Host workspace membership. */
function orderedVisibleSessions(snapshot, workspaces, sortByUpdated) {
  const archived = new Set(workspaces?.archivedSessionIds ?? [])
  const assigned = new Set()
  const ordered = []
  for (const workspace of workspaces?.items ?? []) {
    let items = (workspace?.sessionIds ?? [])
      .map((id) => snapshot?.byId?.[id])
      .filter(Boolean)
    if (sortByUpdated) items = items.sort((a, b) => b.updatedAt - a.updatedAt)
    for (const summary of items) {
      assigned.add(summary.id)
      if (summary.origin === 'subagent' || archived.has(summary.id)) continue
      if (!summary.blank || summary.id === snapshot.current) ordered.push(summary)
    }
  }
  const ungrouped = (snapshot?.ids ?? [])
    .filter((id) => !assigned.has(id))
    .map((id) => snapshot?.byId?.[id])
    .filter((summary) => summary && summary.origin !== 'subagent' && !archived.has(summary.id))
    .filter((summary) => !summary.blank || summary.id === snapshot.current)
    .sort((a, b) => b.updatedAt - a.updatedAt)
  return ordered.concat(ungrouped)
}

function rowTitle(row) {
  return row.querySelector('[class*=title]')?.textContent?.trim() ?? ''
}

/**
 * Decorate visible rows with CloudQ markers. The workspace renderer does
 * not expose session ids in DOM, so first match its exact Host-owned row
 * order (manual and recent-order variants). Only if a collapsed/search
 * view prevents an exact sequence match do we fall back to title matching.
 */
// Session rows carry no DOM id attribute, but their React fiber holds the
// session summary (`props.node.id`). Walking the fiber gives an exact mapping
// that duplicate titles cannot break; order/title matching stays as fallback.
function rowSessionId(row) {
  const fiberKey = Object.keys(row).find((key) => key.startsWith('__reactFiber$'))
  if (!fiberKey) return undefined
  let fiber = row[fiberKey]
  for (let depth = 0; fiber && depth < 12; depth += 1) {
    const props = fiber.memoizedProps
    const id = props?.node?.id ?? props?.sessionId
    if (typeof id === 'string' && id.startsWith('session-')) return id
    fiber = fiber.return
  }
  return undefined
}

function installSessionBadges() {
  let disposed = false
  let frame = 0
  let observer = null

  const sync = () => {
    frame = 0
    if (disposed) return
    const snapshot = cloudqCtx?.sessions?.list?.getSnapshot?.()
    if (!snapshot) return

    const summaries = Object.values(snapshot.byId ?? {})
    const byTitle = new Map()
    for (const summary of summaries) {
      if (summary?.blank) continue
      const title = String(summary?.displayTitle ?? summary?.title ?? '')
      if (!title) continue
      const bucket = byTitle.get(title) ?? []
      bucket.push(summary)
      byTitle.set(title, bucket)
    }

    const rows = Array.from(document.querySelectorAll('[role="treeitem"][class*=sessionRow]'))
    const workspaces = cloudqCtx?.workspaces?.list?.getSnapshot?.()
    const orderVariants = [
      orderedVisibleSessions(snapshot, workspaces, false),
      orderedVisibleSessions(snapshot, workspaces, true),
    ]
    const exactOrder = orderVariants.find((items) =>
      items.length === rows.length
      && items.every((summary, index) => summary.displayTitle === rowTitle(rows[index])),
    )

    for (const [index, row] of rows.entries()) {
      const selected = row.getAttribute('aria-selected') === 'true'
      const titleNode = row.querySelector('[class*=title]')
      const title = rowTitle(row)
      const exact = exactOrder?.[index]
        ?? (selected ? snapshot.byId?.[snapshot.current] : undefined)
      const candidates = exact ? [exact] : (byTitle.get(title) ?? [])
      const states = new Set(candidates.map((summary) => isCloudqSession(summary.id)))
      // The fiber-derived id is exact; without it, a mixed duplicate-title
      // fallback stays unmarked rather than guessing across namesakes.
      const fiberId = rowSessionId(row)
      const cloudq = fiberId !== undefined
        ? isCloudqSession(fiberId)
        : candidates.length > 0 && states.size === 1 && states.has(true)
      const existing = row.querySelector('[data-cloudq-session-badge="true"]')

      if (!cloudq) {
        existing?.remove()
        row.removeAttribute('data-cloudq-session')
        continue
      }
      row.dataset.cloudqSession = 'true'
      if (existing || !titleNode) continue
      const badge = document.createElement('span')
      badge.className = 'dsh-cloudq-session-badge'
      badge.dataset.cloudqSessionBadge = 'true'
      badge.title = 'CloudQ 会话'
      badge.textContent = 'CloudQ'
      titleNode.insertAdjacentElement('afterend', badge)
    }
  }

  const schedule = () => {
    if (disposed || frame !== 0) return
    frame = window.requestAnimationFrame(sync)
  }
  observer = new MutationObserver(schedule)
  observer.observe(document.body, { childList: true, subtree: true })
  const unsubscribe = cloudqCtx?.sessions?.list?.subscribe?.(schedule)
  window.addEventListener('dsh-cloudq:sessions-changed', schedule)
  schedule()

  return () => {
    disposed = true
    if (frame !== 0) window.cancelAnimationFrame(frame)
    observer?.disconnect()
    unsubscribe?.()
    window.removeEventListener('dsh-cloudq:sessions-changed', schedule)
    document.querySelectorAll('[data-cloudq-session-badge="true"]').forEach((node) => node.remove())
    document.querySelectorAll('[data-cloudq-session="true"]').forEach((node) => node.removeAttribute('data-cloudq-session'))
  }
}

// ------------------------------------------------------------------
// CloudQ hero chrome (replaces the default headline + adds a curated
// question list while the active session is in CloudQ mode)
// ------------------------------------------------------------------

const CLOUDQ_HEADLINE = '用云管云就Q我'
const CLOUDQ_SUBTITLE = '云端架构管家，覆盖云上架构治理与智能运维全场景'

const CLOUDQ_QUESTIONS = [
  {
    label: '事前预防',
    prompt: '帮我看看系统有哪些风险',
  },
  {
    label: '事中排障',
    prompt: '帮我排查一下当前业务CPU/内存/网络的使用情况，定位可能的瓶颈',
  },
  {
    label: '事后复盘',
    prompt: '帮我总结一下还有哪些系统风险需要持续关注并给出改进建议',
  },
  {
    label: '日常运维',
    prompt: '帮我梳理一下闲置资源并给出降本建议',
  },
  {
    label: '最佳实践',
    prompt: '帮我介绍高频使用场景',
  },
]

const CLOUDQ_HERO_STYLE_ID = 'dsh-cloudq-hero-styles-v2'

const CLOUDQ_HERO_CSS = `
body.dsh-cloudq-mode-active [class*=headlineText],
body.dsh-cloudq-mode-active [class*=previewBadge],
body.dsh-cloudq-mode-active [class*=fish],
body.dsh-cloudq-mode-active [class*=heroWorkspaceRow] {
  display: none !important;
}
/* CloudQ 空会话页只下移输入框，不影响上方标题和推荐问题。 */
body.dsh-cloudq-mode-active [class*=composerHero] [class*=root][class*=hero] {
  transform: translateY(40px);
}
.dsh-cloudq-hero-title {
  margin: 0;
  font-size: 32px;
  font-weight: 600;
  line-height: 1.25;
  color: var(--dsw-alias-label-primary, #1d2129);
  text-align: center;
}
.dsh-cloudq-hero-subtitle {
  margin: 12px 0 0;
  font-size: 14px;
  line-height: 22px;
  color: var(--dsw-alias-label-secondary, #626a76);
  text-align: center;
}
.dsh-cloudq-hero-questions {
  margin: 28px auto 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 560px;
}
.dsh-cloudq-hero-question {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--dsw-alias-border-l2, #e1e4e8);
  border-radius: 12px;
  background: var(--dsw-alias-bg-card, #fff);
  color: var(--dsw-alias-label-primary, #1d2129);
  font: inherit;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: background-color .15s ease, border-color .15s ease;
}
.dsh-cloudq-hero-question:hover {
  background: var(--dsw-alias-interactive-bg-hover, #eef1f5);
  border-color: var(--dsw-alias-state-business-primary, #315efb);
}
.dsh-cloudq-hero-question__spark {
  width: 16px;
  height: 16px;
  fill: var(--dsw-alias-state-business-primary, #315efb);
  flex: none;
}
.dsh-cloudq-hero-question__label {
  font-weight: 500;
  color: var(--dsw-alias-label-primary, #1d2129);
  white-space: nowrap;
}
.dsh-cloudq-hero-question__prompt {
  flex: 1;
  color: var(--dsw-alias-label-secondary, #626a76);
  font-size: 13px;
  line-height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 12px;
}
.dsh-cloudq-hero-question__chevron {
  font-size: 18px;
  color: var(--dsw-alias-label-tertiary, #9aa1ab);
  flex: none;
}
/* ---- CloudQ side panel (in-flow rail that squeezes the main column) ---- */
.dsh-cloudq-hero-chip {
  position: absolute;
  top: 0;
  right: 0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 32px;
  padding: 0 12px;
  border: 1px solid var(--dsw-alias-border-l2, #e1e4e8);
  border-radius: 8px;
  background: var(--dsw-alias-bg-card, #fff);
  color: var(--dsw-alias-label-secondary, #626a76);
  font-size: 13px;
  cursor: pointer;
  transition: background-color .15s ease, border-color .15s ease;
  padding: 0 12px;
  z-index: 30;
}
.dsh-cloudq-hero-chip:hover {
  background: var(--dsw-alias-interactive-bg-hover, #eef1f5);
  border-color: var(--dsw-alias-state-business-primary, #315efb);
  color: var(--dsw-alias-state-business-primary, #315efb);
}
.dsh-cloudq-hero-chip svg {
  width: 14px;
  height: 14px;
}
.dsh-cloudq-convo-chip {
  position: fixed;
  top: 20px;
  right: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid var(--dsw-alias-border-l2, #e1e4e8);
  border-radius: 8px;
  background: var(--dsw-alias-bg-card, #fff);
  color: var(--dsw-alias-label-secondary, #626a76);
  cursor: pointer;
  transition: background-color .15s ease, border-color .15s ease, right .2s ease;
  z-index: 700;
}
.dsh-cloudq-convo-chip:hover {
  background: var(--dsw-alias-interactive-bg-hover, #eef1f5);
  border-color: var(--dsw-alias-state-business-primary, #315efb);
  color: var(--dsw-alias-state-business-primary, #315efb);
}
.dsh-cloudq-convo-chip svg {
  width: 18px;
  height: 18px;
}
.dsh-cloudq-convo-chip.is-open {
  /* Leave a 12px gap so the chip doesn't kiss the rail's left edge. */
  right: calc(var(--cloudq-rail-width, 720px) + 12px);
}
.dsh-cloudq-panel__rail {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: var(--cloudq-rail-width, 720px);
  max-width: 80vw;
  z-index: 800;
  display: flex;
  background: var(--dsw-alias-bg-card, #fff);
  border-left: 1px solid var(--dsw-alias-border-l2, #e1e4e8);
  transform: translateX(100%);
  transition: transform .2s ease;
}
.dsh-cloudq-panel__rail.is-open {
  transform: translateX(0);
}
.dsh-cloudq-panel__rail-enter,
.dsh-cloudq-panel__rail-leave {
  /* Force-shrink the main column while the rail is open so the layout
 behaves like a real in-flow pane rather than a floating drawer. */
  transition: padding-right .2s ease;
}
.dsh-cloudq-panel__rail-enter { padding-right: var(--cloudq-rail-width, 500px); }
.dsh-cloudq-panel__rail-leave { padding-right: 0; }
.dsh-cloudq-panel__resizer {
  flex: none;
  width: 4px;
  cursor: col-resize;
  background: transparent;
  position: relative;
}
.dsh-cloudq-panel__resizer::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 1px;
  width: 2px;
  background: var(--dsw-alias-border-l2, #e1e4e8);
  opacity: 0;
  transition: opacity .15s ease;
}
.dsh-cloudq-panel__resizer:hover::after,
.dsh-cloudq-panel__resizer.is-dragging::after {
  opacity: 1;
  background: var(--dsw-alias-state-business-primary, #315efb);
}
.dsh-cloudq-panel__inner {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.dsh-cloudq-panel__header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--dsw-alias-border-l2, #e1e4e8);
}
/* ---- primary view tabs ---- */
.dsh-cloudq-panel__tabs {
  display: flex;
  align-self: stretch;
  gap: 24px;
}
.dsh-cloudq-panel__tab {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  padding: 0 2px;
  border: 0;
  background: transparent;
  color: var(--dsw-alias-label-secondary, #626a76);
  font: inherit;
  font-size: 14px;
  cursor: pointer;
  outline: none;
  transition: color .15s ease;
}
.dsh-cloudq-panel__tab:hover {
  color: var(--dsw-alias-state-business-primary, #006eff);
}
.dsh-cloudq-panel__tab.is-active {
  color: var(--dsw-alias-state-business-primary, #006eff);
  font-weight: 500;
}
.dsh-cloudq-panel__tab.is-active::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: -12px;
  left: 0;
  height: 2px;
  background: var(--dsw-alias-state-business-primary, #006eff);
}
.dsh-cloudq-panel__close {
  margin-left: auto;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background: transparent;
  color: var(--dsw-alias-label-tertiary, #9aa1ab);
  cursor: pointer;
  border-radius: 6px;
  font-size: 18px;
  padding: 0;
}
.dsh-cloudq-panel__close:hover {
  background: var(--dsw-alias-interactive-bg-hover, #eef1f5);
  color: var(--dsw-alias-label-primary, #1d2129);
}
.dsh-cloudq-panel__body {
  box-sizing: border-box;
  container-type: inline-size;
  container-name: cloudq-panel-body;
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 16px;
}
.dsh-cloudq-panel__hint {
  color: var(--dsw-alias-label-tertiary, #9aa1ab);
  font-size: 13px;
  text-align: center;
  padding: 24px 0;
}
.dsh-cloudq-panel__error {
  color: var(--dsw-alias-state-danger, #d54941);
  font-size: 13px;
  text-align: center;
  padding: 16px 0;
}
/* usage overview */
.dsh-cloudq-usage__overview {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}
.dsh-cloudq-usage__card {
  flex: 0 1 auto;
  min-width: 240px;
  padding: 14px 16px;
  border: 1px solid var(--dsw-alias-border-l2, #e1e4e8);
  border-radius: 10px;
  background: var(--dsw-alias-bg-sub, #f7f8fa);
}
.dsh-cloudq-usage__card-value-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  flex-wrap: wrap;
}
.dsh-cloudq-usage__card-unit {
  font-size: 13px;
  color: var(--dsw-alias-label-secondary, #626a76);
}
.dsh-cloudq-usage__free-badge {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 1px 8px;
  border-radius: 999px;
  background: var(--dsw-alias-state-business-primary-bg, #e8efff);
  color: var(--dsw-alias-state-business-primary, #315efb);
  font-size: 12px;
  cursor: help;
}
.dsh-cloudq-usage__free-badge .dsh-cloudq-tooltip {
  opacity: 0;
  visibility: hidden;
  transition: opacity .12s ease;
}
.dsh-cloudq-usage__free-badge:hover .dsh-cloudq-tooltip,
.dsh-cloudq-usage__free-badge:focus-visible .dsh-cloudq-tooltip {
  opacity: 1;
  visibility: visible;
}
.dsh-cloudq-usage__range {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}
.dsh-cloudq-usage__range-picker {
  position: relative;
}
.dsh-cloudq-usage__range-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 28px;
  padding: 0 10px;
  border: 1px solid var(--dsw-alias-interactive-border, #cdd3da);
  border-radius: 6px;
  background: var(--dsw-alias-bg-card, #fff);
  color: var(--dsw-alias-label-primary, #1d2129);
  font-size: 12px;
  cursor: pointer;
  transition: border-color .15s ease, box-shadow .15s ease;
}
.dsh-cloudq-usage__range-btn:hover {
  border-color: var(--dsw-alias-state-business-primary, #315efb);
}
.dsh-cloudq-usage__range-picker.is-open .dsh-cloudq-usage__range-btn {
  border-color: var(--dsw-alias-state-business-primary, #315efb);
  box-shadow: 0 0 0 2px rgba(49, 94, 251, .12);
}
.dsh-cloudq-usage__range-btn-chevron {
  font-size: 10px;
  color: var(--dsw-alias-label-tertiary, #9aa1ab);
  transition: transform .15s ease;
}
.dsh-cloudq-usage__range-picker.is-open .dsh-cloudq-usage__range-btn-chevron {
  transform: rotate(180deg);
}
.dsh-cloudq-usage__range-menu {
  position: absolute;
  z-index: 1400;
  top: calc(100% + 6px);
  left: 0;
  min-width: 136px;
  padding: 4px;
  border: 1px solid var(--dsw-alias-border-l2, #e1e4e8);
  border-radius: 8px;
  background: var(--dsw-alias-bg-card, #fff);
  box-shadow: 0 8px 24px rgba(29, 33, 41, .12);
}
.dsh-cloudq-usage__range-option {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  padding: 6px 8px;
  border: 0;
  border-radius: 5px;
  background: transparent;
  color: var(--dsw-alias-label-primary, #1d2129);
  font-size: 12px;
  text-align: left;
  cursor: pointer;
}
.dsh-cloudq-usage__range-option:hover {
  background: var(--dsw-alias-bg-sub, #f2f4f8);
}
.dsh-cloudq-usage__range-option.is-active {
  color: var(--dsw-alias-state-business-primary, #315efb);
  font-weight: 500;
}
.dsh-cloudq-usage__range-option-check {
  width: 14px;
  flex: none;
  color: var(--dsw-alias-state-business-primary, #315efb);
  visibility: hidden;
}
.dsh-cloudq-usage__range-option.is-active .dsh-cloudq-usage__range-option-check {
  visibility: visible;
}
.dsh-cloudq-usage__date {
  height: 28px;
  padding: 0 8px;
  border: 1px solid var(--dsw-alias-interactive-border, #cdd3da);
  border-radius: 6px;
  background: var(--dsw-alias-bg-card, #fff);
  color: var(--dsw-alias-label-primary, #1d2129);
  font-size: 12px;
  outline: none;
  transition: border-color .15s ease, box-shadow .15s ease;
}
.dsh-cloudq-usage__date:focus {
  border-color: var(--dsw-alias-state-business-primary, #315efb);
  box-shadow: 0 0 0 2px rgba(49, 94, 251, .12);
}
.dsh-cloudq-usage__range-error {
  font-size: 12px;
  color: var(--dsw-alias-state-danger, #d54941);
}
.dsh-cloudq-usage__card-label {
  font-size: 12px;
  color: var(--dsw-alias-label-tertiary, #9aa1ab);
  margin-bottom: 6px;
}
.dsh-cloudq-usage__card-value {
  font-size: 22px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary, #1d2129);
}
.dsh-cloudq-usage__card-sub {
  font-size: 12px;
  color: var(--dsw-alias-label-secondary, #626a76);
  margin-top: 4px;
}
.dsh-cloudq-usage__table {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  table-layout: fixed;
  border-collapse: collapse;
  font-size: 13px;
}
.dsh-cloudq-usage__table th {
  box-sizing: border-box;
  text-align: left;
  padding: 8px 10px;
  color: var(--dsw-alias-label-tertiary, #9aa1ab);
  font-weight: 500;
  border-bottom: 1px solid var(--dsw-alias-border-l2, #e1e4e8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dsh-cloudq-usage__table td {
  box-sizing: border-box;
  min-width: 0;
  padding: 8px 10px;
  border-bottom: 1px solid var(--dsw-alias-border-l1, #f0f1f4);
  color: var(--dsw-alias-label-primary, #1d2129);
  vertical-align: top;
  overflow: hidden;
}
.dsh-cloudq-usage__table th:nth-child(1),
.dsh-cloudq-usage__table td:nth-child(1) {
  width: 148px;
  padding-left: 0;
  white-space: nowrap;
}
.dsh-cloudq-usage__table th:nth-child(2),
.dsh-cloudq-usage__table td:nth-child(2) {
  width: 80px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.dsh-cloudq-usage__table th:nth-child(4),
.dsh-cloudq-usage__table td:nth-child(4) {
  width: 72px;
  padding-right: 0;
  text-align: right;
}
.dsh-cloudq-usage__table__message {
  display: block;
  width: 100%;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dsh-cloudq-usage__table__credits {
  font-weight: 600;
  color: var(--dsw-alias-state-business-primary, #315efb);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dsh-cloudq-usage__table__empty {
  text-align: center;
  color: var(--dsw-alias-label-tertiary, #9aa1ab);
  padding: 24px 0;
}
/* inspiration view */
.dsh-cloudq-insp__tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}
.dsh-cloudq-insp__tab {
  height: 28px;
  padding: 0 12px;
  border: 1px solid var(--dsw-alias-border-l2, #e1e4e8);
  border-radius: 14px;
  background: var(--dsw-alias-bg-card, #fff);
  color: var(--dsw-alias-label-secondary, #626a76);
  font-size: 12px;
  cursor: pointer;
  transition: all .15s ease;
}
.dsh-cloudq-insp__tab:hover {
  border-color: var(--dsw-alias-state-business-primary, #315efb);
}
.dsh-cloudq-insp__tab.is-active {
  background: var(--dsw-alias-state-business-primary, #315efb);
  border-color: var(--dsw-alias-state-business-primary, #315efb);
  color: #fff;
}
.dsh-cloudq-insp__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.dsh-cloudq-insp__card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  border: 1px solid var(--dsw-alias-border-l2, #e1e4e8);
  border-radius: 10px;
  background: var(--dsw-alias-bg-card, #fff);
  text-align: left;
  cursor: pointer;
  transition: border-color .15s ease, background-color .15s ease;
  font: inherit;
  color: inherit;
}
.dsh-cloudq-insp__card:hover {
  border-color: var(--dsw-alias-state-business-primary, #315efb);
  background: var(--dsw-alias-interactive-bg-hover, #eef1f5);
}
.dsh-cloudq-insp__card-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary, #1d2129);
}
.dsh-cloudq-insp__card-desc {
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-tertiary, #9aa1ab);
}
/* artifact library */
.dsh-cloudq-artifact__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 34px;
  padding: 0 0 10px;
  color: var(--dsw-alias-label-secondary, #626a76);
  font-size: 12px;
}
.dsh-cloudq-artifact__refresh {
  height: 28px;
  padding: 0 12px;
  border: 1px solid var(--dsw-alias-interactive-border, #cdd3da);
  border-radius: 2px;
  background: var(--dsw-alias-bg-card, #fff);
  color: var(--dsw-alias-state-business-primary, #006eff);
  font: inherit;
  cursor: pointer;
}
.dsh-cloudq-artifact__refresh:hover {
  border-color: var(--dsw-alias-state-business-primary, #006eff);
  background: var(--dsw-alias-interactive-bg-hover, #f0f2f5);
}
.dsh-cloudq-artifact__list {
  border-top: 1px solid var(--dsw-alias-border-l2, #e1e4e8);
}
.dsh-cloudq-artifact__columns {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 112px 148px 52px;
  align-items: center;
  min-height: 34px;
  padding: 0 4px 0 26px;
  background: var(--dsw-alias-bg-sub, #f7f8fa);
  color: var(--dsw-alias-label-tertiary, #9aa1ab);
  font-size: 12px;
}
.dsh-cloudq-artifact__columns span:last-child {
  text-align: right;
}
.dsh-cloudq-artifact__session {
  border-bottom: 1px solid var(--dsw-alias-border-l2, #e1e4e8);
}
.dsh-cloudq-artifact__session-head {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 42px;
  padding: 8px 4px;
  border: 0;
  background: var(--dsw-alias-bg-sub, #f7f8fa);
  color: var(--dsw-alias-label-primary, #1d2129);
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.dsh-cloudq-artifact__session-head:hover {
  background: var(--dsw-alias-interactive-bg-hover, #eef1f5);
}
.dsh-cloudq-artifact__chevron {
  flex: none;
  width: 14px;
  color: var(--dsw-alias-label-tertiary, #9aa1ab);
  font-size: 11px;
  text-align: center;
  transition: transform .15s ease;
}
.dsh-cloudq-artifact__session.is-collapsed .dsh-cloudq-artifact__chevron {
  transform: rotate(-90deg);
}
.dsh-cloudq-artifact__session-title {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  color: var(--dsw-alias-label-primary, #1d2129);
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.dsh-cloudq-artifact__session-meta {
  flex: none;
  color: var(--dsw-alias-label-tertiary, #9aa1ab);
  font-size: 12px;
  white-space: nowrap;
}
.dsh-cloudq-artifact__session.is-collapsed .dsh-cloudq-artifact__files {
  display: none;
}
.dsh-cloudq-artifact__file {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 112px 148px 52px;
  align-items: center;
  min-height: 42px;
  padding: 0 4px 0 26px;
  border-top: 1px solid var(--dsw-alias-border-l1, #f0f1f4);
  font-size: 12px;
}
.dsh-cloudq-artifact__file-main {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}
.dsh-cloudq-artifact__file-type {
  flex: none;
  min-width: 30px;
  padding: 2px 4px;
  border-radius: 2px;
  background: #e8f2ff;
  color: #006eff;
  font-size: 10px;
  line-height: 16px;
  text-align: center;
  text-transform: uppercase;
}
.dsh-cloudq-artifact__file-name {
  min-width: 0;
  overflow: hidden;
  color: var(--dsw-alias-label-primary, #1d2129);
  white-space: nowrap;
  text-overflow: ellipsis;
}
.dsh-cloudq-artifact__owner,
.dsh-cloudq-artifact__time {
  overflow: hidden;
  color: var(--dsw-alias-label-secondary, #626a76);
  white-space: nowrap;
  text-overflow: ellipsis;
}
.dsh-cloudq-artifact__download {
  justify-self: end;
  color: var(--dsw-alias-state-business-primary, #006eff);
  text-decoration: none;
}
.dsh-cloudq-artifact__download:hover {
  text-decoration: underline;
}
/* architecture library */
.dsh-cloudq-arch__toolbar {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}
.dsh-cloudq-arch__picker {
  position: relative;
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 8px;
}
.dsh-cloudq-arch__picker-label {
  flex: none;
  color: var(--dsw-alias-label-secondary, #626a76);
  font-size: 13px;
}
.dsh-cloudq-arch__tree-select {
  position: relative;
  width: 280px;
  max-width: calc(100vw - 180px);
}
.dsh-cloudq-arch__tree-trigger {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  height: 34px;
  padding: 0 10px;
  border: 1px solid var(--dsw-alias-interactive-border, #cdd3da);
  border-radius: 2px;
  outline: none;
  background: var(--dsw-alias-bg-card, #fff);
  color: var(--dsw-alias-label-primary, #1d2129);
  font: inherit;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
  transition: border-color .15s ease, box-shadow .15s ease;
}
.dsh-cloudq-arch__tree-trigger:hover {
  border-color: var(--dsw-alias-state-business-primary, #006eff);
}
.dsh-cloudq-arch__tree-trigger.is-open,
.dsh-cloudq-arch__tree-trigger:focus-visible {
  border-color: var(--dsw-alias-state-business-primary, #006eff);
  box-shadow: 0 0 0 2px rgba(0, 110, 255, .12);
}
.dsh-cloudq-arch__tree-trigger-label {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.dsh-cloudq-arch__tree-trigger-arrow {
  flex: none;
  margin-left: 8px;
  color: var(--dsw-alias-label-tertiary, #888e99);
  font-size: 11px;
  transition: transform .15s ease;
}
.dsh-cloudq-arch__tree-trigger.is-open .dsh-cloudq-arch__tree-trigger-arrow {
  transform: rotate(180deg);
}
.dsh-cloudq-arch__tree-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  box-sizing: border-box;
  width: 100%;
  max-height: 360px;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 4px 0;
  border: 1px solid var(--dsw-alias-border-l2, #dfe1e5);
  border-radius: 2px;
  background: var(--dsw-alias-bg-card, #fff);
  box-shadow: 0 4px 16px rgba(0, 0, 0, .16);
  z-index: 20;
}
.dsh-cloudq-arch__tree-node[hidden],
.dsh-cloudq-arch__tree-group[hidden] {
  display: none;
}
.dsh-cloudq-arch__tree-row {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 34px;
  padding-right: 10px;
  color: var(--dsw-alias-label-primary, #1d2129);
  font-size: 13px;
  cursor: pointer;
  outline: none;
  user-select: none;
}
.dsh-cloudq-arch__tree-row:hover,
.dsh-cloudq-arch__tree-row:focus-visible {
  background: var(--dsw-alias-interactive-bg-hover, #f0f2f5);
}
.dsh-cloudq-arch__tree-row.is-selected {
  background: #e8f2ff;
  color: var(--dsw-alias-state-business-primary, #006eff);
  font-weight: 500;
}
.dsh-cloudq-arch__tree-caret {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-right: 2px;
  color: var(--dsw-alias-label-tertiary, #888e99);
  font-size: 13px;
  transition: transform .15s ease;
}
.dsh-cloudq-arch__tree-node.is-expanded > .dsh-cloudq-arch__tree-row .dsh-cloudq-arch__tree-caret {
  transform: rotate(90deg);
}
.dsh-cloudq-arch__tree-caret.is-leaf {
  color: transparent;
}
.dsh-cloudq-arch__tree-folder {
  flex: none;
  width: 15px;
  height: 11px;
  margin-right: 8px;
  border: 1px solid currentColor;
  border-radius: 1px;
  color: #7d8793;
  opacity: .8;
}
.dsh-cloudq-arch__tree-folder::before {
  content: '';
  display: block;
  width: 7px;
  height: 3px;
  margin-top: -4px;
  margin-left: -1px;
  border: 1px solid currentColor;
  border-bottom: 0;
  border-radius: 1px 1px 0 0;
}
.dsh-cloudq-arch__tree-name {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.dsh-cloudq-arch__tree-check {
  flex: none;
  margin-left: 8px;
  color: var(--dsw-alias-state-business-primary, #006eff);
  font-size: 14px;
  visibility: hidden;
}
.dsh-cloudq-arch__tree-row.is-selected .dsh-cloudq-arch__tree-check {
  visibility: visible;
}
.dsh-cloudq-arch__summary {
  flex: none;
  color: var(--dsw-alias-label-tertiary, #9aa1ab);
  font-size: 12px;
  white-space: nowrap;
}
.dsh-cloudq-arch__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
@container cloudq-panel-body (min-width: 900px) {
  .dsh-cloudq-arch__grid {
grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@container cloudq-panel-body (min-width: 1260px) {
  .dsh-cloudq-arch__grid {
grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
.dsh-cloudq-arch__grid > .dsh-cloudq-panel__hint,
.dsh-cloudq-arch__grid > .dsh-cloudq-panel__error,
.dsh-cloudq-arch__grid > .dsh-cloudq-usage__table__empty {
  grid-column: 1 / -1;
}
.dsh-cloudq-arch__card {
  box-sizing: border-box;
  position: relative;
  min-width: 0;
  height: 260px;
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l2, #e1e4e8);
  background: var(--dsw-alias-bg-card, #fff);
  color: inherit;
  text-decoration: none;
  transition: border-color .15s ease, box-shadow .15s ease, transform .15s ease;
}
.dsh-cloudq-arch__card:hover {
  border-color: var(--dsw-alias-state-business-primary, #006eff);
  box-shadow: 0 4px 12px rgba(0, 0, 0, .1);
  transform: translateY(-1px);
}
.dsh-cloudq-arch__preview {
  position: absolute;
  inset: 0 0 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: var(--dsw-alias-bg-sub, #fff);
  background-image:
linear-gradient(30deg, transparent 49.5%, #edf0f3 49.5%, #edf0f3 50.5%, transparent 50.5%),
linear-gradient(-30deg, transparent 49.5%, #edf0f3 49.5%, #edf0f3 50.5%, transparent 50.5%);
  background-size: 80px 48px;
}
.dsh-cloudq-arch__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  background: rgba(255, 255, 255, .92);
}
.dsh-cloudq-arch__placeholder {
  padding: 0 12px;
  color: var(--dsw-alias-label-tertiary, #9aa1ab);
  font-size: 12px;
  text-align: center;
}
.dsh-cloudq-arch__footer {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  padding: 0 14px;
  background: rgba(31, 35, 41, .7);
  color: #fff;
}
.dsh-cloudq-arch__name {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.dsh-cloudq-arch__meta {
  flex: none;
  color: rgba(255, 255, 255, .78);
  font-size: 11px;
  white-space: nowrap;
}
@media (max-width: 760px) {
  .dsh-cloudq-artifact__file,
  .dsh-cloudq-artifact__columns {
grid-template-columns: minmax(0, 1fr) 52px;
  }
  .dsh-cloudq-artifact__owner,
  .dsh-cloudq-artifact__time,
  .dsh-cloudq-artifact__columns span:nth-child(2),
  .dsh-cloudq-artifact__columns span:nth-child(3) {
display: none;
  }
}
`

function installCloudqHeroStyles() {
  if (document.getElementById(CLOUDQ_HERO_STYLE_ID) !== null) return () => {}
  const style = document.createElement('style')
  style.id = CLOUDQ_HERO_STYLE_ID
  style.dataset.plugin = PACKAGE_ID
  style.textContent = CLOUDQ_HERO_CSS
  document.head.appendChild(style)
  return () => { style.remove() }
}

function buildCloudqQuestionButton(question) {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'dsh-cloudq-hero-question'
  const spark = document.createElement('span')
  spark.className = 'dsh-cloudq-hero-question__spark'
  spark.setAttribute('aria-hidden', 'true')
  spark.textContent = '✦'
  const label = document.createElement('span')
  label.className = 'dsh-cloudq-hero-question__label'
  label.textContent = question.label
  const prompt = document.createElement('span')
  prompt.className = 'dsh-cloudq-hero-question__prompt'
  prompt.textContent = question.prompt
  const chevron = document.createElement('span')
  chevron.className = 'dsh-cloudq-hero-question__chevron'
  chevron.textContent = '›'
  button.append(spark, label, prompt, chevron)
  button.addEventListener('click', () => {
    // Bridge to the React composer: the input service is a session-scoped
    // machine whose setDraft() is only reachable through the slot owner
    // share, so we round-trip through a CustomEvent and let the
    // CloudQBridge React component (registered in conversation.input.left)
    // forward the call to props.inputActions.setDraft.
    window.dispatchEvent(new CustomEvent('dsh-cloudq:draft', { detail: question.prompt }))
  })
  return button
}

// ------------------------------------------------------------------
// CloudQ side panel (usage / inspiration / artifact / architecture explorer)
// ------------------------------------------------------------------

const PANEL_MIN_WIDTH = 480
const PANEL_DEFAULT_WIDTH = 720

const API_USAGE = '/api/dsh-cloudq/usage'
const API_INSPIRATIONS = '/api/dsh-cloudq/inspirations'
const API_ARTIFACTS = '/api/dsh-cloudq/artifacts'
const API_ARCH_DIRECTORIES = '/api/dsh-cloudq/architecture/directories'
const API_ARCH_LIST = '/api/dsh-cloudq/architecture/list'
const CLOUDQ_ARCH_FOLDER_KEY = 'dsh-cloudq.architecture-folder-id'

// Usage detail time range: presets matching the CloudQ console plus a custom
// date pair. `usagePreset` persists while the panel is open.
const USAGE_RANGE_PRESETS = [
  { id: '3d', label: '最近 3 天', days: 3 },
  { id: '7d', label: '最近 1 周', days: 7 },
  { id: '30d', label: '最近 1 月', days: 30 },
  { id: 'custom', label: '自定义', days: 0 },
]
let usagePreset = '7d'
let usageCustomStart = ''
let usageCustomEnd = ''

function formatUsageTimestamp(d) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

/** Resolve the current range to API timestamps; null when custom dates are incomplete. */
function usageRangeTimestamps() {
  if (usagePreset === 'custom') {
    if (!usageCustomStart || !usageCustomEnd) return null
    return { start: `${usageCustomStart} 00:00:00`, end: `${usageCustomEnd} 23:59:59` }
  }
  const preset = USAGE_RANGE_PRESETS.find((item) => item.id === usagePreset) ?? USAGE_RANGE_PRESETS[1]
  const end = new Date()
  const start = new Date(end.getTime() - preset.days * 24 * 60 * 60 * 1000)
  return { start: formatUsageTimestamp(start), end: formatUsageTimestamp(end) }
}

function formatCredits(value) {
  const num = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(num)) return '—'
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDateTime(raw) {
  if (!raw) return '—'
  return String(raw).replace('T', ' ').slice(0, 19)
}

function formatFileSize(value) {
  const bytes = Number(value)
  if (!Number.isFinite(bytes) || bytes < 0) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function safeDownloadUrl(raw) {
  if (typeof raw !== 'string' || !raw) return ''
  try {
    const url = new URL(raw)
    return url.protocol === 'https:' ? url.href : ''
  } catch {
    return ''
  }
}

function flattenArchitectureDirectories(folders, depth = 0, result = []) {
  if (!Array.isArray(folders)) return result
  for (const folder of folders) {
    const id = Number(folder?.Id)
    if (Number.isSafeInteger(id) && id > 0) {
      result.push({ id, name: String(folder?.Name || `目录 ${id}`), depth })
    }
    flattenArchitectureDirectories(folder?.Children, depth + 1, result)
  }
  return result
}

function loadRememberedArchitectureFolder() {
  try {
    const id = Number(window.localStorage.getItem(CLOUDQ_ARCH_FOLDER_KEY))
    return Number.isSafeInteger(id) && id > 0 ? id : null
  } catch {
    return null
  }
}

function rememberArchitectureFolder(folderId) {
  try {
    window.localStorage.setItem(CLOUDQ_ARCH_FOLDER_KEY, String(folderId))
  } catch {
    // Private mode and quota errors must not prevent directory switching.
  }
}

function buildExpandIconButton(onClick) {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'dsh-cloudq-panel__expand'
  button.setAttribute('aria-label', '展开 CloudQ 能力面板')
  button.textContent = '›'
  button.setAttribute('aria-hidden', 'false')
  button.addEventListener('click', onClick)
  return button
}

// Shared panel shell: fixed right drawer with a draggable width resizer.
let panelEl = null
let panelBody = null
let panelView = 'usage'
let panelExpanded = false
let inspirationCache = null
let inspirationCategory = 0
let artifactCache = null
let artifactTotal = 0
let architectureDirectoriesCache = null
let architectureFirstFolderId = null
let architectureRequestSeq = 0
let architecturePickerCleanup = null

function renderUsageView() {
  panelBody.textContent = ''

  // Overview: only the cumulative consumed credits, matching the CloudQ
  // console card (公测期免费 badge keeps its billing-notice tooltip).
  const overviewWrap = document.createElement('div')
  overviewWrap.className = 'dsh-cloudq-usage__overview'
  const card = document.createElement('div')
  card.className = 'dsh-cloudq-usage__card'
  const label = document.createElement('div')
  label.className = 'dsh-cloudq-usage__card-label'
  label.textContent = '累计消耗 Credit'
  const valueRow = document.createElement('div')
  valueRow.className = 'dsh-cloudq-usage__card-value-row'
  const value = document.createElement('span')
  value.className = 'dsh-cloudq-usage__card-value'
  value.textContent = '…'
  const unit = document.createElement('span')
  unit.className = 'dsh-cloudq-usage__card-unit'
  unit.textContent = '个'
  const freeBadge = document.createElement('span')
  freeBadge.className = 'dsh-cloudq-usage__free-badge'
  freeBadge.textContent = '公测期免费 ⓘ'
  freeBadge.tabIndex = 0
  const freeBadgeTip = document.createElement('span')
  freeBadgeTip.className = 'dsh-cloudq-tooltip'
  freeBadgeTip.setAttribute('role', 'tooltip')
  freeBadgeTip.textContent = '正式计费将提前 1 个月通知'
  freeBadge.appendChild(freeBadgeTip)
  valueRow.append(value, unit, freeBadge)
  card.append(label, valueRow)
  overviewWrap.appendChild(card)
  panelBody.appendChild(overviewWrap)

  // Time range selector: presets + a custom date pair. Custom dropdown keeps
  // the console-style look instead of the native <select> popup.
  const rangeBar = document.createElement('div')
  rangeBar.className = 'dsh-cloudq-usage__range'

  const picker = document.createElement('div')
  picker.className = 'dsh-cloudq-usage__range-picker'
  const pickerBtn = document.createElement('button')
  pickerBtn.type = 'button'
  pickerBtn.className = 'dsh-cloudq-usage__range-btn'
  pickerBtn.setAttribute('aria-haspopup', 'listbox')
  pickerBtn.setAttribute('aria-expanded', 'false')
  pickerBtn.setAttribute('aria-label', '用量时间范围')
  const pickerLabel = document.createElement('span')
  pickerLabel.className = 'dsh-cloudq-usage__range-btn-label'
  const pickerChevron = document.createElement('span')
  pickerChevron.className = 'dsh-cloudq-usage__range-btn-chevron'
  pickerChevron.textContent = '▾'
  pickerBtn.append(pickerLabel, pickerChevron)

  const menu = document.createElement('div')
  menu.className = 'dsh-cloudq-usage__range-menu'
  menu.setAttribute('role', 'listbox')
  menu.hidden = true
  const optionButtons = new Map()
  for (const preset of USAGE_RANGE_PRESETS) {
    const option = document.createElement('button')
    option.type = 'button'
    option.className = 'dsh-cloudq-usage__range-option'
    option.setAttribute('role', 'option')
    const check = document.createElement('span')
    check.className = 'dsh-cloudq-usage__range-option-check'
    check.textContent = '✓'
    const text = document.createElement('span')
    text.textContent = preset.label
    option.append(check, text)
    option.addEventListener('click', () => {
      usagePreset = preset.id
      syncPicker()
      closeMenu()
      syncCustomVisibility()
      loadUsage()
    })
    optionButtons.set(preset.id, option)
    menu.appendChild(option)
  }

  const syncPicker = () => {
    const active = USAGE_RANGE_PRESETS.find((item) => item.id === usagePreset) ?? USAGE_RANGE_PRESETS[1]
    pickerLabel.textContent = active.label
    for (const [id, option] of optionButtons) {
      const isActive = id === active.id
      option.classList.toggle('is-active', isActive)
      option.setAttribute('aria-selected', String(isActive))
    }
  }

  const pickerAbort = new AbortController()
  const closeMenu = () => {
    menu.hidden = true
    picker.classList.remove('is-open')
    pickerBtn.setAttribute('aria-expanded', 'false')
  }
  pickerBtn.addEventListener('click', () => {
    const willOpen = menu.hidden
    menu.hidden = !willOpen
    picker.classList.toggle('is-open', willOpen)
    pickerBtn.setAttribute('aria-expanded', String(willOpen))
  })
  document.addEventListener('mousedown', (event) => {
    if (!menu.isConnected) {
      pickerAbort.abort()
      return
    }
    if (!picker.contains(event.target)) closeMenu()
  }, { signal: pickerAbort.signal })
  document.addEventListener('keydown', (event) => {
    if (!menu.isConnected) return
    if (event.key === 'Escape') closeMenu()
  }, { signal: pickerAbort.signal })
  syncPicker()

  const startDate = document.createElement('input')
  startDate.type = 'date'
  startDate.className = 'dsh-cloudq-usage__date'
  startDate.setAttribute('aria-label', '开始日期')
  startDate.value = usageCustomStart
  const endDate = document.createElement('input')
  endDate.type = 'date'
  endDate.className = 'dsh-cloudq-usage__date'
  endDate.setAttribute('aria-label', '结束日期')
  endDate.value = usageCustomEnd
  const rangeError = document.createElement('span')
  rangeError.className = 'dsh-cloudq-usage__range-error'

  const syncCustomVisibility = () => {
    const custom = usagePreset === 'custom'
    startDate.hidden = !custom
    endDate.hidden = !custom
  }

  const tableWrap = document.createElement('div')

  const loadUsage = () => {
    const range = usageRangeTimestamps()
    rangeError.textContent = ''
    if (!range) {
      tableWrap.textContent = ''
      const hint = document.createElement('div')
      hint.className = 'dsh-cloudq-panel__hint'
      hint.textContent = '请选择开始日期与结束日期。'
      tableWrap.appendChild(hint)
      return
    }
    if (usagePreset === 'custom' && usageCustomStart > usageCustomEnd) {
      rangeError.textContent = '开始日期不能晚于结束日期。'
      return
    }
    tableWrap.textContent = ''
    const hint = document.createElement('div')
    hint.className = 'dsh-cloudq-panel__hint'
    hint.textContent = '正在加载用量…'
    tableWrap.appendChild(hint)

    requireCloudqCredential()
      .then(() => cloudqRequest(`${API_USAGE}?start=${encodeURIComponent(range.start)}&end=${encodeURIComponent(range.end)}`))
      .then((data) => {
        if (panelView !== 'usage' || !panelExpanded) return
        value.textContent = formatCredits(data.overview?.TotalCredits)
        const rows = Array.isArray(data.detail) ? data.detail : []
        tableWrap.textContent = ''

        const table = document.createElement('table')
        table.className = 'dsh-cloudq-usage__table'
        const thead = document.createElement('thead')
        const headerRow = document.createElement('tr')
        for (const heading of ['时间', '渠道', '内容', '积分']) {
          const cell = document.createElement('th')
          cell.textContent = heading
          headerRow.appendChild(cell)
        }
        thead.appendChild(headerRow)
        table.appendChild(thead)

        const tbody = document.createElement('tbody')
        if (rows.length === 0) {
          const tr = document.createElement('tr')
          const empty = document.createElement('td')
          empty.colSpan = 4
          empty.className = 'dsh-cloudq-usage__table__empty'
          empty.textContent = '当前时间范围内暂无用量记录'
          tr.appendChild(empty)
          tbody.appendChild(tr)
        } else {
          for (const row of rows) {
            const tr = document.createElement('tr')
            const time = document.createElement('td')
            time.textContent = formatDateTime(row.StartTime)
            const channel = document.createElement('td')
            channel.textContent = row.Channel ?? '—'
            const message = document.createElement('td')
            const msgSpan = document.createElement('span')
            msgSpan.className = 'dsh-cloudq-usage__table__message'
            msgSpan.textContent = row.Message ?? ''
            message.appendChild(msgSpan)
            const credits = document.createElement('td')
            credits.className = 'dsh-cloudq-usage__table__credits'
            credits.textContent = formatCredits(row.Credits)
            tr.appendChild(time)
            tr.appendChild(channel)
            tr.appendChild(message)
            tr.appendChild(credits)
            tbody.appendChild(tr)
          }
        }
        table.appendChild(tbody)
        tableWrap.appendChild(table)
      })
      .catch((error) => {
        if (panelView !== 'usage' || !panelExpanded) return
        tableWrap.textContent = ''
        const err = document.createElement('div')
        err.className = 'dsh-cloudq-panel__error'
        err.textContent = cloudqPanelErrorText(error, '用量加载失败')
        tableWrap.appendChild(err)
      })
  }

  const onCustomDateChange = () => {
    usageCustomStart = startDate.value
    usageCustomEnd = endDate.value
    loadUsage()
  }
  startDate.addEventListener('change', onCustomDateChange)
  endDate.addEventListener('change', onCustomDateChange)

  picker.append(pickerBtn, menu)
  rangeBar.append(picker, startDate, endDate, rangeError)
  syncCustomVisibility()
  panelBody.appendChild(rangeBar)
  panelBody.appendChild(tableWrap)
  loadUsage()
}

const INSPIRATION_TABS = [
  { category: 0, label: '全部' },
  { category: 2, label: '风险隐患' },
  { category: 1, label: 'FinOps' },
  { category: 3, label: '容量负载' },
  { category: 4, label: '架构治理' },
  { category: 5, label: '根因分析' },
  { category: 6, label: '定时任务' },
  { category: 7, label: '解决方案' },
]

function renderInspirationView() {
  panelBody.textContent = ''

  const tabs = document.createElement('div')
  tabs.className = 'dsh-cloudq-insp__tabs'
  for (const tab of INSPIRATION_TABS) {
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = `dsh-cloudq-insp__tab${tab.category === inspirationCategory ? ' is-active' : ''}`
    btn.textContent = tab.label
    btn.addEventListener('click', () => {
      inspirationCategory = tab.category
      renderInspirationView()
    })
    tabs.appendChild(btn)
  }
  panelBody.appendChild(tabs)

  const list = document.createElement('div')
  list.className = 'dsh-cloudq-insp__list'
  panelBody.appendChild(list)

  const paint = (inspirations) => {
    if (panelView !== 'inspiration' || !panelExpanded) return
    list.textContent = ''
    const filtered = inspirationCategory === 0
      ? inspirations
      : inspirations.filter((item) => Number(item.Category) === inspirationCategory)
    if (filtered.length === 0) {
      const empty = document.createElement('div')
      empty.className = 'dsh-cloudq-usage__table__empty'
      empty.textContent = '该分类下暂无灵感'
      list.appendChild(empty)
      return
    }
    for (const item of filtered) {
      const card = document.createElement('button')
      card.type = 'button'
      card.className = 'dsh-cloudq-insp__card'
      const title = document.createElement('span')
      title.className = 'dsh-cloudq-insp__card-title'
      title.textContent = item.Title ?? item.Prompt ?? ''
      const desc = document.createElement('span')
      desc.className = 'dsh-cloudq-insp__card-desc'
      desc.textContent = item.Description ?? ''
      card.appendChild(title)
      card.appendChild(desc)
      card.addEventListener('click', () => {
        const prompt = item.Prompt ?? item.Title ?? ''
        window.dispatchEvent(new CustomEvent('dsh-cloudq:draft', { detail: prompt }))
      })
      list.appendChild(card)
    }
  }

  if (inspirationCache) {
    paint(inspirationCache)
    return
  }
  const hint = document.createElement('div')
  hint.className = 'dsh-cloudq-panel__hint'
  hint.textContent = '正在加载灵感…'
  list.appendChild(hint)
  requireCloudqCredential()
    .then(() => cloudqRequest(API_INSPIRATIONS))
    .then((data) => {
      inspirationCache = Array.isArray(data.inspirations) ? data.inspirations : []
      paint(inspirationCache)
    })
    .catch((error) => {
      if (!panelExpanded) return
      list.textContent = ''
      const err = document.createElement('div')
      err.className = 'dsh-cloudq-panel__error'
      err.textContent = cloudqPanelErrorText(error, '灵感加载失败')
      list.appendChild(err)
    })
}

function renderArtifactView({ force = false } = {}) {
  panelBody.textContent = ''

  const paint = (sessions, total) => {
    if (panelView !== 'artifact' || !panelExpanded) return
    panelBody.textContent = ''

    const safeSessions = Array.isArray(sessions) ? sessions : []
    const artifactCount = safeSessions.reduce((sum, session) => {
      const artifacts = Array.isArray(session?.Artifacts) ? session.Artifacts : []
      return sum + artifacts.length
    }, 0)

    const toolbar = document.createElement('div')
    toolbar.className = 'dsh-cloudq-artifact__toolbar'
    const summary = document.createElement('span')
    summary.textContent = `共 ${Number(total) || safeSessions.length} 组会话，${artifactCount} 个制品`
    const refresh = document.createElement('button')
    refresh.type = 'button'
    refresh.className = 'dsh-cloudq-artifact__refresh'
    refresh.dataset.testid = 'cloudq-artifact-refresh-btn'
    refresh.textContent = '刷新'
    refresh.addEventListener('click', () => {
      artifactCache = null
      artifactTotal = 0
      renderArtifactView({ force: true })
    })
    toolbar.appendChild(summary)
    toolbar.appendChild(refresh)
    panelBody.appendChild(toolbar)

    if (safeSessions.length === 0) {
      const empty = document.createElement('div')
      empty.className = 'dsh-cloudq-usage__table__empty'
      empty.textContent = '暂无制品'
      panelBody.appendChild(empty)
      return
    }

    const list = document.createElement('div')
    list.className = 'dsh-cloudq-artifact__list'
    const columns = document.createElement('div')
    columns.className = 'dsh-cloudq-artifact__columns'
    for (const label of ['报告名称', '用户名称', '生成时间', '操作']) {
      const cell = document.createElement('span')
      cell.textContent = label
      columns.appendChild(cell)
    }
    list.appendChild(columns)

    for (const session of safeSessions) {
      const artifacts = Array.isArray(session?.Artifacts) ? session.Artifacts : []
      const group = document.createElement('section')
      group.className = 'dsh-cloudq-artifact__session'

      const sessionHead = document.createElement('button')
      sessionHead.type = 'button'
      sessionHead.className = 'dsh-cloudq-artifact__session-head'
      sessionHead.dataset.testid = `cloudq-artifact-session-${session?.SessionID ?? 'unknown'}`
      sessionHead.setAttribute('aria-expanded', 'true')

      const chevron = document.createElement('span')
      chevron.className = 'dsh-cloudq-artifact__chevron'
      chevron.textContent = '▼'
      const title = document.createElement('span')
      title.className = 'dsh-cloudq-artifact__session-title'
      title.textContent = session?.SessionTitle || '未命名会话'
      title.title = title.textContent
      const latestTime = artifacts.reduce((latest, artifact) => {
        const time = String(artifact?.ArchiveTime ?? '')
        return time > latest ? time : latest
      }, '')
      const meta = document.createElement('span')
      meta.className = 'dsh-cloudq-artifact__session-meta'
      meta.textContent = `${artifacts.length} 个制品${latestTime ? ` · 最近 ${latestTime.slice(0, 10)}` : ''}`
      sessionHead.appendChild(chevron)
      sessionHead.appendChild(title)
      sessionHead.appendChild(meta)

      const files = document.createElement('div')
      files.className = 'dsh-cloudq-artifact__files'
      for (const artifact of artifacts) {
        const row = document.createElement('div')
        row.className = 'dsh-cloudq-artifact__file'

        const main = document.createElement('div')
        main.className = 'dsh-cloudq-artifact__file-main'
        const type = document.createElement('span')
        type.className = 'dsh-cloudq-artifact__file-type'
        type.textContent = artifact?.FileType || 'file'
        const name = document.createElement('span')
        name.className = 'dsh-cloudq-artifact__file-name'
        name.textContent = artifact?.FileName || '未命名文件'
        name.title = `${name.textContent} · ${formatFileSize(artifact?.SizeBytes)}`
        main.appendChild(type)
        main.appendChild(name)

        const owner = document.createElement('span')
        owner.className = 'dsh-cloudq-artifact__owner'
        owner.textContent = artifact?.UserName || '—'
        const time = document.createElement('span')
        time.className = 'dsh-cloudq-artifact__time'
        time.textContent = formatDateTime(artifact?.ArchiveTime)

        const downloadUrl = safeDownloadUrl(artifact?.DownloadURL)
        const action = document.createElement(downloadUrl ? 'a' : 'span')
        action.className = 'dsh-cloudq-artifact__download'
        action.textContent = downloadUrl ? '下载' : '不可用'
        if (downloadUrl) {
          action.href = downloadUrl
          action.target = '_blank'
          action.rel = 'noopener noreferrer'
          action.dataset.testid = `cloudq-artifact-download-${artifact?.ArtifactID ?? 'unknown'}`
        }

        row.appendChild(main)
        row.appendChild(owner)
        row.appendChild(time)
        row.appendChild(action)
        files.appendChild(row)
      }

      sessionHead.addEventListener('click', () => {
        const collapsed = group.classList.toggle('is-collapsed')
        sessionHead.setAttribute('aria-expanded', String(!collapsed))
      })
      group.appendChild(sessionHead)
      group.appendChild(files)
      list.appendChild(group)
    }
    panelBody.appendChild(list)
  }

  if (artifactCache !== null && !force) {
    paint(artifactCache, artifactTotal)
    return
  }

  const hint = document.createElement('div')
  hint.className = 'dsh-cloudq-panel__hint'
  hint.textContent = '正在加载制品…'
  panelBody.appendChild(hint)
  requireCloudqCredential()
    .then(() => cloudqRequest(API_ARTIFACTS))
    .then((data) => {
      artifactCache = Array.isArray(data?.sessions) ? data.sessions : []
      artifactTotal = Number(data?.total) || artifactCache.length
      paint(artifactCache, artifactTotal)
    })
    .catch((error) => {
      if (panelView !== 'artifact' || !panelExpanded) return
      panelBody.textContent = ''
      const err = document.createElement('div')
      err.className = 'dsh-cloudq-panel__error'
      err.textContent = cloudqPanelErrorText(error, '制品加载失败')
      panelBody.appendChild(err)
    })
}

function renderArchitectureView() {
  panelBody.textContent = ''
  const viewRequest = ++architectureRequestSeq
  const loading = document.createElement('div')
  loading.className = 'dsh-cloudq-panel__hint'
  loading.textContent = '正在加载架构目录…'
  panelBody.appendChild(loading)

  const paintDirectories = (folders, firstFolderId) => {
    if (panelView !== 'architecture' || !panelExpanded || viewRequest !== architectureRequestSeq) return
    const directories = flattenArchitectureDirectories(folders)
    panelBody.textContent = ''
    if (directories.length === 0) {
      const empty = document.createElement('div')
      empty.className = 'dsh-cloudq-usage__table__empty'
      empty.textContent = '暂无架构目录'
      panelBody.appendChild(empty)
      return
    }

    const remembered = loadRememberedArchitectureFolder()
    const rememberedExists = directories.some((directory) => directory.id === remembered)
    const apiDefault = Number(firstFolderId)
    const apiDefaultExists = directories.some((directory) => directory.id === apiDefault)
    let selectedFolderId = rememberedExists
      ? remembered
      : (apiDefaultExists ? apiDefault : directories[0].id)

    const toolbar = document.createElement('div')
    toolbar.className = 'dsh-cloudq-arch__toolbar'
    const picker = document.createElement('div')
    picker.className = 'dsh-cloudq-arch__picker'
    const pickerLabel = document.createElement('span')
    pickerLabel.className = 'dsh-cloudq-arch__picker-label'
    pickerLabel.textContent = '目录'

    const treeSelect = document.createElement('div')
    treeSelect.className = 'dsh-cloudq-arch__tree-select'
    const trigger = document.createElement('button')
    trigger.type = 'button'
    trigger.className = 'dsh-cloudq-arch__tree-trigger'
    trigger.dataset.testid = 'cloudq-architecture-directory-select'
    trigger.setAttribute('role', 'combobox')
    trigger.setAttribute('aria-haspopup', 'tree')
    trigger.setAttribute('aria-expanded', 'false')
    trigger.setAttribute('aria-controls', 'dsh-cloudq-architecture-directory-tree')

    const triggerLabel = document.createElement('span')
    triggerLabel.className = 'dsh-cloudq-arch__tree-trigger-label'
    const selectedDirectory = directories.find((directory) => directory.id === selectedFolderId)
    triggerLabel.textContent = selectedDirectory?.name || '请选择目录'
    const triggerArrow = document.createElement('span')
    triggerArrow.className = 'dsh-cloudq-arch__tree-trigger-arrow'
    triggerArrow.setAttribute('aria-hidden', 'true')
    triggerArrow.textContent = '▼'
    trigger.appendChild(triggerLabel)
    trigger.appendChild(triggerArrow)

    const tree = document.createElement('div')
    tree.id = 'dsh-cloudq-architecture-directory-tree'
    tree.className = 'dsh-cloudq-arch__tree-menu'
    tree.dataset.testid = 'cloudq-architecture-directory-tree'
    tree.setAttribute('role', 'tree')
    tree.setAttribute('aria-label', '架构目录')
    tree.hidden = true

    const containsFolder = (folder, folderId) => {
      if (Number(folder?.Id) === folderId) return true
      return Array.isArray(folder?.Children)
        && folder.Children.some((child) => containsFolder(child, folderId))
    }

    const setExpanded = (node, row, group, expanded) => {
      node.classList.toggle('is-expanded', expanded)
      row.setAttribute('aria-expanded', String(expanded))
      group.hidden = !expanded
    }

    const syncTreeSelection = () => {
      for (const row of tree.querySelectorAll('[role="treeitem"]')) {
        const selected = Number(row.dataset.folderId) === selectedFolderId
        row.classList.toggle('is-selected', selected)
        row.setAttribute('aria-selected', String(selected))
      }
    }

    const selectFolder = (folderId, folderName) => {
      if (!Number.isSafeInteger(folderId) || folderId <= 0) return
      const changed = selectedFolderId !== folderId
      selectedFolderId = folderId
      triggerLabel.textContent = folderName
      rememberArchitectureFolder(folderId)
      syncTreeSelection()
      setMenuOpen(false)
      if (changed) loadArchitectures(folderId)
    }

    const renderFolderNodes = (foldersToRender, parent, depth = 0) => {
      if (!Array.isArray(foldersToRender)) return
      for (const folder of foldersToRender) {
        const folderId = Number(folder?.Id)
        if (!Number.isSafeInteger(folderId) || folderId <= 0) continue
        const children = Array.isArray(folder?.Children) ? folder.Children : []
        const folderName = String(folder?.Name || `目录 ${folderId}`)
        const node = document.createElement('div')
        node.className = 'dsh-cloudq-arch__tree-node'

        const row = document.createElement('div')
        row.className = 'dsh-cloudq-arch__tree-row'
        row.dataset.folderId = String(folderId)
        row.dataset.testid = `cloudq-architecture-directory-${folderId}`
        row.setAttribute('role', 'treeitem')
        row.setAttribute('aria-level', String(depth + 1))
        row.setAttribute('aria-selected', String(folderId === selectedFolderId))
        row.tabIndex = folderId === selectedFolderId ? 0 : -1
        row.style.paddingLeft = `${6 + depth * 22}px`
        if (folderId === selectedFolderId) row.classList.add('is-selected')

        const caret = document.createElement('span')
        caret.className = `dsh-cloudq-arch__tree-caret${children.length === 0 ? ' is-leaf' : ''}`
        caret.setAttribute('aria-hidden', 'true')
        caret.textContent = '▶'
        const folderIcon = document.createElement('span')
        folderIcon.className = 'dsh-cloudq-arch__tree-folder'
        folderIcon.setAttribute('aria-hidden', 'true')
        const name = document.createElement('span')
        name.className = 'dsh-cloudq-arch__tree-name'
        name.textContent = folderName
        name.title = folderName
        const check = document.createElement('span')
        check.className = 'dsh-cloudq-arch__tree-check'
        check.setAttribute('aria-hidden', 'true')
        check.textContent = '✓'
        row.appendChild(caret)
        row.appendChild(folderIcon)
        row.appendChild(name)
        row.appendChild(check)
        node.appendChild(row)

        let group = null
        if (children.length > 0) {
          group = document.createElement('div')
          group.className = 'dsh-cloudq-arch__tree-group'
          group.setAttribute('role', 'group')
          node.appendChild(group)
          renderFolderNodes(children, group, depth + 1)
          const startsExpanded = containsFolder(folder, selectedFolderId)
            && folderId !== selectedFolderId
          setExpanded(node, row, group, startsExpanded)
          caret.addEventListener('click', (event) => {
            event.stopPropagation()
            setExpanded(node, row, group, !node.classList.contains('is-expanded'))
          })
        }

        const choose = () => selectFolder(folderId, folderName)
        row.addEventListener('click', choose)
        row.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            choose()
          } else if (event.key === 'ArrowRight' && group) {
            event.preventDefault()
            setExpanded(node, row, group, true)
          } else if (event.key === 'ArrowLeft' && group) {
            event.preventDefault()
            setExpanded(node, row, group, false)
          } else if (event.key === 'Escape') {
            event.preventDefault()
            setMenuOpen(false)
            trigger.focus()
          }
        })
        parent.appendChild(node)
      }
    }
    renderFolderNodes(folders, tree)

    const onOutside = (event) => {
      if (!treeSelect.contains(event.target)) setMenuOpen(false)
    }
    const onDocumentKeyDown = (event) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      trigger.focus()
    }
    function setMenuOpen(open) {
      tree.hidden = !open
      trigger.classList.toggle('is-open', open)
      trigger.setAttribute('aria-expanded', String(open))
      document.removeEventListener('mousedown', onOutside, true)
      document.removeEventListener('keydown', onDocumentKeyDown, true)
      if (open) {
        document.addEventListener('mousedown', onOutside, true)
        document.addEventListener('keydown', onDocumentKeyDown, true)
        window.requestAnimationFrame(() => {
          tree.querySelector('.dsh-cloudq-arch__tree-row.is-selected')?.focus()
        })
      }
    }
    trigger.addEventListener('click', () => setMenuOpen(tree.hidden))
    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        setMenuOpen(true)
      } else if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    })
    architecturePickerCleanup = () => {
      document.removeEventListener('mousedown', onOutside, true)
      document.removeEventListener('keydown', onDocumentKeyDown, true)
    }

    const summary = document.createElement('span')
    summary.className = 'dsh-cloudq-arch__summary'
    summary.textContent = '正在加载…'
    treeSelect.appendChild(trigger)
    treeSelect.appendChild(tree)
    picker.appendChild(pickerLabel)
    picker.appendChild(treeSelect)
    toolbar.appendChild(picker)
    toolbar.appendChild(summary)

    const grid = document.createElement('div')
    grid.className = 'dsh-cloudq-arch__grid'
    panelBody.appendChild(toolbar)
    panelBody.appendChild(grid)

    const loadArchitectures = (folderId) => {
      const request = ++architectureRequestSeq
      grid.textContent = ''
      summary.textContent = '正在加载…'
      const hint = document.createElement('div')
      hint.className = 'dsh-cloudq-panel__hint'
      hint.textContent = '正在加载架构图…'
      grid.appendChild(hint)

      cloudqRequest(`${API_ARCH_LIST}?folderId=${encodeURIComponent(folderId)}`)
        .then((data) => {
          if (panelView !== 'architecture' || !panelExpanded || request !== architectureRequestSeq) return
          const architectures = Array.isArray(data?.architectures) ? data.architectures : []
          grid.textContent = ''
          summary.textContent = `共 ${Number(data?.total) || architectures.length} 个架构图`
          if (architectures.length === 0) {
            const empty = document.createElement('div')
            empty.className = 'dsh-cloudq-usage__table__empty'
            empty.textContent = '当前目录暂无架构图'
            grid.appendChild(empty)
            return
          }

          for (const architecture of architectures) {
            const imageUrl = safeDownloadUrl(architecture?.SvgURL)
            const card = document.createElement(imageUrl ? 'a' : 'article')
            card.className = 'dsh-cloudq-arch__card'
            card.dataset.testid = `cloudq-architecture-card-${architecture?.ArchId ?? 'unknown'}`
            if (imageUrl) {
              card.href = imageUrl
              card.target = '_blank'
              card.rel = 'noopener noreferrer'
              card.setAttribute('aria-label', `查看架构图：${architecture?.ArchName || '未命名系统'}`)
            }

            const preview = document.createElement('div')
            preview.className = 'dsh-cloudq-arch__preview'
            const placeholder = document.createElement('span')
            placeholder.className = 'dsh-cloudq-arch__placeholder'
            placeholder.textContent = imageUrl ? '正在加载预览…' : '暂无预览'
            preview.appendChild(placeholder)
            if (imageUrl) {
              const image = document.createElement('img')
              image.className = 'dsh-cloudq-arch__image'
              image.src = imageUrl
              image.alt = architecture?.ArchName || '架构图预览'
              image.loading = 'lazy'
              image.decoding = 'async'
              image.referrerPolicy = 'no-referrer'
              image.addEventListener('load', () => placeholder.remove())
              image.addEventListener('error', () => {
                image.remove()
                placeholder.textContent = '预览加载失败，点击可打开原图'
              })
              preview.appendChild(image)
            }

            const footer = document.createElement('div')
            footer.className = 'dsh-cloudq-arch__footer'
            const name = document.createElement('span')
            name.className = 'dsh-cloudq-arch__name'
            name.textContent = architecture?.ArchName || '未命名系统'
            name.title = name.textContent
            const meta = document.createElement('span')
            meta.className = 'dsh-cloudq-arch__meta'
            const tags = Array.isArray(architecture?.Tags) ? architecture.Tags : []
            meta.textContent = tags.length > 0
              ? `${tags.length} 个标签`
              : (architecture?.VersionName || '')
            footer.appendChild(name)
            footer.appendChild(meta)
            card.appendChild(preview)
            card.appendChild(footer)
            grid.appendChild(card)
          }
        })
        .catch((error) => {
          if (panelView !== 'architecture' || !panelExpanded || request !== architectureRequestSeq) return
          grid.textContent = ''
          summary.textContent = '加载失败'
          const err = document.createElement('div')
          err.className = 'dsh-cloudq-panel__error'
          err.textContent = cloudqPanelErrorText(error, '架构图加载失败')
          grid.appendChild(err)
        })
    }

    loadArchitectures(selectedFolderId)
  }

  if (architectureDirectoriesCache !== null) {
    paintDirectories(architectureDirectoriesCache, architectureFirstFolderId)
    return
  }
  requireCloudqCredential()
    .then(() => cloudqRequest(API_ARCH_DIRECTORIES))
    .then((data) => {
      architectureDirectoriesCache = Array.isArray(data?.folders) ? data.folders : []
      architectureFirstFolderId = Number(data?.firstFolderId) || null
      paintDirectories(architectureDirectoriesCache, architectureFirstFolderId)
    })
    .catch((error) => {
      if (panelView !== 'architecture' || !panelExpanded || viewRequest !== architectureRequestSeq) return
      panelBody.textContent = ''
      const err = document.createElement('div')
      err.className = 'dsh-cloudq-panel__error'
      err.textContent = cloudqPanelErrorText(error, '架构目录加载失败')
      panelBody.appendChild(err)
    })
}

function renderPanel() {
  if (architecturePickerCleanup) {
    architecturePickerCleanup()
    architecturePickerCleanup = null
  }
  if (panelView === 'usage') renderUsageView()
  else if (panelView === 'inspiration') renderInspirationView()
  else if (panelView === 'artifact') renderArtifactView()
  else renderArchitectureView()
}

function openPanel() {
  panelExpanded = true
  document.documentElement.classList.add('dsh-cloudq-panel__rail-enter')
  document.documentElement.classList.remove('dsh-cloudq-panel__rail-leave')
  // Pull the toggle chip onto the rail so it remains visible and acts
  // as the close affordance while the rail is open.
  const chip = document.querySelector('[data-cloudq-convo-chip="true"]')
  if (chip) chip.classList.add('is-open')
  // Seed the CSS variable on every open so the chip, padding-right, and
  // rail stay in lock-step before the resizer fires.
  document.documentElement.style.setProperty('--cloudq-rail-width', `${PANEL_DEFAULT_WIDTH}px`)
  if (!panelEl) {
    // Build once; reuse across opens so the resizer/state persists.
    panelEl = document.createElement('div')
    panelEl.className = 'dsh-cloudq-panel__rail'
    panelEl.style.width = `${PANEL_DEFAULT_WIDTH}px`

    const resizer = document.createElement('div')
    resizer.className = 'dsh-cloudq-panel__resizer'
    resizer.addEventListener('mousedown', (event) => {
      event.preventDefault()
      resizer.classList.add('is-dragging')
      const startX = event.clientX
      const startWidth = panelEl.getBoundingClientRect().width
      const onMove = (moveEvent) => {
        const nextWidth = Math.max(PANEL_MIN_WIDTH, Math.min(window.innerWidth * 0.8, startWidth + (startX - moveEvent.clientX)))
        panelEl.style.width = `${nextWidth}px`
        document.documentElement.style.setProperty('--cloudq-rail-width', `${nextWidth}px`)
      }
      const onUp = () => {
        resizer.classList.remove('is-dragging')
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
      }
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
    })

    const inner = document.createElement('div')
    inner.className = 'dsh-cloudq-panel__inner'

    const header = document.createElement('div')
    header.className = 'dsh-cloudq-panel__header'

    const PANEL_VIEWS = [
      { value: 'usage', label: '用量' },
      { value: 'inspiration', label: '灵感' },
      { value: 'artifact', label: '制品' },
      { value: 'architecture', label: '架构图' },
    ]
    const tabs = document.createElement('div')
    tabs.className = 'dsh-cloudq-panel__tabs'
    tabs.setAttribute('role', 'tablist')
    tabs.setAttribute('aria-label', 'CloudQ 能力')

    const syncTabs = () => {
      for (const tab of tabs.children) {
        const active = tab.dataset.value === panelView
        tab.classList.toggle('is-active', active)
        tab.setAttribute('aria-selected', String(active))
        tab.tabIndex = active ? 0 : -1
      }
    }

    for (const view of PANEL_VIEWS) {
      const tab = document.createElement('button')
      tab.type = 'button'
      tab.className = 'dsh-cloudq-panel__tab'
      tab.dataset.value = view.value
      tab.setAttribute('role', 'tab')
      tab.textContent = view.label
      tab.addEventListener('click', () => {
        if (panelView === view.value) return
        panelView = view.value
        syncTabs()
        renderPanel()
      })
      tabs.appendChild(tab)
    }
    syncTabs()
    header.appendChild(tabs)

    panelBody = document.createElement('div')
    panelBody.className = 'dsh-cloudq-panel__body'

    inner.appendChild(header)
    inner.appendChild(panelBody)
    panelEl.appendChild(resizer)
    panelEl.appendChild(inner)
    document.body.appendChild(panelEl)
  }
  panelEl.classList.add('is-open')
  renderPanel()
}

function closePanel() {
  panelExpanded = false
  if (architecturePickerCleanup) {
    architecturePickerCleanup()
    architecturePickerCleanup = null
  }
  document.documentElement.classList.remove('dsh-cloudq-panel__rail-enter')
  document.documentElement.classList.add('dsh-cloudq-panel__rail-leave')
  const chip = document.querySelector('[data-cloudq-convo-chip="true"]')
  if (chip) chip.classList.remove('is-open')
  if (panelEl) panelEl.classList.remove('is-open')
}

function togglePanel() {
  if (panelExpanded) closePanel()
  else openPanel()
}

// Right-panel toggle icon: a rounded rect with a vertical seam, the
// highlighted half flips to show open/closed state.
function buildIconSvg() {
  const svgNs = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(svgNs, 'svg')
  svg.setAttribute('viewBox', '0 0 24 24')
  svg.setAttribute('fill', 'none')
  svg.setAttribute('stroke', 'currentColor')
  svg.setAttribute('stroke-width', '1.6')
  svg.setAttribute('stroke-linecap', 'round')
  svg.setAttribute('stroke-linejoin', 'round')
  // Outer rounded panel.
  const rect = document.createElementNS(svgNs, 'rect')
  rect.setAttribute('x', '4')
  rect.setAttribute('y', '3.5')
  rect.setAttribute('width', '16')
  rect.setAttribute('height', '17')
  rect.setAttribute('rx', '2.5')
  svg.appendChild(rect)
  // Vertical seam at 14 — splits the panel into a narrow left rail and
  // a wider right workspace. Drawn as a soft line that always sits at
  // 60% width regardless of state.
  const seam = document.createElementNS(svgNs, 'path')
  seam.setAttribute('d', 'M14 3.5 V20.5')
  svg.appendChild(seam)
  return svg
}

function buildCloudqHeroPane() {
  const wrap = document.createElement('div')
  wrap.dataset.cloudqHero = 'true'
  wrap.style.position = 'relative'
  const title = document.createElement('h1')
  title.className = 'dsh-cloudq-hero-title'
  title.textContent = CLOUDQ_HEADLINE
  const subtitle = document.createElement('p')
  subtitle.className = 'dsh-cloudq-hero-subtitle'
  subtitle.textContent = CLOUDQ_SUBTITLE
  const questions = document.createElement('div')
  questions.className = 'dsh-cloudq-hero-questions'
  CLOUDQ_QUESTIONS.forEach((q) => questions.appendChild(buildCloudqQuestionButton(q)))
  wrap.appendChild(title)
  wrap.appendChild(subtitle)
  wrap.appendChild(questions)
  return wrap
}

// Hero content is rendered inside a relative wrapper so we can pin the
// expand icon to its top-right without touching dsh's outer layout.
function buildCloudqExpandChip(parent, onClick) {
  const chip = document.createElement('button')
  chip.type = 'button'
  chip.className = 'dsh-cloudq-hero-chip'
  chip.setAttribute('aria-label', '展开 CloudQ 能力面板')
  chip.appendChild(buildIconSvg())
  chip.addEventListener('click', onClick)
  parent.appendChild(chip)
  return chip
}

// The default hero lives at the top of the EmptyHero shell; we cannot
// replace the React tree, so we add our pane right under the existing
// fish + headline + workspace row (so it sits in the same vertical flow).
// For non-CloudQ sessions we hide the pane via [data-cloudq-hero='active']
// attribute so a session switch leaves nothing behind.
function findHeroRoot() {
  // Walk up from the headlineText span: the React tree exposes
  // a CSS-module-mangled "EmptyHero" root whose immediate ancestor is a
  // two-line stack (headline row + workspace row). Picking that root keeps
  // our pane visually attached to the existing hero chrome.
  const headline = document.querySelector('[class*=headlineText]')
  if (!headline) return null
  const stack = headline.parentElement
  if (!stack) return null
  // The hero shell root sits one level above the stack.
  return stack.parentElement
}

function applyCloudqHero(active) {
  const heroRoot = findHeroRoot()
  document.body.classList.toggle('dsh-cloudq-mode-active', active)

  if (!active) {
    if (heroRoot) {
      const pane = heroRoot.querySelector('[data-cloudq-hero="true"]')
      if (pane) pane.remove()
    }
    document.querySelector('[data-cloudq-convo-chip="true"]')?.remove()
    // Leave CloudQ mode: drop the side panel too.
    closePanel()
    return
  }

  // Blank sessions own the CloudQ welcome pane; materialized sessions no
  // longer have an EmptyHero root, but they still need the panel toggle.
  if (heroRoot) {
    let pane = heroRoot.querySelector('[data-cloudq-hero="true"]')
    if (!pane) {
      pane = buildCloudqHeroPane()
      const stack = heroRoot.querySelector('[class*=headlineText]')?.parentElement
      if (stack && stack.parentElement === heroRoot) {
        stack.insertAdjacentElement('afterend', pane)
      } else {
        heroRoot.appendChild(pane)
      }
    }
  }

  // Mount against document.body rather than EmptyHero so the icon survives
  // after the first message replaces the blank hero with conversation UI.
  let chip = document.querySelector('[data-cloudq-convo-chip="true"]')
  if (!chip) {
    chip = document.createElement('button')
    chip.type = 'button'
    chip.className = 'dsh-cloudq-convo-chip'
    chip.dataset.cloudqConvoChip = 'true'
    chip.setAttribute('aria-label', '展开或收起 CloudQ 能力面板')
    chip.appendChild(buildIconSvg())
    chip.addEventListener('click', togglePanel)
    document.body.appendChild(chip)
  }
  chip.title = panelExpanded ? '收起 CloudQ 能力面板' : '展开 CloudQ 能力面板'
  chip.classList.toggle('is-open', panelExpanded)
}

function installCloudqHero() {
  installCloudqHeroStyles()
  let observer = null
  let newSessionButton = null
  let newSessionListenerAttached = false
  let unsubscribeSessions = null
  const sync = () => {
    // `list.current` is the public selection fact and emits on every
    // session open; fall back to the legacy selection store for older DSH.
    const currentId = cloudqCtx?.sessions?.list?.getSnapshot?.()?.current
      ?? cloudqCtx?.sessions?.selection?.getSnapshot?.()?.sessionId
    applyCloudqHero(isCloudqSession(currentId))
  }
  const onNewSessionClick = () => {
    const snapshot = cloudqCtx?.sessions?.list?.getSnapshot?.()
    const currentId = snapshot?.current
      ?? cloudqCtx?.sessions?.selection?.getSnapshot?.()?.sessionId
    // The native flow reuses the same id only when the current session is
    // still blank. Never unmark a materialized history session here: this
    // capture listener runs before React opens the new session, so doing so
    // would delete the OLD session's durable CloudQ identity.
    if (currentId && snapshot?.byId?.[currentId]?.blank && cloudqSessions.has(currentId)) {
      unmarkCloudqSession(currentId)
      cloudqDraftPrimed.delete(currentId)
      window.dispatchEvent(new CustomEvent('dsh-cloudq:clear-draft', { detail: currentId }))
    }
    window.setTimeout(sync, 0)
  }
  const tryAttachNewSessionButton = () => {
    const candidate = document.querySelector('[class*=newSession]:not(.dsh-cloudq-sidebar-btn)')
    if (!candidate) return false
    if (candidate === newSessionButton && newSessionListenerAttached) return true
    newSessionButton = candidate
    candidate.addEventListener('click', onNewSessionClick, { capture: true })
    newSessionListenerAttached = true
    return true
  }
  const tryAttach = () => {
    sync()
    tryAttachNewSessionButton()
    if (observer) return
    observer = new MutationObserver(() => {
      // React may replace the blank hero with the conversation body; this
      // guard reinstates the body-mounted icon if that transition removed it.
      sync()
      tryAttachNewSessionButton()
    })
    observer.observe(document.body, { childList: true, subtree: true })
  }
  tryAttach()
  unsubscribeSessions = cloudqCtx?.sessions?.list?.subscribe?.(sync) ?? null
  window.addEventListener('dsh-cloudq:sessions-changed', sync)
  return () => {
    if (observer) observer.disconnect()
    if (unsubscribeSessions) unsubscribeSessions()
    window.removeEventListener('dsh-cloudq:sessions-changed', sync)
    if (newSessionButton && newSessionListenerAttached) {
      newSessionButton.removeEventListener('click', onNewSessionClick, { capture: true })
      newSessionListenerAttached = false
      newSessionButton = null
    }
    const heroRoot = findHeroRoot()
    if (heroRoot) {
      const pane = heroRoot.querySelector('[data-cloudq-hero="true"]')
      if (pane) pane.remove()
    }
    document.querySelector('[data-cloudq-convo-chip="true"]')?.remove()
    // Tear down the side panel (reused element + state).
    panelExpanded = false
    if (panelEl) {
      panelEl.remove()
      panelEl = null
      panelBody = null
    }
    inspirationCache = null
    inspirationCategory = 0
    artifactCache = null
    artifactTotal = 0
    architectureDirectoriesCache = null
    architectureFirstFolderId = null
    architectureRequestSeq += 1
    panelView = 'usage'
  }
}

// ------------------------------------------------------------------
// CloudQ credential settings card
// ------------------------------------------------------------------

const API_CREDENTIAL = '/api/dsh-cloudq/credential'
const API_LOGOUT = '/api/dsh-cloudq/logout'
// Long-lived AK/SK configuration path (the only credential mode in this release).
const API_CREDENTIAL_TEST = '/api/dsh-cloudq/credential/test'
const API_CREDENTIAL_SAVE = '/api/dsh-cloudq/credential/save'
const CAPI_CONSOLE_URL = 'https://console.cloud.tencent.com/cam/capi'

class CloudQApiError extends Error {
  constructor(message, code) {
    super(message)
    this.code = code
  }
}

const CLOUDQ_AUTH_ERROR_CODES = new Set(['NeedAuth', 'CredentialExpired', 'AuthFailure'])

/**
 * Panel-facing error text. Credential problems carry an actionable Host
 * message and are shown directly instead of a raw load failure prefix.
 */
function cloudqPanelErrorText(error, prefix) {
  if (error instanceof CloudQApiError && CLOUDQ_AUTH_ERROR_CODES.has(error.code)) {
    return error.message
  }
  return `${prefix}：${error instanceof Error ? error.message : '未知错误'}`
}

/**
 * Reject with an actionable NeedAuth error when no credential is configured,
 * so data views show the settings guide without calling the CloudQ APIs.
 * Returns undefined when the status check itself fails, letting the data
 * request surface its own error.
 */
function requireCloudqCredential() {
  return cloudqRequest(API_CREDENTIAL)
    .then((response) => {
      if (response.status?.logged_in !== true) {
        throw new CloudQApiError('尚未配置 AK/SK，请前往「设置 → 插件 → CloudQ」完成配置后重试。', 'NeedAuth')
      }
      return undefined
    })
    .catch((error) => {
      if (error instanceof CloudQApiError && error.code === 'NeedAuth') throw error
      return undefined
    })
}

async function cloudqRequest(url, init, timeoutMs = 20000) {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(url, {
      ...init,
      credentials: 'same-origin',
      headers: {
        ...(init?.body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...init?.headers,
      },
      signal: controller.signal,
    })
    let payload
    try {
      payload = await response.json()
    } catch {
      throw new CloudQApiError('服务返回了无法识别的响应。', 'invalid-response')
    }
    if (!response.ok || (payload && payload.ok === false)) {
      const error = payload?.error
      throw new CloudQApiError(error?.message ?? '请求失败，请稍后重试。', error?.code ?? 'request-failed')
    }
    return payload
  } catch (error) {
    if (error instanceof CloudQApiError) throw error
    throw new CloudQApiError('网络错误，请稍后重试。', 'network-error')
  } finally {
    window.clearTimeout(timeout)
  }
}

function minutesText(minutes) {
  if (minutes == null) return '未知'
  if (minutes <= 0) return '已过期'
  if (minutes < 60) return `${minutes} 分钟`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest > 0 ? `${hours} 小时 ${rest} 分钟` : `${hours} 小时`
}

function CloudQSettingsCard() {
  const [expanded, setExpanded] = react.useState(true)
  const [loading, setLoading] = react.useState(true)
  const [busy, setBusy] = react.useState()
  const [status, setStatus] = react.useState()
  const [feedback, setFeedback] = react.useState()
  // Set to true after a successful 测试连接 / 保存配置 this session; combined
  // with the persisted Host status it drives the "AKSK有效" indicator.
  const [validated, setValidated] = react.useState(false)
  // Manual long-lived AK/SK entry. Kept in component state only; the
  // values leave the page exactly once (to the loopback Host route) and
  // are never read back — the Host only ever returns a masked SecretId.
  const [secretId, setSecretId] = react.useState('')
  const [secretKey, setSecretKey] = react.useState('')

  const refresh = react.useCallback(async () => {
    setLoading(true)
    try {
      const response = await cloudqRequest(API_CREDENTIAL)
      setStatus(response.status)
    } catch (error) {
      setFeedback({ kind: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }, [])

  react.useEffect(() => {
    refresh()
  }, [refresh])

  const handleLogout = async () => {
    setBusy('logout')
    setFeedback(undefined)
    try {
      const response = await cloudqRequest(API_LOGOUT, { method: 'POST' })
      setStatus({ logged_in: false })
      setValidated(false)
      setFeedback({ kind: 'success', text: '已退出登录。' })
    } catch (error) {
      setFeedback({ kind: 'error', text: error.message })
    } finally {
      setBusy(undefined)
    }
  }

  // Both actions validate the pair against the live CloudQ API first:
  // "测试连接" stops there, "保存配置" persists only after validation passes.
  const submitAccessKey = async (endpoint, kind, successText) => {
    const trimmedId = secretId.trim()
    const trimmedKey = secretKey.trim()
    if (!trimmedId || !trimmedKey) {
      setFeedback({ kind: 'error', text: '请先填写 SecretId 与 SecretKey。' })
      return
    }
    setBusy(kind)
    setFeedback(undefined)
    try {
      const response = await cloudqRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify({ secretId: trimmedId, secretKey: trimmedKey }),
      })
      if (response.status) {
        setStatus(response.status)
        // The key now lives on the Host; drop the plaintext from the page.
        setSecretId('')
        setSecretKey('')
      }
      setValidated(true)
      setFeedback({ kind: 'success', text: successText })
    } catch (error) {
      setValidated(false)
      const invalid = error instanceof CloudQApiError
        && error.code !== 'network-error'
        && error.code !== 'invalid-response'
      setFeedback({
        kind: 'error',
        text: invalid ? 'AKSK 无效，请检查后重新配置。' : error.message,
      })
    } finally {
      setBusy(undefined)
    }
  }

  const handleTestConnection = () =>
    submitAccessKey(API_CREDENTIAL_TEST, 'test', '连接成功，AKSK 有效。')

  const handleSaveAccessKey = () =>
    submitAccessKey(API_CREDENTIAL_SAVE, 'save-ak', '配置已保存，AKSK 有效。')

  const loggedIn = status?.logged_in === true
  const akskValid = validated || loggedIn
  const summarySubtitle = akskValid
    ? '腾讯云 CloudQ 凭证已激活，可直接使用 CloudQ 模式。'
    : '用于在 CloudQ 模式下调用腾讯云 SSE API 与 CLI 工具。'
  const disabled = loading || busy !== undefined

  return react_jsx_runtime.jsx(
    'section',
    {
      className: 'dsh-cloudq-settings-card',
      children: [
        react_jsx_runtime.jsx(
          'div',
          {
            className: 'dsh-cloudq-settings-card__summary',
            children: react_jsx_runtime.jsx(
              'button',
              {
                type: 'button',
                className: 'dsh-cloudq-settings-card__summary-trigger',
                'aria-expanded': expanded,
                onClick: () => setExpanded((prev) => !prev),
                children: [
                  react_jsx_runtime.jsx(
                    'span',
                    {
                      className: 'dsh-cloudq-settings-card__summary-title',
                      children: [
                        react_jsx_runtime.jsx('strong', { children: 'CloudQ' }),
                        react_jsx_runtime.jsx('small', { children: summarySubtitle }),
                      ],
                    },
                  ),
                  react_jsx_runtime.jsx(
                    'span',
                    {
                      className: 'dsh-cloudq-settings-card__summary-right',
                      children: [
                        akskValid &&
                          react_jsx_runtime.jsx('span', {
                            className: 'dsh-cloudq-settings-card__badge dsh-cloudq-settings-card__badge--ok',
                            children: [
                              react_jsx_runtime.jsx('span', { className: 'dsh-cloudq-settings-card__badge-dot' }),
                              'AKSK有效',
                            ],
                          }),
                        react_jsx_runtime.jsx('span', {
                          className: `dsh-cloudq-settings-card__chevron${expanded ? ' is-open' : ''}`,
                          children: '▾',
                        }),
                      ],
                    },
                  ),
                ],
              },
            ),
          },
        ),
        !expanded
          ? null
          : react_jsx_runtime.jsx(
              'div',
              {
                className: 'dsh-cloudq-settings-card__body',
                children: [
                  loading
                    ? react_jsx_runtime.jsx('div', { className: 'dsh-cloudq-settings-card__hint', children: '正在检查凭证状态…' })
                    : react_jsx_runtime.jsx(
                        'div',
                        {
                          className: 'dsh-cloudq-settings-card__rows',
                          children: [
                            status?.credential_file
                              ? react_jsx_runtime.jsx('div', { className: 'dsh-cloudq-settings-card__row', children: [react_jsx_runtime.jsx('span', { className: 'dsh-cloudq-settings-card__row-key', children: '凭证文件' }), react_jsx_runtime.jsx('span', { className: 'dsh-cloudq-settings-card__row-val', children: status.credential_file })] })
                              : null,
                            status?.secret_id_masked
                              ? react_jsx_runtime.jsx('div', { className: 'dsh-cloudq-settings-card__row', children: [react_jsx_runtime.jsx('span', { className: 'dsh-cloudq-settings-card__row-key', children: 'SecretId' }), react_jsx_runtime.jsx('span', { className: 'dsh-cloudq-settings-card__row-val', children: status.secret_id_masked })] })
                              : null,
                            status?.tmp_key_remaining_minutes != null
                              ? react_jsx_runtime.jsx('div', { className: 'dsh-cloudq-settings-card__row', children: [react_jsx_runtime.jsx('span', { className: 'dsh-cloudq-settings-card__row-key', children: '临时密钥剩余' }), react_jsx_runtime.jsx('span', { className: 'dsh-cloudq-settings-card__row-val', children: minutesText(status.tmp_key_remaining_minutes) })] })
                              : null,
                            status?.access_token_remaining_minutes != null
                              ? react_jsx_runtime.jsx('div', { className: 'dsh-cloudq-settings-card__row', children: [react_jsx_runtime.jsx('span', { className: 'dsh-cloudq-settings-card__row-key', children: 'AccessToken 剩余' }), react_jsx_runtime.jsx('span', { className: 'dsh-cloudq-settings-card__row-val', children: minutesText(status.access_token_remaining_minutes) })] })
                              : null,
                            status?.refresh_error
                              ? react_jsx_runtime.jsx('div', { className: 'dsh-cloudq-settings-card__row', children: [react_jsx_runtime.jsx('span', { className: 'dsh-cloudq-settings-card__row-key', children: '刷新错误' }), react_jsx_runtime.jsx('span', { className: 'dsh-cloudq-settings-card__row-val', children: status.refresh_error.message })] })
                              : null,
                          ],
                        },
                      ),
                  feedback
                    ? react_jsx_runtime.jsx(
                        'div',
                        {
                          className: `dsh-cloudq-settings-card__feedback dsh-cloudq-settings-card__feedback--${feedback.kind}`,
                          children: feedback.text,
                        },
                      )
                    : null,
                  !loggedIn &&
                    react_jsx_runtime.jsx(
                      'div',
                      {
                        children: [
                          // Long-lived AK/SK pair configuration (the only
                          // credential mode in this release).
                          react_jsx_runtime.jsx('div', {
                            className: 'dsh-cloudq-settings-card__field',
                            children: [
                              react_jsx_runtime.jsx('span', {
                                className: 'dsh-cloudq-settings-card__label',
                                children: [
                                  'SecretId',
                                  react_jsx_runtime.jsx('span', { className: 'dsh-cloudq-settings-card__required', children: '必填' }),
                                ],
                              }),
                              react_jsx_runtime.jsx('span', {
                                className: 'dsh-cloudq-settings-card__hint',
                                children: '腾讯云 API 密钥 ID，与 SecretKey 配对使用。密钥只会安全保存到 DSH Host 端。',
                              }),
                              react_jsx_runtime.jsx('input', {
                                className: 'dsh-cloudq-settings-card__input',
                                placeholder: '请输入 SecretId',
                                autoComplete: 'off',
                                spellCheck: false,
                                value: secretId,
                                onChange: (event) => setSecretId(event.target.value),
                              }),
                            ],
                          }),
                          react_jsx_runtime.jsx('div', {
                            className: 'dsh-cloudq-settings-card__field',
                            children: [
                              react_jsx_runtime.jsx('span', {
                                className: 'dsh-cloudq-settings-card__label',
                                children: [
                                  'SecretKey',
                                  react_jsx_runtime.jsx('span', { className: 'dsh-cloudq-settings-card__required', children: '必填' }),
                                ],
                              }),
                              react_jsx_runtime.jsx('span', {
                                className: 'dsh-cloudq-settings-card__hint',
                                children: [
                                  '腾讯云 API 密钥 Key。保存后页面不会读取或回显原文。可前往 ',
                                  react_jsx_runtime.jsx('a', {
                                    href: CAPI_CONSOLE_URL,
                                    target: '_blank',
                                    rel: 'noopener noreferrer',
                                    children: '访问密钥控制台',
                                  }),
                                  ' 获取。',
                                ],
                              }),
                              react_jsx_runtime.jsx('input', {
                                className: 'dsh-cloudq-settings-card__input',
                                type: 'password',
                                placeholder: '请输入 SecretKey',
                                autoComplete: 'new-password',
                                spellCheck: false,
                                value: secretKey,
                                onChange: (event) => setSecretKey(event.target.value),
                              }),
                            ],
                          }),
                          react_jsx_runtime.jsx('div', {
                            className: 'dsh-cloudq-settings-card__form-actions',
                            children: [
                              react_jsx_runtime.jsx('button', {
                                type: 'button',
                                className: 'dsh-cloudq-settings-card__btn',
                                disabled: disabled,
                                onClick: handleTestConnection,
                                children: busy === 'test' ? '测试中…' : '测试连接',
                              }),
                              react_jsx_runtime.jsx('button', {
                                type: 'button',
                                className: 'dsh-cloudq-settings-card__btn dsh-cloudq-settings-card__btn--primary',
                                disabled: disabled,
                                onClick: handleSaveAccessKey,
                                children: busy === 'save-ak' ? '保存中…' : '保存配置',
                              }),
                            ],
                          }),
                        ],
                      },
                    ),
                  loggedIn &&
                    react_jsx_runtime.jsx(
                      'div',
                      {
                        className: 'dsh-cloudq-settings-card__actions dsh-cloudq-settings-card__actions--stacked',
                        children: react_jsx_runtime.jsx(
                          'button',
                          {
                            type: 'button',
                            className: 'dsh-cloudq-settings-card__btn dsh-cloudq-settings-card__btn--danger',
                            disabled: disabled,
                            onClick: handleLogout,
                            children: busy === 'logout' ? '登出中…' : '退出登录',
                          },
                        ),
                      },
                    ),
                ],
              },
            ),
      ],
    },
  )
}

// ------------------------------------------------------------------
// Plugin manager settings card
// ------------------------------------------------------------------

const API_PLUGINS = '/api/dsh-cloudq/plugins'
const API_PLUGINS_TOGGLE = '/api/dsh-cloudq/plugins/toggle'

function PluginManagerCard() {
  const [expanded, setExpanded] = react.useState(true)
  const [loading, setLoading] = react.useState(true)
  const [busyId, setBusyId] = react.useState()
  const [plugins, setPlugins] = react.useState([])
  const [feedback, setFeedback] = react.useState()
  const [pendingReload, setPendingReload] = react.useState(null)
  const [reloadCountdown, setReloadCountdown] = react.useState(null)

  const refresh = react.useCallback(async () => {
    setLoading(true)
    try {
      const response = await cloudqRequest(API_PLUGINS)
      setPlugins(response.plugins ?? [])
    } catch (error) {
      setFeedback({ kind: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }, [])

  react.useEffect(() => {
    refresh()
  }, [refresh])

  // Host loader disposal does not signal the React client (dsh has no
  // host→client HMR bridge for entry updates), so disabled/enabled
  // toggles change the host surface live but leave already-mounted
  // client components (DOM-injected pet, CSS-injected themes) visible
  // until the page reloads. Schedule a controlled reload and give the
  // user a way to cancel before it fires.
  const scheduleReload = react.useCallback((pluginName) => {
    setPendingReload({ name: pluginName, until: Date.now() + 6000 })
  }, [])

  react.useEffect(() => {
    if (!pendingReload) return undefined
    const tick = () => {
      const left = Math.max(0, pendingReload.until - Date.now())
      if (left === 0) {
        window.location.reload()
        return
      }
      setReloadCountdown(Math.ceil(left / 1000))
    }
    tick()
    const timer = window.setInterval(tick, 250)
    return () => window.clearInterval(timer)
  }, [pendingReload])

  const handleToggle = async (plugin) => {
    const target = !plugin.disabled
    setBusyId(plugin.id)
    setFeedback(undefined)
    try {
      await cloudqRequest(API_PLUGINS_TOGGLE, {
        method: 'POST',
        body: JSON.stringify({ id: plugin.id, disabled: target }),
      })
      setFeedback({
        kind: 'success',
        text: target
          ? `已停用 ${plugin.name}：后端热生效，浏览器端将在 ${reloadCountdown ?? '数'} 秒后自动刷新以清理 client UI。`
          : `已启用 ${plugin.name}：后端热生效，浏览器端将在 ${reloadCountdown ?? '数'} 秒后自动刷新以加载 client UI。`,
      })
      // Re-read the patch so the list reflects the new state.
      await refresh()
      scheduleReload(plugin.name)
    } catch (error) {
      setFeedback({ kind: 'error', text: error.message })
    } finally {
      setBusyId(undefined)
    }
  }

  const disabledCount = plugins.filter((p) => p.disabled).length
  const summarySubtitle = `热启停 profile 静态插件，保存即生效，无需重启。`
  const badgeText = disabledCount > 0 ? `${disabledCount} 个已停用` : '全部启用'
  const badgeClass = disabledCount > 0
    ? 'dsh-cloudq-settings-card__badge dsh-cloudq-settings-card__badge--warn'
    : 'dsh-cloudq-settings-card__badge dsh-cloudq-settings-card__badge--ok'

  return react_jsx_runtime.jsx(
    'section',
    {
      className: 'dsh-cloudq-settings-card',
      children: [
        react_jsx_runtime.jsx(
          'div',
          {
            className: 'dsh-cloudq-settings-card__summary',
            children: react_jsx_runtime.jsx(
              'button',
              {
                type: 'button',
                className: 'dsh-cloudq-settings-card__summary-trigger',
                'aria-expanded': expanded,
                onClick: () => setExpanded((prev) => !prev),
                children: [
                  react_jsx_runtime.jsx(
                    'span',
                    {
                      className: 'dsh-cloudq-settings-card__summary-title',
                      children: [
                        react_jsx_runtime.jsx('strong', { children: '插件管理' }),
                        react_jsx_runtime.jsx('small', { children: summarySubtitle }),
                      ],
                    },
                  ),
                  react_jsx_runtime.jsx(
                    'span',
                    {
                      className: 'dsh-cloudq-settings-card__summary-right',
                      children: [
                        react_jsx_runtime.jsx('span', {
                          className: badgeClass,
                          children: [
                            react_jsx_runtime.jsx('span', { className: 'dsh-cloudq-settings-card__badge-dot' }),
                            badgeText,
                          ],
                        }),
                        react_jsx_runtime.jsx('span', {
                          className: `dsh-cloudq-settings-card__chevron${expanded ? ' is-open' : ''}`,
                          children: '▾',
                        }),
                      ],
                    },
                  ),
                ],
              },
            ),
          },
        ),
        !expanded
          ? null
          : react_jsx_runtime.jsx(
              'div',
              {
                className: 'dsh-cloudq-settings-card__body',
                children: [
                  pendingReload
                    ? react_jsx_runtime.jsx(
                        'div',
                        {
                          className: 'dsh-cloudq-pm__reload',
                          children: [
                            react_jsx_runtime.jsx(
                              'span',
                              {
                                className: 'dsh-cloudq-pm__reload-text',
                                children: `已切换 ${pendingReload.name}，浏览器将自动刷新以应用 client 端（${reloadCountdown ?? 6}s）`,
                              },
                            ),
                            react_jsx_runtime.jsx(
                              'button',
                              {
                                type: 'button',
                                className: 'dsh-cloudq-pm__reload-cancel',
                                onClick: () => setPendingReload(null),
                                children: '取消',
                              },
                            ),
                            react_jsx_runtime.jsx(
                              'button',
                              {
                                type: 'button',
                                className: 'dsh-cloudq-pm__reload-now',
                                onClick: () => window.location.reload(),
                                children: '立即刷新',
                              },
                            ),
                          ],
                        },
                      )
                    : null,
                  loading
                    ? react_jsx_runtime.jsx('div', { className: 'dsh-cloudq-settings-card__hint', children: '正在读取插件清单…' })
                    : react_jsx_runtime.jsx(
                        'div',
                        {
                          className: 'dsh-cloudq-pm__rows',
                          children: plugins.map((plugin) => {
                            const isBusy = busyId === plugin.id
                            const on = !plugin.disabled
                            return react_jsx_runtime.jsx(
                              'div',
                              {
                                className: 'dsh-cloudq-pm__row',
                                children: [
                                  react_jsx_runtime.jsx(
                                    'div',
                                    {
                                      className: 'dsh-cloudq-pm__row-info',
                                      children: [
                                        react_jsx_runtime.jsx(
                                          'div',
                                          {
                                            className: 'dsh-cloudq-pm__row-name',
                                            children: [
                                              plugin.name,
                                              !on
                                                ? react_jsx_runtime.jsx('span', { className: 'dsh-cloudq-pm__row-tag dsh-cloudq-pm__row-tag--off', children: '已停用' })
                                                : null,
                                            ],
                                          },
                                        ),
                                        react_jsx_runtime.jsx('div', { className: 'dsh-cloudq-pm__row-bundle', children: `${plugin.id} · ${plugin.bundle}` }),
                                      ],
                                    },
                                  ),
                                  react_jsx_runtime.jsx(
                                    'button',
                                    {
                                      type: 'button',
                                      role: 'switch',
                                      'aria-checked': on,
                                      'aria-label': `${on ? '停用' : '启用'} ${plugin.name}`,
                                      className: `dsh-cloudq-pm__switch${on ? ' dsh-cloudq-pm__switch--on' : ''}`,
                                      disabled: isBusy,
                                      onClick: () => handleToggle(plugin),
                                    },
                                  ),
                                  react_jsx_runtime.jsx('span', { className: `dsh-cloudq-pm__state${!on ? ' dsh-cloudq-pm__state--off' : ''}`, children: isBusy ? '…' : (on ? '启用' : '停用') }),
                                ],
                              },
                              plugin.id,
                            )
                          }),
                        },
                      ),
                  feedback
                    ? react_jsx_runtime.jsx(
                        'div',
                        {
                          className: `dsh-cloudq-settings-card__feedback dsh-cloudq-settings-card__feedback--${feedback.kind}`,
                          children: feedback.text,
                        },
                      )
                    : null,
                  react_jsx_runtime.jsx('div', {
                    className: 'dsh-cloudq-settings-card__hint',
                    children: '核心层（dsh-base / dsh-web-app）不可停用。停用本插件后此卡片将消失，重新启用需手动编辑 cordis.patch.yml。',
                  }),
                ],
              },
            ),
      ],
    },
  )
}

// `inputActions` arrives as a component prop from the InputZone owner
// share; `inject` only declares ctx-level services this plugin consumes.
const inject = ['slots', 'workspaces', 'sessions', 'remote', 'remote.commands']

function apply(ctx) {
  ctx.effect(() => {
    cloudqCtx = ctx
    return () => {
      if (cloudqCtx === ctx) cloudqCtx = null
    }
  }, 'dsh-cloudq: client context')

  ctx.effect(() => {
    let disposed = false
    const syncHistory = () => {
      if (disposed) return
      void reconcileCloudqSessionsFromHost()
    }
    const onStorage = (event) => {
      if (event.key !== CLOUDQ_STORAGE_KEY) return
      cloudqSessions = loadCloudqSessions()
      window.dispatchEvent(new CustomEvent('dsh-cloudq:sessions-changed'))
    }
    window.addEventListener('storage', onStorage)
    // Host evidence is the durable backstop for marks made on other browsers
    // or before this plugin loaded; local send-time marking covers the rest.
    const backstop = window.setInterval(() => {
      if (!disposed) void reconcileCloudqSessionsFromHost()
    }, 30000)
    syncHistory()
    return () => {
      disposed = true
      window.clearInterval(backstop)
      window.removeEventListener('storage', onStorage)
    }
  }, 'dsh-cloudq: reconcile durable session identities')

  ctx.effect(() => {
    // Mark the session the moment a `/cloudq` claim is submitted: intercept
    // the composer's send affordances at capture time, while the draft is
    // still readable. DSH reuses the current blank session id for the new
    // conversation, so marking the current id is exact.
    const markIfCloudqClaim = () => {
      const textarea = document.querySelector('textarea[class*=input]')
      const draft = typeof textarea?.value === 'string' ? textarea.value : ''
      if (!/^\s*\/cloudq(?:\s|$)/i.test(draft)) return
      const sessionId = cloudqCtx?.sessions?.selection?.getSnapshot?.()?.sessionId
        ?? cloudqCtx?.sessions?.list?.getSnapshot?.()?.current
      if (sessionId) markCloudqSession(sessionId)
    }
    const onKeyDown = (event) => {
      if (event.key !== 'Enter' || event.shiftKey || event.isComposing) return
      if (event.target instanceof HTMLTextAreaElement) markIfCloudqClaim()
    }
    const onClick = (event) => {
      const button = event.target?.closest?.('button[class*=primary]')
      if (button) markIfCloudqClaim()
    }
    document.addEventListener('keydown', onKeyDown, true)
    document.addEventListener('click', onClick, true)
    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      document.removeEventListener('click', onClick, true)
    }
  }, 'dsh-cloudq: mark session on claim submit')

  ctx.effect(installStyles, 'dsh-cloudq: styles')
  ctx.effect(
    () => {
      const slots = ctx.slots
      return slots.inject('conversation.input.left', () =>
        slots.register(
          {
            name: 'conversation.input.left',
            id: 'dsh-cloudq.mode',
            // The seat is a status read-out for CloudQ sessions; keep it
            // away from the resident chrome, after the shipped entries.
            order: 500,
          },
          CloudQButton,
        ),
      )
    },
    'dsh-cloudq: input-bar CloudQ status seat',
  )
  ctx.effect(
    () => {
      const slots = ctx.slots
      return slots.inject('conversation.input.left', () =>
        slots.register(
          {
            name: 'conversation.input.left',
            id: 'dsh-cloudq.bridge',
            // The bridge is invisible (returns null) and exists only to
            // forward DOM-issued `dsh-cloudq:draft` events to the
            // session-scoped inputActions. It owns no chrome of its own.
            order: -1000,
          },
          CloudQBridge,
        ),
      )
    },
    'dsh-cloudq: draft-event bridge',
  )
  ctx.effect(
    () => {
      const slots = ctx.slots
      return slots.inject('settings.plugin.item', () =>
        slots.register(
          {
            name: 'settings.plugin.item',
            id: 'dsh-cloudq',
            key: 'dsh-cloudq',
            order: 100,
          },
          CloudQSettingsCard,
        ),
      )
    },
    'dsh-cloudq: settings card',
  )
  ctx.effect(
    () => {
      const slots = ctx.slots
      return slots.inject('settings.plugin.item', () =>
        slots.register(
          {
            name: 'settings.plugin.item',
            id: 'dsh-cloudq.plugin-manager',
            key: 'dsh-plugin-manager',
            order: 110,
          },
          PluginManagerCard,
        ),
      )
    },
    'dsh-cloudq: plugin manager card',
  )
  ctx.effect(installSidebarButton, 'dsh-cloudq: sidebar CloudQ entry')
  ctx.effect(installSessionBadges, 'dsh-cloudq: session list badges')
  ctx.effect(installCloudqHero, 'dsh-cloudq: hero chrome swap')
}

exports.apply = apply
exports.inject = inject
