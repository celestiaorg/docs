import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { cleanMdxForMarkdown } from './lib/clean-mdx.mjs';

test('preserves fenced exports, JSX examples and whitespace while removing MDX imports', () => {
  for (const delimiter of ['```', '~~~~']) {
    const code = `${delimiter}bash\nexport AUTH_TOKEN=$(celestia light auth write \\\n  --node.store "$FIBRE_HOME")\n\n\nimport example from 'literal'\n<Example>keep me</Example>\n{/* literal */}\n${delimiter}`;
    assert.equal(cleanMdxForMarkdown(`import Example from 'component'\nexport const metadata = {};\n\n${code}`), code);
  }
});

test('retains callout instructions and fenced code', () => {
  const code = '```bash\nexport FIBRE_HOME="$HOME/node"\n```';
  const result = cleanMdxForMarkdown(`<Callout type="warning">\nRestart after funding.\n${code}\n</Callout>`);
  assert.equal(result, `Restart after funding.\n${code}`);
});

test('shorter or different fences do not close a code example', () => {
  const code = '````md\n```bash\nexport X=1\n```\n~~~\n````';
  assert.equal(cleanMdxForMarkdown(code), code);
});

test('retains labelled network tabs with indented shell commands and literal JSX', () => {
  const input = `<Tabs items={['Mainnet Beta', 'Mocha']}>
  <Tabs.Tab>
    Mainnet instructions.

    \`\`\`bash
    export CHAIN_ID=celestia
    <Example>keep me</Example>
    \`\`\`
  </Tabs.Tab>
  <Tabs.Tab>
    \`\`\`bash
    export CHAIN_ID=mocha-5
    \`\`\`
  </Tabs.Tab>
</Tabs>`;
  assert.equal(cleanMdxForMarkdown(input), '**Mainnet Beta**\n\nMainnet instructions.\n\n```bash\nexport CHAIN_ID=celestia\n<Example>keep me</Example>\n```\n\n**Mocha**\n\n```bash\nexport CHAIN_ID=mocha-5\n```');
});

test('does not interpret tabs inside a fenced example', () => {
  const code = '```mdx\n<Tabs items={["Example"]}>\n<Tabs.Tab>Keep me</Tabs.Tab>\n</Tabs>\n```';
  assert.equal(cleanMdxForMarkdown(code), code);
});

for (const [page, expected] of [
  ['operate/networks/local-devnet', ['**Docker Compose**', '**From source (scripts)**', 'docker-compose up -d', 'make install', '**and wipe chain data**']],
  ['operate/getting-started/docker', ['**Mainnet Beta**', '**Mocha**', 'export NETWORK=celestia', 'export NETWORK=mocha', 'docker run -e NODE_TYPE=$NODE_TYPE']],
]) {
  test(`preserves Steps inside and around tabs in ${page}`, () => {
    const source = readFileSync(new URL(`../app/${page}/page.mdx`, import.meta.url), 'utf8');
    const markdown = cleanMdxForMarkdown(source);
    for (const text of expected) assert.ok(markdown.includes(text), `Missing ${text}`);
    assert.doesNotMatch(markdown, /<\/?(?:Steps|Tabs)(?:[. >])/);
  });
}
