<template>
  <div class="flex items-center gap-2">
    <div class="flex-1 relative">
      <select
        v-model="sourceLanguage"
        class="w-full appearance-none pl-4 pr-9 py-3 input-base font-medium cursor-pointer"
      >
        <option
          v-for="lang in languages"
          :key="lang.id"
          :value="lang.id"
          class="bg-white text-ink-base"
        >{{ lang.name }}</option>
      </select>
      <PhCaretDown
        :size="14"
        class="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none"
      />
    </div>

    <button
      type="button"
      @click="$emit('swap')"
      aria-label="交换源语言与目标语言"
      class="glass-btn shrink-0 w-11 h-11 hover:text-accent"
    >
      <PhArrowsLeftRight :size="16" />
    </button>

    <div class="flex-1 relative">
      <select
        v-model="targetLanguage"
        class="w-full appearance-none pl-4 pr-9 py-3 input-base font-medium cursor-pointer"
      >
        <option
          v-for="lang in languages"
          :key="lang.id"
          :value="lang.id"
          class="bg-white text-ink-base"
        >{{ lang.name }}</option>
      </select>
      <PhCaretDown
        :size="14"
        class="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none"
      />
    </div>
  </div>

  <div
    v-if="sourceLanguage === 'custom' || targetLanguage === 'custom'"
    class="mt-2 space-y-2"
  >
    <input
      v-if="sourceLanguage === 'custom'"
      v-model="config.customLanguageName"
      type="text"
      placeholder="源语言名称"
      class="input-base"
    />
    <input
      v-if="targetLanguage === 'custom'"
      v-model="config.customTargetLanguageName"
      type="text"
      placeholder="目标语言名称"
      class="input-base"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { PhArrowsLeftRight, PhCaretDown } from '@phosphor-icons/vue'

const props = defineProps({
  languages: { type: Array, required: true },
  sourceLanguage: { type: String, required: true },
  targetLanguage: { type: String, required: true },
  config: { type: Object, required: true }
})

const emit = defineEmits(['update:sourceLanguage', 'update:targetLanguage', 'swap'])

const sourceLanguage = computed({
  get: () => props.sourceLanguage,
  set: (v) => emit('update:sourceLanguage', v)
})
const targetLanguage = computed({
  get: () => props.targetLanguage,
  set: (v) => emit('update:targetLanguage', v)
})
</script>
