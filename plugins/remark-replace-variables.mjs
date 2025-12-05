/**
 * Remark plugin to replace template variables in code blocks and inline code.
 * 
 * This plugin processes markdown AST nodes and replaces patterns like:
 *   {{mainnetVersions['app-latest-tag']}}
 *   {{mochaVersions['node-latest-tag']}}
 * 
 * with their actual values from the constants.
 * 
 * This runs BEFORE MDX processing, so the code blocks remain as regular
 * fenced code blocks with Nextra's built-in styling.
 */

import { visit } from 'unist-util-visit';
import { createRequire } from 'module';

// Use createRequire to import JSON files in ESM context
const require = createRequire(import.meta.url);
const mainnetVersions = require('../constants/mainnet_versions.json');
const mochaVersions = require('../constants/mocha_versions.json');
const arabicaVersions = require('../constants/arabica_versions.json');
const constants = require('../constants/general.json');

// Create a context object with all available variables
const variableContext = {
  mainnetVersions,
  mochaVersions,
  arabicaVersions,
  constants,
};

/**
 * Safely evaluates a variable expression like:
 *   mainnetVersions['app-latest-tag']
 *   mochaVersions["node-latest-tag"]
 * 
 * @param {string} expression - The expression to evaluate
 * @returns {string|null} - The resolved value or null if not found
 */
function resolveExpression(expression) {
  // Match patterns like: objectName['key'] or objectName["key"]
  const match = expression.match(/^(\w+)\[['"]([^'"]+)['"]\]$/);
  
  if (!match) {
    console.warn(`[remark-replace-variables] Invalid expression syntax: ${expression}`);
    return null;
  }

  const [, objectName, key] = match;
  const obj = variableContext[objectName];

  if (!obj) {
    console.warn(`[remark-replace-variables] Unknown variable object: ${objectName}`);
    return null;
  }

  const value = obj[key];
  if (value === undefined) {
    console.warn(`[remark-replace-variables] Unknown key "${key}" in ${objectName}`);
    return null;
  }

  return String(value);
}

/**
 * Replaces all {{expression}} patterns in a string with their resolved values.
 * 
 * @param {string} text - The text to process
 * @returns {string} - The text with variables replaced
 */
function replaceVariables(text) {
  // Match {{...}} patterns, being careful not to match {{{...}}} (triple braces)
  return text.replace(/\{\{([^{}]+)\}\}/g, (match, expression) => {
    const trimmedExpr = expression.trim();
    const resolved = resolveExpression(trimmedExpr);
    
    if (resolved !== null) {
      return resolved;
    }
    
    // If we couldn't resolve it, leave the original text
    return match;
  });
}

/**
 * The remark plugin function.
 */
export default function remarkReplaceVariables() {
  return (tree) => {
    visit(tree, (node) => {
      // Handle fenced code blocks
      if (node.type === 'code' && typeof node.value === 'string') {
        node.value = replaceVariables(node.value);
      }
      
      // Handle inline code
      if (node.type === 'inlineCode' && typeof node.value === 'string') {
        node.value = replaceVariables(node.value);
      }

      // Handle regular text nodes (paragraphs, etc.)
      if (node.type === 'text' && typeof node.value === 'string') {
        node.value = replaceVariables(node.value);
      }
    });
  };
}
