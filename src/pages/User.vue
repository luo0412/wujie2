<script setup>
defineOptions({ name: 'User' })

import { ref } from 'vue'

const text = ref('')
</script>

<template>
  <main class="page">
    <el-card shadow="never">
      <template #header>用户</template>
      <p>用户名：<b>wujie-guest</b> · 角色：演示账号</p>
      <el-input v-model="text" placeholder="随便输入，然后切到其它页签再回来" />
      <small class="tip">本页保活：切换页签后输入仍在，用于和「临时表单（不保活）」做对照。</small>
    </el-card>
  </main>
</template>
