import { describe, expect, it } from 'vitest';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import contract from '../src/api/openapi.json';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import config from '../vite.config';

const ajv = new Ajv2020({ strict: false, allErrors: true });
addFormats(ajv);
ajv.addSchema(contract, 'contract');
const cases = [];
for (const [path, methods] of Object.entries(contract.paths)) {
  for (const [method, operation] of Object.entries(methods)) {
    for (const [status, response] of Object.entries(operation.responses)) {
      const media = response.content?.['application/json'];
      if (media?.example !== undefined) cases.push([`${method} ${path} ${status}`, media]);
    }
  }
}
describe('merged OpenAPI compatibility', () => {
  it('pins the reviewed snapshot bytes', () => {
    const bytes = readFileSync(`${process.cwd()}/src/api/openapi.json`);
    expect(createHash('sha256').update(bytes).digest('hex')).toBe('018989b1204de13fdadb7e9d98ad34a0f7f34e32ac00ba50404e165104dc32fc');
  });
  it.each(cases)('validates the published response example: %s', (_name, media) => {
    const validate = ajv.compile({ ...media.schema, components: contract.components });
    expect(validate(media.example), JSON.stringify(validate.errors)).toBe(true);
  });
  it('retains P12.1 endpoints and canonical 204 deletes', () => {
    expect(contract.paths['/api/auth/me'].get.responses['200']).toBeDefined();
    expect(contract.paths['/api/shopping-cart/items/{id}'].patch.requestBody).toBeDefined();
    expect(contract.paths['/api/shopping-cart/items/{id}'].delete.responses['204'].content).toBeUndefined();
    expect(contract.paths['/api/shopping-cart/items'].delete.responses['204'].content).toBeUndefined();
  });
  it('rejects a numeric monetary response', () => {
    const schema = contract.components.schemas.Money;
    const validate = ajv.compile(schema);
    expect(validate('12.30')).toBe(true);
    expect(validate(12.30)).toBe(false);
  });
  it('keeps the Ubuntu listener, media proxy, and existing frontend port', () => {
    expect(config.server).toMatchObject({ host: '127.0.0.1', port: 5178, strictPort: true,
      proxy: { '/api': 'http://127.0.0.1:3008', '/media': 'http://127.0.0.1:3008' } });
  });
});
