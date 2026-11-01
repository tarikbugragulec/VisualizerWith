import { AlgorithmDefinition } from "@/types/algorithm";
import { bubbleSortDefinition } from "./bubble-sort";
import { selectionSortDefinition } from "./selection-sort";
import { insertionSortDefinition } from "./insertion-sort";
import { mergeSortDefinition } from "./merge-sort";
import { quickSortDefinition } from "./quick-sort";
import { heapSortDefinition } from "./heap-sort";
import { countingSortDefinition } from "./counting-sort";
import { radixSortDefinition } from "./radix-sort";

export const SORTING_ALGORITHMS: AlgorithmDefinition[] = [
  bubbleSortDefinition,
  selectionSortDefinition,
  insertionSortDefinition,
  mergeSortDefinition,
  quickSortDefinition,
  heapSortDefinition,
  countingSortDefinition,
  radixSortDefinition,
];

export const SORTING_ALGORITHMS_MAP: Record<string, AlgorithmDefinition> =
  Object.fromEntries(SORTING_ALGORITHMS.map((algo) => [algo.id, algo]));

