#!/usr/bin/env node
/**
 * Script to check gRPC endpoints for archival vs pruned node classification
 * 
 * This script attempts to query each gRPC endpoint for block height 1 to determine
 * if the node is archival (has full history) or pruned (recent blocks only).
 * 
 * Usage: node check-grpc-endpoints.js
 */

const https = require('https');
const http = require('http');

// List of gRPC endpoints from mocha-testnet.md
const GRPC_ENDPOINTS = [
  'public-celestia-mocha4-consensus.numia.xyz:9090',
  'grpc-mocha.pops.one',
  'grpc.celestia-mocha.com:443',
  'full.consensus.mocha-4.celestia-mocha.com:9090',
  'consensus-full-mocha-4.celestia-mocha.com:9090',
  'celestia-testnet.brightlystake.com:9390',
  'grpc-celestia-mocha.trusted-point.com:9099',
  'grpc-celestia-testnet-01.stakeflow.io:16002',
  'mocha.grpc.cumulo.me:443',
  'grpc.archive.mocha.cumulo.com.es:443',
  'grpc-1.testnet.celestia.nodes.guru:10790',
  'grpc-2.testnet.celestia.nodes.guru:10790',
  'celestia-testnet-grpc.itrocket.net:443',
  'celestia-t-grpc.noders.services:21090',
  'celestiam.grpc.lava.build:443',
  'grpc-celestia-testnet.mzonder.com:443'
];

/**
 * Convert gRPC endpoint to potential REST endpoint
 * Many Cosmos SDK nodes expose REST API on port 1317 or similar
 */
function grpcToRestEndpoint(grpcEndpoint) {
  const [host, port] = grpcEndpoint.split(':');
  
  // Common patterns for Cosmos SDK REST endpoints
  const restEndpoints = [
    `https://${host}:1317`,
    `https://${host}:443`,
    `http://${host}:1317`,
    `https://api-${host.replace('grpc', '').replace('-', '')}.com`,
    `https://${host.replace('grpc', 'api')}:443`,
  ];
  
  return restEndpoints;
}

/**
 * Check if endpoint can serve block height 1 via REST API
 */
async function checkBlockHeight1(endpoint) {
  const urls = [
    `${endpoint}/cosmos/base/tendermint/v1beta1/blocks/1`,
    `${endpoint}/blocks/1`,
    `${endpoint}/block?height=1`,
    `${endpoint}/cosmos/base/tendermint/v1beta1/blocks/latest`,
  ];

  for (const url of urls) {
    try {
      const result = await makeRequest(url);
      if (result.success) {
        return { success: true, endpoint: url, data: result.data };
      }
    } catch (error) {
      // Continue to next URL
    }
  }
  
  return { success: false, endpoint };
}

/**
 * Make HTTP request with timeout
 */
function makeRequest(url, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const req = protocol.get(url, {
      timeout: timeout,
      headers: {
        'User-Agent': 'Celestia-Docs-Endpoint-Checker/1.0'
      }
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            const parsed = JSON.parse(data);
            resolve({ success: true, data: parsed, statusCode: res.statusCode });
          } else {
            resolve({ success: false, statusCode: res.statusCode, data });
          }
        } catch (error) {
          resolve({ success: false, error: error.message, data });
        }
      });
    });
    
    req.on('error', (error) => {
      resolve({ success: false, error: error.message });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({ success: false, error: 'Request timeout' });
    });
    
    req.setTimeout(timeout);
  });
}

/**
 * Classify endpoint as archival or pruned
 */
async function classifyEndpoint(grpcEndpoint) {
  console.log(`\nChecking: ${grpcEndpoint}`);
  
  // Known archival endpoints based on naming patterns
  if (grpcEndpoint.includes('archive')) {
    return { 
      endpoint: grpcEndpoint, 
      type: 'archival', 
      reason: 'Archive endpoint (by name)',
      confidence: 'high'
    };
  }
  
  const restEndpoints = grpcToRestEndpoint(grpcEndpoint);
  
  for (const restEndpoint of restEndpoints) {
    console.log(`  Trying REST endpoint: ${restEndpoint}`);
    
    try {
      const result = await checkBlockHeight1(restEndpoint);
      
      if (result.success) {
        // Check if we can access early blocks
        const blockData = result.data;
        
        if (blockData && blockData.block && blockData.block.header) {
          const height = parseInt(blockData.block.header.height);
          if (height === 1) {
            return {
              endpoint: grpcEndpoint,
              type: 'archival',
              reason: 'Can access block height 1',
              confidence: 'high',
              restEndpoint: result.endpoint
            };
          }
        }
        
        return {
          endpoint: grpcEndpoint,
          type: 'pruned',
          reason: 'Accessible but cannot reach block height 1',
          confidence: 'medium',
          restEndpoint: result.endpoint
        };
      }
    } catch (error) {
      console.log(`    Error: ${error.message}`);
    }
  }
  
  return {
    endpoint: grpcEndpoint,
    type: 'unknown',
    reason: 'Could not determine status',
    confidence: 'low'
  };
}

/**
 * Main function to check all endpoints
 */
async function main() {
  console.log('Celestia gRPC Endpoint Checker');
  console.log('================================\n');
  console.log('Checking endpoints for archival vs pruned classification...\n');
  
  const results = {
    archival: [],
    pruned: [],
    unknown: []
  };
  
  for (const endpoint of GRPC_ENDPOINTS) {
    try {
      const classification = await classifyEndpoint(endpoint);
      results[classification.type].push(classification);
      
      console.log(`  Result: ${classification.type.toUpperCase()} (${classification.confidence} confidence)`);
      console.log(`  Reason: ${classification.reason}`);
    } catch (error) {
      console.log(`  Error: ${error.message}`);
      results.unknown.push({
        endpoint,
        type: 'unknown',
        reason: `Error: ${error.message}`,
        confidence: 'low'
      });
    }
  }
  
  console.log('\n\nSummary');
  console.log('=======');
  console.log(`Archival endpoints: ${results.archival.length}`);
  console.log(`Pruned endpoints: ${results.pruned.length}`);
  console.log(`Unknown endpoints: ${results.unknown.length}`);
  
  console.log('\n\nDetailed Results');
  console.log('================');
  
  console.log('\nArchival Endpoints:');
  results.archival.forEach(r => {
    console.log(`  - ${r.endpoint} (${r.reason})`);
  });
  
  console.log('\nPruned Endpoints:');
  results.pruned.forEach(r => {
    console.log(`  - ${r.endpoint} (${r.reason})`);
  });
  
  console.log('\nUnknown/Unreachable Endpoints:');
  results.unknown.forEach(r => {
    console.log(`  - ${r.endpoint} (${r.reason})`);
  });
  
  // Generate markdown for documentation
  console.log('\n\nMarkdown for Documentation:');
  console.log('============================');
  
  if (results.archival.length > 0) {
    console.log('\n### Archival gRPC endpoints\n');
    console.log('These endpoints maintain full blockchain history and can be used for syncing Bridge Nodes from genesis:\n');
    results.archival.forEach(r => {
      console.log(`- \`${r.endpoint}\``);
    });
  }
  
  if (results.pruned.length > 0) {
    console.log('\n### Pruned gRPC endpoints\n');
    console.log('These endpoints maintain recent blockchain history and are suitable for transaction submission and maintaining synced Bridge Nodes:\n');
    results.pruned.forEach(r => {
      console.log(`- \`${r.endpoint}\``);
    });
  }
  
  if (results.unknown.length > 0) {
    console.log('\n### Unverified gRPC endpoints\n');
    console.log('These endpoints could not be verified automatically. Please check manually:\n');
    results.unknown.forEach(r => {
      console.log(`- \`${r.endpoint}\``);
    });
  }
  
  return results;
}

// Run the script if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, classifyEndpoint, GRPC_ENDPOINTS };