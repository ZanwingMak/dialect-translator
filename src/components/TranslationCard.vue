<template>
  <div class="space-y-5">
    <!-- 源语言 -->
    <section>
      <header class="flex justify-between items-center mb-2 px-1">
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
        class="input-base text-[15px] leading-relaxed resize-none"
      ></textarea>

      <div class="flex gap-2 mt-2.5">
        <button
          @click="$emit('playSource')"
          :disabled="!sourceAudioUrl"
          class="glass-btn text-xs px-3 py-2 flex-1"
        >
          <PhPlay :size="13" weight="fill" />
          播放
        </button>
        <button @click="$emit('pasteSource')" class="glass-btn text-xs px-3 py-2 flex-1">
          <PhClipboardText :size="13" />
          粘贴
        </button>
        <button @click="$emit('copySource')" class="glass-btn text-xs px-3 py-2 flex-1">
          <PhCopy :size="13" />
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

    <!-- 翻译结果（淡入上浮） -->
    <Transition name="result">
      <section v-if="translatedText">
        <header class="flex justify-between items-center mb-2 px-1">
          <span class="label-meta">Result · {{ targetLanguageName }}</span>
        </header>

        <div class="glass-inset relative overflow-hidden p-4">
          <span
            class="absolute left-0 top-3 bottom-3 w-[3px] bg-accent rounded-full"
            aria-hidden="true"
          ></span>
          <p class="text-[15px] leading-relaxed text-ink-base pl-3">
            {{ translatedText }}
          </p>
        </div>

        <div class="mt-2.5">
          <button @click="$emit('copyTarget')" class="glass-btn text-xs px-3 py-2 w-full">
            <PhCopy :size="13" />
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
