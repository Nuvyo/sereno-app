import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

describe('RadioGroup', () => {
  it('seleciona um item ao clicar', async () => {
    const user = userEvent.setup();

    render(
      <RadioGroup defaultValue='a'>
        <RadioGroupItem value='a' aria-label='A' />
        <RadioGroupItem value='b' aria-label='B' />
      </RadioGroup>,
    );

    const a = screen.getByLabelText('A') as HTMLInputElement;
    const b = screen.getByLabelText('B') as HTMLInputElement;

    expect(a.checked).toBe(true);
    expect(b.checked).toBe(false);
    await user.click(b);
    expect(a.checked).toBe(false);
    expect(b.checked).toBe(true);
  });
});
