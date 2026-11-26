<script setup>
import { APPS } from '../config/apps'
</script>

<template>
  <div class="page">
    <el-card shadow="never">
      <h2>wujie 2 多 Tab 微前端模板</h2>
      <p>
        主应用基于 Vue3 + Vite，通过 wujie-vue3 挂载 4 个异构子应用，alive 保活，切换页签时保留子应用状态。
      </p>
    </el-card>

    <el-card shadow="never" style="margin-top: 12px">
      <h3>子应用清单</h3>
      <ul class="app-list">
        <li v-for="app in APPS" :key="app.name">
          <b>{{ app.title }}</b>（{{ app.framework }}）— 入口：{{ `apps/${app.name}/index.html` }}
        </li>
      </ul>
      <small class="tip">点击左侧菜单中的子应用页面即可在同一壳层内打开，多标签之间互不干扰。</small>
    </el-card>
  </div>
</template>

<style scoped>
.app-list {
  margin: 0;
  padding-left: 18px;
  line-height: 2;
  color: var(--text-2);
  font-size: 13px;
}

.app-list b {
  color: var(--text);
}
</style>
