import { StepEngine } from "@/engine/step-engine";
import { AlgorithmDefinition, AlgorithmStep } from "@/types/algorithm";

export function generateHeapSortSteps(
  initialValues: number[]
): AlgorithmStep[] {
  const engine = new StepEngine(initialValues);
  const n = engine.getLength();

  function siftDown(heapSize: number, rootIdx: number) {
    let largest = rootIdx;
    const left = 2 * rootIdx + 1;
    const right = 2 * rootIdx + 2;

    if (left < heapSize) {
      const diffLeft = engine.compare(
        left,
        largest,
        9,
        `Max-Heapify: Compare left child A[${left}] (${engine.peekValue(
          left
        )}) with parent A[${largest}] (${engine.peekValue(largest)}).`
      );
      if (diffLeft > 0) {
        largest = left;
      }
    }

    if (right < heapSize) {
      const diffRight = engine.compare(
        right,
        largest,
        10,
        `Max-Heapify: Compare right child A[${right}] (${engine.peekValue(
          right
        )}) with current largest A[${largest}] (${engine.peekValue(largest)}).`
      );
      if (diffRight > 0) {
        largest = right;
      }
    }

    if (largest !== rootIdx) {
      engine.swap(
        rootIdx,
        largest,
        12,
        `Heap property violated: Swap parent A[${rootIdx}] with larger child A[${largest}].`
      );
      siftDown(heapSize, largest);
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    siftDown(n, i);
  }

  for (let end = n - 1; end > 0; end--) {
    engine.swap(
      0,
      end,
      5,
      `Extract Max: Swap heap root A[0] (${engine.peekValue(
        0
      )}) with last heap element A[${end}] (${engine.peekValue(end)}).`
    );
    engine.markSorted(
      end,
      6,
      `Max element ${engine.peekValue(end)} locked at index ${end}.`
    );
    siftDown(end, 0);
  }

  return engine.complete(15);
}

export const heapSortDefinition: AlgorithmDefinition = {
  id: "heap-sort",
  name: "Heap Sort",
  category: "sorting",
  shortDescription:
    "Builds an in-place binary Max-Heap and repeatedly extracts the maximum root to the end.",
  description:
    "Heap Sort views the array as an implicit complete binary tree. Phase 1 converts the unsorted array into a Max-Heap in O(n) bottom-up time so that every parent node is greater than or equal to its children. Phase 2 repeatedly swaps the maximum root at A[0] with the end of the heap, shrinks the heap boundary by one, and restores the Max-Heap property in O(log n) time via siftDown.",
  complexity: {
    timeBest: "O(n log n)",
    timeAverage: "O(n log n)",
    timeWorst: "O(n log n)",
    spaceWorst: "O(1)",
    stable: false,
    inPlace: true,
  },
  codeLines: [
    "function heapSort(A: number[]) {",
    "  // Phase 1: Build Max-Heap in O(n)",
    "  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) siftDown(n, i);",
    "  // Phase 2: Extract max root one by one",
    "  for (let end = n - 1; end > 0; end--) {",
    "    swap(A, 0, end); // Lock max at end",
    "    siftDown(end, 0);",
    "  }",
    "  // siftDown compares node i with children 2i+1 and 2i+2",
    "  if (left < size && A[left] > A[largest]) largest = left;",
    "  if (right < size && A[right] > A[largest]) largest = right;",
    "  if (largest !== i) {",
    "    swap(A, i, largest); siftDown(size, largest);",
    "  }",
    "}",
  ],
  keyTakeaways: [
    "Optimal Worst-Case & Space: Combines Merge Sort's O(n log n) worst-case bound with O(1) extra space.",
    "Implicit Binary Tree: Uses index arithmetic (left = 2i + 1, right = 2i + 2) with zero pointer overhead.",
    "Foundation of Introsort: Used as the fallback in C++ std::sort when Quick Sort recursion depth exceeds 2 log₂(n).",
  ],
  implemented: true,
  generateSteps: generateHeapSortSteps,
};

