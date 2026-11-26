<script setup>
import { ref } from 'vue'

defineOptions({ name: 'RichTextPage' })
const rich = ref('<p>Hello wujie</p>')
</script>

<template>
  <div class="card">
    <h3>富文本编辑器</h3>
    <textarea v-model="rich" rows="5" placeholder="输入 HTML 片段" />
    <pre>{{ rich }}</pre>
    <span class="small">示例用 textarea 模拟富文本输入，实时渲染预览。</span>
  </div>
</template>
