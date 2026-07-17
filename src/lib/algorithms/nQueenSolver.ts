import { Solution } from "./types";

/**
 * Exact known total solution counts for N = 1 to 14.
 */
export const KNOWN_SOLUTION_COUNTS: Record<number, number> = {
  1: 1,
  2: 0,
  3: 0,
  4: 2,
  5: 10,
  6: 4,
  7: 40,
  8: 92,
  9: 352,
  10: 724,
  11: 2680,
  12: 14200,
  13: 73712,
  14: 365596,
};

/**
 * Fast exact solver using bitmasking ($O(1)$ check per cell) to find exact solution boards.
 * Capped at maxSolutions if requested to prevent UI freeze for N >= 12 when browsing all solutions.
 */
export function solveAllInstant(n: number, maxSolutions: number = 500): Solution[] {
  const solutions: Solution[] = [];
  const board = new Array(n).fill(-1);

  const solve = (row: number, cols: number, diag1: number, diag2: number) => {
    if (solutions.length >= maxSolutions) return;
    if (row === n) {
      solutions.push({
        id: solutions.length + 1,
        board: [...board],
      });
      return;
    }

    // Available positions in this row: bits where 0 indicates free, 1 indicates attacked
    let available = ((1 << n) - 1) & ~(cols | diag1 | diag2);
    while (available > 0 && solutions.length < maxSolutions) {
      // Pick lowest set bit (rightmost available column)
      const bit = available & -available;
      available ^= bit;

      // Calculate column index (0 to n-1)
      const col = Math.log2(bit);
      board[row] = col;

      solve(
        row + 1,
        cols | bit,
        (diag1 | bit) << 1,
        (diag2 | bit) >> 1
      );
      board[row] = -1;
    }
  };

  solve(0, 0, 0, 0);
  return solutions;
}

/**
 * Check if placing queen at (row, col) is safe given the current board state.
 * Returns exact conflict type and source coordinates if unsafe.
 */
export function getAttackDetails(
  board: number[],
  row: number,
  col: number
): { safe: boolean; type: "COLUMN" | "DIAG_MAIN" | "DIAG_ANTI" | "NONE"; sourceRow?: number; sourceCol?: number } {
  for (let r = 0; r < row; r++) {
    const c = board[r];
    if (c === -1) continue;

    if (c === col) {
      return { safe: false, type: "COLUMN", sourceRow: r, sourceCol: c };
    }
    if (r - c === row - col) {
      return { safe: false, type: "DIAG_MAIN", sourceRow: r, sourceCol: c };
    }
    if (r + c === row + col) {
      return { safe: false, type: "DIAG_ANTI", sourceRow: r, sourceCol: c };
    }
  }
  return { safe: true, type: "NONE" };
}

/**
 * Generate a random valid board state up to a certain depth or complete solution for quick testing.
 */
export function getRandomSolution(n: number): number[] {
  const all = solveAllInstant(n, 100);
  if (all.length === 0) return new Array(n).fill(-1);
  const randomIdx = Math.floor(Math.random() * all.length);
  return all[randomIdx].board;
}
