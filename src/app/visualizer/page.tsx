"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  CheckCircle2,
  Eye,
  GitCompare,
  Terminal,
  Grid,
  Info,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { PlaybackControls, VisualizerMode } from "@/components/visualizer/PlaybackControls";
import { Chessboard } from "@/components/visualizer/Chessboard";
import { StatsHUD } from "@/components/visualizer/StatsHUD";
import { CallStackPanel } from "@/components/visualizer/CallStackPanel";
import { RecursionTree } from "@/components/visualizer/RecursionTree";
import { CompareModePanel } from "@/components/visualizer/CompareModePanel";
import { generateSteps } from "@/lib/algorithms/nQueenGenerator";
import { solveAllInstant, getRandomSolution } from "@/lib/algorithms/nQueenSolver";
import { SimulationStep, AlgorithmType, Solution } from "@/lib/algorithms/types";
import { useToast } from "@/components/ui/ToastProvider";

export default function VisualizerPage() {
  const { showToast } = useToast();
  const [boardSize, setBoardSize] = useState<number>(8);
  const [algorithm, setAlgorithm] = useState<AlgorithmType>("BACKTRACKING_STANDARD");
  const [mode, setMode] = useState<VisualizerMode>("AUTO");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(5); // multiplier

  // Step generator state
  const [steps, setSteps] = useState<SimulationStep[]>([]);
  const [stepIndex, setStepIndex] = useState<number>(0);

  // Instant Solutions mode state
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [currentSolIndex, setCurrentSolIndex] = useState<number>(0);

  // Generate steps whenever boardSize or algorithm changes
  const handleReset = useCallback(() => {
    setIsPlaying(false);
    const generated = generateSteps(boardSize, algorithm);
    setSteps(generated);
    setStepIndex(0);
    if (mode === "ONE_SOLUTION") {
      const all = solveAllInstant(boardSize, 10);
      setSolutions(all);
      setCurrentSolIndex(0);
    } else if (mode === "ALL_SOLUTIONS") {
      const all = solveAllInstant(boardSize, 500);
      setSolutions(all);
      setCurrentSolIndex(0);
    }
  }, [boardSize, algorithm, mode]);

  useEffect(() => {
    const timer = setTimeout(() => handleReset(), 0);
    return () => clearTimeout(timer);
  }, [handleReset]);

  // Handle mode transitions
  const handleShowOneSolution = () => {
    const all = solveAllInstant(boardSize, 10);
    if (all.length > 0) {
      setSolutions(all);
      setCurrentSolIndex(0);
      showToast("One Solution Loaded", `Showing valid N=${boardSize} queen placement #1`, "success");
    } else {
      showToast("No Solution", `No valid solutions for N=${boardSize}`, "error");
    }
  };

  const handleShowAllSolutions = () => {
    const all = solveAllInstant(boardSize, 500);
    setSolutions(all);
    setCurrentSolIndex(0);
    showToast(
      "All Solutions Loaded",
      `Retrieved ${all.length.toLocaleString()} valid solutions for N=${boardSize}`,
      "success"
    );
  };

  const handleRandomBoard = () => {
    const randomBoard = getRandomSolution(boardSize);
    // Find if this exact board is in solutions or create a manual step preview
    setIsPlaying(false);
    showToast("Random Board Selected", `Random valid solution applied for N=${boardSize}`, "info");
    // We can jump stepIndex to a solution step if available or set mode to ONE_SOLUTION
    const all = solveAllInstant(boardSize, 100);
    const foundIdx = all.findIndex((s) => s.board.every((val, idx) => val === randomBoard[idx]));
    if (foundIdx !== -1) {
      setMode("ONE_SOLUTION");
      setSolutions(all);
      setCurrentSolIndex(foundIdx);
    }
  };

  // Auto-play loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && mode !== "COMPARE" && mode !== "ALL_SOLUTIONS") {
      const intervalMs = Math.max(20, Math.floor(1000 / speed));
      timer = setInterval(() => {
        setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
      }, intervalMs);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed, steps.length, mode]);

  // Handle auto-stop on reaching the final step without causing synchronous setState in effect or render warnings
  useEffect(() => {
    if (isPlaying && steps.length > 0 && stepIndex >= steps.length - 1 && mode !== "COMPARE" && mode !== "ALL_SOLUTIONS") {
      const stopTimer = setTimeout(() => {
        setIsPlaying(false);
        showToast("Simulation Completed", "Reached final state of algorithm execution", "success");
      }, 0);
      return () => clearTimeout(stopTimer);
    }
  }, [isPlaying, stepIndex, steps.length, mode, showToast]);

  const currentStep = steps[stepIndex] || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Studio Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Interactive Visualizer Studio
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Explore time-travel state transitions, inspect live stack frames, or compare algorithms in real-time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-xs font-mono font-semibold text-primary">
            Step {stepIndex + 1} / {steps.length}
          </span>
        </div>
      </div>

      {/* Main Playback & Controls Bar */}
      <PlaybackControls
        boardSize={boardSize}
        setBoardSize={setBoardSize}
        algorithm={algorithm}
        setAlgorithm={setAlgorithm}
        mode={mode}
        setMode={setMode}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        stepIndex={stepIndex}
        totalSteps={steps.length}
        onNextStep={() => setStepIndex((prev) => Math.min(prev + 1, steps.length - 1))}
        onPrevStep={() => setStepIndex((prev) => Math.max(prev - 1, 0))}
        onReset={handleReset}
        onRandomBoard={handleRandomBoard}
        speed={speed}
        setSpeed={setSpeed}
        onShowOneSolution={handleShowOneSolution}
        onShowAllSolutions={handleShowAllSolutions}
        onSeekStep={(step) => {
          setIsPlaying(false);
          setStepIndex(step);
        }}
      />

      {/* View Switcher based on current mode */}
      <AnimatePresence mode="wait">
        {mode === "COMPARE" ? (
          <motion.div
            key="compare"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <CompareModePanel boardSize={boardSize} />
          </motion.div>
        ) : mode === "ONE_SOLUTION" || mode === "ALL_SOLUTIONS" ? (
          <motion.div
            key="solutions"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Solutions Navigation Toolbar */}
            <div className="p-4 rounded-2xl glass-panel border border-border/60 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-mono font-bold">
                  #{solutions[currentSolIndex]?.id || 1}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    Exact Solution Board #{currentSolIndex + 1} of {solutions.length.toLocaleString()}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    All {boardSize} queens placed without diagonal or vertical conflicts.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentSolIndex((prev) => Math.max(prev - 1, 0))}
                  disabled={currentSolIndex <= 0}
                  className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground disabled:opacity-40 border border-border/40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono font-semibold px-3 py-1.5 rounded-xl bg-secondary text-foreground">
                  {currentSolIndex + 1} / {solutions.length}
                </span>
                <button
                  onClick={() => setCurrentSolIndex((prev) => Math.min(prev + 1, solutions.length - 1))}
                  disabled={currentSolIndex >= solutions.length - 1}
                  className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground disabled:opacity-40 border border-border/40 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Solution Chessboard + Thumbnail Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 flex justify-center">
                <Chessboard
                  boardSize={boardSize}
                  step={null}
                  boardOverride={solutions[currentSolIndex]?.board || new Array(boardSize).fill(-1)}
                  isCompleted={true}
                />
              </div>

              {/* Thumbnails list if ALL_SOLUTIONS */}
              <div className="lg:col-span-5 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider font-mono text-muted-foreground">
                  Quick Jump Thumbnail Gallery ({solutions.length})
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[460px] overflow-y-auto p-2 rounded-2xl glass-panel border border-border/60">
                  {solutions.slice(0, 120).map((sol, idx) => (
                    <button
                      key={sol.id}
                      onClick={() => setCurrentSolIndex(idx)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        currentSolIndex === idx
                          ? "bg-primary text-white border-primary shadow-md font-bold scale-105"
                          : "bg-secondary/40 hover:bg-secondary border-border/40 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div className="text-xs font-mono">#{sol.id}</div>
                      <div className="text-[9px] opacity-75 truncate mt-0.5 font-mono">
                        [{sol.board.slice(0, 4).join(",")}]
                      </div>
                    </button>
                  ))}
                  {solutions.length > 120 && (
                    <div className="col-span-full py-2 text-center text-xs text-muted-foreground font-mono">
                      + {solutions.length - 120} more solutions available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="studio"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Live Telemetry HUD */}
            <StatsHUD
              stats={currentStep?.stats}
              boardSize={boardSize}
              activeFrame={
                currentStep && currentStep.callStack.length > 0
                  ? currentStep.callStack[currentStep.callStack.length - 1]
                  : undefined
              }
              algorithm={algorithm}
            />

            {/* Main Split: Chessboard + Side Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Grid: Chessboard */}
              <div className="lg:col-span-7 flex justify-center">
                <Chessboard boardSize={boardSize} step={currentStep} />
              </div>

              {/* Right Panels: Call Stack & Recursion Tree */}
              <div className="lg:col-span-5 space-y-6">
                <CallStackPanel callStack={currentStep?.callStack} />
                <RecursionTree rootNode={currentStep?.treeNode || null} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
