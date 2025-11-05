import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

// Mock de embla-carousel-react para evitar dependências do ambiente DOM
vi.mock('embla-carousel-react', () => ({
  __esModule: true,
  // O módulo exporta o hook como default; retornamos a tupla esperada
  default: () => [
    vi.fn(),
    {
      on: vi.fn(),
      off: vi.fn(),
      canScrollNext: () => true,
      canScrollPrev: () => true,
      scrollNext: vi.fn(),
      scrollPrev: vi.fn(),
    },
  ],
}));

describe('Carousel', () => {
  it('renderiza carousel com itens', () => {
    const { container } = render(
      <Carousel className="w-full max-w-xs">
        <CarouselContent>
          <CarouselItem>Item 1</CarouselItem>
          <CarouselItem>Item 2</CarouselItem>
          <CarouselItem>Item 3</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>,
    );
    expect(container.textContent).toContain('Item 1');
    expect(container.textContent).toContain('Item 2');
    expect(container.textContent).toContain('Item 3');
  });

  it('renderiza botões de navegação', () => {
    const { container } = render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Item</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>,
    );

    const prevButton =
      (container.querySelector('button:has(.sr-only)') as HTMLButtonElement) ||
      (container.querySelector('button') as HTMLButtonElement);
    const nextButton = container.querySelectorAll('button')[1] as HTMLButtonElement;

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('aplica orientação vertical', () => {
    const { container } = render(
      <Carousel orientation="vertical">
        <CarouselContent>
          <CarouselItem>Item</CarouselItem>
        </CarouselContent>
      </Carousel>,
    );
    expect(container.textContent).toContain('Item');
  });
});
