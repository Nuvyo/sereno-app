import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState(checked || false);

    React.useEffect(() => {
      if (checked !== undefined) {
        setIsChecked(checked);
      }
    }, [checked]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked;

      setIsChecked(newChecked);
      onCheckedChange?.(newChecked);
    };
    const id = React.useId();

    return (
      <div className='relative inline-flex items-center'>
        <input
          ref={ref}
          id={props.id || id}
          type='checkbox'
          className='absolute h-4 w-4 opacity-0 cursor-pointer peer'
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
          {...props}
        />
        <label
          htmlFor={props.id || id}
          className={cn(
            'h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background transition-colors cursor-pointer',
            'peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2',
            'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
            isChecked && 'bg-primary text-primary-foreground',
            className,
          )}
        >
          {isChecked && (
            <div className='flex items-center justify-center text-current'>
              <Check className='h-4 w-4' />
            </div>
          )}
        </label>
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
