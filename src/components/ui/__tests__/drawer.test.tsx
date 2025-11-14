import React from 'react';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';

describe('Drawer', () => {
  it('abre drawer ao clicar no trigger', async () => {
    const user = userEvent.setup();

    render(
      <Drawer>
        <DrawerTrigger>Abrir Drawer</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Título do Drawer</DrawerTitle>
            <DrawerDescription>Descrição do drawer</DrawerDescription>
          </DrawerHeader>
          <div>Conteúdo do drawer</div>
          <DrawerFooter>
            <DrawerClose>Fechar</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>,
    );

    const trigger = screen.getByText('Abrir Drawer');

    await user.click(trigger);

    expect(screen.getByText('Título do Drawer')).toBeInTheDocument();
    expect(screen.getByText('Descrição do drawer')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo do drawer')).toBeInTheDocument();
  });

  it('aplica classes customizadas', () => {
    render(
      <Drawer open>
        <DrawerContent className='custom-drawer'>Conteúdo customizado</DrawerContent>
      </Drawer>,
    );

    expect(screen.getByText('Conteúdo customizado')).toBeInTheDocument();
  });
});
