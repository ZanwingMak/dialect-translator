<template>
  <!-- 语言选择器 -->
  <div class="flex gap-2 mb-2">
    <div class="flex-1">
      <select 
        v-model="sourceLanguage"
        class="w-full px-3 py-2 h-10 rounded-xl bg-white/20 text-white text-sm font-medium"
      >
        <option v-for="lang in languages" :key="lang.id" :value="lang.id" class="bg-gray-800">{{ lang.name }}</option>
      </select>
    </div>
    <button @click="swapLanguages" class="px-3 py-2 bg-white/20 rounded-xl text-white hover:bg-white/30 transition">
      ⇄
    </button>
    <div class="flex-1">
      <select 
        v-model="targetLanguage"
        class="w-full px-3 py-2 h-10 rounded-xl bg-white/20 text-white text-sm font-medium"
      >
        <option v-for="lang in languages" :key="lang.id" :value="lang.id" class="bg-gray-800">{{ lang.name }}</option>
      </select>
    </div>
  </div>
  <!-- 自定义语言名称输入 -->
  <div v-if="sourceLanguage === 'custom' || targetLanguage === 'custom'" class="mb-3 space-y-2">
    <input 
      v-if="sourceLanguage === 'custom'"
      v-model="config.customLanguageName"
      type="text"
      placeholder="源语言名称"
      class="w-full px-3 py-2 rounded-xl bg-white/20 text-white placeholder-white/40 text-sm"
    />
    <input 
      v-if="targetLanguage === 'custom'"
      v-model="config.customTargetLanguageName"
      type="text"
      placeholder="目标语言名称"
      class="w-full px-3 py-2 rounded-xl bg-white/20 text-white placeholder-white/40 text-sm"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  languages: { type: Array, required: true },
  sourceLanguage: { type: String, required: true },
  targetLanguage: { type: String, required: true },
  config: { type: Object, required: true }
})

const emit = defineEmits(['update:sourceLanguage', 'update:targetLanguage', 'swap'])

const sourceLanguage = computed({
  get: () => props.sourceLanguage,
  set: (val) => emit('update:sourceLanguage', val)
})

const targetLanguage = computed({
  get: () => props.targetLanguage,
  set: (val) => emit('update:targetLanguage', val)
})

const swapLanguages = () => {
  emit('swap')
}
</script>
