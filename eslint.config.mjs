import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import tseslint from 'typescript-eslint'

const globals = Object.fromEntries(
  [
    'AbortController',
    'Blob',
    'CSSStyleDeclaration',
    'Document',
    'Element',
    'Event',
    'EventSource',
    'File',
    'FormData',
    'Headers',
    'HTMLElement',
    'HTMLImageElement',
    'HTMLInputElement',
    'MouseEvent',
    'Request',
    'Response',
    'URL',
    'URLSearchParams',
    'WebSocket',
    'Window',
    'clearInterval',
    'clearTimeout',
    'console',
    'document',
    'fetch',
    'globalThis',
    'localStorage',
    'module',
    'process',
    'setInterval',
    'setTimeout',
    'window',
  ].map((name) => [name, 'readonly']),
)

export default defineConfig([
  globalIgnores([
    '.vocs/**',
    'build/**',
    'node_modules/**',
    'node-rpc-docs/**',
    'out/**',
    'public/_pagefind/**',
    'src/pages/**',
  ]),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,ts,tsx}'],
    languageOptions: {
      globals,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
])
