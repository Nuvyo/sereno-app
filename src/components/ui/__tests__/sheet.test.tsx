import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen, within } from '@testing-library/react';
import {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

describe('Sheet', () => {
  it('abre sheet ao clicar no trigger', async () => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger>Abrir Sheet</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Título do Sheet</SheetTitle>
            <SheetDescription>Descrição do sheet</SheetDescription>
          </SheetHeader>
          <div>Conteúdo do sheet</div>
          <SheetFooter>
            <SheetClose>Fechar</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>,
    );

    const trigger = screen.getByText('Abrir Sheet');

    await user.click(trigger);

    expect(screen.getByText('Título do Sheet')).toBeInTheDocument();
    expect(screen.getByText('Descrição do sheet')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo do sheet')).toBeInTheDocument();
  });

  it('fecha sheet ao clicar em fechar', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { container } = render(
      <Sheet open onOpenChange={onOpenChange}>
        <SheetContent>
          <SheetClose>Fechar</SheetClose>
        </SheetContent>
      </Sheet>,
    );
    const dialogs = screen.getAllByRole('dialog');
    const dialog = dialogs[dialogs.length - 1];
    const closeButton = within(dialog).getByText('Fechar');

    await user.click(closeButton);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('renderiza em diferentes posições', () => {
    render(
      <Sheet open>
        <SheetContent side='left'>Conteúdo lateral</SheetContent>
      </Sheet>,
    );

    expect(screen.getByText('Conteúdo lateral')).toBeInTheDocument();
  });
});
