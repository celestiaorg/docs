"use client";

import { useMDXComponents } from "nextra-theme-docs";
import { ContentFooter } from "./ContentFooter";
import { ReactNode } from "react";
import type { EvaluateResult } from "nextra";

interface WrapperProps extends Omit<EvaluateResult, "default"> {
  children: ReactNode;
  bottomContent?: ReactNode;
}

/**
 * WrapperWithFooter extends Nextra's default wrapper to add ContentFooter
 * at the end of the main content (inside children).
 */
export function WrapperWithFooter(props: WrapperProps) {
  // Get Nextra's default wrapper (must be called inside component)
  const themeComponents = useMDXComponents();
  const DefaultWrapper = themeComponents.wrapper;

  // Detect if this is a landing page using frontmatter
  // Pages can explicitly mark themselves as landing pages by adding `landingPage: true` to frontmatter
  // This is more robust than relying on URL path depth
  const isLandingPage = Boolean(
    props.metadata &&
      "landingPage" in props.metadata &&
      (props.metadata as Record<string, unknown>).landingPage
  );

  // Wrap children to append ContentFooter at the end of the main content
  const enhancedChildren = !isLandingPage ? (
    <>
      {props.children}
      <ContentFooter />
    </>
  ) : (
    props.children
  );

  const enhancedProps: WrapperProps = {
    ...props,
    children: enhancedChildren,
  };

  return DefaultWrapper(enhancedProps);
}
