<template>
  <!-- 录音控制 -->
  <div class="flex flex-col items-center mb-4">
    <!-- 录音按钮 -->
    <button 
      @click="handleClick"
      class="relative w-28 h-28 rounded-full transition-all shadow-lg"
      :class="isRecording || isWebSpeechListening ? 'bg-red-500 scale-95' : 'bg-white'"
    >
      <span class="text-5xl">{{ isRecording || isWebSpeechListening ? '⏸️' : '🎤' }}</span>
      <div v-if="isRecording || isWebSpeechListening" class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
    </button>
    
    <!-- 录音时间/状态 -->
    <div v-if="isRecording || isWebSpeechListening" class="mt-4 text-center">
      <span class="text-3xl font-bold text-white">{{ recordingTime }}</span>
      <span class="text-white/60 ml-1">秒</span>
      <p class="text-white/80 text-sm mt-1">{{ statusMessage }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isRecording: Boolean,
  isWebSpeechListening: Boolean,
  recordingTime: Number,
  statusMessage: String
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click')
}
</script>
