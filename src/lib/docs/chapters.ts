export interface DocChapter {
  id: string;
  title: string;
  category: "THEORY" | "COMPLEXITY" | "OPTIMIZATION" | "PRACTICE & INTERVIEW";
  summary: string;
  content: string; // MDX/Rich Markdown content
}

export const DOC_CHAPTERS: DocChapter[] = [
  {
    id: "history",
    title: "1. History & Origin",
    category: "THEORY",
    summary: "Discover the 1848 chess puzzle that fascinated Carl Friedrich Gauss and Edsger Dijkstra.",
    content: `
# History & Origin of the N-Queen Problem

The **Eight Queens Puzzle** was first published in **1848** by chess composer **Max Bezzel** in the *Deutsche Schachzeitung*. Bezzel posed a seemingly simple combinatorial challenge: *Is it possible to place eight chess queens on a standard 8 × 8 chessboard such that no two queens attack each other?*

### The Gauss Connection (1850)
In 1850, the legendary mathematician **Carl Friedrich Gauss** investigated the problem. Gauss originally found 72 solutions through analytical methods, and later confirmed that there are exactly **92 distinct solutions** (or **12 fundamental solutions** when discounting reflections and rotations).

### Edsger Dijkstra and Structured Programming (1972)
More than a century later, the N-Queen problem became one of the cornerstone examples in computer science. In his influential 1972 monograph *Notes on Structured Programming*, **Edsger W. Dijkstra** used the Eight Queens puzzle to demonstrate **depth-first backtracking** and recursive refinement. Dijkstra showed how structured depth-first search could systematically prune millions of invalid permutations before exploring them.

---

> [!NOTE]
> **Why is N-Queen so famous today?**
> The N-Queen puzzle is the textbook archetype for **Constraint Satisfaction Problems (CSPs)** and **Backtracking**. It teaches software engineers how to trade raw computational brute force (Nⁿ or N!) for intelligent recursive state-space pruning (O(cⁿ)).
    `,
  },
  {
    id: "problem-statement",
    title: "2. Formal Problem Statement",
    category: "THEORY",
    summary: "Mathematical formulation of chessboard coordinates and queen attack vectors.",
    content: `
# Formal Problem Statement

Given a square chessboard of size N × N, place N non-attacking chess queens on the board.

A chess queen can move any number of unoccupied squares **horizontally**, **vertically**, or **diagonally**. Therefore, a placement of N queens is **valid** if and only if no two queens share the same:
1. **Row:** rᵢ ≠ rⱼ for all i ≠ j
2. **Column:** cᵢ ≠ cⱼ for all i ≠ j
3. **Main Diagonal (↘):** rᵢ - cᵢ ≠ rⱼ - cⱼ for all i ≠ j
4. **Anti-Diagonal (↗):** rᵢ + cᵢ ≠ rⱼ + cⱼ for all i ≠ j

### State Representation ('board[]' Array)
Instead of maintaining a full 2D matrix of size N × N, we can exploit Constraint #1 ('One queen per row').
We represent the board as a 1D integer array 'board[0...N-1]', where:
- The **index** i represents the **row number** (0 ≤ i < N).
- The **value** 'board[i]' represents the **column number** of the queen placed in row i (0 ≤ board[i] < N).

\`\`\`typescript
// Example for N=4 Valid Solution: Queen at (0,1), (1,3), (2,0), (3,2)
const board = [1, 3, 0, 2];
\`\`\`

---

> [!IMPORTANT]
> By assigning exactly one queen to each row, we **automatically satisfy** the row constraint (rᵢ ≠ rⱼ). We only need to check **columns** and **diagonals** during placement!
    `,
  },
  {
    id: "examples-dry-run",
    title: "3. Examples & Visual Dry Run (N=4)",
    category: "THEORY",
    summary: "Step-by-step walkthrough trace of standard backtracking on a 4x4 chessboard.",
    content: `
# Complete Step-by-Step Dry Run (N=4)

For N = 4, let's trace exactly how depth-first backtracking explores the state tree until it finds the two valid solutions: '[1, 3, 0, 2]' and '[2, 0, 3, 1]'.

### Trace Log:
1. **Row 0:** Try 'col = 0'. Board state: '[0, -1, -1, -1]'. Safe! Recurse to Row 1.
2. **Row 1:**
   - 'col = 0' → Column attack with Row 0! ❌
   - 'col = 1' → Diagonal attack (r-c = 0-0 = 1-1) with Row 0! ❌
   - 'col = 2' → Safe! Board state: '[0, 2, -1, -1]'. Recurse to Row 2.
3. **Row 2 (under [0, 2]):**
   - 'col = 0' → Column attack with Row 0! ❌
   - 'col = 1' → Diagonal attack (r+c = 0+2 = 2+1 = 3) with Row 1! ❌
   - 'col = 2' → Column attack with Row 1! ❌
   - 'col = 3' → Diagonal attack (r-c = 0-0 = 2-3? no, but check r+c = 2+3 = 5, safe? Wait: Row 1 has queen at (1,2). For (2,3), r-c = 2-3 = -1, and 1-2 = -1! Main diagonal attack with Row 1!) ❌
   - *Dead End in Row 2!* **BACKTRACK** to Row 1.
4. **Row 1 (Backtracked):** Try 'col = 3'. Safe! Board state: '[0, 3, -1, -1]'. Recurse to Row 2.
5. **Row 2 (under [0, 3]):**
   - 'col = 0' → Column attack with Row 0! ❌
   - 'col = 1' → Safe! Board state: '[0, 3, 1, -1]'. Recurse to Row 3.
6. **Row 3 (under [0, 3, 1]):**
   - Every column 0, 1, 2, 3 is attacked! *Dead End!* **BACKTRACK** all the way up to Row 0!
7. **Row 0 (Backtracked):** Try 'col = 1'. Board state: '[1, -1, -1, -1]'.
8. **Following [1, 3, 0, 2]:**
   - Row 1 → 'col = 3' (Safe)
   - Row 2 → 'col = 0' (Safe)
   - Row 3 → 'col = 2' (Safe) → **🎉 SOLUTION #1 FOUND: [1, 3, 0, 2]!**

\`\`\`
Solution #1 [1, 3, 0, 2]:      Solution #2 [2, 0, 3, 1]:
. Q . .                        . . Q .
. . . Q                        Q . . .
Q . . .                        . . . Q
. . Q .                        . Q . .
\`\`\`
    `,
  },
  {
    id: "recursive-intuition",
    title: "4. Recursive Intuition & Backtracking",
    category: "THEORY",
    summary: "Understand the general backtracking template and decision tree exploration.",
    content: `
# Backtracking & Depth-First Search Intuition

Backtracking is an algorithmic technique for solving problems recursively by trying to build a solution incrementally, one piece at a time, removing those solutions that fail to satisfy the constraints of the problem at any point of time (**pruning**).

### The Universal Backtracking Template
Every well-structured backtracking algorithm follows this 5-step lifecycle:

\`\`\`typescript
function backtrack(row: number, state: BoardState) {
  // 1. Base Case: If we reached the end, record solution
  if (row === N) {
    recordSolution(state);
    return;
  }

  // 2. Iterate through all possible choices at this step
  for (let col = 0; col < N; col++) {
    // 3. Check Constraint / Pruning condition
    if (isValid(row, col, state)) {
      // 4. Make Choice (Do)
      state[row] = col;

      // 5. Recurse to next subproblem
      backtrack(row + 1, state);

      // 6. Undo Choice (Backtrack / Undo)
      state[row] = -1;
    }
  }
}
\`\`\`

### Why "Undo Choice" is Essential
When 'backtrack(row + 1)' finishes exploring (whether it found solutions or hit dead ends), the stack frame returns to 'row'. If we did not clear 'state[row] = -1', subsequent iterations or parallel checks in memory could see stale queen positions from a failed branch!
    `,
  },
  {
    id: "recursion-tree",
    title: "5. Recursion Tree & Branch Pruning",
    category: "THEORY",
    summary: "Visualizing state space explosion and how pruning saves exponential time.",
    content: `
# Recursion Tree & Pruning Analysis

Let's compare three approaches by looking at their state-space search trees:

### 1. Pure Brute Force (Nⁿ Nodes)
If we blindly place any column 0 to N-1 in every row and only check validity when all N queens are placed:
- Total leaf nodes evaluated: Nⁿ.
- For N = 8: 8⁸ = 16,777,216 complete board permutations checked!
- For N = 14: 14¹⁴ = 111,120,068,255,580,160 nodes. Completely impossible!

### 2. Permutation Brute Force (N! Nodes)
If we ensure every queen is in a unique row and unique column, we generate permutations of 0 to N-1:
- Total candidate leaves: N!.
- For N = 8: 8! = 40,320 permutations.
- For N = 14: 14! = 87,178,291,200 permutations. Still billions of checks!

### 3. Backtracking with Early Pruning (O(cⁿ) Nodes)
By checking diagonal constraints **at the exact moment** a candidate cell (row, col) is considered, we prune the entire sub-tree below that cell the millisecond a collision is detected!
- For N = 8: Standard backtracking visits only **1,965 nodes** instead of 16.7 million! That is a **99.988% reduction** in computation!
- For N = 14: Backtracking explores only ~3.7 billion valid nodes out of 14¹⁴, completing in seconds!
    `,
  },
  {
    id: "time-complexity",
    title: "6. Time Complexity Derivation",
    category: "COMPLEXITY",
    summary: "Rigorous mathematical bounds: From O(N!) upper bound to sub-exponential real-world behavior.",
    content: `
# Rigorous Time Complexity Analysis

### Upper Bound: O(N!)
In the worst-case asymptotic upper bound, we place 1 queen per row, and no two queens can share a column.
- In Row 0, there are N valid column choices.
- In Row 1, there are at most N-1 valid column choices.
- In Row 2, there are at most N-2 choices...
- Thus, the recurrence relation is bounded by:
  T(N) = N · T(N-1) ⟹ T(N) = O(N!)

### Cost per Node: O(N) vs O(1)
To determine total runtime, we multiply the number of nodes visited by the cost of 'isValid(row, col)':
1. **Standard Array Loop ('nQueenSolver'):**
   Checking against previous r rows takes O(r) work per placement ⟹ O(N · N!).
2. **Hash Sets / Bitmasking ('row | col | diag'):**
   'isValid' takes O(1) constant time bitwise operations ⟹ O(N!).

### Empirical Sub-Factorial Growth (cⁿ)
Because diagonal pruning eliminates ~95% to 99% of branches early at depth r ≤ 3, the empirical time complexity grows at approximately O(2.5ⁿ) for practical 4 ≤ N ≤ 15.
    `,
  },
  {
    id: "space-complexity",
    title: "7. Space Complexity Derivation",
    category: "COMPLEXITY",
    summary: "Call stack depth O(N) and memory overhead comparison between approaches.",
    content: `
# Space Complexity Analysis

The auxiliary space complexity of the N-Queen backtracking solver is strictly **O(N)**. Let's break down where every byte goes:

### 1. Recursion Call Stack (O(N))
At any point in time, the depth-first search recursion goes at most N levels deep ('row = 0' to 'row = N'). Each stack frame holds local primitive variables ('row', 'col'), occupying O(1) memory per frame. Total stack space: O(N).

### 2. State Arrays (O(N))
- 'board[0...N-1]' array storing queen positions: O(N) integers.
- If using Hash Sets optimization ('colsSet', 'diag1Set', 'diag2Set'):
  - 'colsSet' stores up to N elements → O(N).
  - 'diag1Set' stores up to 2N-1 diagonals → O(N).
  - 'diag2Set' stores up to 2N-1 diagonals → O(N).

### 3. Bitmask Optimization (O(1) Auxiliary State!)
If we replace hash sets with three 32-bit integer bitmasks ('cols', 'diag1', 'diag2'), our auxiliary storage outside the stack frame shrinks to just **three primitive integers (3 × 4 = 12 bytes)**!
- Total space (Stack + Bitmasks): strictly O(N) with near-zero allocation overhead.
    `,
  },
  {
    id: "optimization-hashing",
    title: "8. Optimization 1: Hash Sets O(1)",
    category: "OPTIMIZATION",
    summary: "Eliminate the O(N) linear loop using Set<number> for columns and diagonals.",
    content: `
# Optimization 1: Hashing via Sets (O(1) Lookup)

In standard backtracking, whenever we test candidate square (row, col), we run a 'for (let r = 0; r < row; r++)' loop to verify that no previously placed queen attacks (row, col). This loop costs O(row) = O(N) per node.

### The Coordinate Invariant Trick
We can eliminate this loop by observing invariant mathematical properties across diagonal lines on a chessboard:

1. **Columns:** Every cell in column c has the exact same value: c.
2. **Main Diagonals (↘):** Every cell on a diagonal sloping down-right has a **constant difference** between row and column!
   diag1 = row - col   ∈ [-(N-1), ..., N-1]
3. **Anti-Diagonals (↗):** Every cell on a diagonal sloping up-right has a **constant sum**!
   diag2 = row + col   ∈ [0, ..., 2N-2]

### TypeScript Set Implementation:
\`\`\`typescript
const cols = new Set<number>();
const diag1 = new Set<number>(); // row - col
const diag2 = new Set<number>(); // row + col

function isSafe(row: number, col: number): boolean {
  return !cols.has(col) && !diag1.has(row - col) && !diag2.has(row + col);
}
\`\`\`
Checking membership inside a Hash Set takes **O(1) average time**, instantly removing the linear lookup bottleneck!
    `,
  },
  {
    id: "optimization-bitmasking",
    title: "9. Optimization 2: Bitmasking O(1)",
    category: "OPTIMIZATION",
    summary: "The ultimate competitive programming speedup: bitwise operations and bit shifting.",
    content: `
# Optimization 2: Bitmasking (O(1) Ultra-Fast)

While Hash Sets achieve O(1) lookup, dynamic allocations and hash collisions in JavaScript/C++ still carry overhead. We can achieve the **absolute theoretical maximum speed** by replacing sets with **Bitmasks (Integers)**!

### How Bitmasking Works
Since N ≤ 15 fits inside a standard 32-bit signed integer ('1 << 15 = 32,768'), we represent 'cols', 'diag1', and 'diag2' as integer bitmasks:
- 'cols': '1' at bit k means column k is occupied.
- 'diag1': '1' at bit k means main diagonal k is occupied.
- 'diag2': '1' at bit k means anti-diagonal k is occupied.

### The Bit Shifting Magic ('<< 1' and '>> 1')
When we move down from 'row' to 'row + 1':
- **Columns ('cols'):** Column alignment does not shift between rows.
- **Main Diagonal ('diag1'):** Moving down 1 row shifts the diagonal threat **left by 1 bit ('<< 1')**.
- **Anti-Diagonal ('diag2'):** Moving down 1 row shifts the diagonal threat **right by 1 bit ('>> 1')**.

\`\`\`typescript
function solveBitmask(row: number, cols: number, diag1: number, diag2: number) {
  if (row === N) {
    solutionsCount++;
    return;
  }

  // Calculate bitmask of ALL available squares in this row in 1 CPU instruction!
  let available = ((1 << N) - 1) & ~(cols | diag1 | diag2);

  while (available > 0) {
    // Extract rightmost set bit (fastest way to pick next open column)
    const bit = available & -available;
    available ^= bit; // Clear this bit from available

    // Recurse with bitwise shifted diagonal masks!
    solveBitmask(row + 1, cols | bit, (diag1 | bit) << 1, (diag2 | bit) >> 1);
  }
}
\`\`\`

> [!TIP]
> **Why 'available & -available'?**
> In two's complement binary arithmetic, '-x' is '~x + 1'. The bitwise AND between 'x' and '-x' isolates the lowest set bit ('rightmost 1') in a single CPU cycle ('BLSI' instruction on x86)!
    `,
  },
  {
    id: "common-mistakes",
    title: "10. Common Interview Mistakes",
    category: "PRACTICE & INTERVIEW",
    summary: "Avoid critical bugs like missing backtrack cleanups or array cloning issues.",
    content: `
# Common Interview Mistakes & Gotchas

When solving N-Queen in coding interviews (Google, Meta, Amazon), candidates frequently fall into these 4 traps:

### 1. Forgetting to Backtrack ('state[row] = -1' or 'cols.delete(col)')
If you add 'col' to your 'cols' set when stepping down into 'row + 1', you **MUST** call 'cols.delete(col)' when the recursion returns! Otherwise, subsequent iterations in 'row' will falsely believe 'col' is still occupied by the previous dead-end branch!

### 2. Pushing Array References ('solutions.push(board)')
In JavaScript/Python/C++, 'board' is a mutable array passed by reference. If you write:
\`\`\`typescript
if (row === N) {
  solutions.push(board); // BUG! Pushes reference to the exact same array in memory!
}
\`\`\`
When the algorithm finishes, every entry in 'solutions' will point to '[-1, -1, -1, -1]'!
**Fix:** Always push a deep copy: 'solutions.push([...board])' or 'solutions.push(Array.from(board))'.

### 3. Using 2D Grid Instead of 1D Array
Allocating a full 'number[N][N]' grid and checking all N² cells costs unnecessary memory (O(N²) vs O(N)) and makes attack checks slower. Always use the 1D 'board[row] = col' representation!

### 4. Overchecking Row Attacks
Some candidates check 'r !== row' during validation. But because your loop naturally assigns exactly one queen per 'solve(row)' call and increments 'row + 1', two queens can **never** land on the same row!
    `,
  },
  {
    id: "interview-tips",
    title: "11. Senior Engineer Interview Tips",
    category: "PRACTICE & INTERVIEW",
    summary: "How to structure your explanation to impress L5/L6 interviewers at FAANG.",
    content: `
# How to Ace N-Queen in FAANG Interviews

If asked to solve N-Queen or N-Queen II (Count Solutions) in a technical screen, follow this structured communication blueprint:

### Step 1: Clarify Constraints (1 minute)
- Ask: *"Do we need to return all exact board representations ('string[][]'), or just the total count of valid configurations ('number')?"* (If only count is needed, immediately propose the Bitmask or Set approach to save space).
- Ask: *"What is the maximum N we should expect? N ≤ 12 or N = 15?"*

### Step 2: Explain State Representation (O(N) array vs N × N grid)
Before writing code, state explicitly: *"Since no two queens can share a row, I will represent the board as a 1D array 'board[row] = col' where index is row and value is column. This automatically guarantees row uniqueness and reduces space to O(N)."*

### Step 3: Start with Hash Sets, then Upgrade to Bitmasking
1. Explain the 'row - col' (main diagonal) and 'row + col' (anti-diagonal) mathematical invariants clearly.
2. If time permits or interviewer asks for optimal performance, transition into **Bitmasking ('cols | diag1 | diag2')**, explaining how '(diag1 | bit) << 1' shifts diagonal threats cleanly across rows. This immediately signals L5+ systems engineering depth!
    `,
  },
  {
    id: "real-world-applications",
    title: "12. Real-World Applications",
    category: "THEORY",
    summary: "How backtracking and constraint satisfaction power modern EDA, compilers, and AI.",
    content: `
# Real-World Applications of Backtracking & CSPs

While placing queens on a chessboard is a classical puzzle, the underlying **Constraint Satisfaction Problem (CSP)** engine powers mission-critical software architecture worldwide:

### 1. VLSI Circuit & PCB Routing (Electronic Design Automation)
When laying out multi-layer printed circuit boards (PCBs) or silicon chip trace lines, automated routers must run wires across millions of logic gates without crossing ('short circuit') or violating spacing rules ('diagonal interference'). EDA tools use advanced spatial backtracking and constraint propagation modeled directly on generalized N-Queen algorithms!

### 2. Register Allocation in Compilers (LLVM / GCC)
When a compiler turns high-level TypeScript or C++ into machine assembly, it must assign an arbitrary number of local variables to a limited number of physical CPU registers ('RAX', 'RBX', 'RCX'). If two variables are live at the same time, they cannot share a register. This graph coloring problem is solved via recursive backtracking heuristics!

### 3. AI Scheduling & Resource Allocation
Airline crew scheduling, university examination timetabling, and cloud cluster job placement must satisfy complex constraints (e.g., *Pilot A cannot fly two flights within 10 hours*, *Exam X and Y cannot share Room 101*). Depth-first backtracking with forward checking (pruning) is the foundation of constraint logic programming ('Prolog', 'Google OR-Tools').
    `,
  },
  {
    id: "faq",
    title: "13. Frequently Asked Questions (FAQ)",
    category: "THEORY",
    summary: "Answers to common theoretical and practical questions about N-Queen.",
    content: `
# Frequently Asked Questions (FAQ)

### Q1: Why are there 0 solutions for N = 2 and N = 3?
For N = 2, placing a queen anywhere on the 2 × 2 board immediately attacks the only remaining squares in the next row via column or diagonal.
For N = 3, placing a queen in Row 0 leaves at most one non-attacked square in Row 1, and regardless of choice, Row 2 will have zero safe squares remaining. N = 4 is the first integer greater than 1 where non-attacking queens can exist (2 solutions).

### Q2: Is there a closed-form mathematical formula to calculate S(N) without searching?
**No!** As of 2026, there is no known polynomial-time formula or exact analytical equation that computes the number of N-Queen solutions S(N) for arbitrary N. It remains an open problem in combinatorics (OEIS sequence A000170). The only way to find S(14) = 365,596 is through algorithmic enumeration!

### Q3: Can N-Queen be solved in polynomial time O(N) if we only need ONE valid placement (not all)?
**Yes!** If you only need to produce *one* single valid board placement for any N ≥ 4, explicit construction algorithms (such as the explicit arithmetic formulas discovered by Boas in 1969) can generate a valid queen array in **O(N) linear time** without any backtracking search! Our interactive visualizer includes both the instant construction/solver and the exploratory state tree.
    `,
  },
];
