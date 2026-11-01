"use client";

import React from "react";
import { ArrowRight, Play } from "lucide-react";
import { DSA_CATEGORIES } from "@/algorithms/registry";
import { SORTING_ALGORITHMS } from "@/algorithms/sorting";
import { ThemeCustomizer } from "@/components/controls/ThemeCustomizer";
import { useVisualizerStore } from "@/store/visualizer-store";
import { cn } from "@/lib/utils";

export function DashboardOverview() {
  const { selectAlgorithm, setActiveView } = useVisualizerStore();

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background text-foreground">
      {/* Top Bar */}
      <header className="h-14 px-6 border-b border-border bg-card flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-sm font-semibold tracking-tight text-foreground">
            DSA Curriculum & Engine Index
          </h1>
          <p className="text-xs text-muted-foreground">
            7 domains • 46 algorithms & data structures
          </p>
        </div>
        <ThemeCustomizer />
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Top Hero Card */}
        <div className="rounded-lg border border-border bg-card text-card-foreground shadow-theme p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="text-xs font-mono uppercase tracking-wider text-primary">
              Unified TypeScript Step Engine
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              Deterministic Algorithm Visualization Workbench
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every algorithm runs in pure TypeScript to generate an immutable sequence of step snapshots. Switch themes live using the Tweakcn bar above or paste your own custom CSS variables.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => selectAlgorithm("quick-sort")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 text-xs font-semibold"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Open Visualizer
            </button>
          </div>
        </div>

        {/* Sorting Suite Table / Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">
              Sorting Algorithms (8 Ready)
            </h3>
            <button
              onClick={() => setActiveView("visualizer")}
              className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
            >
              Go to Studio <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {SORTING_ALGORITHMS.map((algo) => (
              <button
                key={algo.id}
                onClick={() => selectAlgorithm(algo.id)}
                className="text-left rounded-lg border border-border bg-card hover:bg-accent/40 text-card-foreground shadow-theme p-4 transition-colors flex flex-col justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">
                      {algo.name}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-secondary text-secondary-foreground border border-border">
                      Ready
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {algo.shortDescription}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-border flex items-center justify-between text-[11px] font-mono">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">
                      Average
                    </span>
                    <span className="text-foreground font-semibold">
                      {algo.complexity.timeAverage}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">
                      Space
                    </span>
                    <span className="text-foreground font-semibold">
                      {algo.complexity.spaceWorst}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">
                      Stable
                    </span>
                    <span className="text-foreground font-semibold">
                      {algo.complexity.stable ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* All 7 Categories */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">
            Complete DSA Modules (46 Topics)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {DSA_CATEGORIES.map((category) => (
              <div
                key={category.id}
                className="rounded-lg border border-border bg-card text-card-foreground shadow-theme p-4 flex flex-col justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-foreground">
                      {category.name}
                    </h4>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-muted text-muted-foreground border border-border">
                      {category.visualizerType}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {category.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 pt-2 border-t border-border">
                  {category.algorithms.map((algo) => (
                    <button
                      key={algo.id}
                      onClick={() => {
                        if (algo.implemented) {
                          selectAlgorithm(algo.id);
                        }
                      }}
                      className={cn(
                        "text-[11px] px-2 py-0.5 rounded-sm border transition-colors",
                        algo.implemented
                          ? "bg-secondary text-secondary-foreground border-border hover:bg-primary hover:text-primary-foreground font-medium cursor-pointer"
                          : "bg-muted/40 text-muted-foreground border-border/60 cursor-default"
                      )}
                    >
                      {algo.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
