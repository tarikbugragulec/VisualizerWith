"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Binary,
  Boxes,
  ChevronDown,
  ChevronRight,
  Code2,
  GitBranch,
  Layers,
  LayoutGrid,
  Network,
  Pencil,
  Play,
  Plus,
  Search,
  Terminal,
} from "lucide-react";
import { DSA_CATEGORIES } from "@/algorithms/registry";
import { useVisualizerStore } from "@/store/visualizer-store";
import { CategoryId } from "@/types/algorithm";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<CategoryId, React.ReactNode> = {
  sorting: <BarChart3 className="w-3.5 h-3.5 text-muted-foreground" />,
  searching: <Search className="w-3.5 h-3.5 text-muted-foreground" />,
  linear: <Layers className="w-3.5 h-3.5 text-muted-foreground" />,
  trees: <GitBranch className="w-3.5 h-3.5 text-muted-foreground" />,
  graphs: <Network className="w-3.5 h-3.5 text-muted-foreground" />,
  "dynamic-programming": <Boxes className="w-3.5 h-3.5 text-muted-foreground" />,
  other: <Binary className="w-3.5 h-3.5 text-muted-foreground" />,
};

export function Sidebar() {
  const {
    activeView,
    setActiveView,
    selectedAlgorithmId,
    selectAlgorithm,
    customAlgorithms,
    hydrateCustomAlgorithms,
    openCustomModal,
  } = useVisualizerStore();

  useEffect(() => {
    hydrateCustomAlgorithms();
  }, [hydrateCustomAlgorithms]);

  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({
    sorting: true,
    searching: true,
    linear: false,
    trees: false,
    graphs: false,
    "dynamic-programming": false,
    other: false,
  });

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredCategories = DSA_CATEGORIES.map((cat) => {
    if (!searchQuery.trim()) return cat;
    const q = searchQuery.toLowerCase();
    const matchingAlgos = cat.algorithms.filter(
      (a) =>
        a.name.toLowerCase().includes(q) || cat.name.toLowerCase().includes(q)
    );
    return { ...cat, algorithms: matchingAlgos };
  }).filter((cat) => cat.algorithms.length > 0);

  return (
    <aside className="w-64 shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground flex flex-col h-screen select-none">
      {/* Header */}
      <div className="h-14 px-4 border-b border-sidebar-border flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-mono text-xs font-bold">
            <Terminal className="w-4 h-4" />
          </div>
          <div className="leading-none">
            <span className="font-semibold text-sm tracking-tight text-sidebar-foreground block">
              DSA Workbench
            </span>
            <span className="text-[11px] text-muted-foreground font-mono">
              tweakcn / shadcn
            </span>
          </div>
        </div>
      </div>

      {/* Primary Workspace Navigation */}
      <div className="p-2 border-b border-sidebar-border space-y-1">
        <button
          onClick={() => setActiveView("visualizer")}
          className={cn(
            "w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
            activeView === "visualizer"
              ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
              : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
          )}
        >
          <span className="flex items-center gap-2">
            <Play className="w-3.5 h-3.5" />
            Visualizer Studio
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">
            {46 + customAlgorithms.length} live
          </span>
        </button>

        <button
          onClick={() => setActiveView("dashboard")}
          className={cn(
            "w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
            activeView === "dashboard"
              ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
              : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
          )}
        >
          <span className="flex items-center gap-2">
            <LayoutGrid className="w-3.5 h-3.5" />
            Curriculum Index
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">
            46
          </span>
        </button>

        {/* New Custom Algorithm CTA */}
        <button
          onClick={() => openCustomModal(null)}
          className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90 text-xs font-semibold transition-opacity"
        >
          <Plus className="w-3.5 h-3.5" />
          New Custom Algorithm
        </button>
      </div>

      {/* Filter Input */}
      <div className="p-2 border-b border-sidebar-border">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter algorithms..."
            className="w-full bg-background border border-input rounded-md pl-8 pr-2.5 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      {/* Tree Navigation */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {/* Custom User Algorithms Section */}
        <div className="space-y-0.5">
          <div className="px-2 py-1 flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Code2 className="w-3 h-3 text-primary" />
              My Custom Algorithms
            </span>
            <button
              onClick={() => openCustomModal(null)}
              title="Create Custom Algorithm"
              className="text-[10px] font-mono text-primary hover:underline"
            >
              + Add
            </button>
          </div>

          <div className="ml-2 pl-2 border-l border-sidebar-border space-y-0.5">
            {customAlgorithms.map((custom) => {
              const isSelected =
                activeView === "visualizer" &&
                selectedAlgorithmId === custom.id;
              return (
                <div
                  key={custom.id}
                  className={cn(
                    "group flex items-center justify-between px-2 py-1 rounded-sm text-xs transition-colors",
                    isSelected
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <button
                    onClick={() => selectAlgorithm(custom.id)}
                    className="flex-1 text-left truncate"
                  >
                    {custom.name}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openCustomModal(custom.id);
                    }}
                    title="Edit Code"
                    className={cn(
                      "p-0.5 rounded-sm opacity-70 hover:opacity-100",
                      isSelected
                        ? "text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Built-in 7 Categories */}
        <div className="space-y-0.5 pt-1 border-t border-sidebar-border">
          <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            Built-in Modules (46)
          </div>

          {filteredCategories.map((category) => {
            const isExpanded =
              searchQuery.trim().length > 0 ||
              !!expandedCategories[category.id];

            return (
              <div key={category.id} className="space-y-0.5">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-left hover:bg-sidebar-accent/60 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {CATEGORY_ICONS[category.id]}
                    <span className="text-xs font-medium text-sidebar-foreground truncate">
                      {category.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {category.algorithms.length}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="ml-3 pl-2.5 border-l border-sidebar-border space-y-0.5 py-0.5">
                    {category.algorithms.map((algo) => {
                      const isSelected =
                        activeView === "visualizer" &&
                        selectedAlgorithmId === algo.id;

                      return (
                        <button
                          key={algo.id}
                          onClick={() => selectAlgorithm(algo.id)}
                          className={cn(
                            "w-full flex items-center justify-between px-2 py-1 rounded-sm text-xs transition-colors",
                            isSelected
                              ? "bg-primary text-primary-foreground font-medium"
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          )}
                        >
                          <span className="truncate">{algo.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Minimal Status Footer */}
      <div className="px-3 py-2.5 border-t border-sidebar-border flex items-center justify-between text-[11px] text-muted-foreground font-mono">
        <span>Step Engine + Proxy</span>
        <span>TypeScript 5</span>
      </div>
    </aside>
  );
}
