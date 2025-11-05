import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';

export function renderWithProviders(ui: React.ReactElement, options?: { route?: string }) {
  window.history.pushState({}, 'Test page', options?.route || '/');
  return render(
    <MemoryRouter initialEntries={[options?.route || '/']}>
      <ThemeProvider>{ui}</ThemeProvider>
    </MemoryRouter>,
  );
}
