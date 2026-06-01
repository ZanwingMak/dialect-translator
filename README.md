# 🗣️ 方言翻译器 (Dialect Translator)

一个支持多种中文方言的语音转文本、文本翻译、语音合成工具。

## ✨ 支持的语言/方言

### 主流方言
- 🏠 **雷州话** - 广东雷州半岛
- 🇭🇰 **粤语** - 广东/香港
- 🗣️ **客家话** - 梅州/惠州
- 🇹🇼 **闽南语** - 福建/台湾
- 🌊 **潮汕话** - 广东潮汕
- 🇸🇬 **吴语** - 上海/浙江
- 🇨🇳 **湘语** - 湖南
- 🇨🇳 **赣语** - 江西
- 🏮 **江淮话** - 江苏/安徽
- 🏯 **晋语** - 山西
- 🏯 **徽语** - 安徽
- 🏔️ **东北话** - 东北三省
- 🏯 **北京话** - 北京
- 🏯 **山东话** - 山东
- 🌶️ **四川话** - 四川

### 标准语言
- 🇨🇳 **普通话** - 标准中文

## ✨ 功能特点

- 🎙️ **语音识别** - 支持 Whisper API 或浏览器原生识别
- 🌐 **智能翻译** - 支持 20+ AI 提供商和自定义模型
- 🔊 **语音合成** - 翻译结果转语音播放
- 📋 **历史记录** - 保存最近 50 条翻译，支持单条删除
- 🔒 **本地存储** - API Key 保存在浏览器本地
- 📱 **跨平台** - 支持 Web、iOS、Android、桌面端

## 🚀 快速开始

### 安装依赖

```bash
cd dialect-translator
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3003

> 如需 HTTPS（真机调试麦克风），在项目根目录放置 `key.pem` 与 `cert.pem`，dev server 会自动启用 HTTPS；否则降级 HTTP。

### 生产构建

```bash
npm run build
```

### 桌面端 (macOS)

```bash
npx tauri build
```

### 移动端 (iOS/Android)

```bash
npx cap sync ios    # 或 android
npx cap open ios    # 用 Xcode 打开
```

## 📋 支持的 AI 提供商

### 海外
| 提供商 | 代表模型 |
|--------|------|
| OpenAI | GPT-5 / GPT-5-mini / GPT-4.1 / o3 / o4-mini |
| Anthropic Claude | Claude Opus 4.7 / Sonnet 4.6 / Haiku 4.5 |
| Google Gemini | Gemini 2.5 Pro / Flash / Flash-Lite |
| xAI Grok | Grok 4 / Grok 4 Fast / Grok 3 |
| Mistral | Mistral Large / Medium / Magistral / Codestral |
| Groq | Llama 4 Maverick / Scout / Llama 3.3 / Qwen3 |
| Together AI | Llama 4 / Llama 3.3 / Qwen3-235B / DeepSeek V3/R1 |
| Perplexity | Sonar Pro / Sonar Reasoning Pro |
| Cohere | Command A / Command R+ |
| OpenRouter | 路由 Claude 4.7 / GPT-5 / Gemini 2.5 / Grok 4 / Llama 4 等 |

### 国内
| 提供商 | 代表模型 |
|--------|------|
| DeepSeek | DeepSeek V3 / R1 (推理) |
| 通义千问 Qwen | Qwen3-Max / Qwen3-235B / QwQ-Plus (推理) |
| 智谱 GLM | GLM-4.6 / GLM-4.5 / GLM-Z1-Air (推理) |
| 零一万物 | Yi-Lightning / Large |
| 阶跃星辰 | Step-2-16K / Step-2-Mini |
| 百川 | Baichuan4-Turbo / Baichuan4-Air |
| 讯飞星火 | Spark 4.0 Ultra / Max / Pro |
| 腾讯混元 | Hunyuan-TurboS / Turbo / Pro |
| 硅基流动 | DeepSeek V3/R1 / Qwen3-235B |
| 百度 ERNIE | ERNIE-X1-Turbo (推理) / 4.5-Turbo |
| 字节 Doubao | Doubao-1.5-Pro 32K/256K / Lite |
| MiniMax | MiniMax-M1 (推理) / Text-01 / abab7 |
| 月之暗面 Kimi | Kimi K2 / Moonshot-V1 128K/32K |

### 其它
| 提供商 | 说明 |
|--------|------|
| Azure OpenAI | 自定义端点 |
| Ollama | 本地部署 Llama 3.3 / Qwen3 / DeepSeek-R1 等（默认 http://localhost:11434） |
| 自定义 API | 任意 OpenAI 兼容端点 |

## 📋 使用说明

1. **设置 API Key**
   - 选择 AI 提供商并填写对应的 API Key
   - 支持自定义 API 地址和模型名称

2. **选择语言**
   - 从下拉菜单选择源语言和目标语言
   - 点击 ⇄ 按钮快速交换语言

3. **录音翻译**
   - 点击 🎤 按钮开始录音
   - 再次点击 ⏸️ 按钮停止录音
   - 自动识别文字并翻译

4. **语音播放**
   - 点击 🔊 按钮播放翻译结果

## 🛠️ 技术栈

- Vue 3 + Vite
- TailwindCSS
- OpenAI API (Whisper + GPT + TTS)
- Anthropic Messages API（Claude 原生）
- Tauri (桌面端)
- Capacitor (移动端)
- PWA (网页端)

## ⚠️ 注意事项

- 方言识别准确度因语言和录音质量而异
- 建议在安静环境下录音
- 首次使用需要设置 API Key
- Whisper 录音需要 HTTPS 或 localhost
- 从浏览器直接调用 Anthropic API 走 `anthropic-dangerous-direct-browser-access`，仅推荐在桌面端 / 受信场景使用；生产环境建议加自有后端代理

---

**🤖 由 Claude（Anthropic Claude Code）协助开发**
