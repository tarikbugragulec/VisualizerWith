import {
  AlgorithmDefinition,
  AlgorithmStep,
  ArrayBar,
} from "@/types/algorithm";

function makeBars(
  values: number[],
  states: Record<number, ArrayBar["state"]> = {}
): ArrayBar[] {
  return values.map((v, i) => ({
    id: `paradigm-bar-${i}-${v}`,
    value: v,
    state: states[i] ?? "default",
  }));
}

export const OTHER_ALGORITHMS: AlgorithmDefinition[] = [
  {
    id: "recursion-tree",
    name: "Recursion Call Stack",
    category: "other",
    shortDescription:
      "Visualizes LIFO activation frames pushed during recursive descent and popped upon base-case return.",
    description:
      "Every recursive call allocates a stack frame holding local parameters and return addresses. Watching the call tree expand down to base cases and unwind upward demystifies recursion and divide-and-conquer.",
    complexity: {
      timeBest: "O(n)",
      timeAverage: "O(n)",
      timeWorst: "O(n)",
      spaceWorst: "O(n) Stack",
      stable: true,
      inPlace: false,
    },
    codeLines: [
      "function factorial(n: number): number {",
      "  if (n <= 1) return 1; // Base case",
      "  const sub = factorial(n - 1); // Push call frame",
      "  return n * sub; // Unwind & multiply",
      "}",
    ],
    keyTakeaways: [
      "Each recursive call pushes a frame onto the call stack until the base case is hit.",
      "Deep recursion without a base case triggers a Stack Overflow.",
    ],
    implemented: true,
    generateSteps: () => [
      {
        stepIndex: 0,
        type: "init",
        array: [],
        highlightedIndices: [],
        sortedIndices: [],
        linearData: {
          mode: "stack",
          nodes: [
            { id: "f4", value: "fact(4)", state: "comparing", label: "Frame 1" },
            { id: "f3", value: "fact(3)", state: "comparing", label: "Frame 2" },
            { id: "f2", value: "fact(2)", state: "comparing", label: "Frame 3" },
            { id: "f1", value: "fact(1)=1", state: "pivot", label: "BASE CASE" },
          ],
        },
        codeLine: 2,
        title: "Recursive Descent Reaches Base Case fact(1) = 1",
        description: "4 stack frames active on the LIFO call stack.",
        metrics: { comparisons: 4, swaps: 0, arrayAccesses: 4 },
      },
      {
        stepIndex: 1,
        type: "complete",
        array: [],
        highlightedIndices: [],
        sortedIndices: [],
        linearData: {
          mode: "stack",
          nodes: [
            { id: "r1", value: "1! = 1", state: "sorted", label: "ret 1" },
            { id: "r2", value: "2 * 1 = 2", state: "sorted", label: "ret 2" },
            { id: "r3", value: "3 * 2 = 6", state: "sorted", label: "ret 6" },
            { id: "r4", value: "4 * 6 = 24", state: "sorted", label: "RESULT" },
          ],
        },
        codeLine: 4,
        title: "Unwind Call Stack: 4 × 3 × 2 × 1 = 24",
        description: "Each frame multiplies its parameter n by the child return value and pops.",
        metrics: { comparisons: 4, swaps: 4, arrayAccesses: 8 },
      },
    ],
  },
  {
    id: "backtracking",
    name: "N-Queens Backtracking",
    category: "other",
    shortDescription:
      "Places N queens on an N×N chessboard row by row, pruning attacked columns and diagonals.",
    description:
      "N-Queens exemplifies constraint satisfaction with backtracking: it places a queen in a safe column of row r and recurses to r+1. If a row has zero safe squares, it backtracks and moves the previous row's queen.",
    complexity: {
      timeBest: "O(N!)",
      timeAverage: "O(N!)",
      timeWorst: "O(N!)",
      spaceWorst: "O(N)",
      stable: true,
      inPlace: true,
    },
    codeLines: [
      "function solve(row: number): boolean {",
      "  if (row === N) return true; // All 4 queens placed!",
      "  for (let col = 0; col < N; col++) {",
      "    if (isSafe(row, col)) {",
      "      placeQueen(row, col);",
      "      if (solve(row + 1)) return true;",
      "      removeQueen(row, col); // Backtrack!",
      "    }",
      "  }",
      "}",
    ],
    keyTakeaways: [
      "Prunes entire invalid subtrees immediately when a column or diagonal conflict is detected.",
    ],
    implemented: true,
    generateSteps: () => [
      {
        stepIndex: 0,
        type: "compare",
        array: [],
        highlightedIndices: [],
        sortedIndices: [],
        dpGridData: {
          title: "4-Queens Board — Conflict & Backtrack at Row 2",
          rowHeaders: ["Row 0", "Row 1", "Row 2", "Row 3"],
          colHeaders: ["Col 0", "Col 1", "Col 2", "Col 3"],
          cells: [
            [{ value: "♛", state: "pivot" }, { value: "·", state: "default" }, { value: "·", state: "default" }, { value: "·", state: "default" }],
            [{ value: "×", state: "default" }, { value: "×", state: "default" }, { value: "♛", state: "pivot" }, { value: "·", state: "default" }],
            [{ value: "×", state: "swapping" }, { value: "×", state: "swapping" }, { value: "×", state: "swapping" }, { value: "×", state: "swapping" }],
            [{ value: "·", state: "default" }, { value: "·", state: "default" }, { value: "·", state: "default" }, { value: "·", state: "default" }],
          ],
        },
        codeLine: 7,
        title: "Dead End at Row 2 — Trigger Backtrack!",
        description: "All 4 squares in Row 2 are attacked by Queens at (0,0) and (1,2). Backtracking!",
        metrics: { comparisons: 6, swaps: 2, arrayAccesses: 8 },
      },
      {
        stepIndex: 1,
        type: "complete",
        array: [],
        highlightedIndices: [],
        sortedIndices: [],
        dpGridData: {
          title: "Valid 4-Queens Solution Found!",
          rowHeaders: ["Row 0", "Row 1", "Row 2", "Row 3"],
          colHeaders: ["Col 0", "Col 1", "Col 2", "Col 3"],
          cells: [
            [{ value: "·", state: "default" }, { value: "♛", state: "sorted" }, { value: "·", state: "default" }, { value: "·", state: "default" }],
            [{ value: "·", state: "default" }, { value: "·", state: "default" }, { value: "·", state: "default" }, { value: "♛", state: "sorted" }],
            [{ value: "♛", state: "sorted" }, { value: "·", state: "default" }, { value: "·", state: "default" }, { value: "·", state: "default" }],
            [{ value: "·", state: "default" }, { value: "·", state: "default" }, { value: "♛", state: "sorted" }, { value: "·", state: "default" }],
          ],
        },
        codeLine: 2,
        title: "4 Non-Attacking Queens Placed at (0,1), (1,3), (2,0), (3,2)",
        description: "No two queens share a row, column, or diagonal!",
        metrics: { comparisons: 12, swaps: 4, arrayAccesses: 16 },
      },
    ],
  },
  {
    id: "greedy",
    name: "Activity Selection (Greedy)",
    category: "other",
    shortDescription:
      "Sorts intervals by earliest finish time and greedily picks non-overlapping activities.",
    description:
      "By always choosing the compatible interval that finishes earliest, Activity Selection leaves the maximum remaining time for future intervals, provably achieving the global optimum in O(n log n) time.",
    complexity: {
      timeBest: "O(n log n)",
      timeAverage: "O(n log n)",
      timeWorst: "O(n log n)",
      spaceWorst: "O(1)",
      stable: true,
      inPlace: true,
    },
    codeLines: [
      "intervals.sort((a, b) => a.end - b.end);",
      "let lastEnd = -Infinity;",
      "for (const iv of intervals) {",
      "  if (iv.start >= lastEnd) {",
      "    selected.push(iv); lastEnd = iv.end;",
      "  }",
      "}",
    ],
    keyTakeaways: [
      "Earliest-Finish-Time (EFT) greedy choice property guarantees global optimality.",
    ],
    implemented: true,
    generateSteps: () => [
      {
        stepIndex: 0,
        type: "compare",
        array: [],
        highlightedIndices: [],
        sortedIndices: [],
        linearData: {
          mode: "array",
          nodes: [
            { id: "i1", value: "[1..3]", state: "sorted", label: "Selected #1" },
            { id: "i2", value: "[2..5]", state: "swapping", label: "Overlaps!" },
            { id: "i3", value: "[4..7]", state: "sorted", label: "Selected #2" },
            { id: "i4", value: "[6..9]", state: "swapping", label: "Overlaps!" },
            { id: "i5", value: "[8..10]", state: "sorted", label: "Selected #3" },
          ],
        },
        codeLine: 5,
        title: "Greedy Earliest-Finish Selection: [1..3], [4..7], [8..10]",
        description: "Selected 3 mutually compatible intervals; skipped overlapping [2..5] and [6..9].",
        metrics: { comparisons: 5, swaps: 3, arrayAccesses: 5 },
      },
    ],
  },
  {
    id: "hashing",
    name: "Hash Table Collision Resolution",
    category: "other",
    shortDescription:
      "Maps keys to bucket indices via h(k) = k mod M and resolves collisions via Separate Chaining.",
    description:
      "A Hash Table achieves O(1) expected lookup, insertion, and deletion by distributing keys across M buckets using a hash function and chaining colliding keys in short bucket lists.",
    complexity: {
      timeBest: "O(1)",
      timeAverage: "O(1 + α)",
      timeWorst: "O(n)",
      spaceWorst: "O(n + M)",
      stable: false,
      inPlace: false,
    },
    codeLines: [
      "function put(key: number) {",
      "  const idx = key % BUCKETS;",
      "  buckets[idx].push(key); // Separate chaining on collision",
      "}",
    ],
    keyTakeaways: [
      "Load factor α = N / M is kept ≤ 0.75 via dynamic table resizing.",
    ],
    implemented: true,
    generateSteps: (vals) => {
      const sample = vals.slice(0, 8);
      const buckets = Array.from({ length: 5 }, (_, b) => ({
        label: `Bucket h=${b}`,
        values: sample.filter((v) => v % 5 === b),
      }));
      return [
        {
          stepIndex: 0,
          type: "complete",
          array: makeBars(sample, { 0: "sorted", 1: "sorted", 2: "sorted" }),
          highlightedIndices: [0, 1],
          sortedIndices: [],
          auxiliaryBuckets: buckets,
          codeLine: 3,
          title: "Hash Function h(k) = k mod 5 Distributes Keys into 5 Buckets",
          description: "Colliding keys with the same remainder modulo 5 are chained in the same bucket.",
          metrics: { comparisons: sample.length, swaps: sample.length, arrayAccesses: sample.length },
        },
      ];
    },
  },
  {
    id: "two-pointers",
    name: "Two Pointers",
    category: "other",
    shortDescription:
      "Uses converging Left and Right pointers on a sorted array to find a pair summing to Target in O(n).",
    description:
      "Instead of checking all O(n²) pairs with nested loops, Two Pointers places L=0 and R=n-1 on a sorted array. If A[L] + A[R] < target, L increments; if > target, R decrements.",
    complexity: {
      timeBest: "O(1)",
      timeAverage: "O(n)",
      timeWorst: "O(n)",
      spaceWorst: "O(1)",
      stable: true,
      inPlace: true,
    },
    codeLines: [
      "let L = 0, R = A.length - 1;",
      "while (L < R) {",
      "  const sum = A[L] + A[R];",
      "  if (sum === target) return [L, R];",
      "  if (sum < target) L++; else R--;",
      "}",
    ],
    keyTakeaways: [
      "Reduces O(n²) brute-force pair search to a single O(n) pass with O(1) space.",
    ],
    implemented: true,
    generateSteps: (initialValues) => {
      const arr = [...initialValues].sort((a, b) => a - b);
      const p1 = 2;
      const p2 = Math.max(p1 + 1, arr.length - 3);
      const target = arr[p1] + arr[p2];
      const steps: AlgorithmStep[] = [];
      let L = 0;
      let R = arr.length - 1;

      while (L < R) {
        const sum = arr[L] + arr[R];
        const found = sum === target;
        steps.push({
          stepIndex: steps.length,
          type: found ? "complete" : "compare",
          array: makeBars(arr, {
            [L]: found ? "sorted" : "comparing",
            [R]: found ? "sorted" : "comparing",
          }),
          highlightedIndices: [L, R],
          sortedIndices: found ? [L, R] : [],
          auxiliaryBuckets: [
            { label: "Target Sum", values: [target] },
            { label: `A[${L}] + A[${R}]`, values: [`${arr[L]} + ${arr[R]} = ${sum}`] },
          ],
          codeLine: found ? 4 : 5,
          title: found
            ? `Pair Found! A[${L}] (${arr[L]}) + A[${R}] (${arr[R]}) = ${target}`
            : `Check L=${L}, R=${R}: ${arr[L]} + ${arr[R]} = ${sum} (${sum < target ? "<" : ">"} ${target})`,
          description: found
            ? `Converging pointers located exact pair summing to ${target} in O(n) time.`
            : sum < target
            ? `Sum ${sum} is too small — increment left pointer L to ${L + 1}.`
            : `Sum ${sum} is too large — decrement right pointer R to ${R - 1}.`,
          metrics: { comparisons: steps.length + 1, swaps: 0, arrayAccesses: (steps.length + 1) * 2 },
        });
        if (found) break;
        if (sum < target) L++;
        else R--;
      }
      return steps;
    },
  },
  {
    id: "sliding-window",
    name: "Sliding Window Maximum",
    category: "other",
    shortDescription:
      "Maintains a contiguous window [L..R] of size k across an array in O(n) time.",
    description:
      "Sliding Window avoids recomputing subarray aggregates from scratch by adding the incoming right element A[R] and subtracting/evicting the outgoing left element A[L] as the window slides right.",
    complexity: {
      timeBest: "O(n)",
      timeAverage: "O(n)",
      timeWorst: "O(n)",
      spaceWorst: "O(k)",
      stable: true,
      inPlace: true,
    },
    codeLines: [
      "let windowSum = 0, maxSum = -Infinity;",
      "for (let r = 0; r < A.length; r++) {",
      "  windowSum += A[r];",
      "  if (r >= k - 1) {",
      "    maxSum = Math.max(maxSum, windowSum);",
      "    windowSum -= A[r - (k - 1)]; // Slide left boundary",
      "  }",
      "}",
    ],
    keyTakeaways: [
      "Turns O(n · k) nested subarray loops into a single O(n) linear pass.",
    ],
    implemented: true,
    generateSteps: (initialValues) => {
      const arr = initialValues.slice(0, 12);
      const k = 3;
      const steps: AlgorithmStep[] = [];
      let bestSum = -Infinity;

      for (let i = 0; i <= arr.length - k; i++) {
        const winSum = arr[i] + arr[i + 1] + arr[i + 2];
        if (winSum > bestSum) bestSum = winSum;
        const states: Record<number, ArrayBar["state"]> = {
          [i]: "comparing",
          [i + 1]: "pivot",
          [i + 2]: "comparing",
        };
        steps.push({
          stepIndex: steps.length,
          type: i === arr.length - k ? "complete" : "compare",
          array: makeBars(arr, states),
          highlightedIndices: [i, i + 1, i + 2],
          sortedIndices: [],
          auxiliaryBuckets: [
            { label: `Window [${i}..${i + 2}]`, values: [arr[i], arr[i + 1], arr[i + 2]] },
            { label: "Window Sum", values: [winSum] },
            { label: "Max Sum So Far", values: [bestSum] },
          ],
          codeLine: 5,
          title: `Slide Window [${i}..${i + 2}] → Sum = ${winSum} (Max = ${bestSum})`,
          description: `Window [${arr[i]}, ${arr[i + 1]}, ${arr[i + 2]}] has sum ${winSum}.`,
          metrics: { comparisons: i + 1, swaps: 0, arrayAccesses: (i + 1) * 2 },
        });
      }
      return steps;
    },
  },
];

