<script setup>
import { computed, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import { bus } from 'wujie'
import { appUrl, resolveMicro } from '../config/apps'
import { themeState } from '../store/theme'

const route = useRoute()
const hosts = reactive({})

const micro = computed(() => resolveMicro(route.path))
const activeApp = computed(() => micro.value?.app || null)

function propsFor(name) {
  if (!hosts[name]) hosts[name] = reactive({ path: '/about', app: name, skin: themeState.skin })
  return hosts[name]
}

watch(
  () => route.path,
  () => {
    const m = micro.value
    if (!m) return
    const props = propsFor(m.app.name)
    props.path = m.page.path
    props.skin = themeState.skin
    bus.$emit('wj2:route', { app: m.app.name, path: m.page.path })
  },
  { immediate: true }
)

watch(
  () => themeState.skin,
  (skin) => Object.values(hosts).forEach((props) => (props.skin = skin))
)
</script>

<template>
  <div class="micro">
    <WujieVue
      v-if="activeApp"
      :key="activeApp.name"
      :name="activeApp.name"
      :url="appUrl(activeApp.name)"
      :alive="true"
      :props="propsFor(activeApp.name)"
      :fiber="false"
      width="100%"
      height="100%"
    >
      <template #loading>
        <div class="micro-loading">
          <span class="spinner" />
          <span>正在加载 {{ activeApp.title }} …</span>
        </div>
      </template>
    </WujieVue>
  </div>
</template>

<style scoped>
.micro {
  height: 100%;
  min-height: 360px;
}

.micro :deep(iframe) {
  border: 0;
  border-radius: 8px;
}

.micro-loading {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--muted);
  font-size: 13px;
  background: var(--panel);
  border-radius: 8px;
}

.spinner {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid var(--border);
  border-top-color: var(--primary);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
