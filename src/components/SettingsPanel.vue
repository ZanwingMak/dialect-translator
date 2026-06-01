<template>
  <div class="mt-6 space-y-3">
    <!-- 折叠头：暗色按钮风 -->
    <button
      type="button"
      ref="settingsRef"
      @click="toggleSettings"
      class="w-full flex items-center justify-between px-4 py-3 surface
             text-ink-text text-sm font-medium
             hover:border-ink-border-strong transition-colors"
    >
      <span class="flex items-center gap-2">
        <PhGear :size="16" class="text-ink-dim" />
        设置
      </span>
      <PhCaretDown
        :size="14"
        class="text-ink-muted transition-transform duration-200"
        :class="{ 'rotate-180': showSettings }"
      />
    </button>

    <!-- 设置面板：展开时上浮 -->
    <Transition name="panel">
      <div v-if="showSettings" class="surface p-4 space-y-4">
        <!-- API 提供商 -->
        <Field label="翻译 API">
          <div class="relative">
            <select v-model="config.provider" class="input-base appearance-none pr-8 cursor-pointer">
              <option
                v-for="(p, id) in providers"
                :key="id"
                :value="id"
                class="bg-ink-raised"
              >{{ p.name }}</option>
            </select>
            <PhCaretDown
              :size="12"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none"
            />
          </div>
        </Field>

        <!-- API Key -->
        <Field label="API Key">
          <input
            v-model="config.apiKey"
            type="password"
            :placeholder="providerPlaceholder"
            class="input-base"
          />
        </Field>

        <!-- 自定义 API 地址 -->
        <Field v-if="config.provider === 'custom'" label="API 地址">
          <input
            v-model="config.customBaseUrl"
            type="text"
            placeholder="https://api.example.com/v1"
            class="input-base"
          />
        </Field>

        <!-- 翻译模型 + 语音识别 -->
        <div class="grid grid-cols-2 gap-3">
          <Field label="翻译模型">
            <div class="relative">
              <select
                v-model="config.translateModel"
                class="input-base appearance-none pr-8 cursor-pointer"
              >
                <option
                  v-for="m in translateModels"
                  :key="m.value"
                  :value="m.value"
                  class="bg-ink-raised"
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
                class="input-base appearance-none pr-8 cursor-pointer"
              >
                <option v-if="!isDesktop" value="webspeech" class="bg-ink-raised">浏览器</option>
                <option value="whisper-1" class="bg-ink-raised">Whisper</option>
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
              class="input-base appearance-none pr-8 cursor-pointer"
            >
              <option v-if="!isDesktop" value="webspeech" class="bg-ink-raised">浏览器</option>
              <option value="whisper-1" class="bg-ink-raised">Whisper</option>
            </select>
            <PhCaretDown
              :size="12"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none"
            />
          </div>
        </Field>

        <!-- 测试 API + 清空历史 -->
        <div class="flex items-center justify-between pt-2 border-t border-ink-border">
          <span class="text-xs text-ink-muted">
            {{ testResult || providerLabel }}
          </span>
          <div class="flex gap-2">
            <button
              v-if="history.length > 0"
              @click="$emit('clearHistory')"
              class="btn-ghost text-xs px-2.5 py-1"
            >
              <PhTrash :size="12" />
              清空历史
            </button>
            <button
              @click="$emit('testApi')"
              :disabled="!config.apiKey"
              class="btn-ghost text-xs px-2.5 py-1 text-accent border-accent/30 hover:border-accent/60"
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

// 展开时把面板滚到视口顶部，避免被键盘遮挡
const toggleSettings = () => {
  const newVal = !props.showSettings
  emit('update:showSettings', newVal)
  if (newVal) {
    nextTick(() => {
      settingsRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }
}

// 简单的「标签 + 控件」垂直行
const Field = (_, { slots, attrs }) =>
  h('label', { class: 'block' }, [
    h('span', { class: 'label-meta block mb-1.5' }, attrs.label),
    slots.default?.()
  ])
Field.props = ['label']
</script>

<style scoped>
.input-base {
  @apply w-full px-3 py-2 surface-sunken text-sm text-ink-text placeholder-ink-muted
         hover:border-ink-border-strong focus:border-accent/40 transition-colors;
}

.panel-enter-active,
.panel-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
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
  max-height: 800px;
}
</style>
