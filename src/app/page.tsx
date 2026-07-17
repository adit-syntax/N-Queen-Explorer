"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Play,
  BookOpen,
  Code2,
  Award,
  HelpCircle,
  Layers,
  Zap,
  ArrowRight,
} from "lucide-react";
import { HeroChessboard } from "@/components/home/HeroChessboard";

export default function LandingPage() {
  const features = [
    {
      title: "Time-Travel State Tree Studio",
      description:
        "Pause, rewind, or fast-forward through exact recursive call stacks. Visualize every branch exploration, constraint check, and pruned dead-end in real-time.",
      icon: Layers,
      gradient: "from-indigo-500 to-blue-500",
      href: "/visualizer",
      cta: "Explore Visualizer",
    },
    {
      title: "Bitmask vs Brute-Force Engine",
      description:
        "Experience the dramatic difference between standard backtracking (O(N!)) and ultra-fast bitwise manipulation (`cols | diag1 | diag2`) with live execution step counters.",
      icon: Zap,
      gradient: "from-purple-500 to-pink-500",
      href: "/visualizer",
      cta: "Compare Algorithms",
    },
    {
      title: "Production Code in 5 Languages",
      description:
        "Clean, well-commented implementations in C, C++, Java, Python, and JavaScript/TypeScript with Monaco Editor syntax highlighting, instant copy, and file download.",
      icon: Code2,
      gradient: "from-amber-500 to-orange-500",
      href: "/templates",
      cta: "View Templates",
    },
    {
      title: "20+ Curated Interview Problems",
      description:
        "Searchable database of top backtracking questions from LeetCode, GeeksforGeeks, Coding Ninjas, and HackerRank with difficulty badges and direct company tags.",
      icon: Award,
      gradient: "from-emerald-500 to-teal-500",
      href: "/practice",
      cta: "Practice Now",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden pb-20">
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/15 dark:bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-slow" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-purple-500/15 dark:bg-purple-500/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-slow" style={{ animationDelay: "2s" }} />
      <div className="absolute bottom-10 left-1/3 w-[550px] h-[550px] bg-pink-500/15 dark:bg-pink-500/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-slow" style={{ animationDelay: "4s" }} />

      {/* Hero Section */}
      <section className="pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-primary/30 text-xs font-semibold text-primary shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "8s" }} />
              <span>Next.js 15 App Router + Bitmask Engine</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-foreground"
            >
              Master the{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                N-Queen
              </span>{" "}
              Backtracking Algorithm.
            </motion.h1>

            {/* Subhead */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal"
            >
              An educational studio combining the precision of{" "}
              <strong className="text-foreground font-semibold">LeetCode</strong>, the interactive visual clarity of{" "}
              <strong className="text-foreground font-semibold">Visualgo</strong>, and the deep algorithmic intuition of{" "}
              <strong className="text-foreground font-semibold">Brilliant.org</strong>.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4"
            >
              <Link
                href="/visualizer"
                className="flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-semibold text-base shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-indigo-500/40"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Start Visualization</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>

              <Link
                href="/docs"
                className="flex items-center gap-2 px-6 py-4 rounded-2xl glass-panel hover:bg-secondary/80 text-foreground font-semibold text-base border border-border/60 transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
              >
                <BookOpen className="w-5 h-5 text-indigo-500" />
                <span>Learn Theory</span>
              </Link>
            </motion.div>

            {/* Quick Action Pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-3 text-xs text-muted-foreground font-medium"
            >
              <Link href="/practice" className="hover:text-foreground flex items-center gap-1 bg-secondary/50 px-3 py-1.5 rounded-lg border border-border/40 transition-colors">
                <Award className="w-3.5 h-3.5 text-emerald-500" />
                <span>Practice Problems</span>
              </Link>
              <Link href="/templates" className="hover:text-foreground flex items-center gap-1 bg-secondary/50 px-3 py-1.5 rounded-lg border border-border/40 transition-colors">
                <Code2 className="w-3.5 h-3.5 text-amber-500" />
                <span>Code Templates</span>
              </Link>
              <Link href="/quiz" className="hover:text-foreground flex items-center gap-1 bg-secondary/50 px-3 py-1.5 rounded-lg border border-border/40 transition-colors">
                <HelpCircle className="w-3.5 h-3.5 text-purple-500" />
                <span>Test Knowledge</span>
              </Link>
            </motion.div>
          </div>

          {/* Right Column Chessboard Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center"
          >
            <HeroChessboard />
          </motion.div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-24">
        <div className="p-8 rounded-3xl glass-card border border-border/60 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-border/40 text-center">
          <div className="pt-4 md:pt-0 first:pt-0">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              4 → 14
            </div>
            <div className="text-sm font-semibold text-foreground mt-1">Board Size Range</div>
            <div className="text-xs text-muted-foreground mt-0.5">Custom N selection</div>
          </div>

          <div className="pt-4 md:pt-0 md:pl-8">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-500">
              365,596
            </div>
            <div className="text-sm font-semibold text-foreground mt-1">Exact Solutions (N=14)</div>
            <div className="text-xs text-muted-foreground mt-0.5">Verified deterministic solver</div>
          </div>

          <div className="pt-4 md:pt-0 md:pl-8">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-purple-500 flex items-center justify-center gap-1">
              <span>O(1)</span>
            </div>
            <div className="text-sm font-semibold text-foreground mt-1">Bitmask Safety Check</div>
            <div className="text-xs text-muted-foreground mt-0.5">via `row | col | diag` bits</div>
          </div>

          <div className="pt-4 md:pt-0 md:pl-8">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-500">
              ~99.8%
            </div>
            <div className="text-sm font-semibold text-foreground mt-1">Branch Pruning Ratio</div>
            <div className="text-xs text-muted-foreground mt-0.5">Dead-ends pruned early</div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest font-mono text-primary">
            Why N-Queen Explorer?
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Everything you need to truly conquer backtracking and recursive algorithm design.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-8 rounded-3xl glass-panel border border-border/60 hover:border-primary/40 transition-all duration-300 group flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Subtle top border glow */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${feat.gradient} flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed mb-6">
                    {feat.description}
                  </p>
                </div>

                <Link
                  href={feat.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:text-indigo-500 transition-colors pt-2 border-t border-border/40 w-fit"
                >
                  <span>{feat.cta}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
