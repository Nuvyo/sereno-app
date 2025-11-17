import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import NotFound from '@/pages/NotFound';
import { renderWithProviders } from '@/test/utils';

describe('NotFound page', () => {
  it('exibe mensagem 404 (PT-BR) e loga erro no console', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderWithProviders(<NotFound />, { route: '/rota-inexistente' });

    expect(screen.getByText(/404/i)).toBeInTheDocument();
    expect(screen.getByText(/página não encontrada/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /voltar para a página inicial/i })).toBeInTheDocument();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
