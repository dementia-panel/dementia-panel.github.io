<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute, useRouter } from 'vitepress'
const { lang } = useData()
const route = useRoute()
const router = useRouter()
const russian = computed(() => lang.value === 'ru')
function change(ru: boolean) {
 const bare = route.path.replace(/^\/ru(?=\/|$)/, '') || '/'
 const target = ru ? '/ru' + (bare.startsWith('/') ? bare : '/' + bare) : bare
 try { localStorage.setItem('dementia.docs.language', ru ? 'ru' : 'en') } catch {}
 router.go(target)
}
</script>
<template>
 <div class="language-switch" aria-label="Language / Язык">
  <button lang="en" :aria-pressed="!russian" @click="change(false)">EN</button>
  <button lang="ru" :aria-pressed="russian" @click="change(true)">RU</button>
 </div>
</template>
