import {
  AlgorithmDefinition,
  AlgorithmStep,
  TreeEdgeItem,
  TreeNodeItem,
} from "@/types/algorithm";

const BASE_TREE_NODES: TreeNodeItem[] = [
  { id: "n50", label: "50", subLabel: "root", x: 50, y: 15, state: "default" },
  { id: "n30", label: "30", x: 28, y: 42, state: "default" },
  { id: "n70", label: "70", x: 72, y: 42, state: "default" },
  { id: "n20", label: "20", x: 16, y: 74, state: "default" },
  { id: "n40", label: "40", x: 38, y: 74, state: "default" },
  { id: "n60", label: "60", x: 62, y: 74, state: "default" },
  { id: "n80", label: "80", x: 84, y: 74, state: "default" },
];

const BASE_TREE_EDGES: TreeEdgeItem[] = [
  { from: "n50", to: "n30", state: "default" },
  { from: "n50", to: "n70", state: "default" },
  { from: "n30", to: "n20", state: "default" },
  { from: "n30", to: "n40", state: "default" },
  { from: "n70", to: "n60", state: "default" },
  { from: "n70", to: "n80", state: "default" },
];

function cloneTree(
  nodeStates: Record<string, TreeNodeItem["state"]> = {},
  edgeStates: Record<string, TreeEdgeItem["state"]> = {},
  traversalOrder: string[] = [],
  customNodes?: TreeNodeItem[],
  customEdges?: TreeEdgeItem[]
): NonNullable<AlgorithmStep["treeData"]> {
  const srcNodes = customNodes ?? BASE_TREE_NODES;
  const srcEdges = customEdges ?? BASE_TREE_EDGES;
  return {
    nodes: srcNodes.map((n) => ({
      ...n,
      state: nodeStates[n.id] ?? n.state ?? "default",
    })),
    edges: srcEdges.map((e) => ({
      ...e,
      state: edgeStates[`${e.from}-${e.to}`] ?? e.state ?? "default",
    })),
    traversalOrder,
  };
}

function buildTreeSteps(
  frames: {
    title: string;
    description: string;
    codeLine: number;
    type: AlgorithmStep["type"];
    treeData: NonNullable<AlgorithmStep["treeData"]>;
  }[]
): AlgorithmStep[] {
  return frames.map((f, idx) => ({
    stepIndex: idx,
    type: f.type,
    array: [],
    highlightedIndices: [],
    sortedIndices: [],
    treeData: f.treeData,
    codeLine: f.codeLine,
    title: f.title,
    description: f.description,
    metrics: {
      comparisons: idx,
      swaps: Math.floor(idx / 2),
      arrayAccesses: idx * 2,
    },
  }));
}

export const TREE_ALGORITHMS: AlgorithmDefinition[] = [
  {
    id: "binary-tree",
    name: "Binary Tree Traversals",
    category: "trees",
    shortDescription:
      "In-Order (LNR), Pre-Order (NLR), and Post-Order (LRN) depth-first recursive tree walks.",
    description:
      "Binary Tree traversals visit every node in O(n) time. On a Binary Search Tree, an In-Order traversal (Left → Node → Right) visits keys in strictly non-decreasing sorted order.",
    complexity: {
      timeBest: "O(n)",
      timeAverage: "O(n)",
      timeWorst: "O(n)",
      spaceWorst: "O(h)",
      stable: true,
      inPlace: true,
    },
    codeLines: [
      "function inOrder(node: TreeNode | null) {",
      "  if (!node) return;",
      "  inOrder(node.left);      // 1. Visit Left Subtree",
      "  visit(node.val);         // 2. Process Current Node",
      "  inOrder(node.right);     // 3. Visit Right Subtree",
      "}",
    ],
    keyTakeaways: [
      "In-Order (LNR) yields sorted output on any BST.",
      "Pre-Order (NLR) is used to clone/serialize trees; Post-Order (LRN) computes subtree sizes.",
    ],
    implemented: true,
    generateSteps: () => {
      const order = ["n20", "n30", "n40", "n50", "n60", "n70", "n80"];
      const labels: Record<string, string> = {
        n20: "20",
        n30: "30",
        n40: "40",
        n50: "50",
        n60: "60",
        n70: "70",
        n80: "80",
      };
      const visited: string[] = [];
      const states: Record<string, TreeNodeItem["state"]> = {};

      const frames = [
        {
          title: "Initialize In-Order Traversal (Left → Root → Right)",
          description: "Starting recursive descent from Root (50) down to the leftmost leaf (20).",
          codeLine: 1,
          type: "init" as AlgorithmStep["type"],
          treeData: cloneTree({ n50: "pivot" }, {}, []),
        },
      ];

      order.forEach((id) => {
        Object.keys(states).forEach((k) => (states[k] = "sorted"));
        states[id] = "comparing";
        visited.push(labels[id]);
        frames.push({
          title: `Visit Node ${labels[id]}`,
          description: `In-Order Output so far: [${visited.join(" → ")}].`,
          codeLine: 4,
          type: id === "n80" ? ("complete" as const) : ("compare" as const),
          treeData: cloneTree({ ...states }, {}, [...visited]),
        });
      });

      return buildTreeSteps(frames);
    },
  },
  {
    id: "bst",
    name: "Binary Search Tree (BST)",
    category: "trees",
    shortDescription:
      "Ordered binary tree where Left < Node < Right, enabling O(log n) average search and insertion.",
    description:
      "A Binary Search Tree maintains the invariant that every key in the left subtree is smaller than the parent and every key in the right subtree is larger. Searching or inserting compares the target against the current node and branches left or right.",
    complexity: {
      timeBest: "O(log n)",
      timeAverage: "O(log n)",
      timeWorst: "O(n)",
      spaceWorst: "O(h)",
      stable: true,
      inPlace: true,
    },
    codeLines: [
      "function searchBST(root: Node | null, key: number): Node | null {",
      "  if (!root || root.val === key) return root;",
      "  if (key < root.val) return searchBST(root.left, key);",
      "  return searchBST(root.right, key);",
      "}",
    ],
    keyTakeaways: [
      "Halves search space at each level when balanced (height h ≈ log₂ n).",
      "Can degenerate into an O(n) linked list if sorted keys are inserted without rebalancing.",
    ],
    implemented: true,
    generateSteps: () =>
      buildTreeSteps([
        {
          title: "Search & Insert Key = 60 in BST",
          description: "Start at Root (50). Compare target 60 with 50.",
          codeLine: 1,
          type: "init",
          treeData: cloneTree({ n50: "comparing" }, {}, ["Probe 50"]),
        },
        {
          title: "60 > 50 → Branch Right to Node 70",
          description: "Eliminated entire left subtree (20, 30, 40) in a single comparison!",
          codeLine: 4,
          type: "compare",
          treeData: cloneTree(
            { n50: "overwrite", n70: "comparing" },
            { "n50-n70": "active" },
            ["50", "→ 70"]
          ),
        },
        {
          title: "60 < 70 → Branch Left to Node 60",
          description: "Target 60 is smaller than 70, so follow left child pointer.",
          codeLine: 3,
          type: "compare",
          treeData: cloneTree(
            { n50: "overwrite", n70: "overwrite", n60: "sorted" },
            { "n50-n70": "sorted", "n70-n60": "sorted" },
            ["50", "→ 70", "→ 60 (Found!)"]
          ),
        },
      ]),
  },
  {
    id: "avl-tree",
    name: "AVL Self-Balancing Tree",
    category: "trees",
    shortDescription:
      "Strictly height-balanced BST where |height(L) - height(R)| ≤ 1 for every node via rotations.",
    description:
      "Invented by Adelson-Velsky and Landis in 1962, an AVL Tree tracks each node's balance factor (BF = height(left) - height(right)). Whenever an insertion or deletion causes |BF| = 2, it performs O(1) Left or Right tree rotations to restore strict O(log n) height.",
    complexity: {
      timeBest: "O(log n)",
      timeAverage: "O(log n)",
      timeWorst: "O(log n)",
      spaceWorst: "O(n)",
      stable: true,
      inPlace: true,
    },
    codeLines: [
      "function rotateRight(y: AVLNode): AVLNode {",
      "  const x = y.left;",
      "  const T2 = x.right;",
      "  x.right = y;  // Promote x as new subtree root",
      "  y.left = T2;  // Reattach T2",
      "  updateHeights(y, x);",
      "  return x;",
      "}",
    ],
    keyTakeaways: [
      "Guarantees worst-case height ≤ 1.44 log₂(n).",
      "Four rotation cases: Left-Left (Right Rotate), Right-Right (Left Rotate), Left-Right, Right-Left.",
    ],
    implemented: true,
    generateSteps: () =>
      buildTreeSteps([
        {
          title: "Unbalanced Left-Left Chain (70 → 50 → 30)",
          description: "Node 70 has Balance Factor = +2 (Left-heavy violation).",
          codeLine: 1,
          type: "init",
          treeData: {
            nodes: [
              { id: "a70", label: "70", subLabel: "BF=+2", x: 65, y: 16, state: "swapping" },
              { id: "a50", label: "50", subLabel: "BF=+1", x: 45, y: 45, state: "comparing" },
              { id: "a30", label: "30", subLabel: "BF=0", x: 25, y: 75, state: "pivot" },
            ],
            edges: [
              { from: "a70", to: "a50", state: "active" },
              { from: "a50", to: "a30", state: "active" },
            ],
            traversalOrder: ["Violation at 70 (BF=+2)"],
          },
        },
        {
          title: "Perform Right Rotation Around Pivot 50",
          description: "Promote 50 to root and swing 70 down as right child of 50.",
          codeLine: 4,
          type: "swap",
          treeData: {
            nodes: [
              { id: "a50", label: "50", subLabel: "BF=0", x: 50, y: 20, state: "sorted" },
              { id: "a30", label: "30", subLabel: "BF=0", x: 28, y: 60, state: "sorted" },
              { id: "a70", label: "70", subLabel: "BF=0", x: 72, y: 60, state: "sorted" },
            ],
            edges: [
              { from: "a50", to: "a30", state: "sorted" },
              { from: "a50", to: "a70", state: "sorted" },
            ],
            traversalOrder: ["Balanced! Height reduced from 3 to 2"],
          },
        },
      ]),
  },
  {
    id: "red-black-tree",
    name: "Red-Black Tree",
    category: "trees",
    shortDescription:
      "Color-invariant balanced BST (used in C++ std::map and Java TreeMap) with at most 2 rotations per insert.",
    description:
      "A Red-Black Tree colors each node Red or Black such that: (1) Root is Black, (2) Red nodes cannot have Red children, and (3) every path from root to null has the same number of Black nodes (Black-Height). This guarantees height ≤ 2 log₂(n + 1).",
    complexity: {
      timeBest: "O(log n)",
      timeAverage: "O(log n)",
      timeWorst: "O(log n)",
      spaceWorst: "O(n)",
      stable: true,
      inPlace: true,
    },
    codeLines: [
      "// Fix Red-Red violation after inserting Red node z",
      "if (uncle(z).color === RED) {",
      "  parent(z).color = BLACK; uncle(z).color = BLACK;",
      "  grandparent(z).color = RED; // Recolor & bubble up",
      "} else {",
      "  rotateAndRecolor(z); // At most 2 tree rotations",
      "}",
    ],
    keyTakeaways: [
      "Faster insertions/deletions than AVL because rebalancing requires at most 2 rotations.",
      "Powers Linux kernel CFS scheduler, C++ std::map, and Java TreeMap.",
    ],
    implemented: true,
    generateSteps: () =>
      buildTreeSteps([
        {
          title: "Insert Red Node (40) Under Red Parent (30)",
          description: "Red-Red violation between Node 30 (RED) and Node 40 (RED) while Uncle 70 is RED.",
          codeLine: 2,
          type: "compare",
          treeData: cloneTree(
            { n50: "default", n30: "swapping", n70: "swapping", n40: "pivot" },
            { "n30-n40": "active" },
            ["Red-Red Conflict: 30 & 40"]
          ),
        },
        {
          title: "Recolor Parent (30) & Uncle (70) to Black",
          description: "Flip 30 and 70 to BLACK, keep Root 50 BLACK — Black-Height invariant restored!",
          codeLine: 3,
          type: "complete",
          treeData: cloneTree(
            { n50: "sorted", n30: "sorted", n70: "sorted", n40: "comparing" },
            { "n50-n30": "sorted", "n50-n70": "sorted", "n30-n40": "sorted" },
            ["Black-Height = 2 across all paths"]
          ),
        },
      ]),
  },
  {
    id: "binary-heap",
    name: "Binary Heap / Priority Queue",
    category: "trees",
    shortDescription:
      "Complete binary tree satisfying the Heap Order Property for O(1) peekMax and O(log n) push/pop.",
    description:
      "A Binary Max-Heap is a complete binary tree stored compactly in an array where every parent is ≥ its children. Inserting bubbles a new key up in O(log n) time, while extracting the max swaps the root with the last leaf and sifts down.",
    complexity: {
      timeBest: "O(1) Peek",
      timeAverage: "O(log n)",
      timeWorst: "O(log n)",
      spaceWorst: "O(n)",
      stable: false,
      inPlace: true,
    },
    codeLines: [
      "function siftUp(i: number) {",
      "  while (i > 0) {",
      "    const p = Math.floor((i - 1) / 2);",
      "    if (heap[p] >= heap[i]) break;",
      "    swap(heap, p, i); i = p;",
      "  }",
      "}",
    ],
    keyTakeaways: [
      "Implicit array representation: parent(i) = ⌊(i-1)/2⌋, left(i) = 2i+1, right(i) = 2i+2.",
      "Drives Dijkstra's shortest path, Prim's MST, and task priority queues.",
    ],
    implemented: true,
    generateSteps: () =>
      buildTreeSteps([
        {
          title: "Insert 95 into Max-Heap Leaf (n80 slot)",
          description: "New key 95 placed at bottom-right leaf; compare with parent 70.",
          codeLine: 3,
          type: "compare",
          treeData: cloneTree(
            { n50: "default", n70: "comparing", n80: "pivot" },
            { "n70-n80": "active" },
            ["Heap Insert: 95 > parent 70"]
          ),
        },
        {
          title: "Sift-Up Step 1: Swap 95 ↔ 70",
          description: "95 bubbles up to level 1; now compare 95 with root 50.",
          codeLine: 5,
          type: "swap",
          treeData: cloneTree(
            { n50: "comparing", n70: "pivot", n80: "overwrite" },
            { "n50-n70": "active" },
            ["Sift-Up: 95 > root 50"]
          ),
        },
        {
          title: "Sift-Up Step 2: 95 Promoted to Max-Heap Root!",
          description: "Max-Heap property satisfied across all parent-child edges.",
          codeLine: 5,
          type: "complete",
          treeData: cloneTree(
            { n50: "sorted", n70: "sorted", n80: "sorted" },
            { "n50-n70": "sorted", "n70-n80": "sorted" },
            ["Max Root = 95"]
          ),
        },
      ]),
  },
  {
    id: "trie",
    name: "Trie (Prefix Tree)",
    category: "trees",
    shortDescription:
      "Multi-way character prefix tree enabling O(L) autocomplete and dictionary lookups.",
    description:
      "A Trie stores strings character by character along root-to-node paths so words sharing a common prefix share the same ancestor nodes. Searching or autocompleting a word of length L takes O(L) time independent of how many millions of words are in the dictionary.",
    complexity: {
      timeBest: "O(L)",
      timeAverage: "O(L)",
      timeWorst: "O(L)",
      spaceWorst: "O(Alphabet · N)",
      stable: true,
      inPlace: false,
    },
    codeLines: [
      "function searchPrefix(root: TrieNode, prefix: string): boolean {",
      "  let curr = root;",
      "  for (const ch of prefix) {",
      "    if (!curr.children.has(ch)) return false;",
      "    curr = curr.children.get(ch)!;",
      "  }",
      "  return true; // All completions live in curr's subtree",
      "}",
    ],
    keyTakeaways: [
      "Lookup time O(L) depends only on word length L, not dataset size N.",
      "Used in search engine autocomplete, spell checkers, and IP routing tables (longest prefix match).",
    ],
    implemented: true,
    generateSteps: () => {
      const trieNodes: TreeNodeItem[] = [
        { id: "root", label: "ROOT", x: 50, y: 15, state: "default" },
        { id: "c", label: "'C'", x: 32, y: 42, state: "default" },
        { id: "t", label: "'T'", x: 68, y: 42, state: "default" },
        { id: "ca", label: "'A'", x: 20, y: 74, state: "default" },
        { id: "co", label: "'O'", x: 42, y: 74, state: "default" },
        { id: "tr", label: "'R'", x: 68, y: 74, state: "default" },
      ];
      const trieEdges: TreeEdgeItem[] = [
        { from: "root", to: "c", state: "default" },
        { from: "root", to: "t", state: "default" },
        { from: "c", to: "ca", state: "default" },
        { from: "c", to: "co", state: "default" },
        { from: "t", to: "tr", state: "default" },
      ];
      return buildTreeSteps([
        {
          title: "Search Prefix 'CA' from Trie Root",
          description: "Start at ROOT and inspect outgoing character edge 'C'.",
          codeLine: 3,
          type: "compare",
          treeData: cloneTree({ root: "comparing", c: "pivot" }, { "root-c": "active" }, ["'C'"], trieNodes, trieEdges),
        },
        {
          title: "Match Character 'A' Under 'C'",
          description: "Found path ROOT → 'C' → 'A' in O(L = 2) character hops!",
          codeLine: 7,
          type: "complete",
          treeData: cloneTree(
            { root: "sorted", c: "sorted", ca: "sorted" },
            { "root-c": "sorted", "c-ca": "sorted" },
            ["ROOT", "→ 'C'", "→ 'A' (Prefix Matched!)"],
            trieNodes,
            trieEdges
          ),
        },
      ]);
    },
  },
  {
    id: "segment-tree",
    name: "Segment Tree",
    category: "trees",
    shortDescription:
      "Divide-and-conquer range tree answering range sum/min/max queries and point updates in O(log n).",
    description:
      "A Segment Tree partitions an array of size n into hierarchical interval nodes. Each internal node caches the aggregate (sum, min, or max) of its [L..R] range, allowing arbitrary range queries and element updates in O(log n) time.",
    complexity: {
      timeBest: "O(log n)",
      timeAverage: "O(log n)",
      timeWorst: "O(log n)",
      spaceWorst: "O(4n)",
      stable: true,
      inPlace: false,
    },
    codeLines: [
      "function querySum(node: number, l: number, r: number, ql: number, qr: number): number {",
      "  if (ql <= l && r <= qr) return tree[node]; // Total overlap",
      "  if (r < ql || l > qr) return 0;            // No overlap",
      "  const mid = Math.floor((l + r) / 2);",
      "  return querySum(2*node, l, mid, ql, qr) + querySum(2*node+1, mid+1, r, ql, qr);",
      "}",
    ],
    keyTakeaways: [
      "Answers both Range Queries and Point/Range Updates in O(log n) time.",
      "Decomposes any contiguous range [ql..qr] into at most 2 log₂(n) canonical tree nodes.",
    ],
    implemented: true,
    generateSteps: () => {
      const segNodes: TreeNodeItem[] = [
        { id: "s1", label: "Sum=100", subLabel: "[0..3]", x: 50, y: 15, state: "default" },
        { id: "s2", label: "Sum=35", subLabel: "[0..1]", x: 28, y: 44, state: "default" },
        { id: "s3", label: "Sum=65", subLabel: "[2..3]", x: 72, y: 44, state: "default" },
        { id: "s4", label: "15", subLabel: "[0..0]", x: 16, y: 75, state: "default" },
        { id: "s5", label: "20", subLabel: "[1..1]", x: 38, y: 75, state: "default" },
        { id: "s6", label: "30", subLabel: "[2..2]", x: 62, y: 75, state: "default" },
        { id: "s7", label: "35", subLabel: "[3..3]", x: 84, y: 75, state: "default" },
      ];
      const segEdges: TreeEdgeItem[] = [
        { from: "s1", to: "s2", state: "default" },
        { from: "s1", to: "s3", state: "default" },
        { from: "s2", to: "s4", state: "default" },
        { from: "s2", to: "s5", state: "default" },
        { from: "s3", to: "s6", state: "default" },
        { from: "s3", to: "s7", state: "default" },
      ];
      return buildTreeSteps([
        {
          title: "Range Sum Query [1..3] at Root [0..3]",
          description: "Partial overlap at Root [0..3] — split query to left [0..1] and right [2..3] children.",
          codeLine: 5,
          type: "compare",
          treeData: cloneTree({ s1: "comparing", s2: "comparing", s3: "comparing" }, { "s1-s2": "active", "s1-s3": "active" }, ["Split [0..3]"], segNodes, segEdges),
        },
        {
          title: "Combine Canonical Nodes [1..1] (20) + [2..3] (65) = 85",
          description: "Node [2..3] is a total overlap (65); Node [1..1] is a total overlap (20). Total Sum = 85!",
          codeLine: 2,
          type: "complete",
          treeData: cloneTree(
            { s5: "sorted", s3: "sorted" },
            { "s1-s3": "sorted", "s2-s5": "sorted" },
            ["[1..1]=20", "+ [2..3]=65", "= 85"],
            segNodes,
            segEdges
          ),
        },
      ]);
    },
  },
];
