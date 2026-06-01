import { reactive, watch } from 'vue'

const STORAGE_KEY = 'dialect_history'
const MAX_HISTORY = 50

// 翻译历史，按时间倒序，自动持久化
const history = reactive([])

try {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) history.push(...JSON.parse(saved))
} catch {}

watch(
  history,
  (val) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
    } catch {}
  },
  { deep: true }
)

// 添加一条新历史，超过上限会自动丢弃最旧
function addHistory(item) {
  history.unshift({ id: Date.now(), timestamp: Date.now(), ...item })
  if (history.length > MAX_HISTORY) history.pop()
}

// 清空历史并同步清除本地存储
function clearHistory() {
  history.splice(0)
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {}
}

// 删除指定下标的单条历史
function removeHistory(index) {
  if (index >= 0 && index < history.length) history.splice(index, 1)
}

export function useHistory() {
  return { history, addHistory, clearHistory, removeHistory }
}
