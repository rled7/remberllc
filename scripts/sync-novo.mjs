import { cp, mkdir, readFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const source = new URL('demo-src/novo/dist/', root);
const target = new URL('public/demos/novo/', root);
const html = await readFile(new URL('index.html', source), 'utf8');
if (!html.includes('NOVO')) throw new Error('Build the NOVO demo before syncing its generated assets.');
await mkdir(new URL('public/demos/', root), { recursive: true });
await rm(target, { recursive: true, force: true });
await cp(source, target, { recursive: true });
console.log(`Synced NOVO to ${fileURLToPath(target)}`);
