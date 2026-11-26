import { reactive, computed } from 'vue'
import { resolveMicro } from '../config/apps'

const HOME_TAB = { key: '/home', title: '首页', compName: 'Home', keepAlive: true, pinned: true, query: null }

export const tabState = reactive({
  tabs: [{ ...HOME_TAB }],
  activeKey: '/home',
  prevKey: '',
  lastMicroKey: '',
  revision: 0,
})

export const keepAliveInclude = computed(() =>
  tabState.tabs.filter((t) => t.keepAlive).map((t) => t.compName)
)

function touch() {
  tabState.revision += 1
}

export function syncTab(route) {
  if (!route.matched || !route.matched.length) return
  if (route.path === '/') return
  const key = route.path
  let meta = route.meta || {}
  if (route.name === 'MicroApp') {
    const micro = resolveMicro(route.path)
    meta = {
      ...meta,
      title: micro ? micro.title : '微应用',
      keepAlive: micro ? micro.keepAlive : false,
      group: micro ? micro.group : '微应用',
    }
  }
  const last = route.matched[route.matched.length - 1]
  const compName = last?.components?.default?.name || last?.components?.default?.__name || String(route.name)
  const tab = {
    key,
    title: meta.title || key,
    compName,
    keepAlive: meta.keepAlive !== false,
    pinned: key === '/home',
    query: Object.keys(route.query).length ? { ...route.query } : null,
    group: meta.group || '',
  }
  const idx = tabState.tabs.findIndex((t) => t.key === key)
  if (idx === -1) tabState.tabs.push(tab)
  else tabState.tabs.splice(idx, 1, { ...tabState.tabs[idx], ...tab, pinned: tabState.tabs[idx].pinned })
  if (tabState.activeKey !== key) tabState.prevKey = tabState.activeKey
  if (route.name === 'MicroApp') tabState.lastMicroKey = key
  tabState.activeKey = key
  touch()
}

export function openTab(router, path) {
  router.push(path)
}

function neighborKey(removedKey) {
  const tabs = tabState.tabs
  const idx = tabs.findIndex((t) => t.key === removedKey)
  const next = tabs[idx + 1] || tabs[idx - 1] || tabs[0]
  return next?.key
}

export function closeTab(router, key = tabState.activeKey) {
  const idx = tabState.tabs.findIndex((t) => t.key === key)
  if (idx === -1) return
  if (tabState.tabs[idx].pinned) return
  tabState.tabs.splice(idx, 1)
  touch()
  if (tabState.activeKey === key) {
    const target = neighborKey(key) || '/home'
    tabState.activeKey = target
    router.push(target)
  }
}

export function closeOthers(router, key = tabState.activeKey) {
  tabState.tabs = tabState.tabs.filter((t) => t.pinned || t.key === key)
  touch()
  if (!tabState.tabs.some((t) => t.key === tabState.activeKey)) router.push(key)
}

export function closeAll(router) {
  tabState.tabs = tabState.tabs.filter((t) => t.pinned)
  touch()
  if (!tabState.tabs.some((t) => t.key === tabState.activeKey)) router.push('/home')
}

export function goBack(router) {
  const target = tabState.prevKey
  if (target && tabState.tabs.some((t) => t.key === target)) router.push(target)
}
