import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import * as React from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/lib/utils';

// Contexto para controlar o estado do Sheet
type SheetContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
  setLastActiveElement: (el: HTMLElement | null) => void;
};

const SheetContext = React.createContext<SheetContextValue | null>(null);

// Componente raiz: controla estado controlado/não-controlado
interface SheetProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

const Sheet = ({ open: openProp, defaultOpen, onOpenChange, children }: SheetProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState<boolean>(!!defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? !!openProp : uncontrolledOpen;
  const lastActiveRef = React.useRef<HTMLElement | null>(null);

  const setOpen = React.useCallback(
    (v: boolean) => {
      if (!isControlled) setUncontrolledOpen(v);
      onOpenChange?.(v);
    },
    [isControlled, onOpenChange],
  );

  // Fechar com ESC quando aberto
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  // Bloquear scroll do body quando aberto
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Restaurar foco para o último elemento ativo ao fechar
  React.useEffect(() => {
    if (!open && lastActiveRef.current) {
      const el = lastActiveRef.current;
      // timeout pequeno para garantir que desmontes ocorram antes
      setTimeout(() => el?.focus?.(), 0);
    }
  }, [open]);

  const setLastActiveElement = (el: HTMLElement | null) => {
    lastActiveRef.current = el;
  };

  const ctx: SheetContextValue = React.useMemo(
    () => ({ open, setOpen, setLastActiveElement }),
    [open, setOpen],
  );

  return <SheetContext.Provider value={ctx}>{children}</SheetContext.Provider>;
};

// Trigger: pode usar asChild para delegar ao filho
interface SheetTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children?: React.ReactNode;
}

const SheetTrigger = React.forwardRef<HTMLButtonElement, SheetTriggerProps>(
  ({ asChild, onClick, children, ...rest }, ref) => {
    const ctx = React.useContext(SheetContext);
    if (!ctx) return null;
    const handleClick: React.MouseEventHandler<HTMLElement> = (e) => {
      ctx.setLastActiveElement(document.activeElement as HTMLElement);
      // Dispara onClick original (se for button)
      onClick?.(e as unknown as React.MouseEvent<HTMLButtonElement>);
      if (!e.defaultPrevented) ctx.setOpen(true);
    };

    if (asChild && React.isValidElement(children)) {
      const childEl = children as React.ReactElement<Record<string, unknown>>;
      const childOnClick = childEl.props?.onClick as
        | ((e: React.MouseEvent<HTMLElement>) => void)
        | undefined;
      return React.cloneElement(childEl, {
        ref,
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          // onClick do filho primeiro
          childOnClick?.(e);
          handleClick(e);
        },
      });
    }

    return (
      <button ref={ref} type="button" onClick={handleClick} {...rest}>
        {children}
      </button>
    );
  },
);
SheetTrigger.displayName = 'SheetTrigger';

// Close: botão para fechar (suporta asChild)
interface SheetCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children?: React.ReactNode;
}

const SheetClose = React.forwardRef<HTMLButtonElement, SheetCloseProps>(
  ({ asChild, onClick, children, ...rest }, ref) => {
    const ctx = React.useContext(SheetContext);
    if (!ctx) return null;
    const handleClick: React.MouseEventHandler<HTMLElement> = (e) => {
      onClick?.(e as unknown as React.MouseEvent<HTMLButtonElement>);
      if (!e.defaultPrevented) ctx.setOpen(false);
    };

    if (asChild && React.isValidElement(children)) {
      const childEl = children as React.ReactElement<Record<string, unknown>>;
      const childOnClick = childEl.props?.onClick as
        | ((e: React.MouseEvent<HTMLElement>) => void)
        | undefined;
      return React.cloneElement(childEl, {
        ref,
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          childOnClick?.(e);
          handleClick(e);
        },
      });
    }
    return (
      <button ref={ref} type="button" onClick={handleClick} {...rest}>
        {children}
      </button>
    );
  },
);
SheetClose.displayName = 'SheetClose';

// Portal simples para body
const SheetPortal: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  if (typeof document === 'undefined') return null;
  return createPortal(children as React.ReactNode, document.body);
};
SheetPortal.displayName = 'SheetPortal';

// Overlay estilizado
const SheetOverlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const ctx = React.useContext(SheetContext);
    if (!ctx || !ctx.open) return null;
    return (
      <div
        ref={ref}
        data-state={ctx.open ? 'open' : 'closed'}
        className={cn(
          'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          className,
        )}
        onClick={() => ctx.setOpen(false)}
        {...props}
      />
    );
  },
);
SheetOverlay.displayName = 'SheetOverlay';

// Variantes de posição do conteúdo
const sheetVariants = cva(
  'fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
        bottom:
          'inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
        left: 'inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
        right:
          'inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  },
);

interface SheetContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ side = 'right', className, children, ...props }, ref) => {
    const ctx = React.useContext(SheetContext);
    const open = !!ctx?.open;
    // foco no conteúdo ao abrir
    const contentRef = React.useRef<HTMLDivElement | null>(null);
    React.useEffect(() => {
      if (open) contentRef.current?.focus?.();
    }, [open]);

    if (!open) return null;

    return (
      <SheetPortal>
        <SheetOverlay />
        <div
          ref={(node) => {
            contentRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          data-state={open ? 'open' : 'closed'}
          className={cn(sheetVariants({ side }), className)}
          {...props}
        >
          {children}
          <SheetClose
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-secondary hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </div>
      </SheetPortal>
    );
  },
);
SheetContent.displayName = 'SheetContent';

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
);
SheetHeader.displayName = 'SheetHeader';

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
);
SheetFooter.displayName = 'SheetFooter';

const SheetTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn('text-lg font-semibold text-foreground', className)} {...props} />
  ),
);
SheetTitle.displayName = 'SheetTitle';

const SheetDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));
SheetDescription.displayName = 'SheetDescription';

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
};
