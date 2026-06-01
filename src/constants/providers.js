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

// 每个提供商可选的翻译模型列表（保留近两代主力 + 推理模型；'custom' 会在 UI 末尾自动追加）
// 注：模型 ID 截至 2026-01；如官方又有新版本，可在设置面板选「自定义」手填
export const MODEL_OPTIONS = {
  openai: [
    { label: 'GPT-5', value: 'gpt-5' },
    { label: 'GPT-5-mini', value: 'gpt-5-mini' },
    { label: 'GPT-5-nano', value: 'gpt-5-nano' },
    { label: 'GPT-4.1', value: 'gpt-4.1' },
    { label: 'GPT-4.1-mini', value: 'gpt-4.1-mini' },
    { label: 'o4-mini (推理)', value: 'o4-mini' },
    { label: 'o3 (推理)', value: 'o3' },
    { label: 'o3-mini (推理)', value: 'o3-mini' },
    { label: 'GPT-4o', value: 'gpt-4o' },
    { label: 'GPT-4o-mini', value: 'gpt-4o-mini' }
  ],
  anthropic: [
    { label: 'Claude Opus 4.7', value: 'claude-opus-4-7' },
    { label: 'Claude Sonnet 4.6', value: 'claude-sonnet-4-6' },
    { label: 'Claude Haiku 4.5', value: 'claude-haiku-4-5-20251001' },
    { label: 'Claude Sonnet 4.5', value: 'claude-sonnet-4-5' },
    { label: 'Claude Opus 4.1', value: 'claude-opus-4-1' },
    { label: 'Claude 3.5 Sonnet', value: 'claude-3-5-sonnet-latest' },
    { label: 'Claude 3.5 Haiku', value: 'claude-3-5-haiku-latest' }
  ],
  gemini: [
    { label: 'Gemini 2.5 Pro', value: 'gemini-2.5-pro' },
    { label: 'Gemini 2.5 Flash', value: 'gemini-2.5-flash' },
    { label: 'Gemini 2.5 Flash-Lite', value: 'gemini-2.5-flash-lite' },
    { label: 'Gemini 2.0 Flash', value: 'gemini-2.0-flash' },
    { label: 'Gemini 1.5 Pro', value: 'gemini-1.5-pro' }
  ],
  openrouter: [
    { label: 'Auto', value: 'openrouter/auto' },
    { label: 'Claude Opus 4.7', value: 'anthropic/claude-opus-4.7' },
    { label: 'Claude Sonnet 4.6', value: 'anthropic/claude-sonnet-4.6' },
    { label: 'Claude Haiku 4.5', value: 'anthropic/claude-haiku-4.5' },
    { label: 'GPT-5', value: 'openai/gpt-5' },
    { label: 'GPT-5-mini', value: 'openai/gpt-5-mini' },
    { label: 'Gemini 2.5 Pro', value: 'google/gemini-2.5-pro' },
    { label: 'Grok 4', value: 'x-ai/grok-4' },
    { label: 'DeepSeek V3', value: 'deepseek/deepseek-chat' },
    { label: 'DeepSeek R1', value: 'deepseek/deepseek-r1' },
    { label: 'Llama 4 Maverick', value: 'meta-llama/llama-4-maverick' },
    { label: 'Qwen3 235B', value: 'qwen/qwen3-235b-a22b' }
  ],
  deepseek: [
    { label: 'DeepSeek V3', value: 'deepseek-chat' },
    { label: 'DeepSeek R1 (推理)', value: 'deepseek-reasoner' }
  ],
  qwen: [
    { label: 'Qwen3-Max', value: 'qwen3-max' },
    { label: 'Qwen3-235B-A22B', value: 'qwen3-235b-a22b' },
    { label: 'Qwen3-30B-A3B', value: 'qwen3-30b-a3b' },
    { label: 'QwQ-Plus (推理)', value: 'qwq-plus' },
    { label: 'Qwen-Max', value: 'qwen-max-latest' },
    { label: 'Qwen-Plus', value: 'qwen-plus-latest' },
    { label: 'Qwen-Turbo', value: 'qwen-turbo-latest' }
  ],
  zhipu: [
    { label: 'GLM-4.6', value: 'glm-4.6' },
    { label: 'GLM-4.5', value: 'glm-4.5' },
    { label: 'GLM-4.5-Air', value: 'glm-4.5-air' },
    { label: 'GLM-4-Plus', value: 'glm-4-plus' },
    { label: 'GLM-Z1-Air (推理)', value: 'glm-z1-air' },
    { label: 'GLM-4-Flash', value: 'glm-4-flash' }
  ],
  yi: [
    { label: 'Yi-Lightning', value: 'yi-lightning' },
    { label: 'Yi-Large', value: 'yi-large' },
    { label: 'Yi-Medium', value: 'yi-medium' }
  ],
  stepfun: [
    { label: 'Step-2-16K', value: 'step-2-16k' },
    { label: 'Step-2-Mini', value: 'step-2-mini' },
    { label: 'Step-1-32K', value: 'step-1-32k' },
    { label: 'Step-1-Flash', value: 'step-1-flash' }
  ],
  baichuan: [
    { label: 'Baichuan4-Turbo', value: 'Baichuan4-Turbo' },
    { label: 'Baichuan4-Air', value: 'Baichuan4-Air' },
    { label: 'Baichuan4', value: 'Baichuan4' },
    { label: 'Baichuan3-Turbo', value: 'Baichuan3-Turbo' }
  ],
  spark: [
    { label: 'Spark 4.0 Ultra', value: '4.0Ultra' },
    { label: 'Spark Max', value: 'generalv3.5' },
    { label: 'Spark Pro', value: 'generalv3' },
    { label: 'Spark Lite', value: 'lite' }
  ],
  hunyuan: [
    { label: 'Hunyuan-TurboS', value: 'hunyuan-turbos-latest' },
    { label: 'Hunyuan-Turbo', value: 'hunyuan-turbo' },
    { label: 'Hunyuan-Pro', value: 'hunyuan-pro' },
    { label: 'Hunyuan-Standard', value: 'hunyuan-standard' },
    { label: 'Hunyuan-Lite', value: 'hunyuan-lite' }
  ],
  siliconflow: [
    { label: 'DeepSeek V3', value: 'deepseek-ai/DeepSeek-V3' },
    { label: 'DeepSeek R1', value: 'deepseek-ai/DeepSeek-R1' },
    { label: 'Qwen3-235B', value: 'Qwen/Qwen3-235B-A22B' },
    { label: 'Qwen2.5-72B', value: 'Qwen/Qwen2.5-72B-Instruct' },
    { label: 'GLM-4-9B', value: 'THUDM/glm-4-9b-chat' }
  ],
  ernie: [
    { label: 'ERNIE-X1-Turbo (推理)', value: 'ernie-x1-turbo-32k' },
    { label: 'ERNIE-4.5-Turbo', value: 'ernie-4.5-turbo-128k' },
    { label: 'ERNIE-4.5', value: 'ernie-4.5-8k-preview' },
    { label: 'ERNIE-3.5-8K', value: 'ernie-3.5-8k' }
  ],
  doubao: [
    { label: 'Doubao-1.5-Pro-32K', value: 'doubao-1-5-pro-32k' },
    { label: 'Doubao-1.5-Pro-256K', value: 'doubao-1-5-pro-256k' },
    { label: 'Doubao-1.5-Lite-32K', value: 'doubao-1-5-lite-32k' },
    { label: 'Doubao-Pro-32K', value: 'doubao-pro-32k' }
  ],
  minimax: [
    { label: 'MiniMax-M1 (推理)', value: 'MiniMax-M1' },
    { label: 'MiniMax-Text-01', value: 'MiniMax-Text-01' },
    { label: 'abab7-chat', value: 'abab7-chat-preview' },
    { label: 'abab6.5s', value: 'abab6.5s-chat' }
  ],
  moonshot: [
    { label: 'Kimi K2', value: 'kimi-k2-0711-preview' },
    { label: 'Kimi-Latest', value: 'kimi-latest' },
    { label: 'Moonshot-V1-128K', value: 'moonshot-v1-128k' },
    { label: 'Moonshot-V1-32K', value: 'moonshot-v1-32k' }
  ],
  grok: [
    { label: 'Grok 4', value: 'grok-4' },
    { label: 'Grok 4 Fast', value: 'grok-4-fast' },
    { label: 'Grok 3', value: 'grok-3' },
    { label: 'Grok 3 Mini', value: 'grok-3-mini' }
  ],
  mistral: [
    { label: 'Mistral Large', value: 'mistral-large-latest' },
    { label: 'Mistral Medium', value: 'mistral-medium-latest' },
    { label: 'Mistral Small', value: 'mistral-small-latest' },
    { label: 'Magistral (推理)', value: 'magistral-medium-latest' },
    { label: 'Codestral', value: 'codestral-latest' }
  ],
  groq: [
    { label: 'Llama 4 Maverick', value: 'meta-llama/llama-4-maverick-17b-128e-instruct' },
    { label: 'Llama 4 Scout', value: 'meta-llama/llama-4-scout-17b-16e-instruct' },
    { label: 'Llama 3.3 70B', value: 'llama-3.3-70b-versatile' },
    { label: 'Qwen3-32B', value: 'qwen/qwen3-32b' },
    { label: 'DeepSeek R1 Distill', value: 'deepseek-r1-distill-llama-70b' }
  ],
  together: [
    { label: 'Llama 4 Maverick', value: 'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8' },
    { label: 'Llama 3.3 70B', value: 'meta-llama/Llama-3.3-70B-Instruct-Turbo' },
    { label: 'Qwen3-235B', value: 'Qwen/Qwen3-235B-A22B-fp8-tput' },
    { label: 'DeepSeek V3', value: 'deepseek-ai/DeepSeek-V3' },
    { label: 'DeepSeek R1', value: 'deepseek-ai/DeepSeek-R1' }
  ],
  perplexity: [
    { label: 'Sonar Pro', value: 'sonar-pro' },
    { label: 'Sonar', value: 'sonar' },
    { label: 'Sonar Reasoning Pro', value: 'sonar-reasoning-pro' },
    { label: 'Sonar Reasoning', value: 'sonar-reasoning' }
  ],
  cohere: [
    { label: 'Command A', value: 'command-a-03-2025' },
    { label: 'Command R+ 08-2024', value: 'command-r-plus-08-2024' },
    { label: 'Command R 08-2024', value: 'command-r-08-2024' }
  ],
  ollama: [
    { label: 'Llama 3.3', value: 'llama3.3' },
    { label: 'Qwen3', value: 'qwen3' },
    { label: 'Qwen2.5', value: 'qwen2.5' },
    { label: 'DeepSeek-R1', value: 'deepseek-r1' },
    { label: 'GLM-4', value: 'glm4' }
  ]
}

// translateModel === 'default' 时回退到该提供商的默认模型（统一选「中档性价比」型号）
export const DEFAULT_MODEL = {
  openai: 'gpt-5-mini',
  anthropic: 'claude-haiku-4-5-20251001',
  gemini: 'gemini-2.5-flash',
  openrouter: 'openrouter/auto',
  deepseek: 'deepseek-chat',
  qwen: 'qwen-plus-latest',
  zhipu: 'glm-4.5-air',
  yi: 'yi-lightning',
  stepfun: 'step-2-mini',
  baichuan: 'Baichuan4-Air',
  spark: 'generalv3.5',
  hunyuan: 'hunyuan-turbo',
  siliconflow: 'Qwen/Qwen3-235B-A22B',
  ernie: 'ernie-4.5-turbo-128k',
  doubao: 'doubao-1-5-pro-32k',
  minimax: 'MiniMax-Text-01',
  moonshot: 'moonshot-v1-32k',
  grok: 'grok-4-fast',
  mistral: 'mistral-small-latest',
  groq: 'llama-3.3-70b-versatile',
  together: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
  perplexity: 'sonar',
  cohere: 'command-r-08-2024',
  azure: 'gpt-4o-mini',
  ollama: 'llama3.3'
}
