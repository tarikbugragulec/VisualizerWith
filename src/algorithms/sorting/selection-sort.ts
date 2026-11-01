import { StepEngine } from "@/engine/step-engine";
import { AlgorithmDefinition, AlgorithmStep } from "@/types/algorithm";

export function generateSelectionSortSteps(
  initialValues: number[]
): AlgorithmStep[] {
  const engine = new StepEngine(initialValues);
  const n = engine.getLength();

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    engine.setPivot(
      minIdx,
      3,
      `Start Pass ${i + 1}: Assume minimum of unsorted suffix is A[${minIdx}] (${engine.peekValue(
        minIdx
      )}).`
    );

    for (let j = i + 1; j < n; j++) {
      const diff = engine.compare(
        j,
        minIdx,
        5,
        `Scan unsorted region: Compare A[${j}] (${engine.peekValue(
          j
        )}) with current minimum A[${minIdx}] (${engine.peekValue(minIdx)}).`
      );
      if (diff < 0) {
        minIdx = j;
        engine.setPivot(
          minIdx,
          6,
          `Found new minimum ${engine.peekValue(minIdx)} at index ${minIdx}.`
        );
      }
    }

    engine.setPivot(undefined, 8);
    if (minIdx !== i) {
      engine.swap(
        i,
        minIdx,
        9,
        `Swap minimum element A[${minIdx}] (${engine.peekValue(
          minIdx
        )}) into target index ${i}.`
      );
    }

    engine.markSorted(
      i,
      10,
      `Index ${i} now holds its final sorted value (${engine.peekValue(i)}).`
    );
  }

  return engine.complete(12);
}

export const selectionSortDefinition: AlgorithmDefinition = {
  id: "selection-sort",
  name: "Selection Sort",
  category: "sorting",
  shortDescription:
    "Repeatedly scans the unsorted suffix to select the minimum element and swaps it to the front.",
  description:
    "Selection Sort partitions the array into a sorted prefix and an unsorted suffix. On each iteration i, it scans the entire unsorted suffix [i..n-1] to locate the smallest value, then performs at most one swap to place that minimum at index i. While it always performs O(n²) comparisons regardless of initial order, it minimizes memory writes to at most n - 1 swaps.",
  complexity: {
    timeBest: "O(n²)",
    timeAverage: "O(n²)",
    timeWorst: "O(n²)",
    spaceWorst: "O(1)",
    stable: false,
    inPlace: true,
  },
  codeLines: [
    "function selectionSort(A: number[]): void {",
    "  for (let i = 0; i < A.length - 1; i++) {",
    "    let minIdx = i;",
    "    for (let j = i + 1; j < A.length; j++) {",
    "      if (A[j] < A[minIdx]) {",
    "        minIdx = j;",
    "      }",
    "    }",
    "    if (minIdx !== i) swap(A, i, minIdx);",
    "    // A[i] is now locked in sorted order",
    "  }",
    "}",
  ],
  keyTakeaways: [
    "Minimal Writes: Performs at most O(n) swaps, making it useful when memory writes are expensive.",
    "Non-Adaptive: Always runs n(n - 1)/2 comparisons even if the input is already sorted.",
    "Unstable: Long-range swaps can flip the relative order of duplicate values.",
  ],
  implemented: true,
  generateSteps: generateSelectionSortSteps,
};

