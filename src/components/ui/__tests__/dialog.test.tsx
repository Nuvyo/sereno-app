import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog';

describe('Dialog', () => {
  it('abre ao clicar no trigger e fecha no overlay', async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Título</DialogTitle>
          <p>Mensagem</p>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.queryByText('Mensagem')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /open/i }));
    expect(screen.getByText('Mensagem')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /close/i }));

    expect(screen.queryByText('Mensagem')).not.toBeInTheDocument();
  });
});
