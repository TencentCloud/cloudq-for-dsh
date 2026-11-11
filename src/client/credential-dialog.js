export function openCredentialDialog({ request, onSaved }) {
  const previousFocus = document.activeElement
  const dialog = document.createElement('dialog')
  dialog.className = 'dsh-cloudq-credential-dialog'
  dialog.setAttribute('aria-labelledby', 'cloudq-credential-dialog-title')
  const create = (tag, text) => {
    const node = document.createElement(tag)
    if (text) node.textContent = text
    return node
  }
  const title = create('h2', '配置 CloudQ 凭证')
  title.id = 'cloudq-credential-dialog-title'
  const description = create('p', '填写腾讯云访问密钥，连接你的 CloudQ 服务。保存前会自动验证密钥。')
  const help = create('a', '前往腾讯云获取访问密钥')
  help.href = 'https://console.cloud.tencent.com/cam/capi'
  help.target = '_blank'
  help.rel = 'noopener noreferrer'
  const form = create('form')
  const field = (labelText, name) => {
    const label = create('label', labelText)
    const input = create('input')
    input.type = 'password'
    input.name = name
    input.autocomplete = 'off'
    input.spellcheck = false
    input.required = true
    input.maxLength = 256
    input.placeholder = `请输入 ${labelText}`
    input.dataset.testid = `cloudq-credential-dialog-${name}`
    label.append(input)
    form.append(label)
    return input
  }
  const secretId = field('SecretId', 'secret-id')
  const secretKey = field('SecretKey', 'secret-key')
  const feedback = create('p')
  feedback.className = 'dsh-cloudq-credential-feedback'
  feedback.setAttribute('role', 'status')
  const actions = create('div')
  actions.className = 'dsh-cloudq-credential-actions'
  const cancel = create('button', '取消')
  cancel.type = 'button'
  cancel.dataset.testid = 'cloudq-credential-dialog-cancel'
  const test = create('button', '测试连接')
  test.type = 'button'
  test.dataset.testid = 'cloudq-credential-dialog-test'
  const save = create('button', '验证并保存')
  save.type = 'submit'
  save.className = 'is-primary'
  save.dataset.testid = 'cloudq-credential-dialog-save'
  actions.append(cancel, test, save)
  form.append(feedback, actions)
  dialog.append(title, description, help, form)
  let busy = false
  let disposed = false
  const dispose = () => {
    if (disposed) return
    disposed = true
    secretId.value = ''
    secretKey.value = ''
    dialog.close()
    dialog.remove()
    if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus()
  }
  cancel.addEventListener('click', dispose)
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault()
    if (!busy) dispose()
  })
  const submit = async (persist) => {
    if (busy || disposed || !form.reportValidity()) return
    const id = secretId.value.trim()
    const key = secretKey.value.trim()
    if (!id || !key) {
      feedback.textContent = '请填写完整的 SecretId 和 SecretKey。'
      return
    }
    busy = true
    dialog.setAttribute('aria-busy', 'true')
    for (const control of [secretId, secretKey, cancel, test, save]) control.disabled = true
    feedback.dataset.kind = 'pending'
    feedback.textContent = persist ? '正在验证并保存…' : '正在测试连接…'
    try {
      await request(`/api/dsh-cloudq/credential/${persist ? 'save' : 'test'}`, {
        method: 'POST', body: JSON.stringify({ secretId: id, secretKey: key }),
      })
      if (disposed) return
      if (persist) {
        dispose()
        onSaved()
      } else {
        feedback.dataset.kind = 'success'
        feedback.textContent = '连接成功，请点击“验证并保存”完成配置。'
      }
    } catch (error) {
      if (disposed) return
      feedback.dataset.kind = 'error'
      feedback.textContent = typeof error?.message === 'string' ? error.message : '连接失败，请稍后重试。'
    } finally {
      busy = false
      if (!disposed) {
        dialog.removeAttribute('aria-busy')
        for (const control of [secretId, secretKey, cancel, test, save]) control.disabled = false
      }
    }
  }
  test.addEventListener('click', () => { void submit(false) })
  form.addEventListener('submit', (event) => { event.preventDefault(); void submit(true) })
  document.body.append(dialog)
  dialog.showModal()
  secretId.focus()
  return dispose
}
