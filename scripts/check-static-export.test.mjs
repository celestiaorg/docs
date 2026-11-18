import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const checker = fileURLToPath(new URL('./check-static-export.mjs', import.meta.url))

for (const base of ['', '/docs']) {
  for (const [name, mcpEnabled, cardExists, link, passes] of [
    ['optional MCP card', false, false, '/mcp/server-card', true],
    ['advertised MCP card', true, true, '/mcp/server-card', true],
    ['missing advertised MCP card', true, false, '/mcp/server-card', false],
    ['missing ordinary asset', false, false, '/missing.svg', false],
  ]) {
    test(`${name} with BASE=${base || '/'}`, (t) => {
      const directory = mkdtempSync(path.join(tmpdir(), 'docs-static-export-'))
      t.after(() => rmSync(directory, { recursive: true, force: true }))
      const files = {
        'app/page.mdx': '# Home',
        'src/pages/index.mdx': '# Home',
        'out/public/index.html': `<a href="${base}${link}">Resource</a>`,
        'out/public/.well-known/ai-catalog.json': JSON.stringify({
          entries: mcpEnabled ? [{ type: 'application/mcp-server-card+json' }] : [],
        }),
      }
      if (cardExists) files['out/public/mcp/server-card'] = '{}'
      for (const [file, content] of Object.entries(files)) {
        const target = path.join(directory, file)
        mkdirSync(path.dirname(target), { recursive: true })
        writeFileSync(target, content)
      }
      const result = spawnSync(process.execPath, [checker], {
        cwd: directory,
        encoding: 'utf8',
        env: { ...process.env, BASE: base, DOCS_MCP_ENABLED: '' },
      })
      assert.equal(result.status, passes ? 0 : 1, result.stderr)
      if (!passes) assert.ok(result.stderr.includes(`missing asset/page ${base}${link}`), result.stderr)
    })
  }
}
