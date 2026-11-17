import { defineConfig } from 'vitepress'

const apiSlugs = ['users', 'devices', 'nodes', 'plans', 'access', 'traffic', 'settings']
const apiEN = ['Users', 'Devices', 'Nodes', 'Subscription plans', 'Issued access', 'Traffic', 'Device settings']
const apiRU = ['Пользователи', 'Устройства', 'Ноды', 'Планы подписок', 'Выданный доступ', 'Трафик', 'Настройки устройств']
function sidebar(ru: boolean) {
 const p = ru ? '/ru' : ''
 return [
  { text: ru ? 'НАЧАЛО РАБОТЫ' : 'GET STARTED', items: [
   { text: ru ? 'Введение' : 'Introduction', link: `${p}/guide/overview` },
   { text: ru ? 'Установка' : 'Installation', link: `${p}/guide/installation` },
   { text: ru ? 'Переменные окружения' : 'Environment variables', link: `${p}/guide/environment` },
   { text: ru ? 'HTTPS и сертификаты' : 'HTTPS & certificates', link: `${p}/guide/certificates` },
  ] },
  { text: ru ? 'УПРАВЛЕНИЕ' : 'OPERATIONS', items: [
   { text: ru ? 'Ноды' : 'Nodes', link: `${p}/guide/nodes` },
   { text: ru ? 'Пользователи и устройства' : 'Users & devices', link: `${p}/guide/users` },
   { text: ru ? 'Обновление' : 'Updating', link: `${p}/guide/updating` },
   { text: ru ? 'Решение проблем' : 'Troubleshooting', link: `${p}/guide/troubleshooting` },
  ] },
  { text: 'API REFERENCE', items: [
   { text: ru ? 'Авторизация' : 'Authentication', link: `${p}/api/` },
   ...apiSlugs.map((slug, i) => ({ text: (ru ? apiRU : apiEN)[i], link: `${p}/api/${slug}` })),
  ] },
 ]
}
export default defineConfig({
 title: 'dementia',
 description: 'Documentation for the dementia VPN control panel.',
 base: '/',
 sitemap: { hostname: 'https://dementia-panel.github.io' },
 cleanUrls: true,
 appearance: 'force-dark',
 srcExclude: ['content/**', 'README.md', 'node_modules/**'],
 head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }], ['meta', { name: 'theme-color', content: '#0c0c0e' }]],
 markdown: { theme: { light: 'github-light', dark: 'github-dark' }, lineNumbers: false },
 locales: {
  root: {
   label: 'English', lang: 'en',
   themeConfig: {
    nav: [{ text: 'Guide', link: '/guide/overview', activeMatch: '/guide/' }, { text: 'API reference', link: '/api/', activeMatch: '/api/' }],
    sidebar: { '/guide/': sidebar(false), '/api/': sidebar(false) },
    outline: { label: 'On this page', level: [2, 3] },
    docFooter: { prev: 'Previous', next: 'Next' },
    footer: { message: 'Your infrastructure. Your control.', copyright: 'dementia · Open source VPN management' },
   },
  },
  ru: {
   label: 'Русский', lang: 'ru', description: 'Документация панели управления VPN dementia.',
   themeConfig: {
    nav: [{ text: 'Руководство', link: '/ru/guide/overview', activeMatch: '/ru/guide/' }, { text: 'Справочник API', link: '/ru/api/', activeMatch: '/ru/api/' }],
    sidebar: { '/ru/guide/': sidebar(true), '/ru/api/': sidebar(true) },
    outline: { label: 'На этой странице', level: [2, 3] },
    docFooter: { prev: 'Предыдущая', next: 'Следующая' },
    darkModeSwitchLabel: 'Тема', sidebarMenuLabel: 'Навигация', returnToTopLabel: 'К началу',
    outlineTitle: 'На этой странице', notFound: { title: 'Страница не найдена', quote: 'Проверьте адрес или откройте главную страницу документации.', linkLabel: 'На главную', linkText: 'На главную' },
    footer: { message: 'Ваша инфраструктура. Ваши правила.', copyright: 'dementia · Открытая панель управления VPN' },
   },
  },
 },
 themeConfig: {
  logo: '/assets/wordmark.svg', siteTitle: false,
  socialLinks: [{ icon: 'github', link: 'https://github.com/dementia-panel' }],
  search: { provider: 'local', options: { locales: { ru: { translations: {
   button: { buttonText: 'Поиск', buttonAriaLabel: 'Поиск в документации' },
   modal: { displayDetails: 'Показывать подробности', resetButtonTitle: 'Сбросить поиск', backButtonTitle: 'Закрыть поиск', noResultsText: 'Ничего не найдено', footer: { selectText: 'выбрать', navigateText: 'перейти', closeText: 'закрыть' } },
  } } } } },
 },
})
