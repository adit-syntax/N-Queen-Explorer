export type AlgorithmType = "BACKTRACKING_STANDARD" | "BITMASK_OPTIMIZED" | "BRUTE_FORCE";

export interface AlgorithmStats {
  nodesVisited: number;
  backtracks: number;
  currentDepth: number;
  solutionsFound: number;
  elapsedTimeMs: number;
}

export interface StackFrame {
  id: string;
  row: number;
  col: number;
  colsSet: number[];
  diag1Set: number[];
  diag2Set: number[];
  description: string;
  // Bitmask representations (when bitmask algorithm is active)
  bitmaskCols?: string;
  bitmaskDiag1?: string;
  bitmaskDiag2?: string;
}

export type TreeNodeStatus = "ACTIVE" | "SAFE" | "PRUNED" | "SOLUTION";

export interface TreeNode {
  id: string;
  parentId: string | null;
  row: number;
  col: number;
  status: TreeNodeStatus;
  children: TreeNode[];
}

export interface UnsafeReason {
  type: "COLUMN" | "DIAG_MAIN" | "DIAG_ANTI" | "NONE";
  sourceRow?: number;
  sourceCol?: number;
  message?: string;
}

export type ActionType =
  | "START"
  | "CHECK_UNSAFE"
  | "PLACE"
  | "BACKTRACK"
  | "SOLUTION"
  | "ADVANCE"
  | "COMPLETE";

export interface SimulationStep {
  stepIndex: number;
  board: number[]; // 1D array where index = row, value = col (-1 if unplaced)
  currentRow: number;
  currentCol: number;
  action: ActionType;
  unsafeReason: UnsafeReason;
  callStack: StackFrame[];
  treeNode: TreeNode | null;
  stats: AlgorithmStats;
  explanation: string;
}

export interface Solution {
  id: number;
  board: number[];
}
