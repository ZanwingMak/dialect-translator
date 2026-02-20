<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 p-4">
    <div class="max-w-lg mx-auto">
      <!-- 语言选择器 -->
      <LanguageSelector
        :languages="languages"
        v-model:sourceLanguage="sourceLanguage"
        v-model:targetLanguage="targetLanguage"
        :config="config"
        @swap="swapLanguages"
      />

      <!-- 标题 -->
      <header class="text-center mb-4">
        <h1 class="text-2xl font-bold text-white">🗣️ {{ currentLanguagePair }}</h1>
      </header>

      <!-- 主卡片 -->
      <div class="glass rounded-2xl p-4 shadow-2xl">
        <!-- 录音按钮 -->
        <RecordingButton
          :isRecording="isRecording"
          :isWebSpeechListening="isWebSpeechListening"
          :recordingTime="recordingTime"
          :statusMessage="statusMessage"
          @click="handleVoiceClick"
        />

        <!-- 翻译卡片 -->
        <TranslationCard
          v-model:sourceText="sourceText"
          :translatedText="translatedText"
          :sourceLanguageName="sourceLanguageName"
          :targetLanguageName="targetLanguageName"
          :sourceAudioUrl="sourceAudioUrl"
          :targetAudioUrl="targetAudioUrl"
          :isTranslating="isTranslating"
          @translate="translateText(sourceText)"
          @playSource="playSourceVoice"
          @copySource="copyText(sourceText)"
          @pasteSource="pasteText"
          @playTarget="playTargetVoice"
          @copyTarget="copyText(translatedText)"
        />
      </div>

      <!-- 设置面板 -->
      <SettingsPanel
        v-model:showSettings="showSettings"
        :config="config"
        :translateModels="translateModels"
        :providerPlaceholder="providerPlaceholder"
        :providerLabel="providerLabel"
        :testResult="testResult"
        :history="history"
        @testApi="testApiKey"
        @clearHistory="clearHistory"
      />

      <!-- 历史记录 -->
      <HistoryPanel
        :history="history"
        :languages="languages"
        @loadHistory="loadHistory"
      />
    </div>

    <!-- 音频元素 -->
    <audio ref="sourceAudio" class="hidden"></audio>
    <audio ref="targetAudio" class="hidden"></audio>
    
    <canvas 
      v-if="isRecording"
      ref="waveCanvas"
      class="fixed inset-0 pointer-events-none z-0"
      style="opacity: 0.3;"
    ></canvas>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import LanguageSelector from '../components/LanguageSelector.vue'
import RecordingButton from '../components/RecordingButton.vue'
import TranslationCard from '../components/TranslationCard.vue'
import SettingsPanel from '../components/SettingsPanel.vue'
import HistoryPanel from '../components/HistoryPanel.vue'

// ====== 配置 ======
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

// ====== 语言配置 ======
const languages = [
  { id: 'leizhou', name: '雷州话', region: '广东雷州', family: '闽南语', isDialect: true },
  { id: 'cantonese', name: '粤语', region: '广东/香港', family: '粤语', isDialect: true },
  { id: 'hakka', name: '客家话', region: '梅州/惠州', family: '客家话', isDialect: true },
  { id: 'minnan', name: '闽南语', region: '福建/台湾', family: '闽南语', isDialect: true },
  { id: 'chaoshan', name: '潮汕话', region: '广东潮汕', family: '闽南语', isDialect: true },
  { id: 'wu', name: '吴语', region: '上海/浙江', family: '吴语', isDialect: true },
  { id: 'xiang', name: '湘语', region: '湖南', family: '湘语', isDialect: true },
  { id: 'gan', name: '赣语', region: '江西', family: '赣语', isDialect: true },
  { id: 'jinhui', name: '江淮话', region: '江苏/安徽', family: '官话', isDialect: true },
  { id: 'jin', name: '晋语', region: '山西', family: '晋语', isDialect: true },
  { id: 'huizhou', name: '徽语', region: '安徽', family: '徽语', isDialect: true },
  { id: 'dongbei', name: '东北话', region: '东北', family: '官话', isDialect: true },
  { id: 'beijing', name: '北京话', region: '北京', family: '官话', isDialect: true },
  { id: 'shandong', name: '山东话', region: '山东', family: '官话', isDialect: true },
  { id: 'sichuan', name: '四川话', region: '四川', family: '官话', isDialect: true },
  { id: 'mandarin', name: '普通话', region: '全国', family: '官话', isDialect: false },
  { id: 'custom', name: '自定义', region: '', family: '', isDialect: true }
]

const sourceLanguage = ref('leizhou')
const targetLanguage = ref('mandarin')

const swapLanguages = () => {
  const temp = sourceLanguage.value
  sourceLanguage.value = targetLanguage.value
  targetLanguage.value = temp
}

// 语言名称计算属性
const sourceLanguageName = computed(() => {
  if (sourceLanguage.value === 'custom' && config.customLanguageName) {
    return config.customLanguageName
  }
  const lang = languages.find(l => l.id === sourceLanguage.value)
  return lang?.name || '源语言'
})

const targetLanguageName = computed(() => {
  if (targetLanguage.value === 'custom' && config.customTargetLanguageName) {
    return config.customTargetLanguageName
  }
  const lang = languages.find(l => l.id === targetLanguage.value)
  return lang?.name || '目标语言'
})

const currentLanguagePair = computed(() => {
  return `${sourceLanguageName.value} → ${targetLanguageName.value}`
})

// ====== 状态 ======
const isRecording = ref(false)
const isTranslating = ref(false)
const isWebSpeechListening = ref(false)
const isWebSpeechPaused = ref(false)
const sourceText = ref('')
const translatedText = ref('')
const recordingTime = ref(0)
const sourceAudioUrl = ref(null)
const targetAudioUrl = ref(null)
const statusMessage = ref('')
const showSettings = ref(false)
const testResult = ref('')

// ====== Refs ======
const sourceAudio = ref(null)
const targetAudio = ref(null)
const waveCanvas = ref(null)

// ====== 提供商配置 ======
const providers = {
  openai: { name: 'OpenAI', baseUrl: 'https://api.openai.com/v1', placeholder: 'sk-...' },
  openrouter: { name: 'OpenRouter', baseUrl: 'https://openrouter.ai/api/v1', placeholder: 'sk-or-v1-...' },
  deepseek: { name: 'DeepSeek', baseUrl: 'https://api.deepseek.com', placeholder: 'sk-...' },
  qwen: { name: 'Tongyi Qwen', baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', placeholder: 'sk-...' },
  ernie: { name: 'ERNIE', baseUrl: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat', placeholder: 'Access Token' },
  doubao: { name: 'Doubao', baseUrl: 'https://ark.cn-beijing.volces.com/api/v3', placeholder: 'Token' },
  minimax: { name: 'MiniMax', baseUrl: 'https://api.minimax.chat/v1', placeholder: 'API Key' },
  moonshot: { name: 'Kimi', baseUrl: 'https://api.moonshot.cn/v1', placeholder: 'API Key' },
  azure: { name: 'Azure', baseUrl: '', placeholder: 'Azure Endpoint' }
}

const translateModels = computed(() => {
  const modelMap = {
    openai: [
      { label: 'GPT-4o', value: 'gpt-4o' },
      { label: 'GPT-4o-mini', value: 'gpt-4o-mini' },
      { label: 'GPT-4-Turbo', value: 'gpt-4-turbo-preview' },
      { label: 'GPT-4', value: 'gpt-4' },
      { label: 'GPT-3.5-Turbo', value: 'gpt-3.5-turbo' }
    ],
    openrouter: [
      { label: 'Auto', value: 'openrouter/auto' },
      { label: 'Claude-3.5-Sonnet', value: 'anthropic/claude-3.5-sonnet' },
      { label: 'Claude-3-Haiku', value: 'anthropic/claude-3-haiku' },
      { label: 'Gemini-1.5-Pro', value: 'google/gemini-1.5-pro' },
      { label: 'GPT-4o', value: 'openai/gpt-4o' }
    ],
    deepseek: [{ label: 'DeepSeek-Chat', value: 'deepseek-chat' }],
    qwen: [
      { label: 'Qwen-Plus', value: 'qwen-plus' },
      { label: 'Qwen-Turbo', value: 'qwen-turbo' },
      { label: 'Qwen-Max', value: 'qwen-max' }
    ],
    ernie: [
      { label: 'ERNIE-4.5', value: 'ernie-4.5-8k-preview' },
      { label: 'ERNIE-3.5-8K', value: 'ernie-3.5-8k' }
    ],
    doubao: [
      { label: 'Doubao-Pro-32K', value: 'doubao-pro-32k' },
      { label: 'Doubao-Pro-4K', value: 'doubao-pro-4k' }
    ],
    minimax: [{ label: 'MiniMax-Text-01', value: 'abab6.5s-chat' }],
    moonshot: [
      { label: 'Kimi-Max', value: 'kimi-max' },
      { label: 'Kimi-Plus', value: 'kimi-plus' },
      { label: 'Kimi-Core', value: 'kimi-latest' }
    ]
  }
  const models = modelMap[config.provider] || [{ label: 'Default', value: 'default' }]
  return [...models, { label: '自定义', value: 'custom' }]
})

const providerPlaceholder = computed(() => providers[config.provider]?.placeholder || 'API Key')
const providerLabel = computed(() => providers[config.provider]?.name || '')

// ====== 历史记录 ======
const history = reactive([])

// ====== 音频录制变量 ======
let mediaRecorder = null
let audioChunks = []
let audioContext = null
let analyser = null
let sourceNode = null
let recordingInterval = null
let webSpeechRecognition = null

// ====== 生命周期 ======
onMounted(() => {
  const savedConfig = localStorage.getItem('dialect_config')
  if (savedConfig) {
    try { Object.assign(config, JSON.parse(savedConfig)) } catch (e) {}
  }
  
  const savedHistory = localStorage.getItem('dialect_history')
  if (savedHistory) {
    try { history.push(...JSON.parse(savedHistory)) } catch (e) {}
  }
})

onUnmounted(() => {
  if (mediaRecorder) mediaRecorder.stop()
  if (webSpeechRecognition) webSpeechRecognition.stop()
  if (audioContext) audioContext.close()
  clearInterval(recordingInterval)
})

// ====== 语音输入处理 ======
const handleVoiceClick = () => {
  if (isRecording.value || isWebSpeechListening.value) {
    stopVoiceInput()
  } else {
    startVoiceInput()
  }
}

const startVoiceInput = async () => {
  sourceText.value = ''
  translatedText.value = ''
  
  if (isWebSpeechListening.value) {
    stopWebSpeech()
    return
  }
  
  if (config.whisperModel === 'webspeech') {
    await startWebSpeech()
  } else {
    await startRecording()
  }
}

const stopVoiceInput = () => {
  if (isWebSpeechListening.value) stopWebSpeech()
  if (isRecording.value) stopRecording()
}

// ====== Web Speech API ======
const startWebSpeech = async () => {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert('您的浏览器不支持语音识别')
    return
  }
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  webSpeechRecognition = new SpeechRecognition()
  
  webSpeechRecognition.lang = 'zh-CN'
  webSpeechRecognition.continuous = true
  webSpeechRecognition.interimResults = true
  
  isWebSpeechListening.value = true
  isWebSpeechPaused.value = false
  statusMessage.value = '🎤 🎤 正在聆听...'
  recordingTime.value = 0
  
  let finalTranscript = ''
  
  webSpeechRecognition.onresult = (event) => {
    let interim = ''
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript
      } else {
        interim += event.results[i][0].transcript
      }
    }
    statusMessage.value = interim || '🎤 🎤 正在聆听...'
    sourceText.value = finalTranscript + interim
  }
  
  webSpeechRecognition.onerror = (event) => {
    isWebSpeechListening.value = false
    isWebSpeechPaused.value = false
    statusMessage.value = ''
    if (event.error !== 'no-speech') {
      alert(`语音识别错误: ${event.error}`)
    }
  }
  
  webSpeechRecognition.onend = () => {
    isWebSpeechListening.value = false
    isWebSpeechPaused.value = false
    if (finalTranscript) {
      sourceText.value = finalTranscript
      statusMessage.value = '✅ 完成！'
    } else {
      statusMessage.value = ''
    }
  }
  
  webSpeechRecognition.start()
  
  recordingInterval = setInterval(() => {
    recordingTime.value++
    if (recordingTime.value >= 60) stopWebSpeech()
  }, 1000)
}

const stopWebSpeech = () => {
  if (webSpeechRecognition) {
    try { webSpeechRecognition.stop() } catch (e) {}
    webSpeechRecognition = null
  }
  isWebSpeechListening.value = false
  isWebSpeechPaused.value = false
  clearInterval(recordingInterval)
  statusMessage.value = ''
}

// ====== Whisper 录音 ======
const startRecording = async () => {
  try {
    audioChunks = []
    statusMessage.value = '录音中...'
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
    if (audioContext.state === 'suspended') {
      await audioContext.resume()
    }
    
    analyser = audioContext.createAnalyser()
    analyser.fftSize = 256
    
    try {
      sourceNode = audioContext.createMediaStreamSource(stream)
      sourceNode.connect(analyser)
    } catch (e) {}
    
    startWaveAnimation()
    
    const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' : undefined
    mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : {})
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunks.push(e.data)
    }
    
    mediaRecorder.onstop = async () => {
      if (audioChunks.length > 0) {
        const blob = new Blob(audioChunks, { type: 'audio/webm' })
        // 保存录音用于播放
        sourceAudioUrl.value = URL.createObjectURL(blob)
        sourceAudio.value.src = sourceAudioUrl.value
        await recognizeWithWhisper(blob)
      }
    }
    
    mediaRecorder.start()
    isRecording.value = true
    recordingTime.value = 0
    
    recordingInterval = setInterval(() => {
      recordingTime.value++
      if (recordingTime.value > 60) stopRecording()
    }, 1000)
    
  } catch (error) {
    statusMessage.value = ''
    alert('无法访问麦克风，请检查权限设置')
  }
}

const stopRecording = () => {
  if (mediaRecorder && isRecording.value) {
    try { mediaRecorder.stop() } catch (e) {}
    isRecording.value = false
    clearInterval(recordingInterval)
    stopWaveAnimation()
    if (audioContext) {
      audioContext.close()
      audioContext = null
    }
    statusMessage.value = ''
  }
}

// ====== 波形动画 ======
const startWaveAnimation = async () => {
  await nextTick()
  const canvas = waveCanvas.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  const width = window.innerWidth
  const height = window.innerHeight
  canvas.width = width
  canvas.height = height
  
  const draw = () => {
    if (!isRecording.value || !analyser) return
    
    requestAnimationFrame(draw)
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    analyser.getByteFrequencyData(dataArray)
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.fillRect(0, 0, width, height)
    
    const barWidth = (width / bufferLength) * 2.5
    let x = 0
    
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * height * 0.6
      const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height)
      gradient.addColorStop(0, '#ff6b6b')
      gradient.addColorStop(1, '#feca57')
      ctx.fillStyle = gradient
      ctx.fillRect(x, height - barHeight, barWidth - 2, barHeight)
      x += barWidth
    }
  }
  
  draw()
}

const stopWaveAnimation = () => {
  const canvas = waveCanvas.value
  if (canvas) {
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
}

// ====== Whisper 识别 ======
const recognizeWithWhisper = async (blob) => {
  statusMessage.value = '识别中...'
  
  try {
    const formData = new FormData()
    formData.append('file', blob, 'audio.webm')
    formData.append('model', 'whisper-1')
    formData.append('language', 'zh')
    
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${config.apiKey}` },
      body: formData
    })
    
    if (!response.ok) throw new Error('识别失败')
    
    const data = await response.json()
    sourceText.value = data.text || ''
    statusMessage.value = '✅ 识别完成'
    
    if (sourceText.value.trim()) {
      translateText(sourceText.value)
    }
  } catch (error) {
    statusMessage.value = ''
    alert('识别失败: ' + error.message)
  }
}

// ====== 翻译 ======
const translateModelsList = {
  openai: 'gpt-3.5-turbo',
  openrouter: 'openai/gpt-3.5-turbo',
  deepseek: 'deepseek-chat',
  qwen: 'qwen-plus',
  ernie: 'ernie-3.5-8k',
  doubao: 'doubao-pro-32k',
  minimax: 'abab6.5s-chat',
  moonshot: 'kimi-plus',
  azure: 'gpt-35-turbo'
}

const getModelName = () => {
  return config.translateModel === 'custom' ? config.customModel : config.translateModel
}

const translateText = async (text) => {
  if (!text.trim()) return
  
  isTranslating.value = true
  
  try {
    const baseUrl = config.provider === 'custom' ? config.customBaseUrl : providers[config.provider]?.baseUrl
    const model = config.translateModel === 'custom' ? config.customModel : 
                  config.translateModel === 'default' ? translateModelsList[config.provider] : config.translateModel
    
    // 构建系统提示词
    const vocab = getVocabulary(sourceLanguage.value)
    const sourceName = sourceLanguageName.value
    const targetName = targetLanguageName.value
    
    const systemPrompt = `你是一个专业的${sourceName}到${targetName}翻译助手。`
      + (vocab ? `\n\n${sourceName}参考词汇：\n${vocab}` : '')
      + '\n\n请准确翻译以下内容，保持原文风格。'
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
      'X-Title': 'Dialect Translator'
    }
    
    // ERNIE 需要特殊处理
    let url = `${baseUrl}/chat/completions`
    let body = {
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ],
      max_tokens: 1000
    }
    
    if (config.provider === 'ernie') {
      url = `${baseUrl}/${model}`
      body = {
        ...body,
        temperature: 0.9
      }
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    })
    
    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err.error?.message || `请求失败 (${response.status})`)
    }
    
    const data = await response.json()
    translatedText.value = data.choices?.[0]?.message?.content || ''
    
    // 保存历史
    history.unshift({ 
      id: Date.now(), 
      source: text, 
      target: translatedText.value,
      sourceLang: sourceLanguage.value,
      targetLang: targetLanguage.value,
      timestamp: Date.now() 
    })
    if (history.length > 50) history.pop()
    localStorage.setItem('dialect_history', JSON.stringify(history))
    localStorage.setItem('dialect_config', JSON.stringify(config))
    
    await generateSpeech(translatedText.value)
    
  } catch (error) {
    alert('翻译失败: ' + error.message)
  } finally {
    isTranslating.value = false
  }
}

// 获取词汇表
const getVocabulary = (source) => {
  const vocabData = {
    leizhou: '我=瓦(wa) 你=汝(ru) 他=伊(i) 吃=食(zia) 喝=呷(hab) 说=讲(gong) 来=来(lai) 去=去(ki) 知道=知影(zi iang) 什么=乜嘢(mih ye)',
    cantonese: '我=我(ngo) 你=你(ne) 佢=佢(keoi) 食=食(sik) 饮=饮(yam) 讲=讲(gong) 嚟=嚟(lai) 去=去(heoi) 知=知(zi) 咩=咩(me)',
    hakka: '我=𠊎(ngai) 你=你(n) 佢=佢(ki) 食=食(shi) 啉=啉(lim) 讲=讲(gong) 来=来(loi) 去=去(hi) 知=知(di) 乜=乜(m)',
    minnan: '我=我(goa) 你=你(li) 伊=伊(i) 食=食(tsiah) 饮=饮(lim) 讲=讲(kng) 来=来(lai) 去=去(khi) 知=知(tsai) 乜=乜(mih)',
    chaoshan: '我=我(ua) 你=汝(lu) 伊=伊(i) 食=食(tsiaʔ) 饮=饮(am) 讲=讲(kang) 来=来(lai) 去=去(khu) 知=知(tsai) 乜个=乜个(mih-kai)',
    wu: '我=我(ngo) 侬=侬(non) 渠=渠(gho) 吃=吃(qie) 讲=讲(gang) 来=来(le) 去=去(qi) 晓=晓(xiao) 啥=啥(sa)'
  }
  return vocabData[source] || null
}

// ====== 语音合成 ======
const generateSpeech = async (text) => {
  if (!text) return
  
  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.ttsModel || 'tts-1',
        voice: 'alloy',
        input: text
      })
    })
    
    if (!response.ok) throw new Error('语音合成失败')
    
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    targetAudioUrl.value = url
    
    targetAudio.value.src = url
  } catch (error) {
    console.error('语音合成失败:', error)
  }
}

// ====== 播放 & 复制 ======
const playSourceVoice = () => {
  sourceAudio.value?.play()
}

const playTargetVoice = () => {
  targetAudio.value?.play()
}

const copyText = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    alert('已复制！')
  })
}

const pasteText = async () => {
  try {
    const text = await navigator.clipboard.readText()
    sourceText.value = text
  } catch (error) {
    alert('粘贴失败，请检查权限')
  }
}

const loadHistory = (item) => {
  sourceText.value = item.source
  translatedText.value = item.target
  sourceLanguage.value = item.sourceLang || 'leizhou'
  targetLanguage.value = item.targetLang || 'mandarin'
}

const clearHistory = () => {
  if (confirm('确定要清空所有历史记录吗？')) {
    history.splice(0)
    localStorage.removeItem('dialect_history')
  }
}

// ====== 测试 API ======
const testApiKey = async () => {
  const key = config.apiKey
  if (!key) return
  
  testResult.value = '测试ing...'
  
  try {
    const baseUrl = config.provider === 'custom' ? config.customBaseUrl : providers[config.provider]?.baseUrl
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
        'X-Title': 'Dialect Translator'
      },
      body: JSON.stringify({
        model: getModelName(),
        messages: [{ role: 'user', content: 'hi' }],
        max_tokens: 5
      })
    })
    
    testResult.value = response.ok ? '成功！' : '无效'
  } catch (error) {
    testResult.value = `失败： ${error.message}`
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
