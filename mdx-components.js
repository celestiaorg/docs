import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs'
import { BaseImage } from './components/BaseImage'
import { WrapperWithFooter } from './components/WrapperWithFooter'
import { ContentFooter } from './components/ContentFooter'

// Get the default MDX components from nextra-theme-docs
const themeComponents = getThemeComponents()

// Merge components
export function useMDXComponents(components) {
  return {
    ...themeComponents,
    BaseImage,
    wrapper: WrapperWithFooter,
    ContentFooter,
    ...components
  }
}