#!/usr/bin/env node
/**
 * Documentation generator for gRPC endpoints
 * 
 * This script generates the markdown content for gRPC endpoints sections
 * based on the endpoint configuration file.
 * 
 * Usage: node generate-grpc-docs.js [network]
 */

const fs = require('fs');
const path = require('path');

const CONFIG_FILE = path.join(__dirname, 'endpoint-config.json');

/**
 * Load endpoint configuration
 */
function loadConfig() {
  try {
    const configData = fs.readFileSync(CONFIG_FILE, 'utf8');
    return JSON.parse(configData);
  } catch (error) {
    console.error(`Failed to load config file: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Generate markdown for a network's gRPC endpoints
 */
function generateGrpcMarkdown(network, config) {
  const networkConfig = config.networks[network];
  if (!networkConfig) {
    throw new Error(`Network ${network} not found in configuration`);
  }

  const { grpcEndpoints } = networkConfig;
  let markdown = '';

  // Header section
  markdown += `## Community gRPC endpoints\n\n`;
  markdown += `The gRPC endpoint is to allow users to interact with a Celestia Node using\n`;
  markdown += `gRPC, a modern open-source and high-performance RPC framework. The default\n`;
  markdown += `port is 9090. In the Cosmos SDK, gRPC is used to define state queries and\n`;
  markdown += `broadcast transactions.\n\n`;

  // Explanation tip
  markdown += `:::tip Bridge Node Syncing\n`;
  markdown += `**Archival endpoints** maintain full blockchain history from genesis and are required for syncing new Bridge Nodes from scratch. If you need to sync a Bridge Node from genesis, use the archival endpoints listed below. Pruned endpoints are suitable for general transaction submission and maintaining already-synced nodes.\n`;
  markdown += `:::\n\n`;

  // Archival endpoints section
  if (grpcEndpoints.archival && grpcEndpoints.archival.length > 0) {
    markdown += `### Archival gRPC endpoints\n\n`;
    markdown += `These endpoints maintain full blockchain history and can be used for syncing Bridge Nodes from genesis:\n\n`;
    grpcEndpoints.archival.forEach(endpoint => {
      markdown += `- \`${endpoint}\`\n`;
    });
    markdown += '\n';
  }

  // Community endpoints section
  if (grpcEndpoints.community && grpcEndpoints.community.length > 0) {
    markdown += `### Pruned gRPC endpoints\n\n`;
    markdown += `These community-provided endpoints are suitable for general use:\n\n`;
    grpcEndpoints.community.forEach(endpoint => {
      markdown += `- \`${endpoint}\`\n`;
    });
    markdown += '\n';
  }

  return markdown;
}

/**
 * Update a markdown file with new gRPC endpoint content
 */
function updateMarkdownFile(filePath, network, config) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const newGrpcContent = generateGrpcMarkdown(network, config);
    
    // Replace the entire gRPC endpoints section
    const startMarker = '## Community gRPC endpoints';
    const endMarker = '## Community JSON-RPC Endpoints';
    
    const startIndex = content.indexOf(startMarker);
    const endIndex = content.indexOf(endMarker);
    
    if (startIndex === -1) {
      throw new Error('Could not find gRPC endpoints section start marker');
    }
    
    if (endIndex === -1) {
      throw new Error('Could not find gRPC endpoints section end marker');
    }
    
    const newContent = content.substring(0, startIndex) + 
                      newGrpcContent + 
                      content.substring(endIndex);
    
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${filePath} with new gRPC endpoints content`);
    
  } catch (error) {
    console.error(`Failed to update markdown file: ${error.message}`);
    throw error;
  }
}

/**
 * Main function
 */
function main() {
  const network = process.argv[2] || 'mocha';
  const config = loadConfig();
  
  console.log(`Generating gRPC documentation for ${network} network...`);
  
  try {
    // Generate markdown content
    const markdown = generateGrpcMarkdown(network, config);
    console.log('\nGenerated markdown content:');
    console.log('=' .repeat(50));
    console.log(markdown);
    console.log('=' .repeat(50));
    
    // Update the actual documentation file
    const docFile = path.join(__dirname, '../../how-to-guides/mocha-testnet.md');
    if (fs.existsSync(docFile)) {
      updateMarkdownFile(docFile, network, config);
    } else {
      console.log(`Documentation file not found: ${docFile}`);
    }
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  main();
}

module.exports = { 
  generateGrpcMarkdown, 
  updateMarkdownFile, 
  loadConfig 
};