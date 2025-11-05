import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from '@/components/ui/textarea';

describe('Textarea', () => {
  it('aceita digitação', async () => {
    const user = userEvent.setup();
    render(<Textarea placeholder="msg" />);
    const input = screen.getByPlaceholderText('msg') as HTMLTextAreaElement;
    await user.type(input, 'olá mundo');
    expect(input.value).toBe('olá mundo');
  });
});
