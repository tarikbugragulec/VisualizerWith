import { create } from "zustand";
import { getAlgorithmById } from "@/algorithms/registry";
import {
  convertCustomRecordToDefinition,
  CUSTOM_ALGORITHM_TEMPLATES,
  CustomAlgorithmRecord,
} from "@/engine/custom-runner";
import { ArrayPresetType, generatePresetArray } from "@/engine/playback";
import { AlgorithmDefinition, AlgorithmStep } from "@/types/algorithm";

export type TweakcnThemeId =
  | "claude"
  | "vercel"
  | "catppuccin"
  | "nord"
  | "neobrutalism"
  | "monokai";

const STORAGE_KEY = "dsa-custom-algorithms-v1";

const DEFAULT_CUSTOM_ALGORITHMS: CustomAlgorithmRecord[] = [
  {
    id: "custom-shell-sort",
    name: "Shell Sort (Custom)",
    shortDescription: CUSTOM_ALGORITHM_TEMPLATES[0].shortDescription,
    timeComplexity: CUSTOM_ALGORITHM_TEMPLATES[0].timeComplexity,
    spaceComplexity: CUSTOM_ALGORITHM_TEMPLATES[0].spaceComplexity,
    code: CUSTOM_ALGORITHM_TEMPLATES[0].code,
    createdAt: 1700000000000,
  },
];

function loadSavedCustomAlgorithms(): CustomAlgorithmRecord[] {
  if (typeof window === "undefined") return DEFAULT_CUSTOM_ALGORITHMS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CUSTOM_ALGORITHMS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : DEFAULT_CUSTOM_ALGORITHMS;
  } catch {
    return DEFAULT_CUSTOM_ALGORITHMS;
  }
}

function persistCustomAlgorithms(list: CustomAlgorithmRecord[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore storage quota errors
  }
}

interface VisualizerState {
  activeView: "visualizer" | "dashboard";
  selectedAlgorithmId: string;
  arraySize: number;
  presetType: ArrayPresetType;
  initialArray: number[];
  steps: AlgorithmStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  speedMultiplier: number;
  soundEnabled: boolean;
  themePreset: TweakcnThemeId;
  colorMode: "dark" | "light";

  customAlgorithms: CustomAlgorithmRecord[];
  isCustomModalOpen: boolean;
  editingCustomId: string | null;

  setActiveView: (view: "visualizer" | "dashboard") => void;
  selectAlgorithm: (algorithmId: string) => void;
  setArraySize: (size: number) => void;
  generateNewArray: (preset?: ArrayPresetType) => void;
  setCustomArray: (values: number[]) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  goToStep: (index: number) => void;
  resetToStart: () => void;
  setSpeed: (multiplier: number) => void;
  toggleSound: () => void;
  setThemePreset: (preset: TweakcnThemeId) => void;
  toggleColorMode: () => void;

  hydrateCustomAlgorithms: () => void;
  openCustomModal: (editId?: string | null) => void;
  closeCustomModal: () => void;
  saveCustomAlgorithm: (
    data: Omit<CustomAlgorithmRecord, "id" | "createdAt"> & { id?: string }
  ) => void;
  deleteCustomAlgorithm: (id: string) => void;
  resolveAlgorithm: (id?: string) => AlgorithmDefinition;
}

const DEFAULT_ARRAY = [48, 22, 76, 15, 63, 34, 89, 19, 55, 41, 70, 28, 94, 12, 60, 37];

function resolveAlgoDefinition(
  algorithmId: string,
  customList: CustomAlgorithmRecord[]
): AlgorithmDefinition {
  const customMatch = customList.find((c) => c.id === algorithmId);
  if (customMatch) {
    return convertCustomRecordToDefinition(customMatch);
  }
  return getAlgorithmById(algorithmId);
}

function buildStepsForAlgorithm(
  algorithmId: string,
  values: number[],
  customList: CustomAlgorithmRecord[]
): AlgorithmStep[] {
  const algo = resolveAlgoDefinition(algorithmId, customList);
  if (algo.generateSteps) {
    return algo.generateSteps(values);
  }
  return [];
}

export const useVisualizerStore = create<VisualizerState>((set, get) => ({
  activeView: "visualizer",
  selectedAlgorithmId: "bubble-sort",
  arraySize: DEFAULT_ARRAY.length,
  presetType: "random",
  initialArray: DEFAULT_ARRAY,
  steps: buildStepsForAlgorithm(
    "bubble-sort",
    DEFAULT_ARRAY,
    DEFAULT_CUSTOM_ALGORITHMS
  ),
  currentStepIndex: 0,
  isPlaying: false,
  speedMultiplier: 1,
  soundEnabled: false,
  themePreset: "claude",
  colorMode: "dark",

  customAlgorithms: DEFAULT_CUSTOM_ALGORITHMS,
  isCustomModalOpen: false,
  editingCustomId: null,

  setActiveView: (view) => set({ activeView: view, isPlaying: false }),

  selectAlgorithm: (algorithmId) => {
    const { initialArray, customAlgorithms } = get();
    const steps = buildStepsForAlgorithm(
      algorithmId,
      initialArray,
      customAlgorithms
    );
    set({
      selectedAlgorithmId: algorithmId,
      steps,
      currentStepIndex: 0,
      isPlaying: false,
      activeView: "visualizer",
    });
  },

  setArraySize: (size) => {
    const { presetType, selectedAlgorithmId, customAlgorithms } = get();
    const newArr = generatePresetArray(size, presetType);
    const steps = buildStepsForAlgorithm(
      selectedAlgorithmId,
      newArr,
      customAlgorithms
    );
    set({
      arraySize: size,
      initialArray: newArr,
      steps,
      currentStepIndex: 0,
      isPlaying: false,
    });
  },

  generateNewArray: (preset) => {
    const { arraySize, presetType, selectedAlgorithmId, customAlgorithms } =
      get();
    const targetPreset = preset ?? presetType;
    const newArr = generatePresetArray(arraySize, targetPreset);
    const steps = buildStepsForAlgorithm(
      selectedAlgorithmId,
      newArr,
      customAlgorithms
    );
    set({
      presetType: targetPreset,
      initialArray: newArr,
      steps,
      currentStepIndex: 0,
      isPlaying: false,
    });
  },

  setCustomArray: (values) => {
    const cleaned = values
      .filter((n) => Number.isFinite(n))
      .map((n) => Math.max(1, Math.min(999, Math.round(n))))
      .slice(0, 60);

    if (cleaned.length < 2) return;
    const { selectedAlgorithmId, customAlgorithms } = get();
    const steps = buildStepsForAlgorithm(
      selectedAlgorithmId,
      cleaned,
      customAlgorithms
    );
    set({
      arraySize: cleaned.length,
      initialArray: cleaned,
      steps,
      currentStepIndex: 0,
      isPlaying: false,
    });
  },

  play: () => {
    const { currentStepIndex, steps } = get();
    if (currentStepIndex >= steps.length - 1) {
      set({ currentStepIndex: 0, isPlaying: true });
    } else {
      set({ isPlaying: true });
    }
  },

  pause: () => set({ isPlaying: false }),

  togglePlay: () => {
    const { isPlaying, play, pause } = get();
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  },

  stepForward: () => {
    const { currentStepIndex, steps } = get();
    if (currentStepIndex < steps.length - 1) {
      set({ currentStepIndex: currentStepIndex + 1 });
    } else {
      set({ isPlaying: false });
    }
  },

  stepBackward: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex > 0) {
      set({ currentStepIndex: currentStepIndex - 1, isPlaying: false });
    }
  },

  goToStep: (index) => {
    const { steps } = get();
    const clamped = Math.max(0, Math.min(steps.length - 1, index));
    set({ currentStepIndex: clamped });
  },

  resetToStart: () => set({ currentStepIndex: 0, isPlaying: false }),

  setSpeed: (multiplier) => set({ speedMultiplier: multiplier }),

  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

  setThemePreset: (preset) => set({ themePreset: preset }),

  toggleColorMode: () =>
    set((state) => ({
      colorMode: state.colorMode === "dark" ? "light" : "dark",
    })),

  hydrateCustomAlgorithms: () => {
    const loaded = loadSavedCustomAlgorithms();
    set({ customAlgorithms: loaded });
  },

  openCustomModal: (editId = null) =>
    set({ isCustomModalOpen: true, editingCustomId: editId, isPlaying: false }),

  closeCustomModal: () =>
    set({ isCustomModalOpen: false, editingCustomId: null }),

  saveCustomAlgorithm: (data) => {
    const { customAlgorithms, initialArray } = get();
    const id = data.id ?? `custom-${Date.now()}`;
    const record: CustomAlgorithmRecord = {
      id,
      name: data.name.trim() || "Custom Sort",
      shortDescription:
        data.shortDescription.trim() ||
        "User-authored custom algorithm in the interactive JS/TS playground.",
      timeComplexity: data.timeComplexity.trim() || "O(n²)",
      spaceComplexity: data.spaceComplexity.trim() || "O(1)",
      code: data.code,
      createdAt: Date.now(),
    };

    const exists = customAlgorithms.some((c) => c.id === id);
    const updated = exists
      ? customAlgorithms.map((c) => (c.id === id ? record : c))
      : [record, ...customAlgorithms];

    persistCustomAlgorithms(updated);

    const steps = buildStepsForAlgorithm(id, initialArray, updated);
    set({
      customAlgorithms: updated,
      selectedAlgorithmId: id,
      steps,
      currentStepIndex: 0,
      isPlaying: true,
      isCustomModalOpen: false,
      editingCustomId: null,
      activeView: "visualizer",
    });
  },

  deleteCustomAlgorithm: (id) => {
    const { customAlgorithms, selectedAlgorithmId, initialArray } = get();
    const updated = customAlgorithms.filter((c) => c.id !== id);
    persistCustomAlgorithms(updated);

    const nextAlgoId =
      selectedAlgorithmId === id ? "bubble-sort" : selectedAlgorithmId;
    const steps = buildStepsForAlgorithm(nextAlgoId, initialArray, updated);

    set({
      customAlgorithms: updated,
      selectedAlgorithmId: nextAlgoId,
      steps,
      currentStepIndex: 0,
      isPlaying: false,
    });
  },

  resolveAlgorithm: (id) => {
    const { selectedAlgorithmId, customAlgorithms } = get();
    return resolveAlgoDefinition(id ?? selectedAlgorithmId, customAlgorithms);
  },
}));
