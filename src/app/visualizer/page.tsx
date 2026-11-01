"use client";

import React, { useEffect } from "react";
import HomePage from "../page";
import { useVisualizerStore } from "@/store/visualizer-store";

export default function VisualizerRoutePage() {
  const { setActiveView } = useVisualizerStore();

  useEffect(() => {
    setActiveView("visualizer");
  }, [setActiveView]);

  return <HomePage />;
}

