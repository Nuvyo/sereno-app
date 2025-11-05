import * as React from 'react';
import { cn } from '@/lib/utils';

interface SliderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      className,
      value,
      defaultValue = [0],
      onValueChange,
      min = 0,
      max = 100,
      step = 1,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = React.useState(value || defaultValue);
    const sliderRef = React.useRef<HTMLDivElement>(null);
    const isDragging = React.useRef(false);

    const currentValue = value || internalValue;
    const percentage = ((currentValue[0] - min) / (max - min)) * 100;

    const updateValue = React.useCallback(
      (clientX: number) => {
        if (!sliderRef.current) return;

        const rect = sliderRef.current.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const rawValue = min + percent * (max - min);
        const steppedValue = Math.round(rawValue / step) * step;
        const clampedValue = Math.max(min, Math.min(max, steppedValue));

        const newValue = [clampedValue];
        if (value === undefined) {
          setInternalValue(newValue);
        }
        onValueChange?.(newValue);
      },
      [min, max, step, value, onValueChange],
    );

    const handleMouseDown = (e: React.MouseEvent) => {
      if (disabled) return;
      isDragging.current = true;
      updateValue(e.clientX);
    };

    const handleMouseMove = React.useCallback(
      (e: MouseEvent) => {
        if (isDragging.current) {
          updateValue(e.clientX);
        }
      },
      [updateValue],
    );

    const handleMouseUp = React.useCallback(() => {
      isDragging.current = false;
    }, []);

    React.useEffect(() => {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }, [handleMouseMove, handleMouseUp]);

    return (
      <div
        ref={ref}
        className={cn('relative flex w-full touch-none select-none items-center', className)}
        {...props}
      >
        <div
          ref={sliderRef}
          className={cn(
            'relative h-2 w-full grow overflow-hidden rounded-full bg-secondary',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
          onMouseDown={handleMouseDown}
        >
          <div className="absolute h-full bg-primary" style={{ width: `${percentage}%` }} />
        </div>
        <div
          className={cn(
            'absolute block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          )}
          style={{ left: `calc(${percentage}% - 10px)` }}
        />
      </div>
    );
  },
);
Slider.displayName = 'Slider';

export { Slider };
