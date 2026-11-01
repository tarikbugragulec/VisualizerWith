import { AlgorithmStep, StepOperationType } from "@/types/algorithm";

export interface StepHistorySummary {
  totalSteps: number;
  totalComparisons: number;
  totalSwaps: number;
  totalAccesses: number;
  operationBreakdown: Record<StepOperationType, number>;
}

export function summarizeStepHistory(
  steps: AlgorithmStep[]
): StepHistorySummary {
  const breakdown: Record<StepOperationType, number> = {
    init: 0,
    compare: 0,
    swap: 0,
    overwrite: 0,
    pivot: 0,
    "mark-sorted": 0,
    bucket: 0,
    complete: 0,
  };

  for (const step of steps) {
    breakdown[step.type] = (breakdown[step.type] ?? 0) + 1;
  }

  const lastStep = steps[steps.length - 1];

  return {
    totalSteps: steps.length,
    totalComparisons: lastStep?.metrics.comparisons ?? 0,
    totalSwaps: lastStep?.metrics.swaps ?? 0,
    totalAccesses: lastStep?.metrics.arrayAccesses ?? 0,
    operationBreakdown: breakdown,
  };
}

export function findNextStepByType(
  steps: AlgorithmStep[],
  currentIndex: number,
  types: StepOperationType[]
): number {
  const typeSet = new Set(types);
  for (let i = currentIndex + 1; i < steps.length; i++) {
    if (typeSet.has(steps[i].type)) {
      return i;
    }
  }
  return steps.length - 1;
}

export function findPrevStepByType(
  steps: AlgorithmStep[],
  currentIndex: number,
  types: StepOperationType[]
): number {
  const typeSet = new Set(types);
  for (let i = currentIndex - 1; i >= 0; i--) {
    if (typeSet.has(steps[i].type)) {
      return i;
    }
  }
  return 0;
}

