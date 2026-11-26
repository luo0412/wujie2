<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import AboutPage from './views/About.vue'
import UserPage from './views/User.vue'
import NoCachePage from './views/NoCache.vue'
import PickerPage from './views/Picker.vue'

const wj = window.$wujie
const path = ref('/about')
const ping = ref(null)

const pages = {
  '/about': AboutPage,
  '/user': UserPage,
  '/no-cache': NoCachePage,
  '/picker': PickerPage,
}

const views = [
  { path: '/about', title: '关于' },
  { path: '/user', title: '用户' },
  { path: '/no-cache', title: '临时表单' },
  { path: '/picker', title: '远程分类选择器' },
]

const cached = ['AboutPage', 'UserPage', 'PickerPage']
const current = computed(() => pages[path.value] || AboutPage)

let lastProp = null
function readProps() {
  const p = wj?.props?.path
  if (!p || p === lastProp) return
  lastProp = p
  if (pages[p] && p !== path.value) path.value = p
}
readProps()
const timer = setInterval(readProps, 300)

wj?.bus?.$on('wj2:route', (payload) => {
  if (payload?.app === 'app2' && pages[payload.path]) path.value = payload.path
})

wj?.bus?.$on('wj2:ping', (payload) => {
  ping.value = payload
  wj.bus.$emit('wj2:child-event', {
    app: 'app2',
    reply: 'pong',
    note: payload?.note,
    at: new Date().toLocaleTimeString('zh-CN'),
  })
})

onBeforeUnmount(() => clearInterval(timer))

function go(p) {
  path.value = p
}
</script>

<template>
  <div class="app">
    <div class="top">
      <b>App2 · Vue3</b>
      <span class="badge">vue3 + vite</span>
    </div>

    <div class="nav">
      <button v-for="v in views" :key="v.path" :class="{ on: path === v.path }" @click="go(v.path)">
        {{ v.title }}
      </button>
    </div>

    <KeepAlive :include="cached" :max="8">
      <component :is="current" :key="path" />
    </KeepAlive>

    <div v-if="ping" class="card" style="margin-top: 12px">
      <h3>收到主应用 bus 事件</h3>
      <pre>{{ JSON.stringify(ping) }}</pre>
    </div>
  </div>
</template>
