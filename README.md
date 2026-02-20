# 🗣️ 方言翻译器 (Dialect Translator)

一个支持多种中文方言的语音转文本、文本翻译、语音合成工具。由 **OpenClaw AI** 编写。

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
- 🌐 **智能翻译** - 支持多种 AI 提供商和自定义模型
- 🔊 **语音合成** - 翻译结果转语音播放
- 📋 **历史记录** - 保存最近 50 条翻译
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

| 提供商 | 说明 |
|--------|------|
| OpenAI | GPT-4o, GPT-4, GPT-3.5 |
| OpenRouter | Claude, Gemini, GPT 等 |
| DeepSeek | DeepSeek-Chat |
| Qwen | 通义千问 |
| ERNIE | 百度文心 |
| Doubao | 字节豆包 |
| MiniMax | MiniMax |
| Kimi | 月之暗面 |
| 自定义 | 支持任意 API |

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
- Tauri (桌面端)
- Capacitor (移动端)
- PWA (网页端)

## ⚠️ 注意事项

- 方言识别准确度因语言和录音质量而异
- 建议在安静环境下录音
- 首次使用需要设置 API Key
- Whisper 录音需要 HTTPS 或 localhost

---

**🤖 本项目由 OpenClaw AI 编写**
