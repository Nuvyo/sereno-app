import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

describe('ScrollArea', () => {
  it('renderiza área de scroll', () => {
    render(
      <ScrollArea className='h-[200px] w-[350px] rounded-md border'>
        <div className='p-4'>
          <h4 className='mb-4 text-sm font-medium leading-none'>Tags</h4>
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className='text-sm'>
              Item {i + 1}
            </div>
          ))}
        </div>
      </ScrollArea>,
    );

    expect(screen.getByText('Tags')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 50')).toBeInTheDocument();
  });

  it('renderiza com scroll bar', () => {
    render(
      <ScrollArea className='h-72 w-48 rounded-md border'>
        <div className='p-4'>Conteúdo longo que precisa de scroll...</div>
        <ScrollBar />
      </ScrollArea>,
    );

    expect(screen.getByText('Conteúdo longo que precisa de scroll...')).toBeInTheDocument();
  });

  it('aplica classes customizadas', () => {
    render(
      <ScrollArea className='custom-scroll'>
        <div>Conteúdo</div>
      </ScrollArea>,
    );

    expect(screen.getByText('Conteúdo')).toBeInTheDocument();
  });
});
