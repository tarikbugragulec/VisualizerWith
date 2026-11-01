"use client";

import React from "react";
import { useVisualizerStore } from "@/store/visualizer-store";
import { ElementState } from "@/types/algorithm";

const NODE_FILL: Record<ElementState, string> = {
  default: "hsl(var(--secondary))",
  comparing: "hsl(var(--chart-2))",
  swapping: "hsl(var(--chart-5))",
  pivot: "hsl(var(--primary))",
  overwrite: "hsl(var(--chart-4))",
  bucket: "hsl(var(--chart-4))",
  target: "hsl(var(--primary))",
  sorted: "hsl(var(--chart-3))",
};

export function TreeVisualizer() {
  const { steps, currentStepIndex } = useVisualizerStore();
  const currentStep = steps[currentStepIndex] ?? steps[0];
  const treeData = currentStep?.treeData;

  if (!currentStep || !treeData) return null;

  const nodeMap = new Map(treeData.nodes.map((n) => [n.id, n]));

  return (
    <div className="flex-1 flex flex-col min-h-0 rounded-lg border border-border bg-card text-card-foreground shadow-theme overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-border bg-muted/30 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-sm bg-secondary text-secondary-foreground border border-border font-mono text-[10px] font-semibold">
            TREE
          </span>
          <span className="text-xs font-semibold text-foreground">
            {currentStep.title}
          </span>
          <span className="text-xs text-muted-foreground hidden md:inline">
            — {currentStep.description}
          </span>
        </div>
      </div>

      {/* SVG Hierarchy Canvas */}
      <div className="flex-1 relative min-h-[280px] bg-background/40 flex items-center justify-center p-4">
        <svg
          viewBox="0 0 1000 420"
          className="w-full h-full max-h-[380px] select-none"
        >
          {/* Tree Edges */}
          {treeData.edges.map((edge) => {
            const from = nodeMap.get(edge.from);
            const to = nodeMap.get(edge.to);
            if (!from || !to) return null;
            const x1 = from.x * 10;
            const y1 = from.y * 4;
            const x2 = to.x * 10;
            const y2 = to.y * 4;

            const strokeColor =
              edge.state === "sorted"
                ? "hsl(var(--chart-3))"
                : edge.state === "active"
                ? "hsl(var(--primary))"
                : "hsl(var(--border))";

            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={strokeColor}
                strokeWidth={edge.state === "default" ? 2.5 : 4}
              />
            );
          })}

          {/* Tree Nodes */}
          {treeData.nodes.map((node) => {
            const cx = node.x * 10;
            const cy = node.y * 4;
            const isDefault = node.state === "default";

            return (
              <g key={node.id} transform={`translate(${cx}, ${cy})`}>
                <circle
                  r={30}
                  fill={NODE_FILL[node.state] ?? NODE_FILL.default}
                  stroke="hsl(var(--border))"
                  strokeWidth={2}
                />
                <text
                  textAnchor="middle"
                  dy="4"
                  className="font-mono text-[13px] font-bold"
                  fill={
                    isDefault
                      ? "hsl(var(--secondary-foreground))"
                      : "hsl(var(--background))"
                  }
                >
                  {node.label}
                </text>
                {node.subLabel && (
                  <text
                    textAnchor="middle"
                    dy="46"
                    className="font-mono text-[11px] font-semibold"
                    fill="hsl(var(--muted-foreground))"
                  >
                    {node.subLabel}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Traversal / Output Footer */}
      {treeData.traversalOrder && treeData.traversalOrder.length > 0 && (
        <div className="px-4 py-2.5 border-t border-border bg-muted/20 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground shrink-0">
            Trace Output:
          </span>
          <div className="flex items-center gap-1.5">
            {treeData.traversalOrder.map((item, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-sm bg-secondary text-secondary-foreground border border-border text-xs font-mono font-semibold"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
