#!/usr/bin/env node
// npm run dev：先關掉還在跑的預覽，再重新開。
// 改了 site.config.mjs（換風格、主色）之後，再跑一次 npm run dev 就會套用。
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const astro = path.join(root, 'node_modules', 'astro', 'bin', 'astro.mjs');
spawnSync(process.execPath, [astro, 'dev', 'stop'], { cwd: root, stdio: 'ignore' });
const r = spawnSync(process.execPath, [astro, 'dev', ...process.argv.slice(2)], { cwd: root, stdio: 'inherit' });
process.exit(r.status ?? 0);
