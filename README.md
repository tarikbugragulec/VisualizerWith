# DSA Workbench — Interactive Algorithm & Data Structure Visualizer

An interactive Data Structures & Algorithms visualization studio built with **TypeScript**, **React 18**, **Next.js 14 (App Router)**, **Tailwind CSS**, **Framer Motion**, and **Zustand**, styled with **Tweakcn / shadcn/ui** CSS variable themes.

## Features

- **Unified Step Snapshot Engine (`StepEngine`)**: Deterministic time-travel playback (`Play`, `Pause`, `Step Forward`, `Step Backward`, `Jump to Next Swap`, timeline scrubbing, `0.25x`–`8x` speed).
- **46 Built-in Modules Across 7 DSA Domains**:
  - **Sorting Algorithms (8)**: Bubble, Selection, Insertion, Merge, Quick, Heap, Counting, Radix Sort (LSD)
  - **Searching Algorithms (4)**: Linear Search, Binary Search, Jump Search, Interpolation Search
  - **Linear Data Structures (7)**: Static Array, Dynamic Array, Singly Linked List, Doubly Linked List, Stack (LIFO), Queue (FIFO), Deque
  - **Trees & Heaps (7)**: Binary Tree Traversals, BST, AVL Self-Balancing Tree, Red-Black Tree, Binary Heap, Trie, Segment Tree
  - **Graph Algorithms (8)**: BFS, DFS, Dijkstra, Bellman-Ford, Floyd-Warshall, Prim's MST, Kruskal's MST, Topological Sort
  - **Dynamic Programming (6)**: Fibonacci Tabulation, 0/1 Knapsack, LCS, LIS, Coin Change, Minimum Grid Path Sum
  - **Core Paradigms (6)**: Recursion Call Stack, N-Queens Backtracking, Activity Selection (Greedy), Hash Table Collision Resolution, Two Pointers, Sliding Window Maximum
- **Custom Algorithm Studio (JS / TypeScript Sandbox)**:
  - Author and persist your own sorting/array algorithms right in the browser using either standard `A[i]` syntax (auto-tracked via JavaScript `Proxy`) or explicit `compare()` / `swap()` calls.
- **Tweakcn Live Theme System**:
  - Built-in presets (`Claude Editorial`, `Vercel Geist`, `Catppuccin`, `Nord`, `Neo-Brutalism`, `Monokai Pro`), Light/Dark toggle, and raw `:root` Tweakcn CSS variable importer.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
