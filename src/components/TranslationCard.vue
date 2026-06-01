<template>
  <div class="space-y-5">
    <!-- 源语言输入 -->
    <section>
      <header class="flex justify-between items-center mb-2">
        <span class="label-meta">Source · {{ sourceLanguageName }}</span>
        <span v-if="sourceText.length > 0" class="text-[11px] text-ink-muted tabular-nums">
          {{ sourceText.length }} 字
        </span>
      </header>

      <textarea
        :value="sourceText"
        @input="$emit('update:sourceText', $event.target.value)"
        :placeholder="`点击麦克风录音，或直接输入${sourceLanguageName}…`"
        rows="3"
        class="w-full p-3 surface-sunken text-ink-text placeholder-ink-muted
               text-[15px] leading-relaxed resize-none
               focus:border-accent/40 transition-colors"
      ></textarea>

      <div class="flex gap-1 mt-2">
        <button
          @click="$emit('playSource')"
          :disabled="!sourceAudioUrl"
          class="btn-ghost text-xs px-3 py-1.5 flex-1"
        >
          <PhPlay :size="14" weight="fill" />
          播放
        </button>
        <button @click="$emit('pasteSource')" class="btn-ghost text-xs px-3 py-1.5 flex-1">
          <PhClipboardText :size="14" />
          粘贴
        </button>
        <button @click="$emit('copySource')" class="btn-ghost text-xs px-3 py-1.5 flex-1">
          <PhCopy :size="14" />
          复制
        </button>
      </div>
    </section>

    <!-- 翻译主按钮 -->
    <button
      @click="$emit('translate')"
      :disabled="!sourceText.trim() || isTranslating"
      class="btn-primary w-full py-3.5 text-[15px]"
    >
      <template v-if="isTranslating">
        <PhCircleNotch :size="18" weight="bold" class="animate-spin" />
        翻译中…
      </template>
      <template v-else>
        翻译为 {{ targetLanguageName }}
        <PhArrowRight :size="18" weight="bold" />
      </template>
    </button>

    <!-- 翻译结果（出现时淡入上浮） -->
    <Transition name="result">
      <section v-if="translatedText" class="animate-fade-up">
        <header class="flex justify-between items-center mb-2">
          <span class="label-meta">Result · {{ targetLanguageName }}</span>
        </header>

        <div class="p-4 surface relative overflow-hidden">
          <!-- 左边一条暖色高光，区分源/译两区 -->
          <span
            class="absolute left-0 top-3 bottom-3 w-0.5 bg-accent/60 rounded-full"
            aria-hidden="true"
          ></span>
          <p class="text-[15px] leading-relaxed text-ink-text pl-3">
            {{ translatedText }}
          </p>
        </div>

        <div class="mt-2">
          <button @click="$emit('copyTarget')" class="btn-ghost text-xs px-3 py-1.5 w-full">
            <PhCopy :size="14" />
            复制结果
          </button>
        </div>
      </section>
    </Transition>
  </div>
</template>

<script setup>
import {
  PhPlay,
  PhClipboardText,
  PhCopy,
  PhArrowRight,
  PhCircleNotch
} from '@phosphor-icons/vue'

defineProps({
  sourceText: String,
  translatedText: String,
  sourceLanguageName: String,
  targetLanguageName: String,
  sourceAudioUrl: String,
  targetAudioUrl: String,
  isTranslating: Boolean,
  whisperModel: String
})

defineEmits([
  'update:sourceText',
  'translate',
  'playSource',
  'copySource',
  'pasteSource',
  'copyTarget'
])
</script>

<style scoped>
.result-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.result-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
</style>
