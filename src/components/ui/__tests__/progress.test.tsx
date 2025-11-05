import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Progress } from '@/components/ui/progress';

describe('Progress', () => {
  it('renderiza com valor especificado', () => {
    const { container } = render(<Progress value={50} />);
    const progressBar = container.querySelector('[role="progressbar"]');

    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
  });

  it('renderiza com valor padrão 0', () => {
    const { container } = render(<Progress />);
    const progressBar = container.querySelector('[role="progressbar"]');

    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
  });

  it('mantém aria-valuenow mesmo fora dos limites (visual é limitado)', () => {
    const { container, rerender } = render(<Progress value={150} />);
    let progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveAttribute('aria-valuenow', '150');

    rerender(<Progress value={-10} />);
    progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveAttribute('aria-valuenow', '-10');
  });

  it('aplica classes customizadas', () => {
    const { container } = render(<Progress value={30} className="bg-red-200" />);
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveClass('bg-red-200');
  });
});
