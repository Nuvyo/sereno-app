import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Toaster } from '@/components/ui/toaster';

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toasts: [
      {
        id: '1',
        title: 'Título de Teste',
        description: 'Descrição de Teste',
        open: true,
      },
    ],
  }),
}));

describe('Toaster', () => {
  it('renderiza título e descrição dos toasts fornecidos pelo hook', () => {
    render(<Toaster />);
    expect(screen.getByText('Título de Teste')).toBeInTheDocument();
    expect(screen.getByText('Descrição de Teste')).toBeInTheDocument();
  });
});
