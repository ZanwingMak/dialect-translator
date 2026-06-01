<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 p-4">
    <div class="max-w-lg mx-auto">
      <LanguageSelector
        :languages="LANGUAGES"
        v-model:sourceLanguage="sourceLanguage"
        v-model:targetLanguage="targetLanguage"
        :config="config"
        @swap="swapLanguages"
      />

      <header class="text-center mb-4">
        <h1 class="text-2xl font-bold text-white">🗣️ {{ currentLanguagePair }}</h1>
      </header>

      <div class="glass rounded-2xl p-4 shadow-2xl">
        <RecordingButton
          :isRecording="recorder.isRecording.value"
          :isWebSpeechListening="webSpeech.isListening.value"
          :recordingTime="activeRecordingTime"
          :statusMessage="activeStatusMessage"
          @click="handleVoiceClick"
        />

        <TranslationCard
          v-model:sourceText="sourceText"
          :translatedText="translatedText"
          :sourceLanguageName="sourceLanguageName"
          :targetLanguageName="targetLanguageName"
          :sourceAudioUrl="sourceAudioUrl"
          :targetAudioUrl="targetAudioUrl"
          :isTranslating="translator.isTranslating.value"
          :whisperModel="config.whisperModel"
          @translate="handleTranslate"
          @playSource="playSourceVoice"
          @copySource="copyText(sourceText)"
          @pasteSource="pasteText"
          @copyTarget="copyText(translatedText)"
        />
      </div>

      <SettingsPanel
        v-model:showSettings="showSettings"
        :config="config"
        :translateModels="translateModels"
        :providerPlaceholder="providerPlaceholder"
        :providerLabel="providerLabel"
        :testResult="testResult"
        :history="history"
        :isDesktop="isDesktop"
        @testApi="handleTestApi"
        @clearHistory="handleClearHistory"
      />

      <HistoryPanel
        :history="history"
        :languages="LANGUAGES"
        @loadHistory="loadHistory"
        @removeHistory="removeHistory"
      />
    </div>

    <audio ref="sourceAudio" class="hidden"></audio>
    <audio ref="targetAudio" class="hidden"></audio>

    <canvas
      v-if="recorder.isRecording.value"
      ref="waveCanvas"
      class="fixed inset-0 pointer-events-none z-0"
      style="opacity: 0.3;"
    ></canvas>

    <Toast />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import LanguageSelector from '../components/LanguageSelector.vue'
import RecordingButton from '../components/RecordingButton.vue'
import TranslationCard from '../components/TranslationCard.vue'
import SettingsPanel from '../components/SettingsPanel.vue'
import HistoryPanel from '../components/HistoryPanel.vue'
import Toast from '../components/Toast.vue'

import { LANGUAGES } from '../constants/languages'
import { PROVIDERS, MODEL_OPTIONS } from '../constants/providers'
import { useConfig } from '../composables/useConfig'
import { useHistory } from '../composables/useHistory'
import { useToast } from '../composables/useToast'
import { useRecorder } from '../composables/useRecorder'
import { useWebSpeech } from '../composables/useWebSpeech'
import { useWhisper } from '../composables/useWhisper'
import { useTranslator } from '../composables/useTranslator'
import { useTTS } from '../composables/useTTS'

// ====== 全局状态 ======
const { config } = useConfig()
const { history, addHistory, clearHistory, removeHistory } = useHistory()
const { info, success, error } = useToast()
const recorder = useRecorder()
const webSpeech = useWebSpeech()
const { transcribe } = useWhisper()
const translator = useTranslator()
const { synthesize } = useTTS()

// ====== 桌面端检测 ======
const isDesktop = ref(false)
onMounted(() => {
  isDesktop.value = !!window.__TAURI__
  // 桌面端不支持 Web Speech API，强制使用 Whisper
  if (isDesktop.value && config.whisperModel === 'webspeech') {
    config.whisperModel = 'whisper-1'
  }
})

// ====== 语言选择 ======
const sourceLanguage = ref('leizhou')
const targetLanguage = ref('mandarin')

function swapLanguages() {
  ;[sourceLanguage.value, targetLanguage.value] = [targetLanguage.value, sourceLanguage.value]
}

// 当 id === 'custom' 时优先用用户输入的名字
const sourceLanguageName = computed(() => {
  if (sourceLanguage.value === 'custom' && config.customLanguageName) return config.customLanguageName
  return LANGUAGES.find((l) => l.id === sourceLanguage.value)?.name || '源语言'
})
const targetLanguageName = computed(() => {
  if (targetLanguage.value === 'custom' && config.customTargetLanguageName) return config.customTargetLanguageName
  return LANGUAGES.find((l) => l.id === targetLanguage.value)?.name || '目标语言'
})
const currentLanguagePair = computed(() => `${sourceLanguageName.value} → ${targetLanguageName.value}`)

// ====== 提供商相关派生 ======
const translateModels = computed(() => {
  const models = MODEL_OPTIONS[config.provider] || [{ label: 'Default', value: 'default' }]
  return [...models, { label: '自定义', value: 'custom' }]
})
const providerPlaceholder = computed(() => PROVIDERS[config.provider]?.placeholder || 'API Key')
const providerLabel = computed(() => PROVIDERS[config.provider]?.name || '')

// ====== 文本与音频状态 ======
const sourceText = ref('')
const translatedText = ref('')
const sourceAudioUrl = ref(null)
const targetAudioUrl = ref(null)
const showSettings = ref(false)
const testResult = ref('')

const sourceAudio = ref(null)
const targetAudio = ref(null)
const waveCanvas = ref(null)

// 录音中两种模式只会同时激活一种，统一对外暴露当前活跃的状态
const activeRecordingTime = computed(() =>
  recorder.isRecording.value ? recorder.recordingTime.value : webSpeech.recordingTime.value
)
const activeStatusMessage = computed(() =>
  recorder.isRecording.value ? recorder.statusMessage.value : webSpeech.statusMessage.value
)

// ====== 资源释放：组件卸载 & 切换录音前回收旧 ObjectURL ======
function revokeUrl(refObj) {
  if (refObj.value) {
    try { URL.revokeObjectURL(refObj.value) } catch {}
    refObj.value = null
  }
}

onUnmounted(() => {
  recorder.cleanup()
  webSpeech.cleanup()
  revokeUrl(sourceAudioUrl)
  revokeUrl(targetAudioUrl)
})

// ====== 录音入口 ======
function handleVoiceClick() {
  if (recorder.isRecording.value || webSpeech.isListening.value) {
    if (recorder.isRecording.value) recorder.stop()
    if (webSpeech.isListening.value) webSpeech.stop()
    return
  }
  startVoiceInput()
}

async function startVoiceInput() {
  sourceText.value = ''
  translatedText.value = ''
  revokeUrl(sourceAudioUrl)
  revokeUrl(targetAudioUrl)

  if (config.whisperModel === 'webspeech') {
    const lang = LANGUAGES.find((l) => l.id === sourceLanguage.value)?.speechLang || 'zh-CN'
    webSpeech.start({
      lang,
      onText: (text) => { sourceText.value = text },
      onError: (err) => error(err.message),
      onEnd: (finalText) => {
        sourceText.value = finalText
        if (finalText.trim()) handleTranslate()
      }
    })
    return
  }

  try {
    await recorder.start(async (blob) => {
      sourceAudioUrl.value = URL.createObjectURL(blob)
      if (sourceAudio.value) sourceAudio.value.src = sourceAudioUrl.value
      await runWhisper(blob)
    }, waveCanvas)
  } catch (err) {
    error(err.message)
  }
}

// ====== Whisper 识别 ======
async function runWhisper(blob) {
  if (!config.apiKey) {
    error('请先在设置中填入 API Key')
    return
  }
  info('识别中...')
  try {
    const text = await transcribe(blob)
    sourceText.value = text
    if (text.trim()) handleTranslate()
    else info('未识别到语音')
  } catch (err) {
    error('识别失败：' + err.message)
  }
}

// ====== 翻译 ======
async function handleTranslate() {
  const text = sourceText.value
  if (!text.trim()) return
  if (!config.apiKey) {
    error('请先在设置中填入 API Key')
    return
  }
  try {
    const result = await translator.translate({
      text,
      sourceName: sourceLanguageName.value,
      targetName: targetLanguageName.value,
      sourceLangId: sourceLanguage.value
    })
    translatedText.value = result
    addHistory({
      source: text,
      target: result,
      sourceLang: sourceLanguage.value,
      targetLang: targetLanguage.value
    })
    await runTTS(result)
  } catch (err) {
    error('翻译失败：' + err.message)
  }
}

// ====== TTS ======
async function runTTS(text) {
  revokeUrl(targetAudioUrl)
  try {
    const url = await synthesize(text)
    targetAudioUrl.value = url
    if (targetAudio.value && url) targetAudio.value.src = url
  } catch (err) {
    // TTS 失败不影响翻译流程，仅在控制台记录
    console.error('语音合成失败', err)
  }
}

// ====== 播放 / 复制 / 粘贴 ======
function playSourceVoice() {
  if (config.whisperModel === 'webspeech') {
    info('浏览器识别模式无法回放录音，请切换到 Whisper')
    return
  }
  sourceAudio.value?.play()
}

function copyText(text) {
  if (!text) return
  navigator.clipboard
    .writeText(text)
    .then(() => success('已复制'))
    .catch(() => error('复制失败'))
}

async function pasteText() {
  try {
    sourceText.value = await navigator.clipboard.readText()
  } catch {
    error('粘贴失败，请检查剪贴板权限')
  }
}

function loadHistory(item) {
  sourceText.value = item.source
  translatedText.value = item.target
  sourceLanguage.value = item.sourceLang || 'leizhou'
  targetLanguage.value = item.targetLang || 'mandarin'
}

function handleClearHistory() {
  if (confirm('确定要清空所有历史记录吗？')) {
    clearHistory()
    success('历史已清空')
  }
}

// ====== 测试 API ======
async function handleTestApi() {
  if (!config.apiKey) return
  testResult.value = '测试中...'
  try {
    const ok = await translator.testApiKey()
    testResult.value = ok ? '成功！' : '无效'
    ok ? success('API Key 有效') : error('API Key 无效')
  } catch (err) {
    testResult.value = '失败'
    error('测试失败：' + err.message)
  }
}
</script>

<style>
.btn-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.glass {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
}
</style>
