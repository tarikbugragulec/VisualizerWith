"use client";

import React, { useEffect, useState } from "react";
import { Check, Code, Moon, Palette, Sun, X } from "lucide-react";
import {
  TweakcnThemeId,
  useVisualizerStore,
} from "@/store/visualizer-store";
import { cn } from "@/lib/utils";

export const TWEAKCN_PRESETS: {
  id: TweakcnThemeId;
  name: string;
  description: string;
  swatches: [string, string, string];
}[] = [
  {
    id: "claude",
    name: "Claude Editorial",
    description: "Warm stone & terracotta",
    swatches: ["#1c1917", "#d97757", "#e7e5e4"],
  },
  {
    id: "vercel",
    name: "Vercel Geist",
    description: "Pure monochrome 1px grid",
    swatches: ["#09090b", "#fafafa", "#27272a"],
  },
  {
    id: "catppuccin",
    name: "Catppuccin",
    description: "Soothing pastel Mocha/Latte",
    swatches: ["#1e1e2e", "#89b4fa", "#a6e3a1"],
  },
  {
    id: "nord",
    name: "Nord Arctic",
    description: "Polar night & frost cyan",
    swatches: ["#2e3440", "#88c0d0", "#a3be8c"],
  },
  {
    id: "neobrutalism",
    name: "Neo-Brutalism",
    description: "Hard borders & offset shadow",
    swatches: ["#fffdf5", "#f25c22", "#141414"],
  },
  {
    id: "monokai",
    name: "Monokai Pro",
    description: "Classic editor warmth",
    swatches: ["#2d2a2e", "#ffd866", "#ff6188"],
  },
];

export function ThemeCustomizer() {
  const { themePreset, colorMode, setThemePreset, toggleColorMode } =
    useVisualizerStore();

  const [openCssModal, setOpenCssModal] = useState(false);
  const [customCssText, setCustomCssText] = useState("");

  // Sync data-theme and dark class on documentElement
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", themePreset);
    if (colorMode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [themePreset, colorMode]);

  const handleApplyRawTweakcnCss = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCssText.trim()) return;
    let styleTag = document.getElementById("tweakcn-custom-override");
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "tweakcn-custom-override";
      document.head.appendChild(styleTag);
    }
    styleTag.textContent = customCssText;
    setOpenCssModal(false);
  };

  const handleClearCustomCss = () => {
    const styleTag = document.getElementById("tweakcn-custom-override");
    if (styleTag) styleTag.remove();
    setCustomCssText("");
  };

  return (
    <div className="flex items-center gap-1.5">
      {/* Preset Selector Pills */}
      <div className="hidden lg:flex items-center gap-1 bg-muted/60 border border-border rounded-md p-0.5">
        <span className="px-2 text-[11px] font-medium text-muted-foreground flex items-center gap-1">
          <Palette className="w-3 h-3" />
          Theme:
        </span>
        {TWEAKCN_PRESETS.map((preset) => {
          const active = themePreset === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => {
                handleClearCustomCss();
                setThemePreset(preset.id);
              }}
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded-sm text-[11px] font-medium transition-colors",
                active
                  ? "bg-background text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="flex items-center -space-x-1">
                {preset.swatches.map((hex, i) => (
                  <span
                    key={i}
                    style={{ backgroundColor: hex }}
                    className="w-2.5 h-2.5 rounded-full border border-border"
                  />
                ))}
              </span>
              <span>{preset.name.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Paste Custom Tweakcn CSS Button */}
      <button
        onClick={() => setOpenCssModal(true)}
        title="Paste custom CSS variables from tweakcn.com"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border bg-card hover:bg-accent text-foreground text-xs font-medium transition-colors"
      >
        <Code className="w-3.5 h-3.5 text-primary" />
        <span className="hidden sm:inline">Tweakcn CSS</span>
      </button>

      {/* Light / Dark Toggle */}
      <button
        onClick={toggleColorMode}
        title={colorMode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        className="p-1.5 rounded-md border border-border bg-card hover:bg-accent text-foreground transition-colors"
      >
        {colorMode === "dark" ? (
          <Sun className="w-4 h-4" />
        ) : (
          <Moon className="w-4 h-4" />
        )}
      </button>

      {/* Modal to Paste Raw Tweakcn CSS */}
      {openCssModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-lg border border-border bg-card text-card-foreground shadow-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-sm font-semibold">
                  Import Tweakcn CSS Variables
                </h3>
                <p className="text-xs text-muted-foreground">
                  Copy any theme CSS from{" "}
                  <a
                    href="https://tweakcn.com/editor/theme"
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-primary"
                  >
                    tweakcn.com/editor/theme
                  </a>{" "}
                  and paste it below, or pick a built-in preset.
                </p>
              </div>
              <button
                onClick={() => setOpenCssModal(false)}
                className="p-1 rounded-md hover:bg-accent text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Built-in Tweakcn Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TWEAKCN_PRESETS.map((preset) => {
                const active = themePreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      handleClearCustomCss();
                      setThemePreset(preset.id);
                    }}
                    className={cn(
                      "flex flex-col items-start p-2.5 rounded-md border text-left transition-all",
                      active
                        ? "border-primary bg-accent/50"
                        : "border-border bg-background hover:bg-accent/30"
                    )}
                  >
                    <div className="w-full flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold">
                        {preset.name}
                      </span>
                      {active && <Check className="w-3.5 h-3.5 text-primary" />}
                    </div>
                    <span className="text-[10px] text-muted-foreground mb-2">
                      {preset.description}
                    </span>
                    <div className="flex items-center gap-1">
                      {preset.swatches.map((hex, i) => (
                        <span
                          key={i}
                          style={{ backgroundColor: hex }}
                          className="w-4 h-4 rounded-sm border border-border"
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleApplyRawTweakcnCss} className="space-y-3">
              <label className="block text-xs font-medium text-muted-foreground">
                Or paste raw <code className="text-foreground">:root / .dark</code> CSS from Tweakcn:
              </label>
              <textarea
                rows={6}
                value={customCssText}
                onChange={(e) => setCustomCssText(e.target.value)}
                placeholder={`:root {\n  --background: 0 0% 100%;\n  --foreground: 240 10% 3.9%;\n  --primary: 16 64% 56%;\n  ...\n}`}
                className="w-full rounded-md border border-input bg-background p-2.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpenCssModal(false)}
                  className="px-3 py-1.5 rounded-md border border-border bg-background hover:bg-accent text-xs font-medium"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90 text-xs font-semibold"
                >
                  Apply Custom CSS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

