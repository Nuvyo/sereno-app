import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

describe('Avatar', () => {
  it('renderiza com fallback quando não há imagem', () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    );

    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renderiza imagem quando src é fornecido', () => {
    const { container } = render(
      <Avatar>
        <AvatarImage src='/avatar.jpg' alt='Avatar' />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    );
    const image = within(container).getByAltText('Avatar');

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/avatar.jpg');
  });

  it('mostra fallback quando imagem falha ao carregar', () => {
    const { container } = render(
      <Avatar>
        <AvatarImage src='/invalid.jpg' alt='Avatar' />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    );
    const image = within(container).getByAltText('Avatar');

    image.dispatchEvent(new Event('error'));

    expect(within(container).getByText('JD')).toBeInTheDocument();
  });
});
