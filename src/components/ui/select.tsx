import * as React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectContextType {
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = React.createContext<SelectContextType | undefined>(undefined);

interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ children, value, defaultValue, onValueChange, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value || defaultValue);
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value);
      }
    }, [value]);

    const handleValueChange = React.useCallback(
      (newValue: string) => {
        if (value === undefined) {
          setInternalValue(newValue);
        }

        onValueChange?.(newValue);
        setOpen(false);
      },
      [value, onValueChange],
    );

    return (
      <SelectContext.Provider value={{ value: internalValue, onValueChange: handleValueChange, open, setOpen }}>
        <div ref={ref} {...props}>
          {children}
        </div>
      </SelectContext.Provider>
    );
  },
);

Select.displayName = 'Select';

const SelectGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={className} {...props} />,
);

SelectGroup.displayName = 'SelectGroup';

interface SelectValueProps {
  placeholder?: string;
}

const SelectValue: React.FC<SelectValueProps> = ({ placeholder }) => {
  const context = React.useContext(SelectContext);

  if (!context) throw new Error('SelectValue must be used within Select');

  return <span>{context.value || placeholder}</span>;
};
const SelectTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(SelectContext);

    if (!context) throw new Error('SelectTrigger must be used within Select');

    return (
      <button
        ref={ref}
        type='button'
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
          className,
        )}
        onClick={() => context.setOpen(!context.open)}
        {...props}
      >
        {children}
        <ChevronDown className='h-4 w-4 opacity-50' />
      </button>
    );
  },
);

SelectTrigger.displayName = 'SelectTrigger';

const SelectContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(SelectContext);

    if (!context) throw new Error('SelectContent must be used within Select');

    const contentRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
          context.setOpen(false);
        }
      };

      if (context.open) {
        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [context]);

    if (!context.open) return null;

    return (
      <div
        ref={(node) => {
          contentRef.current = node;

          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(
          'absolute z-50 mt-1 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95',
          className,
        )}
        {...props}
      >
        <div className='p-1'>{children}</div>
      </div>
    );
  },
);

SelectContent.displayName = 'SelectContent';

const SelectLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('py-1.5 pl-8 pr-2 text-sm font-semibold', className)} {...props} />
  ),
);

SelectLabel.displayName = 'SelectLabel';

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, value, ...props }, ref) => {
    const context = React.useContext(SelectContext);

    if (!context) throw new Error('SelectItem must be used within Select');

    const isSelected = context.value === value;

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
          isSelected && 'bg-accent',
          className,
        )}
        onClick={() => context.onValueChange?.(value)}
        {...props}
      >
        <span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
          {isSelected && <Check className='h-4 w-4' />}
        </span>
        {children}
      </div>
    );
  },
);

SelectItem.displayName = 'SelectItem';

const SelectSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('-mx-1 my-1 h-px bg-muted', className)} {...props} />,
);

SelectSeparator.displayName = 'SelectSeparator';

export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator };
