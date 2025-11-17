import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='responsive-container'>{children}</div>
  ),
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid='line-chart'>{children}</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid='bar-chart'>{children}</div>,
  CartesianGrid: () => <div data-testid='cartesian-grid' />,
  XAxis: () => <div data-testid='x-axis' />,
  YAxis: () => <div data-testid='y-axis' />,
  Line: () => <div data-testid='line' />,
  Bar: () => <div data-testid='bar' />,
  Tooltip: () => <div data-testid='tooltip' />,
  Legend: () => <div data-testid='legend' />,
}));

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';

describe('Chart', () => {
  it('renderiza container do gráfico', () => {
    render(
      <ChartContainer
        config={{
          sales: {
            label: 'Vendas',
            color: '#8884d8',
          },
        }}
      >
        <div>Conteúdo do gráfico</div>
      </ChartContainer>,
    );

    expect(screen.getByText('Conteúdo do gráfico')).toBeInTheDocument();
  });

  it('renderiza tooltip customizado', () => {
    render(<ChartTooltip content={<ChartTooltipContent />} />);

    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  it('renderiza legenda customizada', () => {
    render(<ChartLegend content={<ChartLegendContent />} />);

    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });
});
