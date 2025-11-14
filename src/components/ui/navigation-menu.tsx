import * as React from 'react';
import { cva } from 'class-variance-authority';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type NavigationMenuContextValue = {
  openItemId: string | null;
  setOpenItemId: (id: string | null) => void;
};

const NavigationMenuContext = React.createContext<NavigationMenuContextValue | undefined>(undefined);
const useNavigationMenu = () => {
  const ctx = React.useContext(NavigationMenuContext);

  if (!ctx) throw new Error('NavigationMenu components must be used within <NavigationMenu>');

  return ctx;
};
const ItemIdContext = React.createContext<string | undefined>(undefined);
const useItemId = () => {
  const id = React.useContext(ItemIdContext);

  if (!id) throw new Error('NavigationMenuTrigger/Content must be inside a NavigationMenuItem');

  return id;
};
const NavigationMenu = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, children, ...props }, ref) => {
    const [openItemId, setOpenItemId] = React.useState<string | null>(null);

    React.useEffect(() => {
      const node =
        ref && typeof ref !== 'function' ? (ref as React.MutableRefObject<HTMLElement | null>).current : null;
      const onDocClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement | null;

        if (!target) return;

        if (target.closest('[data-nav-content]')) return;

        if (node) {
          if (!node.contains(target)) setOpenItemId(null);
        } else {
          setOpenItemId(null);
        }
      };

      document.addEventListener('click', onDocClick);

      return () => document.removeEventListener('click', onDocClick);
    }, [ref]);

    const closeTimer = React.useRef<number | null>(null);
    const cancelClose = () => {
      if (closeTimer.current) {
        window.clearTimeout(closeTimer.current);
        closeTimer.current = null;
      }
    };
    const scheduleClose = () => {
      cancelClose();
      closeTimer.current = window.setTimeout(() => setOpenItemId(null), 200);
    };

    return (
      <NavigationMenuContext.Provider value={{ openItemId, setOpenItemId }}>
        <nav
          ref={ref}
          className={cn('relative z-10 flex max-w-max flex-1 items-center justify-center', className)}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          {...props}
        >
          {children}
          <NavigationMenuViewport />
        </nav>
      </NavigationMenuContext.Provider>
    );
  },
);

NavigationMenu.displayName = 'NavigationMenu';

const NavigationMenuList = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      role='menubar'
      aria-orientation='horizontal'
      className={cn('group flex flex-1 list-none items-center justify-center space-x-1', className)}
      {...props}
    />
  ),
);

NavigationMenuList.displayName = 'NavigationMenuList';

const NavigationMenuItem = ({ children, ...props }: React.LiHTMLAttributes<HTMLLIElement>) => {
  const id = React.useId();

  return (
    <li {...props} className={props.className} data-nav-item-id={id}>
      <ItemIdContext.Provider value={id}>{children}</ItemIdContext.Provider>
    </li>
  );
};
const navigationMenuTriggerStyle = cva(
  'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50',
);
const NavigationMenuTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, onClick, onMouseEnter, onFocus, onKeyDown, ...props }, ref) => {
    const { openItemId, setOpenItemId } = useNavigationMenu();
    const id = useItemId();
    const isOpen = openItemId === id;
    const handleOpen = () => setOpenItemId(id);
    const handleToggle = () => setOpenItemId(isOpen ? null : id);
    const handleArrow = (direction: 'next' | 'prev', current: HTMLButtonElement) => {
      const li = current.closest('li');

      if (!li || !li.parentElement) return;

      let sib = direction === 'next' ? li.nextElementSibling : li.previousElementSibling;

      while (sib) {
        const btn = sib.querySelector<HTMLButtonElement>('button[data-nav-item-id]');

        if (btn) {
          const targetId = btn.getAttribute('data-nav-item-id');

          if (targetId) setOpenItemId(targetId);

          btn.focus();
          break;
        }

        sib = direction === 'next' ? sib.nextElementSibling : sib.previousElementSibling;
      }
    };

    return (
      <button
        ref={ref}
        className={cn(navigationMenuTriggerStyle(), 'group', className)}
        role='menuitem'
        aria-haspopup='menu'
        aria-expanded={isOpen}
        aria-controls={`nav-content-${id}`}
        id={`nav-trigger-${id}`}
        data-nav-item-id={id}
        onMouseEnter={(e) => {
          onMouseEnter?.(e);
          handleOpen();
        }}
        onFocus={(e) => {
          onFocus?.(e);
          handleOpen();
        }}
        onClick={(e) => {
          onClick?.(e);
          handleToggle();
        }}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          const target = e.currentTarget as HTMLButtonElement;

          if (e.key === 'ArrowRight') {
            e.preventDefault();
            handleArrow('next', target);
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            handleArrow('prev', target);
          } else if (e.key === 'Escape') {
            e.preventDefault();
            setOpenItemId(null);
            target.focus();
          } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            handleOpen();
          }
        }}
        {...props}
      >
        {children}{' '}
        <ChevronDown
          className={cn('relative top-[1px] ml-1 h-3 w-3 transition duration-200', isOpen && 'rotate-180')}
          aria-hidden='true'
        />
      </button>
    );
  },
);

NavigationMenuTrigger.displayName = 'NavigationMenuTrigger';

type EdgePadding = number | Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>;

interface NavigationMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  collisionPadding?: EdgePadding;
  offsetY?: number;
  align?: 'center' | 'start' | 'end';
}

const NavigationMenuContent = React.forwardRef<HTMLDivElement, NavigationMenuContentProps>(
  ({ className, collisionPadding = 8, offsetY = 6, align = 'center', ...props }, ref) => {
    const { openItemId } = useNavigationMenu();
    const id = useItemId();
    const isOpen = openItemId === id;
    const localRef = React.useRef<HTMLDivElement | null>(null);
    const setRefs = (node: HTMLDivElement | null) => {
      localRef.current = node;

      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    };
    const [coords, setCoords] = React.useState<{ x: number; y: number }>({ x: -10000, y: -10000 });
    const clampToViewport = React.useCallback(() => {
      const pad = (side: 'top' | 'right' | 'bottom' | 'left') =>
        typeof collisionPadding === 'number' ? collisionPadding : (collisionPadding?.[side] ?? 8);
      const el = localRef.current;

      if (!el) return;

      const trigger = document.getElementById(`nav-trigger-${id}`);

      if (!trigger) return;

      const rect = el.getBoundingClientRect();
      const triggerRect = trigger.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let desiredX: number;

      if (align === 'start') desiredX = triggerRect.left;
      else if (align === 'end') desiredX = triggerRect.right - rect.width;
      else desiredX = triggerRect.left + (triggerRect.width - rect.width) / 2;

      const desiredY = triggerRect.bottom + offsetY;
      const x = Math.max(pad('left'), Math.min(desiredX, vw - rect.width - pad('right')));
      const y = Math.max(pad('top'), Math.min(desiredY, vh - rect.height - pad('bottom')));

      setCoords({ x, y });
    }, [align, id, offsetY, collisionPadding]);

    React.useLayoutEffect(() => {
      if (!isOpen) return;

      clampToViewport();
      const idRaf = requestAnimationFrame(() => clampToViewport());
      const onResize = () => clampToViewport();
      const onScroll = () => clampToViewport();

      window.addEventListener('resize', onResize);
      window.addEventListener('scroll', onScroll, true);

      return () => {
        cancelAnimationFrame(idRaf);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('scroll', onScroll, true);
      };
    }, [isOpen, clampToViewport]);

    if (!isOpen) return null;

    const visibility: React.CSSProperties['visibility'] = coords.x < 0 || coords.y < 0 ? 'hidden' : 'visible';
    const node = (
      <div
        ref={setRefs}
        data-nav-content
        className={cn(
          'fixed z-[70] w-max overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg animate-in fade-in',
          className,
        )}
        style={{ left: coords.x, top: coords.y, visibility }}
        role='menu'
        id={`nav-content-${id}`}
        aria-labelledby={`nav-trigger-${id}`}
        {...props}
      />
    );

    return createPortal(node, document.body);
  },
);

NavigationMenuContent.displayName = 'NavigationMenuContent';

type NavigationMenuLinkVariant = 'inline' | 'content';

const navigationMenuLinkVariants = cva('', {
  variants: {
    variant: {
      inline: navigationMenuTriggerStyle(),
      content:
        'block h-auto w-full rounded-md p-3 text-sm leading-6 no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
    },
  },
  defaultVariants: { variant: 'inline' as NavigationMenuLinkVariant },
});

interface NavigationMenuLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: NavigationMenuLinkVariant;
}

const NavigationMenuLink = React.forwardRef<HTMLAnchorElement, NavigationMenuLinkProps>(
  ({ className, variant = 'inline', ...props }, ref) => (
    <a ref={ref} className={cn(navigationMenuLinkVariants({ variant }), className)} {...props} />
  ),
);

NavigationMenuLink.displayName = 'NavigationMenuLink';

const NavigationMenuViewport = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div className={cn('absolute left-0 top-full flex justify-center')}>
      <div
        className={cn(
          'relative mt-1.5 h-auto w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg animate-in fade-in zoom-in-90 md:w-auto',
          className,
        )}
        ref={ref}
        {...props}
      />
    </div>
  ),
);

NavigationMenuViewport.displayName = 'NavigationMenuViewport';

const NavigationMenuIndicator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden animate-in fade-in', className)}
      {...props}
    >
      <div className='relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md' />
    </div>
  ),
);

NavigationMenuIndicator.displayName = 'NavigationMenuIndicator';

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};
