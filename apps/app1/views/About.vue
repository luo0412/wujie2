<script setup>
import { ref } from 'vue'

defineOptions({ name: 'AboutPage' })
const text = ref('')
</script>

<template>
  <div class="card">
    <h3>关于</h3>
    <p>我是 App1，由 wujie 以 iframe 沙箱方式挂载，路由由主应用通过 props 桥接。</p>
    <input v-model="text" placeholder="在本页输入，切到本应用其他页面再回来" />
    <span class="small">页面级保活：每个子应用页面各自一份 state，切换页面后各自保留。</span>
  </div>
</template>
