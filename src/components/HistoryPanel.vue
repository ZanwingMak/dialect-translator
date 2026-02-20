<template>
  <!-- 历史记录 -->
  <div v-if="history.length > 0" class="mt-4">
    <div class="flex justify-between items-center mb-3">
      <h3 class="text-white font-semibold">📋 历史记录 ({{ history.length }})</h3>
    </div>
    <div class="space-y-2 max-h-64 overflow-y-auto pr-2">
      <div 
        v-for="item in history" 
        :key="item.id"
        @click="$emit('loadHistory', item)"
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
</template>

<script setup>
const props = defineProps({
  history: Array,
  languages: Array
})

defineEmits(['loadHistory'])

const getLanguageName = (id) => {
  if (!id) return '未知'
  const lang = props.languages.find(l => l.id === id)
  return lang?.name || id
}

const formatTime = (timestamp) => {
  const diff = Date.now() - timestamp
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  return new Date(timestamp).toLocaleDateString()
}
</script>
