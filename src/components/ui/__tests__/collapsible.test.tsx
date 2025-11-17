import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';

describe('Collapsible', () => {
  it('renderiza trigger e expande conteúdo', async () => {
    const user = userEvent.setup();

    render(
      <Collapsible>
        <CollapsibleTrigger>Expandir</CollapsibleTrigger>
        <CollapsibleContent>Conteúdo recolhível</CollapsibleContent>
      </Collapsible>,
    );

    const trigger = screen.getByText('Expandir');

    expect(trigger).toBeInTheDocument();

    await user.click(trigger);
    expect(screen.getByText('Conteúdo recolhível')).toBeInTheDocument();
  });

  it('controla estado externamente', () => {
    const onOpenChange = vi.fn();

    render(
      <Collapsible open={true} onOpenChange={onOpenChange}>
        <CollapsibleTrigger>Trigger</CollapsibleTrigger>
        <CollapsibleContent>Conteúdo visível</CollapsibleContent>
      </Collapsible>,
    );

    expect(screen.getByText('Conteúdo visível')).toBeInTheDocument();
  });
});
