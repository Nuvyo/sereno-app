import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import NotFound from '@/pages/NotFound';
import { renderWithProviders } from '@/test/utils';

describe('NotFound page', () => {
  it('exibe mensagem 404 e loga erro no console', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderWithProviders(<NotFound />, { route: '/rota-inexistente' });

    expect(screen.getByText(/404/i)).toBeInTheDocument();
    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /return to home/i })).toBeInTheDocument();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
