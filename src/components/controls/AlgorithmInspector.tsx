"use client";

import React from "react";
import { Check, Code2, Pencil, X } from "lucide-react";
import { summarizeStepHistory } from "@/engine/history";
import { useVisualizerStore } from "@/store/visualizer-store";
import { cn } from "@/lib/utils";

export function AlgorithmInspector() {
  const {
    selectedAlgorithmId,
    steps,
    currentStepIndex,
    customAlgorithms,
    resolveAlgorithm,
    openCustomModal,
  } = useVisualizerStore();

  const algorithm = resolveAlgorithm(selectedAlgorithmId);
  const isCustom = customAlgorithms.some((c) => c.id === selectedAlgorithmId);
  const currentStep = steps[currentStepIndex] ?? steps[0];
  const summary = summarizeStepHistory(steps);

  return (
    <div className="w-full xl:w-96 shrink-0 flex flex-col gap-3">
      {/* Live Telemetry Grid */}
      <div className="rounded-lg border border-border bg-card text-card-foreground shadow-theme p-3.5 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-foreground">
            Runtime Telemetry
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">
            steps = {steps.length}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-md bg-muted/40 border border-border p-2">
            <span className="text-[10px] font-mono uppercase text-muted-foreground block">
              Comparisons
            </span>
            <div className="mt-0.5 flex items-baseline justify-between font-mono">
              <span className="text-base font-bold text-foreground">
                {currentStep?.metrics.comparisons ?? 0}
              </span>
              <span className="text-[10px] text-muted-foreground">
                /{summary.totalComparisons}
              </span>
            </div>
          </div>

          <div className="rounded-md bg-muted/40 border border-border p-2">
            <span className="text-[10px] font-mono uppercase text-muted-foreground block">
              Swaps/Writes
            </span>
            <div className="mt-0.5 flex items-baseline justify-between font-mono">
              <span className="text-base font-bold text-foreground">
                {currentStep?.metrics.swaps ?? 0}
              </span>
              <span className="text-[10px] text-muted-foreground">
                /{summary.totalSwaps}
              </span>
            </div>
          </div>

          <div className="rounded-md bg-muted/40 border border-border p-2">
            <span className="text-[10px] font-mono uppercase text-muted-foreground block">
              Array Reads
            </span>
            <div className="mt-0.5 flex items-baseline justify-between font-mono">
              <span className="text-base font-bold text-foreground">
                {currentStep?.metrics.arrayAccesses ?? 0}
              </span>
              <span className="text-[10px] text-muted-foreground">
                /{summary.totalAccesses}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Synchronized Source Code Trace */}
      <div className="rounded-lg border border-border bg-card text-card-foreground shadow-theme overflow-hidden flex flex-col">
        <div className="px-3.5 py-2.5 border-b border-border bg-muted/30 flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-primary" />
            {isCustom ? "Custom Algorithm Code" : "TypeScript Trace"}
          </span>
          <div className="flex items-center gap-1.5">
            {isCustom && (
              <button
                onClick={() => openCustomModal(selectedAlgorithmId)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-primary text-primary-foreground text-[10px] font-medium"
              >
                <Pencil className="w-2.5 h-2.5" />
                Edit Code
              </button>
            )}
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-secondary text-secondary-foreground border border-border">
              L{currentStep?.codeLine ?? 1}
            </span>
          </div>
        </div>

        <div className="p-2.5 font-mono text-[11px] leading-relaxed overflow-x-auto bg-background max-h-64 overflow-y-auto">
          {algorithm.codeLines.map((line, idx) => {
            const lineNum = idx + 1;
            const isActive = currentStep?.codeLine === lineNum;
            return (
              <div
                key={lineNum}
                className={cn(
                  "flex items-center gap-3 px-2 py-0.5 rounded-sm transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground border-l-2 border-primary font-semibold"
                    : "text-muted-foreground"
                )}
              >
                <span className="w-4 text-right text-[10px] opacity-50 select-none shrink-0">
                  {lineNum}
                </span>
                <pre className="whitespace-pre">{line}</pre>
              </div>
            );
          })}
        </div>
      </div>

      {/* Complexity & Notes */}
      <div className="rounded-lg border border-border bg-card text-card-foreground shadow-theme p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground">
            Complexity Profile
          </span>
          <div className="flex items-center gap-1.5 font-mono text-[10px]">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-secondary text-secondary-foreground border border-border">
              {algorithm.complexity.stable ? (
                <Check className="w-3 h-3" />
              ) : (
                <X className="w-3 h-3" />
              )}
              Stable
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-secondary text-secondary-foreground border border-border">
              {algorithm.complexity.inPlace ? (
                <Check className="w-3 h-3" />
              ) : (
                <X className="w-3 h-3" />
              )}
              In-Place
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-1.5 text-center font-mono">
          <div className="rounded-sm bg-muted/40 border border-border p-1.5">
            <span className="text-[10px] text-muted-foreground block">
              Best
            </span>
            <span className="text-xs font-semibold text-foreground">
              {algorithm.complexity.timeBest}
            </span>
          </div>
          <div className="rounded-sm bg-muted/40 border border-border p-1.5">
            <span className="text-[10px] text-muted-foreground block">
              Avg
            </span>
            <span className="text-xs font-semibold text-foreground">
              {algorithm.complexity.timeAverage}
            </span>
          </div>
          <div className="rounded-sm bg-muted/40 border border-border p-1.5">
            <span className="text-[10px] text-muted-foreground block">
              Worst
            </span>
            <span className="text-xs font-semibold text-foreground">
              {algorithm.complexity.timeWorst}
            </span>
          </div>
          <div className="rounded-sm bg-muted/40 border border-border p-1.5">
            <span className="text-[10px] text-muted-foreground block">
              Space
            </span>
            <span className="text-xs font-semibold text-foreground">
              {algorithm.complexity.spaceWorst}
            </span>
          </div>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {algorithm.description}
          </p>
          <ul className="space-y-1 pt-1">
            {algorithm.keyTakeaways.map((point, i) => (
              <li
                key={i}
                className="text-[11px] text-foreground flex items-start gap-2"
              >
                <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
