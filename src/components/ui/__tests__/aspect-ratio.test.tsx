import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

describe('AspectRatio', () => {
  it('renderiza com proporção correta', () => {
    render(
      <AspectRatio ratio={16 / 9}>
        <img src='/test.jpg' alt='Test' />
      </AspectRatio>,
    );

    const image = screen.getByAltText('Test');

    expect(image).toBeInTheDocument();
  });

  it('aplica classes customizadas', () => {
    render(
      <AspectRatio ratio={1} className='custom-class'>
        <div>Conteúdo</div>
      </AspectRatio>,
    );

    expect(screen.getByText('Conteúdo')).toBeInTheDocument();
  });
});
