<script setup>
import { computed, ref } from 'vue'
import { authState, authPrompt } from '../store/auth'
import { themeState, setSkin, setDark, setGrayscale } from '../store/theme'
import { tabState } from '../store/tabs'
import { SKINS } from '../store/theme'

const emit = defineEmits(['auth'])
const open = ref(window.innerWidth >= 900)

const authLabel = computed(() => {
  const s = authState.status
  if (s === 'authenticated') return authState.user?.name || '已登录'
  return s === 'expired' ? '登录已过期' : '未登录'
})
const authDot = computed(() => {
  const s = authState.status
  return s === 'authenticated' ? 'dot--ok' : s === 'expired' ? 'dot--warn' : 'dot--bad'
})
const buttons = computed(() => {
  if (authState.status === 'authenticated') {
    return [
      { action: 'refresh', label: '续期' },
      { action: 'expire', label: '模拟过期', tone: 'danger' },
      { action: 'unauthorized', label: '模拟 401', tone: 'danger' },
      { action: 'logout', label: '退出' },
    ]
  }
  return [{ action: 'login', label: authState.status === 'expired' ? '重新登录' : '登录', tone: 'primary' }]
})

const hint = computed(() =>
  authPrompt.visible ? `需要重新登录（${authPrompt.reason || 'manual'}）` : ''
)
</script>

<template>
  <div class="debug">
    <div class="debug__head" @click="open = !open">
      <span class="debug__title">壳层调试器 · wujie2</span>
      <span>{{ open ? '－' : '＋' }}</span>
    </div>

    <div v-if="open" class="debug__body">
      <div class="debug__row">
        <span class="debug__label">皮肤</span>
        <div class="skins">
          <button
            v-for="skin in SKINS"
            :key="skin.key"
            class="skin"
            :class="{ 'is-active': themeState.skin === skin.key }"
            @click="setSkin(skin.key)"
          >
            {{ skin.label }}
          </button>
        </div>
      </div>

      <div class="debug__divider" />

      <div class="debug__row">
        <span class="debug__label">
          <i class="dot" :class="authDot" />{{ authLabel }}
        </span>
        <span v-if="hint" class="debug__label" style="color: #d48100">{{ hint }}</span>
      </div>

      <div class="debug__btns">
        <button
          v-for="btn in buttons"
          :key="btn.action"
          class="mini-btn"
          :class="{
            'mini-btn--danger': btn.tone === 'danger',
            'mini-btn--primary': btn.tone === 'primary',
          }"
          @click="emit('auth', btn.action)"
        >
          {{ btn.label }}
        </button>
      </div>

      <div class="debug__divider" />

      <div class="debug__row">
        <span class="debug__label">深色模式</span>
        <button class="switch" :class="{ 'is-on': themeState.dark }" @click="setDark(!themeState.dark)" />
      </div>
      <div class="debug__row">
        <span class="debug__label">灰度（色弱）</span>
        <button
          class="switch"
          :class="{ 'is-on': themeState.grayscale }"
          @click="setGrayscale(!themeState.grayscale)"
        />
      </div>

      <div class="debug__divider" />

      <div class="metrics">
        <div class="metric">
          <b>{{ tabState.revision }}</b>
          <span>revision</span>
        </div>
        <div class="metric">
          <b>{{ tabState.tabs.length }}</b>
          <span>tabs</span>
        </div>
      </div>
    </div>
  </div>
</template>
