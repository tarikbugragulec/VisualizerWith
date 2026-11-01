"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVisualizerStore } from "@/store/visualizer-store";
import { ElementState, StepOperationType } from "@/types/algorithm";
import { cn } from "@/lib/utils";

/**
 * Maps each algorithmic element state to Tweakcn semantic chart/theme variables.
 * Zero neon glow or hardcoded AI gradients.
 */
const BAR_STYLES: Record<
  ElementState,
  {
    barStyle: React.CSSProperties;
    badgeClass: string;
    label: string;
  }
> = {
  default: {
    barStyle: {
      backgroundColor: "hsl(var(--secondary))",
      borderColor: "hsl(var(--border))",
    },
    badgeClass: "text-muted-foreground",
    label: "Default",
  },
  comparing: {
    barStyle: {
      backgroundColor: "hsl(var(--chart-2))",
      borderColor: "hsl(var(--chart-2))",
    },
    badgeClass: "text-foreground font-bold",
    label: "Compare",
  },
  swapping: {
    barStyle: {
      backgroundColor: "hsl(var(--chart-5))",
      borderColor: "hsl(var(--chart-5))",
    },
    badgeClass: "text-foreground font-bold",
    label: "Swap",
  },
  pivot: {
    barStyle: {
      backgroundColor: "hsl(var(--primary))",
      borderColor: "hsl(var(--primary))",
    },
    badgeClass: "text-primary font-bold",
    label: "Pivot",
  },
  overwrite: {
    barStyle: {
      backgroundColor: "hsl(var(--chart-4))",
      borderColor: "hsl(var(--chart-4))",
    },
    badgeClass: "text-foreground font-bold",
    label: "Write",
  },
  bucket: {
    barStyle: {
      backgroundColor: "hsl(var(--chart-4))",
      borderColor: "hsl(var(--chart-4))",
    },
    badgeClass: "text-foreground font-bold",
    label: "Bucket",
  },
  target: {
    barStyle: {
      backgroundColor: "hsl(var(--primary))",
      borderColor: "hsl(var(--primary))",
    },
    badgeClass: "text-primary font-bold",
    label: "Target",
  },
  sorted: {
    barStyle: {
      backgroundColor: "hsl(var(--chart-3))",
      borderColor: "hsl(var(--chart-3))",
    },
    badgeClass: "text-foreground font-medium",
    label: "Sorted",
  },
};

const OPERATION_LABELS: Record<StepOperationType, string> = {
  init: "INIT",
  compare: "COMPARE",
  swap: "SWAP",
  overwrite: "WRITE",
  pivot: "PIVOT",
  "mark-sorted": "LOCKED",
  bucket: "BUCKET",
  complete: "DONE",
};

export function ArrayVisualizer() {
  const { steps, currentStepIndex, soundEnabled, speedMultiplier } =
    useVisualizerStore();

  const audioCtxRef = useRef<AudioContext | null>(null);

  const currentStep = steps[currentStepIndex] ?? steps[0];
  const bars = currentStep?.array ?? [];
  const maxValue = Math.max(...bars.map((b) => b.value), 100);

  useEffect(() => {
    if (!soundEnabled || !currentStep) return;
    if (currentStep.highlightedIndices.length === 0) return;

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const idx = currentStep.highlightedIndices[0];
      const val = currentStep.array[idx]?.value ?? 50;
      const freq = 180 + (val / maxValue) * 520;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = currentStep.type === "swap" ? "triangle" : "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.065);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.07);
    } catch {
      // Ignore audio errors
    }
  }, [currentStepIndex, soundEnabled, currentStep, maxValue]);

  if (!currentStep) {
    return null;
  }

  const isDense = bars.length > 28;
  const springDuration = Math.min(0.3, Math.max(0.05, 0.22 / speedMultiplier));

  return (
    <div className="flex-1 flex flex-col min-h-0 rounded-lg border border-border bg-card text-card-foreground shadow-theme overflow-hidden">
      {/* Top Bar: Step Description & Tweakcn Chart Swatch Legend */}
      <div className="px-4 py-2.5 border-b border-border bg-muted/30 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="px-2 py-0.5 rounded-sm bg-secondary text-secondary-foreground border border-border font-mono text-[10px] font-semibold tracking-wider shrink-0">
            {OPERATION_LABELS[currentStep.type] ?? "STEP"}
          </span>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-foreground mr-2">
              {currentStep.title}
            </span>
            <span className="text-xs text-muted-foreground hidden md:inline">
              — {currentStep.description}
            </span>
          </div>
        </div>

        {/* Swatch Legend bound to Tweakcn chart variables */}
        <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground shrink-0">
          <span className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-sm border border-border"
              style={{ backgroundColor: "hsl(var(--secondary))" }}
            />
            Idle
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: "hsl(var(--chart-2))" }}
            />
            Compare
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: "hsl(var(--chart-5))" }}
            />
            Swap
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: "hsl(var(--primary))" }}
            />
            Pivot
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: "hsl(var(--chart-4))" }}
            />
            Write
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: "hsl(var(--chart-3))" }}
            />
            Sorted
          </span>
        </div>
      </div>

      {/* Main Canvas Stage */}
      <div className="relative flex-1 flex flex-col justify-end px-6 pt-8 pb-4 min-h-[280px] overflow-hidden bg-background/40">
        {/* Crisp 1px Reference Lines */}
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between px-6 py-8">
          {[100, 75, 50, 25, 0].map((pct) => (
            <div
              key={pct}
              className="w-full border-b border-dashed border-border/60 flex items-center"
            >
              <span className="text-[10px] font-mono text-muted-foreground/70 -mt-4">
                {Math.round((maxValue * pct) / 100)}
              </span>
            </div>
          ))}
        </div>

        {/* Bars Stage */}
        <div className="relative z-10 flex-1 flex items-end justify-center gap-1.5 sm:gap-2 w-full max-w-5xl mx-auto">
          {bars.map((bar, index) => {
            const style = BAR_STYLES[bar.state] ?? BAR_STYLES.default;
            const heightPercent = Math.max(8, (bar.value / maxValue) * 100);
            const isHighlighted =
              currentStep.highlightedIndices.includes(index) ||
              currentStep.pivotIndex === index;

            return (
              <motion.div
                key={bar.id}
                layout
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 32,
                  duration: springDuration,
                }}
                className="flex-1 flex flex-col items-center justify-end h-full min-w-[8px] max-w-[48px]"
              >
                {!isDense && (
                  <motion.span
                    layout="position"
                    className={cn(
                      "mb-1 text-[11px] font-mono",
                      style.badgeClass
                    )}
                  >
                    {bar.value}
                  </motion.span>
                )}

                <motion.div
                  layout
                  style={{
                    height: `${heightPercent}%`,
                    ...style.barStyle,
                  }}
                  className="w-full rounded-t-sm border transition-colors duration-100 relative"
                >
                  {currentStep.pivotIndex === index && (
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 px-1 py-0.2 rounded-sm bg-primary text-primary-foreground text-[9px] font-mono font-semibold uppercase">
                      piv
                    </span>
                  )}
                </motion.div>

                <div
                  className={cn(
                    "mt-1.5 text-[10px] font-mono px-1 rounded-sm",
                    isHighlighted
                      ? "bg-accent text-accent-foreground font-bold"
                      : "text-muted-foreground"
                  )}
                >
                  {!isDense || index % 2 === 0 ? index : "·"}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Auxiliary Memory / Buckets Drawer */}
      <AnimatePresence>
        {currentStep.auxiliaryBuckets &&
          currentStep.auxiliaryBuckets.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-border bg-muted/20 px-4 py-2.5"
            >
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                Auxiliary Buffers / Buckets
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-1.5">
                {currentStep.auxiliaryBuckets.map((bucket) => (
                  <div
                    key={bucket.label}
                    className="rounded-sm border border-border bg-card p-1.5 flex flex-col justify-between"
                  >
                    <span className="text-[10px] font-mono text-muted-foreground mb-1 truncate">
                      {bucket.label}
                    </span>
                    <div className="flex flex-wrap gap-1 min-h-[20px] items-center">
                      {bucket.values.length === 0 ? (
                        <span className="text-[10px] text-muted-foreground/50 font-mono">
                          —
                        </span>
                      ) : (
                        bucket.values.map((v, i) => (
                          <span
                            key={`${bucket.label}-${i}-${v}`}
                            className="px-1 py-0.2 rounded-sm bg-secondary text-secondary-foreground border border-border text-[10px] font-mono font-semibold"
                          >
                            {v}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}
