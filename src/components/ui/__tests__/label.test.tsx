import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, within } from '@testing-library/react';
import { Label } from '@/components/ui/label';

describe('Label', () => {
  it('renderiza texto da label', () => {
    const { getByText } = render(<Label>Nome</Label>);
    expect(getByText('Nome')).toBeInTheDocument();
  });

  it('associa com input via htmlFor', () => {
    const { container } = render(
      <div>
        <Label htmlFor="name">Nome</Label>
        <input id="name" type="text" />
      </div>,
    );

    const label = within(container).getByText('Nome');
    const input = within(container).getByRole('textbox');

    expect(label).toHaveAttribute('for', 'name');
    expect(input).toHaveAttribute('id', 'name');
  });

  it('aplica classes customizadas', () => {
    const { getByText } = render(<Label className="text-red-500">Erro</Label>);
    const label = getByText('Erro');
    expect(label).toHaveClass('text-red-500');
  });
});
