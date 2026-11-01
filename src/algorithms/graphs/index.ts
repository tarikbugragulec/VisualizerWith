import {
  AlgorithmDefinition,
  AlgorithmStep,
  GraphEdgeItem,
  GraphNodeItem,
} from "@/types/algorithm";

const BASE_GRAPH_NODES: GraphNodeItem[] = [
  { id: "A", label: "A", distance: "0", x: 16, y: 50, state: "default" },
  { id: "B", label: "B", distance: "∞", x: 40, y: 20, state: "default" },
  { id: "C", label: "C", distance: "∞", x: 40, y: 80, state: "default" },
  { id: "D", label: "D", distance: "∞", x: 66, y: 20, state: "default" },
  { id: "E", label: "E", distance: "∞", x: 66, y: 80, state: "default" },
  { id: "F", label: "F", distance: "∞", x: 86, y: 50, state: "default" },
];

const BASE_GRAPH_EDGES: GraphEdgeItem[] = [
  { from: "A", to: "B", weight: 4, state: "default" },
  { from: "A", to: "C", weight: 2, state: "default" },
  { from: "B", to: "C", weight: 1, state: "default" },
  { from: "B", to: "D", weight: 5, state: "default" },
  { from: "C", to: "E", weight: 8, state: "default" },
  { from: "C", to: "D", weight: 7, state: "default" },
  { from: "D", to: "E", weight: 2, state: "default" },
  { from: "D", to: "F", weight: 6, state: "default" },
  { from: "E", to: "F", weight: 3, state: "default" },
];

function snapshotGraph(params: {
  nodeStates?: Record<string, GraphNodeItem["state"]>;
  distances?: Record<string, string>;
  edgeStates?: Record<string, GraphEdgeItem["state"]>;
  frontierLabel?: string;
  frontier?: string[];
  directed?: boolean;
}): NonNullable<AlgorithmStep["graphData"]> {
  return {
    nodes: BASE_GRAPH_NODES.map((n) => ({
      ...n,
      state: params.nodeStates?.[n.id] ?? "default",
      distance: params.distances?.[n.id] ?? n.distance,
    })),
    edges: BASE_GRAPH_EDGES.map((e) => ({
      ...e,
      directed: params.directed ?? false,
      state:
        params.edgeStates?.[`${e.from}-${e.to}`] ??
        params.edgeStates?.[`${e.to}-${e.from}`] ??
        "default",
    })),
    frontierLabel: params.frontierLabel ?? "Frontier",
    frontier: params.frontier ?? [],
  };
}

function buildGraphSteps(
  frames: {
    title: string;
    description: string;
    codeLine: number;
    type: AlgorithmStep["type"];
    graphData: NonNullable<AlgorithmStep["graphData"]>;
  }[]
): AlgorithmStep[] {
  return frames.map((f, idx) => ({
    stepIndex: idx,
    type: f.type,
    array: [],
    highlightedIndices: [],
    sortedIndices: [],
    graphData: f.graphData,
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

export const GRAPH_ALGORITHMS: AlgorithmDefinition[] = [
  {
    id: "bfs",
    name: "Breadth-First Search (BFS)",
    category: "graphs",
    shortDescription:
      "Explores graph vertices level by level using a FIFO Queue, finding unweighted shortest paths.",
    description:
      "BFS starts at source vertex A and explores all neighbors at distance 1 before visiting vertices at distance 2. Because it uses a FIFO queue, it guarantees finding the minimum number of edges from the source to every reachable vertex in O(V + E) time.",
    complexity: {
      timeBest: "O(V + E)",
      timeAverage: "O(V + E)",
      timeWorst: "O(V + E)",
      spaceWorst: "O(V)",
      stable: true,
      inPlace: false,
    },
    codeLines: [
      "function bfs(graph: Graph, start: string) {",
      "  const queue = [start]; visited.add(start);",
      "  while (queue.length > 0) {",
      "    const u = queue.shift()!;",
      "    for (const v of graph.neighbors(u)) {",
      "      if (!visited.has(v)) { visited.add(v); queue.push(v); }",
      "    }",
      "  }",
      "}",
    ],
    keyTakeaways: [
      "Finds shortest paths in unweighted graphs in O(V + E) linear time.",
      "Uses a FIFO Queue to expand concentric distance layers (d=0, d=1, d=2...).",
    ],
    implemented: true,
    generateSteps: () =>
      buildGraphSteps([
        {
          title: "Initialize BFS Queue with Source A (Level 0)",
          description: "Enqueue start vertex A and mark as visited.",
          codeLine: 2,
          type: "init",
          graphData: snapshotGraph({
            nodeStates: { A: "pivot" },
            distances: { A: "L0", B: "-", C: "-", D: "-", E: "-", F: "-" },
            frontierLabel: "FIFO Queue",
            frontier: ["A"],
          }),
        },
        {
          title: "Dequeue A → Discover Neighbors B and C (Level 1)",
          description: "Visited A and enqueued unvisited neighbors B and C.",
          codeLine: 6,
          type: "compare",
          graphData: snapshotGraph({
            nodeStates: { A: "sorted", B: "comparing", C: "comparing" },
            distances: { A: "L0", B: "L1", C: "L1", D: "-", E: "-", F: "-" },
            edgeStates: { "A-B": "comparing", "A-C": "comparing" },
            frontierLabel: "FIFO Queue",
            frontier: ["B", "C"],
          }),
        },
        {
          title: "Explore Level 1 (B, C) → Discover Level 2 (D, E)",
          description: "Dequeued B and C; discovered D and E at distance 2 hops.",
          codeLine: 6,
          type: "compare",
          graphData: snapshotGraph({
            nodeStates: { A: "sorted", B: "sorted", C: "sorted", D: "comparing", E: "comparing" },
            distances: { A: "L0", B: "L1", C: "L1", D: "L2", E: "L2", F: "-" },
            edgeStates: { "A-B": "sorted", "A-C": "sorted", "B-D": "comparing", "C-E": "comparing" },
            frontierLabel: "FIFO Queue",
            frontier: ["D", "E"],
          }),
        },
        {
          title: "Reach Destination F at Level 3 — BFS Complete!",
          description: "All 6 vertices visited in level-order: A → B, C → D, E → F.",
          codeLine: 8,
          type: "complete",
          graphData: snapshotGraph({
            nodeStates: { A: "sorted", B: "sorted", C: "sorted", D: "sorted", E: "sorted", F: "sorted" },
            distances: { A: "L0", B: "L1", C: "L1", D: "L2", E: "L2", F: "L3" },
            edgeStates: { "A-B": "sorted", "A-C": "sorted", "B-D": "sorted", "C-E": "sorted", "D-F": "sorted" },
            frontierLabel: "FIFO Queue",
            frontier: [],
          }),
        },
      ]),
  },
  {
    id: "dfs",
    name: "Depth-First Search (DFS)",
    category: "graphs",
    shortDescription:
      "Plunges as deep as possible along each branch before backtracking via a LIFO Stack / Recursion.",
    description:
      "DFS explores a path all the way to a dead end before backtracking to the most recent branching vertex. It forms the basis for cycle detection, topological sorting, and Tarjan/Kosaraju strongly connected components.",
    complexity: {
      timeBest: "O(V + E)",
      timeAverage: "O(V + E)",
      timeWorst: "O(V + E)",
      spaceWorst: "O(V)",
      stable: true,
      inPlace: false,
    },
    codeLines: [
      "function dfs(u: string) {",
      "  visited.add(u);",
      "  for (const v of graph.neighbors(u)) {",
      "    if (!visited.has(v)) {",
      "      dfs(v); // Recurse deep before siblings",
      "    }",
      "  }",
      "}",
    ],
    keyTakeaways: [
      "Uses O(V) call stack frames to plunge deep along a single path.",
      "Classifies edges into Tree, Back (cycle!), Forward, and Cross edges.",
    ],
    implemented: true,
    generateSteps: () =>
      buildGraphSteps([
        {
          title: "Start DFS at Vertex A → Plunge to B → D → F",
          description: "Following first unvisited neighbor deeply along path A → B → D → F.",
          codeLine: 5,
          type: "compare",
          graphData: snapshotGraph({
            nodeStates: { A: "sorted", B: "sorted", D: "comparing", F: "pivot" },
            distances: { A: "#1", B: "#2", C: "-", D: "#3", E: "-", F: "#4" },
            edgeStates: { "A-B": "sorted", "B-D": "sorted", "D-F": "comparing" },
            frontierLabel: "Call Stack",
            frontier: ["A", "B", "D", "F"],
          }),
        },
        {
          title: "Continue Deep from F → E → C, Then Backtrack",
          description: "Completed deep chain A → B → D → F → E → C in O(V + E).",
          codeLine: 7,
          type: "complete",
          graphData: snapshotGraph({
            nodeStates: { A: "sorted", B: "sorted", C: "sorted", D: "sorted", E: "sorted", F: "sorted" },
            distances: { A: "#1", B: "#2", C: "#6", D: "#3", E: "#5", F: "#4" },
            edgeStates: { "A-B": "sorted", "B-D": "sorted", "D-F": "sorted", "E-F": "sorted", "C-E": "sorted" },
            frontierLabel: "Call Stack",
            frontier: ["Complete"],
          }),
        },
      ]),
  },
  {
    id: "dijkstra",
    name: "Dijkstra's Shortest Path",
    category: "graphs",
    shortDescription:
      "Greedy Min-Priority Queue algorithm finding shortest paths from a source on non-negative weighted graphs.",
    description:
      "Dijkstra's Algorithm maintains tentative shortest distances dist[v] from source A. At each step it extracts the unvisited vertex u with minimum dist[u] from a Min-Heap and relaxes all outgoing edges (u, v) via dist[v] = min(dist[v], dist[u] + w).",
    complexity: {
      timeBest: "O((V + E) log V)",
      timeAverage: "O((V + E) log V)",
      timeWorst: "O((V + E) log V)",
      spaceWorst: "O(V)",
      stable: true,
      inPlace: false,
    },
    codeLines: [
      "while (!pq.isEmpty()) {",
      "  const [d, u] = pq.extractMin();",
      "  for (const [v, w] of graph.adj(u)) {",
      "    if (dist[u] + w < dist[v]) {",
      "      dist[v] = dist[u] + w; // Edge relaxation",
      "      pq.decreaseKey(v, dist[v]);",
      "    }",
      "  }",
      "}",
    ],
    keyTakeaways: [
      "Requires non-negative edge weights (w ≥ 0) so settled vertices never need re-relaxation.",
      "Optimal O((V + E) log V) with a Binary Heap or O(E + V log V) with a Fibonacci Heap.",
    ],
    implemented: true,
    generateSteps: () =>
      buildGraphSteps([
        {
          title: "Extract A (dist=0) → Relax Edges (A,C)=2 and (A,B)=4",
          description: "Updated dist[C] = 2 and dist[B] = 4 in Min-Priority Queue.",
          codeLine: 5,
          type: "compare",
          graphData: snapshotGraph({
            nodeStates: { A: "sorted", C: "pivot", B: "comparing" },
            distances: { A: "d=0", B: "d=4", C: "d=2", D: "∞", E: "∞", F: "∞" },
            edgeStates: { "A-C": "sorted", "A-B": "comparing" },
            frontierLabel: "Min-Heap PQ",
            frontier: ["C:2", "B:4"],
          }),
        },
        {
          title: "Extract C (dist=2) → Relax (C,B) to Improve dist[B] = 3!",
          description: "Path A → C → B has cost 2 + 1 = 3 < 4! Updated dist[B] = 3 and dist[D] = 9.",
          codeLine: 5,
          type: "swap",
          graphData: snapshotGraph({
            nodeStates: { A: "sorted", C: "sorted", B: "pivot", D: "comparing", E: "comparing" },
            distances: { A: "d=0", B: "d=3", C: "d=2", D: "d=9", E: "d=10", F: "∞" },
            edgeStates: { "A-C": "sorted", "B-C": "sorted", "C-D": "comparing", "C-E": "comparing" },
            frontierLabel: "Min-Heap PQ",
            frontier: ["B:3", "D:9", "E:10"],
          }),
        },
        {
          title: "Relax via B (d=3) → D (d=8) → E (d=10) → F (d=13)",
          description: "Shortest path tree settled! Optimal route A → C → B → D → E → F costs 13.",
          codeLine: 8,
          type: "complete",
          graphData: snapshotGraph({
            nodeStates: { A: "sorted", B: "sorted", C: "sorted", D: "sorted", E: "sorted", F: "sorted" },
            distances: { A: "d=0", B: "d=3", C: "d=2", D: "d=8", E: "d=10", F: "d=13" },
            edgeStates: { "A-C": "sorted", "B-C": "sorted", "B-D": "sorted", "D-E": "sorted", "E-F": "sorted" },
            frontierLabel: "Shortest Path",
            frontier: ["A→C→B→D→E→F (13)"],
          }),
        },
      ]),
  },
  {
    id: "bellman-ford",
    name: "Bellman-Ford",
    category: "graphs",
    shortDescription:
      "Relaxes all E edges V - 1 times to compute shortest paths even with negative edge weights.",
    description:
      "Unlike Dijkstra, Bellman-Ford handles negative edge weights by relaxing every edge in the graph V - 1 times. A V-th pass detects negative-weight cycles if any distance can still be reduced.",
    complexity: {
      timeBest: "O(E)",
      timeAverage: "O(V · E)",
      timeWorst: "O(V · E)",
      spaceWorst: "O(V)",
      stable: true,
      inPlace: true,
    },
    codeLines: [
      "for (let i = 1; i <= V - 1; i++) {",
      "  for (const [u, v, w] of edges) {",
      "    if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;",
      "  }",
      "}",
      "// Pass V checks for negative-weight cycles",
    ],
    keyTakeaways: [
      "Supports negative edge weights and detects reachable negative cycles.",
      "Used in Distance-Vector routing protocols (RIP).",
    ],
    implemented: true,
    generateSteps: () =>
      buildGraphSteps([
        {
          title: "Pass 1: Sweep All E Edges and Relax from A",
          description: "First global edge relaxation sweep updates 1-hop and 2-hop distances.",
          codeLine: 3,
          type: "compare",
          graphData: snapshotGraph({
            nodeStates: { A: "sorted", B: "comparing", C: "comparing", D: "comparing" },
            distances: { A: "0", B: "3", C: "2", D: "8", E: "10", F: "∞" },
            edgeStates: { "A-C": "sorted", "B-C": "sorted", "B-D": "comparing" },
            frontierLabel: "Pass 1 / V-1",
            frontier: ["Relaxed 5 edges"],
          }),
        },
        {
          title: "Pass V-1 Converged & Zero Negative Cycles Detected",
          description: "All shortest path distances converged with no further edge improvements.",
          codeLine: 6,
          type: "complete",
          graphData: snapshotGraph({
            nodeStates: { A: "sorted", B: "sorted", C: "sorted", D: "sorted", E: "sorted", F: "sorted" },
            distances: { A: "0", B: "3", C: "2", D: "8", E: "10", F: "13" },
            edgeStates: { "A-C": "sorted", "B-C": "sorted", "B-D": "sorted", "D-E": "sorted", "E-F": "sorted" },
            frontierLabel: "Converged",
            frontier: ["No Negative Cycle"],
          }),
        },
      ]),
  },
  {
    id: "floyd-warshall",
    name: "Floyd-Warshall",
    category: "graphs",
    shortDescription:
      "All-Pairs Shortest Path dynamic programming algorithm in O(V³) time.",
    description:
      "Floyd-Warshall computes the shortest paths between every pair of vertices (i, j) by considering each vertex k ∈ [1..V] as an intermediate relay: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]).",
    complexity: {
      timeBest: "O(V³)",
      timeAverage: "O(V³)",
      timeWorst: "O(V³)",
      spaceWorst: "O(V²)",
      stable: true,
      inPlace: true,
    },
    codeLines: [
      "for (let k = 0; k < V; k++) {",
      "  for (let i = 0; i < V; i++) {",
      "    for (let j = 0; j < V; j++) {",
      "      dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);",
      "    }",
      "  }",
      "}",
    ],
    keyTakeaways: [
      "Solves All-Pairs Shortest Path in 4 lines of nested loops.",
      "Ideal for dense graphs up to V ≈ 400 vertices.",
    ],
    implemented: true,
    generateSteps: () =>
      buildGraphSteps([
        {
          title: "Intermediate Relay k = C: Improve dist[A][B] via A → C → B",
          description: "Testing vertex C as intermediate pivot: dist[A][C] (2) + dist[C][B] (1) = 3 < 4.",
          codeLine: 4,
          type: "compare",
          graphData: snapshotGraph({
            nodeStates: { C: "pivot", A: "comparing", B: "comparing" },
            distances: { A: "src", B: "via C=3", C: "relay k", D: "via C=9", E: "via C=10", F: "∞" },
            edgeStates: { "A-C": "comparing", "B-C": "comparing" },
            frontierLabel: "Relay Vertex k",
            frontier: ["k = C"],
          }),
        },
        {
          title: "All V Intermediate Relays Complete (V×V Matrix Ready)",
          description: "Every pair (i, j) now holds its exact global shortest path distance.",
          codeLine: 7,
          type: "complete",
          graphData: snapshotGraph({
            nodeStates: { A: "sorted", B: "sorted", C: "sorted", D: "sorted", E: "sorted", F: "sorted" },
            distances: { A: "0", B: "3", C: "2", D: "8", E: "10", F: "13" },
            edgeStates: { "A-C": "sorted", "B-C": "sorted", "B-D": "sorted", "D-E": "sorted", "E-F": "sorted" },
            frontierLabel: "APSP Complete",
            frontier: ["All Pairs Solved"],
          }),
        },
      ]),
  },
  {
    id: "prim",
    name: "Prim's MST",
    category: "graphs",
    shortDescription:
      "Grows a Minimum Spanning Tree from a starting vertex by greedily adding the cheapest cut edge.",
    description:
      "Prim's Algorithm grows a single connected tree one edge at a time. At each step, it selects the minimum-weight edge crossing the cut between vertices already in the MST and vertices outside the MST.",
    complexity: {
      timeBest: "O(E log V)",
      timeAverage: "O(E log V)",
      timeWorst: "O(E log V)",
      spaceWorst: "O(V)",
      stable: true,
      inPlace: false,
    },
    codeLines: [
      "visited.add(start);",
      "while (visited.size < V) {",
      "  const [w, u, v] = minCutEdges.extractMin();",
      "  if (visited.has(v)) continue;",
      "  visited.add(v); mst.push([u, v, w]);",
      "}",
    ],
    keyTakeaways: [
      "Maintains a single connected component throughout execution.",
      "Optimal on dense graphs when paired with a priority queue.",
    ],
    implemented: true,
    generateSteps: () =>
      buildGraphSteps([
        {
          title: "Start Prim's MST at A → Add Cheapest Cut Edges (A,C)=2 & (C,B)=1",
          description: "Added edges (A,C) weight 2 and (C,B) weight 1 across the cut.",
          codeLine: 5,
          type: "compare",
          graphData: snapshotGraph({
            nodeStates: { A: "sorted", C: "sorted", B: "sorted", D: "comparing" },
            distances: { A: "in MST", B: "w=1", C: "w=2", D: "cut=5", E: "cut=8", F: "∞" },
            edgeStates: { "A-C": "sorted", "B-C": "sorted", "B-D": "comparing" },
            frontierLabel: "MST Weight",
            frontier: ["2 + 1 = 3"],
          }),
        },
        {
          title: "Add (B,D)=5, (D,E)=2, and (E,F)=3 — MST Complete (Cost = 13)!",
          description: "Connected all 6 vertices with V - 1 = 5 edges and minimum total weight 13.",
          codeLine: 6,
          type: "complete",
          graphData: snapshotGraph({
            nodeStates: { A: "sorted", B: "sorted", C: "sorted", D: "sorted", E: "sorted", F: "sorted" },
            distances: { A: "MST", B: "w=1", C: "w=2", D: "w=5", E: "w=2", F: "w=3" },
            edgeStates: { "A-C": "sorted", "B-C": "sorted", "B-D": "sorted", "D-E": "sorted", "E-F": "sorted" },
            frontierLabel: "Total MST Cost",
            frontier: ["13 (5 edges)"],
          }),
        },
      ]),
  },
  {
    id: "kruskal",
    name: "Kruskal's MST",
    category: "graphs",
    shortDescription:
      "Sorts all edges by weight and merges disjoint components using Union-Find (DSU).",
    description:
      "Kruskal's Algorithm sorts all edges in ascending order of weight and iterates through them, adding each edge to the Minimum Spanning Tree unless it forms a cycle (checked in nearly O(1) α(V) time via Disjoint Set Union).",
    complexity: {
      timeBest: "O(E log E)",
      timeAverage: "O(E log E)",
      timeWorst: "O(E log E)",
      spaceWorst: "O(V)",
      stable: true,
      inPlace: false,
    },
    codeLines: [
      "edges.sort((a, b) => a.w - b.w);",
      "for (const [u, v, w] of edges) {",
      "  if (dsu.find(u) !== dsu.find(v)) {",
      "    dsu.union(u, v);",
      "    mst.push([u, v, w]);",
      "  }",
      "}",
    ],
    keyTakeaways: [
      "Powered by Disjoint-Set Union (Path Compression + Union by Rank).",
      "Naturally merges multiple disconnected forest components into a single MST.",
    ],
    implemented: true,
    generateSteps: () =>
      buildGraphSteps([
        {
          title: "Pick Globally Lightest Edges: (B,C)=1, (A,C)=2, (D,E)=2, (E,F)=3",
          description: "Union-Find confirms zero cycles among these 4 lightest edges.",
          codeLine: 4,
          type: "compare",
          graphData: snapshotGraph({
            nodeStates: { A: "sorted", B: "sorted", C: "sorted", D: "comparing", E: "comparing", F: "comparing" },
            distances: { A: "Set 1", B: "Set 1", C: "Set 1", D: "Set 2", E: "Set 2", F: "Set 2" },
            edgeStates: { "B-C": "sorted", "A-C": "sorted", "D-E": "sorted", "E-F": "sorted", "A-B": "swapping" },
            frontierLabel: "Skipped Cycle",
            frontier: ["(A,B)=4 skipped!"],
          }),
        },
        {
          title: "Bridge Forest Components with (B,D)=5 — MST Complete!",
          description: "Edge (A,B)=4 was rejected by DSU (cycle A-B-C); (B,D)=5 unites Set 1 and Set 2!",
          codeLine: 5,
          type: "complete",
          graphData: snapshotGraph({
            nodeStates: { A: "sorted", B: "sorted", C: "sorted", D: "sorted", E: "sorted", F: "sorted" },
            distances: { A: "Root A", B: "Root A", C: "Root A", D: "Root A", E: "Root A", F: "Root A" },
            edgeStates: { "B-C": "sorted", "A-C": "sorted", "D-E": "sorted", "E-F": "sorted", "B-D": "sorted" },
            frontierLabel: "Kruskal MST",
            frontier: ["Total Weight = 13"],
          }),
        },
      ]),
  },
  {
    id: "topological-sort",
    name: "Topological Sort",
    category: "graphs",
    shortDescription:
      "Linearly orders vertices of a Directed Acyclic Graph (DAG) so every directed edge u → v has u before v.",
    description:
      "Kahn's Topological Sort repeatedly extracts vertices with in-degree 0 (no unresolved prerequisites), appends them to the linear ordering, and decrements the in-degrees of their outgoing neighbors.",
    complexity: {
      timeBest: "O(V + E)",
      timeAverage: "O(V + E)",
      timeWorst: "O(V + E)",
      spaceWorst: "O(V)",
      stable: true,
      inPlace: false,
    },
    codeLines: [
      "const queue = vertices.filter(v => inDegree[v] === 0);",
      "while (queue.length > 0) {",
      "  const u = queue.shift()!; order.push(u);",
      "  for (const v of dag.adj(u)) {",
      "    if (--inDegree[v] === 0) queue.push(v);",
      "  }",
      "}",
    ],
    keyTakeaways: [
      "Essential for build systems (Webpack, Make, Cargo), task scheduling, and course prerequisites.",
      "Also detects cycles in directed graphs if order.length < V.",
    ],
    implemented: true,
    generateSteps: () =>
      buildGraphSteps([
        {
          title: "Start with In-Degree 0 Source A → Unlock C and B",
          description: "Removed A's outgoing edges, reducing C's in-degree to 0.",
          codeLine: 3,
          type: "compare",
          graphData: snapshotGraph({
            directed: true,
            nodeStates: { A: "sorted", C: "pivot", B: "comparing" },
            distances: { A: "in=0", B: "in=0", C: "in=0", D: "in=1", E: "in=1", F: "in=2" },
            edgeStates: { "A-C": "sorted", "B-C": "comparing" },
            frontierLabel: "Topo Order",
            frontier: ["A", "C", "B"],
          }),
        },
        {
          title: "Valid DAG Topological Order: [A → C → B → D → E → F]",
          description: "Every directed dependency u → v appears with u strictly left of v.",
          codeLine: 6,
          type: "complete",
          graphData: snapshotGraph({
            directed: true,
            nodeStates: { A: "sorted", B: "sorted", C: "sorted", D: "sorted", E: "sorted", F: "sorted" },
            distances: { A: "#1", B: "#3", C: "#2", D: "#4", E: "#5", F: "#6" },
            edgeStates: { "A-C": "sorted", "B-C": "sorted", "B-D": "sorted", "D-E": "sorted", "E-F": "sorted" },
            frontierLabel: "Topological Order",
            frontier: ["A → C → B → D → E → F"],
          }),
        },
      ]),
  },
];

