import assert from 'node:assert/strict'
import test from 'node:test'
import { renderToString } from 'react-dom/server'
import Playground from '../app/build/rpc/components/Playground'

test('RPC playground renders closed and open without throwing', () => {
  const render = (playgroundOpen: boolean) => renderToString(
    <Playground
      playgroundOpen={playgroundOpen}
      currentRequest='{"jsonrpc":"2.0","id":1,"method":"node.Info","params":[]}'
      setPlaygroundOpen={() => {}}
      setCurrentRequest={() => {}}
      setNotification={() => {}}
    />,
  )

  assert.equal(render(false), '')
  assert.doesNotThrow(() => render(true))
})
