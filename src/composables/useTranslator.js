import { ref } from 'vue'
import { PROVIDERS, DEFAULT_MODEL } from '../constants/providers'
import { VOCABULARY } from '../constants/languages'
import { useConfig } from './useConfig'

// 调用聊天补全 API 完成方言翻译
// 绝大多数提供商走 OpenAI 兼容 /chat/completions；anthropic 原生 /v1/messages 协议特殊处理
export function useTranslator() {
  const { config } = useConfig()
  const isTranslating = ref(false)

  // 解析最终实际使用的 baseUrl 与 model
  function resolveEndpoint() {
    const baseUrl =
      config.provider === 'custom'
        ? config.customBaseUrl
        : PROVIDERS[config.provider]?.baseUrl || ''
    let model = config.translateModel
    if (model === 'custom') model = config.customModel
    else if (model === 'default') model = DEFAULT_MODEL[config.provider]
    return { baseUrl, model }
  }

  // 构造翻译用系统提示词（含方言参考词汇）
  function buildSystemPrompt(sourceName, targetName, sourceLangId) {
    const vocab = VOCABULARY[sourceLangId]
    return (
      `你是一个专业的${sourceName}到${targetName}翻译助手。` +
      (vocab ? `\n\n${sourceName}参考词汇：\n${vocab}` : '') +
      '\n\n请准确翻译以下内容，保持原文风格。'
    )
  }

  // Anthropic 原生 messages API；浏览器调用需带 dangerous-direct-browser-access
  async function callAnthropic({ baseUrl, model, systemPrompt, userText }) {
    const response = await fetch(`${baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: userText }]
      })
    })
    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err.error?.message || `请求失败 (${response.status})`)
    }
    const data = await response.json()
    return data.content?.find((c) => c.type === 'text')?.text || ''
  }

  // OpenAI 兼容 /chat/completions；ERNIE 是 /{model} 子路径变体
  async function callOpenAICompatible({ baseUrl, model, systemPrompt, userText }) {
    const url =
      config.provider === 'ernie' ? `${baseUrl}/${model}` : `${baseUrl}/chat/completions`

    const body = {
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userText }
      ],
      max_tokens: 1000,
      ...(config.provider === 'ernie' ? { temperature: 0.9 } : {})
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
        'X-Title': 'Dialect Translator'
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err.error?.message || `请求失败 (${response.status})`)
    }
    const data = await response.json()
    return data.choices?.[0]?.message?.content || ''
  }

  // 发起翻译请求；返回译文文本
  async function translate({ text, sourceName, targetName, sourceLangId }) {
    if (!text.trim()) return ''
    isTranslating.value = true
    try {
      const { baseUrl, model } = resolveEndpoint()
      const systemPrompt = buildSystemPrompt(sourceName, targetName, sourceLangId)
      const args = { baseUrl, model, systemPrompt, userText: text }
      return config.provider === 'anthropic'
        ? await callAnthropic(args)
        : await callOpenAICompatible(args)
    } finally {
      isTranslating.value = false
    }
  }

  // 用一个最小请求验证 API Key 是否有效
  async function testApiKey() {
    const { baseUrl, model } = resolveEndpoint()
    if (config.provider === 'anthropic') {
      const response = await fetch(`${baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model,
          max_tokens: 5,
          messages: [{ role: 'user', content: 'hi' }]
        })
      })
      return response.ok
    }
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
        'X-Title': 'Dialect Translator'
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: 'hi' }],
        max_tokens: 5
      })
    })
    return response.ok
  }

  return { isTranslating, translate, testApiKey }
}
