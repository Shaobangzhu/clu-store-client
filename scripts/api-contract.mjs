import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import openapiTS, { astToString } from 'openapi-typescript';

// Read the sibling backend repository; never write to it.
const backend = new URL('../../clu-store-api/docs/openapi.json', import.meta.url);
const sha = '018989b1204de13fdadb7e9d98ad34a0f7f34e32ac00ba50404e165104dc32fc';
const raw = await readFile(backend, 'utf8');
if (createHash('sha256').update(raw).digest('hex') !== sha) {
  throw new Error('Backend contract changed: review the new API revision before updating the pin.');
}
const types = astToString(await openapiTS(JSON.parse(raw)));
const outputs = [
  [new URL('../src/api/openapi.json', import.meta.url), raw],
  [new URL('../src/api/schema.d.ts', import.meta.url), `// Generated from API merge 8929c5fe24205e814db05a12642aad61d7c25a60. Do not edit.\n${types}`],
];
for (const [file, expected] of outputs) {
  if (process.argv.includes('--write')) await writeFile(file, expected);
  else if (await readFile(file, 'utf8') !== expected) throw new Error(`Contract artifact drift: ${file.pathname}`);
}
console.log('Pinned backend contract and generated definitions match.');
