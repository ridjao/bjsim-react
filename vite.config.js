import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    react(), 
    viteTsconfigPaths(),
    svgr()
  ],
  server: {
    open: true,
    port: 3000,
  },
  build: {
    outDir: 'build',
  },
})