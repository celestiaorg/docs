import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs'

// Get the default MDX components from nextra-theme-docs
const themeComponents = getThemeComponents()

// Merge components
export function useMDXComponents(components) {
  return {
    ...themeComponents,
    ...components
  }
}