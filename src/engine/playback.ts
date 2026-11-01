export type ArrayPresetType =
  | "random"
  | "nearly-sorted"
  | "reversed"
  | "few-unique";

export const SPEED_PRESETS = [
  { label: "0.25x", multiplier: 0.25, intervalMs: 900 },
  { label: "0.5x", multiplier: 0.5, intervalMs: 550 },
  { label: "1x", multiplier: 1, intervalMs: 300 },
  { label: "2x", multiplier: 2, intervalMs: 140 },
  { label: "4x", multiplier: 4, intervalMs: 55 },
  { label: "8x", multiplier: 8, intervalMs: 20 },
] as const;

export function getIntervalFromSpeed(speedMultiplier: number): number {
  const preset = SPEED_PRESETS.find((p) => p.multiplier === speedMultiplier);
  if (preset) return preset.intervalMs;
  return Math.max(15, Math.round(300 / speedMultiplier));
}

export function generatePresetArray(
  size: number,
  preset: ArrayPresetType = "random",
  minVal = 8,
  maxVal = 99
): number[] {
  const clampedSize = Math.max(4, Math.min(60, size));

  if (preset === "random") {
    return Array.from({ length: clampedSize }, () =>
      Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal
    );
  }

  if (preset === "reversed") {
    const step = (maxVal - minVal) / Math.max(1, clampedSize - 1);
    return Array.from({ length: clampedSize }, (_, i) =>
      Math.round(maxVal - i * step)
    );
  }

  if (preset === "nearly-sorted") {
    const step = (maxVal - minVal) / Math.max(1, clampedSize - 1);
    const arr = Array.from({ length: clampedSize }, (_, i) =>
      Math.round(minVal + i * step)
    );
    for (let i = 0; i < Math.max(2, Math.floor(clampedSize / 4)); i++) {
      const idxA = Math.floor(Math.random() * (clampedSize - 1));
      const idxB = Math.min(clampedSize - 1, idxA + 1 + Math.floor(Math.random() * 2));
      const tmp = arr[idxA];
      arr[idxA] = arr[idxB];
      arr[idxB] = tmp;
    }
    return arr;
  }

  // few-unique
  const uniquePool = [15, 32, 50, 68, 88];
  return Array.from(
    { length: clampedSize },
    () => uniquePool[Math.floor(Math.random() * uniquePool.length)]
  );
}

