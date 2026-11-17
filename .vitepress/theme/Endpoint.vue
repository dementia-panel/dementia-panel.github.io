<script setup lang="ts">
import { computed, ref } from 'vue'
import { useData } from 'vitepress'
defineProps<{ method: string, path: string }>()
const { lang } = useData()
const copied = ref(false)
const failed = ref(false)
const ru = computed(() => lang.value === 'ru')
async function copy(path: string) {
 try { await navigator.clipboard.writeText(path);copied.value=true;failed.value=false;setTimeout(()=>{copied.value=false},1800) }
 catch { failed.value=true }
}
</script>
<template>
 <div class="endpoint-bar">
  <span class="method-pill" :data-method="method">{{ method }}</span>
  <code>{{ path }}</code>
  <button :aria-label="ru ? 'Скопировать путь' : 'Copy path'" @click="copy(path)">
   <svg v-if="!copied" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="8" y="8" width="12" height="12" rx="3"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg>
   <span v-else>{{ ru ? 'Скопировано' : 'Copied' }}</span>
  </button>
 </div>
 <p v-if="failed" role="status">{{ ru ? 'Выделите путь и скопируйте вручную.' : 'Select the path and copy it manually.' }}</p>
</template>
