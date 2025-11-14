import * as React from 'react';
import { cn } from '@/lib/utils';

const ScrollArea = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const contentRef = React.useRef<HTMLDivElement>(null);
    const scrollbarRef = React.useRef<HTMLDivElement>(null);
    const thumbRef = React.useRef<HTMLDivElement>(null);
    const [showScrollbar, setShowScrollbar] = React.useState(false);
    const [thumbHeight, setThumbHeight] = React.useState(0);
    const [thumbTop, setThumbTop] = React.useState(0);
    const updateScrollbar = React.useCallback(() => {
      if (!contentRef.current || !scrollbarRef.current) return;

      const { scrollHeight, clientHeight, scrollTop } = contentRef.current;
      const hasScroll = scrollHeight > clientHeight;

      setShowScrollbar(hasScroll);

      if (hasScroll) {
        const thumbHeightCalc = (clientHeight / scrollHeight) * clientHeight;
        const thumbTopCalc = (scrollTop / scrollHeight) * clientHeight;

        setThumbHeight(thumbHeightCalc);
        setThumbTop(thumbTopCalc);
      }
    }, []);

    React.useEffect(() => {
      updateScrollbar();
      const content = contentRef.current;

      if (content) {
        content.addEventListener('scroll', updateScrollbar);
        window.addEventListener('resize', updateScrollbar);

        return () => {
          content.removeEventListener('scroll', updateScrollbar);
          window.removeEventListener('resize', updateScrollbar);
        };
      }
    }, [updateScrollbar]);

    return (
      <div ref={ref} className={cn('relative overflow-hidden', className)} {...props}>
        <div ref={contentRef} className='h-full w-full overflow-auto scrollbar-hide'>
          {children}
        </div>
        {showScrollbar && (
          <div
            ref={scrollbarRef}
            className='absolute right-0 top-0 h-full w-2.5 border-l border-l-transparent p-[1px] flex touch-none select-none transition-colors'
          >
            <div
              ref={thumbRef}
              className='relative flex-1 rounded-full bg-border'
              style={{
                height: `${thumbHeight}px`,
                transform: `translateY(${thumbTop}px)`,
              }}
            />
          </div>
        )}
      </div>
    );
  },
);

ScrollArea.displayName = 'ScrollArea';

const ScrollBar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex touch-none select-none transition-colors', className)} {...props} />
  ),
);

ScrollBar.displayName = 'ScrollBar';

export { ScrollArea, ScrollBar };
