import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import WujieVue from 'wujie-vue3'
import App from './App.vue'
import router from './router'
import './styles/main.css'
import { ensureAuth } from './store/auth'

ensureAuth()

const app = createApp(App)
app.use(ElementPlus, { locale: zhCn })
app.use(WujieVue)
app.use(router)
app.mount('#app')
