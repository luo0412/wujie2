<script setup>
import { ref } from 'vue'

defineOptions({ name: 'PickerPage' })
const category = ref('frontend')
const options = [
  { value: 'frontend', label: '前端工程' },
  { value: 'micro', label: '微前端架构' },
  { value: 'infra', label: '基建与发布' },
]
</script>

<template>
  <div class="card">
    <h3>远程分类选择器</h3>
    <select v-model="category">
      <option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option>
    </select>
    <pre>当前选择：{{ category }}</pre>
    <span class="small">选择结果保留在本页，切换到别的页签再回来仍在。</span>
  </div>
</template>
