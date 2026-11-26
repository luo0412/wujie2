import React, { useEffect, useState } from 'react'

const VIEWS = [
  { path: '/about', title: '关于' },
  { path: '/user', title: '用户' },
  { path: '/no-cache', title: '临时表单' },
  { path: '/counter', title: 'React 计数器' },
]

// 每个页面是独立组件，各自持有独立 state
function AboutPage() {
  const [text, setText] = useState('')
  return (
    <div className="card">
      <h3>关于</h3>
      <p>我是 App4，React 子应用，跑在 wujie 沙箱里，与 Vue 主应用共享页签与事件总线。</p>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="本页输入，切页再回来" />
      <span className="small">页面级保活：每个页面组件独享自己的 state。</span>
    </div>
  )
}

function UserPage() {
  const [text, setText] = useState('')
  return (
    <div className="card">
      <h3>用户</h3>
      <p>用户名：<b>app4-user</b></p>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="本页独立输入框" />
    </div>
  )
}

function NoCachePage() {
  const [text, setText] = useState('')
  return (
    <div className="card">
      <h3>临时表单 <span className="tag">不保活</span></h3>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="离开本页后输入会被清空" />
      <span className="small">该页不常驻，离开即卸载。</span>
    </div>
  )
}

function CounterPage() {
  const [count, setCount] = useState(0)
  return (
    <div className="card">
      <h3>React 计数器</h3>
      <p>计数：<b>{count}</b></p>
      <button className="badge" style={{ cursor: 'pointer' }} onClick={() => setCount(count + 1)}>＋ 加一</button>
    </div>
  )
}

const KEPT = [
  { path: '/about', el: AboutPage },
  { path: '/user', el: UserPage },
  { path: '/counter', el: CounterPage },
]

export default function App() {
  const [path, setPath] = useState('/about')
  const [ping, setPing] = useState(null)

  useEffect(() => {
    const wj = window.$wujie
    let lastProp = null
    const read = () => {
      const p = wj && wj.props && wj.props.path
      if (!p || p === lastProp) return
      lastProp = p
      setPath((cur) => (cur === p ? cur : p))
    }
    read()
    const timer = setInterval(read, 300)
    if (wj && wj.bus) {
      wj.bus.$on('wj2:route', (payload) => {
        if (payload && payload.app === 'app4') setPath(payload.path)
      })
      wj.bus.$on('wj2:ping', (payload) => {
        if (payload && payload.app !== 'app4') return
        setPing(payload)
        wj.bus.$emit('wj2:child-event', {
          app: 'app4',
          reply: 'pong from react',
          note: payload && payload.note,
          at: new Date().toLocaleTimeString('zh-CN'),
        })
      })
    }
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="app">
      <div className="top">
        <b>App4 · React</b>
        <span className="badge">react 18 + vite</span>
      </div>

      <div className="nav">
        {VIEWS.map((v) => (
          <button key={v.path} className={path === v.path ? 'on' : ''} onClick={() => setPath(v.path)}>
            {v.title}
          </button>
        ))}
      </div>

      {KEPT.map(({ path: p, el: Page }) => (
        <div key={p} hidden={path !== p}>
          <Page />
        </div>
      ))}

      {path === '/no-cache' && <NoCachePage />}

      {ping && (
        <div className="card" style={{ marginTop: 12 }}>
          <h3>收到主应用 bus 事件</h3>
          <pre>{JSON.stringify(ping)}</pre>
        </div>
      )}
    </div>
  )
}
