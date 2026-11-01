import { StepEngine } from "@/engine/step-engine";
import { AlgorithmDefinition, AlgorithmStep } from "@/types/algorithm";

export function generateCountingSortSteps(
  initialValues: number[]
): AlgorithmStep[] {
  const engine = new StepEngine(initialValues);
  const n = engine.getLength();

  const distinctSorted = Array.from(new Set(initialValues)).sort(
    (a, b) => a - b
  );
  const counts = new Map<number, number>();
  distinctSorted.forEach((v) => counts.set(v, 0));

  const formatBuckets = () =>
    distinctSorted.map((key) => ({
      label: `Key ${key}`,
      values: Array.from({ length: counts.get(key) ?? 0 }, () => key),
    }));

  for (let i = 0; i < n; i++) {
    const val = engine.getValue(i);
    counts.set(val, (counts.get(val) ?? 0) + 1);
    engine.recordBucketStep(
      [i],
      formatBuckets(),
      4,
      `Tally Frequency of A[${i}] = ${val}`,
      `Increment frequency counter for value ${val} (now ${counts.get(val)}).`
    );
  }

  let writeIdx = 0;
  for (const key of distinctSorted) {
    let freq = counts.get(key) ?? 0;
    while (freq > 0) {
      freq--;
      counts.set(key, freq);
      engine.overwrite(
        writeIdx,
        key,
        9,
        `Reconstruct sorted array: Write value ${key} into A[${writeIdx}] from frequency table.`,
        formatBuckets()
      );
      engine.markSorted(
        writeIdx,
        10,
        `A[${writeIdx}] = ${key} is placed in its final sorted slot.`
      );
      writeIdx++;
    }
  }

  return engine.complete(12);
}

export const countingSortDefinition: AlgorithmDefinition = {
  id: "counting-sort",
  name: "Counting Sort",
  category: "sorting",
  shortDescription:
    "Non-comparative integer sort that counts element frequencies and reconstructs the sorted output.",
  description:
    "Counting Sort bypasses the Ω(n log n) comparison-based sorting lower bound by using element values directly as keys in a frequency table. First, it scans the input once to tally how many times each value occurs. Then it iterates through the keys in order, writing each value into the output array according to its frequency count.",
  complexity: {
    timeBest: "O(n + k)",
    timeAverage: "O(n + k)",
    timeWorst: "O(n + k)",
    spaceWorst: "O(n + k)",
    stable: true,
    inPlace: false,
  },
  codeLines: [
    "function countingSort(A: number[]) {",
    "  const count = new Map<number, number>();",
    "  // Phase 1: Count occurrences of each value",
    "  for (let i = 0; i < A.length; i++) {",
    "    count.set(A[i], (count.get(A[i]) ?? 0) + 1);",
    "  }",
    "  // Phase 2: Reconstruct sorted array from frequencies",
    "  let idx = 0;",
    "  for (const [key, freq] of sortedEntries(count)) {",
    "    for (let c = 0; c < freq; c++) A[idx++] = key;",
    "  }",
    "}",
  ],
  keyTakeaways: [
    "Zero Element Comparisons: Runs in linear O(n + k) time when the key range k is O(n).",
    "Stable Subroutine: Serves as the stable digit-sorting pass inside Radix Sort.",
    "Range Bound: Becomes memory-prohibitive if the key range k = max - min is very large.",
  ],
  implemented: true,
  generateSteps: generateCountingSortSteps,
};

