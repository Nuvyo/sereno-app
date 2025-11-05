import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Toaster } from '@/components/ui/sonner';

// Mock do next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
  }),
}));

// Mock do sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
    message: vi.fn(),
    promise: vi.fn(),
    custom: vi.fn(),
    dismiss: vi.fn(),
  },
  Toaster: ({
    children,
    toastOptions: _ignored,
    ...props
  }: {
    children?: React.ReactNode;
    toastOptions?: unknown;
    [key: string]: unknown;
  }) => (
    <div data-testid="sonner-toaster" {...props}>
      {children}
    </div>
  ),
}));

describe('Sonner', () => {
  it('renderiza toaster do sonner', () => {
    const { container } = render(<Toaster />);
    const toaster = container.querySelector('[data-testid="sonner-toaster"]');
    expect(toaster).toBeInTheDocument();
  });

  it('renderiza com tema específico', () => {
    const { container } = render(<Toaster theme="dark" />);
    const toaster = container.querySelector('[data-testid="sonner-toaster"]');
    expect(toaster).toBeInTheDocument();
  });

  it('aplica classes customizadas', () => {
    const { container } = render(<Toaster className="custom-sonner" />);
    const toaster = container.querySelector('[data-testid="sonner-toaster"]');
    expect(toaster).toHaveClass('custom-sonner');
  });

  it('configura posição', () => {
    const { container } = render(<Toaster position="top-center" />);
    const toaster = container.querySelector('[data-testid="sonner-toaster"]');
    expect(toaster).toBeInTheDocument();
  });
});
