import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { Calendar } from '@/components/ui/calendar';

describe('Calendar', () => {
  it('renderiza calendário com data atual', () => {
    const { getByRole } = render(<Calendar />);
    // react-day-picker usa role="grid" para a tabela do calendário
    const grid = getByRole('grid');
    expect(grid).toBeInTheDocument();
  });

  it('renderiza com mês específico', () => {
    const date = new Date(2024, 0, 15); // Janeiro 2024
    const { container } = render(<Calendar month={date} />);
    const grid = within(container).getByRole('grid');
    expect(grid).toBeInTheDocument();
  });

  it('aplica classes customizadas', () => {
    const { container } = render(<Calendar className="custom-calendar" />);
    // a classe é aplicada no contêiner do Calendar, não na tabela (grid)
    const custom = container.querySelector('.custom-calendar');
    expect(custom).toBeInTheDocument();
  });

  it('renderiza com data selecionada', () => {
    const selectedDate = new Date(2024, 0, 15);
    const { container } = render(<Calendar selected={selectedDate} />);
    const grid = within(container).getByRole('grid');
    expect(grid).toBeInTheDocument();
  });
});
