import { ref, nextTick } from 'vue'
import { MAX_RECORDING_SECONDS } from '../constants/languages'

// 基于 MediaRecorder 的录音 + 可视化波形 composable
// 关注点：完整释放麦克风流、清理动画句柄、对外暴露最少状态
export function useRecorder() {
  const isRecording = ref(false)
  const recordingTime = ref(0)
  const statusMessage = ref('')

  let mediaRecorder = null
  let mediaStream = null
  let audioChunks = []
  let audioContext = null
  let analyser = null
  let recordingInterval = null
  let rafId = null

  // 选择浏览器实际支持的录音容器格式，回退顺序：webm → mp4 → 默认
  function pickMimeType() {
    if (MediaRecorder.isTypeSupported('audio/webm')) return 'audio/webm'
    if (MediaRecorder.isTypeSupported('audio/mp4')) return 'audio/mp4'
    return undefined
  }

  // 启动录音；onStop(blob) 在录音结束（手动停止或超时）后被调用
  async function start(onStop, waveCanvasRef) {
    audioChunks = []
    statusMessage.value = '请求麦克风权限...'

    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch {
      statusMessage.value = ''
      throw new Error('无法访问麦克风，请到系统设置 > 隐私与安全性 > 麦克风 中允许')
    }

    statusMessage.value = '录音中...'

    audioContext = new (window.AudioContext || window.webkitAudioContext)()
    if (audioContext.state === 'suspended') await audioContext.resume()
    analyser = audioContext.createAnalyser()
    analyser.fftSize = 256
    try {
      audioContext.createMediaStreamSource(mediaStream).connect(analyser)
    } catch {}

    const mimeType = pickMimeType()
    mediaRecorder = new MediaRecorder(mediaStream, mimeType ? { mimeType } : {})
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunks.push(e.data)
    }
    mediaRecorder.onstop = () => {
      const blob = audioChunks.length
        ? new Blob(audioChunks, { type: mimeType || 'audio/webm' })
        : null
      cleanup()
      if (blob) onStop?.(blob)
    }

    mediaRecorder.start()
    isRecording.value = true
    recordingTime.value = 0
    recordingInterval = setInterval(() => {
      recordingTime.value++
      if (recordingTime.value >= MAX_RECORDING_SECONDS) stop()
    }, 1000)

    startWave(waveCanvasRef)
  }

  // 手动停止录音；触发 mediaRecorder.onstop，进而回调 onStop
  function stop() {
    if (mediaRecorder && isRecording.value) {
      try { mediaRecorder.stop() } catch {}
    }
    isRecording.value = false
  }

  // 释放定时器、麦克风轨道、AudioContext 与动画句柄
  function cleanup() {
    clearInterval(recordingInterval)
    recordingInterval = null
    if (rafId) cancelAnimationFrame(rafId)
    rafId = null
    if (mediaStream) {
      mediaStream.getTracks().forEach((t) => t.stop())
      mediaStream = null
    }
    if (audioContext) {
      try { audioContext.close() } catch {}
      audioContext = null
    }
    analyser = null
    mediaRecorder = null
    statusMessage.value = ''
  }

  // 频谱柱状波形动画，绘制到外部传入的 canvas
  async function startWave(canvasRef) {
    await nextTick()
    const canvas = canvasRef?.value
    if (!canvas || !analyser) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const { width, height } = canvas

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      if (!isRecording.value || !analyser) return
      rafId = requestAnimationFrame(draw)
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

  return { isRecording, recordingTime, statusMessage, start, stop, cleanup }
}
