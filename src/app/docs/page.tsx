"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Search,
  ChevronRight,
  ChevronLeft,
  Bookmark,
  Sparkles,
  Terminal,
  Share2,
  Check,
} from "lucide-react";
import { DOC_CHAPTERS, DocChapter } from "@/lib/docs/chapters";
import { useToast } from "@/components/ui/ToastProvider";

export default function DocumentationHubPage() {
  const { showToast } = useToast();
  const [selectedId, setSelectedId] = useState<string>(DOC_CHAPTERS[0].id);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedChapter, setCopiedChapter] = useState<boolean>(false);

  const currentChapter = useMemo(
    () => DOC_CHAPTERS.find((c) => c.id === selectedId) || DOC_CHAPTERS[0],
    [selectedId]
  );

  const currentIndex = useMemo(
    () => DOC_CHAPTERS.findIndex((c) => c.id === selectedId),
    [selectedId]
  );

  const filteredChapters = useMemo(() => {
    if (!searchQuery.trim()) return DOC_CHAPTERS;
    const q = searchQuery.toLowerCase();
    return DOC_CHAPTERS.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.content.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const categories: DocChapter["category"][] = [
    "THEORY",
    "COMPLEXITY",
    "OPTIMIZATION",
    "PRACTICE & INTERVIEW",
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedChapter(true);
    showToast("Link Copied", "Direct link to this chapter copied to clipboard", "success");
    setTimeout(() => setCopiedChapter(false), 2500);
  };

  // Helper to parse inline markdown syntax (**bold**, `code`, *italic*) into React elements
  const parseInlineMarkdown = (text: string): React.ReactNode[] => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
        return (
          <strong key={idx} className="font-bold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      } else if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
        return (
          <code
            key={idx}
            className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary font-mono text-xs sm:text-sm font-semibold border border-primary/20 mx-0.5"
          >
            {part.slice(1, -1)}
          </code>
        );
      } else if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
        return (
          <em key={idx} className="italic text-foreground/90 font-medium">
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    });
  };

  // Simple custom renderer to turn markdown headings, code blocks, and callout quotes into rich styled elements
  const renderFormattedContent = (content: string) => {
    const lines = content.trim().split("\n");
    const elements: React.ReactNode[] = [];
    let codeBlockBuffer: string[] = [];
    let inCodeBlock = false;
    let codeLang = "";
    let calloutBuffer: string[] = [];
    let inCallout = false;
    let calloutType = "NOTE";

    lines.forEach((line, index) => {
      // Code block check
      if (line.trim().startsWith("```")) {
        if (inCodeBlock) {
          elements.push(
            <div
              key={`code-${index}`}
              className="my-5 rounded-2xl bg-slate-900 dark:bg-slate-950 border border-border/60 overflow-hidden shadow-lg font-mono text-xs sm:text-sm"
            >
              <div className="bg-slate-800/80 px-4 py-2 text-xs text-slate-400 border-b border-slate-700/50 flex items-center justify-between">
                <span>{codeLang || "typescript"}</span>
                <span className="text-[10px] uppercase font-bold text-indigo-400">Production Template</span>
              </div>
              <pre className="p-4 overflow-x-auto text-slate-200 leading-relaxed">
                <code>{codeBlockBuffer.join("\n")}</code>
              </pre>
            </div>
          );
          codeBlockBuffer = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
          codeLang = line.trim().replace("```", "");
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockBuffer.push(line);
        return;
      }

      // Callout check (> [!NOTE], > [!IMPORTANT], > [!TIP])
      if (line.trim().startsWith("> [!")) {
        if (line.includes("IMPORTANT")) calloutType = "IMPORTANT";
        else if (line.includes("TIP")) calloutType = "TIP";
        else calloutType = "NOTE";
        inCallout = true;
        return;
      }

      if (inCallout) {
        if (line.trim().startsWith(">")) {
          calloutBuffer.push(line.replace(/^>\s*/, ""));
          return;
        } else {
          elements.push(
            <div
              key={`callout-${index}`}
              className={`my-5 p-4 rounded-2xl border flex items-start gap-3 shadow-sm ${
                calloutType === "IMPORTANT"
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-200"
                  : calloutType === "TIP"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200"
                  : "bg-indigo-500/10 border-indigo-500/30 text-indigo-800 dark:text-indigo-200"
              }`}
            >
              <Sparkles
                className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  calloutType === "IMPORTANT"
                    ? "text-rose-500"
                    : calloutType === "TIP"
                    ? "text-emerald-500"
                    : "text-indigo-500"
                }`}
              />
              <div className="text-sm font-medium leading-relaxed space-y-1">
                {calloutBuffer.map((cl, ci) => (
                  <p key={ci}>{parseInlineMarkdown(cl)}</p>
                ))}
              </div>
            </div>
          );
          calloutBuffer = [];
          inCallout = false;
        }
      }

      // Normal headers & text
      if (line.startsWith("# ")) {
        elements.push(
          <h1
            key={`h1-${index}`}
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-8 mb-4 first:mt-0"
          >
            {parseInlineMarkdown(line.replace("# ", ""))}
          </h1>
        );
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3
            key={`h3-${index}`}
            className="text-lg sm:text-xl font-bold text-foreground mt-6 mb-2 border-b border-border/40 pb-1.5"
          >
            {parseInlineMarkdown(line.replace("### ", ""))}
          </h3>
        );
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        elements.push(
          <li key={`li-${index}`} className="ml-5 text-sm sm:text-base text-muted-foreground leading-relaxed my-1 list-disc">
            {parseInlineMarkdown(line.replace(/^[-*]\s+/, ""))}
          </li>
        );
      } else if (/^\d+\.\s/.test(line.trim())) {
        elements.push(
          <li key={`ol-${index}`} className="ml-5 text-sm sm:text-base text-muted-foreground leading-relaxed my-1 list-decimal">
            {parseInlineMarkdown(line.replace(/^\d+\.\s+/, ""))}
          </li>
        );
      } else if (line.trim() === "---") {
        elements.push(<hr key={`hr-${index}`} className="my-6 border-border/60" />);
      } else if (line.trim().length > 0) {
        elements.push(
          <p key={`p-${index}`} className="text-sm sm:text-base text-muted-foreground leading-relaxed my-2.5">
            {parseInlineMarkdown(line)}
          </p>
        );
      }
    });

    return elements;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/40 mb-8">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-primary" />
            <span>Algorithmic Theory & Handbook</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Comprehensive interactive textbook covering formal math derivations, bitmask intuition, complexity, and FAANG interview secrets.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search chapters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-secondary/80 border border-border/60 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Book Table of Contents + Chapter Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar Table of Contents */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 max-h-[calc(100vh-140px)] overflow-y-auto pr-2">
          <div className="p-4 rounded-2xl glass-panel border border-border/60 shadow-md space-y-4">
            <div className="flex items-center justify-between text-xs font-mono font-semibold text-muted-foreground border-b border-border/40 pb-2">
              <span>TABLE OF CONTENTS</span>
              <span>{filteredChapters.length} Chapters</span>
            </div>

            <div className="space-y-4">
              {categories.map((cat) => {
                const catChapters = filteredChapters.filter((c) => c.category === cat);
                if (catChapters.length === 0) return null;

                return (
                  <div key={cat} className="space-y-1.5">
                    <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary px-2">
                      {cat}
                    </h4>
                    <div className="space-y-1">
                      {catChapters.map((chap) => {
                        const isSelected = chap.id === selectedId;
                        return (
                          <button
                            key={chap.id}
                            onClick={() => {
                              setSelectedId(chap.id);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between group ${
                              isSelected
                                ? "bg-primary text-white shadow-md font-semibold scale-[1.02]"
                                : "hover:bg-secondary/80 text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <span className="truncate pr-2">{chap.title}</span>
                            <ChevronRight
                              className={`w-3.5 h-3.5 transition-transform ${
                                isSelected
                                  ? "text-white translate-x-0.5"
                                  : "text-muted-foreground opacity-0 group-hover:opacity-100"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Content Area */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentChapter.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="p-6 sm:p-10 rounded-3xl glass-card border border-border/60 shadow-2xl space-y-6 relative overflow-hidden"
            >
              {/* Top Chapter Metadata Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-xs font-mono font-bold text-primary">
                    {currentChapter.category}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    Chapter {currentIndex + 1} of {DOC_CHAPTERS.length}
                  </span>
                </div>

                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary hover:bg-secondary/80 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors border border-border/40"
                  title="Share Chapter"
                >
                  {copiedChapter ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedChapter ? "Copied Link!" : "Share"}</span>
                </button>
              </div>

              {/* Chapter Summary Box */}
              <div className="p-4 rounded-2xl bg-secondary/40 border border-border/40 flex items-start gap-3">
                <Bookmark className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed italic">
                  &ldquo;{currentChapter.summary}&rdquo;
                </p>
              </div>

              {/* Rendered MDX/Markdown Content */}
              <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-foreground">
                {renderFormattedContent(currentChapter.content)}
              </div>

              {/* Bottom Sequential Book Navigation Buttons */}
              <div className="pt-8 mt-10 border-t border-border/40 flex items-center justify-between gap-4">
                {currentIndex > 0 ? (
                  <button
                    onClick={() => {
                      setSelectedId(DOC_CHAPTERS[currentIndex - 1].id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-secondary hover:bg-secondary/80 text-xs sm:text-sm font-semibold text-foreground transition-all border border-border/40 hover:-translate-x-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <div className="text-left">
                      <div className="text-[10px] uppercase font-mono text-muted-foreground">Previous</div>
                      <div>{DOC_CHAPTERS[currentIndex - 1].title}</div>
                    </div>
                  </button>
                ) : (
                  <div />
                )}

                {currentIndex < DOC_CHAPTERS.length - 1 ? (
                  <button
                    onClick={() => {
                      setSelectedId(DOC_CHAPTERS[currentIndex + 1].id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-xs sm:text-sm font-semibold text-white transition-all shadow-md hover:translate-x-1 ml-auto"
                  >
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-mono text-indigo-200">Next Chapter</div>
                      <div>{DOC_CHAPTERS[currentIndex + 1].title}</div>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
