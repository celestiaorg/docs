import { createHash } from 'node:crypto'
import { appendFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

export function deploymentTarget(env) {
  if (!/^[a-z0-9-]+\.pages\.dev$/.test(env.PAGES_HOST || '')) throw new Error('Invalid Pages hostname')
  const production = env.GITHUB_EVENT_NAME !== 'pull_request' && env.GITHUB_REF === 'refs/heads/main'
  let branch = 'main'
  if (!production) {
    if (env.GITHUB_EVENT_NAME === 'pull_request') {
      if (!/^[1-9]\d*$/.test(env.PR_NUMBER || '')) throw new Error('Invalid PR number')
      branch = `pr-${env.PR_NUMBER}`
    } else {
      if (!env.GITHUB_REF?.startsWith('refs/heads/')) throw new Error('Select a branch to deploy')
      branch = `preview-${createHash('sha256').update(env.GITHUB_REF).digest('hex').slice(0, 12)}`
    }
  }
  return {
    PAGES_BRANCH: branch,
    VOCS_BASE_URL: production ? 'https://docs.celestia.org' : `https://${branch}.${env.PAGES_HOST}`,
    DOCS_PREVIEW: production ? '0' : '1',
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const target = deploymentTarget(process.env)
  appendFileSync(process.env.GITHUB_ENV, Object.entries(target).map(([key, value]) => `${key}=${value}\n`).join(''))
}
