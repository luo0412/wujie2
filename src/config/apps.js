export const MAIN_MENUS = [
  { path: '/home', title: '首页' },
  { path: '/about', title: '关于（带 query）', query: { id: '1' } },
  { path: '/user', title: '用户' },
  { path: '/demo/no-cache', title: '临时表单' },
  { path: '/demo/guards', title: '页面守卫演示' },
  { path: '/api', title: 'Wujie API 演示' },
]

export const APPS = [
  {
    name: 'app1',
    title: 'App1 · Vue3 Vite',
    framework: 'vue3-vite',
    pages: [
      { path: '/about', title: '关于', keepAlive: true },
      { path: '/user', title: '用户', keepAlive: true },
      { path: '/no-cache', title: '临时表单', keepAlive: false },
      { path: '/rich-text', title: '富文本编辑器', keepAlive: true },
    ],
  },
  {
    name: 'app2',
    title: 'App2 · Vue3 Vite',
    framework: 'vue3-vite',
    pages: [
      { path: '/about', title: '关于', keepAlive: true },
      { path: '/user', title: '用户', keepAlive: true },
      { path: '/no-cache', title: '临时表单', keepAlive: false },
      { path: '/picker', title: '远程分类选择器', keepAlive: true },
    ],
  },
  {
    name: 'app3',
    title: 'App3 · Vue2',
    framework: 'vue2',
    pages: [
      { path: '/about', title: '关于', keepAlive: true },
      { path: '/user', title: '用户', keepAlive: true },
      { path: '/no-cache', title: '临时表单', keepAlive: false },
      { path: '/toggle', title: 'Vue2 远程开关', keepAlive: true },
    ],
  },
  {
    name: 'app4',
    title: 'App4 · React',
    framework: 'react-vite',
    pages: [
      { path: '/about', title: '关于', keepAlive: true },
      { path: '/user', title: '用户', keepAlive: true },
      { path: '/no-cache', title: '临时表单', keepAlive: false },
      { path: '/counter', title: 'React 计数器', keepAlive: true },
    ],
  },
]

export function findApp(name) {
  return APPS.find((a) => a.name === name)
}

export function appUrl(name) {
  return new URL(`apps/${name}/index.html`, location.href).href
}

export function resolveMicro(path) {
  const m = path.match(/^\/micro\/(\w+)(?:\/([^/]+))?/)
  if (!m) return null
  const app = findApp(m[1])
  if (!app) return null
  const page = app.pages.find((p) => p.path === `/${m[2] || ''}`) || app.pages[0]
  return { app, page, title: page.title, group: app.title, keepAlive: page.keepAlive !== false }
}

export function buildGroups() {
  return [
    { key: 'main', title: '主应用', children: MAIN_MENUS.map((m) => ({ ...m, key: m.path })) },
    ...APPS.map((app) => ({
      key: app.name,
      title: app.title,
      children: app.pages.map((p) => ({
        key: `/micro/${app.name}${p.path}`,
        title: p.title,
        badge: p.keepAlive === false ? '不保活' : '',
      })),
    })),
  ]
}
