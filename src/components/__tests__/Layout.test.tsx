import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils';
import { Layout } from '@/components/Layout';

function DummyPage() {
  return <div data-testid="page">Conteúdo</div>;
}

describe('Layout', () => {
  it('renderiza o menu lateral e conteúdo', () => {
    renderWithProviders(
      <Layout>
        <DummyPage />
      </Layout>,
      { route: '/' },
    );

    expect(screen.getByText('UI Showcase')).toBeInTheDocument();
    expect(screen.getByTestId('page')).toBeInTheDocument();
    // Link de navegação existente
    expect(screen.getByText('Buttons')).toBeInTheDocument();

    // Link deve apontar para a rota /components/buttons
    const link = screen.getByText('Buttons').closest('a');
    expect(link).toBeTruthy();
    // Em ambiente de teste, href pode ser relativo; checamos inclusão do path
    expect(link?.getAttribute('href') || '').toContain('/components/buttons');
  });
});
