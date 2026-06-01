<template>
  <!-- 全局轻量提示：暗色调，左侧色条区分类型，避免与正文颜色冲突 -->
  <Transition name="toast">
    <div
      v-if="state.visible"
      role="status"
      aria-live="polite"
      class="fixed top-6 left-1/2 -translate-x-1/2 z-50
             flex items-center gap-2.5 px-4 py-2.5 rounded-xl
             text-sm text-ink-text bg-ink-raised border border-ink-border
             shadow-elev backdrop-blur-md"
    >
      <component :is="icon" :size="16" weight="fill" :class="iconClass" />
      {{ state.message }}
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import { PhCheckCircle, PhWarningCircle, PhInfo } from '@phosphor-icons/vue'
import { useToast } from '../composables/useToast'

const { state } = useToast()

// 按类型选不同图标 + 颜色
const icon = computed(() => {
  if (state.type === 'success') return PhCheckCircle
  if (state.type === 'error') return PhWarningCircle
  return PhInfo
})

const iconClass = computed(() => {
  if (state.type === 'success') return 'text-emerald-400'
  if (state.type === 'error') return 'text-danger'
  return 'text-accent'
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -8px);
}
</style>
