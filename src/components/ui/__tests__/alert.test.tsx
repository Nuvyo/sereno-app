import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

describe('Alert', () => {
  it('renderiza título e descrição', () => {
    render(
      <Alert>
        <AlertTitle>Aviso</AlertTitle>
        <AlertDescription>Detalhe</AlertDescription>
      </Alert>,
    );

    expect(screen.getByText('Aviso')).toBeInTheDocument();
    expect(screen.getByText('Detalhe')).toBeInTheDocument();
  });
});
