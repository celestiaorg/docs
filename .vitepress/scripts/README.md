# gRPC Endpoint Automation

This directory contains scripts for automating the detection and categorization of gRPC endpoints in the Celestia documentation.

## Overview

The automation system categorizes gRPC endpoints into:
- **Archival endpoints**: Maintain full blockchain history from genesis, required for syncing new Bridge Nodes
- **Pruned endpoints**: Maintain recent blockchain history, suitable for transaction submission and maintaining synced Bridge Nodes
- **Unverified endpoints**: Require manual verification

## Files

- `check-grpc-endpoints.js` - Script to automatically check endpoint capabilities
- `generate-grpc-docs.js` - Script to generate documentation sections
- `endpoint-config.json` - Configuration file with endpoint classifications

## Usage

### Check Endpoint Capabilities

```bash
# Check all endpoints and generate classification
yarn check-grpc-endpoints
```

This script attempts to:
1. Identify archival endpoints by name patterns (e.g., "archive")
2. Query potential REST endpoints to check for block height 1 access
3. Generate classification results

### Generate Documentation

```bash
# Generate gRPC documentation sections for mocha network
yarn generate-grpc-docs mocha
```

This script:
1. Reads the endpoint configuration
2. Generates properly formatted markdown sections
3. Updates the documentation file with categorized endpoints

### Manual Configuration

Edit `endpoint-config.json` to manually classify endpoints:

```json
{
  "networks": {
    "mocha": {
      "grpcEndpoints": {
        "archival": ["endpoint1:port"],
        "pruned": ["endpoint2:port"],
        "unverified": ["endpoint3:port"]
      }
    }
  }
}
```

## Workflow

1. **Automated Check**: Run `yarn check-grpc-endpoints` to get initial classification
2. **Manual Review**: Verify results and update `endpoint-config.json` as needed
3. **Generate Docs**: Run `yarn generate-grpc-docs` to update documentation
4. **Review Changes**: Check the updated markdown files before committing

## Adding New Networks

To add support for a new network:

1. Add network configuration to `endpoint-config.json`
2. Update `generate-grpc-docs.js` if needed for network-specific file paths
3. Run the generation script for the new network

## Continuous Integration

Consider adding this to CI/CD workflows to:
- Regularly check endpoint availability
- Automatically update documentation when endpoints change
- Validate endpoint classifications

## Notes

- The automated checking has limitations in sandboxed environments
- Manual verification is often required for accurate classification
- Endpoint availability can change over time, requiring regular updates