import {
  AlgorithmDefinition,
  AlgorithmStep,
  LinearNodeItem,
} from "@/types/algorithm";

function buildLinearSimulation(
  mode: NonNullable<AlgorithmStep["linearData"]>["mode"],
  initialValues: number[],
  ops: {
    title: string;
    description: string;
    codeLine: number;
    type: AlgorithmStep["type"];
    mutate: (nodes: LinearNodeItem[]) => {
      nodes: LinearNodeItem[];
      capacity?: number;
    };
  }[]
): AlgorithmStep[] {
  const sample = initialValues.slice(0, 6);
  let currentNodes: LinearNodeItem[] = sample.map((v, i) => ({
    id: `node-${i}-${v}`,
    value: v,
    state: "default",
    label: `idx ${i}`,
  }));

  const steps: AlgorithmStep[] = [
    {
      stepIndex: 0,
      type: "init",
      array: [],
      highlightedIndices: [],
      sortedIndices: [],
      linearData: {
        mode,
        capacity: 8,
        nodes: currentNodes.map((n) => ({ ...n })),
      },
      codeLine: 1,
      title: `Initialized ${mode.toUpperCase()} Structure`,
      description: `Loaded initial nodes [${sample.join(", ")}] into ${mode}.`,
      metrics: { comparisons: 0, swaps: 0, arrayAccesses: sample.length },
    },
  ];

  ops.forEach((op, idx) => {
    const res = op.mutate(currentNodes.map((n) => ({ ...n, state: "default" })));
    currentNodes = res.nodes;
    steps.push({
      stepIndex: idx + 1,
      type: op.type,
      array: [],
      highlightedIndices: [],
      sortedIndices: [],
      linearData: {
        mode,
        capacity: res.capacity ?? 8,
        nodes: currentNodes,
      },
      codeLine: op.codeLine,
      title: op.title,
      description: op.description,
      metrics: {
        comparisons: idx + 1,
        swaps: idx + 1,
        arrayAccesses: sample.length + (idx + 1) * 2,
      },
    });
  });

  return steps;
}

export const LINEAR_ALGORITHMS: AlgorithmDefinition[] = [
  {
    id: "array-ops",
    name: "Static Array",
    category: "linear",
    shortDescription:
      "Contiguous fixed-size memory block with O(1) random index lookup and O(n) middle insertion/deletion.",
    description:
      "A Static Array stores elements in contiguous memory addresses, enabling instant O(1) address calculation (base + i × sizeof(T)) but requiring O(n) right/left element shifts when inserting or deleting at arbitrary indices.",
    complexity: {
      timeBest: "O(1) Lookup",
      timeAverage: "O(n) Insert",
      timeWorst: "O(n) Shift",
      spaceWorst: "O(n)",
      stable: true,
      inPlace: true,
    },
    codeLines: [
      "const A = new Int32Array(8); // Fixed contiguous buffer",
      "const x = A[3];              // O(1) random access",
      "// Insert 99 at index 2 (shift elements right)",
      "for (let i = size; i > 2; i--) A[i] = A[i - 1];",
      "A[2] = 99; size++;",
      "// Delete index 1 (shift elements left)",
      "for (let i = 1; i < size - 1; i++) A[i] = A[i + 1];",
    ],
    keyTakeaways: [
      "O(1) Random Access via direct hardware memory offset arithmetic.",
      "Inserting or deleting near the front requires shifting O(n) contiguous elements.",
    ],
    implemented: true,
    generateSteps: (vals) =>
      buildLinearSimulation("array", vals, [
        {
          title: "O(1) Direct Index Read at A[2]",
          description: "CPU computes address Base + 2 * 4 bytes and reads A[2] in 1 cycle.",
          codeLine: 2,
          type: "compare",
          mutate: (nodes) => {
            if (nodes[2]) nodes[2].state = "sorted";
            return { nodes };
          },
        },
        {
          title: "Shift Right [2..n] to Insert 99 at Index 2",
          description: "Shifting elements from index 2 rightward to open a contiguous slot.",
          codeLine: 4,
          type: "swap",
          mutate: (nodes) => {
            for (let i = 2; i < nodes.length; i++) nodes[i].state = "comparing";
            return { nodes };
          },
        },
        {
          title: "Write 99 into A[2]",
          description: "Inserted 99 at index 2 after shifting suffix elements.",
          codeLine: 5,
          type: "overwrite",
          mutate: (nodes) => {
            nodes.splice(2, 0, {
              id: "ins-99",
              value: 99,
              state: "pivot",
              label: "idx 2",
            });
            return {
              nodes: nodes.map((n, i) => ({ ...n, label: `idx ${i}` })),
            };
          },
        },
      ]),
  },
  {
    id: "dynamic-array",
    name: "Dynamic Array",
    category: "linear",
    shortDescription:
      "Automatically doubles backing buffer capacity when full, achieving O(1) amortized append.",
    description:
      "A Dynamic Array (like C++ std::vector or JavaScript Array) maintains a geometric capacity factor. Appending is O(1) until size equals capacity, at which point it allocates a new buffer of 2× capacity and copies existing items over.",
    complexity: {
      timeBest: "O(1) Amortized",
      timeAverage: "O(1) Push",
      timeWorst: "O(n) Resize",
      spaceWorst: "O(n)",
      stable: true,
      inPlace: false,
    },
    codeLines: [
      "push(val: number) {",
      "  if (this.size === this.capacity) {",
      "    this.resize(this.capacity * 2); // Allocate 2x & copy",
      "  }",
      "  this.buffer[this.size++] = val;",
      "}",
    ],
    keyTakeaways: [
      "Geometric growth (2×) guarantees O(1) amortized cost per push.",
      "Combines CPU cache locality with dynamic sizing.",
    ],
    implemented: true,
    generateSteps: (vals) =>
      buildLinearSimulation("dynamic-array", vals.slice(0, 4), [
        {
          title: "Append 77 (Capacity 4 Full!)",
          description: "Size reaches capacity 4. Triggering geometric 2x reallocation to capacity 8.",
          codeLine: 3,
          type: "bucket",
          mutate: (nodes) => ({
            capacity: 8,
            nodes: nodes.map((n) => ({ ...n, state: "comparing" })),
          }),
        },
        {
          title: "Copy Elements & Push 77 in O(1)",
          description: "Buffer doubled to capacity 8; element 77 written at index 4.",
          codeLine: 5,
          type: "overwrite",
          mutate: (nodes) => ({
            capacity: 8,
            nodes: [
              ...nodes,
              { id: "dyn-77", value: 77, state: "sorted", label: `idx ${nodes.length}` },
            ],
          }),
        },
        {
          title: "Push 88 in O(1) Without Resize",
          description: "Spare capacity available — appended 88 directly at tail.",
          codeLine: 5,
          type: "complete",
          mutate: (nodes) => ({
            capacity: 8,
            nodes: [
              ...nodes,
              { id: "dyn-88", value: 88, state: "pivot", label: `idx ${nodes.length}` },
            ],
          }),
        },
      ]),
  },
  {
    id: "singly-linked-list",
    name: "Linked List",
    category: "linear",
    shortDescription:
      "Pointer-chained nodes where each node stores a value and a next reference.",
    description:
      "A Singly Linked List allocates nodes dynamically on the heap. Inserting or deleting at the head takes O(1) pointer updates with zero memory shifting, while finding the k-th node requires O(k) pointer traversal from HEAD.",
    complexity: {
      timeBest: "O(1) Head Op",
      timeAverage: "O(n) Search",
      timeWorst: "O(n)",
      spaceWorst: "O(n)",
      stable: true,
      inPlace: true,
    },
    codeLines: [
      "class ListNode { val: number; next: ListNode | null; }",
      "// Prepend at HEAD in O(1)",
      "const node = new ListNode(42, head);",
      "head = node;",
      "// Traverse from HEAD to insert after target",
      "let curr = head; while (curr !== target) curr = curr.next;",
      "newNode.next = curr.next; curr.next = newNode;",
    ],
    keyTakeaways: [
      "O(1) insertion and deletion at HEAD or given a direct node reference.",
      "No contiguous reallocation required, at the cost of pointer memory overhead.",
    ],
    implemented: true,
    generateSteps: (vals) =>
      buildLinearSimulation("singly-linked", vals, [
        {
          title: "Prepend Node (42) at HEAD in O(1)",
          description: "Allocate Node(42), point its next → old HEAD, and update HEAD pointer.",
          codeLine: 3,
          type: "overwrite",
          mutate: (nodes) => ({
            nodes: [
              { id: "ll-head-42", value: 42, state: "pivot", label: "HEAD" },
              ...nodes.map((n, i) => ({ ...n, label: `node ${i + 1}` })),
            ],
          }),
        },
        {
          title: "Traverse Pointers from HEAD → Node 2",
          description: "Following next pointers sequentially to locate insertion point.",
          codeLine: 6,
          type: "compare",
          mutate: (nodes) => {
            if (nodes[0]) nodes[0].state = "comparing";
            if (nodes[1]) nodes[1].state = "comparing";
            if (nodes[2]) nodes[2].state = "sorted";
            return { nodes };
          },
        },
        {
          title: "Splice Node (91) After Node 2",
          description: "Rewired newNode.next = curr.next and curr.next = newNode in O(1).",
          codeLine: 7,
          type: "complete",
          mutate: (nodes) => {
            nodes.splice(3, 0, {
              id: "ll-mid-91",
              value: 91,
              state: "sorted",
              label: "NEW",
            });
            return { nodes };
          },
        },
      ]),
  },
  {
    id: "doubly-linked-list",
    name: "Doubly Linked List",
    category: "linear",
    shortDescription:
      "Bidirectional node chain with both next and prev pointers, enabling O(1) removal and LRU caches.",
    description:
      "Each node in a Doubly Linked List stores both next and prev pointers. Given any node reference, it can splice itself out of the list in O(1) time without needing a predecessor traversal.",
    complexity: {
      timeBest: "O(1) Splice",
      timeAverage: "O(n) Search",
      timeWorst: "O(n)",
      spaceWorst: "O(n)",
      stable: true,
      inPlace: true,
    },
    codeLines: [
      "class DNode { val: number; prev: DNode | null; next: DNode | null; }",
      "// O(1) Node Deletion given reference",
      "node.prev.next = node.next;",
      "node.next.prev = node.prev;",
      "// O(1) Append at TAIL",
      "tail.next = newNode; newNode.prev = tail; tail = newNode;",
    ],
    keyTakeaways: [
      "Backbone of O(1) LRU Cache implementations (paired with a Hash Map).",
      "Supports bidirectional iteration from both HEAD and TAIL.",
    ],
    implemented: true,
    generateSteps: (vals) =>
      buildLinearSimulation("doubly-linked", vals, [
        {
          title: "Select Middle Node for O(1) Removal",
          description: "Accessing node.prev and node.next directly via bidirectional links.",
          codeLine: 3,
          type: "compare",
          mutate: (nodes) => {
            if (nodes[2]) nodes[2].state = "swapping";
            if (nodes[1]) nodes[1].state = "comparing";
            if (nodes[3]) nodes[3].state = "comparing";
            return { nodes };
          },
        },
        {
          title: "Bypass & Unlink Node in O(1)",
          description: "Updated node.prev.next = node.next and node.next.prev = node.prev.",
          codeLine: 4,
          type: "overwrite",
          mutate: (nodes) => {
            nodes.splice(2, 1);
            return { nodes };
          },
        },
        {
          title: "Append Node (108) at TAIL in O(1)",
          description: "Linked new node bidirectionally to TAIL.",
          codeLine: 6,
          type: "complete",
          mutate: (nodes) => ({
            nodes: [
              ...nodes,
              { id: "dll-108", value: 108, state: "sorted", label: "TAIL" },
            ],
          }),
        },
      ]),
  },
  {
    id: "stack",
    name: "Stack (LIFO)",
    category: "linear",
    shortDescription:
      "Last-In, First-Out (LIFO) container supporting O(1) push, pop, and peek at the top.",
    description:
      "A Stack restricts all insertions and removals to a single end called TOP. It powers function call stacks, DFS traversal, expression evaluation, and undo/redo history.",
    complexity: {
      timeBest: "O(1) Push/Pop",
      timeAverage: "O(1)",
      timeWorst: "O(1)",
      spaceWorst: "O(n)",
      stable: true,
      inPlace: true,
    },
    codeLines: [
      "class Stack<T> {",
      "  push(item: T) { this.items.push(item); } // O(1) TOP push",
      "  pop(): T | undefined { return this.items.pop(); } // O(1) TOP pop",
      "  peek(): T | undefined { return this.items[this.items.length - 1]; }",
      "}",
    ],
    keyTakeaways: [
      "LIFO ordering: The most recently pushed item is always the first popped.",
      "Used by compilers for bracket matching, syntax parsing, and recursion frames.",
    ],
    implemented: true,
    generateSteps: (vals) =>
      buildLinearSimulation("stack", vals.slice(0, 4), [
        {
          title: "push(84) onto Stack TOP",
          description: "Pushed 84 onto the top of the LIFO stack in O(1).",
          codeLine: 2,
          type: "overwrite",
          mutate: (nodes) => ({
            nodes: [
              ...nodes,
              { id: "stk-84", value: 84, state: "pivot", label: "TOP" },
            ],
          }),
        },
        {
          title: "peek() Inspects TOP = 84",
          description: "Read top element 84 without modifying the stack.",
          codeLine: 4,
          type: "compare",
          mutate: (nodes) => {
            nodes[nodes.length - 1].state = "comparing";
            return { nodes };
          },
        },
        {
          title: "pop() Removes TOP (84)",
          description: "Popped 84 from TOP; previous element becomes the new TOP.",
          codeLine: 3,
          type: "complete",
          mutate: (nodes) => {
            nodes.pop();
            if (nodes.length > 0) {
              nodes[nodes.length - 1].state = "sorted";
              nodes[nodes.length - 1].label = "TOP";
            }
            return { nodes };
          },
        },
      ]),
  },
  {
    id: "queue",
    name: "Queue (FIFO)",
    category: "linear",
    shortDescription:
      "First-In, First-Out (FIFO) pipeline supporting O(1) enqueue at REAR and dequeue from FRONT.",
    description:
      "A Queue processes elements in exact arrival order (FIFO): new items enter at the REAR (tail) and exit from the FRONT (head). It drives Breadth-First Search (BFS), task schedulers, and I/O buffers.",
    complexity: {
      timeBest: "O(1) Enqueue",
      timeAverage: "O(1) Dequeue",
      timeWorst: "O(1)",
      spaceWorst: "O(n)",
      stable: true,
      inPlace: true,
    },
    codeLines: [
      "class Queue<T> {",
      "  enqueue(item: T) { this.tail.push(item); } // Insert at REAR",
      "  dequeue(): T { return this.head.shift(); } // Remove from FRONT",
      "  front(): T { return this.head[0]; }",
      "}",
    ],
    keyTakeaways: [
      "Fair FIFO scheduling: Earliest enqueued element is always served first.",
      "Essential frontier structure for level-order tree and BFS graph traversal.",
    ],
    implemented: true,
    generateSteps: (vals) =>
      buildLinearSimulation("queue", vals.slice(0, 4), [
        {
          title: "enqueue(95) at REAR",
          description: "Added element 95 to the back of the FIFO queue.",
          codeLine: 2,
          type: "overwrite",
          mutate: (nodes) => ({
            nodes: [
              ...nodes.map((n, i) => ({ ...n, label: i === 0 ? "FRONT" : "" })),
              { id: "q-95", value: 95, state: "pivot", label: "REAR" },
            ],
          }),
        },
        {
          title: "Inspect FRONT Element",
          description: "Oldest element at FRONT is ready to be dequeued next.",
          codeLine: 4,
          type: "compare",
          mutate: (nodes) => {
            nodes[0].state = "swapping";
            return { nodes };
          },
        },
        {
          title: "dequeue() Removes FRONT in O(1)",
          description: "Removed front element and advanced FRONT pointer to next item.",
          codeLine: 3,
          type: "complete",
          mutate: (nodes) => {
            nodes.shift();
            if (nodes[0]) {
              nodes[0].state = "sorted";
              nodes[0].label = "FRONT";
            }
            return { nodes };
          },
        },
      ]),
  },
  {
    id: "deque",
    name: "Deque",
    category: "linear",
    shortDescription:
      "Double-Ended Queue supporting O(1) insertion and removal at both FRONT and BACK.",
    description:
      "A Deque (Double-Ended Queue) generalizes both a Stack and a Queue by allowing O(1) pushFront, pushBack, popFront, and popBack operations. It is the core data structure for monotonic sliding-window algorithms and work-stealing thread schedulers.",
    complexity: {
      timeBest: "O(1) Both Ends",
      timeAverage: "O(1)",
      timeWorst: "O(1)",
      spaceWorst: "O(n)",
      stable: true,
      inPlace: true,
    },
    codeLines: [
      "class Deque<T> {",
      "  pushFront(x: T) { /* O(1) prepend at FRONT */ }",
      "  pushBack(x: T)  { /* O(1) append at BACK */ }",
      "  popFront(): T   { /* O(1) remove FRONT */ }",
      "  popBack(): T    { /* O(1) remove BACK */ }",
      "}",
    ],
    keyTakeaways: [
      "Supports both LIFO and FIFO patterns simultaneously in O(1) time.",
      "Powers O(n) Sliding Window Maximum via a monotonic decreasing deque.",
    ],
    implemented: true,
    generateSteps: (vals) =>
      buildLinearSimulation("deque", vals.slice(0, 4), [
        {
          title: "pushFront(11) at Left End",
          description: "Inserted 11 at the FRONT of the deque in O(1).",
          codeLine: 2,
          type: "overwrite",
          mutate: (nodes) => ({
            nodes: [
              { id: "dq-11", value: 11, state: "pivot", label: "FRONT" },
              ...nodes,
            ],
          }),
        },
        {
          title: "pushBack(99) at Right End",
          description: "Inserted 99 at the BACK of the deque in O(1).",
          codeLine: 3,
          type: "overwrite",
          mutate: (nodes) => ({
            nodes: [
              ...nodes,
              { id: "dq-99", value: 99, state: "sorted", label: "BACK" },
            ],
          }),
        },
        {
          title: "popBack() & popFront() Ready",
          description: "Both ends are accessible in O(1) time.",
          codeLine: 4,
          type: "complete",
          mutate: (nodes) => {
            nodes[0].state = "sorted";
            nodes[nodes.length - 1].state = "sorted";
            return { nodes };
          },
        },
      ]),
  },
];

