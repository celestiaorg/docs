import fs from 'fs';
import fetch from 'node-fetch';

const filesToImport = [
  {
    url: 'https://raw.githubusercontent.com/celestiaorg/orchestrator-relayer/main/docs/deploy.md',
    fileName: 'qgb-deploy.md',
  },
  {
    url: 'https://raw.githubusercontent.com/celestiaorg/orchestrator-relayer/main/docs/keys.md',
    fileName: 'qgb-keys.md',
  },
  {
    url: 'https://raw.githubusercontent.com/celestiaorg/orchestrator-relayer/main/docs/orchestrator.md',
    fileName: 'qgb-orchestrator.md',
  },
  {
    url: 'https://raw.githubusercontent.com/celestiaorg/orchestrator-relayer/main/docs/relayer.md',
    fileName: 'qgb-relayer.md',
  },
  // TODO: add introduction to QGB section
  // {
  //   url: 'https://raw.githubusercontent.com/celestiaorg/orchestrator-relayer/main/README.md',
  //   fileName: 'qgb-intro.md',
  // },
];

async function importMarkdown(file) {
  try {
    const response = await fetch(file.url);
    if (response.ok) {
      const markdown = await response.text();
      fs.writeFileSync(`./docs/nodes/${file.fileName}`, markdown);
      console.log(`Markdown file '${file.fileName}' successfully imported!`);
    } else {
      console.error(`Error fetching the markdown file: ${response.statusText}`);
    }
  } catch (error) {
    console.error(`Error importing the markdown file: ${error.message}`);
  }
}

filesToImport.forEach(importMarkdown);
