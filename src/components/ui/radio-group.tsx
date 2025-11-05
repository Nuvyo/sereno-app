import * as React from 'react';
import { Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RadioGroupContextType {
  value?: string;
  onChange: (value: string) => void;
  name: string;
}

const RadioGroupContext = React.createContext<RadioGroupContextType | undefined>(undefined);

interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      className,
      value,
      defaultValue,
      onValueChange,
      name = `radio-group-${Math.random()}`,
      ...props
    },
    ref,
  ) => {
    const [selectedValue, setSelectedValue] = React.useState(value || defaultValue);

    React.useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value);
      }
    }, [value]);

    const onChange = React.useCallback(
      (newValue: string) => {
        if (value === undefined) {
          setSelectedValue(newValue);
        }
        onValueChange?.(newValue);
      },
      [value, onValueChange],
    );

    return (
      <RadioGroupContext.Provider value={{ value: selectedValue, onChange, name }}>
        <div ref={ref} role="radiogroup" className={cn('grid gap-2', className)} {...props} />
      </RadioGroupContext.Provider>
    );
  },
);
RadioGroup.displayName = 'RadioGroup';

interface RadioGroupItemProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  value: string;
}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, ...props }, ref) => {
    const context = React.useContext(RadioGroupContext);
    if (!context) throw new Error('RadioGroupItem must be used within RadioGroup');

    const isChecked = context.value === value;
    const id = React.useId();

    return (
      <div className="relative inline-flex items-center">
        <input
          ref={ref}
          id={props.id || id}
          type="radio"
          className="absolute h-4 w-4 opacity-0 cursor-pointer peer"
          checked={isChecked}
          name={context.name}
          value={value}
          onChange={() => context.onChange(value)}
          {...props}
        />
        <label
          htmlFor={props.id || id}
          className={cn(
            'aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background cursor-pointer',
            'peer-focus:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2',
            'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
            'flex items-center justify-center',
            className,
          )}
        >
          {isChecked && <Circle className="h-2.5 w-2.5 fill-current text-current" />}
        </label>
      </div>
    );
  },
);
RadioGroupItem.displayName = 'RadioGroupItem';

export { RadioGroup, RadioGroupItem };
