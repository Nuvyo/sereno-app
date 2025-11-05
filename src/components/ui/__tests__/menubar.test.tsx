import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
} from '@/components/ui/menubar';

describe('Menubar', () => {
  it('renderiza menubar com menus', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Arquivo</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Novo</MenubarItem>
            <MenubarItem>Abrir</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Sair</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Editar</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Copiar</MenubarItem>
            <MenubarItem>Colar</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    );

    expect(screen.getByText('Arquivo')).toBeInTheDocument();
    expect(screen.getByText('Editar')).toBeInTheDocument();
  });

  it('abre menu ao clicar', async () => {
    const user = userEvent.setup();
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Menu</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Item 1</MenubarItem>
            <MenubarItem>Item 2</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    );

    const trigger = screen.getByText('Menu');
    await user.click(trigger);

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('executa callback ao selecionar item', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Menu</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={onSelect}>Ação</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    );

    const trigger = screen.getAllByText('Menu').pop() as HTMLElement;
    await user.click(trigger);

    const item = screen.getAllByText('Ação').pop() as HTMLElement;
    await user.click(item);

    expect(onSelect).toHaveBeenCalled();
  });
});
