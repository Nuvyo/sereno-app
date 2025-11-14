import * as React from 'react';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContextMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  position: { x: number; y: number };
  setPosition: (pos: { x: number; y: number }) => void;
}

const ContextMenuContext = React.createContext<ContextMenuContextValue | undefined>(undefined);
const useContextMenu = () => {
  const context = React.useContext(ContextMenuContext);

  if (!context) {
    throw new Error('ContextMenu components must be used within ContextMenu');
  }

  return context;
};

interface ContextMenuProps {
  children: React.ReactNode;
}

const ContextMenu = ({ children }: ContextMenuProps) => {
  const [open, setOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  return (
    <ContextMenuContext.Provider value={{ open, setOpen, position, setPosition }}>
      {children}
    </ContextMenuContext.Provider>
  );
};

interface ContextMenuTriggerProps {
  children: React.ReactNode;
}

const ContextMenuTrigger = ({ children }: ContextMenuTriggerProps) => {
  const { setOpen, setPosition } = useContextMenu();
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setOpen(true);
  };

  return <div onContextMenu={handleContextMenu}>{children}</div>;
};
const ContextMenuGroup = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
const ContextMenuPortal = ({ children }: { children: React.ReactNode }) => {
  const { open } = useContextMenu();

  if (!open) return null;

  return <>{children}</>;
};
const ContextMenuSub = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
const ContextMenuRadioGroup = ({
  children,
  value: _value,
  onValueChange: _onValueChange,
}: {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
}) => <div>{children}</div>;
const ContextMenuSubTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }
>(({ className, inset, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground',
      inset && 'pl-8',
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className='ml-auto h-4 w-4' />
  </div>
));

ContextMenuSubTrigger.displayName = 'ContextMenuSubTrigger';

const ContextMenuSubContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
        className,
      )}
      {...props}
    />
  ),
);

ContextMenuSubContent.displayName = 'ContextMenuSubContent';

type EdgePadding = number | Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>;

interface ContextMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  collisionPadding?: EdgePadding;
  pointerOffset?: number;
}

const ContextMenuContent = React.forwardRef<HTMLDivElement, ContextMenuContentProps>(
  ({ className, style, collisionPadding = 8, pointerOffset = 4, ...props }, ref) => {
    const { open, setOpen, position } = useContextMenu();
    const localRef = React.useRef<HTMLDivElement | null>(null);
    const setRefs = (node: HTMLDivElement | null) => {
      localRef.current = node;

      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    };
    const [coords, setCoords] = React.useState<{ x: number; y: number }>({ x: -10000, y: -10000 });
    const clampToViewport = React.useCallback(() => {
      const el = localRef.current;

      if (!el) return;

      const pad = (side: 'top' | 'right' | 'bottom' | 'left') =>
        typeof collisionPadding === 'number' ? collisionPadding : (collisionPadding?.[side] ?? 8);
      const desiredX = position.x + pointerOffset;
      const desiredY = position.y + pointerOffset;
      const rect = el.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const x = Math.max(pad('left'), Math.min(desiredX, vw - width - pad('right')));
      const y = Math.max(pad('top'), Math.min(desiredY, vh - height - pad('bottom')));

      setCoords({ x, y });
    }, [position, collisionPadding, pointerOffset]);

    React.useEffect(() => {
      if (open) {
        const handleClick = () => setOpen(false);
        const handleEscape = (e: KeyboardEvent) => {
          if (e.key === 'Escape') setOpen(false);
        };
        const handleScroll = () => setOpen(false);
        const handleResize = () => setOpen(false);

        document.addEventListener('click', handleClick);
        document.addEventListener('keydown', handleEscape);
        window.addEventListener('scroll', handleScroll, true);
        window.addEventListener('resize', handleResize);

        return () => {
          document.removeEventListener('click', handleClick);
          document.removeEventListener('keydown', handleEscape);
          window.removeEventListener('scroll', handleScroll, true);
          window.removeEventListener('resize', handleResize);
        };
      }
    }, [open, setOpen]);

    React.useLayoutEffect(() => {
      if (!open) return;

      clampToViewport();

      const id = requestAnimationFrame(() => clampToViewport());

      return () => cancelAnimationFrame(id);
    }, [open, position, clampToViewport]);

    if (!open) return null;

    const computedVisibility: React.CSSProperties['visibility'] =
      coords.x < 0 || coords.y < 0
        ? 'hidden'
        : ((style?.visibility as React.CSSProperties['visibility'] | undefined) ?? 'visible');

    return (
      <ContextMenuPortal>
        <div
          ref={setRefs}
          className={cn(
            'fixed z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80',
            className,
          )}
          style={{
            left: coords.x,
            top: coords.y,
            position: 'fixed',
            visibility: computedVisibility,
            ...(style ?? {}),
          }}
          {...props}
        />
      </ContextMenuPortal>
    );
  },
);

ContextMenuContent.displayName = 'ContextMenuContent';

const ContextMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { inset?: boolean; disabled?: boolean }
>(({ className, inset, disabled, onClick, ...props }, ref) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled) {
      onClick?.(e);
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground',
        disabled && 'pointer-events-none opacity-50',
        inset && 'pl-8',
        className,
      )}
      onClick={handleClick}
      {...props}
    />
  );
});

ContextMenuItem.displayName = 'ContextMenuItem';

const ContextMenuCheckboxItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { checked?: boolean }
>(({ className, children, checked, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground',
      className,
    )}
    {...props}
  >
    <span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
      {checked && <Check className='h-4 w-4' />}
    </span>
    {children}
  </div>
));

ContextMenuCheckboxItem.displayName = 'ContextMenuCheckboxItem';

const ContextMenuRadioItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground',
        className,
      )}
      {...props}
    >
      <span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
        <Circle className='h-2 w-2 fill-current' />
      </span>
      {children}
    </div>
  ),
);

ContextMenuRadioItem.displayName = 'ContextMenuRadioItem';

const ContextMenuLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }>(
  ({ className, inset, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-2 py-1.5 text-sm font-semibold text-foreground', inset && 'pl-8', className)}
      {...props}
    />
  ),
);

ContextMenuLabel.displayName = 'ContextMenuLabel';

const ContextMenuSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />,
);

ContextMenuSeparator.displayName = 'ContextMenuSeparator';

const ContextMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)} {...props} />;
};

ContextMenuShortcut.displayName = 'ContextMenuShortcut';

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
