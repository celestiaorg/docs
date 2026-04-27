const METADATA_EXPORT = /(^|\n)export const metadata = /;
const METADATA_ONLY_EXPORT = /export const metadata = [\s\S]*?;\n/;

module.exports = function stripMdxRouteMetadata(source) {
  if (this.resourceQuery?.includes('metadata')) {
    const metadataExport = source.match(METADATA_ONLY_EXPORT)?.[0] ?? source;
    // Nextra's page map imports this query for metadata only, not as a route.
    return `"use server";\n${metadataExport}`;
  }

  // Nextra still passes the local metadata object into its wrapper.
  return source.replace(METADATA_EXPORT, '$1const metadata = ');
};
