import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';

describe('ThemeToggle', () => {
  it('renderiza e alterna tema ao clicar', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider defaultTheme='light' storageKey='test-ui-theme'>
        <ThemeToggle />
      </ThemeProvider>,
    );

    const button = await screen.findByRole('button');

    await user.click(button);
    expect(window.localStorage.getItem('test-ui-theme')).toBe('dark');
    await user.click(button);
    expect(window.localStorage.getItem('test-ui-theme')).toBe('light');
  });
});
