import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  plugins: [
    tanstackStart(),
    devtools(),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
  ],
  optimizeDeps: {
    exclude: ['@noble/ciphers'],
  },
  ssr: {
    external: ['@prisma/client', '@noble/ciphers'],
  },
  build: {
    rollupOptions: {
      external: [
        'node:stream',
        'node:stream/web',
        'node:async_hooks',
      ],
    },
  },
  server: {
    host: true,
    allowedHosts: [
      'localhost',
      '.ngrok-free.app',
      'harmless-doe-monthly.ngrok-free.app',
      "https://vibecinema.vercel.app"
    ],
  },
})

export default config
