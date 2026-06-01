import { reactive } from 'vue'

// 全局轻量 toast 状态：替代生硬的 alert，桌面端与移动端体验一致
const state = reactive({
  visible: false,
  message: '',
  type: 'info' // 'info' | 'success' | 'error'
})

let hideTimer = null

// 弹出一条 toast，duration 毫秒后自动消失
function toast(message, type = 'info', duration = 2000) {
  state.message = message
  state.type = type
  state.visible = true
  clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    state.visible = false
  }, duration)
}

export function useToast() {
  return {
    state,
    toast,
    info: (msg, d) => toast(msg, 'info', d),
    success: (msg, d) => toast(msg, 'success', d),
    error: (msg, d) => toast(msg, 'error', d)
  }
}
