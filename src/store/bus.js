import { reactive } from 'vue'

export const busState = reactive({
  lastChildEvent: null,
  lastPingAt: '',
})

export function recordChildEvent(payload) {
  busState.lastChildEvent = payload
}
