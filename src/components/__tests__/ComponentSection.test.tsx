import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderWithProviders } from '@/test/utils';
import { ComponentSection } from '@/components/ComponentSection';

describe('ComponentSection', () => {
  it('renderiza título, descrição e filhos', () => {
    renderWithProviders(
      <ComponentSection title='Meu Título' description='Minha descrição'>
        <button>Filho</button>
      </ComponentSection>,
    );

    expect(screen.getByText('Meu Título')).toBeInTheDocument();
    expect(screen.getByText('Minha descrição')).toBeInTheDocument();
    expect(screen.getByText('Filho')).toBeInTheDocument();
  });

  it('não renderiza descrição quando não fornecida', () => {
    renderWithProviders(
      <ComponentSection title='Sem descrição'>
        <div>conteúdo</div>
      </ComponentSection>,
    );

    expect(screen.getByText('Sem descrição')).toBeInTheDocument();
    expect(screen.queryByText('Minha descrição')).not.toBeInTheDocument();
  });
});
