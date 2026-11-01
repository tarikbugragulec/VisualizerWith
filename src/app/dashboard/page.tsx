"use client";

import React, { useEffect } from "react";
import HomePage from "../page";
import { useVisualizerStore } from "@/store/visualizer-store";

export default function DashboardRoutePage() {
  const { setActiveView } = useVisualizerStore();

  useEffect(() => {
    setActiveView("dashboard");
  }, [setActiveView]);

  return <HomePage />;
}

