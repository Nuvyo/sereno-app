import * as React from 'react';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement>;
  menuId: string;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | undefined>(undefined);

const useDropdownMenu = () => {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error('DropdownMenu components must be used within DropdownMenu');
  }
  return context;
};

interface DropdownMenuProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DropdownMenu = ({ children, open: controlledOpen, onOpenChange }: DropdownMenuProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLElement>(null);
  const menuId = React.useId();

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
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
    <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef, menuId }}>
      {children}
    </DropdownMenuContext.Provider>
  );
};

interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  ({ asChild, onClick, children, ...props }, ref) => {
    const { open, setOpen, triggerRef, menuId } = useDropdownMenu();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      setOpen(!open);
      onClick?.(e);
    };

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<unknown>;
      return React.cloneElement(child, {
        onClick: handleClick,
        ref: (node: HTMLElement) => {
          (triggerRef as React.MutableRefObject<HTMLElement | null>).current = node;
        },
        id: `dropdown-trigger-${menuId}`,
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        'aria-controls': `dropdown-content-${menuId}`,
      } as React.Attributes & Record<string, unknown>);
    }

    return (
      <button
        ref={(node) => {
          (triggerRef as React.MutableRefObject<HTMLElement | null>).current =
            node as HTMLElement | null;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        }}
        id={`dropdown-trigger-${menuId}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={`dropdown-content-${menuId}`}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  },
);
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

const DropdownMenuGroup = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

const DropdownMenuPortal = ({ children }: { children: React.ReactNode }) => {
  const { open } = useDropdownMenu();
  if (!open) return null;
  return <>{children}</>;
};

const DropdownMenuSub = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

const DropdownMenuRadioGroup = ({
  children,
  value,
  onValueChange,
}: {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
}) => <div>{children}</div>;

const DropdownMenuSubTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }
>(({ className, inset, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent',
      inset && 'pl-8',
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </div>
));
DropdownMenuSubTrigger.displayName = 'DropdownMenuSubTrigger';

const DropdownMenuSubContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg',
      className,
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName = 'DropdownMenuSubContent';

type EdgePadding = number | Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>;

interface DropdownContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'bottom' | 'top';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  collisionPadding?: EdgePadding;
}

const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownContentProps>(
  (
    { className, side = 'bottom', align = 'start', sideOffset = 8, collisionPadding = 8, ...props },
    ref,
  ) => {
    const { open, setOpen, triggerRef, menuId } = useDropdownMenu();
    const localRef = React.useRef<HTMLDivElement | null>(null);

    // Fechar ao clicar fora (considerando trigger e conteúdo)
    React.useEffect(() => {
      if (!open) return;
      const onClick = (e: MouseEvent) => {
        const t = e.target as Node | null;
        const insideContent = !!(localRef.current && t && localRef.current.contains(t));
        const insideTrigger = !!(triggerRef.current && t && triggerRef.current.contains(t));
        if (!insideContent && !insideTrigger) setOpen(false);
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setOpen(false);
      };
      document.addEventListener('click', onClick);
      document.addEventListener('keydown', onKey);
      return () => {
        document.removeEventListener('click', onClick);
        document.removeEventListener('keydown', onKey);
      };
    }, [open, setOpen, triggerRef]);

    const setRefs = (node: HTMLDivElement | null) => {
      localRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    };

    const [coords, setCoords] = React.useState<{ x: number; y: number }>({ x: -10000, y: -10000 });

    const clampToViewport = React.useCallback(() => {
      const pad = (sideName: 'top' | 'right' | 'bottom' | 'left') =>
        typeof collisionPadding === 'number'
          ? collisionPadding
          : (collisionPadding?.[sideName] ?? 8);
      const el = localRef.current;
      const trg = triggerRef.current;
      if (!el || !trg) return;
      const rect = el.getBoundingClientRect();
      const tr = trg.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Horizontal alignment
      let desiredX: number;
      if (align === 'start') desiredX = tr.left;
      else if (align === 'end') desiredX = tr.right - rect.width;
      else desiredX = tr.left + (tr.width - rect.width) / 2; // center

      // Vertical side with flip
      const belowY = tr.bottom + sideOffset; // não sobrepor botão
      const aboveY = tr.top - sideOffset - rect.height;
      const fitsBelow = belowY + rect.height + pad('bottom') <= vh;
      const desiredY = (side === 'bottom' ? fitsBelow : false)
        ? belowY
        : Math.max(pad('top'), aboveY);

      const x = Math.max(pad('left'), Math.min(desiredX, vw - rect.width - pad('right')));
      const y = Math.max(pad('top'), Math.min(desiredY, vh - rect.height - pad('bottom')));
      setCoords({ x, y });
    }, [align, collisionPadding, side, sideOffset, triggerRef]);

    React.useLayoutEffect(() => {
      if (!open) return;
      clampToViewport();
      const raf = requestAnimationFrame(() => clampToViewport());
      const onResize = () => clampToViewport();
      const onScroll = () => clampToViewport();
      window.addEventListener('resize', onResize);
      window.addEventListener('scroll', onScroll, true);
      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('scroll', onScroll, true);
      };
    }, [open, clampToViewport]);

    if (!open) return null;

    const visibility: React.CSSProperties['visibility'] =
      coords.x < 0 || coords.y < 0 ? 'hidden' : 'visible';

    return (
      <DropdownMenuPortal>
        <div
          ref={setRefs}
          className={cn(
            'fixed z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95',
            className,
          )}
          id={`dropdown-content-${menuId}`}
          role="menu"
          aria-labelledby={`dropdown-trigger-${menuId}`}
          style={{ left: coords.x, top: coords.y, visibility }}
          {...props}
        />
      </DropdownMenuPortal>
    );
  },
);
DropdownMenuContent.displayName = 'DropdownMenuContent';

const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { inset?: boolean; disabled?: boolean }
>(({ className, inset, disabled, onClick, ...props }, ref) => {
  const { setOpen } = useDropdownMenu();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled) {
      onClick?.(e);
      setOpen(false);
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground',
        disabled && 'pointer-events-none opacity-50',
        inset && 'pl-8',
        className,
      )}
      onClick={handleClick}
      {...props}
    />
  );
});
DropdownMenuItem.displayName = 'DropdownMenuItem';

const DropdownMenuCheckboxItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { checked?: boolean }
>(({ className, children, checked, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground',
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      {checked && <Check className="h-4 w-4" />}
    </span>
    {children}
  </div>
));
DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem';

const DropdownMenuRadioItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground',
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <Circle className="h-2 w-2 fill-current" />
    </span>
    {children}
  </div>
));
DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem';

const DropdownMenuLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = 'DropdownMenuLabel';

const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('-mx-1 my-1 h-px bg-muted', className)} {...props} />
));
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span className={cn('ml-auto text-xs tracking-widest opacity-60', className)} {...props} />
  );
};
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
