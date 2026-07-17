"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, AlertTriangle, Check, X, ShieldAlert } from "lucide-react";
import { SimulationStep } from "@/lib/algorithms/types";
import confetti from "canvas-confetti";

interface ChessboardProps {
  boardSize: number;
  step: SimulationStep | null;
  boardOverride?: number[];
  isCompleted?: boolean;
}

export const Chessboard: React.FC<ChessboardProps> = ({
  boardSize,
  step,
  boardOverride,
  isCompleted = false,
}) => {
  const currentBoard = boardOverride || step?.board || new Array(boardSize).fill(-1);
  const currentRow = step?.currentRow ?? -1;
  const currentCol = step?.currentCol ?? -1;
  const action = step?.action ?? "START";
  const unsafeReason = step?.unsafeReason;

  // Trigger celebration confetti when exact solution step is hit
  useEffect(() => {
    if (action === "SOLUTION" || isCompleted) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#6366f1", "#a855f7", "#ec4899", "#10b981"],
        });
      } catch (_e) {
        // Safe catch if canvas-confetti fails in non-browser environment
      }
    }
  }, [action, isCompleted]);

  return (
    <div className="relative p-4 sm:p-6 rounded-3xl glass-card border border-border/60 shadow-2xl flex flex-col items-center justify-center">
      {/* Board Header Bar */}
      <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-border/40 text-xs sm:text-sm font-semibold">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
          <span className="text-foreground">Live Simulation Grid</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          {step && (
            <span className="px-2.5 py-1 rounded-lg bg-secondary text-muted-foreground border border-border/40">
              Action: <strong className={action === "SOLUTION" ? "text-emerald-500" : action === "CHECK_UNSAFE" ? "text-rose-500" : "text-primary"}>{action}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div
        className="grid gap-1 rounded-2xl overflow-hidden border-4 border-border/80 shadow-2xl bg-secondary/30 p-1.5 max-w-[560px] w-full aspect-square relative"
        style={{
          gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: boardSize }).map((_, r) =>
          Array.from({ length: boardSize }).map((_, c) => {
            const isDarkSquare = (r + c) % 2 === 1;
            const hasQueen = currentBoard[r] === c;
            const isCurrentInspected = r === currentRow && c === currentCol;
            const isAttackingSource =
              unsafeReason && unsafeReason.sourceRow === r && unsafeReason.sourceCol === c && action === "CHECK_UNSAFE";
            const isUnsafeTarget = isCurrentInspected && action === "CHECK_UNSAFE";
            const isSafePlacement = isCurrentInspected && action === "PLACE";
            const isBacktrackCell = isCurrentInspected && action === "BACKTRACK";

            return (
              <div
                key={`${r}-${c}`}
                className={`relative rounded-md flex items-center justify-center transition-all duration-200 select-none ${
                  isDarkSquare
                    ? "bg-slate-300/60 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300"
                    : "bg-slate-100/90 dark:bg-slate-700/40 text-slate-800 dark:text-slate-200"
                } ${
                  isUnsafeTarget
                    ? "ring-2 sm:ring-4 ring-rose-500 ring-inset bg-rose-500/25 animate-pulse"
                    : isAttackingSource
                    ? "ring-2 sm:ring-4 ring-rose-500/80 ring-inset bg-rose-500/15"
                    : isSafePlacement
                    ? "ring-2 sm:ring-4 ring-emerald-500 ring-inset bg-emerald-500/20"
                    : isBacktrackCell
                    ? "ring-2 ring-amber-500 ring-inset bg-amber-500/20 animate-shake"
                    : isCurrentInspected
                    ? "ring-2 ring-indigo-500 ring-inset bg-indigo-500/20"
                    : ""
                }`}
              >
                {/* Board Square Coordinates */}
                {r === boardSize - 1 && (
                  <span className="absolute bottom-0.5 right-1 text-[8px] sm:text-[10px] font-mono opacity-50 pointer-events-none">
                    {String.fromCharCode(97 + c)}
                  </span>
                )}
                {c === 0 && (
                  <span className="absolute top-0.5 left-1 text-[8px] sm:text-[10px] font-mono opacity-50 pointer-events-none">
                    {boardSize - r}
                  </span>
                )}

                {/* Threat crosshairs when unsafe target */}
                {isUnsafeTarget && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-rose-500/20 rounded-md"
                  >
                    <X className="w-6 h-6 text-rose-500 stroke-[3]" />
                  </motion.div>
                )}

                {/* Attacking Source Warning badge */}
                {isAttackingSource && (
                  <div className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-sm">
                    <ShieldAlert className="w-2.5 h-2.5" />
                  </div>
                )}

                {/* Queen Placement Spring Animation */}
                <AnimatePresence>
                  {hasQueen && (
                    <motion.div
                      key={`queen-${r}-${c}`}
                      initial={{ scale: 0, rotate: -30, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      exit={{ scale: 0, rotate: 30, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 22,
                      }}
                      className={`w-4/5 h-4/5 rounded-xl flex items-center justify-center shadow-xl transition-colors ${
                        action === "SOLUTION" || isCompleted
                          ? "bg-gradient-to-tr from-emerald-600 to-teal-400 text-white glow-emerald ring-2 ring-emerald-300"
                          : isAttackingSource
                          ? "bg-gradient-to-tr from-rose-600 to-red-400 text-white glow-destructive ring-2 ring-rose-300 animate-pulse"
                          : "bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white glow-primary ring-1 ring-white/30"
                      }`}
                    >
                      <Crown className="w-1/2 h-1/2 stroke-[2.5] fill-current opacity-95" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>

      {/* Threat Reason Explanation Banner */}
      <AnimatePresence mode="wait">
        {step && step.explanation && (
          <motion.div
            key={step.stepIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`mt-4 p-3.5 rounded-2xl w-full max-w-[560px] flex items-start gap-3 border text-xs sm:text-sm font-medium shadow-sm transition-colors ${
              action === "SOLUTION"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
                : action === "CHECK_UNSAFE"
                ? "bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-300"
                : action === "PLACE"
                ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-800 dark:text-indigo-300"
                : action === "BACKTRACK"
                ? "bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300"
                : "bg-secondary/70 border-border/60 text-foreground"
            }`}
          >
            <div className="mt-0.5">
              {action === "SOLUTION" && <Check className="w-4 h-4 text-emerald-500" />}
              {action === "CHECK_UNSAFE" && <AlertTriangle className="w-4 h-4 text-rose-500" />}
              {action === "PLACE" && <Crown className="w-4 h-4 text-indigo-500" />}
              {action === "BACKTRACK" && <X className="w-4 h-4 text-amber-500" />}
            </div>
            <div className="flex-1 leading-relaxed">
              <span>{step.explanation}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
