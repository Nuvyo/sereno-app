import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

describe('Accordion', () => {
  it('expande e recolhe item', async () => {
    const user = userEvent.setup();

    render(
      <Accordion type='single' defaultValue='item-1'>
        <AccordionItem value='item-1'>
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Conteúdo 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    expect(screen.getByText('Conteúdo 1')).toBeVisible();

    await user.click(screen.getByRole('button', { name: /item 1/i }));

    expect(screen.getByText('Conteúdo 1')).not.toBeVisible();
  });
});
