import { StepEngine } from "@/engine/step-engine";
import { AlgorithmDefinition, AlgorithmStep, ArrayBar } from "@/types/algorithm";

export function generateRadixSortSteps(
  initialValues: number[]
): AlgorithmStep[] {
  const engine = new StepEngine(initialValues);
  const n = engine.getLength();
  const maxVal = Math.max(...initialValues, 1);

  for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10) {
    const placeName =
      exp === 1 ? "1s (Units)" : exp === 10 ? "10s (Tens)" : `${exp}s`;

    const buckets: ArrayBar[][] = Array.from({ length: 10 }, () => []);

    const serializeBuckets = () =>
      buckets.map((b, digit) => ({
        label: `Digit ${digit}`,
        values: b.map((item) => item.value),
      }));

    for (let i = 0; i < n; i++) {
      const bar = engine.getBarClone(i);
      const digit = Math.floor(bar.value / exp) % 10;
      buckets[digit].push(bar);

      engine.recordBucketStep(
        [i],
        serializeBuckets(),
        5,
        `${placeName} Pass: Bucket A[${i}] = ${bar.value} → Digit ${digit}`,
        `Extracted ${placeName.toLowerCase()} digit ${digit} from ${
          bar.value
        } and placed it into Bucket ${digit}.`
      );
    }

    let writeIdx = 0;
    for (let digit = 0; digit < 10; digit++) {
      while (buckets[digit].length > 0) {
        const bar = buckets[digit].shift()!;
        engine.overwrite(
          writeIdx,
          bar,
          9,
          `${placeName} Pass: Collect ${bar.value} from Bucket ${digit} into A[${writeIdx}].`,
          serializeBuckets()
        );
        if (Math.floor(maxVal / (exp * 10)) === 0) {
          engine.markSorted(
            writeIdx,
            10,
            `Final digit pass: A[${writeIdx}] = ${bar.value} is now in final sorted order.`
          );
        }
        writeIdx++;
      }
    }
  }

  return engine.complete(13);
}

export const radixSortDefinition: AlgorithmDefinition = {
  id: "radix-sort",
  name: "Radix Sort (LSD)",
  category: "sorting",
  shortDescription:
    "Non-comparative integer sort that processes digits from least significant (1s) to most significant (10s, 100s).",
  description:
    "LSD (Least Significant Digit) Radix Sort sorts integers digit by digit starting from the units place (1s), then the tens place (10s), and so on. In each pass, elements are distributed into 10 buckets (0–9) according to their current digit and collected back in FIFO order. Because bucket collection is stable, earlier digit orderings are preserved when higher digits tie.",
  complexity: {
    timeBest: "O(d · (n + b))",
    timeAverage: "O(d · (n + b))",
    timeWorst: "O(d · (n + b))",
    spaceWorst: "O(n + b)",
    stable: true,
    inPlace: false,
  },
  codeLines: [
    "function radixSortLSD(A: number[]) {",
    "  const max = Math.max(...A);",
    "  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {",
    "    const buckets: number[][] = Array.from({ length: 10 }, () => []);",
    "    for (let i = 0; i < A.length; i++) {",
    "      const digit = Math.floor(A[i] / exp) % 10;",
    "      buckets[digit].push(A[i]);",
    "    }",
    "    // Stable collection from buckets 0..9 back into A",
    "    let idx = 0;",
    "    for (let d = 0; d < 10; d++) {",
    "      for (const val of buckets[d]) A[idx++] = val;",
    "    }",
    "  }",
    "}",
  ],
  keyTakeaways: [
    "Linear-Time Scaling: Processes d digits in O(d · (n + 10)) time with zero element-to-element comparisons.",
    "Stability is Crucial: Each pass must preserve previous pass order so ties in higher digits stay sorted by lower digits.",
    "Visual Bucket Queues: Watch the 10 digit buckets (0–9) fill and drain during the 1s and 10s passes.",
  ],
  implemented: true,
  generateSteps: generateRadixSortSteps,
};

