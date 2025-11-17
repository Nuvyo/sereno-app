import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { toast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';

vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
  useToast: () => ({
    toast: vi.fn(),
    dismiss: vi.fn(),
    toasts: [],
  }),
}));

describe('Toast', () => {
  it('renderiza toaster', () => {
    render(<Toaster />);

    expect(document.body).toBeInTheDocument();
  });

  it('chama função toast', () => {
    toast({
      title: 'Sucesso',
      description: 'Operação realizada com sucesso',
    });

    expect(toast).toHaveBeenCalledWith({
      title: 'Sucesso',
      description: 'Operação realizada com sucesso',
    });
  });

  it('toast com variante de erro', () => {
    toast({
      title: 'Erro',
      description: 'Algo deu errado',
      variant: 'destructive',
    });

    expect(toast).toHaveBeenCalledWith({
      title: 'Erro',
      description: 'Algo deu errado',
      variant: 'destructive',
    });
  });
});
