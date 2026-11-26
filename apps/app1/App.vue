<script setup>
import { onBeforeUnmount, ref, watchEffect } from 'vue'

const wj = window.$wujie
const path = ref('/about')
const text = ref('')
const rich = ref('<p>Hello wujie</p>')
const ping = ref(null)

const views = [
  { path: '/about', title: '关于' },
  { path: '/user', title: '用户' },
  { path: '/no-cache', title: '临时表单' },
  { path: '/rich-text', title: '富文本编辑器' },
]

function readProps() {
  const p = wj?.props?.path
  if (p) path.value = p
}
watchEffect(readProps)
const timer = setInterval(readProps, 400)

wj?.bus?.$on('wj2:ping', (payload) => {
  ping.value = payload
  wj.bus.$emit('wj2:child-event', {
    app: 'app1',
    reply: 'pong',
    note: payload?.note,
    at: new Date().toLocaleTimeString('zh-CN'),
  })
})

onBeforeUnmount(() => clearInterval(timer))

function go(p) {
  path.value = p
  wj?.bus?.$emit('wj2:child-route', { app: 'app1', path: p })
}
</script>

<template>
  <div class="app">
    <div class="top">
      <b>App1 · Vue3</b>
      <span class="badge">vue3 + vite</span>
    </div>

    <div class="nav">
      <button v-for="v in views" :key="v.path" :class="{ on: path === v.path }" @click="go(v.path)">
        {{ v.title }}
      </button>
    </div>

    <div v-if="path === '/about'" class="card">
      <h3>关于</h3>
      <p>我是 App1，由 wujie 以 iframe 沙箱方式挂载，路由由主应用通过 props 桥接。</p>
      <input v-model="text" placeholder="在子应用里随便输入，然后切换页签再回来" />
      <span class="small">子应用状态由 wujie alive 保活，切换页签后仍然保留。</span>
    </div>

    <div v-else-if="path === '/user'" class="card">
      <h3>用户</h3>
      <p>用户名：<b>app1-user</b> · 角色：子应用演示账号</p>
      <input v-model="text" placeholder="输入内容会在子应用内保留" />
    </div>

    <div v-else-if="path === '/no-cache'" class="card">
      <h3>临时表单 <span class="tag">不保活</span></h3>
      <p>该页面在主应用里 keepAlive = false，每次进入都会重新挂载视图。</p>
      <input v-model="text" placeholder="随便输入" />
    </div>

    <div v-else class="card">
      <h3>富文本编辑器</h3>
      <textarea v-model="rich" rows="5" placeholder="输入 HTML 片段" />
      <pre v-html="rich" />
      <span class="small">示例用 textarea 模拟富文本输入，实时渲染预览。</span>
    </div>

    <div v-if="ping" class="card" style="margin-top: 12px">
      <h3>收到主应用 bus 事件</h3>
      <pre>{{ JSON.stringify(ping) }}</pre>
    </div>
  </div>
</template>
