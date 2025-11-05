import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

describe('Resizable', () => {
  it('renderiza grupo de painéis redimensionáveis', () => {
    render(
      <ResizablePanelGroup direction="horizontal" className="max-w-md rounded-lg border">
        <ResizablePanel defaultSize={50}>
          <div className="flex h-[200px] items-center justify-center p-6">
            <span className="font-semibold">Um</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <div className="flex h-[200px] items-center justify-center p-6">
            <span className="font-semibold">Dois</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>,
    );

    expect(screen.getByText('Um')).toBeInTheDocument();
    expect(screen.getByText('Dois')).toBeInTheDocument();
  });

  it('renderiza com direção vertical', () => {
    render(
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel>
          <div>Painel superior</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <div>Painel inferior</div>
        </ResizablePanel>
      </ResizablePanelGroup>,
    );

    expect(screen.getByText('Painel superior')).toBeInTheDocument();
    expect(screen.getByText('Painel inferior')).toBeInTheDocument();
  });

  it('aplica classes customizadas', () => {
    render(
      <ResizablePanelGroup direction="horizontal" className="custom-group">
        <ResizablePanel className="custom-panel">
          <div>Conteúdo</div>
        </ResizablePanel>
      </ResizablePanelGroup>,
    );

    expect(screen.getByText('Conteúdo')).toBeInTheDocument();
  });
});
