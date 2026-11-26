import { reactive } from 'vue'

export const SKINS = [
  { key: 'light', label: '浅色' },
  { key: 'dark', label: '深色' },
]

export const themeState = reactive({
  skin: 'light',
  dark: false,
  grayscale: false,
})

function apply() {
  const root = document.documentElement
  root.setAttribute('data-skin', themeState.dark ? 'dark' : 'light')
  root.style.filter = themeState.grayscale ? 'grayscale(1)' : ''
}

export function setSkin(key) {
  themeState.dark = key === 'dark'
  themeState.skin = key
  apply()
}

export function setDark(v) {
  setSkin(v ? 'dark' : 'light')
}

export function setGrayscale(v) {
  themeState.grayscale = Boolean(v)
  apply()
}

apply()
