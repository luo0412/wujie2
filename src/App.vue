<script setup>
import { computed, onMounted, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { bus } from 'wujie'
import ShellSidebar from './components/ShellSidebar.vue'
import TabBar from './components/TabBar.vue'
import DebugPanel from './components/DebugPanel.vue'
import { tabState, syncTab, keepAliveInclude } from './store/tabs'
import { themeState, setDark } from './store/theme'
import { authActions } from './store/auth'
import { recordChildEvent } from './store/bus'
import { resolveMicro } from './config/apps'

const route = useRoute()
const router = useRouter()

const crumb = computed(() => {
  if (route.name === 'MicroApp') {
    const micro = resolveMicro(route.path)
    if (micro) return { group: micro.app.title, title: micro.page.title }
  }
  return { group: route.meta.group || '主应用', title: route.meta.title || '首页' }
})

const skinLabel = computed(() => (themeState.dark ? '深色' : '浅色'))

watchEffect(() => {
  document.title = `wujie2 + ${skinLabel.value}`
  document.documentElement.classList.toggle('dark', themeState.dark)
})

onMounted(() => {
  syncTab(router.currentRoute.value)
  bus.$on('wj2:child-event', (payload) => recordChildEvent(payload))
  // 首次进入时按 query 兜底
  if (route.path === '/about' && !route.query.id) router.replace({ path: '/about', query: { id: '1' } })
})

router.afterEach((to, from, failure) => {
  if (failure) return
  syncTab(to)
})

function onAuth(action) {
  authActions(action)
}
</script>

<template>
  <div class="shell">
    <ShellSidebar />
    <div class="main">
      <header class="header">
        <div class="crumbs">
          <span>{{ crumb.group }}</span>
          <span>/</span>
          <strong>{{ crumb.title }}</strong>
        </div>
        <div class="header__actions">
          <button class="icon-btn" :title="`当前皮肤：${skinLabel}`" @click="setDark(!themeState.dark)">
            {{ themeState.dark ? '☾' : '☀' }}
          </button>
          <a
            class="icon-btn"
            href="https://github.com/luo0412/wujie2"
            target="_blank"
            rel="noreferrer"
            title="源码仓库"
            >GH</a
          >
          <span class="avatar" title="演示账号">演</span>
        </div>
      </header>

      <TabBar />

      <div class="content">
        <RouterView v-slot="{ Component, route: current }">
          <KeepAlive :include="keepAliveInclude" :max="12">
            <component :is="Component" :key="current.path" />
          </KeepAlive>
        </RouterView>
      </div>
    </div>

    <DebugPanel @auth="onAuth" />
  </div>
</template>
