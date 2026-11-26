<script setup>
import { ref } from 'vue'

defineOptions({ name: 'NoCachePage' })
const text = ref('')
</script>

<template>
  <div class="card">
    <h3>临时表单 <span class="tag">不保活</span></h3>
    <input v-model="text" placeholder="离开本页后输入会被清空" />
    <span class="small">不进入 KeepAlive 缓存，用于对照。</span>
  </div>
</template>
