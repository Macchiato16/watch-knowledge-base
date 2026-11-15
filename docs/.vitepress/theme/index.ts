import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import WatchStructure3D from './components/WatchStructure3D.vue'
import PartFocusButton from './components/PartFocusButton.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('WatchStructure3D', WatchStructure3D)
    app.component('PartFocusButton', PartFocusButton)
  }
} satisfies Theme
