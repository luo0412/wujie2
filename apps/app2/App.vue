<script setup>
import { onBeforeUnmount, ref, watchEffect } from 'vue'

const wj = window.$wujie
const path = ref('/about')
const text = ref('')
const category = ref('frontend')
const ping = ref(null)

const views = [
  { path: '/about', title: '关于' },
  { path: '/user', title: '用户' },
  { path: '/no-cache', title: '临时表单' },
  { path: '/picker', title: '远程分类选择器' },
]
const options = [
  { value: 'frontend', label: '前端工程' },
  { value: 'micro', label: '微前端架构' },
  { value: 'infra', label: '基建与发布' },
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

    <div v-if="path === '/about'" class="card">
      <h3>关于</h3>
      <p>我是 App2，同一份壳层里的第二个 Vue3 子应用，独立构建、独立部署。</p>
      <input v-model="text" placeholder="随便输入，然后切换页签" />
      <span class="small">主应用为每个子应用维护一个 wujie 实例，互不干扰。</span>
    </div>

    <div v-else-if="path === '/picker'" class="card">
      <h3>远程分类选择器</h3>
      <select v-model="category">
        <option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option>
      </select>
      <pre>当前选择：{{ category }}</pre>
    </div>

    <div v-else class="card">
      <h3>{{ path === '/user' ? '用户' : '临时表单' }}</h3>
      <p v-if="path === '/user'">用户名：<b>app2-user</b></p>
      <input v-model="text" placeholder="输入内容会在子应用内保留" />
      <span class="small">切换主应用页签后回到这里，输入仍然在。</span>
    </div>

    <div v-if="ping" class="card" style="margin-top: 12px">
      <h3>收到主应用 bus 事件</h3>
      <pre>{{ JSON.stringify(ping) }}</pre>
    </div>
  </div>
</template>
