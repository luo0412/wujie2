<script setup>
defineOptions({ name: 'ApiDemo' })

import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { bus } from 'wujie'
import { tabState, closeTab, goBack } from '../store/tabs'
import { busState } from '../store/bus'
import { resolveMicro } from '../config/apps'

const router = useRouter()
const sentTip = ref('先打开一个子应用页签。')

const activeMicro = computed(() => resolveMicro(tabState.lastMicroKey || ''))
const tabsCount = computed(() => tabState.tabs.length)
const currentTab = computed(() => tabState.activeKey)

function openApp(name) {
  router.push(`/micro/${name}/user`)
}

function back() {
  goBack(router)
}

function closeCurrent() {
  if (!activeMicro.value) return
  closeTab(router, tabState.lastMicroKey)
}

function sendEvent() {
  const micro = activeMicro.value
  if (!micro) {
    sentTip.value = '先打开一个子应用页签。'
    return
  }
  const payload = {
    app: micro.app.name,
    from: 'main',
    at: new Date().toLocaleTimeString('zh-CN'),
    note: '来自主应用的 bus 事件',
  }
  bus.$emit('wj2:ping', payload)
  sentTip.value = `已向 ${micro.app.name} 发送 Wujie bus 事件，子应用可回复。`
}
</script>

<template>
  <main class="page">
    <el-card shadow="never">
      <template #header>主应用 API 演示</template>

      <p>
        当前 Tab：<code>{{ currentTab }}</code> · 已打开 <b>{{ tabsCount }}</b> 项。
      </p>
      <el-input placeholder="此输入框只属于主应用 API 页面" />
      <small class="tip">该输入状态由主应用页面独立持有，与子应用互不影响。</small>

      <el-space wrap style="margin-top: 14px">
        <el-button type="primary" @click="openApp('app1')">打开 App1</el-button>
        <el-button @click="openApp('app2')">打开 App2</el-button>
        <el-button @click="openApp('app4')">打开 App4</el-button>
        <el-button @click="back">切回上个 Tab</el-button>
        <el-button @click="closeCurrent">关闭子应用页</el-button>
      </el-space>

      <div class="box">
        <p style="margin: 0 0 8px">
          <b>向活动子应用发送事件</b>
        </p>
        <el-button @click="sendEvent">向活动子应用发送事件</el-button>
        <p class="tip" style="margin-top: 8px">{{ sentTip }}</p>
      </div>

      <el-alert
        v-if="busState.lastChildEvent"
        type="success"
        :closable="false"
        :title="`收到子应用 bus 事件：${JSON.stringify(busState.lastChildEvent)}`"
        style="margin-top: 12px"
      />
      <small class="tip">首页是固定页签，不可关闭。</small>
    </el-card>
  </main>
</template>

<style scoped>
.box {
  margin-top: 16px;
  padding: 12px;
  border: 1px dashed var(--border);
  border-radius: 8px;
}
</style>
