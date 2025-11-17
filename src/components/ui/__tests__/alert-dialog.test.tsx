import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

describe('AlertDialog', () => {
  it('renderiza trigger e abre modal', async () => {
    const user = userEvent.setup();

    render(
      <AlertDialog>
        <AlertDialogTrigger>Abrir Dialog</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar ação</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    );

    const trigger = screen.getByText('Abrir Dialog');

    await user.click(trigger);

    expect(screen.getByText('Confirmar ação')).toBeInTheDocument();
    expect(screen.getByText('Esta ação não pode ser desfeita.')).toBeInTheDocument();
  });

  it('executa callback ao cancelar', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCancel}>Cancelar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    );

    const cancelBtn = screen.getAllByText('Cancelar').pop() as HTMLElement;

    await user.click(cancelBtn);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
