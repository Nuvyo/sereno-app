import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

describe('ToggleGroup', () => {
  it('renderiza grupo de toggles', () => {
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="left">Esquerda</ToggleGroupItem>
        <ToggleGroupItem value="center">Centro</ToggleGroupItem>
        <ToggleGroupItem value="right">Direita</ToggleGroupItem>
      </ToggleGroup>,
    );

    expect(screen.getByText('Esquerda')).toBeInTheDocument();
    expect(screen.getByText('Centro')).toBeInTheDocument();
    expect(screen.getByText('Direita')).toBeInTheDocument();
  });

  it('permite seleção múltipla', () => {
    render(
      <ToggleGroup type="multiple">
        <ToggleGroupItem value="bold">Negrito</ToggleGroupItem>
        <ToggleGroupItem value="italic">Itálico</ToggleGroupItem>
      </ToggleGroup>,
    );

    expect(screen.getByText('Negrito')).toBeInTheDocument();
    expect(screen.getByText('Itálico')).toBeInTheDocument();
  });

  it('renderiza com valor padrão', () => {
    const { container } = render(
      <ToggleGroup type="single" defaultValue="center">
        <ToggleGroupItem value="left">Esquerda</ToggleGroupItem>
        <ToggleGroupItem value="center">Centro</ToggleGroupItem>
      </ToggleGroup>,
    );

    const selected = container.querySelector('button[aria-pressed="true"]');
    expect(selected).toBeTruthy();
    expect(selected?.textContent).toMatch(/Centro/i);
  });
});
