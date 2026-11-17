<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
const { lang } = useData()
const ru = computed(() => lang.value === 'ru')
const base = computed(() => ru.value ? '/ru' : '')
const text = computed(() => ru.value ? {
 eyebrow: 'ДОКУМЕНТАЦИЯ DEMENTIA', title: 'Ваша сеть.', second: 'Всё под контролем.',
 intro: 'От первого запуска до собственной интеграции. Всё, что нужно для управления VPN-инфраструктурой, в одном месте.',
 start: 'Начать установку', api: 'Справочник API', open: 'Открытый исходный код', protocol: 'AmneziaWG 3.1+',
 deploymentTitle: 'От идеи до первого подключения.', deploymentIntro: 'Начните с backend, затем подключите веб-панель. Инструкция проведёт через настройку окружения, сертификатов и первого сервера.', terminal: 'ПОРЯДОК РАЗВЁРТЫВАНИЯ', backend: 'Сначала backend', panel: 'Затем веб-панель', database: 'PostgreSQL и Valkey запускаются как зависимости.',
 chapter: 'С ЧЕГО НАЧАТЬ', heading: 'Меньше вопросов. Больше контроля.',
 cards: [
  { n: '01', title: 'Развернуть панель', description: 'Docker, конфигурация, сертификат и первый вход. Пошагово, без догадок.', path: '/guide/installation', tag: 'Установка' },
  { n: '02', title: 'Подключить инфраструктуру', description: 'Добавьте ноды по SSH, назначьте подписки и выдайте ключи устройствам.', path: '/guide/nodes', tag: 'Управление' },
  { n: '03', title: 'Создать интеграцию', description: '43 метода API. Параметры, статусы и готовые примеры каждого запроса.', path: '/api/', tag: 'API reference' },
 ],
 preview: 'ЗНАКОМЫЙ ИНТЕРФЕЙС', previewTitle: 'Видеть всю картину.', previewText: 'Ноды, пользователи и трафик — в одной панели. Документация помогает настроить каждый шаг.', caption: 'Обзор панели · Демонстрационные данные',
 quick: 'Быстрый доступ', links: ['Переменные окружения', 'HTTPS и сертификаты', 'Пользователи и устройства', 'Решение проблем'],
} : {
 eyebrow: 'DEMENTIA DOCUMENTATION', title: 'Your network.', second: 'Every detail covered.',
 intro: 'From your first deployment to your own integration. Everything you need to run your VPN infrastructure, in one place.',
 start: 'Start installation', api: 'Explore the API', open: 'Open source', protocol: 'AmneziaWG 3.1+',
 deploymentTitle: 'From an idea to your first connection.', deploymentIntro: 'Start with the backend, then bring your panel online. The guide walks you through configuration, certificates and your first server.', terminal: 'DEPLOYMENT ORDER', backend: 'Backend comes first', panel: 'Then the web panel', database: 'PostgreSQL and Valkey start as dependencies.',
 chapter: 'FIND YOUR STARTING POINT', heading: 'Less guesswork. More control.',
 cards: [
  { n: '01', title: 'Deploy your panel', description: 'Docker, configuration, certificates and your first sign-in. One step at a time.', path: '/guide/installation', tag: 'Installation' },
  { n: '02', title: 'Connect your infrastructure', description: 'Provision nodes over SSH, assign subscriptions and issue device credentials.', path: '/guide/nodes', tag: 'Operations' },
  { n: '03', title: 'Build an integration', description: '43 API endpoints. Parameters, status codes and examples for every request.', path: '/api/', tag: 'API reference' },
 ],
 preview: 'A FAMILIAR WORKSPACE', previewTitle: 'See the whole picture.', previewText: 'Nodes, users and traffic in a single panel. The documentation helps you configure every step.', caption: 'Panel overview · Sample data',
 quick: 'Quick reference', links: ['Environment variables', 'HTTPS & certificates', 'Users & devices', 'Troubleshooting'],
})
const quickPaths = ['/guide/environment', '/guide/certificates', '/guide/users', '/guide/troubleshooting']
</script>
<template>
 <main class="docs-home">
  <section class="home-hero connection-hero">
   <img class="hero-art" :src="withBase('/assets/connection-hands.png')" alt="" width="1536" height="1024" fetchpriority="high">
   <div class="hero-copy">
    <div class="eyebrow"><span class="small-line"/>{{ text.eyebrow }}</div>
    <h1>{{ text.title }}<br><span>{{ text.second }}</span></h1>
    <p class="hero-intro">{{ text.intro }}</p>
    <div class="hero-actions">
     <a class="primary-link" :href="withBase(base+'/guide/installation')">{{ text.start }}<span aria-hidden="true">↗</span></a>
     <a class="secondary-link" :href="withBase(base+'/api/')">{{ text.api }}<span aria-hidden="true">→</span></a>
    </div>
    <div class="hero-meta"><span><svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.3"><path d="m7 5-5 5 5 5m6-10 5 5-5 5m-2-12-2 14"/></svg>{{ text.open }}</span><i/><span>{{ text.protocol }}</span></div>
   </div>
  </section>
  <section class="home-deployment">
   <div class="deployment-intro"><div class="eyebrow"><span class="small-line"/>{{ text.terminal }}</div><h2>{{ text.deploymentTitle }}</h2><p>{{ text.deploymentIntro }}</p><a :href="withBase(base+'/guide/installation')">{{ text.start }} <span aria-hidden="true">↗</span></a></div>
   <div class="deployment-card">
    <div class="deployment-top"><img :src="withBase('/assets/mark.svg')" alt="" width="29" height="29"><span>{{ text.terminal }}</span><span class="terminal-dot"/></div>
    <div class="deployment-step"><span class="step-index">01</span><div><h2>{{ text.backend }}</h2><p>API · PostgreSQL · Valkey</p></div><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="16" height="6" rx="2"/><rect x="4" y="14" width="16" height="6" rx="2"/><path d="M7 7h1m-1 10h1"/></svg></div>
    <div class="terminal-command"><span class="command-label">~/dementia</span><pre><span>$</span> docker compose up -d --wait backend</pre></div>
    <div class="deployment-connector"><span/><span/><span/></div>
    <div class="deployment-step"><span class="step-index">02</span><div><h2>{{ text.panel }}</h2><p>HTTPS · nginx · UI</p></div><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9h18M7 6.5h1"/></svg></div>
    <div class="terminal-command"><span class="command-label">~/dementia</span><pre><span>$</span> docker compose up -d --wait frontend</pre></div>
    <div class="deployment-note"><span class="note-dot"/>{{ text.database }}</div>
   </div>
  </section>
  <section class="home-chapters">
   <div class="eyebrow">{{ text.chapter }}</div>
   <h2>{{ text.heading }}</h2>
   <div class="chapter-grid">
    <a v-for="card in text.cards" :key="card.n" :href="withBase(base+card.path)" class="chapter-card">
     <div class="chapter-top"><span>{{ card.n }}</span><span class="chapter-tag">{{ card.tag }}</span></div>
     <h3>{{ card.title }}</h3><p>{{ card.description }}</p><span class="chapter-arrow" aria-hidden="true">↗</span>
    </a>
   </div>
  </section>
  <section class="home-preview">
   <div class="preview-intro"><div><div class="eyebrow">{{ text.preview }}</div><h2>{{ text.previewTitle }}</h2></div><p>{{ text.previewText }}</p></div>
   <div class="dashboard-frame"><div class="frame-caption"><span class="frame-dots"><i/><i/><i/></span><span>dementia / overview</span><span class="frame-caption-end">{{ ru ? 'ПАНЕЛЬ УПРАВЛЕНИЯ' : 'CONTROL PANEL' }}</span></div><img :src="withBase('/assets/dashboard.png')" :alt="text.caption" width="2400" height="2250" loading="lazy"></div>
   <p class="preview-caption">{{ text.caption }}</p>
  </section>
  <section class="quick-links"><span>{{ text.quick }}</span><a v-for="(label,index) in text.links" :key="label" :href="withBase(base+quickPaths[index])">{{ label }}<span aria-hidden="true">↗</span></a></section>
 </main>
</template>
