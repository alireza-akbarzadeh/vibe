
import { defineConfig, PluginOption } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer';
import { devtools } from '@tanstack/devtools-vite'
import { sentryTanstackStart } from "@sentry/tanstackstart-react";
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { wss } from './src/server/ws'

const webSocketServer = {
  name: 'webSocketServer',
  configureServer(server: any) {
    server.httpServer.on('upgrade', (req: any, socket: any, head: any) => {
      if (req.url === '/ws') {
        wss.handleUpgrade(req, socket, head, (ws: any) => {
          wss.emit('connection', ws, req);
        });
      }
    });
  },
};

const config = defineConfig({
  plugins: [
    webSocketServer,
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
    devtools({
      eventBusConfig: {
        port: 42070,
      },
    }),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    viteReact({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
    process.env.VITE_VISUALIZE && visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean) as PluginOption[],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  optimizeDeps: {
    exclude: ['@noble/ciphers', 'better-auth', '@prisma/client'],
  },
  build: {
    rollupOptions: {
      external: [
        'node:stream',
        'node:stream/web',
        'node:async_hooks',
        '@sentry/tanstackstart-react',
      ],
    },
  },
  ssr: {
    external: ['better-auth', '@noble/ciphers', '@prisma/client'],
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


