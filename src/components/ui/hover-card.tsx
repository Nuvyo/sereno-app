import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface HoverCardContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  openDelay: number;
  closeDelay: number;
  triggerRef: React.MutableRefObject<HTMLElement | null>;
  hoverTimeoutIdRef: React.MutableRefObject<NodeJS.Timeout | null>;
}

const HoverCardContext = React.createContext<HoverCardContextValue | undefined>(undefined);
const useHoverCard = () => {
  const context = React.useContext(HoverCardContext);

  if (!context) {
    throw new Error('HoverCard components must be used within HoverCard');
  }

  return context;
};

interface HoverCardProps {
  children: React.ReactNode;
  openDelay?: number;
  closeDelay?: number;
}

const HoverCard = ({ children, openDelay = 200, closeDelay = 300 }: HoverCardProps) => {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const hoverTimeoutIdRef = React.useRef<NodeJS.Timeout | null>(null);

  return (
    <HoverCardContext.Provider value={{ open, setOpen, openDelay, closeDelay, triggerRef, hoverTimeoutIdRef }}>
      {children}
    </HoverCardContext.Provider>
  );
};

interface HoverCardTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const HoverCardTrigger = React.forwardRef<HTMLDivElement, HoverCardTriggerProps>(
  ({ asChild, children, ...props }, ref) => {
    const { setOpen, openDelay, closeDelay, triggerRef, hoverTimeoutIdRef } = useHoverCard();
    const handleMouseEnter = () => {
      if (hoverTimeoutIdRef.current) {
        clearTimeout(hoverTimeoutIdRef.current);
        hoverTimeoutIdRef.current = null;
      }

      hoverTimeoutIdRef.current = setTimeout(() => setOpen(true), openDelay);
    };
    const handleMouseLeave = () => {
      if (hoverTimeoutIdRef.current) {
        clearTimeout(hoverTimeoutIdRef.current);
      }

      hoverTimeoutIdRef.current = setTimeout(() => setOpen(false), closeDelay);
    };
    const setTriggerFromEvent = (e: React.MouseEvent<HTMLElement>) => {
      triggerRef.current = e.currentTarget as HTMLElement;
    };

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<unknown>;

      return React.cloneElement(child, {
        onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
          setTriggerFromEvent(e);
          handleMouseEnter();
        },
        onMouseLeave: handleMouseLeave,
        ref: ref as React.Ref<unknown>,
      } as React.Attributes & Record<string, unknown>);
    }

    return (
      <div
        ref={ref}
        onMouseEnter={(e) => {
          setTriggerFromEvent(e);
          handleMouseEnter();
        }}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </div>
    );
  },
);

HoverCardTrigger.displayName = 'HoverCardTrigger';

interface HoverCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom';
  sideOffset?: number;
  collisionPadding?: number;
  sticky?: 'partial' | 'always' | 'none';
}

const HoverCardContent = React.forwardRef<HTMLDivElement, HoverCardContentProps>(
  (
    {
      className,
      align = 'center',
      side = 'bottom',
      sideOffset = 16,
      collisionPadding = 8,
      sticky = 'partial',
      style,
      ...props
    },
    ref,
  ) => {
    const { open, triggerRef, closeDelay, hoverTimeoutIdRef, setOpen } = useHoverCard();
    const contentRef = React.useRef<HTMLDivElement | null>(null);
    const [coords, setCoords] = React.useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const updatePosition = React.useCallback(() => {
      const triggerEl = triggerRef.current;
      const contentEl = contentRef.current;

      if (!triggerEl || !contentEl) return;

      const viewportW = window.innerWidth;
      const viewportH = window.innerHeight;
      const t = triggerEl.getBoundingClientRect();
      const c = contentEl.getBoundingClientRect();
      let chosenSide = side;

      if (side === 'bottom' && t.bottom + sideOffset + c.height + collisionPadding > viewportH) {
        chosenSide = 'top';
      } else if (side === 'top' && t.top - sideOffset - c.height - collisionPadding < 0) {
        chosenSide = 'bottom';
      }

      let top = chosenSide === 'bottom' ? t.bottom + sideOffset : t.top - c.height - sideOffset;
      let left = t.left;

      if (align === 'center') left = t.left + (t.width - c.width) / 2;

      if (align === 'end') left = t.right - c.width;

      const minLeft = collisionPadding;
      const maxLeft = viewportW - collisionPadding - c.width;
      const minTop = collisionPadding;
      const maxTop = viewportH - collisionPadding - c.height;

      left = Math.min(Math.max(left, minLeft), Math.max(minLeft, maxLeft));
      top = Math.min(Math.max(top, minTop), Math.max(minTop, maxTop));

      setCoords({ top, left });
    }, [align, collisionPadding, side, sideOffset, triggerRef]);

    React.useLayoutEffect(() => {
      if (!open) return;

      updatePosition();
      const handler = () => updatePosition();

      window.addEventListener('resize', handler);
      window.addEventListener('scroll', handler, true);
      const id = window.setInterval(
        () => {
          if (sticky !== 'none') updatePosition();
        },
        sticky === 'always' ? 100 : 250,
      );

      return () => {
        window.removeEventListener('resize', handler);
        window.removeEventListener('scroll', handler, true);
        window.clearInterval(id);
      };
    }, [open, sticky, updatePosition]);

    if (!open) return null;

    const node = (
      <div
        ref={(node) => {
          contentRef.current = node;

          if (typeof ref === 'function') ref(node);
          else if (ref && typeof ref === 'object')
            (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={cn(
          'fixed z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95 overflow-auto',
          className,
        )}
        style={{
          top: coords.top,
          left: coords.left,
          maxHeight: `calc(100vh - ${collisionPadding * 2}px)`,
          ...style,
        }}
        onMouseEnter={() => {
          if (hoverTimeoutIdRef.current) {
            clearTimeout(hoverTimeoutIdRef.current);
            hoverTimeoutIdRef.current = null;
          }

          setOpen(true);
        }}
        onMouseLeave={() => {
          if (hoverTimeoutIdRef.current) {
            clearTimeout(hoverTimeoutIdRef.current);
          }

          hoverTimeoutIdRef.current = setTimeout(() => setOpen(false), closeDelay);
        }}
        {...props}
      />
    );

    return createPortal(node, document.body);
  },
);

HoverCardContent.displayName = 'HoverCardContent';

export { HoverCard, HoverCardTrigger, HoverCardContent };
