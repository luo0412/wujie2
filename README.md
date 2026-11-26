# wujie2

Vue3 多 Tab 微前端模板 —— 一个主应用壳层 + 4 个异构子应用（Vue3 / Vue3 / Vue2 / React），通过 [wujie](https://wujie-micro.github.io/doc/) 以 iframe 沙箱方式挂载，alive 保活，切换页签时保留子应用状态。

在线预览：<https://luo0412.github.io/wujie2/>

## 功能

- **多页签外壳**：侧边导航 + 面包屑 + 多标签栏（固定首页、关闭/关闭其他/关闭全部），页签切换不丢状态。
- **keepAlive 控制**：路由 `meta.keepAlive` 决定主应用页面是否缓存；`false` 的页面（如临时表单）每次进入都会重新创建。
- **异构子应用**：App1、App2 是 Vue3 + Vite，App3 是 Vue2.7，App4 是 React 18，全部跑在 wujie 沙箱里，互不污染。
- **路由桥**：主应用把当前子应用页面路径通过 `$wujie.props.path` 与 `wujie bus`（`wj2:route`）下发，子应用据此切换内部视图。
- **事件总线**：主应用「Wujie API 演示」页可向活动子应用发 `wj2:ping`，子应用回 `wj2:child-event`，形成双向通信闭环。
- **壳层调试器**：右下角浮层可切换皮肤（浅色/深色）、灰度（色弱）、模拟登录/续期/过期/401，并显示 revision 与页签数。
- **导航守卫示例**：跳转 `/demo/no-cache?confirm=1` 会被 `router.beforeEach` 拦下，确认后带 `pass=1` 放行。

## 目录结构

```
.
├─ index.html                 主应用入口
├─ src/
│  ├─ main.js                 注册 Element Plus / wujie-vue3 / 路由
│  ├─ App.vue                 Shell 布局、RouterView + KeepAlive
│  ├─ router.js               hash 路由与导航守卫
│  ├─ components/             侧边菜单、标签栏、壳层调试器
│  ├─ pages/                  首页 / 关于 / 用户 / 临时表单 / 守卫 / API 演示 / 微应用宿主
│  ├─ store/                  auth、theme、tabs、bus
│  └─ styles/main.css         壳层与亮暗色样式
└─ apps/
   ├─ app1/                   Vue3 子应用（关于 / 用户 / 临时表单 / 富文本）
   ├─ app2/                   Vue3 子应用（关于 / 用户 / 临时表单 / 分类选择器）
   ├─ app3/                   Vue2 子应用（运行时编译，无需 SFC）
   └─ app4/                   React 子应用（关于 / 用户 / 临时表单 / 计数器）
```

## 本地运行

```bash
npm install --legacy-peer-deps
npm run dev      # http://localhost:5173
npm run build    # 主应用 + app3 两次构建，产物在 dist/
npm run preview  # 预览构建产物
```

> `apps/app1`、`apps/app2`、`apps/app4` 与主应用在一次 Vite 多入口构建里产出；`apps/app3` 是 Vue2，单独用 `vite.app3.config.js` 构建到 `dist/apps/app3`。

## 部署

构建产物直接发布到 `gh-pages` 分支，GitHub Pages 以该分支根目录为站点源：

```bash
npm run build
cd dist && git init -b gh-pages && git add -A \
  && git commit -m "deploy" \
  && git push -f <repo> gh-pages
```

全部资源使用相对路径（`base: './'`），因此可以放在任意子路径下（本仓库为 `/wujie2/`）。
