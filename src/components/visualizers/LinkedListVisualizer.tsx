"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeftRight, ArrowRight } from "lucide-react";
import { useVisualizerStore } from "@/store/visualizer-store";
import { ElementState } from "@/types/algorithm";

const NODE_COLORS: Record<ElementState, React.CSSProperties> = {
  default: {
    backgroundColor: "hsl(var(--secondary))",
    borderColor: "hsl(var(--border))",
    color: "hsl(var(--secondary-foreground))",
  },
  comparing: {
    backgroundColor: "hsl(var(--chart-2))",
    borderColor: "hsl(var(--chart-2))",
    color: "hsl(var(--background))",
  },
  swapping: {
    backgroundColor: "hsl(var(--chart-5))",
    borderColor: "hsl(var(--chart-5))",
    color: "hsl(var(--background))",
  },
  pivot: {
    backgroundColor: "hsl(var(--primary))",
    borderColor: "hsl(var(--primary))",
    color: "hsl(var(--primary-foreground))",
  },
  overwrite: {
    backgroundColor: "hsl(var(--chart-4))",
    borderColor: "hsl(var(--chart-4))",
    color: "hsl(var(--background))",
  },
  bucket: {
    backgroundColor: "hsl(var(--chart-4))",
    borderColor: "hsl(var(--chart-4))",
    color: "hsl(var(--background))",
  },
  target: {
    backgroundColor: "hsl(var(--primary))",
    borderColor: "hsl(var(--primary))",
    color: "hsl(var(--primary-foreground))",
  },
  sorted: {
    backgroundColor: "hsl(var(--chart-3))",
    borderColor: "hsl(var(--chart-3))",
    color: "hsl(var(--background))",
  },
};

export function LinkedListVisualizer() {
  const { steps, currentStepIndex } = useVisualizerStore();
  const currentStep = steps[currentStepIndex] ?? steps[0];
  const linearData = currentStep?.linearData;

  if (!currentStep || !linearData) return null;

  const { mode, nodes, capacity = 8 } = linearData;
  const isStack = mode === "stack";
  const isLinked = mode === "singly-linked" || mode === "doubly-linked";

  return (
    <div className="flex-1 flex flex-col min-h-0 rounded-lg border border-border bg-card text-card-foreground shadow-theme overflow-hidden">
      {/* Top Status Bar */}
      <div className="px-4 py-2.5 border-b border-border bg-muted/30 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-sm bg-secondary text-secondary-foreground border border-border font-mono text-[10px] font-semibold uppercase">
            {mode}
          </span>
          <span className="text-xs font-semibold text-foreground">
            {currentStep.title}
          </span>
          <span className="text-xs text-muted-foreground hidden md:inline">
            — {currentStep.description}
          </span>
        </div>
        <span className="text-[11px] font-mono text-muted-foreground">
          Size: {nodes.length}
          {mode === "dynamic-array" ? ` / Capacity: ${capacity}` : ""}
        </span>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-x-auto bg-background/40 min-h-[280px]">
        {isStack ? (
          /* Vertical LIFO Stack Tower */
          <div className="flex flex-col-reverse items-center justify-start gap-2 border-x-2 border-b-2 border-border px-6 pb-4 pt-8 rounded-b-md min-w-[200px] bg-card/50">
            {nodes.map((node, i) => (
              <motion.div
                key={node.id}
                layout
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={NODE_COLORS[node.state] ?? NODE_COLORS.default}
                className="w-40 py-2.5 px-4 rounded-sm border font-mono text-xs font-semibold flex items-center justify-between shadow-sm"
              >
                <span>{node.value}</span>
                <span className="text-[10px] opacity-80">
                  {node.label ?? `#${i}`}
                </span>
              </motion.div>
            ))}
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
              ↑ LIFO Stack Top ↑
            </span>
          </div>
        ) : (
          /* Horizontal Pointer / Contiguous Buffer Layout */
          <div className="flex flex-wrap items-center justify-center gap-2">
            {nodes.map((node, i) => (
              <React.Fragment key={node.id}>
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center"
                >
                  {node.label && (
                    <span className="mb-1.5 px-1.5 py-0.5 rounded-sm bg-muted text-muted-foreground border border-border text-[10px] font-mono font-semibold">
                      {node.label}
                    </span>
                  )}
                  <div
                    style={NODE_COLORS[node.state] ?? NODE_COLORS.default}
                    className="min-w-[68px] h-14 px-3 rounded-sm border flex flex-col items-center justify-center font-mono shadow-sm"
                  >
                    <span className="text-sm font-bold">{node.value}</span>
                    {isLinked && (
                      <span className="text-[9px] opacity-75 border-t border-current/20 w-full text-center mt-1 pt-0.5">
                        {mode === "doubly-linked" ? "prev | next" : "next •"}
                      </span>
                    )}
                  </div>
                </motion.div>

                {isLinked && i < nodes.length - 1 && (
                  <div className="flex items-center text-muted-foreground pt-5">
                    {mode === "doubly-linked" ? (
                      <ArrowLeftRight className="w-4 h-4" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </div>
                )}
              </React.Fragment>
            ))}

            {isLinked && (
              <div className="flex items-center gap-2 pt-5">
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <span className="px-2.5 py-2 rounded-sm border border-dashed border-border text-xs font-mono text-muted-foreground">
                  NULL
                </span>
              </div>
            )}

            {/* Show spare capacity cells for Dynamic Array */}
            {mode === "dynamic-array" &&
              Array.from({
                length: Math.max(0, capacity - nodes.length),
              }).map((_, emptyIdx) => (
                <div
                  key={`empty-${emptyIdx}`}
                  className="flex flex-col items-center"
                >
                  <span className="mb-1.5 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground/50">
                    cap {nodes.length + emptyIdx}
                  </span>
                  <div className="min-w-[64px] h-14 rounded-sm border border-dashed border-border bg-muted/20 flex items-center justify-center text-[10px] font-mono text-muted-foreground">
                    free
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
