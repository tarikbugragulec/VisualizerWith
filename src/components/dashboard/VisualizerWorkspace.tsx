"use client";

import React from "react";
import { Pencil, Plus } from "lucide-react";
import { getAlgorithmsByCategory } from "@/algorithms/registry";
import { AlgorithmInspector } from "@/components/controls/AlgorithmInspector";
import { PlaybackControls } from "@/components/controls/PlaybackControls";
import { ThemeCustomizer } from "@/components/controls/ThemeCustomizer";
import { ArrayVisualizer } from "@/components/visualizers/ArrayVisualizer";
import { DPGridVisualizer } from "@/components/visualizers/DPGridVisualizer";
import { GraphVisualizer } from "@/components/visualizers/GraphVisualizer";
import { LinkedListVisualizer } from "@/components/visualizers/LinkedListVisualizer";
import { TreeVisualizer } from "@/components/visualizers/TreeVisualizer";
import { useVisualizerStore } from "@/store/visualizer-store";
import { cn } from "@/lib/utils";

export function VisualizerWorkspace() {
  const {
    selectedAlgorithmId,
    selectAlgorithm,
    steps,
    currentStepIndex,
    customAlgorithms,
    resolveAlgorithm,
    openCustomModal,
  } = useVisualizerStore();

  const algorithm = resolveAlgorithm(selectedAlgorithmId);
  const isCustom = customAlgorithms.some((c) => c.id === selectedAlgorithmId);
  const categoryAlgorithms = getAlgorithmsByCategory(algorithm.category);
  const currentStep = steps[currentStepIndex] ?? steps[0];

  const renderActiveStage = () => {
    if (currentStep?.treeData) return <TreeVisualizer />;
    if (currentStep?.graphData) return <GraphVisualizer />;
    if (currentStep?.dpGridData) return <DPGridVisualizer />;
    if (currentStep?.linearData) return <LinkedListVisualizer />;
    return <ArrayVisualizer />;
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto xl:overflow-hidden bg-background text-foreground">
      {/* Top Bar: Title + Custom Code CTA + Tweakcn Theme Customizer */}
      <header className="h-14 px-5 border-b border-border bg-card flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <h1 className="text-sm font-bold tracking-tight text-foreground truncate">
            {algorithm.name}
          </h1>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-sm bg-secondary text-secondary-foreground border border-border">
            {algorithm.complexity.timeAverage}
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-sm bg-muted text-muted-foreground border border-border hidden sm:inline">
            Space {algorithm.complexity.spaceWorst}
          </span>

          {isCustom ? (
            <button
              onClick={() => openCustomModal(selectedAlgorithmId)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary text-primary-foreground text-xs font-medium"
            >
              <Pencil className="w-3 h-3" />
              Edit Custom Code
            </button>
          ) : (
            <button
              onClick={() => openCustomModal(null)}
              className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-border bg-background hover:bg-accent text-foreground text-xs font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-primary" />
              Write Custom Algorithm
            </button>
          )}
        </div>

        <ThemeCustomizer />
      </header>

      {/* Secondary Subbar: Quick Tabs for Active Category */}
      <div className="px-5 py-2 border-b border-border bg-muted/30 flex items-center justify-between gap-3 overflow-x-auto shrink-0">
        <div className="flex items-center gap-1">
          {categoryAlgorithms.map((item) => {
            const active = item.id === selectedAlgorithmId;
            return (
              <button
                key={item.id}
                onClick={() => selectAlgorithm(item.id)}
                className={cn(
                  "px-2.5 py-1 rounded-sm text-xs font-medium whitespace-nowrap transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {item.name}
              </button>
            );
          })}
        </div>
        <span className="text-xs text-muted-foreground hidden lg:inline truncate">
          {algorithm.shortDescription}
        </span>
      </div>

      {/* Main Split Workbench */}
      <div className="flex-1 flex flex-col xl:flex-row gap-3 p-3.5 min-h-0 overflow-y-auto xl:overflow-hidden">
        <div className="flex-1 flex flex-col gap-3 min-w-0 min-h-0">
          {renderActiveStage()}
          <PlaybackControls />
        </div>

        <div className="xl:overflow-y-auto">
          <AlgorithmInspector />
        </div>
      </div>
    </div>
  );
}
