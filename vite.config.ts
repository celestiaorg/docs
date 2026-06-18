import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { vocs } from 'vocs/vite'

const root = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), vocs()],
  resolve: {
    alias: {
      '@': root,
      'next/image': path.join(root, 'src/vocs/compat/next-image.tsx'),
      'next/link': path.join(root, 'src/vocs/compat/next-link.tsx'),
      'nextra/components': path.join(root, 'src/vocs/compat/nextra-components.tsx'),
    },
  },
})
