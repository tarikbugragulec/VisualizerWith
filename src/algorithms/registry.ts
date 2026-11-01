import { AlgorithmDefinition, CategoryDefinition } from "@/types/algorithm";
import { SORTING_ALGORITHMS } from "./sorting";
import { SEARCHING_ALGORITHMS } from "./searching";
import { LINEAR_ALGORITHMS } from "./linear";
import { TREE_ALGORITHMS } from "./trees";
import { GRAPH_ALGORITHMS } from "./graphs";
import { DP_ALGORITHMS } from "./dynamic-programming";
import { OTHER_ALGORITHMS } from "./other";

export const ALL_ALGORITHMS: AlgorithmDefinition[] = [
  ...SORTING_ALGORITHMS,
  ...SEARCHING_ALGORITHMS,
  ...LINEAR_ALGORITHMS,
  ...TREE_ALGORITHMS,
  ...GRAPH_ALGORITHMS,
  ...DP_ALGORITHMS,
  ...OTHER_ALGORITHMS,
];

export const ALL_ALGORITHMS_MAP: Record<string, AlgorithmDefinition> =
  Object.fromEntries(ALL_ALGORITHMS.map((algo) => [algo.id, algo]));

export const DSA_CATEGORIES: CategoryDefinition[] = [
  {
    id: "sorting",
    name: "Sorting Algorithms",
    badge: "8 Live",
    description:
      "Compare comparison-based O(n²), divide-and-conquer O(n log n), and linear-time bucket/radix sorting strategies.",
    visualizerType: "array",
    algorithms: [
      { id: "bubble-sort", name: "Bubble Sort", implemented: true, difficulty: "Easy" },
      { id: "selection-sort", name: "Selection Sort", implemented: true, difficulty: "Easy" },
      { id: "insertion-sort", name: "Insertion Sort", implemented: true, difficulty: "Easy" },
      { id: "merge-sort", name: "Merge Sort", implemented: true, difficulty: "Medium" },
      { id: "quick-sort", name: "Quick Sort", implemented: true, difficulty: "Medium" },
      { id: "heap-sort", name: "Heap Sort", implemented: true, difficulty: "Medium" },
      { id: "counting-sort", name: "Counting Sort", implemented: true, difficulty: "Medium" },
      { id: "radix-sort", name: "Radix Sort (LSD)", implemented: true, difficulty: "Hard" },
    ],
  },
  {
    id: "searching",
    name: "Searching Algorithms",
    badge: "4 Live",
    description:
      "Explore sequential scanning and logarithmic interval-halving search techniques over arrays.",
    visualizerType: "array",
    algorithms: [
      { id: "linear-search", name: "Linear Search", implemented: true, difficulty: "Easy" },
      { id: "binary-search", name: "Binary Search", implemented: true, difficulty: "Easy" },
      { id: "jump-search", name: "Jump Search", implemented: true, difficulty: "Medium" },
      { id: "interpolation-search", name: "Interpolation Search", implemented: true, difficulty: "Medium" },
    ],
  },
  {
    id: "linear",
    name: "Linear Data Structures",
    badge: "7 Live",
    description:
      "Visualize contiguous memory buffers, pointer-linked nodes, LIFO stacks, and FIFO queues.",
    visualizerType: "linear",
    algorithms: [
      { id: "array-ops", name: "Static Array", implemented: true, difficulty: "Easy" },
      { id: "dynamic-array", name: "Dynamic Array", implemented: true, difficulty: "Easy" },
      { id: "singly-linked-list", name: "Linked List", implemented: true, difficulty: "Easy" },
      { id: "doubly-linked-list", name: "Doubly Linked List", implemented: true, difficulty: "Medium" },
      { id: "stack", name: "Stack (LIFO)", implemented: true, difficulty: "Easy" },
      { id: "queue", name: "Queue (FIFO)", implemented: true, difficulty: "Easy" },
      { id: "deque", name: "Deque", implemented: true, difficulty: "Medium" },
    ],
  },
  {
    id: "trees",
    name: "Trees & Heaps",
    badge: "7 Live",
    description:
      "Interactive hierarchical structures, self-balancing rotations, prefix tries, and range query trees.",
    visualizerType: "tree",
    algorithms: [
      { id: "binary-tree", name: "Binary Tree Traversals", implemented: true, difficulty: "Easy" },
      { id: "bst", name: "Binary Search Tree (BST)", implemented: true, difficulty: "Medium" },
      { id: "avl-tree", name: "AVL Self-Balancing Tree", implemented: true, difficulty: "Hard" },
      { id: "red-black-tree", name: "Red-Black Tree", implemented: true, difficulty: "Hard" },
      { id: "binary-heap", name: "Binary Heap / Priority Queue", implemented: true, difficulty: "Medium" },
      { id: "trie", name: "Trie (Prefix Tree)", implemented: true, difficulty: "Medium" },
      { id: "segment-tree", name: "Segment Tree", implemented: true, difficulty: "Hard" },
    ],
  },
  {
    id: "graphs",
    name: "Graph Algorithms",
    badge: "8 Live",
    description:
      "Breadth/depth-first exploration, shortest-path relaxation, minimum spanning trees, and DAG ordering.",
    visualizerType: "graph",
    algorithms: [
      { id: "bfs", name: "Breadth-First Search (BFS)", implemented: true, difficulty: "Easy" },
      { id: "dfs", name: "Depth-First Search (DFS)", implemented: true, difficulty: "Easy" },
      { id: "dijkstra", name: "Dijkstra's Shortest Path", implemented: true, difficulty: "Medium" },
      { id: "bellman-ford", name: "Bellman-Ford", implemented: true, difficulty: "Medium" },
      { id: "floyd-warshall", name: "Floyd-Warshall", implemented: true, difficulty: "Hard" },
      { id: "prim", name: "Prim's MST", implemented: true, difficulty: "Medium" },
      { id: "kruskal", name: "Kruskal's MST", implemented: true, difficulty: "Medium" },
      { id: "topological-sort", name: "Topological Sort", implemented: true, difficulty: "Medium" },
    ],
  },
  {
    id: "dynamic-programming",
    name: "Dynamic Programming",
    badge: "6 Live",
    description:
      "Observe memoization tables, overlapping subproblems, and state transitions step by step.",
    visualizerType: "dp-grid",
    algorithms: [
      { id: "fibonacci-dp", name: "Fibonacci Tabulation", implemented: true, difficulty: "Easy" },
      { id: "knapsack-01", name: "0/1 Knapsack", implemented: true, difficulty: "Medium" },
      { id: "lcs", name: "Longest Common Subsequence", implemented: true, difficulty: "Medium" },
      { id: "lis", name: "Longest Increasing Subsequence", implemented: true, difficulty: "Medium" },
      { id: "coin-change", name: "Coin Change", implemented: true, difficulty: "Medium" },
      { id: "grid-paths", name: "Minimum Grid Path Sum", implemented: true, difficulty: "Easy" },
    ],
  },
  {
    id: "other",
    name: "Core Paradigms",
    badge: "6 Live",
    description:
      "Call-stack recursion trees, N-Queens backtracking, greedy intervals, hashing, and sliding windows.",
    visualizerType: "array",
    algorithms: [
      { id: "recursion-tree", name: "Recursion Call Stack", implemented: true, difficulty: "Easy" },
      { id: "backtracking", name: "N-Queens Backtracking", implemented: true, difficulty: "Hard" },
      { id: "greedy", name: "Activity Selection (Greedy)", implemented: true, difficulty: "Medium" },
      { id: "hashing", name: "Hash Table Collision Resolution", implemented: true, difficulty: "Medium" },
      { id: "two-pointers", name: "Two Pointers", implemented: true, difficulty: "Easy" },
      { id: "sliding-window", name: "Sliding Window Maximum", implemented: true, difficulty: "Medium" },
    ],
  },
];

export function getAlgorithmById(id: string): AlgorithmDefinition {
  return ALL_ALGORITHMS_MAP[id] ?? SORTING_ALGORITHMS[0];
}

export function getAlgorithmsByCategory(category: string): AlgorithmDefinition[] {
  return ALL_ALGORITHMS.filter((a) => a.category === category);
}
