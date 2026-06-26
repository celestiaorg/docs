import { Children, isValidElement, type ReactNode } from 'react'
import { Callout as VocsCallout, Tab as VocsTab, Tabs as VocsTabs } from 'vocs'

type CalloutVariant = 'note' | 'info' | 'warning' | 'danger' | 'tip' | 'success'

type LegacyCalloutProps = {
  children: ReactNode
  type?: string
  variant?: CalloutVariant
  title?: string
}

const calloutTypeMap: Record<string, CalloutVariant> = {
  default: 'note',
  error: 'danger',
  info: 'info',
  warning: 'warning',
}

export function Callout({ children, type, variant, title }: LegacyCalloutProps) {
  return (
    <VocsCallout title={title} variant={variant ?? calloutTypeMap[type ?? 'default'] ?? 'note'}>
      {children}
    </VocsCallout>
  )
}

type LegacyTabsProps = {
  children: ReactNode
  items?: string[]
  stateKey?: string
}

type LegacyTabProps = {
  children: ReactNode
  title?: string
}

function LegacyTab({ children }: LegacyTabProps) {
  return <>{children}</>
}

function LegacyTabs({ children, items = [], stateKey }: LegacyTabsProps) {
  const tabs = Children.toArray(children).map((child, index) => {
    if (!isValidElement<LegacyTabProps>(child)) {
      return (
        <VocsTab key={index} title={items[index] ?? `Tab ${index + 1}`}>
          {child}
        </VocsTab>
      )
    }

    return (
      <VocsTab key={index} title={child.props.title ?? items[index] ?? `Tab ${index + 1}`}>
        {child.props.children}
      </VocsTab>
    )
  })

  return <VocsTabs stateKey={stateKey}>{tabs}</VocsTabs>
}

export const Tabs = Object.assign(LegacyTabs, { Tab: LegacyTab })

export function Steps({ children }: { children: ReactNode }) {
  return <div className="celestia-steps">{children}</div>
}
