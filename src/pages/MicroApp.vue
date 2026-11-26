<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { bus } from 'wujie'
import { appUrl, resolveMicro } from '../config/apps'
import { themeState } from '../store/theme'

const route = useRoute()
const hosts = reactive({})
const mounted = ref([])

const micro = computed(() => resolveMicro(route.path))

function ensure(name) {
  if (!hosts[name]) hosts[name] = reactive({ path: '/about', app: name, skin: themeState.skin })
  if (!mounted.value.includes(name)) mounted.value.push(name)
  return hosts[name]
}

watch(
  () => route.path,
  () => {
    const m = micro.value
    if (!m) return
    const props = ensure(m.app.name)
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
    <div
      v-for="name in mounted"
      :key="name"
      class="host"
      :class="{ 'is-hidden': !micro || micro.app.name !== name }"
    >
      <WujieVue
        :name="name"
        :url="appUrl(name)"
        :alive="true"
        :props="hosts[name]"
        :fiber="false"
        width="100%"
        height="100%"
      />
    </div>
  </div>
</template>

<style scoped>
.micro {
  height: 100%;
}

.host {
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  background: var(--panel);
  border: 1px solid var(--border);
}

.is-hidden {
  display: none;
}
</style>
