import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renderiza e dispara onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Clique</Button>);
    const btn = screen.getByRole('button', { name: /clique/i });

    await user.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
