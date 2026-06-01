<template>
  <section v-if="history.length > 0" class="mt-6">
    <header class="flex items-center justify-between mb-3 px-1">
      <h3 class="label-meta">History</h3>
      <span class="text-[11px] text-ink-muted tabular-nums">{{ history.length }} / 50</span>
    </header>

    <ul class="glass divide-y divide-white/40 overflow-hidden">
      <li
        v-for="(item, index) in history"
        :key="item.id"
        @click="$emit('loadHistory', item)"
        class="group relative p-4 cursor-pointer hover:bg-white/30 transition-colors"
      >
        <div class="flex items-center gap-2 mb-1.5 text-[11px] text-ink-muted">
          <span>{{ getLanguageName(item.sourceLang) }}</span>
          <PhArrowRight :size="10" />
          <span>{{ getLanguageName(item.targetLang) }}</span>
          <span class="ml-auto tabular-nums">{{ formatTime(item.timestamp) }}</span>
        </div>
        <p class="text-sm text-ink-base truncate pr-8">{{ item.source }}</p>
        <p class="text-xs text-ink-dim truncate mt-0.5 pr-8">{{ item.target }}</p>

        <button
          @click.stop="$emit('removeHistory', index)"
          aria-label="删除该条"
          class="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full
                 flex items-center justify-center text-ink-muted
                 opacity-0 group-hover:opacity-100 focus:opacity-100
                 hover:text-danger hover:bg-white/60 transition-all"
        >
          <PhX :size="12" />
        </button>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { PhArrowRight, PhX } from '@phosphor-icons/vue'

const props = defineProps({
  history: Array,
  languages: Array
})

defineEmits(['loadHistory', 'removeHistory'])

function getLanguageName(id) {
  if (!id) return '未知'
  return props.languages.find((l) => l.id === id)?.name || id
}

function formatTime(timestamp) {
  const diff = Date.now() - timestamp
  if (diff < 60_000) return '刚刚'
  if (diff < 3_600_000) return Math.floor(diff / 60_000) + 'm'
  if (diff < 86_400_000) return Math.floor(diff / 3_600_000) + 'h'
  return new Date(timestamp).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
}
</script>
