import {
  AlgorithmDefinition,
  AlgorithmStep,
  DPGridCell,
  DPGridData,
} from "@/types/algorithm";

function buildDPSteps(
  frames: {
    title: string;
    description: string;
    codeLine: number;
    type: AlgorithmStep["type"];
    dpGridData: DPGridData;
  }[]
): AlgorithmStep[] {
  return frames.map((f, idx) => ({
    stepIndex: idx,
    type: f.type,
    array: [],
    highlightedIndices: [],
    sortedIndices: [],
    dpGridData: f.dpGridData,
    codeLine: f.codeLine,
    title: f.title,
    description: f.description,
    metrics: {
      comparisons: idx * 2,
      swaps: idx,
      arrayAccesses: idx * 3,
    },
  }));
}

function makeGrid(
  rowHeaders: string[],
  colHeaders: string[],
  values: (string | number)[][],
  states: Record<string, DPGridCell["state"]> = {},
  title?: string
): DPGridData {
  return {
    title,
    rowHeaders,
    colHeaders,
    cells: values.map((row, r) =>
      row.map((val, c) => ({
        value: val,
        state: states[`${r},${c}`] ?? "default",
      }))
    ),
  };
}

export const DP_ALGORITHMS: AlgorithmDefinition[] = [
  {
    id: "fibonacci-dp",
    name: "Fibonacci Tabulation",
    category: "dynamic-programming",
    shortDescription:
      "Eliminates exponential O(2ⁿ) recursion overhead by tabulating F[i] = F[i-1] + F[i-2] bottom-up.",
    description:
      "Naive recursive Fibonacci recomputes the same overlapping subproblems exponentially many times. Bottom-up DP caches each subproblem in a 1D table from F[0]=0, F[1]=1 up to F[n] in O(n) linear time.",
    complexity: {
      timeBest: "O(n)",
      timeAverage: "O(n)",
      timeWorst: "O(n)",
      spaceWorst: "O(n) or O(1)",
      stable: true,
      inPlace: true,
    },
    codeLines: [
      "function fibDP(n: number): number {",
      "  const dp = [0, 1];",
      "  for (let i = 2; i <= n; i++) {",
      "    dp[i] = dp[i - 1] + dp[i - 2];",
      "  }",
      "  return dp[n];",
      "}",
    ],
    keyTakeaways: [
      "Reduces time complexity from exponential O(2ⁿ) to linear O(n).",
      "Space can be further optimized to O(1) by keeping only the last two values.",
    ],
    implemented: true,
    generateSteps: () => {
      const cols = ["i=0", "i=1", "i=2", "i=3", "i=4", "i=5", "i=6", "i=7", "i=8"];
      const fibs = [0, 1, 1, 2, 3, 5, 8, 13, 21];
      const frames = [
        {
          title: "Base Cases: dp[0] = 0, dp[1] = 1",
          description: "Seed tabulation table with base cases F(0)=0 and F(1)=1.",
          codeLine: 2,
          type: "init" as AlgorithmStep["type"],
          dpGridData: makeGrid(
            ["dp[i]"],
            cols,
            [[0, 1, "—", "—", "—", "—", "—", "—", "—"]],
            { "0,0": "sorted", "0,1": "sorted" },
            "1D Fibonacci DP Table"
          ),
        },
      ];

      for (let i = 2; i <= 8; i++) {
        const row = fibs.map((v, idx) => (idx <= i ? v : "—"));
        const states: Record<string, DPGridCell["state"]> = {};
        for (let k = 0; k < i; k++) states[`0,${k}`] = "sorted";
        states[`0,${i - 2}`] = "comparing";
        states[`0,${i - 1}`] = "comparing";
        states[`0,${i}`] = i === 8 ? "sorted" : "pivot";

        frames.push({
          title: `Compute dp[${i}] = dp[${i - 1}] (${fibs[i - 1]}) + dp[${i - 2}] (${fibs[i - 2]}) = ${fibs[i]}`,
          description: `Added previous two memoized cells in O(1) time to write dp[${i}] = ${fibs[i]}.`,
          codeLine: 4,
          type: i === 8 ? ("complete" as const) : ("overwrite" as const),
          dpGridData: makeGrid(["dp[i]"], cols, [row], states, "1D Fibonacci DP Table"),
        });
      }

      return buildDPSteps(frames);
    },
  },
  {
    id: "knapsack-01",
    name: "0/1 Knapsack",
    category: "dynamic-programming",
    shortDescription:
      "Maximizes total item value within capacity W by deciding whether to include or exclude each item.",
    description:
      "Given n items with weights wt[i] and values val[i], 0/1 Knapsack builds a 2D table dp[i][w] representing the maximum value achievable using a subset of the first i items with capacity w.",
    complexity: {
      timeBest: "O(n · W)",
      timeAverage: "O(n · W)",
      timeWorst: "O(n · W)",
      spaceWorst: "O(n · W)",
      stable: true,
      inPlace: false,
    },
    codeLines: [
      "for (let i = 1; i <= n; i++) {",
      "  for (let w = 0; w <= W; w++) {",
      "    if (wt[i] <= w) {",
      "      dp[i][w] = Math.max(dp[i-1][w], val[i] + dp[i-1][w - wt[i]]);",
      "    } else dp[i][w] = dp[i-1][w];",
      "  }",
      "}",
    ],
    keyTakeaways: [
      "Classic pseudo-polynomial DP problem: dp[i][w] = max(exclude item i, include item i).",
      "Cannot be solved greedily by value-to-weight ratio (unlike Fractional Knapsack).",
    ],
    implemented: true,
    generateSteps: () => {
      const rows = ["Ø (0)", "Item 1 (w=1, v=15)", "Item 2 (w=3, v=20)", "Item 3 (w=4, v=30)"];
      const cols = ["w=0", "w=1", "w=2", "w=3", "w=4", "w=5"];
      return buildDPSteps([
        {
          title: "Initialize 0/1 Knapsack Table (Capacity W = 5)",
          description: "Row 0 (no items) initialized to 0; Item 1 (w=1, v=15) fills capacities w=1..5.",
          codeLine: 2,
          type: "init",
          dpGridData: makeGrid(
            rows,
            cols,
            [
              [0, 0, 0, 0, 0, 0],
              [0, 15, 15, 15, 15, 15],
              [0, "—", "—", "—", "—", "—"],
              [0, "—", "—", "—", "—", "—"],
            ],
            { "1,1": "pivot", "1,2": "sorted", "1,3": "sorted", "1,4": "sorted", "1,5": "sorted" },
            "dp[item][capacity]"
          ),
        },
        {
          title: "Evaluate Item 2 (w=3, v=20): Combine with Item 1 at w=4..5",
          description: "At w=4: max(dp[1][4]=15, 20 + dp[1][1]=35) = 35!",
          codeLine: 4,
          type: "compare",
          dpGridData: makeGrid(
            rows,
            cols,
            [
              [0, 0, 0, 0, 0, 0],
              [0, 15, 15, 15, 15, 15],
              [0, 15, 15, 20, 35, 35],
              [0, "—", "—", "—", "—", "—"],
            ],
            { "1,1": "comparing", "2,4": "pivot", "2,5": "pivot" },
            "dp[item][capacity]"
          ),
        },
        {
          title: "Evaluate Item 3 (w=4, v=30) → Optimal Value = 45 at dp[3][5]",
          description: "At w=5: taking Item 1 (v=15) + Item 3 (v=30) yields maximum value 45!",
          codeLine: 4,
          type: "complete",
          dpGridData: makeGrid(
            rows,
            cols,
            [
              [0, 0, 0, 0, 0, 0],
              [0, 15, 15, 15, 15, 15],
              [0, 15, 15, 20, 35, 35],
              [0, 15, 15, 20, 35, 45],
            ],
            { "1,1": "comparing", "3,5": "sorted" },
            "dp[item][capacity] — Optimal = 45"
          ),
        },
      ]);
    },
  },
  {
    id: "lcs",
    name: "Longest Common Subsequence",
    category: "dynamic-programming",
    shortDescription:
      "Finds the longest subsequence shared by two strings (the core algorithm behind git diff).",
    description:
      "LCS builds a 2D table comparing characters of string A and string B. When A[i-1] == B[j-1], it extends the diagonal match: dp[i][j] = 1 + dp[i-1][j-1]; otherwise it takes max(dp[i-1][j], dp[i][j-1]).",
    complexity: {
      timeBest: "O(m · n)",
      timeAverage: "O(m · n)",
      timeWorst: "O(m · n)",
      spaceWorst: "O(m · n)",
      stable: true,
      inPlace: false,
    },
    codeLines: [
      "if (A[i - 1] === B[j - 1]) {",
      "  dp[i][j] = 1 + dp[i - 1][j - 1]; // Diagonal match!",
      "} else {",
      "  dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);",
      "}",
    ],
    keyTakeaways: [
      "Foundation of Unix diff, git diff, and bioinformatics DNA sequence alignment.",
      "Tracing back from dp[m][n] reconstructs the exact matching subsequence.",
    ],
    implemented: true,
    generateSteps: () => {
      const rows = ["Ø", "A", "C", "D", "B"];
      const cols = ["Ø", "A", "B", "C", "B"];
      return buildDPSteps([
        {
          title: "Match 'A' == 'A' & 'C' == 'C' Along Diagonals",
          description: "Matching characters increment the top-left diagonal value by +1.",
          codeLine: 2,
          type: "compare",
          dpGridData: makeGrid(
            rows,
            cols,
            [
              [0, 0, 0, 0, 0],
              [0, 1, 1, 1, 1],
              [0, 1, 1, 2, 2],
              [0, "—", "—", "—", "—"],
              [0, "—", "—", "—", "—"],
            ],
            { "1,1": "sorted", "2,3": "pivot" },
            "LCS('ACDB', 'ABCB')"
          ),
        },
        {
          title: "Complete Table → LCS Length = 3 ('ACB')",
          description: "Bottom-right cell dp[4][4] = 3 corresponds to longest common subsequence 'ACB'.",
          codeLine: 4,
          type: "complete",
          dpGridData: makeGrid(
            rows,
            cols,
            [
              [0, 0, 0, 0, 0],
              [0, 1, 1, 1, 1],
              [0, 1, 1, 2, 2],
              [0, 1, 1, 2, 2],
              [0, 1, 2, 2, 3],
            ],
            { "1,1": "sorted", "2,3": "sorted", "4,4": "sorted" },
            "LCS('ACDB', 'ABCB') = 3 ('ACB')"
          ),
        },
      ]);
    },
  },
  {
    id: "lis",
    name: "Longest Increasing Subsequence",
    category: "dynamic-programming",
    shortDescription:
      "Computes the length of the longest strictly increasing subsequence in an array.",
    description:
      "For each index i, LIS computes dp[i] = 1 + max({ dp[j] : j < i and A[j] < A[i] }), extending the best valid increasing chain ending before i.",
    complexity: {
      timeBest: "O(n log n)",
      timeAverage: "O(n²)",
      timeWorst: "O(n²)",
      spaceWorst: "O(n)",
      stable: true,
      inPlace: false,
    },
    codeLines: [
      "const dp = new Array(n).fill(1);",
      "for (let i = 1; i < n; i++) {",
      "  for (let j = 0; j < i; j++) {",
      "    if (A[j] < A[i]) dp[i] = Math.max(dp[i], dp[j] + 1);",
      "  }",
      "}",
    ],
    keyTakeaways: [
      "Standard DP runs in O(n²); patience sorting with binary search optimizes it to O(n log n).",
    ],
    implemented: true,
    generateSteps: () => {
      const cols = ["10", "9", "2", "5", "3", "7", "101", "18"];
      return buildDPSteps([
        {
          title: "Extend Increasing Chains Up to A[5] = 7",
          description: "Chain [2 → 5 → 7] or [2 → 3 → 7] reaches length dp[5] = 3.",
          codeLine: 4,
          type: "compare",
          dpGridData: makeGrid(
            ["dp[i]"],
            cols,
            [[1, 1, 1, 2, 2, 3, "—", "—"]],
            { "0,2": "comparing", "0,4": "comparing", "0,5": "pivot" },
            "Input A = [10, 9, 2, 5, 3, 7, 101, 18]"
          ),
        },
        {
          title: "Complete LIS Table → Max Length = 4 ([2, 3, 7, 101])",
          description: "Longest strictly increasing subsequence has length 4.",
          codeLine: 5,
          type: "complete",
          dpGridData: makeGrid(
            ["dp[i]"],
            cols,
            [[1, 1, 1, 2, 2, 3, 4, 4]],
            { "0,2": "sorted", "0,4": "sorted", "0,5": "sorted", "0,6": "sorted" },
            "LIS Max Length = 4"
          ),
        },
      ]);
    },
  },
  {
    id: "coin-change",
    name: "Coin Change",
    category: "dynamic-programming",
    shortDescription:
      "Finds the minimum number of coins needed to make target amount A using bottom-up DP.",
    description:
      "For each amount a from 1 to Target, Coin Change tries every coin c ≤ a and transitions via dp[a] = min(dp[a], 1 + dp[a - c]).",
    complexity: {
      timeBest: "O(A · C)",
      timeAverage: "O(A · C)",
      timeWorst: "O(A · C)",
      spaceWorst: "O(A)",
      stable: true,
      inPlace: false,
    },
    codeLines: [
      "const dp = new Array(amount + 1).fill(Infinity); dp[0] = 0;",
      "for (let a = 1; a <= amount; a++) {",
      "  for (const coin of coins) {",
      "    if (a >= coin) dp[a] = Math.min(dp[a], 1 + dp[a - coin]);",
      "  }",
      "}",
    ],
    keyTakeaways: [
      "Greedy largest-coin-first fails on canonical counterexamples like Coins=[1, 3, 4] for Amount=6 (Greedy gives 4+1+1=3 coins; DP finds 3+3=2 coins!).",
    ],
    implemented: true,
    generateSteps: () => {
      const cols = ["Amt 0", "Amt 1", "Amt 2", "Amt 3", "Amt 4", "Amt 5", "Amt 6"];
      return buildDPSteps([
        {
          title: "Coins = [1, 3, 4]: Fill Amounts 0..4",
          description: "dp[0]=0, dp[1]=1, dp[2]=2, dp[3]=1 (coin 3), dp[4]=1 (coin 4).",
          codeLine: 4,
          type: "compare",
          dpGridData: makeGrid(
            ["Min Coins"],
            cols,
            [[0, 1, 2, 1, 1, "—", "—"]],
            { "0,3": "sorted", "0,4": "pivot" },
            "Coins = [1, 3, 4], Target = 6"
          ),
        },
        {
          title: "Solve Amount 6: dp[6] = 1 + dp[6 - 3] = 2 Coins (3 + 3)!",
          description: "DP beats greedy (4+1+1 = 3 coins) by discovering 3 + 3 = 2 coins!",
          codeLine: 4,
          type: "complete",
          dpGridData: makeGrid(
            ["Min Coins"],
            cols,
            [[0, 1, 2, 1, 1, 2, 2]],
            { "0,3": "comparing", "0,6": "sorted" },
            "Optimal for Amount 6 = 2 Coins (3 + 3)"
          ),
        },
      ]);
    },
  },
  {
    id: "grid-paths",
    name: "Minimum Grid Path Sum",
    category: "dynamic-programming",
    shortDescription:
      "Finds the minimum-cost path from top-left (0,0) to bottom-right (m-1, n-1) moving right or down.",
    description:
      "Each cell (r, c) can only be reached from above (r-1, c) or from the left (r, c-1), yielding the recurrence dp[r][c] = grid[r][c] + min(dp[r-1][c], dp[r][c-1]).",
    complexity: {
      timeBest: "O(m · n)",
      timeAverage: "O(m · n)",
      timeWorst: "O(m · n)",
      spaceWorst: "O(n)",
      stable: true,
      inPlace: true,
    },
    codeLines: [
      "for (let r = 0; r < m; r++) {",
      "  for (let c = 0; c < n; c++) {",
      "    if (r > 0 && c > 0) dp[r][c] += Math.min(dp[r-1][c], dp[r][c-1]);",
      "    else if (r > 0) dp[r][c] += dp[r-1][c];",
      "    else if (c > 0) dp[r][c] += dp[r][c-1];",
      "  }",
      "}",
    ],
    keyTakeaways: [
      "Can be computed in-place by overwriting the input matrix.",
    ],
    implemented: true,
    generateSteps: () => {
      const rows = ["Row 0", "Row 1", "Row 2"];
      const cols = ["Col 0", "Col 1", "Col 2"];
      return buildDPSteps([
        {
          title: "Accumulate First Row & First Column Prefix Sums",
          description: "Top edge and left edge have only one incoming direction.",
          codeLine: 4,
          type: "compare",
          dpGridData: makeGrid(
            rows,
            cols,
            [
              [1, 4, 5],
              [2, "?", "?"],
              [6, "?", "?"],
            ],
            { "0,0": "sorted", "0,1": "sorted", "0,2": "sorted", "1,0": "sorted", "2,0": "sorted" },
            "Grid Path Cumulative Cost"
          ),
        },
        {
          title: "Optimal Path Reaches (2,2) with Minimum Sum = 7!",
          description: "Path (0,0)→(0,1)→(0,2)→(1,2)→(2,2) achieves minimum cost 7.",
          codeLine: 3,
          type: "complete",
          dpGridData: makeGrid(
            rows,
            cols,
            [
              [1, 4, 5],
              [2, 7, 6],
              [6, 8, 7],
            ],
            { "0,0": "sorted", "0,1": "sorted", "0,2": "sorted", "1,2": "sorted", "2,2": "sorted" },
            "Minimum Path Sum = 7"
          ),
        },
      ]);
    },
  },
];
