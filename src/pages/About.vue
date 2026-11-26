<script setup>
defineOptions({ name: 'About' })

import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const text = ref('')
const queryText = computed(() =>
  Object.keys(route.query).length ? JSON.stringify(route.query) : '（无）'
)
</script>

<template>
  <main class="page">
    <el-card shadow="never">
      <template #header>关于（带 query）</template>
      <p>
        当前 query：<code>{{ queryText }}</code>
      </p>
      <el-input v-model="text" placeholder="随便输入，然后切到其它页签再回来" />
      <small class="tip">本页保活：地址栏 query 与输入都会在切换页签后保留。</small>
    </el-card>
  </main>
</template>
