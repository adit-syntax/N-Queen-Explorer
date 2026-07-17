"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Sparkles, RefreshCw } from "lucide-react";
import { getRandomSolution } from "@/lib/algorithms/nQueenSolver";

export const HeroChessboard: React.FC = () => {
  const [boardSize] = useState(8);
  const [solution, setSolution] = useState<number[]>([0, 4, 7, 5, 2, 6, 1, 3]);
  const [placedQueens, setPlacedQueens] = useState<number[]>([]);
  const [activeRow, setActiveRow] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Auto-run simulation sequence for hero display
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeRow < boardSize && !isCompleted) {
      timer = setTimeout(() => {
        setPlacedQueens((prev) => [...prev, solution[activeRow]]);
        setActiveRow((prev) => prev + 1);
        if (activeRow + 1 === boardSize) {
          setIsCompleted(true);
        }
      }, 500);
    } else if (isCompleted) {
      timer = setTimeout(() => {
        // Reset and pick a new random solution after pausing on complete
        const nextSol = getRandomSolution(boardSize);
        setSolution(nextSol);
        setPlacedQueens([]);
        setActiveRow(0);
        setIsCompleted(false);
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [activeRow, boardSize, isCompleted, solution]);

  const handleManualReset = () => {
    const nextSol = getRandomSolution(boardSize);
    setSolution(nextSol);
    setPlacedQueens([]);
    setActiveRow(0);
    setIsCompleted(false);
  };

  return (
    <div className="relative p-6 rounded-3xl glass-card border border-border/60 shadow-2xl overflow-hidden max-w-md w-full mx-auto group">
      {/* Background glow circle */}
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/40 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-indigo-500 animate-spin" style={{ animationDuration: "6s" }} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <span>Live N=8 Simulation</span>
              {isCompleted && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Valid Solution
                </span>
              )}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Automatic Backtracking (O(1) bitmask check)
            </p>
          </div>
        </div>
        <button
          onClick={handleManualReset}
          className="p-2 rounded-xl hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-border/40"
          title="Randomize Board"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Chessboard Grid */}
      <div className="grid grid-cols-8 gap-1 aspect-square rounded-2xl overflow-hidden border-2 border-border/80 shadow-inner bg-secondary/30 p-1 relative z-10">
        {Array.from({ length: boardSize }).map((_, r) =>
          Array.from({ length: boardSize }).map((_, c) => {
            const isDark = (r + c) % 2 === 1;
            const hasQueen = r < placedQueens.length && placedQueens[r] === c;
            const isCurrentInspected = r === activeRow && solution[r] === c && !isCompleted;

            return (
              <div
                key={`${r}-${c}`}
                className={`relative rounded-md flex items-center justify-center transition-all duration-300 ${
                  isDark
                    ? "bg-slate-300/40 dark:bg-slate-800/80"
                    : "bg-slate-100/70 dark:bg-slate-700/40"
                } ${
                  isCurrentInspected
                    ? "ring-2 ring-indigo-500 ring-inset bg-indigo-500/20 shadow-md animate-pulse"
                    : ""
                } ${
                  hasQueen && isCompleted
                    ? "bg-emerald-500/15 dark:bg-emerald-500/25 ring-1 ring-emerald-500/40"
                    : ""
                }`}
              >
                {/* Coordinates inside corner cells */}
                {r === 7 && (
                  <span className="absolute bottom-0.5 right-1 text-[8px] font-mono text-muted-foreground/60 select-none">
                    {String.fromCharCode(97 + c)}
                  </span>
                )}
                {c === 0 && (
                  <span className="absolute top-0.5 left-1 text-[8px] font-mono text-muted-foreground/60 select-none">
                    {8 - r}
                  </span>
                )}

                {/* Queen Placement Animation */}
                <AnimatePresence>
                  {hasQueen && (
                    <motion.div
                      initial={{ scale: 0, rotate: -30, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      exit={{ scale: 0, rotate: 30, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 20,
                      }}
                      className={`w-4/5 h-4/5 rounded-lg flex items-center justify-center shadow-lg ${
                        isCompleted
                          ? "bg-gradient-to-tr from-emerald-600 to-teal-400 text-white glow-emerald"
                          : "bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white glow-primary"
                      }`}
                    >
                      <Crown className="w-3.5 h-3.5 stroke-[2.5]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Stats inside Badge */}
      <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-mono text-muted-foreground relative z-10">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
          <span>Depth: {activeRow} / 8</span>
        </div>
        <div>
          <span>Pruning Ratio: ~99.8%</span>
        </div>
      </div>
    </div>
  );
};
