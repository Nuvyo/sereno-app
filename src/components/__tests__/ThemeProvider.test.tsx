import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { useTheme } from '@/components/use-theme';

function ThemeConsumer() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
    <div>
      <div>theme:{theme}</div>
      <div>resolved:{resolvedTheme}</div>
      <button onClick={() => setTheme('dark')}>dark</button>
    </div>
  );
}

describe('ThemeProvider', () => {
  it('fornece contexto e permite alteração de tema', () => {
    render(
      <ThemeProvider defaultTheme="light" storageKey="test-ui-theme">
        <ThemeConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByText(/theme:light/)).toBeInTheDocument();
    // clica para mudar tema e verifica localStorage
    screen.getByText('dark').click();
    expect(window.localStorage.getItem('test-ui-theme')).toBe('dark');
  });
});
