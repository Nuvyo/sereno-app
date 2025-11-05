import { describe, it, expect } from 'vitest';

// Smoke test que garante que todos os módulos de components (nível raiz) podem ser importados
const modules = import.meta.glob('../*.tsx', { eager: true });

describe('Components modules import', () => {
  for (const [path, mod] of Object.entries(modules)) {
    it(`importa módulo: ${path}`, () => {
      expect(mod).toBeTruthy();
    });
  }
});
