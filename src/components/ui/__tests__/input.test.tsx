import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '@/components/ui/input';

describe('Input', () => {
  it('aceita digitação', async () => {
    const user = userEvent.setup();

    render(<Input placeholder='digite' />);
    const input = screen.getByPlaceholderText('digite') as HTMLInputElement;

    await user.type(input, 'abc');
    expect(input.value).toBe('abc');
  });
});
