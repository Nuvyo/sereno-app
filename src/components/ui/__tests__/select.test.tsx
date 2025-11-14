import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

describe('Select', () => {
  it('seleciona um item e fecha', async () => {
    const user = userEvent.setup();

    render(
      <Select defaultValue='1'>
        <SelectTrigger>
          <SelectValue placeholder='Escolha' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='1'>Um</SelectItem>
          <SelectItem value='2'>Dois</SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(screen.getByText('1') || screen.getByText('Um')).toBeTruthy();

    await user.click(screen.getByRole('button'));
    await user.click(screen.getByText('Dois'));
    await user.click(document.body);

    expect(screen.queryByText('Dois')).not.toBeInTheDocument();
  });
});
