import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { toggleVariants } from '@/components/ui/toggle-variants';

const toggleGroupVariants = cva('flex items-center justify-center gap-1', {
  variants: {
    variant: {
      default: 'bg-transparent',
      outline: 'border border-input bg-transparent',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface ToggleGroupContextType {
  type: 'single' | 'multiple';
  value: string | string[];
  onValueChange: (value: string) => void;
  variant?: VariantProps<typeof toggleVariants>['variant'];
  size?: VariantProps<typeof toggleVariants>['size'];
}

const ToggleGroupContext = React.createContext<ToggleGroupContextType | undefined>(undefined);

interface ToggleGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toggleGroupVariants>,
    VariantProps<typeof toggleVariants> {
  type?: 'single' | 'multiple';
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
}

const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  ({ className, type = 'single', value, defaultValue, onValueChange, variant, size, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState<string | string[]>(
      value ?? defaultValue ?? (type === 'single' ? '' : []),
    );
    const currentValue = value ?? internalValue;
    const handleValueChange = React.useCallback(
      (itemValue: string) => {
        let newValue: string | string[];

        if (type === 'single') {
          newValue = currentValue === itemValue ? '' : itemValue;
        } else {
          const arrayValue = Array.isArray(currentValue) ? currentValue : [];

          newValue = arrayValue.includes(itemValue)
            ? arrayValue.filter((v) => v !== itemValue)
            : [...arrayValue, itemValue];
        }

        if (value === undefined) {
          setInternalValue(newValue);
        }

        onValueChange?.(newValue);
      },
      [type, currentValue, value, onValueChange],
    );

    return (
      <ToggleGroupContext.Provider
        value={{ type, value: currentValue, onValueChange: handleValueChange, variant, size }}
      >
        <div ref={ref} role='group' className={cn(toggleGroupVariants({ variant, className }))} {...props}>
          {children}
        </div>
      </ToggleGroupContext.Provider>
    );
  },
);

ToggleGroup.displayName = 'ToggleGroup';

interface ToggleGroupItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof toggleVariants> {
  value: string;
}

const ToggleGroupItem = React.forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  ({ className, value, variant, size, ...props }, ref) => {
    const context = React.useContext(ToggleGroupContext);

    if (!context) throw new Error('ToggleGroupItem must be used within ToggleGroup');

    const isPressed =
      context.type === 'single'
        ? context.value === value
        : Array.isArray(context.value) && context.value.includes(value);

    return (
      <button
        ref={ref}
        type='button'
        aria-pressed={isPressed}
        data-state={isPressed ? 'on' : 'off'}
        onClick={() => context.onValueChange(value)}
        className={cn(
          toggleVariants({
            variant: variant || context.variant,
            size: size || context.size,
            className,
          }),
        )}
        {...props}
      />
    );
  },
);

ToggleGroupItem.displayName = 'ToggleGroupItem';

export { ToggleGroup, ToggleGroupItem };
