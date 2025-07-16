# GitHub Actions Workflows

This directory contains the GitHub Actions workflows for the Celestia documentation site.

## Required Secrets

The workflows in this repository require the following secrets to be configured in the repository settings:

### `PAT_CREATE_PR`
- **Used by**: `latest_tags.yml`
- **Purpose**: Creates pull requests with updated version information
- **Required permissions**:
  - `repo` (Full control of repositories)
  - `pull_requests:write` (Create and update pull requests)
- **Associated user**: Should be created by a service account with repository access

### `PREVIEW_DEPLOY` 
- **Used by**: `preview.yml`
- **Purpose**: Deploys PR previews to the `celestiaorg/docs-preview` repository
- **Required permissions**:
  - `repo` (Full control of repositories) - needed to push to docs-preview repo
  - `contents:write` (Write access to repository contents)
- **Associated user**: Should be created by a service account with repository access

## Workflow Descriptions

### `latest_tags.yml`
Automatically updates version files with the latest release information from celestia-app and celestia-node repositories. Creates a pull request with the updated version information.

### `preview.yml`
Builds and deploys preview versions of the documentation for pull requests to the `celestiaorg/docs-preview` repository.

## Troubleshooting

If workflows are failing with permission errors:

1. Verify that the required secrets are set in the repository settings
2. Check that the PAT tokens haven't expired
3. Ensure the tokens are created by the appropriate service account
4. Verify that the service account has the necessary permissions in both repos

### Common Error Messages

- **"Resource not accessible by personal access token"**: The PAT may not have the required scopes or the service account may not have access to the repository
- **"Bad credentials"**: The PAT may have expired or been revoked
- **"Not Found"**: The target repository (docs-preview) may not exist or the PAT doesn't have access to it

### Testing Workflows

Use the validation script to test your local setup:
```bash
.github/workflows/validate.sh
```

This will check for:
- Workflow file presence and syntax
- Required directory structure
- Build functionality

## Security Notes

- The workflows use specific permissions rather than `write-all` for better security
- Tokens should be regularly rotated following security best practices
- Monitor workflow runs for any suspicious activity