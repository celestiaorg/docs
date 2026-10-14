'use client'

import { useSyncExternalStore, type ComponentProps } from 'react'
import { Tabs } from 'nextra/components'
import { getNetworkTabStore } from './network-tabs-store.mjs'

const getServerSnapshot = () => 0

export function NetworkTabs({
  storageKey,
  ...props
}: ComponentProps<typeof Tabs> & { storageKey: string }) {
  const store = getNetworkTabStore(storageKey)
  const selectedIndex = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    getServerSnapshot,
  )

  return <Tabs {...props} selectedIndex={selectedIndex} onChange={store.setIndex} />
}
