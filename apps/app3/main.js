import Vue from 'vue2/dist/vue.esm.js'
import '../app1/style.css'

const AboutPage = {
  name: 'AboutPage',
  data: () => ({ text: '' }),
  template: `
    <div class="card">
      <h3>关于</h3>
      <p>我是 App3，Vue2 技术栈，和 Vue3 子应用共用同一套壳层与页签体系。</p>
      <input v-model="text" placeholder="本页输入，切页再回来" />
      <span class="small">页面级保活：每页独立组件、独立 state。</span>
    </div>`,
}

const UserPage = {
  name: 'UserPage',
  data: () => ({ text: '' }),
  template: `
    <div class="card">
      <h3>用户</h3>
      <p>用户名：<b>app3-user</b></p>
      <input v-model="text" placeholder="本页独立输入框" />
    </div>`,
}

const NoCachePage = {
  name: 'NoCachePage',
  data: () => ({ text: '' }),
  template: `
    <div class="card">
      <h3>临时表单 <span class="tag">不保活</span></h3>
      <input v-model="text" placeholder="离开本页后输入会被清空" />
    </div>`,
}

const TogglePage = {
  name: 'TogglePage',
  data: () => ({ enabled: true }),
  template: `
    <div class="card">
      <h3>Vue2 远程开关</h3>
      <p>当前状态：<b>{{ enabled ? '已开启' : '已关闭' }}</b></p>
      <button class="badge" style="cursor:pointer" @click="enabled = !enabled">
        {{ enabled ? '关闭开关' : '开启开关' }}
      </button>
    </div>`,
}

const PAGES = {
  '/about': AboutPage,
  '/user': UserPage,
  '/no-cache': NoCachePage,
  '/toggle': TogglePage,
}

const App = {
  data() {
    return {
      path: '/about',
      ping: null,
      views: [
        { path: '/about', title: '关于' },
        { path: '/user', title: '用户' },
        { path: '/no-cache', title: '临时表单' },
        { path: '/toggle', title: 'Vue2 远程开关' },
      ],
    }
  },
  computed: {
    current() {
      return PAGES[this.path] || AboutPage
    },
    cached() {
      return ['AboutPage', 'UserPage', 'TogglePage']
    },
    pingText() {
      return JSON.stringify(this.ping)
    },
  },
  mounted() {
    const wj = window.$wujie
    if (wj && wj.props && PAGES[wj.props.path]) this.path = wj.props.path
    if (wj && wj.bus) {
      wj.bus.$on('wj2:route', (payload) => {
        if (payload && payload.app === 'app3' && PAGES[payload.path]) this.path = payload.path
      })
      wj.bus.$on('wj2:ping', (payload) => {
        if (payload && payload.app !== 'app3') return
        this.ping = payload
        wj.bus.$emit('wj2:child-event', {
          app: 'app3',
          reply: 'pong from vue2',
          note: payload && payload.note,
          at: new Date().toLocaleTimeString('zh-CN'),
        })
      })
    }
  },
  methods: {
    go(path) {
      this.path = path
    },
  },
  template: `
  <div class="app">
    <div class="top">
      <b>App3 · Vue2</b>
      <span class="badge">vue2.7</span>
    </div>
    <div class="nav">
      <button v-for="v in views" :key="v.path" :class="{ on: path === v.path }" @click="go(v.path)">{{ v.title }}</button>
    </div>
    <keep-alive :include="cached">
      <component :is="current" :key="path" />
    </keep-alive>
    <div v-if="ping" class="card" style="margin-top:12px">
      <h3>收到主应用 bus 事件</h3>
      <pre>{{ pingText }}</pre>
    </div>
  </div>
  `,
}

new Vue({ render: (h) => h(App) }).$mount('#app')
