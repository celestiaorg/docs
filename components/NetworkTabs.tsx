'use client'

import { Children, isValidElement, useSyncExternalStore, type ReactNode } from 'react'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { getNetworkTabStore } from './network-tabs-store.mjs'

const getServerSnapshot = () => 0

export function NetworkTabs({ storageKey, items, children }: {
  storageKey: string
  items: string[]
  children: ReactNode
}) {
  const store = getNetworkTabStore(storageKey)
  const selectedIndex = useSyncExternalStore(store.subscribe, store.getSnapshot, getServerSnapshot)

  return (
    <TabGroup selectedIndex={selectedIndex} onChange={store.setIndex}>
      <TabList className="celestia-network-tabs">
        {items.map(item => <Tab key={item}>{item}</Tab>)}
      </TabList>
      <TabPanels>
        {Children.toArray(children).map((child, index) => (
          <TabPanel key={index} unmount={false}>
            {isValidElement<{ children: ReactNode }>(child) ? child.props.children : child}
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  )
}
