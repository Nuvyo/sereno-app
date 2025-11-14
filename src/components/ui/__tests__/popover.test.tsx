import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

describe('Popover', () => {
  it('abre e fecha pelo trigger', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>Abrir</PopoverTrigger>
        <PopoverContent>Conteúdo</PopoverContent>
      </Popover>,
    );

    expect(screen.queryByText('Conteúdo')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /abrir/i }));

    expect(screen.getByText('Conteúdo')).toBeInTheDocument();

    await user.click(document.body);

    expect(screen.queryByText('Conteúdo')).not.toBeInTheDocument();
  });
});
