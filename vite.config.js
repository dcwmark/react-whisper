import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vite.dev/config/
export default defineConfig({
  define: {
    __WS_TOKEN__: JSON.stringify(process.env.WS_TOKEN ?? 'default_value'),
  },
  plugins: [preact()],
  // port for DEV
  server: {
    port: 3000,
  },
  // port for PREVIEW
  preview: {
    port: 3500,
  },
})
