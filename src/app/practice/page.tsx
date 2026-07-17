"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  ExternalLink,
  Award,
  Building2,
  Tag,
  CheckCircle2,
  Sparkles,
  Layers,
} from "lucide-react";
import { PRACTICE_PROBLEMS, PracticeProblem } from "@/lib/practice/problems";

export default function PracticeArenaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("All");
  const [platformFilter, setPlatformFilter] = useState<string>("All");

  const filteredProblems = useMemo(() => {
    return PRACTICE_PROBLEMS.filter((prob) => {
      const matchesSearch =
        prob.problem.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prob.companies.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
        prob.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDiff =
        difficultyFilter === "All" || prob.difficulty === difficultyFilter;

      const matchesPlat =
        platformFilter === "All" || prob.platform === platformFilter;

      return matchesSearch && matchesDiff && matchesPlat;
    });
  }, [searchQuery, difficultyFilter, platformFilter]);

  const getDifficultyBadge = (diff: PracticeProblem["difficulty"]) => {
    switch (diff) {
      case "Easy":
        return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
      case "Medium":
        return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30";
      case "Hard":
        return "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30";
    }
  };

  const getPlatformStyle = (plat: PracticeProblem["platform"]) => {
    switch (plat) {
      case "LeetCode":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
      case "GeeksforGeeks":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
      case "Coding Ninjas":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30";
      case "HackerRank":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Award className="w-8 h-8 text-emerald-500" />
            <span>Curated Interview Practice Arena</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Master 20+ top-tier N-Queen, Backtracking, and Bitmask questions asked by FAANG & top engineering teams.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
            {filteredProblems.length} Problems Available
          </span>
        </div>
      </div>

      {/* Filter Toolbar Card */}
      <div className="p-5 rounded-2xl glass-panel border border-border/60 shadow-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search problem, company (Google, Meta...), or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/80 border border-border/60 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground transition-all"
            />
          </div>

          {/* Difficulty Pills */}
          <div className="md:col-span-3 flex items-center gap-1.5 overflow-x-auto">
            <span className="text-xs font-semibold text-muted-foreground pr-1 hidden sm:inline">Diff:</span>
            {["All", "Easy", "Medium", "Hard"].map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap border ${
                  difficultyFilter === diff
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-secondary/40 hover:bg-secondary text-muted-foreground border-border/40"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Platform Pills */}
          <div className="md:col-span-4 flex items-center gap-1.5 overflow-x-auto justify-start md:justify-end">
            <span className="text-xs font-semibold text-muted-foreground pr-1 hidden sm:inline">Platform:</span>
            {["All", "LeetCode", "GeeksforGeeks", "Coding Ninjas", "HackerRank"].map((plat) => (
              <button
                key={plat}
                onClick={() => setPlatformFilter(plat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap border ${
                  platformFilter === plat
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-secondary/40 hover:bg-secondary text-muted-foreground border-border/40"
                }`}
              >
                {plat === "GeeksforGeeks" ? "GFG" : plat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-3xl glass-card border border-border/60 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-secondary/40 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                <th className="py-4 px-6 font-semibold">#</th>
                <th className="py-4 px-6 font-semibold">Platform</th>
                <th className="py-4 px-6 font-semibold min-w-[220px]">Problem Title & Tags</th>
                <th className="py-4 px-6 font-semibold">Difficulty</th>
                <th className="py-4 px-6 font-semibold min-w-[200px]">Top Companies</th>
                <th className="py-4 px-6 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30 text-xs sm:text-sm">
              {filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <p className="font-medium text-sm">No practice problems found.</p>
                    <p className="text-xs opacity-75 mt-0.5">Try clearing your search keyword or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredProblems.map((prob, idx) => (
                  <motion.tr
                    key={prob.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: Math.min(idx * 0.03, 0.4) }}
                    className="hover:bg-secondary/50 transition-colors group"
                  >
                    {/* Index */}
                    <td className="py-4 px-6 font-mono text-muted-foreground font-semibold">
                      {prob.id}
                    </td>

                    {/* Platform Badge */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-xs font-bold font-mono shadow-2xs ${getPlatformStyle(
                          prob.platform
                        )}`}
                      >
                        {prob.platform === "GeeksforGeeks" ? "GFG" : prob.platform}
                      </span>
                    </td>

                    {/* Problem Title + Tags */}
                    <td className="py-4 px-6 space-y-1.5">
                      <div className="font-bold text-foreground group-hover:text-primary transition-colors text-sm">
                        {prob.problem}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {prob.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-secondary text-muted-foreground border border-border/40"
                          >
                            <Tag className="w-2.5 h-2.5" />
                            <span>{tag}</span>
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Difficulty Badge */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-xs font-bold font-mono shadow-2xs ${getDifficultyBadge(
                          prob.difficulty
                        )}`}
                      >
                        {prob.difficulty}
                      </span>
                    </td>

                    {/* Companies */}
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {prob.companies.map((comp) => (
                          <span
                            key={comp}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-primary/5 dark:bg-primary/10 text-foreground/80 border border-primary/15"
                          >
                            <Building2 className="w-2.5 h-2.5 text-primary" />
                            <span>{comp}</span>
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Action Link */}
                    <td className="py-4 px-6 text-right">
                      <a
                        href={prob.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-md transition-all group-hover:scale-105"
                      >
                        <span>Solve</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
