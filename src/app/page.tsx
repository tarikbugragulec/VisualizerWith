"use client";

import React from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { VisualizerWorkspace } from "@/components/dashboard/VisualizerWorkspace";
import { CustomAlgorithmModal } from "@/components/controls/CustomAlgorithmModal";
import { useVisualizerStore } from "@/store/visualizer-store";

export default function HomePage() {
  const { activeView } = useVisualizerStore();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {activeView === "dashboard" ? (
          <DashboardOverview />
        ) : (
          <VisualizerWorkspace />
        )}
      </main>
      <CustomAlgorithmModal />
    </div>
  );
}
