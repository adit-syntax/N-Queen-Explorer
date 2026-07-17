"use client";

import React from "react";
import { Layers, CornerDownRight, Terminal } from "lucide-react";
import { StackFrame } from "@/lib/algorithms/types";

interface CallStackPanelProps {
  callStack: StackFrame[] | undefined;
}

export const CallStackPanel: React.FC<CallStackPanelProps> = ({ callStack = [] }) => {
  return (
    <div className="p-5 rounded-2xl glass-panel border border-border/60 shadow-lg flex flex-col h-full max-h-[420px]">
      <div className="flex items-center justify-between pb-3 border-b border-border/40 mb-3">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-500" />
          <span>Execution Call Stack</span>
        </h3>
        <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-500 font-mono text-xs font-bold">
          Frames: {callStack.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {callStack.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-12 text-muted-foreground">
            <Terminal className="w-8 h-8 opacity-30 mb-2" />
            <p className="text-xs font-medium">Stack is empty or simulation paused at root.</p>
            <p className="text-[11px] opacity-75 mt-0.5">Press Play or Next Step to push recursion frames.</p>
          </div>
        ) : (
          callStack.map((frame, index) => {
            const isTop = index === callStack.length - 1;
            return (
              <div
                key={frame.id || index}
                className={`p-3 rounded-xl border text-xs font-mono transition-all ${
                  isTop
                    ? "bg-purple-500/15 border-purple-500/40 text-foreground shadow-sm ring-1 ring-purple-500/20"
                    : "bg-secondary/40 border-border/40 text-muted-foreground opacity-80"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-bold text-purple-400 dark:text-purple-300">
                    <CornerDownRight className="w-3.5 h-3.5" />
                    <span>Level #{frame.row}</span>
                  </span>
                  {isTop && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-purple-500 text-white uppercase tracking-wider">
                      Active Top
                    </span>
                  )}
                </div>
                <div className="mt-1.5 font-sans text-foreground/90 font-medium break-all">
                  {frame.description}
                </div>
                {frame.colsSet && frame.colsSet.length > 0 && (
                  <div className="mt-1.5 pt-1.5 border-t border-border/40 text-[10px] text-muted-foreground flex flex-wrap gap-2">
                    <span>Placed Cols: [{frame.colsSet.join(", ")}]</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
