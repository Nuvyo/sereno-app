import React from 'react';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { Switch } from '@/components/ui/switch';

describe('Switch', () => {
  it('alterna estado ao clicar', async () => {
    const user = userEvent.setup();

    render(<Switch aria-label='ativar' />);
    const input = screen.getByLabelText('ativar') as HTMLInputElement;

    expect(input.checked).toBe(false);
    await user.click(input);
    expect(input.checked).toBe(true);
  });
});
