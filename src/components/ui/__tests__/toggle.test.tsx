import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toggle } from '@/components/ui/toggle';

describe('Toggle', () => {
  it('alterna o estado pressed ao clicar', async () => {
    const user = userEvent.setup();

    render(<Toggle>Ativar</Toggle>);
    const btn = screen.getByRole('button', { name: /ativar/i });

    expect(btn).toHaveAttribute('data-state', 'off');
    await user.click(btn);
    expect(btn).toHaveAttribute('data-state', 'on');
  });
});
