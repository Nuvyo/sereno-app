import * as React from 'react';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';

interface TooltipContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.MutableRefObject<HTMLElement | null>;
}

const TooltipContext = React.createContext<TooltipContextType | undefined>(undefined);

interface TooltipProviderProps {
  children: React.ReactNode;
  delayDuration?: number;
}

const TooltipProvider: React.FC<TooltipProviderProps> = ({ children }) => {
  return <>{children}</>;
};

interface TooltipProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delayDuration?: number;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const triggerRef = React.useRef<HTMLElement | null>(null);

  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (controlledOpen === undefined) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [controlledOpen, onOpenChange],
  );

  return (
    <TooltipContext.Provider value={{ open, setOpen, triggerRef }}>
      {children}
    </TooltipContext.Provider>
  );
};

interface TooltipTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const TooltipTrigger = React.forwardRef<HTMLButtonElement, TooltipTriggerProps>(
  ({ children, asChild, ...props }, ref) => {
    const context = React.useContext(TooltipContext);
    if (!context) throw new Error('TooltipTrigger must be used within Tooltip');

    const handlers = {
      onMouseEnter: () => context.setOpen(true),
      onMouseLeave: () => context.setOpen(false),
      onFocus: () => context.setOpen(true),
      onBlur: () => context.setOpen(false),
    };

    // sincroniza ref externo e ref do contexto
    const setRefs = React.useCallback(
      (node: HTMLButtonElement | null) => {
        context.triggerRef.current = node as unknown as HTMLElement;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      },
      [ref, context],
    );

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<unknown>;
      return React.cloneElement(child, {
        ref: (node: HTMLElement | null) => {
          context.triggerRef.current = node as HTMLElement;
        },
        ...(props as object),
        ...(handlers as object),
      } as React.Attributes & Record<string, unknown>);
    }

    return (
      <button ref={setRefs} type="button" {...handlers} {...props}>
        {children}
      </button>
    );
  },
);
TooltipTrigger.displayName = 'TooltipTrigger';

interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  sideOffset?: number;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  collisionPadding?: number;
}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  (
    {
      className,
      sideOffset = 4,
      side = 'top',
      align = 'center',
      collisionPadding = 8,
      children,
      ...props
    },
    ref,
  ) => {
    const context = React.useContext(TooltipContext);
    if (!context) throw new Error('TooltipContent must be used within Tooltip');

    // Calcula posição com base no elemento de disparo e renderiza em portal com position: fixed
    const contentRef = React.useRef<HTMLDivElement | null>(null);
    const [coords, setCoords] = React.useState<{ top: number; left: number } | null>(null);

    const computePosition = React.useCallback(() => {
      const anchor = context.triggerRef.current;
      const tooltip = contentRef.current;
      if (!anchor || !tooltip) return null;

      const viewportW = window.innerWidth;
      const viewportH = window.innerHeight;
      const r = anchor.getBoundingClientRect();
      const c = tooltip.getBoundingClientRect();

      // escolher lado com flip se necessário
      let chosenSide = side;
      if (side === 'bottom' && r.bottom + sideOffset + c.height + collisionPadding > viewportH)
        chosenSide = 'top';
      else if (side === 'top' && r.top - sideOffset - c.height - collisionPadding < 0)
        chosenSide = 'bottom';
      else if (side === 'right' && r.right + sideOffset + c.width + collisionPadding > viewportW)
        chosenSide = 'left';
      else if (side === 'left' && r.left - sideOffset - c.width - collisionPadding < 0)
        chosenSide = 'right';

      let top = 0;
      let left = 0;
      if (chosenSide === 'top') {
        top = r.top - c.height - sideOffset;
        if (align === 'start') left = r.left;
        else if (align === 'end') left = r.right - c.width;
        else left = r.left + (r.width - c.width) / 2;
      } else if (chosenSide === 'bottom') {
        top = r.bottom + sideOffset;
        if (align === 'start') left = r.left;
        else if (align === 'end') left = r.right - c.width;
        else left = r.left + (r.width - c.width) / 2;
      } else if (chosenSide === 'left') {
        left = r.left - c.width - sideOffset;
        if (align === 'start') top = r.top;
        else if (align === 'end') top = r.bottom - c.height;
        else top = r.top + (r.height - c.height) / 2;
      } else {
        // right
        left = r.right + sideOffset;
        if (align === 'start') top = r.top;
        else if (align === 'end') top = r.bottom - c.height;
        else top = r.top + (r.height - c.height) / 2;
      }

      // clamp dentro da viewport
      const minLeft = collisionPadding;
      const maxLeft = viewportW - collisionPadding - c.width;
      const minTop = collisionPadding;
      const maxTop = viewportH - collisionPadding - c.height;
      left = Math.min(Math.max(left, minLeft), Math.max(minLeft, maxLeft));
      top = Math.min(Math.max(top, minTop), Math.max(minTop, maxTop));

      return { top, left } as const;
    }, [align, collisionPadding, side, sideOffset, context.triggerRef]);

    React.useLayoutEffect(() => {
      if (!context.open) return;
      const update = () => {
        const res = computePosition();
        if (res) setCoords(res);
      };
      update();
      window.addEventListener('scroll', update, true);
      window.addEventListener('resize', update);
      return () => {
        window.removeEventListener('scroll', update, true);
        window.removeEventListener('resize', update);
      };
    }, [context.open, computePosition]);

    if (!context.open) return null;

    const node = (
      <div
        ref={(node) => {
          contentRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref && typeof ref === 'object')
            (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        role="tooltip"
        style={{
          position: 'fixed',
          top: coords ? coords.top : -99999,
          left: coords ? coords.left : -99999,
          visibility: coords ? 'visible' : 'hidden',
        }}
        className={cn(
          'pointer-events-none z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );

    return typeof document !== 'undefined' ? createPortal(node, document.body) : node;
  },
);
TooltipContent.displayName = 'TooltipContent';

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
