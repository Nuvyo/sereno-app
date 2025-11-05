import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen, within, fireEvent } from '@testing-library/react';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
} from '@/components/ui/context-menu';

describe('ContextMenu', () => {
  it('abre menu ao clicar com botão direito', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ContextMenu>
        <ContextMenuTrigger>Clique direito aqui</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Copiar</ContextMenuItem>
          <ContextMenuItem>Colar</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );

    const trigger = within(container).getByText('Clique direito aqui');
    fireEvent.contextMenu(trigger);

    // Os itens não possuem role acessível neste wrapper simples
    expect(screen.getAllByText('Copiar').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Colar').length).toBeGreaterThan(0);
  });

  it('executa callback ao selecionar item', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    const { container } = render(
      <ContextMenu>
        <ContextMenuTrigger>Trigger</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={onSelect}>Ação</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );

    const trigger = within(container).getByText('Trigger');
    fireEvent.contextMenu(trigger);

    const item = screen.getAllByText('Ação').pop() as HTMLElement;
    await user.click(item);

    expect(onSelect).toHaveBeenCalled();
  });

  it('renderiza checkbox items', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ContextMenu>
        <ContextMenuTrigger>Trigger</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuCheckboxItem checked={true}>Opção marcada</ContextMenuCheckboxItem>
        </ContextMenuContent>
      </ContextMenu>,
    );

    const trigger = within(container).getByText('Trigger');
    fireEvent.contextMenu(trigger);

    const item = screen.getAllByText('Opção marcada').pop();
    expect(item).toBeInTheDocument();
  });
});
