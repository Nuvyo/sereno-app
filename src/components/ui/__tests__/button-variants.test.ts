import { describe, it, expect } from 'vitest';
import { buttonVariants } from '@/components/ui/button-variants';

describe('button-variants', () => {
  it('retorna classes padrão (variant e size)', () => {
    const cls = buttonVariants();

    expect(cls).toContain('inline-flex');
    expect(cls).toContain('rounded-md');
    expect(cls).toContain('bg-primary');
    expect(cls).toContain('h-10');
    expect(cls).toContain('px-4');
    expect(cls).toContain('py-2');
  });

  it('combina variant destructive e size lg', () => {
    const cls = buttonVariants({ variant: 'destructive', size: 'lg' });

    expect(cls).toContain('bg-destructive');
    expect(cls).toContain('text-destructive-foreground');
    expect(cls).toContain('h-11');
    expect(cls).toContain('px-8');
  });

  it('gera classes para variant outline e size icon', () => {
    const cls = buttonVariants({ variant: 'outline', size: 'icon' });

    expect(cls).toContain('border');
    expect(cls).toContain('bg-background');
    expect(cls).toContain('h-10');
    expect(cls).toContain('w-10');
  });
});
