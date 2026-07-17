"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  RotateCcw,
  ChevronRight,
  Sparkles,
  Trophy,
  Brain,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useToast } from "@/components/ui/ToastProvider";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: "THEORY" | "COMPLEXITY" | "OPTIMIZATION" | "INTERVIEW";
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the exact mathematical time complexity upper bound of the standard N-Queen backtracking algorithm where we place 1 queen per row?",
    options: [
      "O(N^N) - Because every row has N independent choices without restriction.",
      "O(N!) - Because Row 0 has N choices, Row 1 has at most N-1 choices, Row 2 has at most N-2 choices, and so on.",
      "O(2^N) - Because each cell is either empty or occupied by a queen.",
      "O(N^2) - Because the chessboard has N x N squares to iterate through."
    ],
    correctIndex: 1,
    explanation: "By placing exactly one queen per row and ensuring no two queens share the same column, the number of branches at depth k is bounded by (N - k), yielding N * (N - 1) * (N - 2)... = O(N!).",
    category: "COMPLEXITY",
  },
  {
    id: 2,
    question: "Why does the N-Queen problem have exactly 0 valid solutions for N = 2 and N = 3?",
    options: [
      "Because Carl Friedrich Gauss proved that odd N boards cannot be solved.",
      "Because a 2x2 or 3x3 grid does not have enough total squares to fit N queens.",
      "Because placing a queen anywhere on a 2x2 or 3x3 board immediately attacks every remaining safe square needed to complete N queens via row, column, or diagonal rays.",
      "Because integer bitwise shifts overflow on boards smaller than 4x4."
    ],
    correctIndex: 2,
    explanation: "For N=2 and N=3, the diagonal attack rays cover all remaining open squares in subsequent rows, making it geometrically impossible to place N non-attacking queens. N=4 is the smallest solvable size greater than 1 (2 solutions).",
    category: "THEORY",
  },
  {
    id: 3,
    question: "In the Bitmask optimization (`solveBitmask(row, cols, diag1, diag2)`), what happens to the diagonal bitmasks when stepping down from `row` to `row + 1`?",
    options: [
      "`diag1` shifts left (`(diag1 | bit) << 1`) and `diag2` shifts right (`(diag2 | bit) >> 1`).",
      "Both diagonals shift left (`<< 1`) to align with the new row coordinates.",
      "Diagonals are kept constant without bit shifting because diagonals never move.",
      "`diag1` shifts right (`>> 1`) and `diag2` shifts left (`<< 1`)."
    ],
    correctIndex: 0,
    explanation: "When moving down one row on the chessboard, main diagonal threats slope down-right (shifting left in binary column bits via `<< 1`), while anti-diagonals slope down-left (shifting right via `>> 1`).",
    category: "OPTIMIZATION",
  },
  {
    id: 4,
    question: "In standard Set-based hashing, what invariant mathematical formula remains constant for all cells on the SAME Main Diagonal (sloping down-right `\\`)?",
    options: [
      "`row + col` is constant across all squares on any main diagonal.",
      "`row * col` is constant across all squares on any main diagonal.",
      "`row - col` (or `col - row`) is constant across all squares on any main diagonal.",
      "`row / col` is constant across all squares on any main diagonal."
    ],
    correctIndex: 2,
    explanation: "For any square (r, c) on a main diagonal sloping down-right, if you move down and right by 1 step to (r+1, c+1), the difference remains identical: (r+1) - (c+1) = r - c. We use `row - col` as the hash set key!",
    category: "OPTIMIZATION",
  },
  {
    id: 5,
    question: "What is the auxiliary space complexity of our 1D backtracking solver (`board[0...N-1]`) excluding the output storage?",
    options: [
      "O(N^2) - To store the 2D chessboard matrix.",
      "O(N) - To store the recursion call stack up to depth N and the 1D state/set arrays.",
      "O(N!) - Because the recursion tree has O(N!) total branches.",
      "O(1) - Because backtracking does not allocate heap memory."
    ],
    correctIndex: 1,
    explanation: "The depth of the recursion stack is at most N. Our `board` state and lookup sets (`cols`, `diag1`, `diag2`) each store up to O(N) elements, resulting in strictly O(N) auxiliary memory.",
    category: "COMPLEXITY",
  },
  {
    id: 6,
    question: "When writing the backtracking recursion in JavaScript or Python, what critical bug occurs if you push `solutions.push(board)` when `row === N` without cloning?",
    options: [
      "The program will throw a TypeMismatch error during runtime.",
      "Every solution stored inside `solutions` will point to the exact same mutable array object in memory, ending up as `[-1, -1, ... -1]` when the recursion backtracks and cleans up.",
      "The memory usage will exceed 4GB and crash Node.js.",
      "Nothing bad happens; passing arrays by reference is standard best practice."
    ],
    correctIndex: 1,
    explanation: "In JavaScript/Python/C++, arrays are mutable references. If you push `board` directly without cloning (`[...board]`), all elements in `solutions` will reference the exact same memory address, which gets wiped out during backtracking cleanup!",
    category: "INTERVIEW",
  },
  {
    id: 7,
    question: "Why is the bitwise expression `available & -available` widely used inside the N-Queen bitmask inner loop (`while (available > 0)`)?",
    options: [
      "It flips all bits inside the integer in 1 CPU instruction.",
      "It isolates the rightmost set bit (`lowest 1-bit`) in a single CPU instruction, allowing the algorithm to pick the next open column immediately.",
      "It checks whether the integer `available` is a prime number.",
      "It prevents integer underflow when subtracting large bitmasks."
    ],
    correctIndex: 1,
    explanation: "In two's complement binary representation, `-x` equals `~x + 1`. The bitwise AND between `x` and `-x` isolates the lowest significant set bit cleanly in one clock cycle (`BLSI` instruction).",
    category: "OPTIMIZATION",
  },
  {
    id: 8,
    question: "What is the total number of distinct solutions for standard N = 8 queens (`solveAll(8).length`)?",
    options: [
      "72 solutions",
      "92 solutions",
      "12 solutions",
      "365,596 solutions"
    ],
    correctIndex: 1,
    explanation: "Carl Friedrich Gauss and modern computation confirm there are exactly 92 distinct solutions for N=8 (or 12 fundamental solutions when discounting symmetry, rotations, and reflections).",
    category: "THEORY",
  },
  {
    id: 9,
    question: "If an interviewer asks: 'Can we solve N-Queen in O(N) linear time if we only need ONE single valid board configuration (not all solutions)?', what is the correct response?",
    options: [
      "No, backtracking requires at least O(2^N) time to find even one solution.",
      "Yes! Explicit construction algorithms using arithmetic formulas (such as Boas 1969) can place all N non-attacking queens in O(N) time without any recursive search.",
      "Yes, but only if we use Quantum Computing.",
      "No, because the lower bound of checking collisions is O(N^2)."
    ],
    correctIndex: 1,
    explanation: "If you only need one single valid placement for N >= 4, closed-form mathematical formulas can construct the coordinates of all N queens explicitly in O(N) linear time without searching!",
    category: "INTERVIEW",
  },
  {
    id: 10,
    question: "What happens during the 'Backtrack / Undo' step of the algorithm when a branch reaches a dead end or finishes exploring?",
    options: [
      "The operating system restarts the web worker.",
      "We clear the queen from the current square (`board[row] = -1`) and remove the column and diagonal hashes from our sets/masks before returning to the previous stack frame (`row - 1`).",
      "We terminate all recursive calls immediately and exit the loop.",
      "We increment the board size by 1 to make more room."
    ],
    correctIndex: 1,
    explanation: "Backtracking requires restoring the state variables to their exact configuration before the choice was made. By resetting `board[row] = -1` and clearing `cols/diag`, the parent stack frame can try the next candidate column cleanly.",
    category: "THEORY",
  },
];

export default function MasteryQuizPage() {
  const { showToast } = useToast();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
      showToast("Correct Answer!", "You mastered this algorithmic concept.", "success");
    } else {
      showToast("Incorrect Answer", "Review the detailed explanation below to learn the concept.", "error");
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizCompleted(true);
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
          colors: ["#6366f1", "#10b981", "#ec4899", "#f59e0b"],
        });
      } catch (e) {
        // Safe fallback
      }
    }
  };

  const handleResetQuiz = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizCompleted(false);
  };

  const getTrophyGrade = () => {
    const pct = (score / QUIZ_QUESTIONS.length) * 100;
    if (pct === 100) return { title: "Algorithmic Grandmaster", color: "text-amber-500", desc: "Flawless score! You are fully prepared to ace senior FAANG coding interviews." };
    if (pct >= 80) return { title: "Senior Systems Architect", color: "text-indigo-500", desc: "Excellent understanding of complexity, bitmasking, and recursion invariants!" };
    if (pct >= 50) return { title: "Backtracking Practitioner", color: "text-emerald-500", desc: "Good foundation! Review our theory chapters to master bit shifts and invariants." };
    return { title: "Algorithmic Apprentice", color: "text-rose-500", desc: "Keep practicing! Use our interactive visualizer to see how the recursion tree prunes branches." };
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Brain className="w-8 h-8 text-primary" />
            <span>Interactive Mastery Quiz Engine</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Test your command of N-Queen complexity, bitmask optimization, and FAANG interview gotchas.
          </p>
        </div>
        {!quizCompleted && (
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-xs font-mono font-bold text-primary">
              Score: {score} / {QUIZ_QUESTIONS.length}
            </span>
          </div>
        )}
      </div>

      {quizCompleted ? (
        /* Completion Results Screen */
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-8 sm:p-12 rounded-3xl glass-card border border-border/60 shadow-2xl text-center space-y-6"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-indigo-600 mx-auto flex items-center justify-center shadow-lg glow-primary">
            <Trophy className="w-10 h-10 text-white" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-foreground">Quiz Completed!</h2>
            <p className="text-lg font-bold text-muted-foreground">
              Final Score: <span className="text-primary font-mono font-extrabold">{score}</span> out of{" "}
              <span className="font-mono">{QUIZ_QUESTIONS.length}</span> ({Math.round((score / QUIZ_QUESTIONS.length) * 100)}%)
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-secondary/60 border border-border/60 max-w-lg mx-auto space-y-2">
            <div className={`text-xl font-extrabold ${getTrophyGrade().color}`}>
              {getTrophyGrade().title}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {getTrophyGrade().desc}
            </p>
          </div>

          <div className="pt-4 flex justify-center">
            <button
              onClick={handleResetQuiz}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl transition-all hover:scale-105"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Mastery Quiz</span>
            </button>
          </div>
        </motion.div>
      ) : (
        /* Active Question Card */
        <motion.div
          key={currentQ.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 sm:p-10 rounded-3xl glass-card border border-border/60 shadow-2xl space-y-8"
        >
          {/* Progress Bar & Category Badge */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-muted-foreground">
              <span className="px-2.5 py-1 rounded-lg bg-secondary text-primary border border-border/40">
                {currentQ.category}
              </span>
              <span>
                Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-secondary/80 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <h3 className="text-lg sm:text-xl font-bold text-foreground leading-relaxed">
            {currentQ.id}. {currentQ.question}
          </h3>

          {/* Options Grid */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let style = "bg-secondary/40 hover:bg-secondary/80 border-border/60 text-foreground";
              if (isAnswered) {
                if (isCorrect) {
                  style = "bg-emerald-500/20 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/30";
                } else if (isSelected && !isCorrect) {
                  style = "bg-rose-500/20 border-rose-500 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/30";
                } else {
                  style = "bg-secondary/20 border-border/30 opacity-50";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-start gap-3.5 ${style}`}
                >
                  <div
                    className={`w-6 h-6 rounded-xl flex items-center justify-center flex-shrink-0 font-mono text-xs font-bold border mt-0.5 ${
                      isAnswered && isCorrect
                        ? "bg-emerald-500 text-white border-emerald-400"
                        : isAnswered && isSelected
                        ? "bg-rose-500 text-white border-rose-400"
                        : "bg-secondary border-border/60 text-muted-foreground"
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <div className="flex-1 leading-relaxed">{opt}</div>
                  {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Callout (appears once answered) */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={`p-4 rounded-2xl border space-y-2 ${
                  selectedOption === currentQ.correctIndex
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
                    : "bg-indigo-500/10 border-indigo-500/30 text-indigo-900 dark:text-indigo-200"
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono">
                  <Sparkles className="w-4 h-4" />
                  <span>Detailed Explanation</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed font-medium">
                  {currentQ.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next Question Button */}
          {isAnswered && (
            <div className="pt-4 flex justify-end">
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl transition-all hover:translate-x-1"
              >
                <span>{currentIdx < QUIZ_QUESTIONS.length - 1 ? "Next Question" : "View Final Results"}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
