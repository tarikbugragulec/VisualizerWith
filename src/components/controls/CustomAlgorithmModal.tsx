"use client";

import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Code2,
  Play,
  Trash2,
  X,
} from "lucide-react";
import {
  CUSTOM_ALGORITHM_TEMPLATES,
  executeCustomAlgorithmCode,
} from "@/engine/custom-runner";
import { useVisualizerStore } from "@/store/visualizer-store";

export function CustomAlgorithmModal() {
  const {
    isCustomModalOpen,
    editingCustomId,
    customAlgorithms,
    initialArray,
    closeCustomModal,
    saveCustomAlgorithm,
    deleteCustomAlgorithm,
  } = useVisualizerStore();

  const existing = customAlgorithms.find((c) => c.id === editingCustomId);

  const [name, setName] = useState(
    existing?.name ?? CUSTOM_ALGORITHM_TEMPLATES[0].name
  );
  const [shortDescription, setShortDescription] = useState(
    existing?.shortDescription ?? CUSTOM_ALGORITHM_TEMPLATES[0].shortDescription
  );
  const [timeComplexity, setTimeComplexity] = useState(
    existing?.timeComplexity ?? CUSTOM_ALGORITHM_TEMPLATES[0].timeComplexity
  );
  const [spaceComplexity, setSpaceComplexity] = useState(
    existing?.spaceComplexity ?? CUSTOM_ALGORITHM_TEMPLATES[0].spaceComplexity
  );
  const [code, setCode] = useState(
    existing?.code ?? CUSTOM_ALGORITHM_TEMPLATES[0].code
  );
  const [testResult, setTestResult] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (existing) {
      setName(existing.name);
      setShortDescription(existing.shortDescription);
      setTimeComplexity(existing.timeComplexity);
      setSpaceComplexity(existing.spaceComplexity);
      setCode(existing.code);
    } else {
      setName(CUSTOM_ALGORITHM_TEMPLATES[0].name);
      setShortDescription(CUSTOM_ALGORITHM_TEMPLATES[0].shortDescription);
      setTimeComplexity(CUSTOM_ALGORITHM_TEMPLATES[0].timeComplexity);
      setSpaceComplexity(CUSTOM_ALGORITHM_TEMPLATES[0].spaceComplexity);
      setCode(CUSTOM_ALGORITHM_TEMPLATES[0].code);
    }
    setTestResult(null);
  }, [existing, isCustomModalOpen]);

  if (!isCustomModalOpen) return null;

  const handleLoadTemplate = (idx: number) => {
    const tpl = CUSTOM_ALGORITHM_TEMPLATES[idx];
    setName(tpl.name);
    setShortDescription(tpl.shortDescription);
    setTimeComplexity(tpl.timeComplexity);
    setSpaceComplexity(tpl.spaceComplexity);
    setCode(tpl.code);
    setTestResult(null);
  };

  const handleDryRun = () => {
    const res = executeCustomAlgorithmCode(code, initialArray);
    if (res.error) {
      setTestResult({ ok: false, message: res.error });
    } else {
      setTestResult({
        ok: true,
        message: `Compiled & verified! Generated ${res.steps.length} visualization steps on [${initialArray.length} elements].`,
      });
    }
  };

  const handleSaveAndRun = (e: React.FormEvent) => {
    e.preventDefault();
    const res = executeCustomAlgorithmCode(code, initialArray);
    if (res.error) {
      setTestResult({ ok: false, message: res.error });
      return;
    }

    saveCustomAlgorithm({
      id: existing?.id,
      name,
      shortDescription,
      timeComplexity,
      spaceComplexity,
      code,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl max-h-[90vh] rounded-lg border border-border bg-card text-card-foreground shadow-lg flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-primary" />
            <div>
              <h2 className="text-sm font-bold text-foreground">
                {existing
                  ? `Edit Custom Algorithm: ${existing.name}`
                  : "Custom Algorithm Studio (JS / TypeScript Sandbox)"}
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Write standard <code className="text-foreground">A[i]</code> array code (auto-tracked via Proxy) or call{" "}
                <code className="text-foreground">compare(i, j)</code> &{" "}
                <code className="text-foreground">swap(i, j)</code>.
              </p>
            </div>
          </div>
          <button
            onClick={closeCustomModal}
            className="p-1 rounded-md hover:bg-accent text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSaveAndRun}
          className="flex-1 overflow-y-auto p-5 space-y-4"
        >
          {/* Starter Templates Bar */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
              Load Ready-to-Run Template:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {CUSTOM_ALGORITHM_TEMPLATES.map((tpl, i) => (
                <button
                  key={tpl.name}
                  type="button"
                  onClick={() => handleLoadTemplate(i)}
                  className="px-2.5 py-1 rounded-sm border border-border bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground text-xs font-medium transition-colors"
                >
                  {tpl.name}
                </button>
              ))}
            </div>
          </div>

          {/* Metadata Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Algorithm Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Shell Sort"
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Time Complexity
              </label>
              <input
                type="text"
                value={timeComplexity}
                onChange={(e) => setTimeComplexity(e.target.value)}
                placeholder="O(n²)"
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Space Complexity
              </label>
              <input
                type="text"
                value={spaceComplexity}
                onChange={(e) => setSpaceComplexity(e.target.value)}
                placeholder="O(1)"
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Short Description
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* Code Editor */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground">
                Algorithm Implementation
              </label>
              <span className="text-[10px] font-mono text-muted-foreground">
                Scope: A[], compare(i,j,line,msg), swap(i,j,line,msg), setPivot(i), markSorted(i), overwrite(i,val)
              </span>
            </div>
            <textarea
              rows={13}
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setTestResult(null);
              }}
              spellCheck={false}
              className="w-full rounded-md border border-input bg-background p-3 text-xs font-mono leading-relaxed text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* Dry-Run Status Alert */}
          {testResult && (
            <div
              className={`rounded-md border p-3 flex items-center gap-2 text-xs font-mono ${
                testResult.ok
                  ? "border-border bg-secondary text-secondary-foreground"
                  : "border-destructive bg-destructive/10 text-destructive"
              }`}
            >
              {testResult.ok ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-2 border-t border-border flex flex-wrap items-center justify-between gap-2">
            <div>
              {existing && (
                <button
                  type="button"
                  onClick={() => {
                    deleteCustomAlgorithm(existing.id);
                    closeCustomModal();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-destructive/40 text-destructive hover:bg-destructive/10 text-xs font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Algorithm
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDryRun}
                className="px-3 py-1.5 rounded-md border border-border bg-background hover:bg-accent text-xs font-medium text-foreground"
              >
                Test Dry-Run
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90 text-xs font-semibold"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Save & Visualize Now
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

