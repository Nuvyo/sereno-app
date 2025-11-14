import * as React from 'react';
import { cn } from '@/lib/utils';

interface CollapsibleContextType {
  open: boolean;
  toggle: () => void;
}

const CollapsibleContext = React.createContext<CollapsibleContextType | undefined>(undefined);

interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  ({ open: controlledOpen, defaultOpen = false, onOpenChange, children, ...props }, ref) => {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const toggle = React.useCallback(() => {
      const newOpen = !open;

      if (controlledOpen === undefined) {
        setInternalOpen(newOpen);
      }

      onOpenChange?.(newOpen);
    }, [open, controlledOpen, onOpenChange]);

    return (
      <CollapsibleContext.Provider value={{ open, toggle }}>
        <div ref={ref} {...props}>
          {children}
        </div>
      </CollapsibleContext.Provider>
    );
  },
);

Collapsible.displayName = 'Collapsible';

const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ children, ...props }, ref) => {
    const context = React.useContext(CollapsibleContext);

    if (!context) throw new Error('CollapsibleTrigger must be used within Collapsible');

    return (
      <button ref={ref} type='button' onClick={context.toggle} {...props}>
        {children}
      </button>
    );
  },
);

CollapsibleTrigger.displayName = 'CollapsibleTrigger';

const CollapsibleContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(CollapsibleContext);

    if (!context) throw new Error('CollapsibleContent must be used within Collapsible');

    return context.open ? (
      <div ref={ref} className={cn('transition-all', className)} {...props}>
        {children}
      </div>
    ) : null;
  },
);

CollapsibleContent.displayName = 'CollapsibleContent';

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
