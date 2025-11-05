import { describe, it, expect } from 'vitest';

// Smoke test que garante que todos os módulos de componentes UI podem ser importados sem erros
const modules = import.meta.glob('../*.tsx', { eager: true });

describe('UI modules import', () => {
  for (const [path, mod] of Object.entries(modules)) {
    it(`importa módulo: ${path}`, () => {
      expect(mod).toBeTruthy();
    });
  }
});
