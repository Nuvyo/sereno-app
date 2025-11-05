import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Slider } from '@/components/ui/slider';

describe('Slider', () => {
  it('dispara onValueChange ao clicar na trilha', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(<Slider onValueChange={onValueChange} />);

    // Seleciona a trilha pelo utilitário de classe do Tailwind presente no componente
    const track = container.querySelector('.bg-secondary') as HTMLElement;
    await user.click(track);
    expect(onValueChange).toHaveBeenCalled();
  });
});
