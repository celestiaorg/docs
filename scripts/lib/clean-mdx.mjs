// Keep fenced examples out of MDX/JSX cleanup, including their whitespace.
export function cleanMdxForMarkdown(content) {
  const fences = [];
  let fence;
  let code = [];
  const lines = content.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '').split('\n');
  const protectedLines = [];
  for (const line of lines) {
    if (fence) {
      code.push(line);
      const close = line.match(/^ {0,3}(`{3,}|~{3,})[ \t]*$/);
      if (close && close[1][0] === fence[0] && close[1].length >= fence.length) {
        protectedLines.push(`\u0000FENCE${fences.length}\u0000`);
        fences.push(code.join('\n'));
        fence = undefined;
        code = [];
      }
    } else {
      const open = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
      if (open) {
        fence = open[1];
        code = [line];
      } else {
        protectedLines.push(line);
      }
    }
  }
  if (fence) {
    protectedLines.push(`\u0000FENCE${fences.length}\u0000`);
    fences.push(code.join('\n'));
  }
  let cleaned = protectedLines.join('\n');
  cleaned = cleaned.replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, '');
  cleaned = cleaned.replace(/^export\s+(?!default).*?;?\s*$/gm, '');
  // Retain admonition text; removing the whole component loses critical instructions.
  cleaned = cleaned.replace(/<Callout\b[^>]*>/g, '\n').replace(/<\/Callout>/g, '\n');
  cleaned = cleaned.replace(/<([A-Z][a-zA-Z0-9]*)\s*[^>]*\/>/g, '');
  cleaned = cleaned.replace(/<([A-Z][a-zA-Z0-9]*)[^>]*>[\s\S]*?<\/\1>/g, '');
  cleaned = cleaned.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();
  // Null delimiters mark the fenced examples protected above.
  // eslint-disable-next-line no-control-regex
  return cleaned.replace(/\u0000FENCE(\d+)\u0000/g, (_, index) => fences[Number(index)]);
}
