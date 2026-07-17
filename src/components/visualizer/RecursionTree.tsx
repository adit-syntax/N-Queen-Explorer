"use client";

import React, { useState } from "react";
import { GitBranch, Crown, X, Check, ChevronDown, ChevronRight } from "lucide-react";
import { TreeNode } from "@/lib/algorithms/types";

interface RecursionTreeProps {
  rootNode: TreeNode | null;
}

const TreeNodeView: React.FC<{ node: TreeNode; level: number }> = ({ node, level }) => {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  const getStatusStyle = () => {
    switch (node.status) {
      case "SOLUTION":
        return "bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold shadow-sm ring-1 ring-emerald-500/30";
      case "SAFE":
        return "bg-indigo-500/15 border-indigo-500/60 text-indigo-700 dark:text-indigo-300";
      case "PRUNED":
        return "bg-rose-500/15 border-rose-500/50 text-rose-700 dark:text-rose-300 opacity-75 line-through";
      case "ACTIVE":
      default:
        return "bg-purple-500/20 border-purple-500 text-purple-700 dark:text-purple-300 font-semibold ring-2 ring-purple-500/40 animate-pulse";
    }
  };

  return (
    <div className="select-none">
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all my-1 cursor-pointer ${getStatusStyle()}`}
        style={{ marginLeft: `${level * 20}px` }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren && (
          <span className="text-muted-foreground">
            {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </span>
        )}
        <span>
          {node.row === -1 ? (
            "Root: solve(0)"
          ) : (
            `R${node.row} → Col ${node.col}`
          )}
        </span>
        {node.status === "SOLUTION" && <Crown className="w-3.5 h-3.5 text-emerald-500 ml-0.5" />}
        {node.status === "PRUNED" && <X className="w-3.5 h-3.5 text-rose-500 ml-0.5" />}
        {node.status === "SAFE" && <Check className="w-3.5 h-3.5 text-indigo-500 ml-0.5" />}
      </div>

      {hasChildren && expanded && (
        <div className="border-l-2 border-border/40 ml-3 pl-1 space-y-0.5">
          {node.children.map((child) => (
            <TreeNodeView key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const RecursionTree: React.FC<RecursionTreeProps> = ({ rootNode }) => {
  return (
    <div className="p-5 rounded-2xl glass-panel border border-border/60 shadow-lg flex flex-col h-full max-h-[420px]">
      <div className="flex items-center justify-between pb-3 border-b border-border/40 mb-3">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-indigo-500" />
          <span>Live Recursion Tree</span>
        </h3>
        <span className="text-[11px] font-mono text-muted-foreground">
          Branch Pruning Explorer
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 overflow-x-auto">
        {!rootNode ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-12 text-muted-foreground">
            <GitBranch className="w-8 h-8 opacity-30 mb-2" />
            <p className="text-xs font-medium">Tree structure will appear as step simulation starts.</p>
          </div>
        ) : (
          <div className="py-2">
            <TreeNodeView node={rootNode} level={0} />
          </div>
        )}
      </div>
    </div>
  );
};
