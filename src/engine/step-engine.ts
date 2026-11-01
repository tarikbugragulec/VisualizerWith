import {
  AlgorithmStep,
  ArrayBar,
  ElementState,
  StepMetrics,
  StepOperationType,
} from "@/types/algorithm";

export class StepEngine {
  private bars: ArrayBar[];
  private steps: AlgorithmStep[] = [];
  private sortedSet: Set<number> = new Set();
  private pivotIdx: number | undefined = undefined;
  private metrics: StepMetrics = {
    comparisons: 0,
    swaps: 0,
    arrayAccesses: 0,
  };

  constructor(initialValues: number[]) {
    this.bars = initialValues.map((value, idx) => ({
      id: `bar-${idx}-${value}`,
      value,
      state: "default",
    }));

    this.recordStep({
      type: "init",
      highlightedIndices: [],
      codeLine: 1,
      title: "Initial Array State",
      description: `Loaded [${initialValues.join(", ")}] (${initialValues.length} elements) ready for visualization.`,
    });
  }

  public getLength(): number {
    return this.bars.length;
  }

  public getValue(index: number): number {
    this.metrics.arrayAccesses += 1;
    return this.bars[index].value;
  }

  public peekValue(index: number): number {
    return this.bars[index].value;
  }

  public getValues(): number[] {
    return this.bars.map((b) => b.value);
  }

  public getBarClone(index: number): ArrayBar {
    this.metrics.arrayAccesses += 1;
    return { ...this.bars[index] };
  }

  public setPivot(
    index: number | undefined,
    codeLine: number,
    description?: string
  ): void {
    this.pivotIdx = index;
    if (index !== undefined && description) {
      this.recordStep({
        type: "pivot",
        highlightedIndices: [index],
        stateOverride: { [index]: "pivot" },
        codeLine,
        title: `Select Pivot at Index ${index}`,
        description,
      });
    }
  }

  public compare(
    i: number,
    j: number,
    codeLine: number,
    customDescription?: string
  ): number {
    this.metrics.comparisons += 1;
    this.metrics.arrayAccesses += 2;
    const valI = this.bars[i].value;
    const valJ = this.bars[j].value;

    this.recordStep({
      type: "compare",
      highlightedIndices: [i, j],
      stateOverride: {
        [i]: "comparing",
        [j]: "comparing",
      },
      codeLine,
      title: `Compare A[${i}] (${valI}) & A[${j}] (${valJ})`,
      description:
        customDescription ??
        `Comparing element at index ${i} (${valI}) with element at index ${j} (${valJ}).`,
    });

    return valI - valJ;
  }

  public compareValue(
    i: number,
    targetValue: number,
    codeLine: number,
    customDescription?: string
  ): number {
    this.metrics.comparisons += 1;
    this.metrics.arrayAccesses += 1;
    const valI = this.bars[i].value;

    this.recordStep({
      type: "compare",
      highlightedIndices: [i],
      stateOverride: {
        [i]: "comparing",
      },
      codeLine,
      title: `Compare A[${i}] (${valI}) with ${targetValue}`,
      description:
        customDescription ??
        `Comparing element at index ${i} (${valI}) against value ${targetValue}.`,
    });

    return valI - targetValue;
  }

  public swap(
    i: number,
    j: number,
    codeLine: number,
    customDescription?: string
  ): void {
    if (i === j) return;
    this.metrics.swaps += 1;
    this.metrics.arrayAccesses += 4;

    const valI = this.bars[i].value;
    const valJ = this.bars[j].value;

    const temp = this.bars[i];
    this.bars[i] = this.bars[j];
    this.bars[j] = temp;

    this.recordStep({
      type: "swap",
      highlightedIndices: [i, j],
      stateOverride: {
        [i]: "swapping",
        [j]: "swapping",
      },
      codeLine,
      title: `Swap A[${i}] (${valI}) ↔ A[${j}] (${valJ})`,
      description:
        customDescription ??
        `Swapped ${valI} and ${valJ} between positions ${i} and ${j}.`,
    });
  }

  public overwrite(
    index: number,
    newBarOrValue: ArrayBar | number,
    codeLine: number,
    customDescription?: string,
    auxiliaryBuckets?: { label: string; values: number[] }[]
  ): void {
    this.metrics.swaps += 1;
    this.metrics.arrayAccesses += 2;

    const prevVal = this.bars[index].value;
    if (typeof newBarOrValue === "number") {
      this.bars[index] = {
        ...this.bars[index],
        value: newBarOrValue,
      };
    } else {
      const existingIds = new Set(
        this.bars.map((b, idx) => (idx === index ? "" : b.id))
      );
      const safeId = existingIds.has(newBarOrValue.id)
        ? `${newBarOrValue.id}-step-${this.steps.length}-${index}`
        : newBarOrValue.id;

      this.bars[index] = {
        ...newBarOrValue,
        id: safeId,
      };
    }

    const newVal = this.bars[index].value;

    this.recordStep({
      type: "overwrite",
      highlightedIndices: [index],
      stateOverride: {
        [index]: "overwrite",
      },
      auxiliaryBuckets,
      codeLine,
      title: `Write A[${index}] ← ${newVal}`,
      description:
        customDescription ??
        `Updated index ${index} from ${prevVal} to ${newVal}.`,
    });
  }

  public recordBucketStep(
    highlightedIndices: number[],
    auxiliaryBuckets: { label: string; values: number[] }[],
    codeLine: number,
    title: string,
    description: string
  ): void {
    this.metrics.arrayAccesses += highlightedIndices.length;
    const stateOverride: Record<number, ElementState> = {};
    for (const idx of highlightedIndices) {
      stateOverride[idx] = "bucket";
    }
    this.recordStep({
      type: "bucket",
      highlightedIndices,
      stateOverride,
      auxiliaryBuckets,
      codeLine,
      title,
      description,
    });
  }

  public markSorted(
    indices: number | number[],
    codeLine: number,
    customDescription?: string
  ): void {
    const arr = Array.isArray(indices) ? indices : [indices];
    arr.forEach((idx) => this.sortedSet.add(idx));

    this.recordStep({
      type: "mark-sorted",
      highlightedIndices: arr,
      codeLine,
      title:
        arr.length === 1
          ? `Locked A[${arr[0]}] (${this.bars[arr[0]]?.value}) in Final Position`
          : `Marked ${arr.length} Elements as Sorted`,
      description:
        customDescription ??
        (arr.length === 1
          ? `Element ${this.bars[arr[0]]?.value} at index ${arr[0]} is now in its final sorted position.`
          : `Indices [${arr.join(", ")}] are now in their final sorted positions.`),
    });
  }

  public complete(codeLine: number): AlgorithmStep[] {
    this.pivotIdx = undefined;
    for (let i = 0; i < this.bars.length; i++) {
      this.sortedSet.add(i);
    }

    this.recordStep({
      type: "complete",
      highlightedIndices: [],
      codeLine,
      title: "Sorting Complete!",
      description: `All ${this.bars.length} elements are sorted in ascending order: [${this.bars
        .map((b) => b.value)
        .join(", ")}].`,
    });

    return this.steps;
  }

  private recordStep(params: {
    type: StepOperationType;
    highlightedIndices: number[];
    stateOverride?: Record<number, ElementState>;
    auxiliaryBuckets?: { label: string; values: number[] }[];
    codeLine: number;
    title: string;
    description: string;
  }): void {
    const snapshotBars: ArrayBar[] = this.bars.map((bar, idx) => {
      let state: ElementState = "default";
      if (this.sortedSet.has(idx)) {
        state = "sorted";
      }
      if (this.pivotIdx === idx) {
        state = "pivot";
      }
      if (params.stateOverride && params.stateOverride[idx]) {
        state = params.stateOverride[idx];
      }
      return {
        ...bar,
        state,
      };
    });

    this.steps.push({
      stepIndex: this.steps.length,
      type: params.type,
      array: snapshotBars,
      highlightedIndices: [...params.highlightedIndices],
      sortedIndices: Array.from(this.sortedSet),
      pivotIndex: this.pivotIdx,
      auxiliaryBuckets: params.auxiliaryBuckets
        ? params.auxiliaryBuckets.map((b) => ({
            label: b.label,
            values: [...b.values],
          }))
        : undefined,
      codeLine: params.codeLine,
      title: params.title,
      description: params.description,
      metrics: { ...this.metrics },
    });
  }
}

