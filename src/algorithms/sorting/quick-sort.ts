import { StepEngine } from "@/engine/step-engine";
import { AlgorithmDefinition, AlgorithmStep } from "@/types/algorithm";

export function generateQuickSortSteps(
  initialValues: number[]
): AlgorithmStep[] {
  const engine = new StepEngine(initialValues);
  const n = engine.getLength();

  function partition(low: number, high: number): number {
    const pivotVal = engine.peekValue(high);
    engine.setPivot(
      high,
      3,
      `Partition [${low}..${high}]: Choose rightmost element A[${high}] = ${pivotVal} as pivot.`
    );

    let i = low - 1;
    for (let j = low; j < high; j++) {
      const diff = engine.compare(
        j,
        high,
        6,
        `Compare A[${j}] (${engine.peekValue(j)}) against pivot A[${high}] (${pivotVal}).`
      );
      if (diff <= 0) {
        i++;
        if (i !== j) {
          engine.swap(
            i,
            j,
            8,
            `A[${j}] ≤ ${pivotVal}: Swap A[${i}] and A[${j}] into left partition.`
          );
        }
      }
    }

    const pivotFinalIdx = i + 1;
    engine.setPivot(undefined, 11);
    if (pivotFinalIdx !== high) {
      engine.swap(
        pivotFinalIdx,
        high,
        11,
        `Place pivot ${pivotVal} into its exact split boundary at index ${pivotFinalIdx}.`
      );
    }

    engine.markSorted(
      pivotFinalIdx,
      12,
      `Pivot ${pivotVal} at index ${pivotFinalIdx} is now in its final sorted position.`
    );

    return pivotFinalIdx;
  }

  function quickSort(low: number, high: number) {
    if (low > high) return;
    if (low === high) {
      engine.markSorted(
        low,
        2,
        `Base case: Single element A[${low}] (${engine.peekValue(
          low
        )}) is in its final position.`
      );
      return;
    }

    const pi = partition(low, high);
    quickSort(low, pi - 1);
    quickSort(pi + 1, high);
  }

  quickSort(0, n - 1);
  return engine.complete(17);
}

export const quickSortDefinition: AlgorithmDefinition = {
  id: "quick-sort",
  name: "Quick Sort",
  category: "sorting",
  shortDescription:
    "In-place divide-and-conquer sort that partitions elements around a chosen pivot.",
  description:
    "Quick Sort selects a 'pivot' element and partitions the subarray so all values less than or equal to the pivot move to its left and all larger values move to its right. Once the partition completes, the pivot is permanently locked in its final sorted index, and Quick Sort recurses on the left and right partitions. Its tight inner loop and cache locality make it one of the fastest sorting algorithms in practice.",
  complexity: {
    timeBest: "O(n log n)",
    timeAverage: "O(n log n)",
    timeWorst: "O(n²)",
    spaceWorst: "O(log n)",
    stable: false,
    inPlace: true,
  },
  codeLines: [
    "function quickSort(A: number[], low: number, high: number) {",
    "  if (low >= high) return;",
    "  const pivot = A[high]; // Lomuto partition scheme",
    "  let i = low - 1;",
    "  for (let j = low; j < high; j++) {",
    "    if (A[j] <= pivot) {",
    "      i++;",
    "      swap(A, i, j);",
    "    }",
    "  }",
    "  swap(A, i + 1, high);",
    "  const p = i + 1; // Pivot locked at index p",
    "  quickSort(A, low, p - 1);",
    "  quickSort(A, p + 1, high);",
    "}",
  ],
  keyTakeaways: [
    "Cache Friendly: Sequential memory scans during partitioning yield excellent CPU cache locality.",
    "Pivot Sensitivity: Last-element pivot degrades to O(n²) on already sorted inputs unless randomized or median-of-three is used.",
    "In-Place Partitioning: Requires only O(log n) auxiliary stack frames for balanced recursion.",
  ],
  implemented: true,
  generateSteps: generateQuickSortSteps,
};

