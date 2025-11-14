import { describe, it, expect } from 'vitest';
import { toggleVariants } from '@/components/ui/toggle-variants';

describe('toggle-variants', () => {
  it('retorna classes padrão (variant e size)', () => {
    const cls = toggleVariants();

    expect(cls).toContain('inline-flex');
    expect(cls).toContain('rounded-md');
    expect(cls).toContain('bg-transparent');
    expect(cls).toContain('h-10');
    expect(cls).toContain('px-3');
  });

  it('combina variant outline e size lg', () => {
    const cls = toggleVariants({ variant: 'outline', size: 'lg' });

    expect(cls).toContain('border-input');
    expect(cls).toContain('hover:bg-accent');
    expect(cls).toContain('hover:text-accent-foreground');
    expect(cls).toContain('h-11');
    expect(cls).toContain('px-5');
  });
});
