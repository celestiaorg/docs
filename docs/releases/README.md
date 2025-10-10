# Release Pages Generator

This directory contains the infrastructure for automatically generating and maintaining release notes pages for Celestia projects.

## Overview

The release pages feature creates individual markdown pages for each release of:
- **celestia-node**: Celestia's Data Availability Node implementation
- **celestia-app**: Celestia's consensus layer implementation

Each release gets its own page with structured frontmatter and the full release notes content, making them fully searchable and linkable within the documentation site.

## Directory Structure

```
docs/releases/
├── index.md              # Main releases overview page
├── node/                 # Celestia Node releases
│   ├── index.md         # Node releases index
│   ├── v0.26.4.md       # Individual release pages
│   └── ...
└── app/                  # Celestia App releases
    ├── index.md         # App releases index
    ├── v6.0.2.md        # Individual release pages
    └── ...
```

## Frontmatter Schema

Each release page includes structured frontmatter:

```yaml
---
title: "celestia-node v0.26.4"
description: "Release notes for celestia-node v0.26.4"
product: "celestia-node"
version: "v0.26.4"
released: "2025-10-06"
prerelease: false
source:
  type: "github-release"
  url: "https://github.com/celestiaorg/celestia-node/releases/tag/v0.26.4"
---
```

## Generation Script

The `scripts/generate-release-pages.ts` script:

1. Fetches releases from GitHub API for both repositories
2. Generates markdown files with proper frontmatter
3. Creates index pages listing all releases
4. Handles both regular and pre-releases

### Usage

```bash
# Generate pages for both projects
yarn generate-releases

# Generate only celestia-node releases
yarn generate-releases --node

# Generate only celestia-app releases  
yarn generate-releases --app
```

### Environment Variables

- `GITHUB_TOKEN`: Optional GitHub personal access token for higher rate limits

## Automation

The `.github/workflows/update-releases.yml` workflow automatically:

- Runs daily to check for new releases
- Can be triggered manually with options to update specific projects
- Commits and pushes changes when new releases are found
- Validates the site builds successfully

## VitePress Integration

Release pages are integrated into the site:

- **Sidebar**: Dedicated "Releases" section with navigation
- **Search**: All content is indexed for search
- **Navigation**: Breadcrumbs and internal linking between pages

## Manual Updates

To manually update release pages:

1. Run the generation script: `yarn generate-releases`
2. Review the generated files in `docs/releases/`
3. Update the sidebar configuration in `.vitepress/config.ts` if needed
4. Test the build: `yarn build`
5. Commit and push the changes

## Troubleshooting

**Script fails with API rate limits:**
- Add a `GITHUB_TOKEN` environment variable
- Or wait for the rate limit to reset (typically 1 hour)

**Missing releases:**
- Check if the release is marked as a draft in GitHub
- Verify the repository name and organization are correct
- Run the script with verbose output for debugging

**Build errors:**
- Ensure all generated markdown files have valid frontmatter
- Check for special characters that might break YAML parsing
- Verify all internal links are correct

## Future Enhancements

Potential improvements for this system:

1. **Real-time updates**: Use GitHub webhooks instead of scheduled checks
2. **Release comparison**: Add diff links between versions
3. **Manifest generation**: Create JSON manifests for programmatic access
4. **Latest release badges**: Add dynamic badges showing latest versions
5. **Change categorization**: Automatically categorize changes (features, fixes, etc.)
6. **Migration guides**: Auto-generate upgrade instructions for breaking changes