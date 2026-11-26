<script setup>
defineOptions({ name: 'DemoGuards' })

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { guardState } from '../router'

const router = useRouter()
const status = ref('尚未触发守卫')

async function openWithConfirm() {
  await router.push('/demo/no-cache?confirm=1')
  status.value = guardState.pending ? '守卫已拦截，等待确认' : '守卫未拦截'
}

function openDirectly() {
  router.push('/demo/no-cache')
  status.value = '未带 confirm 参数，直接进入'
}

function pass() {
  const pending = guardState.pending
  guardState.pending = ''
  guardState.reason = ''
  const target = `${pending}${pending.includes('?') ? '&' : '?'}pass=1`
  router.push(target)
  status.value = '已确认放行'
}
</script>

<template>
  <main class="page">
    <el-card shadow="never">
      <template #header>页面守卫演示</template>
      <p>
        点击下面的按钮跳转到「临时表单」并带上 <code>confirm=1</code>，
        <code>router.beforeEach</code> 会先拦下这次导航，确认后才放行。
      </p>
      <el-space wrap>
        <el-button type="primary" @click="openWithConfirm">打开需要确认的页面</el-button>
        <el-button @click="openDirectly">不带确认参数打开</el-button>
      </el-space>
      <el-alert
        v-if="guardState.pending"
        class="status"
        type="warning"
        :closable="false"
        :title="`已拦截：${guardState.pending}（${guardState.reason}）`"
        style="margin-top: 12px"
      />
      <el-button v-if="guardState.pending" class="pass" type="success" style="margin-top: 12px" @click="pass">
        确认放行
      </el-button>
      <el-alert class="status" type="info" :closable="false" :title="status" style="margin-top: 12px" />
    </el-card>
  </main>
</template>
