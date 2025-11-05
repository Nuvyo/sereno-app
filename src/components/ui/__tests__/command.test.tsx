import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen, within } from '@testing-library/react';
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';

describe('Command', () => {
  it('renderiza command com itens', () => {
    const { container, getByPlaceholderText, getByText } = render(
      <Command>
        <CommandInput placeholder="Digite um comando..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          <CommandGroup heading="Sugestões">
            <CommandItem>Calendário</CommandItem>
            <CommandItem>Calculadora</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>,
    );

    expect(getByPlaceholderText('Digite um comando...')).toBeInTheDocument();
    const list = container.querySelector('[cmdk-list]') as HTMLElement;
    expect(within(list).getByText('Calendário')).toBeInTheDocument();
    expect(within(list).getByText('Calculadora')).toBeInTheDocument();
  });

  it('filtra itens baseado na busca', async () => {
    const user = userEvent.setup();
    const { container, getByPlaceholderText } = render(
      <Command>
        <CommandInput placeholder="Buscar..." />
        <CommandList>
          <CommandGroup>
            <CommandItem>Calendário</CommandItem>
            <CommandItem>Calculadora</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>,
    );

    const input = getByPlaceholderText('Buscar...');
    await user.type(input, 'cal');

    const list = container.querySelector('[cmdk-list]') as HTMLElement;
    expect(within(list).getByText('Calendário')).toBeInTheDocument();
  });

  it('executa callback ao selecionar item', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    const { container } = render(
      <Command>
        <CommandList>
          <CommandGroup>
            <CommandItem onSelect={onSelect}>Item</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>,
    );

    await user.click(within(container).getByText('Item'));
    expect(onSelect).toHaveBeenCalled();
  });
});
