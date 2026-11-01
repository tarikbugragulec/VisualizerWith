import { StepEngine } from "./step-engine";
import { AlgorithmDefinition, AlgorithmStep } from "@/types/algorithm";

export interface CustomAlgorithmRecord {
  id: string;
  name: string;
  shortDescription: string;
  timeComplexity: string;
  spaceComplexity: string;
  code: string;
  createdAt: number;
}

export interface CustomAlgorithmTemplate {
  name: string;
  shortDescription: string;
  timeComplexity: string;
  spaceComplexity: string;
  code: string;
}

export const CUSTOM_ALGORITHM_TEMPLATES: CustomAlgorithmTemplate[] = [
  {
    name: "Shell Sort (Gap Sequence)",
    shortDescription:
      "Generalizes Insertion Sort by comparing and swapping elements separated by shrinking gap intervals.",
    timeComplexity: "O(n log² n)",
    spaceComplexity: "O(1)",
    code: `// You can use plain array A[i] OR helper methods: compare(i, j, line?, msg?), swap(i, j, line?, msg?), setPivot(i), markSorted(i)
const n = A.length;
for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
  for (let i = gap; i < n; i++) {
    let j = i;
    setPivot(j, 6, \`Inserting A[\${j}] with gap = \${gap}\`);
    while (j >= gap && compare(j - gap, j, 7, \`Gap=\${gap}: Compare A[\${j - gap}] and A[\${j}]\`) > 0) {
      swap(j - gap, j, 8, \`Gap=\${gap}: Swap A[\${j - gap}] ↔ A[\${j}]\`);
      j -= gap;
    }
  }
}`,
  },
  {
    name: "Cocktail Shaker Sort",
    shortDescription:
      "Bidirectional Bubble Sort that alternates left-to-right and right-to-left passes to eliminate turtles.",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    code: `let start = 0;
let end = A.length - 1;
let swapped = true;

while (swapped) {
  swapped = false;
  for (let i = start; i < end; i++) {
    if (compare(i, i + 1, 8, \`Forward pass: Compare A[\${i}] & A[\${i + 1}]\`) > 0) {
      swap(i, i + 1, 9, \`Forward swap A[\${i}] ↔ A[\${i + 1}]\`);
      swapped = true;
    }
  }
  markSorted(end, 13, \`Largest unsorted locked at \${end}\`);
  if (!swapped) break;
  swapped = false;
  end--;

  for (let i = end - 1; i >= start; i--) {
    if (compare(i, i + 1, 19, \`Backward pass: Compare A[\${i}] & A[\${i + 1}]\`) > 0) {
      swap(i, i + 1, 20, \`Backward swap A[\${i}] ↔ A[\${i + 1}]\`);
      swapped = true;
    }
  }
  markSorted(start, 24, \`Smallest unsorted locked at \${start}\`);
  start++;
}`,
  },
  {
    name: "Gnome Sort (Zero-API Proxy)",
    shortDescription:
      "Written using 100% standard JavaScript A[i] syntax — reads and writes are captured automatically via Proxy!",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    code: `// Pure standard JS! Just read & write A[i] directly:
let pos = 0;
while (pos < A.length) {
  if (pos === 0 || A[pos] >= A[pos - 1]) {
    pos++;
  } else {
    // Direct destructuring swap on A[] is automatically animated!
    const tmp = A[pos];
    A[pos] = A[pos - 1];
    A[pos - 1] = tmp;
    pos--;
  }
}`,
  },
  {
    name: "Odd-Even (Brick) Sort",
    shortDescription:
      "Alternates between comparing odd-indexed adjacent pairs and even-indexed adjacent pairs.",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    code: `let sorted = false;
const n = A.length;

while (!sorted) {
  sorted = true;
  // Odd phase
  for (let i = 1; i <= n - 2; i += 2) {
    if (compare(i, i + 1, 8, \`Odd phase: Compare A[\${i}] & A[\${i + 1}]\`) > 0) {
      swap(i, i + 1, 9);
      sorted = false;
    }
  }
  // Even phase
  for (let i = 0; i <= n - 2; i += 2) {
    if (compare(i, i + 1, 15, \`Even phase: Compare A[\${i}] & A[\${i + 1}]\`) > 0) {
      swap(i, i + 1, 16);
      sorted = false;
    }
  }
}`,
  },
];

const MAX_GUARD_STEPS = 2500;

export function executeCustomAlgorithmCode(
  code: string,
  initialValues: number[]
): { steps: AlgorithmStep[]; error?: string } {
  const engine = new StepEngine(initialValues);
  let stepCounter = 0;
  let lastReadIndex: number | null = null;

  const checkGuard = () => {
    stepCounter++;
    if (stepCounter > MAX_GUARD_STEPS) {
      throw new Error(
        `Step limit exceeded (${MAX_GUARD_STEPS} steps). Check your loops for infinite conditions.`
      );
    }
  };

  // Explicit helper functions available in the user's script scope
  const compare = (
    i: number,
    j: number,
    line = 1,
    description?: string
  ): number => {
    checkGuard();
    return engine.compare(i, j, line, description);
  };

  const swap = (
    i: number,
    j: number,
    line = 1,
    description?: string
  ): void => {
    checkGuard();
    engine.swap(i, j, line, description);
  };

  const setPivot = (
    i: number | undefined,
    line = 1,
    description?: string
  ): void => {
    checkGuard();
    engine.setPivot(i, line, description);
  };

  const markSorted = (
    indices: number | number[],
    line = 1,
    description?: string
  ): void => {
    checkGuard();
    engine.markSorted(indices, line, description);
  };

  const overwrite = (
    index: number,
    val: number,
    line = 1,
    description?: string
  ): void => {
    checkGuard();
    engine.overwrite(index, val, line, description);
  };

  // Automatic JavaScript Proxy over A[] so plain A[i] > A[j] and A[i] = val also animate!
  const rawLen = initialValues.length;
  const proxyTarget = [...initialValues];

  const A = new Proxy(proxyTarget, {
    get(target, prop) {
      if (prop === "length") return rawLen;
      if (typeof prop === "string") {
        const idx = Number(prop);
        if (Number.isInteger(idx) && idx >= 0 && idx < rawLen) {
          const val = engine.peekValue(idx);
          if (lastReadIndex !== null && lastReadIndex !== idx) {
            checkGuard();
            engine.compare(
              lastReadIndex,
              idx,
              1,
              `Auto-tracked read comparison A[${lastReadIndex}] vs A[${idx}]`
            );
            lastReadIndex = null;
          } else {
            lastReadIndex = idx;
          }
          return val;
        }
      }
      const value = Reflect.get(target, prop);
      return typeof value === "function" ? value.bind(target) : value;
    },
    set(_target, prop, newValue) {
      if (typeof prop === "string") {
        const idx = Number(prop);
        const numericVal = Number(newValue);
        if (
          Number.isInteger(idx) &&
          idx >= 0 &&
          idx < rawLen &&
          Number.isFinite(numericVal)
        ) {
          lastReadIndex = null;
          if (engine.peekValue(idx) !== numericVal) {
            checkGuard();
            engine.overwrite(
              idx,
              numericVal,
              1,
              `Auto-tracked write A[${idx}] ← ${numericVal}`
            );
          }
          return true;
        }
      }
      return true;
    },
  });

  try {
    const runner = new Function(
      "A",
      "engine",
      "compare",
      "swap",
      "setPivot",
      "markSorted",
      "overwrite",
      `"use strict";\n${code}`
    );

    runner(A, engine, compare, swap, setPivot, markSorted, overwrite);
    const steps = engine.complete(code.split("\n").length);
    return { steps };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown execution error";
    const fallbackSteps = engine.complete(1);
    return { steps: fallbackSteps, error: message };
  }
}

export function convertCustomRecordToDefinition(
  record: CustomAlgorithmRecord
): AlgorithmDefinition {
  const lines = record.code.split("\n");
  return {
    id: record.id,
    name: record.name,
    category: "sorting",
    shortDescription: record.shortDescription,
    description: `${record.shortDescription} (User-defined custom algorithm running inside the StepEngine + Proxy sandbox.)`,
    complexity: {
      timeBest: record.timeComplexity,
      timeAverage: record.timeComplexity,
      timeWorst: record.timeComplexity,
      spaceWorst: record.spaceComplexity,
      stable: true,
      inPlace: true,
    },
    codeLines: lines,
    keyTakeaways: [
      "Custom algorithm authored in the interactive TypeScript/JS Playground.",
      "Supports both direct A[i] Proxy tracking and explicit compare() / swap() calls.",
    ],
    implemented: true,
    generateSteps: (initialValues: number[]) => {
      const res = executeCustomAlgorithmCode(record.code, initialValues);
      return res.steps;
    },
  };
}

