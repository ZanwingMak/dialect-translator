<template>
  <!-- 全局轻量提示，悬浮顶部，自动消失 -->
  <Transition name="toast">
    <div
      v-if="state.visible"
      class="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl text-sm shadow-2xl backdrop-blur-md"
      :class="typeClass"
    >
      {{ state.message }}
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import { useToast } from '../composables/useToast'

const { state } = useToast()

// 不同类型的视觉色块
const typeClass = computed(() => {
  if (state.type === 'error') return 'bg-red-500/90 text-white'
  if (state.type === 'success') return 'bg-emerald-500/90 text-white'
  return 'bg-white/90 text-gray-800'
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -10px);
}
</style>
