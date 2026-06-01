<template>
  <!-- 录音控制：方形圆角，配合呼吸光晕，与暗色调度协调 -->
  <div class="flex flex-col items-center py-6 select-none">
    <button
      type="button"
      @click="$emit('click')"
      :aria-label="active ? '停止录音' : '开始录音'"
      class="relative w-20 h-20 rounded-2xl transition-all duration-200 active:scale-95
             flex items-center justify-center
             focus:outline-none"
      :class="
        active
          ? 'bg-accent text-ink-base animate-breathe'
          : 'bg-ink-raised border border-ink-border text-ink-text hover:border-ink-border-strong'
      "
    >
      <PhPause v-if="active" :size="28" weight="fill" />
      <PhMicrophone v-else :size="28" weight="regular" />
    </button>

    <!-- 状态行：录音中显示时间 + 文案；闲置时给一句轻提示 -->
    <div class="mt-5 h-10 flex flex-col items-center justify-center">
      <Transition name="fade" mode="out-in">
        <div v-if="active" key="active" class="flex flex-col items-center gap-1">
          <div class="font-mono text-lg tracking-tight tabular-nums text-ink-text">
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

// 把两种录音模式归并为一个"激活"状态，模板里只关心是否激活
const active = computed(() => props.isRecording || props.isWebSpeechListening)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
