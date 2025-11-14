import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { toggleVariants } from './toggle-variants';

interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof toggleVariants> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, variant, size, pressed, defaultPressed = false, onPressedChange, ...props }, ref) => {
    const [isPressed, setIsPressed] = React.useState(pressed ?? defaultPressed);

    React.useEffect(() => {
      if (pressed !== undefined) {
        setIsPressed(pressed);
      }
    }, [pressed]);

    const handleClick = () => {
      const newPressed = !isPressed;

      if (pressed === undefined) {
        setIsPressed(newPressed);
      }

      onPressedChange?.(newPressed);
    };

    return (
      <button
        ref={ref}
        type='button'
        aria-pressed={isPressed}
        data-state={isPressed ? 'on' : 'off'}
        onClick={handleClick}
        className={cn(toggleVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);

Toggle.displayName = 'Toggle';

export { Toggle };
