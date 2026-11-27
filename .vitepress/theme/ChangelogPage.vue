<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { lang } = useData()
const ru = computed(() => lang.value === 'ru')

type Release = {
  version: string
  date: string
  title: string
  summary: string
  changes: string[]
  components: string[]
}

const releases = computed<Release[]>(() => ru.value ? [
  {
    version: '0.7.1', date: '27 ноября 2026', title: 'Обновление нод и маскировка',
    summary: 'Однократный SSH-переход старых нод и автоматические обновления новых установок.',
    changes: [
      'Ноды получают таймер проверки новых релизов с сохранением VPN-ключей и откатом при ошибке установки.',
      'Карточка ноды показывает версию агента и позволяет запустить однократное обновление по SSH.',
      'В новых клиентских профилях число и размер начальных маскирующих пакетов различаются между нодами.',
      'Сборка ноды обновлена до AmneziaWG-go 3.1.20261116.'
    ], components: ['Backend', 'Panel', 'Node']
  },
  {
    version: '0.7.0', date: '27 ноября 2026', title: 'Стабильный мониторинг нод',
    summary: 'Меньше ложных уведомлений и точный онлайн пользователей на каждой ноде.',
    changes: [
      'Сообщение о потере связи появляется после пяти минут непрерывной недоступности; короткие сбои не создают пару уведомлений.',
      'Карточка ноды показывает уникальных пользователей с действующим доступом вместо числа устройств.',
      'Новые VPN-профили используют MTU 1280, а новые ноды по умолчанию получают UDP-порт 1234.',
      'Добавлены рекомендации по проверке доступа через мобильную сеть и определения страны сервисами.'
    ], components: ['Backend', 'Panel']
  },
  {
    version: '0.6.2', date: '23 ноября 2026', title: 'Событие первого подключения',
    summary: 'Вебхук сообщает о первом подключении пользователя к VPN.',
    changes: [
      'Добавлено событие user.first_connected с защитой от повторной отправки при подключении нескольких устройств или серверов.',
      'Заголовки подписи и времени вебхука называются X-Dementia-Signature и X-Dementia-Timestamp.'
    ], components: ['Backend']
  },
  {
    version: '0.6.1', date: '23 ноября 2026', title: 'Ноды с первого взгляда',
    summary: 'Новые показатели в панели и понятные названия VPN-профилей в AmneziaWG.',
    changes: [
      'На странице нод появились пользователи в сети, пиковый онлайн и общий трафик за сегодня.',
      'Пик одновременных подключений сохраняется между перезапусками и обновляется каждые 15 секунд.',
      'Скачиваемые .conf и .vpn файлы теперь получают название выбранной ноды вместо технического UUID.',
      'Новый метод API отдаёт показатели нод для внешних интеграций.'
    ], components: ['Backend', 'Panel']
  },
  {
    version: '0.6.0', date: '17 ноября 2026', title: 'Управление подключениями',
    summary: 'Устройства, подписки и ноды стали удобнее в ежедневной работе.',
    changes: [
      'Для каждого устройства доступны отдельная ссылка подписки и собственные ключи.',
      'Страница подписки сохраняет доступ к ещё не использованным серверам и позволяет переключаться между устройствами.',
      'Добавлены два способа удаления ноды и подтверждённое обновление SSH-ключа сервера.',
      'Расширены настройки Telegram-уведомлений и язык страницы подписки по умолчанию.'
    ], components: ['Backend', 'Panel']
  },
  {
    version: '0.5.0', date: '16 ноября 2026', title: 'Именованные устройства',
    summary: 'Управление доступом каждого устройства пользователя.',
    changes: [
      'Устройства можно добавлять, переименовывать и удалять; для каждого выпускается отдельный набор ключей.',
      'В настройках задаётся лимит устройств для новых пользователей, а в карточке пользователя — индивидуальный лимит.',
      'API принимает UUID пользователя и Telegram ID для операций с устройствами.'
    ], components: ['Backend', 'Panel']
  },
  {
    version: '0.4.0', date: '16 ноября 2026', title: 'Доступ в карточке пользователя',
    summary: 'Ссылки и уже выпущенные профили собраны рядом с данными пользователя.',
    changes: [
      'В карточке пользователя доступны ссылка подписки и профили подключения.',
      'Администратор может повторно получить ранее выданные конфигурации и ключи.'
    ], components: ['Backend', 'Panel']
  },
  {
    version: '0.3.1', date: '16 ноября 2026', title: 'Исправление экспорта для iOS',
    summary: 'Профиль AmneziaVPN снова содержит обязательные параметры обфускации.',
    changes: [
      'Исправлен экспорт ключа AmneziaVPN для приложения на iOS.'
    ], components: ['Backend']
  },
  {
    version: '0.3.0', date: '16 ноября 2026', title: 'Подписки и новая панель',
    summary: 'Первое крупное обновление управления сетью и интерфейса.',
    changes: [
      'Добавлены управление планами подписок, операции с нодами и экспорт VPN-профилей.',
      'Переработан интерфейс панели и страницы подписки.'
    ], components: ['Backend', 'Panel']
  },
  {
    version: '0.1.0', date: '15 ноября 2026', title: 'Первый выпуск',
    summary: 'Основа панели и установка через Docker.',
    changes: [
      'Опубликованы backend, веб-панель и инструкции по развёртыванию.'
    ], components: ['Backend', 'Panel']
  }
] : [
  {
    version: '0.7.1', date: 'November 27, 2026', title: 'Node updates and masking',
    summary: 'One-time SSH upgrade for existing nodes and automatic updates for new installations.',
    changes: [
      'Nodes check official releases on a host timer, preserve VPN keys, and roll back failed installations.',
      'Node cards show the agent version and offer a one-time SSH upgrade action.',
      'New client profiles vary the initial junk packet count and sizes between nodes.',
      'The node build uses AmneziaWG-go 3.1.20261116.'
    ], components: ['Backend', 'Panel', 'Node']
  },
  {
    version: '0.7.0', date: 'November 27, 2026', title: 'Stable node monitoring',
    summary: 'Fewer false alerts and accurate online user counts for each node.',
    changes: [
      'Connection loss is reported after five uninterrupted minutes; short outages no longer create paired alerts.',
      'Node cards count unique users with active access instead of devices.',
      'New VPN profiles use MTU 1280, and new nodes default to UDP port 1234.',
      'Added guidance for mobile network access and service location detection.'
    ], components: ['Backend', 'Panel']
  },
  {
    version: '0.6.2', date: 'November 23, 2026', title: 'First connection event',
    summary: 'The webhook now reports a user’s first VPN connection.',
    changes: [
      'Added user.first_connected with duplicate protection across devices and servers.',
      'Webhook signature and time headers are X-Dementia-Signature and X-Dementia-Timestamp.'
    ], components: ['Backend']
  },
  {
    version: '0.6.1', date: 'November 23, 2026', title: 'Nodes at a glance',
    summary: 'New panel metrics and recognizable VPN profile names in AmneziaWG.',
    changes: [
      'The Nodes page now shows users online, peak online users, and total traffic today.',
      'The peak survives restarts and is sampled every 15 seconds.',
      'Downloaded .conf and .vpn files now use the selected node name instead of a technical UUID.',
      'A new API endpoint exposes node metrics to external integrations.'
    ], components: ['Backend', 'Panel']
  },
  {
    version: '0.6.0', date: 'November 17, 2026', title: 'Connection management',
    summary: 'More control over devices, subscriptions, and nodes.',
    changes: [
      'Each device has its own subscription link and connection keys.',
      'Subscription pages keep unused servers available and let users switch between their devices.',
      'Node removal has two modes, and SSH host key changes require explicit confirmation.',
      'Telegram notification settings and a default subscription page language were added.'
    ], components: ['Backend', 'Panel']
  },
  {
    version: '0.5.0', date: 'November 16, 2026', title: 'Named devices',
    summary: 'Manage each user device and its access separately.',
    changes: [
      'Add, rename, and delete devices; each has its own set of connection keys.',
      'Set a default limit for new users and an individual limit in each user card.',
      'Device API operations accept a user UUID or Telegram ID.'
    ], components: ['Backend', 'Panel']
  },
  {
    version: '0.4.0', date: 'November 16, 2026', title: 'Access in user details',
    summary: 'Issued links and profiles appear alongside each user.',
    changes: [
      'The user card includes the subscription link and connection profiles.',
      'Administrators can retrieve previously issued configurations and keys.'
    ], components: ['Backend', 'Panel']
  },
  {
    version: '0.3.1', date: 'November 16, 2026', title: 'iOS export fix',
    summary: 'AmneziaVPN profiles include the required obfuscation settings again.',
    changes: [
      'Fixed AmneziaVPN key export for the iOS app.'
    ], components: ['Backend']
  },
  {
    version: '0.3.0', date: 'November 16, 2026', title: 'Subscriptions and a new panel',
    summary: 'The first major update to network management and the interface.',
    changes: [
      'Added subscription plans, node operations, and VPN profile export.',
      'Redesigned the admin panel and subscription pages.'
    ], components: ['Backend', 'Panel']
  },
  {
    version: '0.1.0', date: 'November 15, 2026', title: 'Initial release',
    summary: 'The core panel and Docker installation.',
    changes: [
      'Published the backend, web panel, and deployment instructions.'
    ], components: ['Backend', 'Panel']
  }
])

const copy = computed(() => ru.value ? {
  eyebrow: 'ИСТОРИЯ ПРОЕКТА', title: 'Что нового в dementia',
  intro: 'Новые функции, улучшения и исправления в каждом выпуске.',
  latest: 'Текущая версия', previous: 'История выпусков', changes: 'Изменения',
  source: 'Исходный код', backend: 'Backend', panel: 'Панель'
} : {
  eyebrow: 'PROJECT HISTORY', title: 'What’s new in dementia',
  intro: 'Features, improvements, and fixes in every release.',
  latest: 'Current version', previous: 'Release history', changes: 'Highlights',
  source: 'Source code', backend: 'Backend', panel: 'Panel'
})
</script>

<template>
  <main class="changelog-page">
    <header class="changelog-hero">
      <div class="eyebrow"><span class="small-line" />{{ copy.eyebrow }}</div>
      <h1>{{ copy.title }}</h1>
      <p>{{ copy.intro }}</p>
      <div class="changelog-hero-line"><span>v{{ releases[0].version }}</span><span>{{ releases[0].date }}</span></div>
    </header>
    <div class="changelog-section-label">{{ copy.previous }}</div>
    <div class="release-list">
      <article v-for="(release, index) in releases" :id="`v${release.version}`" :key="release.version" class="release-entry" :class="{ 'release-latest': index === 0 }">
        <div class="release-marker"><span /></div>
        <div class="release-card">
          <div class="release-topline">
            <span class="release-version">v{{ release.version }}</span>
            <span v-if="index === 0" class="release-current">{{ copy.latest }}</span>
            <time>{{ release.date }}</time>
          </div>
          <h2>{{ release.title }}</h2>
          <p class="release-summary">{{ release.summary }}</p>
          <div class="release-divider" />
          <h3>{{ copy.changes }}</h3>
          <ul><li v-for="change in release.changes" :key="change">{{ change }}</li></ul>
          <div class="release-links">
            <span>{{ copy.source }}</span>
            <a v-if="release.components.includes('Backend')" :href="`https://github.com/dementia-panel/backend/tree/v${release.version}`" target="_blank" rel="noopener noreferrer">{{ copy.backend }}</a>
            <a v-if="release.components.includes('Panel')" :href="`https://github.com/dementia-panel/panel/tree/v${release.version}`" target="_blank" rel="noopener noreferrer">{{ copy.panel }}</a>
          </div>
        </div>
      </article>
    </div>
  </main>
</template>
