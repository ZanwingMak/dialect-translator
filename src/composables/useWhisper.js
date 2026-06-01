import { useConfig } from './useConfig'

// 调用 OpenAI Whisper API 把音频 Blob 转写为文本
export function useWhisper() {
  const { config } = useConfig()

  // 把 Blob 上传到 /audio/transcriptions，返回识别出的文本
  async function transcribe(blob) {
    const formData = new FormData()
    formData.append('file', blob, 'audio.webm')
    // 用户在设置里若选了具体 whisper 模型则使用之，否则默认 whisper-1
    formData.append('model', config.whisperModel === 'webspeech' ? 'whisper-1' : config.whisperModel || 'whisper-1')
    formData.append('language', 'zh')

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.apiKey}` },
      body: formData
    })
    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err.error?.message || `识别失败 (${response.status})`)
    }
    const data = await response.json()
    return data.text || ''
  }

  return { transcribe }
}
