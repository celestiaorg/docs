import assert from 'node:assert/strict'
import { test } from 'node:test'
import { sidebarFor } from './vocs-sidebar.mjs'

function flatten(items) {
  return items.flatMap((item) => [
    ...(item.link ? [item] : []),
    ...flatten(item.items ?? []),
  ])
}

for (const section of ['learn', 'build', 'operate']) {
  test(`${section} sidebar lists each page only once`, async () => {
    const items = flatten(await sidebarFor(`app/${section}`, `/${section}`))
    const links = items.map((item) => item.link)
    assert.equal(new Set(links).size, links.length)
  })
}

for (const [section, route, title, previous, next] of [
  [
    'build',
    '/build/post-retrieve-blob/fibre',
    'Mocha walkthrough',
    '/build/post-retrieve-blob/overview',
    '/build/post-retrieve-blob/fibre/when-to-use',
  ],
  [
    'operate',
    '/operate/consensus-validators/fibre',
    'Run a Fibre server',
    '/operate/consensus-validators/validator-node',
    '/operate/consensus-validators/fibre/metrics',
  ],
]) {
  test(`${title} pagination follows the sidebar order`, async () => {
    const items = flatten(await sidebarFor(`app/${section}`, `/${section}`))
    const index = items.findIndex((item) => item.link === route)
    assert.equal(items[index].text, title)
    assert.equal(items[index - 1].link, previous)
    assert.equal(items[index + 1].link, next)
  })
}
