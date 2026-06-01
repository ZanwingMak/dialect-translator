// AI 提供商及默认 baseUrl / API Key 占位提示
// 全部统一走 OpenAI 兼容的 /chat/completions 协议，ERNIE 除外（在 useTranslator 里特殊处理）
export const PROVIDERS = {
  openai: { name: 'OpenAI', baseUrl: 'https://api.openai.com/v1', placeholder: 'sk-...' },
  anthropic: { name: 'Anthropic Claude', baseUrl: 'https://api.anthropic.com/v1', placeholder: 'sk-ant-...' },
  gemini: { name: 'Google Gemini', baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai', placeholder: 'AIza...' },
  openrouter: { name: 'OpenRouter', baseUrl: 'https://openrouter.ai/api/v1', placeholder: 'sk-or-v1-...' },
  deepseek: { name: 'DeepSeek', baseUrl: 'https://api.deepseek.com', placeholder: 'sk-...' },
  qwen: { name: 'Tongyi Qwen', baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', placeholder: 'sk-...' },
  zhipu: { name: '智谱 GLM', baseUrl: 'https://open.bigmodel.cn/api/paas/v4', placeholder: 'API Key' },
  yi: { name: '零一万物', baseUrl: 'https://api.lingyiwanwu.com/v1', placeholder: 'API Key' },
  stepfun: { name: '阶跃星辰', baseUrl: 'https://api.stepfun.com/v1', placeholder: 'API Key' },
  baichuan: { name: '百川', baseUrl: 'https://api.baichuan-ai.com/v1', placeholder: 'sk-...' },
  spark: { name: '讯飞星火', baseUrl: 'https://spark-api-open.xf-yun.com/v1', placeholder: 'APIKey:APISecret' },
  hunyuan: { name: '腾讯混元', baseUrl: 'https://api.hunyuan.cloud.tencent.com/v1', placeholder: 'sk-...' },
  siliconflow: { name: '硅基流动', baseUrl: 'https://api.siliconflow.cn/v1', placeholder: 'sk-...' },
  ernie: { name: '百度 ERNIE', baseUrl: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat', placeholder: 'Access Token' },
  doubao: { name: '字节 Doubao', baseUrl: 'https://ark.cn-beijing.volces.com/api/v3', placeholder: 'Token' },
  minimax: { name: 'MiniMax', baseUrl: 'https://api.minimax.chat/v1', placeholder: 'API Key' },
  moonshot: { name: '月之暗面 Kimi', baseUrl: 'https://api.moonshot.cn/v1', placeholder: 'API Key' },
  grok: { name: 'xAI Grok', baseUrl: 'https://api.x.ai/v1', placeholder: 'xai-...' },
  mistral: { name: 'Mistral', baseUrl: 'https://api.mistral.ai/v1', placeholder: 'API Key' },
  groq: { name: 'Groq', baseUrl: 'https://api.groq.com/openai/v1', placeholder: 'gsk_...' },
  together: { name: 'Together AI', baseUrl: 'https://api.together.xyz/v1', placeholder: 'API Key' },
  perplexity: { name: 'Perplexity', baseUrl: 'https://api.perplexity.ai', placeholder: 'pplx-...' },
  cohere: { name: 'Cohere', baseUrl: 'https://api.cohere.ai/compatibility/v1', placeholder: 'API Key' },
  azure: { name: 'Azure OpenAI', baseUrl: '', placeholder: 'Azure Endpoint' },
  ollama: { name: 'Ollama (本地)', baseUrl: 'http://localhost:11434/v1', placeholder: '可留空' },
  custom: { name: '自定义 API', baseUrl: '', placeholder: 'API Key' }
}

// 每个提供商可选的翻译模型列表（仅列代表性常用型号；'custom' 会在 UI 末尾自动追加）
export const MODEL_OPTIONS = {
  openai: [
    { label: 'GPT-4o', value: 'gpt-4o' },
    { label: 'GPT-4o-mini', value: 'gpt-4o-mini' },
    { label: 'GPT-4-Turbo', value: 'gpt-4-turbo-preview' },
    { label: 'GPT-4', value: 'gpt-4' },
    { label: 'GPT-3.5-Turbo', value: 'gpt-3.5-turbo' }
  ],
  anthropic: [
    { label: 'Claude-Sonnet-4.5', value: 'claude-sonnet-4-5' },
    { label: 'Claude-Opus-4.1', value: 'claude-opus-4-1' },
    { label: 'Claude-Haiku-4.5', value: 'claude-haiku-4-5' },
    { label: 'Claude-3.5-Sonnet', value: 'claude-3-5-sonnet-latest' },
    { label: 'Claude-3.5-Haiku', value: 'claude-3-5-haiku-latest' }
  ],
  gemini: [
    { label: 'Gemini-2.0-Flash', value: 'gemini-2.0-flash' },
    { label: 'Gemini-1.5-Pro', value: 'gemini-1.5-pro' },
    { label: 'Gemini-1.5-Flash', value: 'gemini-1.5-flash' }
  ],
  openrouter: [
    { label: 'Auto', value: 'openrouter/auto' },
    { label: 'Claude-Sonnet-4.5', value: 'anthropic/claude-sonnet-4.5' },
    { label: 'Claude-3.5-Sonnet', value: 'anthropic/claude-3.5-sonnet' },
    { label: 'Gemini-2.0-Flash', value: 'google/gemini-2.0-flash-001' },
    { label: 'GPT-4o', value: 'openai/gpt-4o' },
    { label: 'DeepSeek-V3', value: 'deepseek/deepseek-chat' }
  ],
  deepseek: [
    { label: 'DeepSeek-V3', value: 'deepseek-chat' },
    { label: 'DeepSeek-R1', value: 'deepseek-reasoner' }
  ],
  qwen: [
    { label: 'Qwen-Max', value: 'qwen-max' },
    { label: 'Qwen-Plus', value: 'qwen-plus' },
    { label: 'Qwen-Turbo', value: 'qwen-turbo' },
    { label: 'Qwen2.5-72B', value: 'qwen2.5-72b-instruct' }
  ],
  zhipu: [
    { label: 'GLM-4.5', value: 'glm-4.5' },
    { label: 'GLM-4-Plus', value: 'glm-4-plus' },
    { label: 'GLM-4-Air', value: 'glm-4-air' },
    { label: 'GLM-4-Flash', value: 'glm-4-flash' }
  ],
  yi: [
    { label: 'Yi-Lightning', value: 'yi-lightning' },
    { label: 'Yi-Large', value: 'yi-large' },
    { label: 'Yi-Medium', value: 'yi-medium' }
  ],
  stepfun: [
    { label: 'Step-2-16K', value: 'step-2-16k' },
    { label: 'Step-1-32K', value: 'step-1-32k' },
    { label: 'Step-1-8K', value: 'step-1-8k' }
  ],
  baichuan: [
    { label: 'Baichuan4', value: 'Baichuan4' },
    { label: 'Baichuan3-Turbo', value: 'Baichuan3-Turbo' }
  ],
  spark: [
    { label: 'Spark Max', value: 'generalv3.5' },
    { label: 'Spark Pro', value: 'generalv3' },
    { label: 'Spark Lite', value: 'lite' }
  ],
  hunyuan: [
    { label: 'Hunyuan-Pro', value: 'hunyuan-pro' },
    { label: 'Hunyuan-Standard', value: 'hunyuan-standard' },
    { label: 'Hunyuan-Lite', value: 'hunyuan-lite' }
  ],
  siliconflow: [
    { label: 'Qwen2.5-72B', value: 'Qwen/Qwen2.5-72B-Instruct' },
    { label: 'DeepSeek-V3', value: 'deepseek-ai/DeepSeek-V3' },
    { label: 'GLM-4-9B', value: 'THUDM/glm-4-9b-chat' }
  ],
  ernie: [
    { label: 'ERNIE-4.5', value: 'ernie-4.5-8k-preview' },
    { label: 'ERNIE-3.5-8K', value: 'ernie-3.5-8k' }
  ],
  doubao: [
    { label: 'Doubao-Pro-32K', value: 'doubao-pro-32k' },
    { label: 'Doubao-Pro-4K', value: 'doubao-pro-4k' }
  ],
  minimax: [
    { label: 'MiniMax-Text-01', value: 'MiniMax-Text-01' },
    { label: 'abab6.5s', value: 'abab6.5s-chat' }
  ],
  moonshot: [
    { label: 'Kimi-Latest', value: 'kimi-latest' },
    { label: 'Moonshot-V1-32K', value: 'moonshot-v1-32k' },
    { label: 'Moonshot-V1-8K', value: 'moonshot-v1-8k' }
  ],
  grok: [
    { label: 'Grok-3', value: 'grok-3' },
    { label: 'Grok-2-Latest', value: 'grok-2-latest' }
  ],
  mistral: [
    { label: 'Mistral-Large', value: 'mistral-large-latest' },
    { label: 'Mistral-Small', value: 'mistral-small-latest' },
    { label: 'Codestral', value: 'codestral-latest' }
  ],
  groq: [
    { label: 'Llama-3.3-70B', value: 'llama-3.3-70b-versatile' },
    { label: 'Llama-3.1-8B', value: 'llama-3.1-8b-instant' },
    { label: 'Mixtral-8x7B', value: 'mixtral-8x7b-32768' }
  ],
  together: [
    { label: 'Llama-3.3-70B', value: 'meta-llama/Llama-3.3-70B-Instruct-Turbo' },
    { label: 'Qwen2.5-72B', value: 'Qwen/Qwen2.5-72B-Instruct-Turbo' }
  ],
  perplexity: [
    { label: 'Sonar-Pro', value: 'sonar-pro' },
    { label: 'Sonar', value: 'sonar' }
  ],
  cohere: [
    { label: 'Command-R-Plus', value: 'command-r-plus' },
    { label: 'Command-R', value: 'command-r' }
  ],
  ollama: [
    { label: 'Llama 3.2', value: 'llama3.2' },
    { label: 'Qwen2.5', value: 'qwen2.5' },
    { label: 'DeepSeek-R1', value: 'deepseek-r1' }
  ]
}

// translateModel === 'default' 时回退到该提供商的默认模型
export const DEFAULT_MODEL = {
  openai: 'gpt-4o-mini',
  anthropic: 'claude-haiku-4-5',
  gemini: 'gemini-2.0-flash',
  openrouter: 'openrouter/auto',
  deepseek: 'deepseek-chat',
  qwen: 'qwen-plus',
  zhipu: 'glm-4-flash',
  yi: 'yi-lightning',
  stepfun: 'step-1-8k',
  baichuan: 'Baichuan3-Turbo',
  spark: 'generalv3',
  hunyuan: 'hunyuan-standard',
  siliconflow: 'Qwen/Qwen2.5-72B-Instruct',
  ernie: 'ernie-3.5-8k',
  doubao: 'doubao-pro-32k',
  minimax: 'MiniMax-Text-01',
  moonshot: 'moonshot-v1-8k',
  grok: 'grok-2-latest',
  mistral: 'mistral-small-latest',
  groq: 'llama-3.3-70b-versatile',
  together: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
  perplexity: 'sonar',
  cohere: 'command-r',
  azure: 'gpt-4o-mini',
  ollama: 'llama3.2'
}
