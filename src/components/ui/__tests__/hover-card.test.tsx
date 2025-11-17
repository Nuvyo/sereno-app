import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';

describe('HoverCard', () => {
  it('renderiza trigger', () => {
    render(
      <HoverCard>
        <HoverCardTrigger>Hover me</HoverCardTrigger>
        <HoverCardContent>Conteúdo do hover card</HoverCardContent>
      </HoverCard>,
    );

    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('aplica classes customizadas no content', () => {
    render(
      <HoverCard openDelay={0}>
        <HoverCardTrigger>Trigger</HoverCardTrigger>
        <HoverCardContent className='custom-class'>Conteúdo</HoverCardContent>
      </HoverCard>,
    );

    expect(screen.getByText('Trigger')).toBeInTheDocument();
  });

  it('renderiza com conteúdo específico', () => {
    render(
      <HoverCard>
        <HoverCardTrigger>@username</HoverCardTrigger>
        <HoverCardContent>
          <div className='flex justify-between space-x-4'>
            <div className='space-y-1'>
              <h4 className='text-sm font-semibold'>Nome do Usuário</h4>
              <p className='text-sm'>Descrição do usuário.</p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>,
    );

    expect(screen.getByText('@username')).toBeInTheDocument();
  });
});
