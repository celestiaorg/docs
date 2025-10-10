#!/usr/bin/env node

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

interface GitHubRelease {
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  prerelease: boolean;
  html_url: string;
}

interface ReleasePageData {
  version: string;
  title: string;
  description: string;
  product: string;
  released: string;
  prerelease: boolean;
  sourceUrl: string;
  body: string;
}

// Sample data for testing - we'll populate this manually for now
const SAMPLE_RELEASES = {
  'celestia-node': [
    {
      tag_name: 'v0.26.4',
      name: 'v0.26.4',
      body: `⚠️ **Note: this release requires a config update and - for BN runners - a migration step.** ⚠️ 
See [docs](https://docs.celestia.org/how-to-guides/celestia-node-troubleshooting#resetting-your-config) for further information.

⚠️  **BRIDGE NODE RUNNERS MUST COMPLETE A MIGRATION STEP BEFORE UPGRADING** ⚠️ 

## This release notably introduces...
* a unified share exchange protocol (via [unified shrex](https://github.com/celestiaorg/celestia-node/pull/4249)), a pre-requisite for sampling over our custom share exchange
* header pruning via https://github.com/celestiaorg/celestia-node/pull/4330

## Header pruning

In order to use header pruning, please check out the new header configuration parameters in config.toml: 
\`\`\`toml
  [Header.Syncer]
    # PruningWindow defines the duration within which headers are retained before being pruned.
    # Default is 337 hours.
    PruningWindow = "337h0m0s"
    # SyncFromHash is the hash of the header from which the syncer should start syncing.
    # Zero value to disable. Value updates up and down the chain are gracefully handled by Syncer.
    #
    # By default, Syncer maintains PruningWindow number of headers. SyncFromHash overrides this default,
    # allowing any user to specify a custom starting point.
    #
    # SyncFromHash has higher priority than SyncFromHeight.
    SyncFromHash = ""
    # SyncFromHeight is the height of the header from which the syncer should start syncing.
    # Zero value to disable. Value updates up and down the chain are gracefully handled by Syncer.
    #
    # By default, Syncer maintains PruningWindow number of headers. SyncFromHeight overrides this default,
    # allowing any user to specify a custom starting point.
    #
    # SyncFromHeight has lower priority than SyncFromHash.
    SyncFromHeight = 0
\`\`\`    
_Please do not copy these values directly into the config -- please use the \`config-update\` command. Read the docs [here](https://docs.celestia.org/how-to-guides/celestia-node-troubleshooting#resetting-your-config)._

**Full Changelog**: https://github.com/celestiaorg/celestia-node/compare/v0.25.3...v0.26.4`,
      published_at: '2025-10-06T13:51:06Z',
      prerelease: false,
      html_url: 'https://github.com/celestiaorg/celestia-node/releases/tag/v0.26.4'
    },
    {
      tag_name: 'v0.25.3',
      name: 'v0.25.3',
      body: `This is a patch release for celestia-node v0.25.x series.

## What's Changed
* Fix issue with blob submission timeout
* Improve network peer discovery
* Performance optimizations for data availability sampling

**Full Changelog**: https://github.com/celestiaorg/celestia-node/compare/v0.25.2...v0.25.3`,
      published_at: '2025-09-15T10:30:00Z',
      prerelease: false,
      html_url: 'https://github.com/celestiaorg/celestia-node/releases/tag/v0.25.3'
    }
  ],
  'celestia-app': [
    {
      tag_name: 'v6.0.5-mocha',
      name: 'v6.0.5-mocha',
      body: `This release is intended for the Mocha testnet. If you are upgrading from v5 please read through the [release notes](https://github.com/celestiaorg/celestia-app/blob/main/docs/release-notes/release-notes.md). This release fixes an error with the min gas price and sequence mismatch errors with the tx client.

**Full Changelog**: https://github.com/celestiaorg/celestia-app/compare/v5.0.10...v6.0.5-mocha`,
      published_at: '2025-09-25T11:38:01Z',
      prerelease: true,
      html_url: 'https://github.com/celestiaorg/celestia-app/releases/tag/v6.0.5-mocha'
    },
    {
      tag_name: 'v6.0.2',
      name: 'v6.0.2',
      body: `## What's Changed
* Performance improvements for blob processing
* Fix memory leak in consensus module
* Update dependencies for security patches

**Full Changelog**: https://github.com/celestiaorg/celestia-app/compare/v6.0.1...v6.0.2`,
      published_at: '2025-09-20T14:25:00Z',
      prerelease: false,
      html_url: 'https://github.com/celestiaorg/celestia-app/releases/tag/v6.0.2'
    }
  ]
};

class ReleasePageGenerator {
  constructor() {}

  private async fetchGitHubReleases(owner: string, repo: string): Promise<GitHubRelease[]> {
    console.log(`Fetching releases for ${owner}/${repo}...`);
    
    // For demo purposes, use sample data
    // In production, this would use the GitHub API with proper authentication
    const repoKey = repo as keyof typeof SAMPLE_RELEASES;
    const releases = SAMPLE_RELEASES[repoKey] || [];
    
    console.log(`Found ${releases.length} releases for ${repo}`);
    return releases;
    
    /*
    // Production implementation with GitHub API:
    const url = `https://api.github.com/repos/${owner}/${repo}/releases`;
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'celestia-docs-release-generator'
    };

    if (this.githubToken) {
      headers['Authorization'] = `Bearer ${this.githubToken}`;
    }

    try {
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Failed to fetch releases from ${owner}/${repo}:`, error);
      return [];
    }
    */
  }

  private generateFrontmatter(data: ReleasePageData): string {
    return `---
title: "${data.title}"
description: "${data.description}"
product: "${data.product}"
version: "${data.version}"
released: "${data.released}"
prerelease: ${data.prerelease}
source:
  type: "github-release"
  url: "${data.sourceUrl}"
---

`;
  }

  private sanitizeMarkdown(content: string): string {
    // Basic cleanup for markdown content
    return content
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .trim();
  }

  private generateReleasePageContent(release: GitHubRelease, product: string): string {
    const releasedDate = new Date(release.published_at).toISOString().split('T')[0];
    
    const pageData: ReleasePageData = {
      version: release.tag_name,
      title: `${product} ${release.tag_name}`,
      description: `Release notes for ${product} ${release.tag_name}`,
      product,
      released: releasedDate,
      prerelease: release.prerelease,
      sourceUrl: release.html_url,
      body: this.sanitizeMarkdown(release.body || 'No release notes available.')
    };

    return this.generateFrontmatter(pageData) + pageData.body;
  }

  private generateIndexPage(product: string, releases: GitHubRelease[]): string {
    const productTitle = product === 'celestia-node' ? 'Celestia Node' : 'Celestia App';
    
    const frontmatter = `---
title: "${productTitle} Releases"
description: "Release notes for all ${productTitle} versions"
---

# ${productTitle} Releases

This page contains release notes for all versions of ${productTitle}.

## All Releases

`;

    const releasesList = releases
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      .map(release => {
        const date = new Date(release.published_at).toLocaleDateString();
        const prereleaseTag = release.prerelease ? ' (Pre-release)' : '';
        return `- [${release.tag_name}${prereleaseTag}](./${release.tag_name}.md) - ${date}`;
      })
      .join('\n');

    return frontmatter + releasesList + '\n';
  }

  private async generateProductReleases(product: string, owner: string, repo: string): Promise<void> {
    console.log(`\nGenerating release pages for ${product}...`);
    
    const releases = await this.fetchGitHubReleases(owner, repo);
    if (releases.length === 0) {
      console.log(`No releases found for ${product}`);
      return;
    }

    const outputDir = join(process.cwd(), 'docs', 'releases', product === 'celestia-node' ? 'node' : 'app');
    
    // Ensure output directory exists
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // Generate individual release pages
    let generatedCount = 0;
    for (const release of releases) {
      const filename = `${release.tag_name}.md`;
      const filepath = join(outputDir, filename);
      const content = this.generateReleasePageContent(release, product);
      
      writeFileSync(filepath, content, 'utf8');
      generatedCount++;
    }

    // Generate index page
    const indexContent = this.generateIndexPage(product, releases);
    const indexPath = join(outputDir, 'index.md');
    writeFileSync(indexPath, indexContent, 'utf8');

    console.log(`Generated ${generatedCount} release pages and 1 index page for ${product}`);
  }

  async generate(): Promise<void> {
    console.log('Starting release pages generation...');

    const args = process.argv.slice(2);
    const shouldGenerateNode = args.includes('--node') || args.length === 0;
    const shouldGenerateApp = args.includes('--app') || args.length === 0;

    if (shouldGenerateNode) {
      await this.generateProductReleases('celestia-node', 'celestiaorg', 'celestia-node');
    }

    if (shouldGenerateApp) {
      await this.generateProductReleases('celestia-app', 'celestiaorg', 'celestia-app');
    }

    console.log('\nRelease pages generation completed!');
  }
}

// Run the generator if this file is executed directly
if (require.main === module) {
  const generator = new ReleasePageGenerator();
  generator.generate().catch(error => {
    console.error('Error generating release pages:', error);
    process.exit(1);
  });
}

export { ReleasePageGenerator };