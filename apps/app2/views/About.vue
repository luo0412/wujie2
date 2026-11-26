<script setup>
import { ref } from 'vue'

defineOptions({ name: 'AboutPage' })
const text = ref('')
</script>

<template>
  <div class="card">
    <h3>关于</h3>
    <p>我是 App2，同一份壳层里的第二个 Vue3 子应用，独立构建产物。</p>
    <input v-model="text" placeholder="本页输入，切页再回来" />
    <span class="small">每个子应用、每个页面各自保活，互不串状态。</span>
  </div>
</template>
