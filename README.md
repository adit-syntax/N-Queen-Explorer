# 👑 N-Queen Explorer — Next-Generation Backtracking & CSP Visualizer

[![Next.js 15](https://img.shields.io/badge/Next.js%2015-App%20Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS v3.4](https://img.shields.io/badge/TailwindCSS-v3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Monaco Editor](https://img.shields.io/badge/Monaco%20Editor-Powered-68217A?style=for-the-badge&logo=visual-studio-code)](https://microsoft.github.io/monaco-editor/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-Animations-pink?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

> **The ultimate educational platform combining the algorithmic depth of LeetCode, the interactive visual clarity of VisuAlgo, and the intuitive pedagogy of Brilliant.org.**

---

## ✨ Overview

**N-Queen Explorer** is an enterprise-grade, highly interactive web platform engineered for software engineers, computer science students, and technical interview candidates. It dissects the classical **$N$-Queen Backtracking Problem** across $4 \times 4$ through $14 \times 14$ chessboards in real time, demonstrating precisely how constraint pruning and bitwise operations reduce exponential search spaces ($O(N^N)$ and $O(N!)$) down to sub-second execution speeds.

---

## 🚀 Key Features

### 🎮 1. Interactive Visualizer Studio (`/visualizer`)
- **Real-Time Step-by-Step Telemetry:** Time-travel backward and forward through exact simulation frames (`SimulationStep`), tracking candidate placements, conflict checks, and recursive backtracks.
- **Three Core Algorithm Engines:**
  1. **Standard Backtracking ($O(N!)$):** Classic row-by-row traversal with column and diagonal checking (`row - col` & `row + col`).
  2. **Bitmask Optimized (`cols | diag1 | diag2`):** Competitive programming $O(1)$ bitwise execution (`(1 << N) - 1`, `BLSI isolate bit`, `<< 1` and `>> 1` shift rules).
  3. **Brute Force Permutations ($O(N^N)$):** Educational baseline demonstrating exponential state explosion without early diagonal pruning.
- **Dual-Board Algorithm Racing Mode:** Watch **Brute Force** and **Bitmask Optimized** run side-by-side on the exact same $N \times N$ grid, comparing node visitation counts in real time.
- **Live Recursion Tree & Call Stack Inspector:** Inspect active `solve(row)` frames, local bitmask widths (`0b1011`), and zoomable/collapsible pruned branches.
- **Instant Solution Gallery:** Retrieve exact pre-verified solutions (`solveAllInstant`) up to $N = 14$ with quick-jump thumbnail cards and celebration confetti.

### 📚 2. Algorithmic Theory & Handbook (`/docs`)
- **13 Interactive Chapters:** Covering history (Gauss & Dijkstra 1850–1972), formal mathematical derivation, $O(N!)$ time bounds, $O(N)$ space bounds, and coordinate invariant proofs.
- **FAANG Interview Blueprint:** Senior engineer tips, top 4 common coding gotchas, and real-world CSP applications (VLSI PCB routing, LLVM compiler register allocation, AI scheduling).

### 💻 3. Multi-Language Code Templates Studio (`/templates`)
- **Monaco Interactive Buffer (`@monaco-editor/react`):** Fully editable embedded VS Code editor across C, C++, Java, Python 3, and TypeScript/ESNext with custom state preservation per paradigm (`Brute Force`, `Standard Backtracking`, `Hash Sets`, `Bitmask`).
- **Interactive Execution Sandbox & Live Terminal Console:** Input any custom board dimension ($N=1\text{ to }14$) and click **▶ Run Code (`N=inputN`)**. Simulates compiler/interpreter diagnostics (`g++ -O3`, `python3 -O`, `javac && java -XX:+UseG1GC`, `ts-node`, `gcc`) and executes a real-time $O(1)$ browser sandbox showing exact solution previews, solution counts (`Found 92 solutions for N=8!`), CPU execution times (`~0.14 ms`), memory peak estimations, and process exit codes (`0 SUCCESS`).
- **One-Click Export & Buffer Reset:** Reset edited buffers (`RotateCcw`), copy code to clipboard with instant toast notifications, or download `.c`, `.cpp`, `.java`, `.py`, and `.ts` files directly to disk.

### 🏆 4. Practice Problems Arena (`/practice`)
- **Curated Dataset:** 22 top-tier constraint satisfaction questions from **LeetCode**, **GeeksforGeeks**, **Coding Ninjas**, and **HackerRank**.
- **Search & Filtering:** Real-time search across problem titles, company tags (`Google`, `Meta`, `Amazon`, `Microsoft`), difficulty levels (`Easy`, `Medium`, `Hard`), and platforms.

### 🧠 5. Interactive Mastery Quiz Engine (`/quiz`)
- **10-MCQ Challenge:** Deep technical questions testing command of bit shifts, time complexity formulas, and backtracking cleanup invariants.
- **Instant Explanation Cards:** Detailed callout explanations shown immediately after answering each question.
- **Grandmaster Grading:** Final score calculation with trophy medals (`Algorithmic Grandmaster`, `Senior Systems Architect`).

---

## 🏗️ Architecture & Directory Structure

```text
n-queen-explorer/
├── src/
│   ├── app/
│   │   ├── globals.css              # Design system, glassmorphism, glowing custom utilities
│   │   ├── layout.tsx               # Root layout with ThemeProvider, ToastProvider, Navbar & Footer
│   │   ├── page.tsx                 # Landing Page with HeroChessboard & stats cards
│   │   ├── visualizer/page.tsx      # Interactive Visualizer Studio page
│   │   ├── docs/page.tsx            # Comprehensive Documentation Handbook page
│   │   ├── templates/page.tsx       # Monaco Editor Code Templates Studio page
│   │   ├── practice/page.tsx        # Searchable Practice Problems Arena page
│   │   └── quiz/page.tsx            # Interactive Mastery Quiz Engine page
│   ├── components/
│   │   ├── layout/                  # Navbar.tsx & Footer.tsx
│   │   ├── ui/                      # ThemeProvider.tsx & ToastProvider.tsx
│   │   └── visualizer/              # Chessboard.tsx, PlaybackControls.tsx, StatsHUD.tsx,
│   │                                # CallStackPanel.tsx, RecursionTree.tsx, CompareModePanel.tsx
│   └── lib/
│       ├── algorithms/
│       │   ├── types.ts             # Core simulation and stack frame TypeScript interfaces
│       │   ├── nQueenSolver.ts      # Fast bitmask solver & instant board generator
│       │   └── nQueenGenerator.ts   # Deterministic step-by-step state transition generator
│       ├── docs/chapters.ts         # 13 structured chapters data for documentation hub
│       └── practice/problems.ts     # 22 curated practice problems across major platforms
├── public/                          # Static assets and icons
├── package.json                     # Dependencies & build scripts
├── tailwind.config.ts               # Custom color palette, animations, and Tailwind plugins
└── tsconfig.json                    # Strict TypeScript configuration
```

---

## ⚡ Quick Start & Local Development

### Prerequisites
- **Node.js:** v18.17.0 or higher
- **npm / pnpm / yarn:** Standard package manager

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to experience **N-Queen Explorer**.

### 3. Build Production Bundle
To verify static typing and generate an optimized production build:
```bash
npm run lint
npm run build
```

---

## 💎 Design Philosophy & Theme System
- **Rich Dark/Light Mode:** Seamless CSS variable switching with deep obsidian dark backgrounds (`#0a0a0f`) and crisp slate light layouts (`#f8fafc`).
- **Glassmorphism (`glass-card`, `glass-panel`):** Backdrop blur filters with delicate translucent borders (`border-white/10`).
- **Micro-Animations:** Powered by **Framer Motion** spring physics for queen placement pops, glowing threat vectors (`ring-rose-500`), and smooth tab transitions.

---

## 👨‍💻 Author
Designed and developed by **[Aditya Singh (`@adit-syntax`)](https://github.com/adit-syntax)**.
