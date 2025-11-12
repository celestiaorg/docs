'use client';

import { useMDXComponents } from 'nextra-theme-docs';
import { usePathname } from 'next/navigation';
import { ContentFooter } from './ContentFooter';

const themeComponents = useMDXComponents();
const DefaultWrapper = themeComponents.wrapper;

/**
 * WrapperWithFooter extends Nextra's default wrapper to add ContentFooter 
 * at the end of the main content (inside children).
 */
export function WrapperWithFooter(props: any) {
  const pathname = usePathname();
  
  // Detect if this is a landing page (root or section index)
  // Landing pages are at depth 0 (/) or depth 1 (/learn, /operate, /build)
  // Article pages are at depth 2+ (/learn/celestia-101/celestia)
  const pathSegments = pathname.split('/').filter(segment => segment.length > 0);
  const isLandingPage = pathSegments.length <= 1;
  
  // Wrap children to append ContentFooter at the end of the main content
  const enhancedChildren = !isLandingPage ? (
    <>
      {props.children}
      <ContentFooter />
    </>
  ) : props.children;
  
  const enhancedProps = {
    ...props,
    children: enhancedChildren
  };
  
  return DefaultWrapper(enhancedProps);
}

