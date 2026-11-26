<script setup>
import { useRouter } from 'vue-router'
import { tabState, closeTab, closeOthers, closeAll } from '../store/tabs'

const router = useRouter()

function activate(tab) {
  if (tab.key === tabState.activeKey) return
  if (tab.query) router.push({ path: tab.key, query: tab.query })
  else router.push(tab.key)
}
</script>

<template>
  <div class="tabbar">
    <div
      v-for="tab in tabState.tabs"
      :key="tab.key"
      class="tab"
      :class="{ 'is-active': tab.key === tabState.activeKey }"
      @click="activate(tab)"
    >
      <span v-if="tab.pinned" class="tab__pin">📌</span>
      <span>{{ tab.title }}</span>
      <button v-if="!tab.pinned" class="tab__close" title="关闭标签" @click.stop="closeTab(router, tab.key)">
        ×
      </button>
    </div>

    <div class="tabbar__tools">
      <button class="tabbar__tool" @click="closeOthers(router)">关闭其他</button>
      <button class="tabbar__tool" @click="closeAll(router)">关闭全部</button>
    </div>
  </div>
</template>
