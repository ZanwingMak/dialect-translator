<template>
  <!-- 录音按钮：超大液态玻璃球，激活时变暖橙 + 强光晕 -->
  <div class="flex flex-col items-center py-6 select-none">
    <button
      type="button"
      @click="$emit('click')"
      :aria-label="active ? '停止录音' : '开始录音'"
      class="relative w-24 h-24 rounded-full transition-all duration-300 active:scale-95
             flex items-center justify-center
             focus:outline-none"
      :class="active ? 'is-active' : 'is-idle'"
    >
      <PhPause v-if="active" :size="36" weight="fill" class="text-white" />
      <PhMicrophone v-else :size="34" weight="fill" class="text-accent" />
    </button>

    <div class="mt-5 h-10 flex flex-col items-center justify-center">
      <Transition name="fade" mode="out-in">
        <div v-if="active" key="active" class="flex flex-col items-center gap-0.5">
          <div class="font-mono text-base tracking-tight tabular-nums text-ink-base font-medium">
            00:{{ String(recordingTime).padStart(2, '0') }}
          </div>
          <div class="text-xs text-ink-dim">
            {{ statusMessage || '正在聆听…' }}
          </div>
        </div>
        <div v-else key="idle" class="text-xs text-ink-muted">
          点击麦克风开始录音
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { PhMicrophone, PhPause } from '@phosphor-icons/vue'

const props = defineProps({
  isRecording: Boolean,
  isWebSpeechListening: Boolean,
  recordingTime: Number,
  statusMessage: String
})

defineEmits(['click'])

const active = computed(() => props.isRecording || props.isWebSpeechListening)
</script>

<style scoped>
/* 闲置态：白玻璃球，柔和高光 */
.is-idle {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  box-shadow:
    0 1px 0 0 rgba(255, 255, 255, 0.9) inset,
    0 -4px 12px 0 rgba(249, 115, 22, 0.08) inset,
    0 12px 36px -8px rgba(31, 18, 2, 0.18);
}

/* 激活态：暖橙渐变 + 强光晕 + 呼吸 */
.is-active {
  background: linear-gradient(180deg, #fb923c 0%, #f97316 100%);
  border: 1px solid rgba(255, 255, 255, 0.35);
  animation: pulse-glow 2s ease-in-out infinite;
  box-shadow:
    0 1px 0 0 rgba(255, 255, 255, 0.5) inset,
    0 -8px 16px 0 rgba(255, 255, 255, 0.2) inset,
    0 8px 28px -4px rgba(249, 115, 22, 0.55);
}

@keyframes pulse-glow {
  0%,
  100% {
    box-shadow:
      0 1px 0 0 rgba(255, 255, 255, 0.5) inset,
      0 -8px 16px 0 rgba(255, 255, 255, 0.2) inset,
      0 0 0 0 rgba(249, 115, 22, 0.45),
      0 8px 28px -4px rgba(249, 115, 22, 0.55);
  }
  50% {
    box-shadow:
      0 1px 0 0 rgba(255, 255, 255, 0.5) inset,
      0 -8px 16px 0 rgba(255, 255, 255, 0.2) inset,
      0 0 0 18px rgba(249, 115, 22, 0),
      0 8px 28px -4px rgba(249, 115, 22, 0.55);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
