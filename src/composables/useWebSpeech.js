import { ref } from 'vue'
import { MAX_RECORDING_SECONDS } from '../constants/languages'

// 浏览器原生 Web Speech API 识别 composable
// 与 useRecorder 同形对外：isListening / recordingTime / statusMessage / start / stop
export function useWebSpeech() {
  const isListening = ref(false)
  const recordingTime = ref(0)
  const statusMessage = ref('')

  let recognition = null
  let interval = null

  // start({ lang, onText, onError, onEnd })
  // onText(text) 在每次结果更新时被调用（含中间结果）
  function start({ lang = 'zh-CN', onText, onError, onEnd } = {}) {
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!Ctor) {
      onError?.(new Error('您的浏览器不支持语音识别'))
      return
    }

    recognition = new Ctor()
    recognition.lang = lang
    recognition.continuous = true
    recognition.interimResults = true

    let finalTranscript = ''
    isListening.value = true
    recordingTime.value = 0
    statusMessage.value = '🎤 正在聆听...'

    recognition.onresult = (event) => {
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const piece = event.results[i][0].transcript
        if (event.results[i].isFinal) finalTranscript += piece
        else interim += piece
      }
      statusMessage.value = interim || '🎤 正在聆听...'
      onText?.(finalTranscript + interim)
    }

    recognition.onerror = (event) => {
      cleanup()
      if (event.error !== 'no-speech') onError?.(new Error(`语音识别错误: ${event.error}`))
    }

    recognition.onend = () => {
      cleanup()
      if (finalTranscript) {
        statusMessage.value = '✅ 完成'
        onEnd?.(finalTranscript)
      }
    }

    try {
      recognition.start()
    } catch (e) {
      cleanup()
      onError?.(e)
      return
    }

    interval = setInterval(() => {
      recordingTime.value++
      if (recordingTime.value >= MAX_RECORDING_SECONDS) stop()
    }, 1000)
  }

  // 手动停止；触发 onend 回调
  function stop() {
    if (recognition) {
      try { recognition.stop() } catch {}
    }
  }

  function cleanup() {
    isListening.value = false
    clearInterval(interval)
    interval = null
    recognition = null
  }

  return { isListening, recordingTime, statusMessage, start, stop, cleanup }
}
