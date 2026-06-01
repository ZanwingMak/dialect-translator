<template>
  <div class="mt-6 space-y-3">
    <!-- 折叠头 -->
    <button
      type="button"
      ref="settingsRef"
      @click="toggleSettings"
      class="glass w-full flex items-center justify-between px-5 py-3.5
             text-ink-base text-sm font-medium"
    >
      <span class="flex items-center gap-2.5">
        <PhGear :size="16" class="text-ink-dim" />
        设置
      </span>
      <PhCaretDown
        :size="14"
        class="text-ink-muted transition-transform duration-200"
        :class="{ 'rotate-180': showSettings }"
      />
    </button>

    <!-- 设置面板 -->
    <Transition name="panel">
      <div v-if="showSettings" class="glass p-5 space-y-4">
        <Field label="翻译 API">
          <div class="relative">
            <select v-model="config.provider" class="input-base appearance-none pr-9 cursor-pointer">
              <option
                v-for="(p, id) in providers"
                :key="id"
                :value="id"
                class="bg-white"
              >{{ p.name }}</option>
            </select>
            <PhCaretDown
              :size="12"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none"
            />
          </div>
        </Field>

        <Field label="API Key">
          <input
            v-model="config.apiKey"
            type="password"
            :placeholder="providerPlaceholder"
            class="input-base"
          />
        </Field>

        <Field v-if="config.provider === 'custom'" label="API 地址">
          <input
            v-model="config.customBaseUrl"
            type="text"
            placeholder="https://api.example.com/v1"
            class="input-base"
          />
        </Field>

        <div class="grid grid-cols-2 gap-3">
          <Field label="翻译模型">
            <div class="relative">
              <select
                v-model="config.translateModel"
                class="input-base appearance-none pr-9 cursor-pointer"
              >
                <option
                  v-for="m in translateModels"
                  :key="m.value"
                  :value="m.value"
                  class="bg-white"
                >{{ m.label }}</option>
              </select>
              <PhCaretDown
                :size="12"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none"
              />
            </div>
          </Field>

          <Field v-if="config.translateModel === 'custom'" label="模型名称">
            <input
              v-model="config.customModel"
              type="text"
              placeholder="模型名称"
              class="input-base"
            />
          </Field>

          <Field v-else label="语音识别">
            <div class="relative">
              <select
                v-model="config.whisperModel"
                class="input-base appearance-none pr-9 cursor-pointer"
              >
                <option v-if="!isDesktop" value="webspeech" class="bg-white">浏览器</option>
                <option value="whisper-1" class="bg-white">Whisper</option>
              </select>
              <PhCaretDown
                :size="12"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none"
              />
            </div>
          </Field>
        </div>

        <Field v-if="config.translateModel === 'custom'" label="语音识别">
          <div class="relative">
            <select
              v-model="config.whisperModel"
              class="input-base appearance-none pr-9 cursor-pointer"
            >
              <option v-if="!isDesktop" value="webspeech" class="bg-white">浏览器</option>
              <option value="whisper-1" class="bg-white">Whisper</option>
            </select>
            <PhCaretDown
              :size="12"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none"
            />
          </div>
        </Field>

        <div class="flex items-center justify-between pt-3 border-t border-white/40">
          <span class="text-xs text-ink-muted">
            {{ testResult || providerLabel }}
          </span>
          <div class="flex gap-2">
            <button
              v-if="history.length > 0"
              @click="$emit('clearHistory')"
              class="glass-btn text-xs px-3 py-1.5"
            >
              <PhTrash :size="12" />
              清空历史
            </button>
            <button
              @click="$emit('testApi')"
              :disabled="!config.apiKey"
              class="glass-btn text-xs px-3 py-1.5 text-accent"
            >
              测试连接
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, nextTick, h } from 'vue'
import { PhGear, PhCaretDown, PhTrash } from '@phosphor-icons/vue'
import { PROVIDERS } from '../constants/providers'

const props = defineProps({
  config: Object,
  showSettings: Boolean,
  translateModels: Array,
  providerPlaceholder: String,
  providerLabel: String,
  testResult: String,
  history: Array,
  isDesktop: Boolean
})

const emit = defineEmits(['update:showSettings', 'testApi', 'clearHistory'])

const providers = PROVIDERS
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

// 「标签 + 控件」垂直行的极简函数式组件
const Field = (_, { slots, attrs }) =>
  h('label', { class: 'block' }, [
    h('span', { class: 'label-meta block mb-1.5 px-1' }, attrs.label),
    slots.default?.()
  ])
Field.props = ['label']
</script>

<style scoped>
.panel-enter-active,
.panel-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}
.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-4px);
}
.panel-enter-to,
.panel-leave-from {
  opacity: 1;
  max-height: 900px;
}
</style>
