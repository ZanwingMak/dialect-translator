<template>
  <!-- 源语言输入区 -->
  <div class="mb-4">
    <div class="flex justify-between items-center mb-2">
      <label class="text-white/80 text-sm">🎙️ {{ sourceLanguageName }}</label>
      <span v-if="sourceText.length > 0" class="text-white/50 text-xs">{{ sourceText.length }}字</span>
    </div>
    <textarea 
      :value="sourceText"
      @input="$emit('update:sourceText', $event.target.value)"
      :placeholder="`点击🎤录音，或直接输入${sourceLanguageName}...`"
      class="w-full h-28 p-4 rounded-xl bg-white/10 text-white placeholder-white/40 focus:outline-none resize-none transition-all focus:bg-white/15"
    ></textarea>
    <div class="flex gap-2 mt-2">
      <button 
        @click="$emit('playSource')"
        :disabled="!sourceAudioUrl"
        class="flex-1 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-40"
      >
        🔊 播放
      </button>
      <button 
        @click="$emit('pasteSource')"
        class="flex-1 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20"
      >
        📥 粘贴
      </button>
      <button 
        @click="$emit('copySource')"
        class="flex-1 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20"
      >
        📋 复制
      </button>
    </div>
  </div>

  <!-- 翻译按钮 -->
  <button 
    @click="$emit('translate')"
    :disabled="!sourceText.trim() || isTranslating"
    class="w-full py-4 btn-gradient text-white font-bold text-lg rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <span v-if="isTranslating">⏳ 翻译中...</span>
    <span v-else>🌐 翻译成 {{ targetLanguageName }}</span>
  </button>

  <!-- 翻译结果 -->
  <div v-if="translatedText" class="mt-4">
    <label class="text-white/80 text-sm mb-2 block">📝 {{ targetLanguageName }}</label>
    <div class="bg-white/10 rounded-xl p-4">
      <p class="text-white text-lg leading-relaxed">{{ translatedText }}</p>
    </div>
    <div class="flex gap-2 mt-2">
      <button 
        @click="$emit('playTarget')"
        :disabled="!targetAudioUrl"
        class="flex-1 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-40"
      >
        🔊 播放
      </button>
      <button 
        @click="$emit('copyTarget')"
        class="flex-1 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20"
      >
        📋 复制
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  sourceText: String,
  translatedText: String,
  sourceLanguageName: String,
  targetLanguageName: String,
  sourceAudioUrl: String,
  targetAudioUrl: String,
  isTranslating: Boolean
})

defineEmits([
  'update:sourceText', 
  'translate', 
  'playSource', 
  'copySource',
  'pasteSource',
  'playTarget',
  'copyTarget'
])
</script>
