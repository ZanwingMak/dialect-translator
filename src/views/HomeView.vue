<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 p-4">
    <div class="max-w-lg mx-auto">
      <!-- 语言选择器 -->
      <div class="flex gap-2 mb-4">
        <div class="flex-1">
          <label class="text-white/70 text-xs block mb-1">源语言</label>
          <select 
            v-model="sourceLanguage"
            class="w-full px-3 py-2 rounded-lg bg-white/20 text-white text-sm"
          >
            <option v-for="lang in languages" :key="lang.id" :value="lang.id">{{ lang.name }}</option>
          </select>
        </div>
        <div class="flex items-center justify-center pt-5">
          <span class="text-white text-xl">→</span>
        </div>
        <div class="flex-1">
          <label class="text-white/70 text-xs block mb-1">目标语言</label>
          <select 
            v-model="targetLanguage"
            class="w-full px-3 py-2 rounded-lg bg-white/20 text-white text-sm"
          >
            <option v-for="lang in languages" :key="lang.id" :value="lang.id">{{ lang.name }}</option>
          </select>
        </div>
      </div>

      <!-- 标题 -->
      <header class="text-center mb-6">
        <h1 class="text-4xl font-bold text-white mb-2">🗣️ {{ currentLanguagePair }}</h1>
        <p class="text-white/80">语音转文本 · 文本翻译 · 语音合成</p>
      </header>

      <!-- 主卡片 -->
      <div class="glass rounded-3xl p-6 shadow-2xl">
        <!-- 录音控制 -->
        <div class="flex flex-col items-center mb-6">
          <!-- 录音按钮 -->
          <button 
            @click="startVoiceInput"
            class="relative w-36 h-36 rounded-full transition-all shadow-xl"
            :class="isRecording ? 'bg-red-500 scale-95' : 'bg-white'"
          >
            <span class="text-6xl">{{ isRecording ? '🔴' : '🎤' }}</span>
            <div v-if="isRecording" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full animate-ping"></div>
          </button>
          
          <!-- 录音时间/状态 -->
          <div v-if="isRecording || isWebSpeechListening" class="mt-4 text-center">
            <span class="text-3xl font-bold text-white">{{ recordingTime }}</span>
            <span class="text-white/60 ml-1">秒</span>
            <p class="text-white/80 text-sm mt-1">{{ statusMessage }}</p>
          </div>
        </div>

        <!-- 源语言输入区 -->
        <div class="mb-4">
          <div class="flex justify-between items-center mb-2">
            <label class="text-white/80 text-sm">🎙️ {{ sourceLanguageName }}</label>
            <span v-if="sourceText.length > 0" class="text-white/50 text-xs">{{ sourceText.length }}字</span>
          </div>
          <textarea 
            v-model="sourceText"
            :placeholder="`点击🎤录音，或直接输入${sourceLanguageName}...`"
            class="w-full h-28 p-4 rounded-xl bg-white/10 text-white placeholder-white/40 focus:outline-none resize-none transition-all focus:bg-white/15"
          ></textarea>
          <div class="flex gap-2 mt-2">
            <button 
              @click="playSourceVoice"
              :disabled="!sourceAudioUrl"
              class="flex-1 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-40"
            >
              🔊 播放
            </button>
            <button 
              @click="copyText(sourceText)"
              class="flex-1 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20"
            >
              📋 复制
            </button>
          </div>
        </div>

        <!-- 翻译按钮 -->
        <button 
          @click="translateText(sourceText)"
          :disabled="!sourceText.trim() || isTranslating"
          class="w-full py-4 btn-gradient text-white font-bold text-lg rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isTranslating">⏳ 翻译中...</span>
          <span v-else>🌐 翻译成 {{ targetLanguageName }}</span>
        </button>

        <!-- 翻译结果 -->
        <div v-if="translatedText" class="mt-4">
          <label class="text-white/80 text-sm mb-2 block">📝 {{ targetLanguageName }}</label>
          <div class="bg-white/10 rounded-xl p-4">
            <p class="text-white text-lg leading-relaxed">{{ translatedText }}</p>
          </div>
          <div class="flex gap-2 mt-2">
            <button 
              @click="playTargetVoice"
              :disabled="!targetAudioUrl"
              class="flex-1 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-40"
            >
              🔊 播放
            </button>
            <button 
              @click="copyText(translatedText)"
              class="flex-1 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20"
            >
              📋 复制
            </button>
          </div>
        </div>
      </div>

      <!-- 快捷设置栏 -->
      <div class="mt-4 flex gap-2 overflow-x-auto pb-2">
        <button 
          @click="showSettings = !showSettings"
          class="flex-shrink-0 px-4 py-2 bg-white/20 text-white rounded-full text-sm"
        >
          ⚙️ 设置
        </button>
        <button 
          v-if="history.length > 0"
          @click="clearHistory"
          class="flex-shrink-0 px-4 py-2 bg-white/10 text-white/70 rounded-full text-sm"
        >
          🗑️ 清空历史
        </button>
      </div>

      <!-- 历史记录 -->
      <div v-if="history.length > 0" class="mt-4">
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-white font-semibold">📋 历史记录 ({{ history.length }})</h3>
        </div>
        <div class="space-y-2 max-h-64 overflow-y-auto pr-2">
          <div 
            v-for="item in history" 
            :key="item.id"
            @click="loadHistory(item)"
            class="glass rounded-xl p-3 cursor-pointer hover:bg-white/20 transition-all"
          >
            <div class="flex items-center gap-2 mb-1">
              <span class="text-white/60 text-xs">{{ getLanguageName(item.sourceLang) }}</span>
              <span class="text-white/40">→</span>
              <span class="text-white/60 text-xs">{{ getLanguageName(item.targetLang) }}</span>
            </div>
            <p class="text-white text-sm">{{ item.source }}</p>
            <p class="text-white/60 text-xs mt-1 truncate">{{ item.target }}</p>
            <p class="text-white/30 text-xs mt-1">{{ formatTime(item.timestamp) }}</p>
          </div>
        </div>
      </div>

      <!-- 设置卡片 -->
      <div class="mt-6 glass rounded-xl p-4">
        <div @click="showSettings = !showSettings" class="flex items-center justify-between cursor-pointer">
          <h3 class="text-white font-semibold">⚙️ 设置</h3>
          <span class="text-white/60">{{ showSettings ? '▼' : '▶' }}</span>
        </div>
        
        <div v-if="showSettings" class="mt-4 space-y-4">
          <!-- API 提供商选择 -->
          <div>
            <label class="text-white/70 text-sm block mb-2">翻译 API</label>
            <select 
              v-model="config.provider"
              @change="onProviderChange"
              class="w-full px-3 py-2 rounded-lg bg-white/10 text-white text-sm"
            >
              <option value="openai">OpenAI</option>
              <option value="openrouter">OpenRouter</option>
              <option value="deepseek">DeepSeek</option>
              <option value="qwen">Tongyi Qwen</option>
              <option value="ernie">ERNIE</option>
              <option value="doubao">Doubao</option>
              <option value="minimax">MiniMax</option>
              <option value="moonshot">Kimi</option>
              <option value="azure">Azure</option>
              <option value="custom">自定义 API</option>
            </select>
          </div>

          <!-- API Key -->
          <div>
            <label class="text-white/70 text-sm block mb-2">API Key</label>
            <input 
              v-model="config.apiKey"
              type="password"
              :placeholder="providerPlaceholder"
              class="w-full px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/40 text-sm"
            />
          </div>

          <!-- 翻译模型 -->
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="text-white/70 text-xs block mb-1">翻译模型</label>
              <select 
                v-model="config.translateModel"
                class="w-full px-2 py-2 rounded-lg bg-white/10 text-white text-xs"
              >
                <option v-for="m in translateModels" :key="m.value" :value="m.value">{{ m.label }}</option>
              </select>
            </div>
            <div>
              <label class="text-white/70 text-xs block mb-1">语音识别</label>
              <select 
                v-model="config.whisperModel"
                class="w-full px-2 py-2 rounded-lg bg-white/10 text-white text-xs"
              >
                <option value="webspeech">浏览器</option>
                <option value="whisper-1">Whisper</option>
              </select>
            </div>
          </div>

          <!-- 状态 -->
          <div class="flex items-center justify-between text-xs">
            <span class="text-white/50">{{ providerLabel }}</span>
            <button 
              @click="testApiKey"
              :disabled="!config.apiKey"
              class="text-blue-300 hover:text-blue-200"
            >
              测试
            </button>
          </div>
        </div>
      </div>
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
import { ref, reactive, watch, onUnmounted, onMounted, nextTick, computed } from 'vue'

// 语言配置
const languages = [
  // 主流方言
  { id: 'leizhou', name: '雷州话', region: '广东雷州', family: '闽南语', isDialect: true },
  { id: 'cantonese', name: '粤语', region: '广东/香港', family: '粤语', isDialect: true },
  { id: 'hakka', name: '客家话', region: '梅州/惠州', family: '客家话', isDialect: true },
  { id: 'minnan', name: '闽南语', region: '福建/台湾', family: '闽南语', isDialect: true },
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
  // 标准语言
  { id: 'mandarin', name: '普通话', region: '全国', family: '官话', isDialect: false },
  { id: 'custom', name: '自定义', region: '', family: '', isDialect: true }
]

// 当前选择的语言
const sourceLanguage = ref('leizhou')
const targetLanguage = ref('mandarin')

// 语言名称计算属性
const sourceLanguageName = computed(() => {
  const lang = languages.find(l => l.id === sourceLanguage.value)
  return lang?.name || '源语言'
})

const targetLanguageName = computed(() => {
  const lang = languages.find(l => l.id === targetLanguage.value)
  return lang?.name || '目标语言'
})

const currentLanguagePair = computed(() => {
  return `${sourceLanguageName.value} → ${targetLanguageName.value}`
})

// 词汇对照表
const dialectVocabulary = {
  leizhou: {
    name: '雷州话',
    description: '雷州话是闽南语的一种变体，主要分布在广东省雷州半岛地区。',
    vocabulary: {
      pronouns: {
        '我': '瓦 (wa)',
        '你': '汝 (ru) / 鲁 (lu)',
        '他/她/它': '伊 (i)',
        '我们': '瓦们 (wa men)',
        '你们': '汝们 (ru men)',
        '他们': '伊们 (i men)'
      },
      commonWords: {
        '吃': '食 (zia)',
        '喝': '呷 (hab)',
        '说': '讲 (gong)',
        '走': '行 (gian)',
        '跑': '走 (zao)',
        '来': '来 (lai)',
        '去': '去 (ki)',
        '看': '看 (kang)',
        '听': '听 (teng)',
        '知道': '知影 (zi iang)',
        '不知道': '不知 (bu zi)',
        '喜欢': '希罕 (hi hang)',
        '厉害': '大发 (da hua)',
        '舒服': '恬意 (diam yi)',
        '辛苦': '艰苦 (gan ku)',
        '多少钱': '几钱 (gi zien)',
        '便宜': '俗 (siou)',
        '贵': '贵 (gui)',
        '是': '是 (di)',
        '不是': '无是 (wu di)',
        '有': '有 (wu)',
        '没有': '无 (wu)',
        '什么': '乜嘢 (mih ye)',
        '哪里': '块 (doi)',
        '这里': '只块 (zi doi)',
        '那里': '许块 (hi doi)',
        '什么时候': '几时 (gi xi)',
        '为什么': '为什么 (ui mih)',
        '全部': '拢总 (long zong)',
        '只/仅仅': '干干 (gang gang)',
        '已经': '规格 (gui ge)',
        '现在': '只阵 (zi den)',
        '等一下': '等阵 (dang den)',
        '太/很': '野 (ya)',
        '不': '无 (wu)',
        '很/非常': '好 (hou)',
        '不要': '莫 (moh)'
      },
      questionPatterns: {
        '吃了吗': '食未 (zia bue)',
        '去了吗': '去未 (ki bue)',
        '去了没有': '去无 (ki wu)',
        '你去哪里': '去块 (ki doi)',
        '你在做什么': '汝在做乜嘢 (ru zai zuo mih ye)',
        '你吃了吗': '汝食未 (ru zia bue)'
      },
      timeExpressions: {
        '今天': '今旦 (gim dan)',
        '明天': '明日 (mang rit)',
        '昨天': '昨日 (za rit)',
        '早上': '早起 (za kai)',
        '中午': '日斗 (rit dao)',
        '晚上': '暝昏 (mang hung)'
      },
      dailyExpressions: {
        '谢谢': '感谢 (gam sia)',
        '对不起': '对不住 (dui bu ziu)',
        '没关系': '无相干 (wu xiang gang)',
        '再见': '再会 (zai hui)',
        '晚安': '暝安 (mang ang)',
        '早安': '早起安 (za kai ang)'
      }
    }
  },
  cantonese: {
    name: '粤语',
    description: '粤语又称广东话，主要分布在广东省、广西壮族自治区、香港、澳门等地。',
    vocabulary: {
      pronouns: {
        '我': '我 (ngo)',
        '你': '你 (nei)',
        '他/她/它': '佢 (keoi)',
        '我们': '我哋 (ngo dei)',
        '你们': '你哋 (nei dei)',
        '他们': '佢哋 (keoi dei)'
      },
      commonWords: {
        '吃': '食 (sik)',
        '喝': '饮 (yam)',
        '说': '讲 (gong)',
        '走': '行 (haang)',
        '跑': '走 (zau)',
        '来': '嚟 (lai)',
        '去': '去 (heoi)',
        '看': '睇 (tai)',
        '听': '听 (ting)',
        '知道': '知 (zi)',
        '不知道': '唔知 (m zi)',
        '喜欢': '鍾意 (zung yi)',
        '厉害': '犀利 (sai lei)',
        '舒服': '舒服 (syu fuk)',
        '辛苦': '辛苦 (san fu)',
        '多少钱': '几多钱 (gei do cin)',
        '便宜': '抵 (dai)',
        '贵': '贵 (gwai)',
        '是': '係 (hai)',
        '不是': '唔係 (m hai)',
        '有': '有 (yau)',
        '没有': '冇 (mou)',
        '什么': '咩 (me)',
        '哪里': '邊度 (bin dou)',
        '这里': '呢度 (nei dou)',
        '那里': '嗰度 (go dou)',
        '什么时候': '幾時 (gei si)',
        '为什么': '點解 (di gai)',
        '全部': '全部 (cyun bou)',
        '只/仅仅': '只 (zi)',
        '已经': '已經 (yi ging)',
        '现在': '現在 (jin zoi)',
        '等一下': '等陣 (dang zan)',
        '太/很': '好 (hou)',
        '不': '唔 (m)',
        '很/非常': '好 (hou)',
        '不要': '唔要 (m yiu)'
      },
      questionPatterns: {
        '吃了吗': '食咗未 (sik zo mei)',
        '去了吗': '去咗未 (heoi zo mei)',
        '去了没有': '去咗未 (heoi zo mei)',
        '你去哪里': '你去邊度 (nei bin dou)',
        '你在做什么': '你做緊咩 (nei zau gan me)',
        '你吃了吗': '你食咗未 (nei sik zo mei)'
      },
      timeExpressions: {
        '今天': '今日 (gam jat)',
        '明天': '聽日 (ting jat)',
        '昨天': '琴日 (kam jat)',
        '早上': '朝早 (zau zou)',
        '中午': '中午 (jung ng)',
        '晚上': '夜晚 (ye man)'
      },
      dailyExpressions: {
        '谢谢': '多謝 (do ze)',
        '对不起': '對唔住 (dui m zyu)',
        '没关系': '冇所謂 (mou so wai)',
        '再见': '再見 (zai gin)',
        '晚安': '晚安 (man on)',
        '早安': '早晨 (zou san)'
      }
    }
  },
  hakka: {
    name: '客家话',
    description: '客家话是客家人的母语，主要分布在广东、福建、江西、广西、台湾等地。',
    vocabulary: {
      pronouns: {
        '我': '𠊎 (ngai)',
        '你': '你 (n)',
        '他/她/它': '佢 (ki)',
        '我们': '𠊎兜 (ngai deu)',
        '你们': '你兜 (n deu)',
        '他们': '佢兜 (ki deu)'
      },
      commonWords: {
        '吃': '食 (shi)',
        '喝': '啉 (lim)',
        '说': '讲 (gong)',
        '行': '行 (hang)',
        '走': '走 (ziu)',
        '来': '来 (loi)',
        '去': '去 (hi)',
        '看': '看 (kon)',
        '听': '听 (tin)',
        '知道': '知 (di)',
        '不知道': '毋知 (m di)',
        '喜欢': '欢喜 (fon hi)',
        '厉害': '利害 (li ho)',
        '舒服': '舒服 (su fu)',
        '辛苦': '辛苦 (xin ku)',
        '多少钱': '几多钱 (gi do cien)',
        '便宜': '便宜 (pien yi)',
        '贵': '贵 (gui)',
        '是': '係 (he)',
        '不是': '毋係 (m he)',
        '有': '有 (yu)',
        '没有': '无 (mo)',
        '咩': '乜 (m)',
        '哪里': '哪位 (na vi)',
        '这里': '只位 (zhi vi)',
        '那里': '嗰位 (go vi)',
        '什么时候': '几时 (gi shi)',
        '为什么': '做嘛 (zo ma)',
        '全部': '全部 (cien bu)',
        '只/仅仅': '单净 (dan qia)',
        '已经': '已经 (yi kin)',
        '现在': '今下 (gim ha)',
        '等一下': '等一下 (dan yi ha)',
        '太/很': '死 (si)',
        '不': '毋 (m)',
        '很/非常': '蛮 (man)',
        '不要': '毋爱 (m oi)'
      },
      questionPatterns: {
        '吃了吗': '食吂 (shi bai)',
        '去了吗': '去吂 (hi bai)',
        '去了没有': '去吂 (hi bai)',
        '你去哪里': '你去哪里 (n hi na vi)',
        '你在做什么': '你做嘛 (n zo ma)',
        '你吃了吗': '你食吂 (n shi bai)'
      },
      timeExpressions: {
        '今天': '今日 (gim ng)',
        '明天': '天光日 (tian gong ng)',
        '昨日': '秋晡日 (qiu bu ng)',
        '早上': '朝晨 (zau shin)',
        '中午': '当昼 (dang zhu)',
        '晚上': '夜晡 (ya bu)'
      },
      dailyExpressions: {
        '谢谢': '感谢 (gam sia)',
        '对不起': '对不起 (dui m hi)',
        '没关系': '毋相干 (m xiong gon)',
        '再见': '再会 (zai fi)',
        '晚安': '夜安 (ya on)',
        '早安': '朝安 (zau on)'
      }
    }
  },
  minnan: {
    name: '闽南语',
    description: '闽南语主要分布在福建省南部、台湾省、广东省潮汕地区及东南亚华人社区。',
    vocabulary: {
      pronouns: {
        '我': '我 (goa)',
        '你': '你 (li)',
        '他/她/它': '伊 (i)',
        '我们': '阮 (guan)',
        '你们': '你们 (lin)',
        '他们': '𪜶 (in)'
      },
      commonWords: {
        '吃': '食 (tsiah)',
        '喝': '饮 (lim)',
        '说': '讲 (kng)',
        '走': '行 (kiânn)',
        '跑': '走 (tsáu)',
        '来': '来 (lâi)',
        '去': '去 (khì)',
        '看': '看 (khuànn)',
        '听': '听 (thiann)',
        '知道': '知影 (tsai-iánn)',
        '不知道': '毋知 (m-tsai)',
        '喜欢': '欢喜 (hoaⁿ-hí)',
        '厉害': '𠢕 (giâu)',
        '舒服': '舒爽 (su-sóng)',
        '辛苦': '艰苦 (kan-khóo)',
        '多少钱': '几若圆 (kuí-nā î)',
        '便宜': '俗 (sioh)',
        '贵': '贵 (kuì)',
        '是': '是 (sī)',
        '不是': '毋是 (m-sī)',
        '有': '有 (ū)',
        '没有': '无 (bô)',
        '什么': '啥物 (siáⁿ-mih)',
        '哪里': '叨位 (toh-ūi)',
        '这里': '遮 (tsia)',
        '那里': 'hit-ūi',
        '什么时候': '按怎 (án-tsuánna)',
        '为什么': '为何 (uī-hô)',
        '全部': '拢总 (lóng-tsóng)',
        '只/仅仅': '干焦 (taⁿ-ta)',
        '已经': '已经 (í-king)',
        '现在': '今仔日 (kin-á-jit)',
        '等一下': '等一下 (tán--ê)',
        '太/很': '诚 (tsiānn)',
        '不': '毋 (m)',
        '很/非常': '诚 (tsiānn)',
        '不要': '免 (bián)'
      },
      questionPatterns: {
        '吃了吗': '食未 (tsiah buē)',
        '去了吗': '去未 (khì buē)',
        '去了没有': '去未 (khì buē)',
        '你去哪里': '你去叨位 (lí khì toh-ūi)',
        '你在做什么': '你佇做啥物 (lí tī tsuè siáⁿ-mih)',
        '你吃了吗': '你食未 (lí tsiah buē)'
      },
      timeExpressions: {
        '今天': '今仔日 (kin-á-jit)',
        '明天': '明仔日 (bîn-á-jit)',
        '昨日': '昨昏 (tsa-hng)',
        '早上': '早起 (tsá-khí)',
        '中午': '中昼 (tiong-tàu)',
        '晚上': '暗时 (àm-sî)'
      },
      dailyExpressions: {
        '谢谢': '感谢 (kám-siā)',
        '对不起': '对不起 (tuì put-khì)',
        '没关系': '无要紧 (bô iàu-kín)',
        '再见': '再见 (tsài-kiàn)',
        '晚安': '晚安 (bán-an)',
        '早安': '早安 (tsó-an)'
      }
    }
  },
  wu: {
    name: '吴语',
    description: '吴语主要分布在江苏省南部、浙江省、上海市及安徽、江西部分地区的方言。',
    vocabulary: {
      pronouns: {
        '我': '我 (ngo)',
        '你': '侬 (non)',
        '他/她/它': '渠 (gho)',
        '我们': '阿拉 (a la)',
        '你们': '乃 (ne)',
        '他们': '渠拉 (gho la)'
      },
      commonWords: {
        '吃': '吃 (qie)',
        '喝': '吃 (qie)',
        '说': '讲 (gang)',
        '走': '走 (zou)',
        '跑': '奔 (ben)',
        '来': '来 (le)',
        '去': '去 (qi)',
        '看': '看 (ke)',
        '听': '听 (tin)',
        '知道': '晓 (xiao)',
        '不知道': '勿晓 (ve xiao)',
        '喜欢': '欢喜 (hoe xi)',
        '厉害': '结棍 (jie gun)',
        '舒服': '适意 (se yi)',
        '辛苦': '吃力 (qie li)',
        '多少钱': '几钿 (ji die)',
        '便宜': '便宜 (bi yi)',
        '贵': '贵 (ju)',
        '是': '是 (z)',
        '不是': '勿是 (ve z)',
        '有': '有 (you)',
        '没有': '呒没 (m me)',
        '什么': '啥 (sa)',
        '哪里': '阿里 (a li)',
        '这里': '此地 (ce di)',
        '那里': '许地 (xi di)',
        '什么时候': '啥辰光 (sa zen guang)',
        '为什么': '为啥 (we sa)',
        '全部': '统共 (ton gong)',
        '只/仅仅': '只要 (ze you)',
        '已经': '已经 (yi jing)',
        '现在': '现在 (xi z)',
        '等一下': '等歇 (den xie)',
        '太/很': '蛮 (me)',
        '不': '勿 (ve)',
        '很/非常': '蛮 (me)',
        '不要': '弗要 (ve yao)'
      },
      questionPatterns: {
        '吃了吗': '吃脱伐 (qie te va)',
        '去了吗': '去伐 (qi va)',
        '去了没有': '有去伐 (you qi va)',
        '你去哪里': '侬去阿里 (non qi a li)',
        '你在做什么': '侬勒做啥 (non le sa)',
        '你吃了吗': '侬吃脱伐 (non qie te va)'
      },
      timeExpressions: {
        '今天': '今日 (jin nie)',
        '明天': '明朝 (min zao)',
        '昨日': '昨日 (zou nie)',
        '早上': '早浪 (zao lang)',
        '中午': '中浪 (zon lang)',
        '晚上': '夜头 (ye dou)'
      },
      dailyExpressions: {
        '谢谢': '谢谢 (xia xia)',
        '对不起': '对不起 (de ve qi)',
        '没关系': '没关系 (me guan xi)',
        '再见': '再会 (ze we)',
        '晚安': '夜早点困 (ye zao di kun)',
        '早安': '早安 (zao e)'
      }
    }
  },
  xiang: {
    name: '湘语',
    description: '湘语主要分布在湖南省地区。',
    vocabulary: {
      pronouns: {
        '我': '我 (ngo)',
        '你': '你 (ni)',
        '他/她/它': '佗 (ta)',
        '我们': '我们 (ngo men)',
        '你们': '你们 (ni men)',
        '他们': '佗咯 (ta lo)'
      },
      commonWords: {
        '吃': '恰 (qa)',
        '喝': '喝 (ho)',
        '说': '话 (wa)',
        '走': '行 (han)',
        '跑': '跑 (bao)',
        '来': '来 (lai)',
        '去': '去 (qi)',
        '看': '看 (kan)',
        '听': '听 (tin)',
        '知道': '晓嘎 (xiao ga)',
        '不知道': '不晓 (bu xiao)',
        '喜欢': '喜欢 (xi huan)',
        '厉害': '扎实 (za shi)',
        '舒服': '舒服 (su fu)',
        '辛苦': '辛苦 (xin ku)',
        '多少钱': '好多钱 (duo shao qian)',
        '便宜': '便宜 (bian yi)',
        '贵': '贵 (gui)',
        '是': '是 (si)',
        '不是': '不是 (bu si)',
        '有': '有 (you)',
        '没有': '冒有 (mao you)',
        '什么': '么子 (me zi)',
        '哪里': '哪里 (na li)',
        '这里': '咯里 (lo li)',
        '那里': '那里 (la li)'
      }
    }
  },
  gan: {
    name: '赣语',
    description: '赣语主要分布在江西省地区。',
    vocabulary: {
      pronouns: {
        '我': '偶 (ngau)',
        '你': '你 (ni)',
        '佢': '佢 (ki)',
        '我们': '偶里 (ngau li)',
        '你们': '你里 (ni li)',
        '他们': '佢里 (ki li)'
      },
      commonWords: {
        '吃': '食 (shi)',
        '喝': '噶 (ga)',
        '说': '话 (wa)',
        '走': '行 (hang)',
        '跑': '走 (zou)',
        '来': '来 (lai)',
        '去': '去 (qu)',
        '看': '看 (kan)',
        '听': '听 (tin)',
        '知道': '晓 (xiao)',
        '不知道': '不晓 (bu xiao)',
        '喜欢': '欢喜 (foan xi)',
        '厉害': '厉害 (li hai)',
        '舒服': '舒服 (su fu)',
        '辛苦': '辛苦 (xin ku)',
        '多少钱': '几多钱 (ji duo qian)',
        '便宜': '便宜 (pian yi)',
        '贵': '贵 (gui)',
        '是': '系 (hai)',
        '不是': '不系 (bu hai)',
        '有': '有 (you)',
        '没有': '冒 (mao)',
        '什么': '么个 (shi me go)',
        '哪里': '哪里 (na li)',
        '这里': '咯里 (ge li)',
        '那里': '那里 (he li)'
      }
    }
  },
  jinhui: {
    name: '江淮话',
    description: '江淮话主要分布在江苏、安徽中部地区。',
    vocabulary: {
      pronouns: {
        '我': '我 (wo)',
        '你': '你 (ni)',
        '他/她/它': '他 (ta)',
        '我们': '我们 (wo men)',
        '你们': '你们 (ni men)',
        '他们': '他们 (ta men)'
      },
      commonWords: {
        '吃': '吃 (qi)',
        '喝': '喝 (he)',
        '说': '说 (shuo)',
        '走': '走 (zou)',
        '跑': '跑 (pao)',
        '来': '来 (lai)',
        '去': '去 (qu)',
        '看': '看 (kan)',
        '听': '听 (tin)',
        '知道': '晓嘎 (xiao ga)',
        '不知道': '不晓 (bu xiao)',
        '喜欢': '欢喜 (huan xi)',
        '厉害': '来斯 (lai si)',
        '舒服': '舒服 (shu fu)',
        '辛苦': '辛苦 (xin ku)',
        '多少钱': '多少钱 (duo shao qian)',
        '便宜': '便宜 (bian yi)',
        '贵': '贵 (gui)',
        '是': '是 (si)',
        '不是': '不是 (bu si)',
        '有': '有 (you)',
        '没有': '没得 (mei de)',
        '什么': '什尼 (shi ni)',
        '哪里': '哪块 (na kuai)',
        '这里': '这块 (zhe kuai)',
        '那里': '那块 (na kuai)'
      }
    }
  },
  jin: {
    name: '晋语',
    description: '晋语主要分布在山西省及内蒙古、河北部分地区。',
    vocabulary: {
      pronouns: {
        '我': '我 (nga)',
        '你': '你 (ni)',
        '他/她/它': '他 (ta)',
        '我们': '我们 (nga men)',
        '你们': '你们 (ni men)',
        '他们': '他们 (ta men)'
      },
      commonWords: {
        '吃': '吃 (qie)',
        '喝': '喝 (he)',
        '说': '说 (shuo)',
        '走': '走 (zou)',
        '跑': '跑 (pao)',
        '来': '来 (lai)',
        '去': '去 (qu)',
        '看': '看 (kan)',
        '听': '听 (tin)',
        '知道': '知道 (zi dao)',
        '不知道': '不机 (bu ji)',
        '喜欢': '待见 (dai jian)',
        '厉害': '厉害 (li hai)',
        '舒服': '舒服 (shu fu)',
        '辛苦': '辛苦 (xin ku)',
        '多少钱': '几钱 (ji qian)',
        '便宜': '便宜 (pian yi)',
        '贵': '贵 (gui)',
        '是': '是 (si)',
        '不是': '不是 (bu si)',
        '有': '有 (you)',
        '没有': '没 (mei)',
        '什么': '甚 (shi)',
        '哪里': '哪 (na)',
        '这里': '这 (zhe)',
        '那里': '那 (na)'
      }
    }
  },
  huizhou: {
    name: '徽语',
    description: '徽语主要分布在安徽省南部及江西、浙江部分地区。',
    vocabulary: {
      pronouns: {
        '我': '我 (e)',
        '你': '你 (n)',
        '他/她/它': '渠 (ke)',
        '我们': '我俫 (e le)',
        '你们': '你俫 (n le)',
        '他们': '渠俫 (ke le)'
      },
      commonWords: {
        '吃': '吃 (qie)',
        '喝': '吃 (qie)',
        '说': '话 (wo)',
        '走': '行 (han)',
        '跑': '走 (zou)',
        '来': '来 (lai)',
        '去': '去 (qu)',
        '看': '看 (kan)',
        '听': '听 (tin)',
        '知道': '晓 (xiao)',
        '不知道': '弗晓 (fe xiao)',
        '喜欢': '欢喜 (ho xi)',
        '厉害': '厉害 (li hai)',
        '舒服': '舒服 (shu fu)',
        '辛苦': '辛苦 (xin ku)',
        '多少钱': '几钿 (ji die)',
        '便宜': '便意 (bian yi)',
        '贵': '贵 (gui)',
        '是': '是 (si)',
        '不是': '弗是 (fe si)',
        '有': '有 (you)',
        '没有': '呒没 (m mo)',
        '什么': '什个 (shi go)',
        '哪里': '哪坦 (na tan)',
        '这里': '这块 (ze kai)',
        '那里': '那块 (ke kai)'
      }
    }
  },
  dongbei: {
    name: '东北话',
    description: '东北话主要分布在辽宁、吉林、黑龙江三省。',
    vocabulary: {
      pronouns: {
        '我': '我 (wo)',
        '你': '你 (ni)',
        '他/她/它': '他 (ta)',
        '我们': '咱们 (zan men)',
        '你们': '你们 (ni men)',
        '他们': '他们 (ta men)'
      },
      commonWords: {
        '吃': '吃 (chi)',
        '喝': '喝 (he)',
        '说': '唠 (lao)',
        '走': '走 (zou)',
        '跑': '蹽 (liao)',
        '来': '来 (lai)',
        '去': '去 (qu)',
        '看': '看 (kan)',
        '听': '听 (tin)',
        '知道': '知道 (zi dao)',
        '不知道': '不知道 (bu zi dao)',
        '喜欢': '稀罕 (xi han)',
        '厉害': '嘎嘎的 (ga ga de)',
        '舒服': '得劲儿 (de jin er)',
        '辛苦': '辛苦 (xin ku)',
        '多少钱': '多少钱 (duo shao qian)',
        '便宜': '便宜 (bian yi)',
        '贵': '贵 (gui)',
        '是': '是 (si)',
        '不是': '不是 (bu si)',
        '有': '有 (you)',
        '没有': '没有 (mei you)',
        '什么': '啥 (sha)',
        '哪里': '哪嘎达 (na ga da)',
        '这里': '这嘎达 (zhe ga da)',
        '那里': '那嘎达 (na ga da)'
      }
    }
  },
  beijing: {
    name: '北京话',
    description: '北京话是普通话的基础方言。',
    vocabulary: {
      pronouns: {
        '我': '我 (wo)',
        '你': '你 (ni)',
        '他/她/它': '他 (ta)',
        '我们': '我们 (wo men)',
        '你们': '你们 (ni men)',
        '他们': '他们 (ta men)'
      },
      commonWords: {
        '吃': '吃 (chi)',
        '喝': '喝 (he)',
        '说': '说 (shuo)',
        '走': '走 (zou)',
        '跑': '跑 (pao)',
        '来': '来 (lai)',
        '去': '去 (qu)',
        '看': '看 (kan)',
        '听': '听 (tin)',
        '知道': '知道 (zhi dao)',
        '不知道': '不知道 (bu zhi dao)',
        '喜欢': '喜欢 (xi huan)',
        '厉害': '厉害 (li hai)',
        '舒服': '舒服 (shu fu)',
        '辛苦': '辛苦 (xin ku)',
        '多少钱': '多少钱 (duo shao qian)',
        '便宜': '便宜 (bian yi)',
        '贵': '贵 (gui)',
        '是': '是 (shi)',
        '不是': '不是 (bu shi)',
        '有': '有 (you)',
        '没有': '没有 (mei you)',
        '什么': '什么 (shi me)',
        '哪里': '哪 (na)',
        '这里': '这 (zhe)',
        '那里': '那 (na)'
      }
    }
  },
  shandong: {
    name: '山东话',
    description: '山东话主要分布在山东省地区。',
    vocabulary: {
      pronouns: {
        '我': '俺 (an)',
        '你': '你 (ni)',
        '他/她/它': '他 (ta)',
        '我们': '俺们 (an men)',
        '你们': '你们 (ni men)',
        '他们': '他们 (ta men)'
      },
      commonWords: {
        '吃': '吃 (chi)',
        '喝': '喝 (he)',
        '说': '说 (shuo)',
        '走': '走 (zou)',
        '跑': '跑 (pao)',
        '来': '来 (lai)',
        '去': '去 (qu)',
        '看': '看 (kan)',
        '听': '听 (ting)',
        '知道': '知道 (zhi dao)',
        '不知道': '不道 (bu dao)',
        '喜欢': '喜欢 (xi huan)',
        '厉害': '挺厉害 (ting li hai)',
        '舒服': '得 (dei)',
        '辛苦': '辛苦 (xin ku)',
        '多少钱': '多少钱 (duo shao qian)',
        '便宜': '便宜 (bian yi)',
        '贵': '贵 (gui)',
        '是': '是 (si)',
        '不是': '不是 (bu si)',
        '有': '有 (you)',
        '没有': '木有 (mu you)',
        '什么': '啥 (sha)',
        '哪里': '哪 (na)',
        '这里': '这 (zhe)',
        '那里': '那 (na)'
      }
    }
  },
  sichuan: {
    name: '四川话',
    description: '四川话主要分布在四川省及重庆、云南、贵州部分地区。',
    vocabulary: {
      pronouns: {
        '我': '我 (ngo)',
        '你': '你 (ni)',
        '他/她/它': '他 (ta)',
        '我们': '我们 (ngo men)',
        '你们': '你们 (ni men)',
        '他们': '他们 (ta men)'
      },
      commonWords: {
        '吃': '吃 (ci)',
        '喝': '喝 (ho)',
        '说': '说 (so)',
        '走': '走 (zou)',
        '跑': '跑 (pao)',
        '来': '来 (lai)',
        '去': '去 (qu)',
        '看': '看 (kan)',
        '听': '听 (tin)',
        '知道': '知道 (zi dao)',
        '不知道': '不晓求 (bu xiao qiu)',
        '喜欢': '喜欢 (xi huan)',
        '厉害': '凶 (xiong)',
        '舒服': '舒服 (su fu)',
        '辛苦': '辛苦 (xin ku)',
        '多少钱': '好多钱 (duo shao qian)',
        '便宜': '相因 (xiang yin)',
        '贵': '贵 (gui)',
        '是': '是 (si)',
        '不是': '不是 (bu si)',
        '有': '有 (you)',
        '没有': '没有 (mei you)',
        '什么': '啥子 (sa zi)',
        '哪里': '哪点 (na dian)',
        '这里': '这点 (ze dian)',
        '那里': '那点 (na dian)'
      }
    }
  },
  custom: {
    name: '自定义',
    description: '用户自定义方言',
    vocabulary: null
  }
}

// 状态
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

// 配置
const config = reactive({
  provider: 'openai',
  apiKey: '',
  translateModel: 'gpt-3.5-turbo',
  whisperModel: 'webspeech',
  ttsModel: 'tts-1',
  customBaseUrl: ''
})

// 历史记录
const history = reactive([])

// Refs
const sourceAudio = ref(null)
const targetAudio = ref(null)
const waveCanvas = ref(null)

// 录音相关
let mediaRecorder = null
let recordingInterval = null
let audioContext = null
let analyser = null
let sourceNode = null
let animationId = null
let audioChunks = []

// Web Speech 识别器
let webSpeechRecognition = null

// 提供商配置
const providers = {
  openai: {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    placeholder: 'sk-...',
    models: [
      { label: 'GPT-4o', value: 'gpt-4o' },
      { label: 'GPT-4o-mini', value: 'gpt-4o-mini' },
      { label: 'GPT-4-Turbo', value: 'gpt-4-turbo-preview' },
      { label: 'GPT-4', value: 'gpt-4' },
      { label: 'GPT-3.5-Turbo', value: 'gpt-3.5-turbo' }
    ]
  },
  openrouter: {
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    placeholder: 'sk-or-v1-...',
    models: [
      { label: 'Auto', value: 'openrouter/auto' },
      { label: 'Claude-3.5-Sonnet', value: 'anthropic/claude-3.5-sonnet' },
      { label: 'Claude-3-Haiku', value: 'anthropic/claude-3-haiku' },
      { label: 'Gemini-1.5-Pro', value: 'google/gemini-1.5-pro' },
      { label: 'GPT-4o', value: 'openai/gpt-4o' }
    ]
  },
  deepseek: {
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com',
    placeholder: 'sk-...',
    models: [{ label: 'DeepSeek-Chat', value: 'deepseek-chat' }]
  },
  qwen: {
    name: 'Tongyi Qwen',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    placeholder: 'sk-...',
    models: [
      { label: 'Qwen-Plus', value: 'qwen-plus' },
      { label: 'Qwen-Turbo', value: 'qwen-turbo' },
      { label: 'Qwen-Max', value: 'qwen-max' }
    ]
  },
  ernie: {
    name: 'ERNIE',
    baseUrl: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat',
    placeholder: 'Access Token',
    models: [
      { label: 'ERNIE-4.5', value: 'ernie-4.5-8k-preview' },
      { label: 'ERNIE-3.5-8K', value: 'ernie-3.5-8k' }
    ]
  },
  doubao: {
    name: 'Doubao',
    baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
    placeholder: 'Token',
    models: [
      { label: 'Doubao-Pro-32K', value: 'doubao-pro-32k' },
      { label: 'Doubao-Pro-4K', value: 'doubao-pro-4k' }
    ]
  },
  minimax: {
    name: 'MiniMax',
    baseUrl: 'https://api.minimax.chat/v1',
    placeholder: 'API Key',
    models: [
      { label: 'ABAB-6.5S', value: 'abab6.5s-chat' }
    ]
  },
  moonshot: {
    name: 'Kimi',
    baseUrl: 'https://api.moonshot.cn/v1',
    placeholder: 'koi-...',
    models: [
      { label: 'Moonshot-V1-8K', value: 'moonshot-v1-8k' },
      { label: 'Moonshot-V1-32K', value: 'moonshot-v1-32k' }
    ]
  },
  azure: {
    name: 'Azure',
    baseUrl: '',
    placeholder: 'Azure API Key',
    models: [
      { label: 'GPT-4', value: 'gpt-4' },
      { label: 'GPT-35-Turbo', value: 'gpt-35-turbo' }
    ]
  },
  custom: {
    name: 'Custom',
    baseUrl: '',
    placeholder: 'https://api.example.com/v1',
    models: [{ label: 'Custom', value: 'custom-model' }]
  }
}

const providerLabel = computed(() => providers[config.provider]?.name || 'API')
const providerPlaceholder = computed(() => providers[config.provider]?.placeholder || 'API Key')
const translateModels = computed(() => providers[config.provider]?.models || [{ label: 'Default', value: 'default' }])
const currentModelLabel = computed(() => {
  const model = translateModels.value.find(m => m.value === config.translateModel)
  return model?.label || config.translateModel
})

// 加载配置
onMounted(() => {
  const savedConfig = localStorage.getItem('leizhou_config')
  if (savedConfig) {
    try {
      Object.assign(config, JSON.parse(savedConfig))
    } catch (e) {}
  }
  
  const savedHistory = localStorage.getItem('leizhou_history')
  if (savedHistory) {
    try {
      history.push(...JSON.parse(savedHistory))
    } catch (e) {}
  }
})

const onProviderChange = () => {
  if (translateModels.value.length > 0) {
    config.translateModel = translateModels.value[0].value
  }
}

// 保存配置
const saveConfig = () => {
  localStorage.setItem('leizhou_config', JSON.stringify(config))
  alert('已保存！')
}

// 测试 API
const testApiKey = async () => {
  const key = config.apiKey
  if (!key) return
  
  testResult.value = '测试ing...'
  
  try {
    const baseUrl = getBaseUrl()
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
        'X-Title': 'Leizhou Translator'
      },
      body: JSON.stringify({
        model: config.translateModel,
        messages: [{ role: 'user', content: 'hi' }],
        max_tokens: 5
      })
    })
    
    testResult.value = response.ok ? '成功！' : '无效'
  } catch (error) {
    testResult.value = `失败： ${error.message}`
  }
}

const formatTime = (timestamp) => {
  const diff = Date.now() - timestamp
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago'
  return new Date(timestamp).toLocaleDateString()
}

const getBaseUrl = () => {
  if (config.provider === 'custom') return config.customBaseUrl || ''
  return providers[config.provider]?.baseUrl || ''
}

// 开始语音输入
const startVoiceInput = async () => {
  // 如果正在 Web Speech，停止它
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

// Web Speech API
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
  
  // 计时器
  recordingInterval = setInterval(() => {
    recordingTime.value++
    // 60秒后自动停止
    if (recordingTime.value >= 60) {
      stopWebSpeech()
    }
  }, 1000)
}

// 暂停/继续 Web Speech
const toggleWebSpeechPause = () => {
  if (!webSpeechRecognition) return
  
  if (isWebSpeechPaused.value) {
    // 继续
    try {
      webSpeechRecognition.start()
      isWebSpeechPaused.value = false
      statusMessage.value = '🎤 🎤 正在聆听...'
    } catch (e) {
      // 重新创建
      startWebSpeech()
    }
  } else {
    // 暂停
    webSpeechRecognition.stop()
    isWebSpeechPaused.value = true
    statusMessage.value = '⏸️ 已暂停'
  }
}

// 停止 Web Speech
const stopWebSpeech = () => {
  if (webSpeechRecognition && isWebSpeechListening.value) {
    try {
      webSpeechRecognition.stop()
    } catch (e) {}
    isWebSpeechListening.value = false
    isWebSpeechPaused.value = false
    clearInterval(recordingInterval)
  }
}

// 录音
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
    
    const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
      ? 'audio/webm' 
      : MediaRecorder.isTypeSupported('audio/mp4') 
        ? 'audio/mp4' 
        : undefined
    
    mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : {})
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunks.push(e.data)
    }
    
    mediaRecorder.onstop = async () => {
      if (audioChunks.length > 0) {
        const blob = new Blob(audioChunks, { type: 'audio/webm' })
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

// 波形动画
const startWaveAnimation = async () => {
  await nextTick()
  const canvas = waveCanvas.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  const width = window.innerWidth
  const height = window.innerHeight
  
  canvas.width = width
  canvas.height = height
  
  const bufferLength = analyser.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)
  
  const draw = () => {
    if (!isRecording.value) return
    animationId = requestAnimationFrame(draw)
    analyser.getByteFrequencyData(dataArray)
    
    ctx.fillStyle = 'transparent'
    ctx.clearRect(0, 0, width, height)
    
    const centerY = height / 2
    const barWidth = 4
    const gap = 2
    const numBars = Math.floor(width / (barWidth + gap))
    
    for (let i = 0; i < numBars; i++) {
      const dataIndex = Math.floor((i / numBars) * bufferLength)
      const barHeight = (dataArray[dataIndex] / 255) * 150 + 5
      const x = i * (barWidth + gap)
      const y = centerY - barHeight / 2
      
      const gradient = ctx.createLinearGradient(x, y, x, y + barHeight)
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)')
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)')
      
      ctx.fillStyle = gradient
      ctx.fillRect(x, y, barWidth, barHeight)
    }
  }
  
  draw()
}

const stopWaveAnimation = () => {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}

// Whisper 识别
const recognizeWithWhisper = async (audioBlob) => {
  const key = config.apiKey
  if (!key) {
    alert('请先设置 OpenAI API Key')
    return
  }
  
  statusMessage.value = 'Recognizing...'
  
  try {
    const formData = new FormData()
    formData.append('file', audioBlob, 'audio.webm')
    formData.append('model', 'whisper-1')
    formData.append('language', 'zh')
    
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}` },
      body: formData
    })
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    
    const data = await response.json()
    sourceText.value = data.text
    statusMessage.value = '完成！'
    await translateText(data.text)
    
  } catch (error) {
    statusMessage.value = ''
    alert(`识别失败: ${error.message}`)
  }
}

// 翻译
const translateText = async (text) => {
  if (!text?.trim()) return
  
  const key = config.apiKey
  if (!key) {
    alert('请先设置 API Key')
    return
  }
  
  isTranslating.value = true
  
  // 获取系统提示词
  const systemPrompt = generateSystemPrompt(sourceLanguage.value, targetLanguage.value)
  
  try {
    const baseUrl = getBaseUrl()
    const headers = { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
      'HTTP-Referer': location.href
    }
    
    if (config.provider === 'openrouter') {
      headers['X-Title'] = 'Leizhou Translator'
    }
    
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: config.translateModel,
        messages: [{
          role: 'system',
          content: systemPrompt
        }, {
          role: 'user',
          content: text
        }],
        temperature: 0.2
      })
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    const data = await response.json()
    translatedText.value = data.choices[0].message.content.trim()
    
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
    localStorage.setItem('leizhou_history', JSON.stringify(history))
    
    await generateSpeech(translatedText.value)
    
  } catch (error) {
    alert(`翻译失败: ${error.message}`)
  } finally {
    isTranslating.value = false
  }
}

// 根据语言动态生成系统提示词
const generateSystemPrompt = (source, target) => {
  const sourceLang = languages.find(l => l.id === source)
  const targetLang = languages.find(l => l.id === target)
  
  const sourceName = sourceLang?.name || source
  const targetName = targetLang?.name || target
  
  // 如果是自定义语言或目标语言是普通话
  if (source === 'custom' || target === 'mandarin') {
    return `You are an expert translator specializing in ${sourceName} to Mandarin Chinese translation.

## Translation Rules:
1. Translate ${sourceName} naturally into Mandarin Chinese
2. Consider context to choose the correct meaning
3. Output ONLY the translation, nothing else
4. Do NOT add explanations or pinyin`
  }
  
  // 获取源语言的词汇对照表
  const vocab = dialectVocabulary[source]
  const vocabularyText = vocab?.vocabulary ? formatVocabulary(vocab.vocabulary) : ''
  
  return `You are an expert translator specializing in ${sourceName} to ${targetName} translation.

## ${sourceName} Reference:

${vocabularyText}

## Translation Rules:
1. Translate ${sourceName} naturally into ${targetName}
2. Use the vocabulary reference above for accurate translation
3. Consider context to choose the correct meaning
4. Pay attention to question patterns and negative forms
5. Output ONLY the translation, nothing else
6. Do NOT add explanations or pinyin`
}

// 格式化词汇对照表
const formatVocabulary = (vocab) => {
  let text = ''
  
  if (vocab.pronouns) {
    text += '### Pronouns (代词)\n'
    for (const [key, value] of Object.entries(vocab.pronouns)) {
      text += `- ${key} = ${value}\n`
    }
    text += '\n'
  }
  
  if (vocab.commonWords) {
    text += '### Common Words (常用词)\n'
    for (const [key, value] of Object.entries(vocab.commonWords)) {
      text += `- ${key} = ${value}\n`
    }
    text += '\n'
  }
  
  if (vocab.questionPatterns) {
    text += '### Question Patterns (疑问句)\n'
    for (const [key, value] of Object.entries(vocab.questionPatterns)) {
      text += `- ${key} = ${value}\n`
    }
    text += '\n'
  }
  
  if (vocab.timeExpressions) {
    text += '### Time Expressions (时间词)\n'
    for (const [key, value] of Object.entries(vocab.timeExpressions)) {
      text += `- ${key} = ${value}\n`
    }
    text += '\n'
  }
  
  if (vocab.dailyExpressions) {
    text += '### Daily Expressions (日常用语)\n'
    for (const [key, value] of Object.entries(vocab.dailyExpressions)) {
      text += `- ${key} = ${value}\n`
    }
  }
  
  return text
}

// 语音合成
const generateSpeech = async (text) => {
  const key = config.apiKey
  if (!key || !text) return
  
  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: 'alloy'
      })
    })
    
    if (response.ok) {
      const blob = await response.blob()
      targetAudioUrl.value = URL.createObjectURL(blob)
    }
  } catch (error) {
    console.error('TTS failed:', error)
  }
}

const playSourceVoice = () => {
  if (sourceAudioUrl.value) {
    sourceAudio.value.src = sourceAudioUrl.value
    sourceAudio.value.play()
  }
}

const playTargetVoice = () => {
  if (targetAudioUrl.value) {
    targetAudio.value.src = targetAudioUrl.value
    targetAudio.value.play()
  }
}

const copyText = async (text) => {
  await navigator.clipboard.writeText(text)
  alert('已复制！')
}

const loadHistory = (item) => {
  sourceText.value = item.source
  translatedText.value = item.target
  sourceLanguage.value = item.sourceLang || 'leizhou'
  targetLanguage.value = item.targetLang || 'mandarin'
}

const clearHistory = () => {
  if (confirm('清空 all history?')) {
    history.splice(0)
    localStorage.removeItem('leizhou_history')
  }
}

const getLanguageName = (id) => {
  const lang = languages.find(l => l.id === id)
  return lang?.name || id
}

watch(config, (v) => {
  localStorage.setItem('leizhou_config', JSON.stringify(v))
}, { deep: true })

onUnmounted(() => {
  stopWaveAnimation()
  stopWebSpeech()
  if (recordingInterval) clearInterval(recordingInterval)
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop()
  }
  if (audioContext) audioContext.close()
  if (sourceAudioUrl.value) URL.revokeObjectURL(sourceAudioUrl.value)
  if (targetAudioUrl.value) URL.revokeObjectURL(targetAudioUrl.value)
})
</script>

<style scoped>
.btn-gradient {
  background: linear-gradient(135deg, #f97316 0%, #ec4899 100%);
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255,255,255,0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.3);
  border-radius: 3px;
}

select option {
  background: #1f2937;
  color: white;
}
</style>
