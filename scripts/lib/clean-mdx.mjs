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
      const close = line.match(/^ *(`{3,}|~{3,})[ \t]*$/);
      if (close && close[1][0] === fence[0] && close[1].length >= fence.length) {
        protectedLines.push(`\u0000FENCE${fences.length}\u0000`);
        fences.push(code.join('\n'));
        fence = undefined;
        code = [];
      }
    } else {
      const open = line.match(/^ *(`{3,}|~{3,})(.*)$/);
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
  const restoreFences = value => value.replace(/\u0000FENCE(\d+)\u0000/g, (_, index) => fences[Number(index)]);
  // Export each static tab as labelled Markdown without losing its fenced commands.
  cleaned = cleaned.replace(/<Tabs\s+items=\{\[([^\]]*)\]\}[^>]*>([\s\S]*?)<\/Tabs>/g, (_, items, body) => {
    const labels = [...items.matchAll(/(['"])(.*?)\1/g)].map(match => match[2]);
    let tabIndex = 0;
    return body.replace(/[ \t]*<Tabs\.Tab\b[^>]*>([\s\S]*?)<\/Tabs\.Tab>/g, (_, panel) => {
      const lines = restoreFences(panel).split('\n');
      const indents = lines.filter(line => line.trim()).map(line => line.match(/^ */)[0].length);
      const indent = indents.length ? Math.min(...indents) : 0;
      const markdown = cleanMdxForMarkdown(lines.map(line => line.slice(indent)).join('\n'));
      const label = labels[tabIndex++] || `Tab ${tabIndex}`;
      const placeholder = `\u0000FENCE${fences.length}\u0000`;
      fences.push(`**${label}**\n\n${markdown}`);
      return `\n\n${placeholder}\n\n`;
    });
  });
  cleaned = cleaned.replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, '');
  cleaned = cleaned.replace(/^export\s+(?!default).*?;?\s*$/gm, '');
  // Retain content wrappers; removing the whole component loses critical instructions.
  cleaned = cleaned.replace(/<(?:Callout|Steps)\b[^>]*>/g, '\n').replace(/<\/(?:Callout|Steps)>/g, '\n');
  cleaned = cleaned.replace(/<([A-Z][a-zA-Z0-9]*)\s*[^>]*\/>/g, '');
  cleaned = cleaned.replace(/<([A-Z][a-zA-Z0-9]*)[^>]*>[\s\S]*?<\/\1>/g, '');
  cleaned = cleaned.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();
  return restoreFences(cleaned);
}
