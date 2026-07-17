import {
  SimulationStep,
  AlgorithmType,
  StackFrame,
  TreeNode,
  AlgorithmStats,
  ActionType,
  UnsafeReason,
} from "./types";
import { getAttackDetails } from "./nQueenSolver";

const MAX_STEPS_CAP = 1200; // Cap steps for super snappy browser performance without UI hangs

// Fast bounded tree cloner ($O(1)$ allocation instead of deep JSON stringification)
const cloneTreeBounded = (node: TreeNode, countRef: { count: number }, maxNodes = 120): TreeNode => {
  if (countRef.count >= maxNodes) {
    return { ...node, children: [] };
  }
  countRef.count++;
  return {
    ...node,
    children: node.children.slice(-12).map((child) => cloneTreeBounded(child, countRef, maxNodes)),
  };
};

/**
 * Generate full sequence of simulation steps for time-travel playback and visual state trees.
 */
export function generateSteps(
  n: number,
  algorithm: AlgorithmType = "BACKTRACKING_STANDARD"
): SimulationStep[] {
  const steps: SimulationStep[] = [];
  const board = new Array(n).fill(-1);
  const callStack: StackFrame[] = [];
  
  let stepIndex = 0;
  let nodesVisited = 0;
  let backtracks = 0;
  let solutionsFound = 0;
  const startTime = performance.now();

  // Root tree node
  const rootNode: TreeNode = {
    id: "root",
    parentId: null,
    row: -1,
    col: -1,
    status: "ACTIVE",
    children: [],
  };

  const treeNodeMap: Map<string, TreeNode> = new Map();
  treeNodeMap.set("root", rootNode);

  const getStats = (): AlgorithmStats => ({
    nodesVisited,
    backtracks,
    currentDepth: callStack.length,
    solutionsFound,
    elapsedTimeMs: Math.round((performance.now() - startTime) * 10) / 10,
  });

  const pushStep = (
    currentRow: number,
    currentCol: number,
    action: ActionType,
    unsafeReason: UnsafeReason,
    explanation: string,
    activeTreeNode: TreeNode | null
  ) => {
    if (steps.length >= MAX_STEPS_CAP) return;
    steps.push({
      stepIndex: stepIndex++,
      board: [...board],
      currentRow,
      currentCol,
      action,
      unsafeReason,
      callStack: callStack.map((f) => ({ ...f, colsSet: [...f.colsSet], diag1Set: [...f.diag1Set], diag2Set: [...f.diag2Set] })),
      treeNode: activeTreeNode ? cloneTreeBounded(rootNode, { count: 0 }, 120) : null,
      stats: getStats(),
      explanation,
    });
  };

  // Initial step
  pushStep(
    0,
    0,
    "START",
    { type: "NONE" },
    `Starting ${algorithm.replace("_", " ")} simulation on ${n}x${n} board.`,
    rootNode
  );

  if (algorithm === "BACKTRACKING_STANDARD") {
    const solveStandard = (row: number, parentNodeId: string) => {
      if (steps.length >= MAX_STEPS_CAP || nodesVisited >= 25000) return;
      if (row === n) {
        solutionsFound++;
        pushStep(
          row - 1,
          board[row - 1],
          "SOLUTION",
          { type: "NONE" },
          `🎉 Solution #${solutionsFound} found! All ${n} queens placed without conflicts.`,
          rootNode
        );
        return;
      }

      for (let col = 0; col < n; col++) {
        if (steps.length >= MAX_STEPS_CAP || nodesVisited >= 25000) break;
        nodesVisited++;

        // Add to tree node
        const nodeId = `node_${row}_${col}_${stepIndex}`;
        const parentNode = treeNodeMap.get(parentNodeId) || rootNode;
        const newNode: TreeNode = {
          id: nodeId,
          parentId: parentNodeId,
          row,
          col,
          status: "ACTIVE",
          children: [],
        };
        parentNode.children.push(newNode);
        treeNodeMap.set(nodeId, newNode);

        // Push stack frame
        const frame: StackFrame = {
          id: `frame_${row}_${col}`,
          row,
          col,
          colsSet: board.slice(0, row).filter((c) => c !== -1),
          diag1Set: board.slice(0, row).map((c, r) => r - c),
          diag2Set: board.slice(0, row).map((c, r) => r + c),
          description: `solve(row: ${row}, candidateCol: ${col})`,
        };
        callStack.push(frame);

        // Check safety
        const attack = getAttackDetails(board, row, col);
        if (!attack.safe) {
          newNode.status = "PRUNED";
          pushStep(
            row,
            col,
            "CHECK_UNSAFE",
            {
              type: attack.type,
              sourceRow: attack.sourceRow,
              sourceCol: attack.sourceCol,
              message: `Threatened by queen at (${attack.sourceRow}, ${attack.sourceCol}) via ${attack.type.toLowerCase()}`,
            },
            `Cell (${row}, ${col}) is UNSAFE due to queen at (${attack.sourceRow}, ${attack.sourceCol}) [${attack.type}]. Pruning branch.`,
            rootNode
          );
          callStack.pop();
          continue;
        }

        // Safe placement
        board[row] = col;
        newNode.status = "SAFE";
        pushStep(
          row,
          col,
          "PLACE",
          { type: "NONE" },
          `Placed queen # ${row + 1} at safe position (${row}, ${col}). Advancing to row ${row + 1}.`,
          rootNode
        );

        // Recurse
        solveStandard(row + 1, nodeId);

        // Backtrack
        if (steps.length < MAX_STEPS_CAP) {
          backtracks++;
          board[row] = -1;
          callStack.pop();
          newNode.status = "PRUNED";
          pushStep(
            row,
            col,
            "BACKTRACK",
            { type: "NONE" },
            `Backtracking from (${row}, ${col}) to explore remaining columns in row ${row}.`,
            rootNode
          );
        } else {
          callStack.pop();
        }
      }
    };

    solveStandard(0, "root");
  } else if (algorithm === "BITMASK_OPTIMIZED") {
    const solveBitmask = (row: number, cols: number, diag1: number, diag2: number, parentNodeId: string) => {
      if (steps.length >= MAX_STEPS_CAP || nodesVisited >= 25000) return;
      if (row === n) {
        solutionsFound++;
        pushStep(
          row - 1,
          board[row - 1],
          "SOLUTION",
          { type: "NONE" },
          `⚡ Bitmask Solution #${solutionsFound} found! Board complete.`,
          rootNode
        );
        return;
      }

      for (let col = 0; col < n; col++) {
        if (steps.length >= MAX_STEPS_CAP || nodesVisited >= 25000) break;
        nodesVisited++;

        const bit = 1 << col;
        const isColUnsafe = (cols & bit) !== 0;
        const isDiag1Unsafe = (diag1 & bit) !== 0;
        const isDiag2Unsafe = (diag2 & bit) !== 0;
        const isUnsafe = isColUnsafe || isDiag1Unsafe || isDiag2Unsafe;

        const nodeId = `node_bit_${row}_${col}_${stepIndex}`;
        const parentNode = treeNodeMap.get(parentNodeId) || rootNode;
        const newNode: TreeNode = {
          id: nodeId,
          parentId: parentNodeId,
          row,
          col,
          status: isUnsafe ? "PRUNED" : "ACTIVE",
          children: [],
        };
        parentNode.children.push(newNode);
        treeNodeMap.set(nodeId, newNode);

        const frame: StackFrame = {
          id: `frame_bit_${row}_${col}`,
          row,
          col,
          colsSet: [],
          diag1Set: [],
          diag2Set: [],
          description: `solveBitmask(row: ${row}, col: ${col})`,
          bitmaskCols: cols.toString(2).padStart(n, "0"),
          bitmaskDiag1: diag1.toString(2).padStart(n, "0"),
          bitmaskDiag2: diag2.toString(2).padStart(n, "0"),
        };
        callStack.push(frame);

        if (isUnsafe) {
          let reasonType: "COLUMN" | "DIAG_MAIN" | "DIAG_ANTI" | "NONE" = "COLUMN";
          let reasonMsg = "Column mask check failed: (cols & (1 << col)) != 0";
          if (isDiag1Unsafe) {
            reasonType = "DIAG_MAIN";
            reasonMsg = "Main diagonal mask check failed: (diag1 & (1 << col)) != 0";
          } if (isDiag2Unsafe) {
            reasonType = "DIAG_ANTI";
            reasonMsg = "Anti-diagonal mask check failed: (diag2 & (1 << col)) != 0";
          }

          pushStep(
            row,
            col,
            "CHECK_UNSAFE",
            { type: reasonType, message: reasonMsg },
            `O(1) Bitmask check: Cell (${row}, ${col}) is unsafe! ${reasonMsg}. Pruning instantly without loop.`,
            rootNode
          );
          callStack.pop();
          continue;
        }

        board[row] = col;
        newNode.status = "SAFE";
        pushStep(
          row,
          col,
          "PLACE",
          { type: "NONE" },
          `Bitwise OK! Placed queen at (${row}, ${col}). Next state: cols=${(cols | bit).toString(2)}, diag1=${((diag1 | bit) << 1).toString(2)}, diag2=${((diag2 | bit) >> 1).toString(2)}`,
          rootNode
        );

        solveBitmask(row + 1, cols | bit, (diag1 | bit) << 1, (diag2 | bit) >> 1, nodeId);

        if (steps.length < MAX_STEPS_CAP && nodesVisited < 25000) {
          backtracks++;
          board[row] = -1;
          callStack.pop();
          newNode.status = "PRUNED";
          pushStep(
            row,
            col,
            "BACKTRACK",
            { type: "NONE" },
            `Bitmask Backtrack: clearing queen at (${row}, ${col}) to test next bits.`,
            rootNode
          );
        } else {
          callStack.pop();
        }
      }
    };

    solveBitmask(0, 0, 0, 0, "root");
  } else if (algorithm === "BRUTE_FORCE") {
    // Brute force: places queen in every row blindly without pruning early rows, checking only when all n placed
    const solveBrute = (row: number, parentNodeId: string) => {
      if (steps.length >= MAX_STEPS_CAP || nodesVisited >= 25000) return;
      if (row === n) {
        // Check validity of full board permutation
        let valid = true;
        for (let r = 0; r < n; r++) {
          const attack = getAttackDetails(board, r, board[r]);
          if (!attack.safe) {
            valid = false;
            pushStep(
              r,
              board[r],
              "CHECK_UNSAFE",
              { type: attack.type, sourceRow: attack.sourceRow, sourceCol: attack.sourceCol },
              `Brute Force validation failed at row ${r}: conflict with row ${attack.sourceRow}. Entire board invalid.`,
              rootNode
            );
            break;
          }
        }

        if (valid) {
          solutionsFound++;
          pushStep(
            n - 1,
            board[n - 1],
            "SOLUTION",
            { type: "NONE" },
            `🏆 Brute Force found valid board permutation #${solutionsFound}!`,
            rootNode
          );
        } else {
          backtracks++;
        }
        return;
      }

      for (let col = 0; col < n; col++) {
        if (steps.length >= MAX_STEPS_CAP || nodesVisited >= 25000) break;
        nodesVisited++;

        const nodeId = `node_brute_${row}_${col}_${stepIndex}`;
        const parentNode = treeNodeMap.get(parentNodeId) || rootNode;
        const newNode: TreeNode = {
          id: nodeId,
          parentId: parentNodeId,
          row,
          col,
          status: "ACTIVE",
          children: [],
        };
        parentNode.children.push(newNode);
        treeNodeMap.set(nodeId, newNode);

        board[row] = col;
        pushStep(
          row,
          col,
          "PLACE",
          { type: "NONE" },
          `Brute Force: blindly placing queen at (${row}, ${col}) without early pruning check.`,
          rootNode
        );

        solveBrute(row + 1, nodeId);
        board[row] = -1;
      }
    };

    solveBrute(0, "root");
  }

  // Final step
  pushStep(
    0,
    0,
    "COMPLETE",
    { type: "NONE" },
    `Simulation completed. Total solutions found: ${solutionsFound}. Nodes explored: ${nodesVisited}. Backtracks triggered: ${backtracks}.`,
    rootNode
  );

  return steps;
}
