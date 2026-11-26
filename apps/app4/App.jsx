import React, { useEffect, useState } from 'react'

const VIEWS = [
  { path: '/about', title: '关于' },
  { path: '/user', title: '用户' },
  { path: '/no-cache', title: '临时表单' },
  { path: '/counter', title: 'React 计数器' },
]

export default function App() {
  const [path, setPath] = useState('/about')
  const [text, setText] = useState('')
  const [count, setCount] = useState(0)
  const [ping, setPing] = useState(null)

  useEffect(() => {
    const wj = window.$wujie
    const read = () => {
      const p = wj && wj.props && wj.props.path
      if (p) setPath(p)
    }
    read()
    const timer = setInterval(read, 400)
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

      {path === '/about' && (
        <div className="card">
          <h3>关于</h3>
          <p>我是 App4，React 子应用，跑在 wujie 沙箱里，与 Vue 主应用共享页签与事件总线。</p>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="随便输入，然后切换页签再回来" />
          <span className="small">alive 保活：切回本页时 React 状态仍在。</span>
        </div>
      )}

      {path === '/counter' && (
        <div className="card">
          <h3>React 计数器</h3>
          <p>计数：<b>{count}</b></p>
          <button className="nav" onClick={() => setCount(count + 1)} style={{ padding: 0, border: 0 }}>
            <span className="badge" style={{ cursor: 'pointer' }}>＋ 加一</span>
          </button>
        </div>
      )}

      {(path === '/user' || path === '/no-cache') && (
        <div className="card">
          <h3>{path === '/user' ? '用户' : '临时表单'}</h3>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="输入内容会在子应用内保留" />
        </div>
      )}

      {ping && (
        <div className="card" style={{ marginTop: 12 }}>
          <h3>收到主应用 bus 事件</h3>
          <pre>{JSON.stringify(ping)}</pre>
        </div>
      )}
    </div>
  )
}
