<template>
  <!-- 快捷设置栏 -->
  <div class="mt-4 flex gap-2 overflow-x-auto pb-2">
    <button 
      @click="toggleSettings"
      class="flex-shrink-0 px-4 py-2 bg-white/20 text-white rounded-full text-sm"
    >
      ⚙️ 设置
    </button>
    <button 
      v-if="history.length > 0"
      @click="$emit('clearHistory')"
      class="flex-shrink-0 px-4 py-2 bg-white/10 text-white/70 rounded-full text-sm"
    >
      🗑️ 清空历史
    </button>
  </div>

  <!-- 设置卡片 -->
  <div ref="settingsRef" class="mt-6 glass rounded-xl p-4">
    <div @click="toggleSettings" class="flex items-center justify-between cursor-pointer">
      <h3 class="text-white font-semibold">⚙️ 设置</h3>
      <span class="text-white/60">{{ showSettings ? '▼' : '▶' }}</span>
    </div>
    
    <div v-if="showSettings" class="mt-4 space-y-4">
      <!-- API 提供商选择 -->
      <div>
        <label class="text-white/70 text-sm block mb-2">翻译 API</label>
        <select 
          v-model="config.provider"
          class="w-full px-3 py-2 rounded-lg bg-white/10 text-white text-sm"
        >
          <option value="openai">OpenAI</option>
          <option value="openrouter">OpenRouter</option>
          <option value="deepseek">DeepSeek</option>
          <option value="qwen">Tongyi Qwen</option>
          <option value="ernie">ERNIE</option>
          <option value="doubao">Doubao</option>
          <option value="minimax">MiniMax</option>
          <option value="moonshot">Kimi</option>
          <option value="azure">Azure</option>
          <option value="custom">自定义 API</option>
        </select>
      </div>

      <!-- API Key -->
      <div>
        <label class="text-white/70 text-sm block mb-2">API Key</label>
        <input 
          v-model="config.apiKey"
          type="password"
          :placeholder="providerPlaceholder"
          class="w-full px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/40 text-sm"
        />
      </div>

      <!-- 自定义 API 地址 -->
      <div v-if="config.provider === 'custom'">
        <label class="text-white/70 text-sm block mb-2">API 地址</label>
        <input 
          v-model="config.customBaseUrl"
          type="text"
          placeholder="https://api.example.com/v1/chat/completions"
          class="w-full px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/40 text-sm"
        />
      </div>

      <!-- 翻译模型 -->
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-white/70 text-xs block mb-1">翻译模型</label>
          <select 
            v-model="config.translateModel"
            class="w-full px-2 py-2 rounded-lg bg-white/10 text-white text-xs"
          >
            <option v-for="m in translateModels" :key="m.value" :value="m.value">{{ m.label }}</option>
          </select>
        </div>
        <!-- 自定义模型输入 -->
        <div v-if="config.translateModel === 'custom'">
          <label class="text-white/70 text-xs block mb-1">模型名称</label>
          <input 
            v-model="config.customModel"
            type="text"
            placeholder="输入模型名称"
            class="w-full px-2 py-2 rounded-lg bg-white/10 text-white placeholder-white/40 text-xs"
          />
        </div>
        <!-- 语音识别 - 非自定义模型时 -->
        <div v-if="config.translateModel !== 'custom'">
          <label class="text-white/70 text-xs block mb-1">语音识别</label>
          <select 
            v-model="config.whisperModel"
            class="w-full px-2 py-2 rounded-lg bg-white/10 text-white text-xs"
          >
            <option value="webspeech">浏览器</option>
            <option value="whisper-1">Whisper</option>
          </select>
        </div>
      </div>
      <!-- 语音识别 - 自定义模型时 -->
      <div v-if="config.translateModel === 'custom'" class="mt-2">
        <label class="text-white/70 text-xs block mb-1">语音识别</label>
        <select 
          v-model="config.whisperModel"
          class="w-full px-2 py-2 rounded-lg bg-white/10 text-white text-xs"
        >
          <option value="webspeech">浏览器</option>
          <option value="whisper-1">Whisper</option>
        </select>
      </div>

      <!-- 状态 -->
      <div class="flex items-center justify-between text-xs">
        <span class="text-white/50">{{ testResult || providerLabel }}</span>
        <button 
          @click="$emit('testApi')"
          :disabled="!config.apiKey"
          class="text-blue-300 hover:text-blue-200"
        >
          测试
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

const props = defineProps({
  config: Object,
  showSettings: Boolean,
  translateModels: Array,
  providerPlaceholder: String,
  providerLabel: String,
  testResult: String,
  history: Array
})

const emit = defineEmits(['update:showSettings', 'testApi', 'clearHistory'])

const settingsRef = ref(null)

const toggleSettings = () => {
  const newVal = !props.showSettings
  emit('update:showSettings', newVal)
  if (newVal) {
    nextTick(() => {
      settingsRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }
}
</script>
