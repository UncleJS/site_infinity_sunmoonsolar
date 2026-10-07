import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const root = fileURLToPath(new URL('.', import.meta.url))
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf-8')) as { version: string }

const rawSha = process.env.VITE_GIT_SHA || process.env.GITHUB_SHA || 'dev'
const gitShaFull = rawSha
const gitShaShort = rawSha === 'dev' ? 'dev' : rawSha.slice(0, 7)

/** YYYYMMDDHHMM in fixed GMT+2 (UTC+2), e.g. South Africa / SAST. */
function formatBuiltAtStamp(date: Date): string {
  const gmt2 = new Date(date.getTime() + 2 * 60 * 60 * 1000)
  const y = gmt2.getUTCFullYear()
  const mo = String(gmt2.getUTCMonth() + 1).padStart(2, '0')
  const d = String(gmt2.getUTCDate()).padStart(2, '0')
  const h = String(gmt2.getUTCHours()).padStart(2, '0')
  const mi = String(gmt2.getUTCMinutes()).padStart(2, '0')
  return `${y}${mo}${d}${h}${mi}`
}

const builtAtDate = new Date()
const builtAt = builtAtDate.toISOString()
const builtAtStamp = formatBuiltAtStamp(builtAtDate)

function versionJsonPlugin(): Plugin {
  return {
    name: 'version-json',
    closeBundle() {
      writeFileSync(
        resolve(root, 'dist/version.json'),
        `${JSON.stringify({
          version: pkg.version,
          gitSha: gitShaShort,
          gitShaFull,
          builtAt,
          builtAtStamp,
        }, null, 2)}\n`,
      )
    },
  }
}

export default defineConfig({
  base: './',
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __GIT_SHA__: JSON.stringify(gitShaShort),
    __GIT_SHA_FULL__: JSON.stringify(gitShaFull),
    __BUILT_AT__: JSON.stringify(builtAtStamp),
  },
  plugins: [
    react(),
    versionJsonPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifestFilename: 'manifest.json',
      includeAssets: ['icons/favicon.svg', 'icons/icon-192.png'],
      devOptions: {
        enabled: false,
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg}'],
      },
      manifest: {
        name: 'Sun Moon Solar Calculator',
        short_name: 'SunMoonSolar',
        description: 'Offline sun, moon and solar panel calculator',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: '.',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        ]
      }
    })
  ]
})
