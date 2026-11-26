<script setup>
import { ref } from 'vue'

defineOptions({ name: 'UserPage' })
const text = ref('')
</script>

<template>
  <div class="card">
    <h3>用户</h3>
    <p>用户名：<b>app2-user</b></p>
    <input v-model="text" placeholder="本页独立输入框" />
  </div>
</template>
