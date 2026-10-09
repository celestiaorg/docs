import { visit } from 'unist-util-visit'

// Vocs handles markdown links, but markdown images also need the preview base.
export default function remarkBaseImages({ basePath = '/' } = {}) {
  const base = basePath.replace(/\/$/, '')
  return (tree) => {
    if (!base) return
    visit(tree, 'image', (node) => {
      if (node.url.startsWith('/') && !node.url.startsWith('//')
        && !node.url.startsWith(`${base}/`)) {
        node.url = `${base}${node.url}`
      }
    })
  }
}
