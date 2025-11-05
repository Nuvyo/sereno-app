import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, within } from '@testing-library/react';
import { Separator } from '@/components/ui/separator';

describe('Separator', () => {
  it('renderiza separador horizontal (não decorativo)', () => {
    const { container } = render(<Separator decorative={false} />);
    const separator = within(container).getByRole('separator');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('renderiza separador vertical (não decorativo)', () => {
    const { container } = render(<Separator decorative={false} orientation="vertical" />);
    const separator = within(container).getByRole('separator');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('renderiza separador decorativo (sem role acessível)', () => {
    const { container } = render(<Separator decorative data-testid="sep" />);
    const el = container.querySelector('[data-testid="sep"]');
    expect(el).toBeInTheDocument();
  });

  it('aplica classes customizadas', () => {
    const { container } = render(
      <Separator decorative={false} className="bg-red-500" data-testid="sep" />,
    );
    const el = container.querySelector('[data-testid="sep"]');
    expect(el).toHaveClass('bg-red-500');
  });
});
