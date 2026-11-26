<script setup>
import { ref } from 'vue'

defineOptions({ name: 'NoCachePage' })
const text = ref('')
</script>

<template>
  <div class="card">
    <h3>临时表单 <span class="tag">不保活</span></h3>
    <p>主应用里该页 keepAlive=false，子应用侧同样不进入 KeepAlive 缓存，每次进入都重新挂载。</p>
    <input v-model="text" placeholder="输入内容会在离开本页后丢失" />
    <span class="small">用来和 About / User 两个保活页做对照。</span>
  </div>
</template>
