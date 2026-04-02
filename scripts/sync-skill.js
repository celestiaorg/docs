#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';

async function pathExists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

async function syncSkillFile() {
  const source = path.resolve('SKILL.md');
  const publicTarget = path.resolve('public', 'SKILL.md');
  const outTarget = path.resolve('out', 'SKILL.md');

  const content = await fs.readFile(source, 'utf8');

  await fs.mkdir(path.dirname(publicTarget), { recursive: true });
  await fs.writeFile(publicTarget, content, 'utf8');
  console.log(`Synced ${source} -> ${publicTarget}`);

  if (await pathExists('out')) {
    await fs.mkdir(path.dirname(outTarget), { recursive: true });
    await fs.writeFile(outTarget, content, 'utf8');
    console.log(`Synced ${source} -> ${outTarget}`);
  }
}

syncSkillFile().catch((err) => {
  console.error(err);
  process.exit(1);
});
