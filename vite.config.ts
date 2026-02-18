import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { sentryTanstackStart } from "@sentry/tanstackstart-react";
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  plugins: [
    tanstackRouter({
      autoCodeSplitting: true,
      codeSplittingOptions: {
        defaultBehavior: [
          ['component', 'pendingComponent'], // Main UI components together
          ['errorComponent'],
          ['notFoundComponent'],
        ],
        // Admin routes get their own splitting strategy
        splitBehavior: ({ routeId }: { routeId: string }) => {
          // Admin dashboard routes - split aggressively
          if (routeId.startsWith('/(admin)')) {
            return [['component'], ['errorComponent'], ['notFoundComponent']]
          }
          // Heavy static pages - split everything separately
          if (routeId.includes('/terms') || routeId.includes('/privacy') || routeId.includes('/license')) {
            return [['component']]
          }
        },
      },
    }),
    tanstackStart(),
    sentryTanstackStart({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
    devtools(),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    viteReact({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
  optimizeDeps: {
    exclude: ['@prisma/client', '.prisma/client', '@noble/ciphers', 'better-auth'],
  },
  build: {
    rollupOptions: {
      external: [
        'node:stream',
        'node:stream/web',
        'node:async_hooks',
        '@prisma/client',
      ],
    },
  },
  ssr: {
    external: ['@prisma/client', '.prisma/client', 'better-auth', '@noble/ciphers'],
  },
  server: {
    host: true,
    allowedHosts: [
      'localhost',
      '.ngrok-free.app',
      'harmless-doe-monthly.ngrok-free.app',
    ],
  },
})

export default config


