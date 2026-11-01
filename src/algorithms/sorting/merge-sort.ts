import { StepEngine } from "@/engine/step-engine";
import { AlgorithmDefinition, AlgorithmStep, ArrayBar } from "@/types/algorithm";

export function generateMergeSortSteps(
  initialValues: number[]
): AlgorithmStep[] {
  const engine = new StepEngine(initialValues);
  const n = engine.getLength();

  function merge(left: number, mid: number, right: number) {
    const leftSlice: ArrayBar[] = [];
    const rightSlice: ArrayBar[] = [];

    for (let i = left; i <= mid; i++) {
      leftSlice.push(engine.getBarClone(i));
    }
    for (let j = mid + 1; j <= right; j++) {
      rightSlice.push(engine.getBarClone(j));
    }

    let i = 0;
    let j = 0;
    let k = left;

    const makeBuckets = () => [
      { label: `Left [${left}..${mid}]`, values: leftSlice.slice(i).map((b) => b.value) },
      { label: `Right [${mid + 1}..${right}]`, values: rightSlice.slice(j).map((b) => b.value) },
    ];

    while (i < leftSlice.length && j < rightSlice.length) {
      const leftIdx = Math.min(mid, left + i);
      const rightIdx = Math.min(right, mid + 1 + j);

      engine.compare(
        leftIdx,
        rightIdx,
        7,
        `Merging [${left}..${right}]: Compare Left head (${leftSlice[i].value}) with Right head (${rightSlice[j].value}).`
      );

      if (leftSlice[i].value <= rightSlice[j].value) {
        const chosen = leftSlice[i];
        i++;
        engine.overwrite(
          k,
          chosen,
          8,
          `Write smaller value ${chosen.value} from Left subarray into A[${k}].`,
          makeBuckets()
        );
      } else {
        const chosen = rightSlice[j];
        j++;
        engine.overwrite(
          k,
          chosen,
          10,
          `Write smaller value ${chosen.value} from Right subarray into A[${k}].`,
          makeBuckets()
        );
      }
      k++;
    }

    while (i < leftSlice.length) {
      const chosen = leftSlice[i];
      i++;
      engine.overwrite(
        k,
        chosen,
        13,
        `Copy remaining Left subarray value ${chosen.value} into A[${k}].`,
        makeBuckets()
      );
      k++;
    }

    while (j < rightSlice.length) {
      const chosen = rightSlice[j];
      j++;
      engine.overwrite(
        k,
        chosen,
        14,
        `Copy remaining Right subarray value ${chosen.value} into A[${k}].`,
        makeBuckets()
      );
      k++;
    }

    if (left === 0 && right === n - 1) {
      const allIndices = Array.from({ length: n }, (_, idx) => idx);
      engine.markSorted(
        allIndices,
        15,
        "Final merge complete — entire array is now sorted."
      );
    }
  }

  function divide(left: number, right: number) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    divide(left, mid);
    divide(mid + 1, right);
    merge(left, mid, right);
  }

  divide(0, n - 1);
  return engine.complete(17);
}

export const mergeSortDefinition: AlgorithmDefinition = {
  id: "merge-sort",
  name: "Merge Sort",
  category: "sorting",
  shortDescription:
    "Divide-and-conquer algorithm that recursively splits the array in half and merges sorted subarrays.",
  description:
    "Merge Sort recursively divides the array into two halves until reaching single-element subarrays, then merges pairs of sorted subarrays back together using a two-pointer scan. It guarantees O(n log n) worst-case performance regardless of input distribution and preserves stability, at the cost of O(n) auxiliary buffer space.",
  complexity: {
    timeBest: "O(n log n)",
    timeAverage: "O(n log n)",
    timeWorst: "O(n log n)",
    spaceWorst: "O(n)",
    stable: true,
    inPlace: false,
  },
  codeLines: [
    "function mergeSort(A: number[], l: number, r: number) {",
    "  if (l >= r) return;",
    "  const mid = Math.floor((l + r) / 2);",
    "  mergeSort(A, l, mid);",
    "  mergeSort(A, mid + 1, r);",
    "  // Merge sorted halves L[l..mid] and R[mid+1..r]",
    "  while (i < L.length && j < R.length) {",
    "    if (L[i] <= R[j]) A[k++] = L[i++];",
    "    else A[k++] = R[j++];",
    "  }",
    "  // Copy remaining elements from L or R",
    "  while (i < L.length) A[k++] = L[i++];",
    "  while (j < R.length) A[k++] = R[j++];",
    "}",
  ],
  keyTakeaways: [
    "Guaranteed O(n log n): Immune to adversarial inputs that degrade naive Quick Sort.",
    "Stable Divide & Conquer: Ideal for sorting objects by multiple criteria or sorting linked lists.",
    "Space Tradeoff: Requires O(n) auxiliary memory to hold left and right slices during merging.",
  ],
  implemented: true,
  generateSteps: generateMergeSortSteps,
};

