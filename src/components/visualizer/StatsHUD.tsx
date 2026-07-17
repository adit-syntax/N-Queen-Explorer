"use client";

import React from "react";
import {
  Activity,
  RotateCcw,
  Layers,
  Award,
  Clock,
  Cpu,
  Binary,
} from "lucide-react";
import { AlgorithmStats, StackFrame, AlgorithmType } from "@/lib/algorithms/types";

interface StatsHUDProps {
  stats: AlgorithmStats | undefined;
  boardSize: number;
  activeFrame?: StackFrame;
  algorithm: AlgorithmType;
}

export const StatsHUD: React.FC<StatsHUDProps> = ({
  stats,
  boardSize,
  activeFrame,
  algorithm,
}) => {
  const visited = stats?.nodesVisited ?? 0;
  const backtracks = stats?.backtracks ?? 0;
  const depth = stats?.currentDepth ?? 0;
  const solutions = stats?.solutionsFound ?? 0;
  const time = stats?.elapsedTimeMs ?? 0;

  return (
    <div className="p-5 rounded-2xl glass-panel border border-border/60 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <span>Live Algorithmic Telemetry</span>
        </h3>
        <span className="text-[11px] font-mono text-muted-foreground">
          {algorithm.replace("_", " ")}
        </span>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Nodes Visited */}
        <div className="p-3.5 rounded-xl bg-secondary/60 border border-border/40 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
            <span>Nodes Visited</span>
            <Cpu className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-foreground mt-1.5">
            {visited.toLocaleString()}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            State tree candidates
          </div>
        </div>

        {/* Backtracks */}
        <div className="p-3.5 rounded-xl bg-secondary/60 border border-border/40 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
            <span>Backtracks</span>
            <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-amber-500 mt-1.5">
            {backtracks.toLocaleString()}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            Pruned branch steps
          </div>
        </div>

        {/* Current Depth */}
        <div className="p-3.5 rounded-xl bg-secondary/60 border border-border/40 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
            <span>Current Depth</span>
            <Layers className="w-3.5 h-3.5 text-purple-500" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-foreground mt-1.5">
            {depth} / <span className="text-sm text-muted-foreground">{boardSize}</span>
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            Active recursion level
          </div>
        </div>

        {/* Solutions Found */}
        <div className="p-3.5 rounded-xl bg-secondary/60 border border-border/40 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
            <span>Solutions Found</span>
            <Award className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-500 mt-1.5">
            {solutions.toLocaleString()}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            Complete valid boards
          </div>
        </div>

        {/* Elapsed Time */}
        <div className="p-3.5 rounded-xl bg-secondary/60 border border-border/40 flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
            <span>Elapsed Time</span>
            <Clock className="w-3.5 h-3.5 text-pink-500" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-foreground mt-1.5">
            {time} <span className="text-xs font-normal text-muted-foreground">ms</span>
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            Real execution timer
          </div>
        </div>
      </div>

      {/* Bitmask Telemetry Box (If Bitmask algorithm active) */}
      {algorithm === "BITMASK_OPTIMIZED" && activeFrame && (
        <div className="pt-3 border-t border-border/40 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-foreground">
            <span className="flex items-center gap-1.5 text-purple-500 font-mono">
              <Binary className="w-4 h-4" />
              <span>Live Bitwise State (`row | col | diag`)</span>
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              Binary Width: {boardSize} bits
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-between">
              <span className="text-muted-foreground">cols:</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">
                0b{activeFrame.bitmaskCols || "0".repeat(boardSize)}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-between">
              <span className="text-muted-foreground">{"diag1 (`<< 1`):"}</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                0b{activeFrame.bitmaskDiag1 || "0".repeat(boardSize)}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-between">
              <span className="text-muted-foreground">{"diag2 (`>> 1`):"}</span>
              <span className="font-bold text-pink-600 dark:text-pink-400">
                0b{activeFrame.bitmaskDiag2 || "0".repeat(boardSize)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
