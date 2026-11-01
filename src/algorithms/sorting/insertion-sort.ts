import { StepEngine } from "@/engine/step-engine";
import { AlgorithmDefinition, AlgorithmStep } from "@/types/algorithm";

export function generateInsertionSortSteps(
  initialValues: number[]
): AlgorithmStep[] {
  const engine = new StepEngine(initialValues);
  const n = engine.getLength();

  engine.markSorted(0, 2, "Single-element prefix A[0] is trivially sorted.");

  for (let i = 1; i < n; i++) {
    const keyVal = engine.peekValue(i);
    engine.setPivot(
      i,
      3,
      `Select key A[${i}] = ${keyVal} to insert into sorted prefix [0..${i - 1}].`
    );

    let j = i;
    while (j > 0) {
      const diff = engine.compare(
        j - 1,
        j,
        5,
        `Compare sorted prefix element A[${j - 1}] (${engine.peekValue(
          j - 1
        )}) with key (${engine.peekValue(j)}).`
      );
      if (diff > 0) {
        engine.setPivot(undefined, 6);
        engine.swap(
          j - 1,
          j,
          6,
          `Shift ${engine.peekValue(j - 1)} right by swapping A[${
            j - 1
          }] and A[${j}].`
        );
        j--;
        engine.setPivot(j, 6);
      } else {
        break;
      }
    }

    engine.setPivot(undefined, 9);
    const prefixIndices = Array.from({ length: i + 1 }, (_, idx) => idx);
    engine.markSorted(
      prefixIndices,
      9,
      `Key ${keyVal} placed at index ${j}. Prefix [0..${i}] is now sorted.`
    );
  }

  return engine.complete(11);
}

export const insertionSortDefinition: AlgorithmDefinition = {
  id: "insertion-sort",
  name: "Insertion Sort",
  category: "sorting",
  shortDescription:
    "Builds a sorted prefix one element at a time by shifting larger elements to the right.",
  description:
    "Insertion Sort works the way many people sort a hand of playing cards. Starting from index 1, it picks the current element (the key) and shifts all larger elements in the sorted left prefix one position to the right until the key's proper sorted slot is found. It is exceptionally fast on small or nearly-sorted arrays and serves as the base case for hybrid industrial sorts like Timsort and Introsort.",
  complexity: {
    timeBest: "O(n)",
    timeAverage: "O(n²)",
    timeWorst: "O(n²)",
    spaceWorst: "O(1)",
    stable: true,
    inPlace: true,
  },
  codeLines: [
    "function insertionSort(A: number[]): void {",
    "  for (let i = 1; i < A.length; i++) {",
    "    let j = i;",
    "    while (j > 0 && A[j - 1] > A[j]) {",
    "      // Shift larger element right",
    "      swap(A, j - 1, j);",
    "      j--;",
    "    }",
    "    // Prefix A[0..i] is now sorted",
    "  }",
    "}",
  ],
  keyTakeaways: [
    "Highly Adaptive: Runs in O(n + k) time where k is the number of inversions in the input.",
    "Online Algorithm: Can sort elements as they arrive in a stream without knowing the full dataset upfront.",
    "Low Overhead: Beats O(n log n) divide-and-conquer sorts on small subarrays (typically n ≤ 16).",
  ],
  implemented: true,
  generateSteps: generateInsertionSortSteps,
};

