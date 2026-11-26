<script setup>
defineOptions({ name: 'DemoNoCache' })

import { ref } from 'vue'

const text = ref('')
</script>

<template>
  <main class="page">
    <el-card shadow="never">
      <template #header>临时表单（不保活）</template>
      <el-alert
        title="本页 meta.keepAlive = false：切到其它页签再回来，页面会重新创建，输入被重置。"
        type="warning"
        :closable="false"
      />
      <el-input v-model="text" placeholder="随便输入，然后切到其它页签再回来" style="margin-top: 12px" />
      <small class="tip">与「用户」「关于」两个保活页对照即可看出差异。</small>
    </el-card>
  </main>
</template>
