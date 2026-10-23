import assert from 'node:assert/strict'
import test from 'node:test'
import { deploymentTarget } from './cloudflare-target.mjs'
const base = { PAGES_HOST: 'celestia-docs.pages.dev', GITHUB_REF: 'refs/heads/main' }
test('main push and manual runs deploy production', () => {
  for (const event of ['push', 'workflow_dispatch']) {
    assert.deepEqual(deploymentTarget({ ...base, GITHUB_EVENT_NAME: event }), {
      PAGES_BRANCH: 'main', VOCS_BASE_URL: 'https://docs.celestia.org', DOCS_PREVIEW: '0',
    })
  }
})
test('PRs use an isolated numeric alias even when the source branch is main', () => {
  assert.deepEqual(deploymentTarget({ ...base, GITHUB_EVENT_NAME: 'pull_request', PR_NUMBER: '2536' }), {
    PAGES_BRANCH: 'pr-2536', VOCS_BASE_URL: 'https://pr-2536.celestia-docs.pages.dev', DOCS_PREVIEW: '1',
  })
})
test('manual preview aliases are stable and avoid branch sanitisation collisions', () => {
  const a = deploymentTarget({ ...base, GITHUB_REF: 'refs/heads/fix/a' })
  const b = deploymentTarget({ ...base, GITHUB_REF: 'refs/heads/fix-a' })
  assert.notEqual(a.PAGES_BRANCH, b.PAGES_BRANCH)
  assert.equal(a.DOCS_PREVIEW, '1')
  assert.deepEqual(a, deploymentTarget({ ...base, GITHUB_REF: 'refs/heads/fix/a' }))
})
test('invalid targets fail closed', () => {
  for (const env of [{ PAGES_HOST: 'bad\nhost' }, { GITHUB_REF: 'refs/tags/main' }, { GITHUB_EVENT_NAME: 'pull_request', PR_NUMBER: 'main' }]) {
    assert.throws(() => deploymentTarget({ ...base, ...env }))
  }
})
