#!/usr/bin/env node

import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseDocument } from 'yaml'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const appDir = path.join(rootDir, 'app')
const generatedPagesDir = path.join(rootDir, 'src/pages')
const vocsSourceDir = path.join(rootDir, 'src/vocs')
const generatedFiles = new Set()

const ignoredFiles = new Set(['_meta.js', 'layout.tsx'])

const toPosix = (filePath) => filePath.split(path.sep).join('/')

async function pathExists(filePath) {
  try {
    await readdir(filePath)
    return true
  } catch {
    return false
  }
}

function withVocsFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!frontmatterMatch) return content

  const document = parseDocument(frontmatterMatch[1])
  const frontmatter = document.toJS() ?? {}
  const legacyTheme = frontmatter.theme ?? {}

  if (legacyTheme.sidebar === false && !document.has('layout')) {
    document.set('layout', 'minimal')
  }

  if (legacyTheme.sidebar === false && !document.has('showSidebar')) {
    document.set('showSidebar', false)
  }

  if (legacyTheme.toc === false && !document.has('outline')) {
    document.set('outline', false)
  }

  return `---\n${String(document).trimEnd()}\n---\n${content.slice(frontmatterMatch[0].length)}`
}

function withVocsMdxCompatibility(content) {
  return withVocsFrontmatter(content)
    .replaceAll(
      /from\s+['"]nextra\/components['"]/g,
      "from '@/src/vocs/compat/nextra-components'",
    )
    .replaceAll(/from\s+['"]next\/link['"]/g, "from '@/src/vocs/compat/next-link'")
    .replaceAll(/from\s+['"]next\/image['"]/g, "from '@/src/vocs/compat/next-image'")
}

async function copyAppTree(currentDir = appDir) {
  const entries = await readdir(currentDir, { withFileTypes: true })

  for (const entry of entries) {
    const sourcePath = path.join(currentDir, entry.name)
    const relativePath = path.relative(appDir, sourcePath)

    if (entry.isDirectory()) {
      await copyAppTree(sourcePath)
      continue
    }

    if (!entry.isFile() || ignoredFiles.has(entry.name)) continue

    let targetRelativePath = relativePath
    if (entry.name === 'page.mdx' || entry.name === '_page._mdx') {
      targetRelativePath = path.join(path.dirname(relativePath), 'index.mdx')
    }

    const targetPath = path.join(generatedPagesDir, targetRelativePath)
    await mkdir(path.dirname(targetPath), { recursive: true })
    generatedFiles.add(toPosix(path.relative(generatedPagesDir, targetPath)))

    if (entry.name.endsWith('.mdx')) {
      const content = await readFile(sourcePath, 'utf8')
      await writeFile(targetPath, withVocsMdxCompatibility(content))
    } else {
      await cp(sourcePath, targetPath)
    }
  }
}

async function copyVocsRuntimeFiles() {
  const runtimeFiles = [
    ['root.css', '_root.css'],
    ['layout.tsx', '_layout.tsx'],
  ]

  for (const [sourceName, targetName] of runtimeFiles) {
    const sourcePath = path.join(vocsSourceDir, sourceName)
    const targetPath = path.join(generatedPagesDir, targetName)
    generatedFiles.add(toPosix(path.relative(generatedPagesDir, targetPath)))
    await cp(sourcePath, targetPath)
  }
}

async function removeStaleGeneratedFiles(currentDir = generatedPagesDir) {
  if (!(await pathExists(currentDir))) return

  const entries = await readdir(currentDir, { withFileTypes: true })

  for (const entry of entries) {
    const entryPath = path.join(currentDir, entry.name)

    if (entry.isDirectory()) {
      await removeStaleGeneratedFiles(entryPath)
      continue
    }

    if (!entry.isFile()) continue

    const relativePath = toPosix(path.relative(generatedPagesDir, entryPath))
    if (!generatedFiles.has(relativePath)) await rm(entryPath)
  }
}

async function main() {
  if (!(await pathExists(appDir))) {
    throw new Error(`Missing app directory at ${toPosix(appDir)}`)
  }

  await mkdir(generatedPagesDir, { recursive: true })

  await copyAppTree()
  await copyVocsRuntimeFiles()
  await removeStaleGeneratedFiles()

  console.log(`[prepare:vocs] Generated ${toPosix(path.relative(rootDir, generatedPagesDir))}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
