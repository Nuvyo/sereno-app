import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, fireEvent } from '@testing-library/react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp';

describe('InputOTP', () => {
  // Controla timers do componente para evitar estouros após o teardown
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });
  it('renderiza input OTP com slots', () => {
    const { container } = render(
      <InputOTP maxLength={6}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>,
    );

    // Verifica se o input oculto foi renderizado
    const input = container.querySelector('input[data-input-otp="true"]');
    expect(input).toBeInTheDocument();
  });

  it('aceita entrada de números', () => {
    const onChange = vi.fn();

    const { container } = render(
      <InputOTP maxLength={4} onChange={onChange}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>,
    );

    const input = container.querySelector('input[data-input-otp="true"]') as HTMLInputElement;
    fireEvent.input(input, { target: { value: '1234' } });

    expect(onChange).toHaveBeenCalled();
  });

  it('aplica classes customizadas', () => {
    const { container } = render(
      <InputOTP maxLength={2} className="custom-class">
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
        </InputOTPGroup>
      </InputOTP>,
    );

    const input = container.querySelector('input[data-input-otp="true"]');
    expect(input).toHaveClass('custom-class');
  });
});
