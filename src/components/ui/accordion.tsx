import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionContextType {
  openItems: string[];
  toggleItem: (value: string) => void;
  type?: 'single' | 'multiple';
}

const AccordionContext = React.createContext<AccordionContextType | undefined>(undefined);

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ type = 'single', defaultValue, value, onValueChange, children, className, ...props }, ref) => {
    const [openItems, setOpenItems] = React.useState<string[]>(() => {
      if (value) return Array.isArray(value) ? value : [value];
      if (defaultValue) return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
      return [];
    });

    React.useEffect(() => {
      if (value !== undefined) {
        setOpenItems(Array.isArray(value) ? value : [value]);
      }
    }, [value]);

    const toggleItem = React.useCallback(
      (itemValue: string) => {
        setOpenItems((prev) => {
          let newValue: string[];
          if (type === 'single') {
            newValue = prev.includes(itemValue) ? [] : [itemValue];
          } else {
            newValue = prev.includes(itemValue)
              ? prev.filter((v) => v !== itemValue)
              : [...prev, itemValue];
          }
          onValueChange?.(type === 'single' ? newValue[0] || '' : newValue);
          return newValue;
        });
      },
      [type, onValueChange],
    );

    return (
      <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
        <div ref={ref} className={className} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  },
);
Accordion.displayName = 'Accordion';

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, ...props }, ref) => {
    return <div ref={ref} className={cn('border-b', className)} data-value={value} {...props} />;
  },
);
AccordionItem.displayName = 'AccordionItem';

type AccordionTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(AccordionContext);
    const parent = React.useContext(AccordionItemContext);

    if (!context || !parent) return null;

    const isOpen = context.openItems.includes(parent.value);

    return (
      <div className="flex">
        <button
          ref={ref}
          type="button"
          className={cn(
            'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline',
            className,
          )}
          onClick={() => context.toggleItem(parent.value)}
          aria-expanded={isOpen}
          {...props}
        >
          {children}
          <ChevronDown
            className={cn(
              'h-4 w-4 shrink-0 transition-transform duration-200',
              isOpen && 'rotate-180',
            )}
          />
        </button>
      </div>
    );
  },
);
AccordionTrigger.displayName = 'AccordionTrigger';

interface AccordionItemContextType {
  value: string;
}

const AccordionItemContext = React.createContext<AccordionItemContextType | undefined>(undefined);

const AccordionItemProvider: React.FC<{ value: string; children: React.ReactNode }> = ({
  value,
  children,
}) => {
  return (
    <AccordionItemContext.Provider value={{ value }}>{children}</AccordionItemContext.Provider>
  );
};

type AccordionContentProps = React.HTMLAttributes<HTMLDivElement>;

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(AccordionContext);
    const parent = React.useContext(AccordionItemContext);
    const contentRef = React.useRef<HTMLDivElement>(null);

    if (!context || !parent) return null;

    const isOpen = context.openItems.includes(parent.value);

    return (
      <div
        ref={contentRef}
        className={cn(
          'overflow-hidden text-sm transition-all',
          isOpen ? 'animate-accordion-down' : 'animate-accordion-up',
        )}
        style={{
          display: isOpen ? 'block' : 'none',
        }}
      >
        <div ref={ref} className={cn('pb-4 pt-0', className)} {...props}>
          {children}
        </div>
      </div>
    );
  },
);
AccordionContent.displayName = 'AccordionContent';

// Wrapper to provide context
const AccordionItemWrapper = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, children, ...props }, ref) => {
    return (
      <AccordionItemProvider value={value}>
        <AccordionItem ref={ref} value={value} {...props}>
          {children}
        </AccordionItem>
      </AccordionItemProvider>
    );
  },
);
AccordionItemWrapper.displayName = 'AccordionItem';

export { Accordion, AccordionItemWrapper as AccordionItem, AccordionTrigger, AccordionContent };
