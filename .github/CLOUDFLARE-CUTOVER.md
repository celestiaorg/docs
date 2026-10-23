# Cloudflare Pages cutover

## Current status

The custom-domain cutover is complete. The production smoke test passed on
20 October 2026. GitHub Pages is disabled, and the legacy deployment and preview
workflows have been removed. GitHub Pages rollback is no longer required;
`gh-pages` can be deleted without archiving it. Cloudflare deployments do not
depend on that branch.

The original cutover procedure below is retained as historical context.
Its GitHub Pages preservation and manual-workflow instructions no longer apply.
The production verification command remains useful after Cloudflare deployments.

## Original cutover procedure

The workflow change prepares Cloudflare production; merging it does not switch
`docs.celestia.org`. Complete the steps below in order. Do not remove the existing
GitHub Pages deployment until the custom domain has been verified.

### Prepare and deploy

1. Confirm the repository secrets `CLOUDFLARE_API_TOKEN` and
   `CLOUDFLARE_ACCOUNT_ID` can manage Pages in the intended account. The token needs
   Account → Cloudflare Pages → Edit. Local Wrangler authentication is separate
   from GitHub Actions secrets.
2. Choose the permanent project name (`celestia-docs` by default). If needed, set
   `CLOUDFLARE_PAGES_PROJECT` before running the workflow. Do not leave it pointing
   at the temporary `celestia-docs-vocs-test` project.
3. Push the PR and check the Cloudflare deployment run. It creates the project if
   absent with `main` as production branch; an existing project with a different
   production branch fails validation. Record the actual project hostname from
   the run summary. Verify the PR preview, including search, navigation, tabs,
   RPC interactions and mobile layouts.
4. Record the existing DNS record (target, proxy setting and TTL), GitHub Pages
   settings and the `gh-pages` commit SHA. Retain a copy of the published artifact
   or branch. The migration makes the old workflows manual-only, preserving it.
5. Merge the migration to `main`. Check the production deployment and smoke-test
   result in Actions. Inspect the immutable Pages deployment URL before changing
   DNS. Its HTML intentionally uses the future custom-domain origin; use the PR
   preview for isolated navigation tests until the domain switches.

### Switch and verify the domain

1. In the intended Pages project, select **Custom domains → Set up a domain** and
   associate `docs.celestia.org`. Cloudflare-managed DNS can update the record
   during this step, so treat it as the start of the traffic switch.
2. If DNS is managed elsewhere, update the `docs` CNAME to the project's actual
   `<pages_project_host>` after associating the domain. Do not merely change DNS
   without adding the domain to Pages. See Cloudflare's
   [custom-domain instructions](https://developers.cloudflare.com/pages/configuration/custom-domains/).
3. Wait for the custom domain and HTTPS certificate to become active. Run:

   ```bash
   node scripts/check-cloudflare-deployment.mjs https://docs.celestia.org
   ```

4. The Worker now supplies discovery headers and the API catalog media type.
   Disable only the two redundant `docs.celestia.org` response-header rules using
   Cris's saved IDs, then rerun the smoke test. Keep those IDs for rollback.
   No paid Markdown for Agents rule is required: the Worker serves generated
   Markdown itself. The smoke test checks HTML → Markdown → HTML, `Vary: Accept`,
   cache isolation, the catalog and MCP tools.
5. Verify existing bookmarked URLs, redirects, search, tabs, RPC interactions,
   mobile navigation, markdown and assets in a browser. Confirm production has
   no preview noindex metadata and `robots.txt` allows indexing. Check canonical
   URLs and `sitemap.xml` use `https://docs.celestia.org`.
6. Record the production deployment ID and verification results. Only then remove
   `deploy.yml` and `preview.yaml` in a follow-up change, clean up old preview
   artifacts and retire the unused preview secret/project. Preserve the rollback
   artifact and DNS record details through the agreed rollback window.

### Rollback and troubleshooting

- **Before DNS changes:** the old GitHub site still serves production. Fix the
  Cloudflare workflow and rerun it; do not switch traffic on a failed smoke test.
- **After DNS changes:** restore the recorded DNS target and settings to return
  traffic to the retained GitHub Pages artifact. Re-enable the two saved
  discovery/header rules. Confirm HTTPS, static `.md` files and the old site.
  Do not run the manual GitHub deployment unless intentionally replacing that
  retained artifact with a newly built Vocs site.
- **After a later bad Cloudflare release:** use a known-good production deployment
  in Pages for rollback; retain the failed deployment ID for diagnosis.
- **Wrong project/branch:** check `CLOUDFLARE_PAGES_PROJECT` and the project's
  production branch. The workflow refuses to deploy when it is not `main`.
- **No fork preview:** expected; fork PRs do not receive deployment secrets.
- **Local authentication expired:** run `bunx wrangler login` interactively or
  configure a scoped `CLOUDFLARE_API_TOKEN`. Do not print or commit credentials.
- **Crawler challenges:** inspect Cloudflare Security Events for the scanner
  timestamp and Ray ID. Adjust only the responsible rule and rescan; a successful
  Pages deployment does not resolve WAF challenges.
- **DNS or certificate failure:** check domain association, CNAME, CAA restrictions
  and any conflicting Cloudflare rules before retrying.
