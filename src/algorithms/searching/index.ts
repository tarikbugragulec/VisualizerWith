import { AlgorithmDefinition, AlgorithmStep, ArrayBar } from "@/types/algorithm";

function makeBars(
  values: number[],
  states: Record<number, ArrayBar["state"]> = {}
): ArrayBar[] {
  return values.map((v, i) => ({
    id: `search-bar-${i}-${v}`,
    value: v,
    state: states[i] ?? "default",
  }));
}

function generateLinearSearchSteps(initialValues: number[]): AlgorithmStep[] {
  const arr = [...initialValues];
  const targetIdx = Math.min(arr.length - 2, Math.max(1, Math.floor(arr.length * 0.68)));
  const target = arr[targetIdx];
  const steps: AlgorithmStep[] = [];
  let comparisons = 0;
  let accesses = 0;

  steps.push({
    stepIndex: 0,
    type: "init",
    array: makeBars(arr, { [targetIdx]: "target" }),
    highlightedIndices: [],
    sortedIndices: [],
    auxiliaryBuckets: [{ label: "Target Value", values: [target] }],
    codeLine: 1,
    title: `Linear Search for Target = ${target}`,
    description: `Scanning unsorted array sequentially from index 0 to ${arr.length - 1} to find ${target}.`,
    metrics: { comparisons: 0, swaps: 0, arrayAccesses: 0 },
  });

  for (let i = 0; i < arr.length; i++) {
    comparisons++;
    accesses++;
    const isMatch = arr[i] === target;

    steps.push({
      stepIndex: steps.length,
      type: isMatch ? "mark-sorted" : "compare",
      array: makeBars(arr, {
        ...Object.fromEntries(Array.from({ length: i }, (_, k) => [k, "overwrite"])),
        [i]: isMatch ? "sorted" : "comparing",
      }),
      highlightedIndices: [i],
      sortedIndices: isMatch ? [i] : [],
      pivotIndex: i,
      auxiliaryBuckets: [
        { label: "Target", values: [target] },
        { label: "Current Index", values: [i] },
      ],
      codeLine: isMatch ? 4 : 3,
      title: isMatch
        ? `Match Found at Index ${i}!`
        : `Check A[${i}] = ${arr[i]} (≠ ${target})`,
      description: isMatch
        ? `A[${i}] equals target ${target}. Search terminates after ${comparisons} comparisons.`
        : `A[${i}] (${arr[i]}) does not equal ${target}. Advance pointer to index ${i + 1}.`,
      metrics: { comparisons, swaps: 0, arrayAccesses: accesses },
    });

    if (isMatch) break;
  }

  return steps;
}

function generateBinarySearchSteps(initialValues: number[]): AlgorithmStep[] {
  const arr = [...initialValues].sort((a, b) => a - b);
  const targetIdx = Math.max(1, Math.floor(arr.length * 0.72));
  const target = arr[targetIdx];
  const steps: AlgorithmStep[] = [];
  let comparisons = 0;
  let accesses = 0;

  steps.push({
    stepIndex: 0,
    type: "init",
    array: makeBars(arr),
    highlightedIndices: [],
    sortedIndices: [],
    auxiliaryBuckets: [
      { label: "Target", values: [target] },
      { label: "Search Window", values: [`0 .. ${arr.length - 1}`] },
    ],
    codeLine: 1,
    title: `Binary Search for Target = ${target}`,
    description: `Sorted array ready. Initialize search interval [low=0, high=${arr.length - 1}].`,
    metrics: { comparisons: 0, swaps: 0, arrayAccesses: 0 },
  });

  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    comparisons++;
    accesses++;

    const states: Record<number, ArrayBar["state"]> = {};
    for (let i = 0; i < arr.length; i++) {
      if (i < low || i > high) states[i] = "overwrite";
    }
    states[low] = "comparing";
    states[high] = "comparing";
    states[mid] = arr[mid] === target ? "sorted" : "pivot";

    steps.push({
      stepIndex: steps.length,
      type: arr[mid] === target ? "complete" : "compare",
      array: makeBars(arr, states),
      highlightedIndices: [low, mid, high],
      sortedIndices: arr[mid] === target ? [mid] : [],
      pivotIndex: mid,
      auxiliaryBuckets: [
        { label: "Target", values: [target] },
        { label: "Low", values: [low] },
        { label: "Mid", values: [mid] },
        { label: "High", values: [high] },
      ],
      codeLine: arr[mid] === target ? 5 : arr[mid] < target ? 6 : 7,
      title:
        arr[mid] === target
          ? `Found Target ${target} at Mid = ${mid}!`
          : `Probe Mid = ${mid} (A[${mid}] = ${arr[mid]})`,
      description:
        arr[mid] === target
          ? `A[${mid}] == ${target}! Binary Search found the target in ${comparisons} logarithmic probes.`
          : arr[mid] < target
          ? `A[${mid}] (${arr[mid]}) < ${target}: Discard left half and set low = ${mid + 1}.`
          : `A[${mid}] (${arr[mid]}) > ${target}: Discard right half and set high = ${mid - 1}.`,
      metrics: { comparisons, swaps: 0, arrayAccesses: accesses },
    });

    if (arr[mid] === target) break;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }

  return steps;
}

function generateJumpSearchSteps(initialValues: number[]): AlgorithmStep[] {
  const arr = [...initialValues].sort((a, b) => a - b);
  const n = arr.length;
  const stepSize = Math.max(2, Math.floor(Math.sqrt(n)));
  const targetIdx = Math.min(n - 1, Math.max(2, Math.floor(n * 0.65)));
  const target = arr[targetIdx];
  const steps: AlgorithmStep[] = [];
  let comparisons = 0;
  let accesses = 0;

  steps.push({
    stepIndex: 0,
    type: "init",
    array: makeBars(arr),
    highlightedIndices: [],
    sortedIndices: [],
    auxiliaryBuckets: [
      { label: "Target", values: [target] },
      { label: "Block √n", values: [stepSize] },
    ],
    codeLine: 1,
    title: `Jump Search for Target = ${target} (Block Size √n = ${stepSize})`,
    description: `Jumping ahead by ${stepSize} indices at a time until A[curr] ≥ ${target}.`,
    metrics: { comparisons: 0, swaps: 0, arrayAccesses: 0 },
  });

  let prev = 0;
  let curr = Math.min(stepSize, n) - 1;

  while (curr < n) {
    comparisons++;
    accesses++;
    const states: Record<number, ArrayBar["state"]> = {
      [prev]: "comparing",
      [curr]: "pivot",
    };

    steps.push({
      stepIndex: steps.length,
      type: "compare",
      array: makeBars(arr, states),
      highlightedIndices: [prev, curr],
      sortedIndices: [],
      pivotIndex: curr,
      auxiliaryBuckets: [
        { label: "Target", values: [target] },
        { label: "Block Range", values: [`${prev}..${curr}`] },
      ],
      codeLine: 4,
      title: `Jump Probe A[${curr}] = ${arr[curr]}`,
      description:
        arr[curr] < target
          ? `A[${curr}] (${arr[curr]}) < ${target}: Jump forward to next block.`
          : `A[${curr}] (${arr[curr]}) ≥ ${target}: Target lies within block [${prev}..${curr}].`,
      metrics: { comparisons, swaps: 0, arrayAccesses: accesses },
    });

    if (arr[curr] >= target || curr === n - 1) break;
    prev = curr + 1;
    curr = Math.min(curr + stepSize, n - 1);
  }

  for (let i = prev; i <= curr; i++) {
    comparisons++;
    accesses++;
    const found = arr[i] === target;
    steps.push({
      stepIndex: steps.length,
      type: found ? "complete" : "compare",
      array: makeBars(arr, {
        [i]: found ? "sorted" : "comparing",
      }),
      highlightedIndices: [i],
      sortedIndices: found ? [i] : [],
      pivotIndex: i,
      auxiliaryBuckets: [
        { label: "Target", values: [target] },
        { label: "Linear Scan", values: [i] },
      ],
      codeLine: found ? 8 : 7,
      title: found
        ? `Target ${target} Found at Index ${i}!`
        : `Linear Scan Inside Block: A[${i}] = ${arr[i]}`,
      description: found
        ? `Located ${target} at index ${i} after jumping blocks of size ${stepSize}.`
        : `Scanning within block [${prev}..${curr}]: A[${i}] = ${arr[i]}.`,
      metrics: { comparisons, swaps: 0, arrayAccesses: accesses },
    });
    if (found) break;
  }

  return steps;
}

function generateInterpolationSearchSteps(
  initialValues: number[]
): AlgorithmStep[] {
  const arr = [...initialValues].sort((a, b) => a - b);
  const n = arr.length;
  const targetIdx = Math.min(n - 2, Math.max(1, Math.floor(n * 0.6)));
  const target = arr[targetIdx];
  const steps: AlgorithmStep[] = [];
  let comparisons = 0;
  let accesses = 0;

  steps.push({
    stepIndex: 0,
    type: "init",
    array: makeBars(arr),
    highlightedIndices: [],
    sortedIndices: [],
    auxiliaryBuckets: [{ label: "Target", values: [target] }],
    codeLine: 1,
    title: `Interpolation Search for Target = ${target}`,
    description: `Estimates probe index using linear value interpolation across [low..high].`,
    metrics: { comparisons: 0, swaps: 0, arrayAccesses: 0 },
  });

  let low = 0;
  let high = n - 1;

  while (low <= high && target >= arr[low] && target <= arr[high]) {
    const denom = arr[high] - arr[low];
    const pos =
      denom === 0
        ? low
        : low + Math.floor(((target - arr[low]) * (high - low)) / denom);

    comparisons++;
    accesses += 3;

    const found = arr[pos] === target;
    steps.push({
      stepIndex: steps.length,
      type: found ? "complete" : "compare",
      array: makeBars(arr, {
        [low]: "comparing",
        [high]: "comparing",
        [pos]: found ? "sorted" : "pivot",
      }),
      highlightedIndices: [low, pos, high],
      sortedIndices: found ? [pos] : [],
      pivotIndex: pos,
      auxiliaryBuckets: [
        { label: "Target", values: [target] },
        { label: "Interpolated Pos", values: [pos] },
        { label: "Window", values: [`${low}..${high}`] },
      ],
      codeLine: found ? 5 : 4,
      title: found
        ? `Interpolated Directly to Target ${target} at Index ${pos}!`
        : `Interpolated Probe pos = ${pos} (A[${pos}] = ${arr[pos]})`,
      description: found
        ? `Formula estimated index ${pos} where A[${pos}] == ${target} in just ${comparisons} step(s)!`
        : `Formula estimated index ${pos} (value ${arr[pos]}). Narrowing search bounds.`,
      metrics: { comparisons, swaps: 0, arrayAccesses: accesses },
    });

    if (found) break;
    if (arr[pos] < target) low = pos + 1;
    else high = pos - 1;
  }

  return steps;
}

export const SEARCHING_ALGORITHMS: AlgorithmDefinition[] = [
  {
    id: "linear-search",
    name: "Linear Search",
    category: "searching",
    shortDescription:
      "Sequentially inspects each element from left to right until the target value is found.",
    description:
      "Linear Search works on both sorted and unsorted arrays by checking each element one by one from index 0. It requires no preprocessing and runs in O(n) time.",
    complexity: {
      timeBest: "O(1)",
      timeAverage: "O(n)",
      timeWorst: "O(n)",
      spaceWorst: "O(1)",
      stable: true,
      inPlace: true,
    },
    codeLines: [
      "function linearSearch(A: number[], target: number): number {",
      "  for (let i = 0; i < A.length; i++) {",
      "    if (A[i] === target) {",
      "      return i; // Match found",
      "    }",
      "  }",
      "  return -1;",
      "}",
    ],
    keyTakeaways: [
      "No sorting required: Works on any unsorted sequence or linked list.",
      "Cache-friendly sequential scan over contiguous array memory.",
    ],
    implemented: true,
    generateSteps: generateLinearSearchSteps,
  },
  {
    id: "binary-search",
    name: "Binary Search",
    category: "searching",
    shortDescription:
      "Halves the search interval on a sorted array at each step to locate the target in O(log n) time.",
    description:
      "Binary Search compares the target value against the middle element of a sorted array. Depending on whether the middle value is smaller or larger than the target, it eliminates half of the remaining search space on every iteration.",
    complexity: {
      timeBest: "O(1)",
      timeAverage: "O(log n)",
      timeWorst: "O(log n)",
      spaceWorst: "O(1)",
      stable: true,
      inPlace: true,
    },
    codeLines: [
      "function binarySearch(A: number[], target: number): number {",
      "  let low = 0, high = A.length - 1;",
      "  while (low <= high) {",
      "    const mid = Math.floor((low + high) / 2);",
      "    if (A[mid] === target) return mid;",
      "    if (A[mid] < target) low = mid + 1;",
      "    else high = mid - 1;",
      "  }",
      "  return -1;",
      "}",
    ],
    keyTakeaways: [
      "Logarithmic speed: Searches 1,000,000 sorted items in at most 20 comparisons.",
      "Requires random-access sorted memory.",
    ],
    implemented: true,
    generateSteps: generateBinarySearchSteps,
  },
  {
    id: "jump-search",
    name: "Jump Search",
    category: "searching",
    shortDescription:
      "Leaps ahead by fixed blocks of size √n on a sorted array, then performs a linear scan inside the target block.",
    description:
      "Jump Search bridges Linear Search and Binary Search by jumping ahead √n steps at a time until finding a block boundary greater than or equal to the target, then scanning backward/linearly within that √n block.",
    complexity: {
      timeBest: "O(1)",
      timeAverage: "O(√n)",
      timeWorst: "O(√n)",
      spaceWorst: "O(1)",
      stable: true,
      inPlace: true,
    },
    codeLines: [
      "function jumpSearch(A: number[], target: number): number {",
      "  const step = Math.floor(Math.sqrt(A.length));",
      "  let prev = 0, curr = step - 1;",
      "  while (curr < A.length && A[curr] < target) {",
      "    prev = curr + 1; curr = Math.min(curr + step, A.length - 1);",
      "  }",
      "  for (let i = prev; i <= curr; i++) {",
      "    if (A[i] === target) return i;",
      "  }",
      "}",
    ],
    keyTakeaways: [
      "Optimal block size is √n, yielding at most √n + √n = 2√n comparisons.",
      "Only jumps forward once before a short local linear scan.",
    ],
    implemented: true,
    generateSteps: generateJumpSearchSteps,
  },
  {
    id: "interpolation-search",
    name: "Interpolation Search",
    category: "searching",
    shortDescription:
      "Estimates the target's exact index using linear interpolation on uniformly distributed sorted keys.",
    description:
      "Instead of always probing the midpoint like Binary Search, Interpolation Search calculates where the target is likely located based on its value relative to A[low] and A[high], achieving O(log log n) average time on uniform distributions.",
    complexity: {
      timeBest: "O(1)",
      timeAverage: "O(log log n)",
      timeWorst: "O(n)",
      spaceWorst: "O(1)",
      stable: true,
      inPlace: true,
    },
    codeLines: [
      "function interpolationSearch(A: number[], target: number): number {",
      "  let low = 0, high = A.length - 1;",
      "  while (low <= high && target >= A[low] && target <= A[high]) {",
      "    const pos = low + Math.floor(((target - A[low]) * (high - low)) / (A[high] - A[low]));",
      "    if (A[pos] === target) return pos;",
      "    if (A[pos] < target) low = pos + 1; else high = pos - 1;",
      "  }",
      "}",
    ],
    keyTakeaways: [
      "Models how humans look up a name in a phone book (probing near the front for 'B' and near the back for 'Y').",
      "Achieves O(log log n) on uniformly distributed numerical keys.",
    ],
    implemented: true,
    generateSteps: generateInterpolationSearchSteps,
  },
];

