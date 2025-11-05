import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';

// Mock do react-hook-form
vi.mock('react-hook-form', () => ({
  useForm: vi.fn(() => ({
    control: {},
    handleSubmit: vi.fn((fn) => fn),
    formState: { errors: {} },
  })),
  useFormContext: vi.fn(() => ({
    getFieldState: vi.fn(() => ({ error: undefined })),
    formState: {},
  })),
  FormProvider: ({ children, ..._rest }: { children: React.ReactNode }) => <>{children}</>,
  Controller: ({ render }: { render: (props: Record<string, unknown>) => React.ReactNode }) =>
    render({ field: {}, fieldState: {}, formState: {} }),
}));

function TestForm() {
  const form = useForm();

  return (
    <Form {...form}>
      <form>
        <FormField
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Digite seu email" {...field} />
              </FormControl>
              <FormDescription>Seu endereço de email será usado para login.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

describe('Form', () => {
  it('renderiza campos do formulário', () => {
    render(<TestForm />);

    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite seu email')).toBeInTheDocument();
    expect(screen.getByText('Seu endereço de email será usado para login.')).toBeInTheDocument();
  });

  it('renderiza label associada ao input', () => {
    const { container } = render(<TestForm />);

    const label = container.querySelector('label') as HTMLLabelElement;
    const input = container.querySelector(
      "input[placeholder='Digite seu email']",
    ) as HTMLInputElement;

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(label.getAttribute('for')).toBe(input.getAttribute('id'));
  });
});
