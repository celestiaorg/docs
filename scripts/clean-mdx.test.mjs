import assert from 'node:assert/strict';
import test from 'node:test';
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
