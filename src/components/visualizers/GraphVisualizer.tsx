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

export function GraphVisualizer() {
  const { steps, currentStepIndex } = useVisualizerStore();
  const currentStep = steps[currentStepIndex] ?? steps[0];
  const graphData = currentStep?.graphData;

  if (!currentStep || !graphData) return null;

  const nodeMap = new Map(graphData.nodes.map((n) => [n.id, n]));

  return (
    <div className="flex-1 flex flex-col min-h-0 rounded-lg border border-border bg-card text-card-foreground shadow-theme overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-border bg-muted/30 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-sm bg-secondary text-secondary-foreground border border-border font-mono text-[10px] font-semibold">
            GRAPH
          </span>
          <span className="text-xs font-semibold text-foreground">
            {currentStep.title}
          </span>
          <span className="text-xs text-muted-foreground hidden md:inline">
            — {currentStep.description}
          </span>
        </div>
      </div>

      {/* SVG Graph Canvas */}
      <div className="flex-1 relative min-h-[280px] bg-background/40 flex items-center justify-center p-4">
        <svg
          viewBox="0 0 1000 420"
          className="w-full h-full max-h-[380px] select-none"
        >
          {/* Edges */}
          {graphData.edges.map((edge) => {
            const from = nodeMap.get(edge.from);
            const to = nodeMap.get(edge.to);
            if (!from || !to) return null;
            const x1 = from.x * 10;
            const y1 = from.y * 4;
            const x2 = to.x * 10;
            const y2 = to.y * 4;
            const mx = (x1 + x2) / 2;
            const my = (y1 + y2) / 2;

            const strokeColor =
              edge.state === "sorted"
                ? "hsl(var(--chart-3))"
                : edge.state === "comparing"
                ? "hsl(var(--chart-2))"
                : edge.state === "swapping"
                ? "hsl(var(--chart-5))"
                : "hsl(var(--border))";

            return (
              <g key={`${edge.from}-${edge.to}`}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={strokeColor}
                  strokeWidth={edge.state === "default" ? 2.5 : 4.5}
                />
                {edge.weight !== undefined && (
                  <g transform={`translate(${mx}, ${my})`}>
                    <rect
                      x={-14}
                      y={-11}
                      width={28}
                      height={22}
                      rx={4}
                      fill="hsl(var(--card))"
                      stroke="hsl(var(--border))"
                    />
                    <text
                      textAnchor="middle"
                      dy="4"
                      className="font-mono text-[11px] font-bold"
                      fill="hsl(var(--foreground))"
                    >
                      {edge.weight}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Vertices */}
          {graphData.nodes.map((node) => {
            const cx = node.x * 10;
            const cy = node.y * 4;
            const isDefault = node.state === "default";

            return (
              <g key={node.id} transform={`translate(${cx}, ${cy})`}>
                <circle
                  r={28}
                  fill={NODE_FILL[node.state] ?? NODE_FILL.default}
                  stroke="hsl(var(--border))"
                  strokeWidth={2}
                />
                <text
                  textAnchor="middle"
                  dy="5"
                  className="font-mono text-[15px] font-bold"
                  fill={
                    isDefault
                      ? "hsl(var(--secondary-foreground))"
                      : "hsl(var(--background))"
                  }
                >
                  {node.label}
                </text>
                {node.distance && (
                  <text
                    textAnchor="middle"
                    dy="44"
                    className="font-mono text-[11px] font-semibold"
                    fill="hsl(var(--foreground))"
                  >
                    {node.distance}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Frontier Queue / Stack Footer */}
      {graphData.frontier && (
        <div className="px-4 py-2.5 border-t border-border bg-muted/20 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground shrink-0">
            {graphData.frontierLabel ?? "Frontier"}:
          </span>
          <div className="flex items-center gap-1.5">
            {graphData.frontier.length === 0 ? (
              <span className="text-xs font-mono text-muted-foreground">
                empty
              </span>
            ) : (
              graphData.frontier.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-sm bg-secondary text-secondary-foreground border border-border text-xs font-mono font-semibold"
                >
                  {item}
                </span>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
