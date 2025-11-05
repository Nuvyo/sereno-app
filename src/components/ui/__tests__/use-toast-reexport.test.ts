import { describe, it, expect } from 'vitest';
import * as ui from '@/components/ui/use-toast';
import * as hooks from '@/hooks/use-toast';

describe('use-toast reexport', () => {
  it('reexporta as mesmas referências de toast e useToast', () => {
    expect(ui.toast).toBe(hooks.toast);
    expect(ui.useToast).toBe(hooks.useToast);
  });
});
