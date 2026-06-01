// 支持的语言/方言定义。id 用于配置与历史，name 用于显示，speechLang 用于 Web Speech API
export const LANGUAGES = [
  { id: 'leizhou', name: '雷州话', region: '广东雷州', family: '闽南语', isDialect: true, speechLang: 'zh-CN' },
  { id: 'cantonese', name: '粤语', region: '广东/香港', family: '粤语', isDialect: true, speechLang: 'zh-HK' },
  { id: 'hakka', name: '客家话', region: '梅州/惠州', family: '客家话', isDialect: true, speechLang: 'zh-CN' },
  { id: 'minnan', name: '闽南语', region: '福建/台湾', family: '闽南语', isDialect: true, speechLang: 'zh-TW' },
  { id: 'chaoshan', name: '潮汕话', region: '广东潮汕', family: '闽南语', isDialect: true, speechLang: 'zh-CN' },
  { id: 'wu', name: '吴语', region: '上海/浙江', family: '吴语', isDialect: true, speechLang: 'zh-CN' },
  { id: 'xiang', name: '湘语', region: '湖南', family: '湘语', isDialect: true, speechLang: 'zh-CN' },
  { id: 'gan', name: '赣语', region: '江西', family: '赣语', isDialect: true, speechLang: 'zh-CN' },
  { id: 'jinhui', name: '江淮话', region: '江苏/安徽', family: '官话', isDialect: true, speechLang: 'zh-CN' },
  { id: 'jin', name: '晋语', region: '山西', family: '晋语', isDialect: true, speechLang: 'zh-CN' },
  { id: 'huizhou', name: '徽语', region: '安徽', family: '徽语', isDialect: true, speechLang: 'zh-CN' },
  { id: 'dongbei', name: '东北话', region: '东北', family: '官话', isDialect: true, speechLang: 'zh-CN' },
  { id: 'beijing', name: '北京话', region: '北京', family: '官话', isDialect: true, speechLang: 'zh-CN' },
  { id: 'shandong', name: '山东话', region: '山东', family: '官话', isDialect: true, speechLang: 'zh-CN' },
  { id: 'sichuan', name: '四川话', region: '四川', family: '官话', isDialect: true, speechLang: 'zh-CN' },
  { id: 'mandarin', name: '普通话', region: '全国', family: '官话', isDialect: false, speechLang: 'zh-CN' },
  { id: 'custom', name: '自定义', region: '', family: '', isDialect: true, speechLang: 'zh-CN' }
]

// 方言参考词汇，作为翻译 prompt 的辅助信息（仅几种典型方言）
export const VOCABULARY = {
  leizhou: '我=瓦(wa) 你=汝(ru) 他=伊(i) 吃=食(zia) 喝=呷(hab) 说=讲(gong) 来=来(lai) 去=去(ki) 知道=知影(zi iang) 什么=乜嘢(mih ye)',
  cantonese: '我=我(ngo) 你=你(ne) 佢=佢(keoi) 食=食(sik) 饮=饮(yam) 讲=讲(gong) 嚟=嚟(lai) 去=去(heoi) 知=知(zi) 咩=咩(me)',
  hakka: '我=𠊎(ngai) 你=你(n) 佢=佢(ki) 食=食(shi) 啉=啉(lim) 讲=讲(gong) 来=来(loi) 去=去(hi) 知=知(di) 乜=乜(m)',
  minnan: '我=我(goa) 你=你(li) 伊=伊(i) 食=食(tsiah) 饮=饮(lim) 讲=讲(kng) 来=来(lai) 去=去(khi) 知=知(tsai) 乜=乜(mih)',
  chaoshan: '我=我(ua) 你=汝(lu) 伊=伊(i) 食=食(tsiaʔ) 饮=饮(am) 讲=讲(kang) 来=来(lai) 去=去(khu) 知=知(tsai) 乜个=乜个(mih-kai)',
  wu: '我=我(ngo) 侬=侬(non) 渠=渠(gho) 吃=吃(qie) 讲=讲(gang) 来=来(le) 去=去(qi) 晓=晓(xiao) 啥=啥(sa)'
}

// 录音时长上限（秒）
export const MAX_RECORDING_SECONDS = 60
