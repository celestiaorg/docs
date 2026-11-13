import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { renderToStaticMarkup } from 'react-dom/server'
import RPCMethod from '../app/build/rpc/components/RPCMethod'
import { extractAuth } from '../app/build/rpc/lib/helper'
import type { OpenRPCSpec } from '../app/build/rpc/lib/types'
import apiVersions from '../constants/node_api_versions.json'

const permissions = ['public', 'read', 'write', 'admin']

test('extractAuth reads legacy permissions without trailing prose or punctuation', () => {
  for (const permission of permissions) {
    assert.equal(extractAuth(`Auth level: ${permission}`), permission)
    assert.equal(extractAuth(`Auth level: ${permission}.`), permission)
    assert.equal(extractAuth(`Method details.\nAuth level: ${permission}\n`), permission)
  }
})

test('extractAuth excludes the expanded authentication tutorial', () => {
  for (const permission of permissions) {
    const description = `Auth level: ${permission}. Requests must include the HTTP header: \`Authorization: Bearer <token>\`.

Generate a token with \`celestia <node-type> auth ${permission}\`.

\`\`\`sh
curl -X POST -H "Authorization: Bearer $CELESTIA_NODE_AUTH_TOKEN" http://localhost:26658
\`\`\``
    assert.equal(extractAuth(description), permission)
    assert.equal(extractAuth(`Auth level: ${permission}\n\nFurther instructions.`), permission)
    assert.equal(extractAuth(`Auth level:\t${permission}. More details.`), permission)
  }
})

test('extractAuth leaves missing or malformed permissions empty', () => {
  for (const description of [undefined, '', 'Method details without an auth level.',
    'Auth level:', 'Auth level: ', 'Auth level: unknown.', 'Auth level: readonly.',
    'Auth level: admin-extra.', 'Auth level:\nRequests need a token.']) {
    assert.equal(extractAuth(description), '')
  }
})

for (const version of [apiVersions.mainnet, apiVersions.mocha, ...apiVersions.historical]) {
  test(`${version} renders only permission names in every RPC badge`, () => {
    const spec: OpenRPCSpec = JSON.parse(readFileSync(
      new URL(`../public/specs/openrpc-${version}.json`, import.meta.url), 'utf8',
    ))
    assert.ok(spec.methods.length > 0)
    const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window')
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: { location: { origin: 'https://docs.celestia.org', pathname: '/build/rpc/node-api/' } },
    })

    try {
      for (const rawSpec of spec.methods) {
        const [pkg, name] = rawSpec.name.split('.')
        const auth = extractAuth(rawSpec.description)
        assert.ok(permissions.includes(auth), `${version}: ${rawSpec.name} has invalid permission ${JSON.stringify(auth)}`)
        const markup = renderToStaticMarkup(
          <RPCMethod
            pkg={pkg}
            method={{ name, auth, description: rawSpec.summary, params: rawSpec.params || [],
              result: rawSpec.result || { name: '', schema: {} }, rawSpec }}
            activateSidebar={() => {}}
            selectedVersion={version}
            setCurrentRequest={() => {}}
            setPlaygroundOpen={() => {}}
          />,
        )
        assert.ok(markup.includes(`<span class="rpc-method__auth">perms: ${auth}</span>`), rawSpec.name)
      }
    } finally {
      if (previousWindow) Object.defineProperty(globalThis, 'window', previousWindow)
      else Reflect.deleteProperty(globalThis, 'window')
    }
  })
}
