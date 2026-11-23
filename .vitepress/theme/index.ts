import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { h } from 'vue'
import HomePage from './HomePage.vue'
import Endpoint from './Endpoint.vue'
import LanguageSwitch from './LanguageSwitch.vue'
import ChangelogPage from './ChangelogPage.vue'
import './style.css'

export default {
 extends: DefaultTheme,
 Layout() {
  return h(DefaultTheme.Layout, null, { 'nav-bar-content-after': () => h(LanguageSwitch) })
 },
 enhanceApp({ app }) {
  app.component('HomePage', HomePage)
  app.component('Endpoint', Endpoint)
  app.component('ChangelogPage', ChangelogPage)
 },
} satisfies Theme
