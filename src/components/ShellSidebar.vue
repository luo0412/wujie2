<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { buildGroups } from '../config/apps'

const router = useRouter()
const route = useRoute()
const groups = buildGroups()
const props = defineProps({ open: { type: Boolean, default: false } })
const collapsed = ref({})
const emit = defineEmits(['navigate'])

const activeKey = computed(() => route.path)

function toggle(key) {
  collapsed.value = { ...collapsed.value, [key]: !collapsed.value[key] }
}

function go(item) {
  const target = item.key || item.path
  if (!target) return
  router.push(item.query ? { path: target, query: item.query } : target)
  emit('navigate', target)
}
</script>

<template>
  <aside class="sidebar" :class="{ 'is-open': open }">
    <div class="brand" @click="router.push('/home'); emit('navigate', '/home')">
      <span class="brand__logo">WJ</span>
      <span class="brand__text">
        wujie2 主应用
        <span class="brand__sub">Vue3 + wujie 微前端</span>
      </span>
    </div>

    <nav class="menu">
      <div v-for="group in groups" :key="group.key" class="menu__group">
        <div class="menu__group-title" @click="toggle(group.key)">
          <span>{{ group.title }}</span>
          <span>{{ collapsed[group.key] ? '＋' : '－' }}</span>
        </div>
        <template v-if="!collapsed[group.key]">
          <div
            v-for="item in group.children"
            :key="item.key"
            class="menu__item"
            :class="{ 'is-active': activeKey === item.key }"
            @click="go(item)"
          >
            <span class="menu__dot" />
            <span class="menu__text">{{ item.title }}</span>
            <span v-if="item.badge" class="menu__badge">{{ item.badge }}</span>
          </div>
        </template>
      </div>
    </nav>
  </aside>
</template>

<style scoped>
.menu__text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
