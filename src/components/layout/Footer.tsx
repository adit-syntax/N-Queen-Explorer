"use client";

import React from "react";
import Link from "next/link";
import { Crown, Heart, Cpu } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border/40 bg-card/40 backdrop-blur-md mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-foreground tracking-tight">
                N-Queen Explorer
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              An interactive developer tool designed for mastering classic backtracking, recursive branch pruning, and bitmask optimizations. Feel the elegance of algorithm engineering.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground font-mono">
              <Cpu className="w-3.5 h-3.5 text-indigo-500" />
              <span>Built with Next.js 15, TypeScript & Tailwind CSS</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/80 font-mono">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/visualizer" className="hover:text-primary transition-colors">
                  Interactive Studio (4 - 14)
                </Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-primary transition-colors">
                  Algorithm Theory & Complexity
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-primary transition-colors">
                  Multi-Language Templates
                </Link>
              </li>
              <li>
                <Link href="/practice" className="hover:text-primary transition-colors">
                  20+ Curated Problems
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="hover:text-primary transition-colors">
                  10-MCQ Mastery Quiz
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology Stack */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/80 font-mono">
              Algorithmic Core
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>Standard Backtracking (O(N!))</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Bitmask Optimized (`row | col | diag`)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>Brute Force Permutations</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span>Deterministic Step Frame Engine</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} N-Queen Explorer. All rights reserved.</p>
          <div className="flex flex-col items-center sm:items-end gap-1">
            <div className="flex items-center gap-1.5 text-center sm:text-right">
              <span>Crafted with precision &</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
              <span>for developers & algorithmic enthusiasts.</span>
            </div>
            <div className="text-xs font-semibold text-foreground/90 tracking-wide">
              by <span className="text-primary font-bold">Aditya Singh</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
