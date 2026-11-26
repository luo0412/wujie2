import { reactive } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './pages/Home.vue'
import About from './pages/About.vue'
import User from './pages/User.vue'
import NoCache from './pages/NoCache.vue'
import Guards from './pages/Guards.vue'
import ApiDemo from './pages/ApiDemo.vue'
import MicroApp from './pages/MicroApp.vue'
import { APPS, resolveMicro } from './config/apps'

export const guardState = reactive({ pending: '', reason: '' })

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', name: 'Home', component: Home, meta: { title: '首页', keepAlive: true, group: '主应用' } },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: { title: '关于', keepAlive: true, query: { id: '1' }, group: '主应用' },
  },
  { path: '/user', name: 'User', component: User, meta: { title: '用户', keepAlive: true, group: '主应用' } },
  {
    path: '/demo/no-cache',
    name: 'DemoNoCache',
    component: NoCache,
    meta: { title: '临时表单', keepAlive: false, group: '主应用' },
  },
  {
    path: '/demo/guards',
    name: 'DemoGuards',
    component: Guards,
    meta: { title: '页面守卫演示', keepAlive: true, group: '主应用' },
  },
  { path: '/api', name: 'ApiDemo', component: ApiDemo, meta: { title: 'Wujie API 演示', keepAlive: true, group: '主应用' } },
  {
    path: '/micro/:app/:page?',
    name: 'MicroApp',
    component: MicroApp,
    meta: { title: '微应用', keepAlive: true, group: '微应用' },
  },
  { path: '/:pathMatch(.*)*', redirect: '/home' },
]

const router = createRouter({ history: createWebHashHistory(), routes })

router.beforeEach((to) => {
  if (to.path === '/demo/no-cache' && to.query.confirm === '1' && to.query.pass !== '1') {
    guardState.pending = to.fullPath
    guardState.reason = '该页面要求二次确认'
    return false
  }
  if (to.path !== '/demo/no-cache') {
    guardState.pending = ''
    guardState.reason = ''
  }
  if (to.name === 'MicroApp') {
    const meta = resolveMicro(to.path)
    if (!meta) return { path: '/home' }
  }
  return true
})

export default router
export { APPS }
