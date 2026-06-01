<template>
  <div class="relative min-h-[100dvh] px-4 py-6 sm:py-10 overflow-hidden">
    <!-- 背景浮动色球：Apple Intelligence 风格 4 色 (紫/蓝/粉/橙) 缓慢漂浮 -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      <div
        class="absolute -top-24 -left-20 w-[440px] h-[440px] rounded-full opacity-60 blur-3xl animate-float-slow"
        style="background: radial-gradient(circle, #a78bfa 0%, transparent 70%);"
      ></div>
      <div
        class="absolute -top-16 right-0 w-[420px] h-[420px] rounded-full opacity-55 blur-3xl animate-float-slower"
        style="background: radial-gradient(circle, #60a5fa 0%, transparent 70%);"
      ></div>
      <div
        class="absolute top-1/2 -right-28 w-[460px] h-[460px] rounded-full opacity-55 blur-3xl animate-float-slow"
        style="background: radial-gradient(circle, #f472b6 0%, transparent 70%);"
      ></div>
      <div
        class="absolute -bottom-32 left-1/4 w-[500px] h-[500px] rounded-full opacity-55 blur-3xl animate-float-slower"
        style="background: radial-gradient(circle, #fb923c 0%, transparent 70%);"
      ></div>
    </div>

    <div class="relative max-w-md mx-auto">
      <!-- Header -->
      <header class="mb-6 flex items-center justify-between px-1">
        <div class="flex items-center gap-2">
          <div
            class="w-8 h-8 rounded-2xl flex items-center justify-center"
            style="background: linear-gradient(135deg, #3395ff 0%, #007AFF 100%); box-shadow: 0 1px 0 rgba(255,255,255,0.5) inset, 0 4px 12px -2px rgba(0,122,255,0.4);"
          >
            <PhSpeakerHigh :size="16" class="text-white" weight="fill" />
          </div>
          <span class="text-sm font-semibold tracking-tight text-ink-base">方言翻译器</span>
        </div>
        <span class="text-[11px] text-ink-muted tabular-nums font-medium">
          {{ sourceLanguageName }} → {{ targetLanguageName }}
        </span>
      </header>

      <!-- 主交互区 -->
      <div class="space-y-4">
        <LanguageSelector
          :languages="LANGUAGES"
          v-model:sourceLanguage="sourceLanguage"
          v-model:targetLanguage="targetLanguage"
          :config="config"
          @swap="swapLanguages"
        />

        <div class="glass p-5">
          <RecordingButton
            :isRecording="recorder.isRecording.value"
            :isWebSpeechListening="webSpeech.isListening.value"
            :recordingTime="activeRecordingTime"
            :statusMessage="activeStatusMessage"
            @click="handleVoiceClick"
          />

          <div class="border-t border-white/40 pt-5">
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

      <footer class="mt-10 text-center text-[11px] text-ink-muted">
        Built with Claude · API Key 仅保存在本地浏览器
      </footer>
    </div>

    <audio ref="sourceAudio" class="hidden"></audio>
    <audio ref="targetAudio" class="hidden"></audio>

    <canvas
      v-if="recorder.isRecording.value"
      ref="waveCanvas"
      class="fixed inset-0 pointer-events-none z-0"
      style="opacity: 0.32; mix-blend-mode: multiply;"
    ></canvas>

    <Toast />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { PhSpeakerHigh } from '@phosphor-icons/vue'

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

const { config } = useConfig()
const { history, addHistory, clearHistory, removeHistory } = useHistory()
const { info, success, error } = useToast()
const recorder = useRecorder()
const webSpeech = useWebSpeech()
const { transcribe } = useWhisper()
const translator = useTranslator()
const { synthesize } = useTTS()

const isDesktop = ref(false)
onMounted(() => {
  isDesktop.value = !!window.__TAURI__
  if (isDesktop.value && config.whisperModel === 'webspeech') {
    config.whisperModel = 'whisper-1'
  }
})

const sourceLanguage = ref('leizhou')
const targetLanguage = ref('mandarin')

function swapLanguages() {
  ;[sourceLanguage.value, targetLanguage.value] = [targetLanguage.value, sourceLanguage.value]
}

const sourceLanguageName = computed(() => {
  if (sourceLanguage.value === 'custom' && config.customLanguageName) return config.customLanguageName
  return LANGUAGES.find((l) => l.id === sourceLanguage.value)?.name || '源语言'
})
const targetLanguageName = computed(() => {
  if (targetLanguage.value === 'custom' && config.customTargetLanguageName) return config.customTargetLanguageName
  return LANGUAGES.find((l) => l.id === targetLanguage.value)?.name || '目标语言'
})

const translateModels = computed(() => {
  const models = MODEL_OPTIONS[config.provider] || [{ label: 'Default', value: 'default' }]
  return [...models, { label: '自定义', value: 'custom' }]
})
const providerPlaceholder = computed(() => PROVIDERS[config.provider]?.placeholder || 'API Key')
const providerLabel = computed(() => PROVIDERS[config.provider]?.name || '')

const sourceText = ref('')
const translatedText = ref('')
const sourceAudioUrl = ref(null)
const targetAudioUrl = ref(null)
const showSettings = ref(false)
const testResult = ref('')

const sourceAudio = ref(null)
const targetAudio = ref(null)
const waveCanvas = ref(null)

const activeRecordingTime = computed(() =>
  recorder.isRecording.value ? recorder.recordingTime.value : webSpeech.recordingTime.value
)
const activeStatusMessage = computed(() =>
  recorder.isRecording.value ? recorder.statusMessage.value : webSpeech.statusMessage.value
)

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

async function runWhisper(blob) {
  if (!config.apiKey) {
    error('请先在设置中填入 API Key')
    return
  }
  info('识别中…')
  try {
    const text = await transcribe(blob)
    sourceText.value = text
    if (text.trim()) handleTranslate()
    else info('未识别到语音')
  } catch (err) {
    error('识别失败：' + err.message)
  }
}

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

async function runTTS(text) {
  revokeUrl(targetAudioUrl)
  try {
    const url = await synthesize(text)
    targetAudioUrl.value = url
    if (targetAudio.value && url) targetAudio.value.src = url
  } catch (err) {
    console.error('语音合成失败', err)
  }
}

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

async function handleTestApi() {
  if (!config.apiKey) return
  testResult.value = '测试中…'
  try {
    const ok = await translator.testApiKey()
    testResult.value = ok ? '连接正常' : '无效'
    ok ? success('API Key 有效') : error('API Key 无效')
  } catch (err) {
    testResult.value = '失败'
    error('测试失败：' + err.message)
  }
}
</script>
