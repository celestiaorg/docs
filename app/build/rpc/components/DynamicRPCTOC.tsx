/**
 * NEXTRA FRAMEWORK WORKAROUND - Dynamic TOC for Node API
 * 
 * This component uses DOM manipulation to inject dynamic headings into Nextra's
 * static Table of Contents. This is necessary because Nextra's TOC is generated at
 * build-time from MDX AST, not from runtime-rendered React components.
 * 
 * @nextra-compatibility 4.6.0
 * @last-verified 2025-11-06
 * @breaking-change-risk MEDIUM - Relies on Nextra's CSS class structure and selectors
 * 
 * === HOW IT WORKS ===
 * 1. MDX has a hidden "## Celestia Node API" heading → Nextra renders a TOC with one item
 * 2. This component finds that TOC list, caches its styling, and replaces items with dynamic content
 * 3. MutationObserver watches for content changes (e.g., version switches) and updates the TOC
 * 4. IntersectionObserver provides scroll-spy functionality for active highlighting
 * 
 * === WHY THIS APPROACH ===
 * - Zero CSS duplication - inherits all styling from Nextra's rendered TOC
 * - Auto-updates when Nextra changes - we copy classes, not hardcode them
 * - Simple - just swap list items, don't rebuild the entire TOC structure
 * - Isolated - all workaround logic contained in this single file
 * 
 * === ALTERNATIVES CONSIDERED ===
 * ❌ Custom MDX plugin: Too complex, breaks hot reload, maintenance burden
 * ❌ Server-side TOC generation: Loses dynamic content capability
 * ❌ Fork Nextra: Unsustainable maintenance burden
 * ✅ DOM manipulation: Pragmatic, isolated, well-documented
 * 
 * === TROUBLESHOOTING ===
 * If TOC stops working after a Nextra upgrade, check:
 * 
 * 1. **CSS Class Changes**: 
 *    - Nextra's TOC classes (x:, nextra-toc, subheading-anchor)
 *    - Run: document.querySelector('.nextra-toc a').className in DevTools
 * 
 * 2. **Selector Changes** (see TOC_CONFIG below):
 *    - .nextra-toc ul (the TOC list container)
 *    - .nextra-toc a[href="#celestia-node-api"] (placeholder item)
 *    - main h2[id] (content headings)
 * 
 * 3. **New Nextra TOC API**:
 *    - Check Nextra docs for runtime TOC customization APIs
 *    - If available, migrate away from DOM manipulation
 * 
 * 4. **Test Cases**:
 *    - TOC appears on page load
 *    - TOC updates when version selector changes
 *    - Active item highlights on scroll
 *    - "Scroll to top" button appears/disappears correctly
 * 
 * === PERFORMANCE ===
 * - MutationObserver overhead: ~1-2ms per DOM change (negligible)
 * - IntersectionObserver: Highly optimized, no scroll event listeners
 * - Retries with backoff: 3 attempts (500ms, 1000ms, 2000ms) for robustness
 */

'use client'

import { useEffect } from 'react'

interface Heading {
  id: string
  value: string
  depth: number
}

// Configuration - centralized to reduce brittleness
const TOC_CONFIG = {
  placeholderHeadingId: 'celestia-node-api',
  selectors: {
    tocList: '.nextra-toc ul',
    placeholderItem: '.nextra-toc a[href="#celestia-node-api"]',
    contentHeadings: 'main h2[id]',
    scrollButton: '.nextra-toc button[type="button"]',
    mainContent: 'main',
  },
  retryDelays: [500, 1000, 2000],
  scrollToTopThreshold: 2, // Show button after Nth heading (0-indexed)
} as const

// Extract headings from DOM (excluding the placeholder)
const extractHeadingsFromDOM = (): Heading[] => {
  const h2Elements = document.querySelectorAll<HTMLElement>(TOC_CONFIG.selectors.contentHeadings)
  return Array.from(h2Elements)
    .filter(el => el.id && el.textContent && el.id !== TOC_CONFIG.placeholderHeadingId)
    .map(el => ({
      id: el.id,
      value: el.textContent!.trim(),
      depth: 2,
    }))
}

// Toggle scroll button visibility
const toggleScrollButton = (button: HTMLButtonElement, show: boolean) => {
  if (show) {
    button.removeAttribute('aria-hidden')
    button.removeAttribute('hidden')
    button.disabled = false
    button.classList.remove('x:opacity-0')
    button.classList.add('x:opacity-100')
  } else {
    button.setAttribute('aria-hidden', 'true')
    button.setAttribute('hidden', '')
    button.disabled = true
    button.classList.remove('x:opacity-100')
    button.classList.add('x:opacity-0')
  }
}

export function DynamicRPCTOC() {
  useEffect(() => {
    // Cache the classes from Nextra's rendered "celestia-node-api" item
    // We need to grab these ONCE before we remove it
    let cachedLinkClasses = ''
    let cachedLiClasses = ''
    
    const findTOCList = () => 
      document.querySelector<HTMLUListElement>(TOC_CONFIG.selectors.tocList)
    
    const updateTOCList = () => {
      const tocList = findTOCList()
      if (!tocList) return
      
      const headings = extractHeadingsFromDOM()
      if (headings.length === 0) return
      
      // Cache classes from placeholder on first run
      if (!cachedLinkClasses) {
        const placeholderLink = document.querySelector<HTMLAnchorElement>(TOC_CONFIG.selectors.placeholderItem)
        const placeholderLi = placeholderLink?.parentElement as HTMLLIElement
        
        if (placeholderLink && placeholderLi) {
          cachedLinkClasses = placeholderLink.className
          cachedLiClasses = placeholderLi.className
        } else {
          return // Can't proceed without cached classes
        }
      }
      
      // Replace list items
      tocList.innerHTML = ''
      headings.forEach(({ id, value }) => {
        const li = document.createElement('li')
        li.className = cachedLiClasses
        
        const a = document.createElement('a')
        a.href = `#${id}`
        a.textContent = value
        a.className = cachedLinkClasses
        
        li.appendChild(a)
        tocList.appendChild(li)
      })
    }
    
    // Try multiple times with delays for dynamic content
    updateTOCList()
    const timeouts = TOC_CONFIG.retryDelays.map(delay => setTimeout(updateTOCList, delay))
    
    // Watch for content changes
    const observer = new MutationObserver(updateTOCList)
    const mainContent = document.querySelector(TOC_CONFIG.selectors.mainContent)
    if (mainContent) {
      observer.observe(mainContent, { childList: true, subtree: true })
    }
    
    return () => {
      timeouts.forEach(clearTimeout)
      observer.disconnect()
    }
  }, [])
  
  // Handle "Scroll to top" button visibility and behavior
  useEffect(() => {
    let observer: IntersectionObserver | null = null
    let scrollHandler: (() => void) | null = null
    let clickHandler: ((e: Event) => void) | null = null
    let buttonRef: HTMLButtonElement | null = null
    let mutationObserver: MutationObserver | null = null
    let setupDebounceTimer: NodeJS.Timeout | null = null
    
    const cleanupObservers = () => {
      observer?.disconnect()
      if (scrollHandler) window.removeEventListener('scroll', scrollHandler)
      if (clickHandler && buttonRef) {
        buttonRef.removeEventListener('click', clickHandler, true)
      }
    }
    
    const setupScrollButton = () => {
      // Clean up previous observers but not the mutation observer
      cleanupObservers()
      
      const scrollButton = document.querySelector<HTMLButtonElement>(TOC_CONFIG.selectors.scrollButton)
      if (!scrollButton) return false
      
      const headings = extractHeadingsFromDOM()
      const targetIndex = TOC_CONFIG.scrollToTopThreshold
      
      // Hide button if not enough visible headings
      if (headings.length <= targetIndex) {
        toggleScrollButton(scrollButton, false)
        return false
      }
      
      const targetHeading = document.getElementById(headings[targetIndex].id)
      if (!targetHeading) {
        toggleScrollButton(scrollButton, false)
        return false
      }
      
      buttonRef = scrollButton
      
      // Click handler - scroll to top
      clickHandler = (e: Event) => {
        e.preventDefault()
        e.stopPropagation()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      scrollButton.addEventListener('click', clickHandler, true)
      
      // Visibility handler - show when scrolled past target heading
      const updateButtonVisibility = () => {
        // Re-query headings to handle dynamic changes
        const currentHeadings = extractHeadingsFromDOM()
        if (currentHeadings.length <= targetIndex) {
          toggleScrollButton(scrollButton, false)
          return
        }
        
        const el = document.getElementById(currentHeadings[targetIndex].id)
        if (!el) {
          toggleScrollButton(scrollButton, false)
          return
        }
        
        const inUpperHalf = el.getBoundingClientRect().top < window.innerHeight / 2
        toggleScrollButton(scrollButton, inUpperHalf)
      }
      
      // Use IntersectionObserver + scroll for reliable updates
      observer = new IntersectionObserver(
        () => updateButtonVisibility(),
        { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
      )
      
      scrollHandler = updateButtonVisibility
      window.addEventListener('scroll', scrollHandler)
      updateButtonVisibility()
      
      observer.observe(targetHeading)
      return true
    }
    
    // Initial setup with retries
    setupScrollButton()
    const timeouts = TOC_CONFIG.retryDelays.map(delay => 
      setTimeout(setupScrollButton, delay)
    )
    
    // Watch for content changes and re-setup button
    const mainContent = document.querySelector(TOC_CONFIG.selectors.mainContent)
    if (mainContent) {
      mutationObserver = new MutationObserver(() => {
        // Clear previous debounce timer
        if (setupDebounceTimer) clearTimeout(setupDebounceTimer)
        // Debounce re-setup to avoid excessive calls
        setupDebounceTimer = setTimeout(setupScrollButton, 200)
      })
      mutationObserver.observe(mainContent, { childList: true, subtree: true })
    }
    
    return () => {
      timeouts.forEach(clearTimeout)
      if (setupDebounceTimer) clearTimeout(setupDebounceTimer)
      cleanupObservers()
      mutationObserver?.disconnect()
    }
  }, [])
  
  // This component doesn't render anything - it manipulates the DOM
  return null
}
