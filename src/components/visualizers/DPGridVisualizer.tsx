"use client";

import React from "react";
import { useVisualizerStore } from "@/store/visualizer-store";
import { ElementState } from "@/types/algorithm";

const CELL_STYLES: Record<ElementState, React.CSSProperties> = {
  default: {
    backgroundColor: "hsl(var(--card))",
    color: "hsl(var(--foreground))",
  },
  comparing: {
    backgroundColor: "hsl(var(--chart-2))",
    color: "hsl(var(--background))",
  },
  swapping: {
    backgroundColor: "hsl(var(--chart-5))",
    color: "hsl(var(--background))",
  },
  pivot: {
    backgroundColor: "hsl(var(--primary))",
    color: "hsl(var(--primary-foreground))",
  },
  overwrite: {
    backgroundColor: "hsl(var(--chart-4))",
    color: "hsl(var(--background))",
  },
  bucket: {
    backgroundColor: "hsl(var(--chart-4))",
    color: "hsl(var(--background))",
  },
  target: {
    backgroundColor: "hsl(var(--primary))",
    color: "hsl(var(--primary-foreground))",
  },
  sorted: {
    backgroundColor: "hsl(var(--chart-3))",
    color: "hsl(var(--background))",
  },
};

export function DPGridVisualizer() {
  const { steps, currentStepIndex } = useVisualizerStore();
  const currentStep = steps[currentStepIndex] ?? steps[0];
  const dpGridData = currentStep?.dpGridData;

  if (!currentStep || !dpGridData) return null;

  return (
    <div className="flex-1 flex flex-col min-h-0 rounded-lg border border-border bg-card text-card-foreground shadow-theme overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-border bg-muted/30 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-sm bg-secondary text-secondary-foreground border border-border font-mono text-[10px] font-semibold">
            MATRIX / DP
          </span>
          <span className="text-xs font-semibold text-foreground">
            {currentStep.title}
          </span>
          <span className="text-xs text-muted-foreground hidden md:inline">
            — {currentStep.description}
          </span>
        </div>
        {dpGridData.title && (
          <span className="text-xs font-mono text-muted-foreground">
            {dpGridData.title}
          </span>
        )}
      </div>

      {/* Tabulation Grid */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-auto bg-background/40 min-h-[280px]">
        <table className="border-collapse font-mono text-xs">
          <thead>
            <tr>
              <th className="p-2 border border-border bg-muted text-muted-foreground text-left">
                State
              </th>
              {dpGridData.colHeaders.map((col, cIdx) => (
                <th
                  key={cIdx}
                  className="px-3.5 py-2 border border-border bg-muted text-foreground font-semibold text-center"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dpGridData.cells.map((row, rIdx) => (
              <tr key={rIdx}>
                <td className="px-3 py-2.5 border border-border bg-muted/60 text-foreground font-semibold whitespace-nowrap">
                  {dpGridData.rowHeaders[rIdx] ?? `Row ${rIdx}`}
                </td>
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    style={CELL_STYLES[cell.state] ?? CELL_STYLES.default}
                    className="px-4 py-3 border border-border text-center text-sm font-bold transition-colors min-w-[52px]"
                  >
                    {cell.value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

