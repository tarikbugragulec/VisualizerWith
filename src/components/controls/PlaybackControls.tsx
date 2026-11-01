"use client";

import React, { useEffect, useState } from "react";
import {
  FastForward,
  Pause,
  Play,
  RotateCcw,
  Shuffle,
  SkipBack,
  SkipForward,
  SlidersHorizontal,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useVisualizerStore } from "@/store/visualizer-store";
import {
  ArrayPresetType,
  getIntervalFromSpeed,
  SPEED_PRESETS,
} from "@/engine/playback";
import { findNextStepByType } from "@/engine/history";
import { cn } from "@/lib/utils";

export function PlaybackControls() {
  const {
    steps,
    currentStepIndex,
    isPlaying,
    speedMultiplier,
    arraySize,
    presetType,
    initialArray,
    soundEnabled,
    togglePlay,
    pause,
    stepForward,
    stepBackward,
    goToStep,
    resetToStart,
    setSpeed,
    setArraySize,
    generateNewArray,
    setCustomArray,
    toggleSound,
  } = useVisualizerStore();

  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customText, setCustomText] = useState(initialArray.join(", "));

  useEffect(() => {
    setCustomText(initialArray.join(", "));
  }, [initialArray]);

  useEffect(() => {
    if (!isPlaying) return;
    if (currentStepIndex >= steps.length - 1) {
      pause();
      return;
    }

    const intervalMs = getIntervalFromSpeed(speedMultiplier);
    const timer = setTimeout(() => {
      stepForward();
    }, intervalMs);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps.length, speedMultiplier, stepForward, pause]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        pause();
        stepForward();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        stepBackward();
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        resetToStart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, pause, stepForward, stepBackward, resetToStart]);

  const handleApplyCustomArray = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = customText
      .split(/[\s,]+/)
      .map((s) => Number(s.trim()))
      .filter((n) => !Number.isNaN(n) && n > 0);
    if (parsed.length >= 2) {
      setCustomArray(parsed);
      setShowCustomInput(false);
    }
  };

  const handleJumpNextSwap = () => {
    pause();
    const nextIdx = findNextStepByType(steps, currentStepIndex, [
      "swap",
      "overwrite",
      "complete",
    ]);
    goToStep(nextIdx);
  };

  const progressPct =
    steps.length > 1
      ? Math.round((currentStepIndex / (steps.length - 1)) * 100)
      : 0;

  return (
    <div className="rounded-lg border border-border bg-card text-card-foreground shadow-theme p-3.5 space-y-3">
      {/* Timeline Scrubber */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">
              STEP {currentStepIndex} / {Math.max(0, steps.length - 1)}
            </span>
            <span className="text-muted-foreground">({progressPct}%)</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-muted-foreground">
            <kbd className="px-1.5 py-0.2 rounded-sm bg-muted border border-border text-foreground text-[10px]">
              Space
            </kbd>
            <span>Play</span>
            <kbd className="px-1.5 py-0.2 rounded-sm bg-muted border border-border text-foreground text-[10px]">
              ← / →
            </kbd>
            <span>Step</span>
          </div>
        </div>

        <input
          type="range"
          min={0}
          max={Math.max(0, steps.length - 1)}
          value={currentStepIndex}
          onChange={(e) => {
            pause();
            goToStep(Number(e.target.value));
          }}
          className="w-full h-1.5 bg-secondary rounded-sm appearance-none cursor-pointer accent-primary"
        />
      </div>

      {/* Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Playback Transport */}
        <div className="flex items-center gap-1">
          <button
            onClick={resetToStart}
            title="Reset to Step 0 (R)"
            className="p-1.5 rounded-md border border-border bg-background hover:bg-accent text-foreground transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={stepBackward}
            disabled={currentStepIndex <= 0}
            title="Step Backward (←)"
            className="p-1.5 rounded-md border border-border bg-background hover:bg-accent text-foreground disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={togglePlay}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90 font-medium text-xs transition-opacity"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                {currentStepIndex >= steps.length - 1 && steps.length > 1
                  ? "Replay"
                  : "Play"}
              </>
            )}
          </button>

          <button
            onClick={() => {
              pause();
              stepForward();
            }}
            disabled={currentStepIndex >= steps.length - 1}
            title="Step Forward (→)"
            className="p-1.5 rounded-md border border-border bg-background hover:bg-accent text-foreground disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleJumpNextSwap}
            disabled={currentStepIndex >= steps.length - 1}
            title="Jump to Next Swap / Write"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-border bg-background hover:bg-accent text-foreground disabled:opacity-40 disabled:pointer-events-none text-xs transition-colors"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Next Swap</span>
          </button>

          <button
            onClick={toggleSound}
            title={soundEnabled ? "Mute Audio" : "Enable Audio"}
            className={cn(
              "p-1.5 rounded-md border transition-colors",
              soundEnabled
                ? "border-primary bg-primary/15 text-primary"
                : "border-border bg-background hover:bg-accent text-muted-foreground"
            )}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Center: Speed Selector */}
        <div className="flex items-center gap-0.5 bg-muted/60 border border-border rounded-md p-0.5">
          {SPEED_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => setSpeed(preset.multiplier)}
              className={cn(
                "px-2 py-1 rounded-sm text-[11px] font-mono font-medium transition-colors",
                speedMultiplier === preset.multiplier
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Right: Array Size & Preset Controls */}
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex items-center gap-2 bg-background border border-border rounded-md px-2.5 py-1">
            <span className="text-[11px] text-muted-foreground font-mono">
              N={arraySize}
            </span>
            <input
              type="range"
              min={6}
              max={40}
              value={arraySize}
              onChange={(e) => setArraySize(Number(e.target.value))}
              className="w-16 h-1.5 bg-secondary rounded-sm appearance-none cursor-pointer accent-primary"
            />
          </div>

          <div className="flex items-center gap-0.5 bg-muted/60 border border-border rounded-md p-0.5">
            {(
              [
                { id: "random", label: "Random" },
                { id: "nearly-sorted", label: "Nearly" },
                { id: "reversed", label: "Reversed" },
                { id: "few-unique", label: "Duplicates" },
              ] as { id: ArrayPresetType; label: string }[]
            ).map((p) => (
              <button
                key={p.id}
                onClick={() => generateNewArray(p.id)}
                className={cn(
                  "px-2 py-1 rounded-sm text-[11px] font-medium transition-colors",
                  presetType === p.id
                    ? "bg-background text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => generateNewArray()}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-border bg-background hover:bg-accent text-xs font-medium text-foreground transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5" />
            Shuffle
          </button>

          <button
            onClick={() => setShowCustomInput((prev) => !prev)}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1.5 rounded-md border text-xs font-medium transition-colors",
              showCustomInput
                ? "border-primary bg-accent text-foreground"
                : "border-border bg-background hover:bg-accent text-foreground"
            )}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Custom
          </button>
        </div>
      </div>

      {/* Custom Input Row */}
      {showCustomInput && (
        <form
          onSubmit={handleApplyCustomArray}
          className="pt-2 border-t border-border flex flex-wrap items-center gap-2"
        >
          <span className="text-xs text-muted-foreground">
            Array values:
          </span>
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="64, 34, 25, 12, 22, 11, 90"
            className="flex-1 min-w-[200px] bg-background border border-input rounded-md px-2.5 py-1 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <button
            type="submit"
            className="px-3 py-1 rounded-md bg-primary text-primary-foreground text-xs font-medium"
          >
            Apply
          </button>
        </form>
      )}
    </div>
  );
}
