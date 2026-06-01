<template>
  <!-- 液态玻璃 toast：高模糊白底，图标按类型变色 -->
  <Transition name="toast">
    <div
      v-if="state.visible"
      role="status"
      aria-live="polite"
      class="glass fixed top-6 left-1/2 -translate-x-1/2 z-50
             flex items-center gap-2.5 px-4 py-2.5
             text-sm text-ink-base rounded-full"
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

const icon = computed(() => {
  if (state.type === 'success') return PhCheckCircle
  if (state.type === 'error') return PhWarningCircle
  return PhInfo
})

const iconClass = computed(() => {
  if (state.type === 'success') return 'text-emerald-500'
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
