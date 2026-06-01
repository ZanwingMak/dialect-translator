import { reactive, watch } from 'vue'

const STORAGE_KEY = 'dialect_config'

// 全局唯一的用户配置（API、模型、自定义语言名等）。模块级单例，多组件共享同一份响应式状态
const config = reactive({
  provider: 'openai',
  apiKey: '',
  translateModel: 'gpt-3.5-turbo',
  customModel: '',
  customLanguageName: '',
  customTargetLanguageName: '',
  whisperModel: 'webspeech',
  ttsModel: 'tts-1',
  customBaseUrl: ''
})

// 首次加载时合并 localStorage 中的配置
try {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) Object.assign(config, JSON.parse(saved))
} catch {}

// 任何字段变化都自动持久化，避免业务代码里到处写 setItem
watch(
  config,
  (val) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
    } catch {}
  },
  { deep: true }
)

export function useConfig() {
  return { config }
}
