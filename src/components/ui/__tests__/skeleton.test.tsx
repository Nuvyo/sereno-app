import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Skeleton } from '@/components/ui/skeleton';

describe('Skeleton', () => {
  it('renderiza elemento skeleton', () => {
    const { getByTestId } = render(<Skeleton data-testid='skeleton' />);
    const skeleton = getByTestId('skeleton');

    expect(skeleton).toBeInTheDocument();
  });

  it('aplica classes customizadas', () => {
    const { container } = render(<Skeleton className='h-20 w-20' data-testid='skeleton' />);
    const skeleton = container.querySelector('[data-testid="skeleton"]') as HTMLElement;

    expect(skeleton).toHaveClass('h-20', 'w-20');
  });

  it('renderiza com altura e largura específicas', () => {
    const { container } = render(<Skeleton className='h-4 w-full' data-testid='skeleton' />);
    const skeleton = container.querySelector('[data-testid="skeleton"]') as HTMLElement;

    expect(skeleton).toHaveClass('h-4', 'w-full');
  });
});
