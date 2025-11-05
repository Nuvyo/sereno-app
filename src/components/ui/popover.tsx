import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.MutableRefObject<HTMLElement | null>;
}

const PopoverContext = React.createContext<PopoverContextValue | undefined>(undefined);

const usePopover = () => {
  const context = React.useContext(PopoverContext);
  if (!context) {
    throw new Error('Popover components must be used within Popover');
  }
  return context;
};

interface PopoverProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Popover = ({ children, open: controlledOpen, onOpenChange }: PopoverProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLElement | null>(null);

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
    <PopoverContext.Provider value={{ open, setOpen, triggerRef }}>
      {children}
    </PopoverContext.Provider>
  );
};

interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  ({ asChild, onClick, children, ...props }, ref) => {
    const { open, setOpen, triggerRef } = usePopover();
    const setRef = <T,>(r: React.Ref<T> | undefined, value: T | null) => {
      if (!r) return;
      if (typeof r === 'function') r(value);
      else (r as React.MutableRefObject<T | null>).current = value;
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      triggerRef.current = e.currentTarget as unknown as HTMLElement;
      setOpen(!open);
      onClick?.(e);
    };

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<unknown>;
      return React.cloneElement(child, {
        onClick: (e: React.MouseEvent<HTMLButtonElement>) => handleClick(e),
        ref: (node: HTMLElement) => {
          setRef(ref as React.Ref<HTMLButtonElement>, node as HTMLButtonElement | null);
          triggerRef.current = node;
        },
      } as React.Attributes & Record<string, unknown>);
    }

    return (
      <button
        ref={(node) => {
          setRef(ref as React.Ref<HTMLButtonElement>, node);
          triggerRef.current = node as unknown as HTMLElement;
        }}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  },
);
PopoverTrigger.displayName = 'PopoverTrigger';

interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  collisionPadding?: number;
  sticky?: 'partial' | 'always' | 'none';
}

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  (
    {
      className,
      align = 'center',
      side = 'bottom',
      sideOffset = 6,
      collisionPadding = 8,
      // Evita realinhamentos periódicos que podem causar "saltos" após abrir
      sticky = 'none',
      style,
      ...props
    },
    ref,
  ) => {
    const { open, setOpen, triggerRef } = usePopover();
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

      // 1) decide side (flip se colisão principal)
      let chosenSide = side;
      if (side === 'bottom' && t.bottom + sideOffset + c.height + collisionPadding > viewportH) {
        chosenSide = 'top';
      } else if (side === 'top' && t.top - sideOffset - c.height - collisionPadding < 0) {
        chosenSide = 'bottom';
      } else if (
        side === 'right' &&
        t.right + sideOffset + c.width + collisionPadding > viewportW
      ) {
        chosenSide = 'left';
      } else if (side === 'left' && t.left - sideOffset - c.width - collisionPadding < 0) {
        chosenSide = 'right';
      }

      // 2) base coords
      let top = 0;
      let left = 0;
      if (chosenSide === 'bottom') top = t.bottom + sideOffset; // abaixo
      if (chosenSide === 'top') top = t.top - c.height - sideOffset; // acima
      if (chosenSide === 'right') left = t.right + sideOffset; // à direita
      if (chosenSide === 'left') left = t.left - c.width - sideOffset; // à esquerda

      if (chosenSide === 'bottom' || chosenSide === 'top') {
        // alinhar horizontalmente
        if (align === 'start') left = t.left;
        if (align === 'center') left = t.left + (t.width - c.width) / 2;
        if (align === 'end') left = t.right - c.width;
      } else {
        // alinhar verticalmente
        if (align === 'start') top = t.top;
        if (align === 'center') top = t.top + (t.height - c.height) / 2;
        if (align === 'end') top = t.bottom - c.height;
      }

      // 3) clamp dentro da viewport com padding
      const minLeft = collisionPadding;
      const maxLeft = viewportW - collisionPadding - c.width;
      const minTop = collisionPadding;
      const maxTop = viewportH - collisionPadding - c.height;

      left = Math.min(Math.max(left, minLeft), Math.max(minLeft, maxLeft));
      top = Math.min(Math.max(top, minTop), Math.max(minTop, maxTop));

      setCoords({ top, left });
    }, [align, collisionPadding, side, sideOffset, triggerRef]);

    // listeners para posicionamento
    React.useLayoutEffect(() => {
      if (!open) return;
      updatePosition();
      const handler = () => updatePosition();
      window.addEventListener('resize', handler);
      window.addEventListener('scroll', handler, true);
      const id = window.setInterval(
        () => {
          // sticky partial: atualiza periodicamente se layout mudou
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

    // fechar com clique fora/ESC
    React.useEffect(() => {
      if (!open) return;
      const onPointerDown = (e: MouseEvent) => {
        const target = e.target as Node;
        if (contentRef.current?.contains(target) || triggerRef.current?.contains(target as Node)) {
          return;
        }
        setOpen(false);
      };
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setOpen(false);
      };
      document.addEventListener('mousedown', onPointerDown);
      document.addEventListener('keydown', onKeyDown);
      return () => {
        document.removeEventListener('mousedown', onPointerDown);
        document.removeEventListener('keydown', onKeyDown);
      };
    }, [open, setOpen, triggerRef]);

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
          'fixed z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95 overflow-auto',
          className,
        )}
        style={{
          top: coords.top,
          left: coords.left,
          maxHeight: `calc(100vh - ${collisionPadding * 2}px)`,
          ...style,
        }}
        {...props}
      />
    );

    // Portal para evitar recortes por overflow dos containers
    return createPortal(node, document.body);
  },
);
PopoverContent.displayName = 'PopoverContent';

export { Popover, PopoverTrigger, PopoverContent };
