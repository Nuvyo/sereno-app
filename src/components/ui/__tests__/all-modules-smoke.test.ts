import { describe, it, expect } from 'vitest';

const modules = import.meta.glob('../*.tsx', { eager: true });

describe('UI modules import', () => {
  for (const [path, mod] of Object.entries(modules)) {
    it(`importa módulo: ${path}`, () => {
      expect(mod).toBeTruthy();
    });
  }
});
