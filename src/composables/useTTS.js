import { useConfig } from './useConfig'

// 调用 OpenAI TTS 接口把文本合成为可播放的音频 URL
export function useTTS() {
  const { config } = useConfig()

  // 返回 object URL；调用方负责在不再使用时 revoke
  async function synthesize(text) {
    if (!text) return null
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.ttsModel || 'tts-1',
        voice: 'alloy',
        input: text
      })
    })
    if (!response.ok) throw new Error('语音合成失败')
    const blob = await response.blob()
    return URL.createObjectURL(blob)
  }

  return { synthesize }
}
