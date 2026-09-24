import { copyFile, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const output = 'out/public'
await copyFile('worker/index.js', `${output}/_worker.js`)
if (process.env.DOCS_PREVIEW === '1') {
  // HTML also protects previews when served outside Pages (e.g. local review).
  for (const file of await readdir(output, { recursive: true })) {
    if (!file.endsWith('.html')) continue
    const target = path.join(output, file)
    const html = await readFile(target, 'utf8')
    await writeFile(target, html.replace('<head>', '<head><meta name="robots" content="noindex, nofollow">'))
  }
  await writeFile(`${output}/robots.txt`, 'User-agent: *\nDisallow: /\n')
}
