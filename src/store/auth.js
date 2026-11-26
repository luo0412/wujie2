import { reactive } from 'vue'

const TOKEN_KEY = 'wj2-token'
const EXPIRE_KEY = 'wj2-expire'
const USER_KEY = 'wj2-user'
const TTL = 30 * 60 * 1000

export const authState = reactive({ status: 'anonymous', user: null, expiresAt: 0 })
export const authPrompt = reactive({ visible: false, reason: '', returnUrl: '' })

const read = (k) => {
  try {
    return localStorage.getItem(k)
  } catch {
    return null
  }
}
const write = (k, v) => {
  try {
    if (v == null) localStorage.removeItem(k)
    else localStorage.setItem(k, String(v))
  } catch {}
}

export function snapshot() {
  const token = read(TOKEN_KEY)
  if (!token) return { status: 'anonymous', user: null, expiresAt: 0 }
  const expiresAt = Number(read(EXPIRE_KEY) || 0)
  return {
    status: expiresAt && Date.now() > expiresAt ? 'expired' : 'authenticated',
    user: { id: read(USER_KEY) || 'demo', name: '演示用户' },
    expiresAt,
  }
}

export function syncAuthState() {
  Object.assign(authState, snapshot())
  return authState
}

export function login({ silent = false } = {}) {
  write(TOKEN_KEY, 'demo-' + Date.now())
  write(USER_KEY, 'demo')
  write(EXPIRE_KEY, Date.now() + TTL)
  authPrompt.visible = false
  authPrompt.reason = ''
  if (!silent) syncAuthState()
  return syncAuthState()
}

export function logout() {
  write(TOKEN_KEY, null)
  write(EXPIRE_KEY, null)
  write(USER_KEY, null)
  return syncAuthState()
}

export function refresh() {
  if (!read(TOKEN_KEY)) return syncAuthState()
  write(EXPIRE_KEY, Date.now() + TTL)
  return syncAuthState()
}

export function expire() {
  write(EXPIRE_KEY, Date.now() - 1000)
  return syncAuthState()
}

export function unauthorized() {
  logout()
  authPrompt.visible = true
  authPrompt.reason = '接口返回 401'
  authPrompt.returnUrl = location.hash.replace(/^#/, '') || '/home'
  return syncAuthState()
}

export function authActions(action) {
  const map = { login: () => login(), logout, refresh, expire, unauthorized }
  return map[action]?.()
}

export function ensureAuth() {
  if (!read(TOKEN_KEY)) login({ silent: true })
  return syncAuthState()
}
