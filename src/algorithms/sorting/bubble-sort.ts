import { StepEngine } from "@/engine/step-engine";
import { AlgorithmDefinition, AlgorithmStep } from "@/types/algorithm";

export function generateBubbleSortSteps(initialValues: number[]): AlgorithmStep[] {
  const engine = new StepEngine(initialValues);
  const n = engine.getLength();

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      const diff = engine.compare(
        j,
        j + 1,
        4,
        `Pass ${i + 1}: Compare adjacent elements A[${j}] (${engine.peekValue(
          j
        )}) and A[${j + 1}] (${engine.peekValue(j + 1)}).`
      );
      if (diff > 0) {
        engine.swap(
          j,
          j + 1,
          5,
          `A[${j}] > A[${j + 1}], so swap them to bubble the larger value right.`
        );
        swapped = true;
      }
    }
    engine.markSorted(
      n - 1 - i,
      8,
      `End of Pass ${i + 1}: Largest unsorted element is now locked at index ${
        n - 1 - i
      }.`
    );
    if (!swapped) {
      const remaining = Array.from({ length: n - 1 - i }, (_, idx) => idx);
      if (remaining.length > 0) {
        engine.markSorted(
          remaining,
          9,
          "No swaps occurred during this pass — the remaining prefix is already sorted!"
        );
      }
      break;
    }
  }

  return engine.complete(11);
}

export const bubbleSortDefinition: AlgorithmDefinition = {
  id: "bubble-sort",
  name: "Bubble Sort",
  category: "sorting",
  shortDescription:
    "Repeatedly compares adjacent elements and swaps them if they are in the wrong order.",
  description:
    "Bubble Sort steps through the array pass by pass, comparing adjacent pairs and swapping them when the left value is greater than the right value. After each pass, the largest remaining unsorted value 'bubbles up' to its final sorted index at the end of the array. An early-exit flag stops execution immediately if a full pass completes with zero swaps.",
  complexity: {
    timeBest: "O(n)",
    timeAverage: "O(n²)",
    timeWorst: "O(n²)",
    spaceWorst: "O(1)",
    stable: true,
    inPlace: true,
  },
  codeLines: [
    "function bubbleSort(A: number[]): void {",
    "  for (let i = 0; i < A.length - 1; i++) {",
    "    let swapped = false;",
    "    for (let j = 0; j < A.length - i - 1; j++) {",
    "      if (A[j] > A[j + 1]) {",
    "        swap(A, j, j + 1); swapped = true;",
    "      }",
    "    }",
    "    // A[n - 1 - i] is now in sorted position",
    "    if (!swapped) break;",
    "  }",
    "}",
  ],
  keyTakeaways: [
    "Adaptive: Achieves O(n) best-case time on already-sorted arrays using a swapped flag.",
    "Stable & In-Place: Preserves relative order of equal keys and uses O(1) extra memory.",
    "Each outer iteration guarantees that the k-th largest element settles at index n - k.",
  ],
  implemented: true,
  generateSteps: generateBubbleSortSteps,
};

