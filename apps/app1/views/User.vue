<script setup>
import { ref } from 'vue'

defineOptions({ name: 'UserPage' })
const text = ref('')
</script>

<template>
  <div class="card">
    <h3>用户</h3>
    <p>用户名：<b>app1-user</b> · 角色：子应用演示账号</p>
    <input v-model="text" placeholder="本页独立输入框，和「关于」互不影响" />
    <span class="small">每个页面组件独立持有自己的 state。</span>
  </div>
</template>
