<template>
  <!-- 语言选择行：源 + 交换 + 目标，三段对称 -->
  <div class="flex items-center gap-2">
    <div class="flex-1 relative">
      <select
        v-model="sourceLanguage"
        class="w-full appearance-none pl-3 pr-8 py-2.5 surface-sunken
               text-sm text-ink-text cursor-pointer
               hover:border-ink-border-strong transition-colors"
      >
        <option
          v-for="lang in languages"
          :key="lang.id"
          :value="lang.id"
          class="bg-ink-raised text-ink-text"
        >{{ lang.name }}</option>
      </select>
      <PhCaretDown
        :size="14"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none"
      />
    </div>

    <button
      type="button"
      @click="$emit('swap')"
      aria-label="交换源语言与目标语言"
      class="shrink-0 w-10 h-10 surface-sunken text-ink-dim
             hover:text-accent hover:border-accent/40 transition-all duration-200
             active:scale-95 flex items-center justify-center"
    >
      <PhArrowsLeftRight :size="16" />
    </button>

    <div class="flex-1 relative">
      <select
        v-model="targetLanguage"
        class="w-full appearance-none pl-3 pr-8 py-2.5 surface-sunken
               text-sm text-ink-text cursor-pointer
               hover:border-ink-border-strong transition-colors"
      >
        <option
          v-for="lang in languages"
          :key="lang.id"
          :value="lang.id"
          class="bg-ink-raised text-ink-text"
        >{{ lang.name }}</option>
      </select>
      <PhCaretDown
        :size="14"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none"
      />
    </div>
  </div>

  <!-- 自定义语言名称输入（仅在选了 custom 时展示） -->
  <div
    v-if="sourceLanguage === 'custom' || targetLanguage === 'custom'"
    class="mt-2 space-y-2"
  >
    <input
      v-if="sourceLanguage === 'custom'"
      v-model="config.customLanguageName"
      type="text"
      placeholder="源语言名称"
      class="w-full px-3 py-2 surface-sunken text-sm text-ink-text placeholder-ink-muted"
    />
    <input
      v-if="targetLanguage === 'custom'"
      v-model="config.customTargetLanguageName"
      type="text"
      placeholder="目标语言名称"
      class="w-full px-3 py-2 surface-sunken text-sm text-ink-text placeholder-ink-muted"
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
