import Vue from 'vue2/dist/vue.esm.js'
import '../app1/style.css'

const App = {
  data() {
    return {
      path: '/about',
      text: '',
      enabled: true,
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
    pingText() {
      return JSON.stringify(this.ping)
    },
  },
  mounted() {
    const wj = window.$wujie
    if (wj && wj.props && wj.props.path) this.path = wj.props.path
    if (wj && wj.bus) {
      wj.bus.$on('wj2:route', (payload) => {
        if (payload && payload.app === 'app3') this.path = payload.path
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
      const wj = window.$wujie
      if (wj && wj.bus) wj.bus.$emit('wj2:child-route', { app: 'app3', path })
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
    <div v-if="path === '/about'" class="card">
      <h3>关于</h3>
      <p>我是 App3，Vue2 技术栈，和 Vue3 子应用共用同一套壳层与页签体系。</p>
      <input v-model="text" placeholder="随便输入，然后切换页签再回来" />
      <span class="small">跨框架共存是 wujie 的核心能力之一。</span>
    </div>
    <div v-else-if="path === '/toggle'" class="card">
      <h3>Vue2 远程开关</h3>
      <p>当前状态：<b>{{ enabled ? '已开启' : '已关闭' }}</b></p>
      <button class="badge" style="cursor:pointer" @click="enabled = !enabled">{{ enabled ? '关闭开关' : '开启开关' }}</button>
    </div>
    <div v-else class="card">
      <h3>{{ path === '/user' ? '用户' : '临时表单' }}</h3>
      <input v-model="text" placeholder="输入内容会在子应用内保留" />
    </div>
    <div v-if="ping" class="card" style="margin-top:12px">
      <h3>收到主应用 bus 事件</h3>
      <pre>{{ pingText }}</pre>
    </div>
  </div>
  `,
}

new Vue({ render: (h) => h(App) }).$mount('#app')
