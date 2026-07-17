"use client";

import React from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Zap,
  Sliders,
  Shuffle,
  Eye,
  GitCompare,
  CheckCircle2,
} from "lucide-react";
import { AlgorithmType } from "@/lib/algorithms/types";

export type VisualizerMode = "AUTO" | "MANUAL" | "ONE_SOLUTION" | "ALL_SOLUTIONS" | "COMPARE";

interface PlaybackControlsProps {
  boardSize: number;
  setBoardSize: (size: number) => void;
  algorithm: AlgorithmType;
  setAlgorithm: (algo: AlgorithmType) => void;
  mode: VisualizerMode;
  setMode: (mode: VisualizerMode) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  stepIndex: number;
  totalSteps: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  onReset: () => void;
  onRandomBoard: () => void;
  speed: number;
  setSpeed: (speed: number) => void;
  onShowOneSolution: () => void;
  onShowAllSolutions: () => void;
  onSeekStep?: (step: number) => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  boardSize,
  setBoardSize,
  algorithm,
  setAlgorithm,
  mode,
  setMode,
  isPlaying,
  setIsPlaying,
  stepIndex,
  totalSteps,
  onNextStep,
  onPrevStep,
  onReset,
  onRandomBoard,
  speed,
  setSpeed,
  onShowOneSolution,
  onShowAllSolutions,
  onSeekStep,
}) => {
  return (
    <div className="p-5 rounded-2xl glass-panel border border-border/60 shadow-lg space-y-5">
      {/* Top Bar: Size Slider + Algorithm Selector + Mode Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Board Size Selector (4 - 14) */}
        <div className="md:col-span-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-foreground">
            <span className="flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-primary" />
              <span>Board Size (N)</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-mono font-bold text-sm">
              {boardSize} × {boardSize}
            </span>
          </div>
          <input
            type="range"
            min={4}
            max={14}
            value={boardSize}
            onChange={(e) => {
              setBoardSize(Number(e.target.value));
            }}
            disabled={isPlaying}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary disabled:opacity-50"
          />
          <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
            <span>4 (Easy)</span>
            <span>8 (Classic)</span>
            <span>14 (Pro)</span>
          </div>
        </div>

        {/* Algorithm Selector */}
        <div className="md:col-span-4 space-y-1.5">
          <label className="text-xs font-semibold text-foreground block">
            Algorithm / Optimization Mode
          </label>
          <select
            value={algorithm}
            onChange={(e) => {
              setAlgorithm(e.target.value as AlgorithmType);
            }}
            disabled={isPlaying || mode === "COMPARE"}
            className="w-full px-3 py-2 rounded-xl bg-secondary/80 border border-border/60 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          >
            <option value="BACKTRACKING_STANDARD">Standard Backtracking (O(N!))</option>
            <option value="BITMASK_OPTIMIZED">Bitmask Optimized (`row | col | diag` O(1))</option>
            <option value="BRUTE_FORCE">Brute Force Permutations (Nⁿ vs Pruned)</option>
          </select>
        </div>

        {/* Modes Toggle */}
        <div className="md:col-span-5 flex flex-wrap gap-1.5 justify-start md:justify-end">
          <button
            onClick={() => {
              setMode("AUTO");
              setIsPlaying(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              mode === "AUTO" || mode === "MANUAL"
                ? "bg-primary text-white shadow-sm"
                : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Step Studio</span>
          </button>

          <button
            onClick={() => {
              setMode("ONE_SOLUTION");
              setIsPlaying(false);
              onShowOneSolution();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              mode === "ONE_SOLUTION"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>One Solution</span>
          </button>

          <button
            onClick={() => {
              setMode("ALL_SOLUTIONS");
              setIsPlaying(false);
              onShowAllSolutions();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              mode === "ALL_SOLUTIONS"
                ? "bg-purple-600 text-white shadow-sm"
                : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>All Solutions</span>
          </button>

          <button
            onClick={() => {
              setMode("COMPARE");
              setIsPlaying(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              mode === "COMPARE"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Compare Mode</span>
          </button>
        </div>
      </div>

      {/* Transport Controls Bar (When in Step Studio mode) */}
      {mode !== "COMPARE" && mode !== "ALL_SOLUTIONS" && (
        <div className="pt-3 border-t border-border/40 flex flex-wrap items-center justify-between gap-4">
          {/* Left Buttons: Play/Pause, Next/Prev, Reset, Random */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all duration-200 ${
                isPlaying
                  ? "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/25"
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-white" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Play Auto-Solve</span>
                </>
              )}
            </button>

            <button
              onClick={onPrevStep}
              disabled={isPlaying || stepIndex <= 0}
              className="p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors border border-border/40"
              title="Previous Step (Rewind)"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={onNextStep}
              disabled={isPlaying || stepIndex >= totalSteps - 1}
              className="p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors border border-border/40"
              title="Next Step (Forward)"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={onReset}
              className="p-2.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-border/40 ml-1"
              title="Reset Simulation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onRandomBoard}
              disabled={isPlaying}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-secondary text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors border border-border/40 disabled:opacity-50 ml-1"
              title="Pick a random valid solution board instantly"
            >
              <Shuffle className="w-3.5 h-3.5 text-indigo-500" />
              <span>Random Board</span>
            </button>
          </div>

          {/* Right Slider: Speed (1× - 50×) */}
          <div className="flex items-center gap-3 min-w-[200px]">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Speed:</span>
            </span>
            <input
              type="range"
              min={1}
              max={50}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <span className="w-10 text-right text-xs font-mono font-bold text-foreground">
              {speed}×
            </span>
          </div>
        </div>
      )}

      {/* Step Progress Bar / Scrubber */}
      {totalSteps > 0 && mode !== "COMPARE" && mode !== "ALL_SOLUTIONS" && (
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs font-mono text-muted-foreground">
            <span className="font-semibold text-foreground">Timeline Scrubber (Drag to Seek)</span>
            <span>
              Step {stepIndex + 1} / {totalSteps}
            </span>
          </div>
          <div className="relative flex items-center">
            <input
              type="range"
              min={0}
              max={Math.max(0, totalSteps - 1)}
              value={stepIndex}
              onChange={(e) => {
                if (onSeekStep) {
                  onSeekStep(Number(e.target.value));
                }
              }}
              disabled={isPlaying}
              className="w-full h-2.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none disabled:opacity-50"
            />
          </div>
        </div>
      )}
    </div>
  );
};
