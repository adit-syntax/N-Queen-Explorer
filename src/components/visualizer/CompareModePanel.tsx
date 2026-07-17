"use client";

import React, { useState, useEffect } from "react";
import { GitCompare, Play, Pause, RotateCcw, Zap, AlertTriangle } from "lucide-react";
import { Chessboard } from "./Chessboard";
import { generateSteps } from "@/lib/algorithms/nQueenGenerator";
import { SimulationStep } from "@/lib/algorithms/types";

interface CompareModePanelProps {
  boardSize: number;
}

export const CompareModePanel: React.FC<CompareModePanelProps> = ({ boardSize }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed] = useState(10); // steps per tick
  const [bruteSteps, setBruteSteps] = useState<SimulationStep[]>([]);
  const [bitmaskSteps, setBitmaskSteps] = useState<SimulationStep[]>([]);
  const [bruteIndex, setBruteIndex] = useState(0);
  const [bitmaskIndex, setBitmaskIndex] = useState(0);

  // Generate both step sequences whenever board size changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPlaying(false);
      const bSteps = generateSteps(boardSize, "BRUTE_FORCE");
      const mSteps = generateSteps(boardSize, "BITMASK_OPTIMIZED");
      setBruteSteps(bSteps);
      setBitmaskSteps(mSteps);
      setBruteIndex(0);
      setBitmaskIndex(0);
    }, 0);
    return () => clearTimeout(timer);
  }, [boardSize]);

  // Dual simulation playback loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setBruteIndex((prev) => Math.min(prev + 1, bruteSteps.length - 1));
        setBitmaskIndex((prev) => Math.min(prev + 1, bitmaskSteps.length - 1));

        if (bruteIndex >= bruteSteps.length - 1 && bitmaskIndex >= bitmaskSteps.length - 1) {
          setIsPlaying(false);
        }
      }, Math.max(20, 300 / speed));
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed, bruteIndex, bitmaskIndex, bruteSteps.length, bitmaskSteps.length]);

  const handleReset = () => {
    setIsPlaying(false);
    setBruteIndex(0);
    setBitmaskIndex(0);
  };

  const currentBruteStep = bruteSteps[bruteIndex] || null;
  const currentBitmaskStep = bitmaskSteps[bitmaskIndex] || null;

  return (
    <div className="space-y-6">
      {/* Comparison Toolbar */}
      <div className="p-5 rounded-2xl glass-panel border border-border/60 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center shadow-md">
            <GitCompare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              Brute Force vs Bitmask Optimized Engine
            </h3>
            <p className="text-xs text-muted-foreground">
              Watch both algorithms race concurrently on the {boardSize}×{boardSize} chessboard.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all ${
              isPlaying
                ? "bg-rose-500 hover:bg-rose-600 text-white"
                : "bg-gradient-to-r from-amber-500 to-purple-600 text-white"
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
            <span>{isPlaying ? "Pause Race" : "Start Race"}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground transition-colors border border-border/40"
            title="Reset Race"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Side-by-Side Dual Visualizer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Side: Brute Force */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl glass-panel border border-amber-500/30 bg-amber-500/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Brute Force Permutations (O(Nⁿ))</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 font-mono text-xs font-bold">
                Nodes: {currentBruteStep?.stats.nodesVisited ?? 0}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tries candidate columns in every row blindly without checking diagonal threats until all N queens are placed. Extremely slow as N grows!
            </p>
          </div>
          <div className="flex justify-center">
            <Chessboard boardSize={boardSize} step={currentBruteStep} />
          </div>
        </div>

        {/* Right Side: Bitmask Optimized */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl glass-panel border border-purple-500/30 bg-purple-500/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                <span>Bitmask Optimized (`cols | diag1 | diag2`)</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-600 dark:text-purple-400 font-mono text-xs font-bold">
                Nodes: {currentBitmaskStep?.stats.nodesVisited ?? 0}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Uses O(1) bitwise operations to detect threats and prunes dead branches immediately. Orders of magnitude faster than brute force!
            </p>
          </div>
          <div className="flex justify-center">
            <Chessboard boardSize={boardSize} step={currentBitmaskStep} />
          </div>
        </div>
      </div>
    </div>
  );
};
