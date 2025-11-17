import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

describe('Tooltip', () => {
  it('apresenta conteúdo ao hover', async () => {
    const user = userEvent.setup();

    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Info</TooltipTrigger>
          <TooltipContent>Dica</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    const trigger = screen.getByRole('button', { name: /info/i });

    await user.hover(trigger);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    await user.unhover(trigger);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
