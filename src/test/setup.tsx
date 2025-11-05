import '@testing-library/jest-dom/vitest';
import { beforeEach, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import type { ReactNode, HTMLAttributes, ButtonHTMLAttributes } from 'react';

// Polyfill matchMedia
if (typeof window !== 'undefined' && !window.matchMedia) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {}, // deprecated but used by some libs
    removeListener: () => {},
    dispatchEvent: () => false,
  });
}

// Mock scrollTo to avoid JSDOM errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (!(window as any).scrollTo) (window as any).scrollTo = () => {};

// Limpar localStorage entre testes
beforeEach(() => {
  window.localStorage.clear();
});

// Garantir limpeza do DOM entre testes para evitar elementos duplicados
afterEach(() => {
  cleanup();
});

// Mocks para libs pesadas que não são essenciais nos testes de unidade
vi.mock('vaul', () => {
  // Mock simplificado do Drawer da biblioteca vaul
  const Root = ({ children }: { children: ReactNode }) => <div>{children}</div>;
  const Overlay = (props: HTMLAttributes<HTMLDivElement>) => <div {...props} />;
  const Content = (props: HTMLAttributes<HTMLDivElement>) => <div {...props} />;
  const Trigger = (props: ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props} />;
  const Portal = ({ children }: { children: ReactNode }) => <>{children}</>;
  const Close = (props: ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props} />;
  const Title = (props: HTMLAttributes<HTMLDivElement>) => <div {...props} />;
  const Description = (props: HTMLAttributes<HTMLDivElement>) => <div {...props} />;
  return {
    Drawer: {
      Root,
      Overlay,
      Content,
      Trigger,
      Portal,
      Close,
      Title,
      Description,
    },
  };
});

vi.mock('recharts', () => {
  // Mocks mínimos para evitar erros de renderização do Recharts no JSDOM
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Comp = (props: any) => <div {...props} />;
  return {
    ResponsiveContainer: Comp,
    LineChart: Comp,
    Line: Comp,
    CartesianGrid: Comp,
    XAxis: Comp,
    YAxis: Comp,
    Tooltip: Comp,
    Legend: Comp,
    BarChart: Comp,
    Bar: Comp,
    PieChart: Comp,
    Pie: Comp,
    AreaChart: Comp,
    Area: Comp,
  };
});

vi.mock('embla-carousel-react', () => {
  return {
    default: () => null,
    useEmblaCarousel: () => [null, () => {}],
  };
});
