export type CategoryId =
  | "sorting"
  | "searching"
  | "linear"
  | "trees"
  | "graphs"
  | "dynamic-programming"
  | "other";

export type ElementState =
  | "default"
  | "comparing"
  | "swapping"
  | "sorted"
  | "pivot"
  | "overwrite"
  | "target"
  | "bucket";

export interface ArrayBar {
  id: string;
  value: number;
  state: ElementState;
  label?: string;
}

export interface LinearNodeItem {
  id: string;
  value: number | string;
  state: ElementState;
  label?: string;
  subLabel?: string;
}

export interface TreeNodeItem {
  id: string;
  label: string;
  subLabel?: string;
  x: number; // 0 to 100 percentage
  y: number; // 0 to 100 percentage
  state: ElementState;
}

export interface TreeEdgeItem {
  from: string;
  to: string;
  label?: string;
  state: "default" | "active" | "sorted";
}

export interface GraphNodeItem {
  id: string;
  label: string;
  distance?: string;
  x: number; // 0 to 100 percentage
  y: number; // 0 to 100 percentage
  state: ElementState;
}

export interface GraphEdgeItem {
  from: string;
  to: string;
  weight?: number;
  directed?: boolean;
  state: "default" | "comparing" | "sorted" | "swapping";
}

export interface DPGridCell {
  value: string | number;
  state: ElementState;
}

export interface DPGridData {
  title?: string;
  rowHeaders: string[];
  colHeaders: string[];
  cells: DPGridCell[][];
}

export interface StepMetrics {
  comparisons: number;
  swaps: number;
  arrayAccesses: number;
}

export type StepOperationType =
  | "init"
  | "compare"
  | "swap"
  | "overwrite"
  | "pivot"
  | "mark-sorted"
  | "bucket"
  | "complete";

export interface AlgorithmStep {
  stepIndex: number;
  type: StepOperationType;
  array: ArrayBar[];
  highlightedIndices: number[];
  sortedIndices: number[];
  pivotIndex?: number;
  auxiliaryBuckets?: { label: string; values: (number | string)[] }[];
  linearData?: {
    mode:
      | "array"
      | "dynamic-array"
      | "singly-linked"
      | "doubly-linked"
      | "stack"
      | "queue"
      | "deque";
    capacity?: number;
    nodes: LinearNodeItem[];
  };
  treeData?: {
    nodes: TreeNodeItem[];
    edges: TreeEdgeItem[];
    traversalOrder?: string[];
  };
  graphData?: {
    nodes: GraphNodeItem[];
    edges: GraphEdgeItem[];
    frontierLabel?: string;
    frontier?: string[];
  };
  dpGridData?: DPGridData;
  codeLine: number;
  title: string;
  description: string;
  metrics: StepMetrics;
}

export interface ComplexityInfo {
  timeBest: string;
  timeAverage: string;
  timeWorst: string;
  spaceWorst: string;
  stable: boolean;
  inPlace: boolean;
}

export interface AlgorithmDefinition {
  id: string;
  name: string;
  category: CategoryId;
  shortDescription: string;
  description: string;
  complexity: ComplexityInfo;
  codeLines: string[];
  keyTakeaways: string[];
  implemented: boolean;
  generateSteps?: (initialValues: number[]) => AlgorithmStep[];
}

export interface CategoryDefinition {
  id: CategoryId;
  name: string;
  badge: string;
  description: string;
  visualizerType: "array" | "linear" | "tree" | "graph" | "dp-grid";
  algorithms: {
    id: string;
    name: string;
    implemented: boolean;
    difficulty: "Easy" | "Medium" | "Hard";
  }[];
}
