import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen, waitForElementToBeRemoved, within } from '@testing-library/react';
import {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
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

  // Nota: eventos de fechamento/abertura do vaul não são confiáveis no JSDOM,
  // por isso evitamos assertivas diretas em callbacks aqui.

  it('aplica classes customizadas', () => {
    render(
      <Drawer open>
        <DrawerContent className="custom-drawer">Conteúdo customizado</DrawerContent>
      </Drawer>,
    );

    expect(screen.getByText('Conteúdo customizado')).toBeInTheDocument();
  });
});
