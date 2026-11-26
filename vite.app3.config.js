import { defineConfig } from 'vite'
import { resolve } from 'node:path'

// App3 是 Vue2 子应用（运行时编译），单独构建后落到 dist/apps/app3
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: resolve(__dirname, 'apps/app3/index.html'),
    },
  },
})
