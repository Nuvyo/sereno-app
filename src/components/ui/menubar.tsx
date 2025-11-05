import * as React from 'react';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Contexto do Menubar para controlar qual menu está aberto
interface MenubarContextValue {
  openValue: string | null;
  setOpenValue: (value: string | null) => void;
  rootRef: React.RefObject<HTMLDivElement>;
}

const MenubarContext = React.createContext<MenubarContextValue | undefined>(undefined);

const useMenubar = () => {
  const ctx = React.useContext(MenubarContext);
  if (!ctx) throw new Error('Menubar components must be used within Menubar');
  return ctx;
};

// Contexto por menu para compartilhar o id entre Trigger e Content
const MenuContext = React.createContext<{ id: string } | undefined>(undefined);
const useMenu = () => {
  const ctx = React.useContext(MenuContext);
  if (!ctx) throw new Error('MenubarMenu children must be used within MenubarMenu');
  return ctx;
};

const MenubarMenu = ({ children, value }: { children: React.ReactNode; value?: string }) => {
  const autoId = React.useId();
  const id = value ?? autoId;
  return (
    <MenuContext.Provider value={{ id }}>
      <div className="relative">{children}</div>
    </MenuContext.Provider>
  );
};

const MenubarGroup = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

const MenubarPortal = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const MenubarSub = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

const MenubarRadioGroup = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

const Menubar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, role = 'menubar', ...props }, ref) => {
    const rootRef = React.useRef<HTMLDivElement>(null);
    const [openValue, setOpenValue] = React.useState<string | null>(null);

    // Fechar ao clicar fora ou pressionar ESC
    React.useEffect(() => {
      const onClick = (e: MouseEvent) => {
        if (!rootRef.current) return;
        if (openValue && !rootRef.current.contains(e.target as Node)) {
          setOpenValue(null);
        }
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setOpenValue(null);
      };
      document.addEventListener('click', onClick);
      document.addEventListener('keydown', onKey);
      return () => {
        document.removeEventListener('click', onClick);
        document.removeEventListener('keydown', onKey);
      };
    }, [openValue]);

    return (
      <MenubarContext.Provider value={{ openValue, setOpenValue, rootRef }}>
        <div
          ref={(node) => {
            (rootRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          className={cn(
            'flex h-10 items-center space-x-1 rounded-md border bg-background p-1',
            className,
          )}
          role={role}
          {...props}
        />
      </MenubarContext.Provider>
    );
  },
);
Menubar.displayName = 'Menubar';

const MenubarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, onMouseEnter, 'aria-haspopup': ariaHasPopup = 'menu', ...props }, ref) => {
  const { openValue, setOpenValue } = useMenubar();
  const { id } = useMenu();

  const toggle = () => setOpenValue(openValue === id ? null : id);

  return (
    <button
      ref={ref}
      className={cn(
        // Estado visual controlado por aria/data-state para evitar que o foco mantenha o botão "selecionado"
        'flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none hover:bg-accent hover:text-accent-foreground',
        // Quando aberto, aplicar o mesmo estilo de hover
        'data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
        className,
      )}
      type="button"
      aria-haspopup={ariaHasPopup}
      aria-expanded={openValue === id}
      aria-controls={`menubar-content-${id}`}
      id={`menubar-trigger-${id}`}
      data-state={openValue === id ? 'open' : 'closed'}
      onClick={(e) => {
        toggle();
        onClick?.(e);
      }}
      onMouseEnter={(e) => {
        if (openValue) setOpenValue(id);
        onMouseEnter?.(e);
      }}
      {...props}
    />
  );
});
MenubarTrigger.displayName = 'MenubarTrigger';

const MenubarSubTrigger = React.forwardRef<
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
    role="menuitem"
    aria-haspopup="menu"
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </div>
));
MenubarSubTrigger.displayName = 'MenubarSubTrigger';

const MenubarSubContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, role = 'menu', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground',
        className,
      )}
      role={role}
      {...props}
    />
  ),
);
MenubarSubContent.displayName = 'MenubarSubContent';

type EdgePadding = number | Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>;

interface MenubarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  collisionPadding?: EdgePadding;
}

const MenubarContent = React.forwardRef<HTMLDivElement, MenubarContentProps>(
  (
    { className, align = 'start', sideOffset = 8, collisionPadding = 8, role = 'menu', ...props },
    ref,
  ) => {
    const { openValue } = useMenubar();
    const { id } = useMenu();
    const isOpen = openValue === id;

    const localRef = React.useRef<HTMLDivElement | null>(null);
    const setRefs = (node: HTMLDivElement | null) => {
      localRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    };

    const [coords, setCoords] = React.useState<{ x: number; y: number }>({ x: -10000, y: -10000 });

    const clamp = React.useCallback(() => {
      const pad = (side: 'top' | 'right' | 'bottom' | 'left') =>
        typeof collisionPadding === 'number' ? collisionPadding : (collisionPadding?.[side] ?? 8);
      const el = localRef.current;
      if (!el) return;
      const trigger = document.getElementById(`menubar-trigger-${id}`);
      if (!trigger) return;
      const rect = el.getBoundingClientRect();
      const tr = trigger.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let desiredX: number;
      if (align === 'start') desiredX = tr.left;
      else if (align === 'end') desiredX = tr.right - rect.width;
      else desiredX = tr.left + (tr.width - rect.width) / 2;

      // Preferir abrir abaixo; se não couber, abrir acima
      const openBelowY = tr.bottom + sideOffset;
      const openAboveY = tr.top - sideOffset - rect.height;
      const fitsBelow = openBelowY + rect.height + pad('bottom') <= vh;
      const desiredY = fitsBelow ? openBelowY : Math.max(pad('top'), openAboveY);

      const x = Math.max(pad('left'), Math.min(desiredX, vw - rect.width - pad('right')));
      const y = Math.max(pad('top'), Math.min(desiredY, vh - rect.height - pad('bottom')));
      setCoords({ x, y });
    }, [align, collisionPadding, id, sideOffset]);

    React.useLayoutEffect(() => {
      if (!isOpen) return;
      clamp();
      const raf = requestAnimationFrame(() => clamp());
      const onResize = () => clamp();
      const onScroll = () => clamp();
      window.addEventListener('resize', onResize);
      window.addEventListener('scroll', onScroll, true);
      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('scroll', onScroll, true);
      };
    }, [isOpen, clamp]);

    if (!isOpen) return null;

    const visibility: React.CSSProperties['visibility'] =
      coords.x < 0 || coords.y < 0 ? 'hidden' : 'visible';

    return (
      <MenubarPortal>
        <div
          ref={setRefs}
          className={cn(
            'fixed z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95',
            className,
          )}
          style={{ left: coords.x, top: coords.y, visibility }}
          role={role}
          id={`menubar-content-${id}`}
          aria-labelledby={`menubar-trigger-${id}`}
          {...props}
        />
      </MenubarPortal>
    );
  },
);
MenubarContent.displayName = 'MenubarContent';

const MenubarItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { inset?: boolean; disabled?: boolean }
>(({ className, inset, disabled, role = 'menuitem', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground',
      disabled && 'pointer-events-none opacity-50',
      inset && 'pl-8',
      className,
    )}
    role={role}
    {...props}
  />
));
MenubarItem.displayName = 'MenubarItem';

const MenubarCheckboxItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { checked?: boolean }
>(({ className, children, checked, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground',
      className,
    )}
    role="menuitemcheckbox"
    aria-checked={!!checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      {checked && <Check className="h-4 w-4" />}
    </span>
    {children}
  </div>
));
MenubarCheckboxItem.displayName = 'MenubarCheckboxItem';

const MenubarRadioItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground',
        className,
      )}
      role="menuitemradio"
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <Circle className="h-2 w-2 fill-current" />
      </span>
      {children}
    </div>
  ),
);
MenubarRadioItem.displayName = 'MenubarRadioItem';

const MenubarLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)}
    {...props}
  />
));
MenubarLabel.displayName = 'MenubarLabel';

const MenubarSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('-mx-1 my-1 h-px bg-muted', className)} {...props} />
  ),
);
MenubarSeparator.displayName = 'MenubarSeparator';

const MenubarShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)}
      {...props}
    />
  );
};
MenubarShortcut.displayName = 'MenubarShortcut';

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
};
