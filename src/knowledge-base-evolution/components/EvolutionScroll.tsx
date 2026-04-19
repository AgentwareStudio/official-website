"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

import { useLocale } from "../i18n/provider";
import type { LevelTranslation } from "../i18n/resources";
import { HybridVisual, KeywordVisual, SemanticVisual, StructuredVisual } from "./Visuals";

const accentGlowClassName: Record<string, string> = {
  blue: "bg-blue-400/5",
  cyan: "bg-cyan-400/5",
  indigo: "bg-indigo-400/5",
  purple: "bg-purple-400/5",
};

type VisualComponent = typeof KeywordVisual;

type Level = LevelTranslation & {
  Visual: VisualComponent;
};

function LevelPage({
  level,
  nextLevelId,
}: {
  level: Level;
  nextLevelId: string | null;
  key?: string;
}) {
  const { messages } = useLocale();

  const scrollToNext = () => {
    const nextId = nextLevelId || "level-5";
    document.getElementById(nextId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div id={level.id} className="snap-page relative flex flex-col items-start justify-center overflow-hidden py-24 md:flex-row md:items-center md:py-0">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 pt-14 pb-8 sm:px-6 md:grid-cols-[1.3fr_0.7fr] md:gap-12 md:px-10 md:pt-0 md:pb-0 md:pl-24 xl:gap-24 xl:px-20 xl:pl-28">
        <div className="space-y-8 md:space-y-10">
          <div>
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="mb-2 text-3xl font-black leading-tight tracking-tighter text-slate-900 sm:text-4xl md:text-5xl xl:text-6xl"
            >
              {level.title}
            </motion.h3>
            <p className="mb-5 text-base font-bold text-slate-400 md:mb-6 md:text-xl">{level.subtitle}</p>
            <p className="max-w-xl text-base font-light leading-relaxed text-slate-600 md:text-lg">{level.description}</p>
          </div>

          <div className="grid grid-cols-1 gap-8 border-y border-slate-100 py-7 md:grid-cols-2 md:py-8">
            <div>
              <h4 className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-4">
                <CheckCircle2 size={14} /> {messages.common.advantages}
              </h4>
              <ul className="space-y-4">
                {level.pros.map((pro, index) => (
                  <li key={index} className="text-sm font-semibold leading-snug text-slate-800 sm:text-base">
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="flex items-center gap-2 text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] mb-4">
                <AlertCircle size={14} /> {messages.common.limitations}
              </h4>
              <ul className="space-y-4">
                {level.cons.map((con, index) => (
                  <li key={index} className="text-sm font-semibold leading-snug text-slate-800 opacity-40 sm:text-base">
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-start gap-4 md:gap-6 xl:flex-row xl:items-center">
            <div className="flex-1">
              <span className="text-[10px] font-black uppercase text-slate-400 block mb-2 tracking-widest">
                {messages.common.coreBreakthrough}:
              </span>
              <span className="text-lg font-black text-slate-900 md:text-xl">{level.solved}</span>
            </div>
            <div className="flex-1 rounded-[1.5rem] bg-slate-900 p-4 shadow-xl shadow-slate-200 md:p-5">
              <span className="text-[10px] font-black uppercase text-slate-500 block mb-2 tracking-widest">
                {messages.common.representativeIssue}:
              </span>
              <span className="text-base font-medium italic leading-relaxed text-white md:text-lg">{level.problem}</span>
            </div>
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="h-[360px] w-full max-w-[420px] overflow-hidden rounded-[2rem] border-[8px] border-white bg-white shadow-2xl shadow-slate-200 md:h-[500px] md:rounded-[3.5rem] md:border-[12px]">
            <level.Visual />
          </div>
          <div
            className={`absolute -z-10 -inset-10 rounded-full blur-[100px] ${
              accentGlowClassName[level.accent] ?? "bg-slate-400/5"
            }`}
          />
        </div>
      </div>

      <div className="left-0 right-0 mt-8 px-5 pb-6 md:absolute md:bottom-10 md:mt-0 md:px-0 md:pb-0 md:pointer-events-none">
        <div className="mx-auto flex max-w-7xl justify-center md:px-10">
          <div className="pointer-events-auto">
            <motion.button
              onClick={scrollToNext}
              whileHover={{ scale: 1.02 }}
              className="group flex w-full max-w-full items-center gap-3 rounded-[1.75rem] border border-slate-200 bg-white p-1 pr-4 shadow-lg transition-all hover:border-slate-900 hover:shadow-2xl sm:gap-4 md:rounded-full md:gap-6 md:pr-6"
            >
              <div className="flex items-center gap-3 rounded-full bg-slate-900 px-4 py-3 text-white md:px-5">
                <span className="text-[10px] font-black uppercase tracking-widest">{messages.common.paradigmShift}</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="max-w-sm text-left text-xs italic leading-tight text-slate-500 sm:text-sm md:line-clamp-2">{level.trigger}</p>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EvolutionScroll() {
  const { messages } = useLocale();
  const [activeLevel, setActiveLevel] = useState("hero");
  const [currentNum, setCurrentNum] = useState("1");

  const levels: Level[] = messages.levels.map((level, index) => ({
    ...level,
    Visual: [KeywordVisual, SemanticVisual, HybridVisual, StructuredVisual][index],
  }));

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "level-1", "level-2", "level-3", "level-4", "level-5"];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            setActiveLevel(id);
            const levelMatch = id.match(/level-(\d)/);
            if (levelMatch) setCurrentNum(levelMatch[1]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLevel = activeLevel.startsWith("level-") && activeLevel !== "level-5";

  return (
    <>
      <AnimatePresence>
        {isLevel && (
          <div className="pointer-events-none fixed inset-x-0 top-1/2 z-[100] hidden -translate-y-1/2 md:block">
            <div className="max-w-7xl mx-auto w-full px-10 xl:px-20">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="-translate-x-[92px] xl:-translate-x-[92px] flex w-fit items-center gap-[40px] pointer-events-auto"
              >
                <div className="flex flex-col items-center gap-0">
                  {"LEVEL".split("").map((letter, index) => (
                    <div key={index} className="text-3xl xl:text-5xl font-black text-slate-300 tracking-tighter leading-none mb-1">
                      {letter}
                    </div>
                  ))}
                  <div className="h-4" />
                  <div className="relative h-12 xl:h-16 w-full overflow-hidden flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={currentNum}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        transition={{ duration: 0.5, ease: "backOut" }}
                        className="text-3xl xl:text-5xl font-black text-slate-900 absolute leading-none tracking-tighter"
                      >
                        {currentNum}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      onClick={() => document.getElementById(`level-${n}`)?.scrollIntoView({ behavior: "smooth" })}
                      className={`w-1.5 rounded-full transition-all duration-700 cursor-pointer ${
                        currentNum === n.toString()
                          ? "bg-slate-900 h-16 shadow-[0_0_20px_rgba(0,0,0,0.3)]"
                          : "bg-slate-200 h-6 opacity-40 hover:opacity-100"
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <section id="hero" className="snap-page flex items-center justify-center py-24 md:py-0">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 md:px-10 md:pl-28 xl:px-20 xl:pl-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col justify-center"
          >
            <h1 className="mb-8 text-4xl font-black leading-[0.85] tracking-tighter text-slate-900 sm:text-5xl md:mb-12 md:text-7xl xl:text-[9rem]">
              {messages.hero.titleLine1}
              <br />
              {messages.hero.titleLine2}
            </h1>
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:gap-8">
              <p className="max-w-xl text-lg font-light leading-relaxed text-slate-400 md:text-2xl">{messages.hero.subtitle}</p>
              <button
                onClick={() => document.getElementById("level-1")?.scrollIntoView({ behavior: "smooth" })}
                className="group mb-2 flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-slate-900 sm:text-sm"
              >
                {messages.hero.startJourney}
                <div className="p-3 rounded-full border border-slate-200 group-hover:border-slate-900 transition-all">
                  <ArrowRight size={16} />
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {levels.map((level, index) => (
        <LevelPage key={level.id} level={level} nextLevelId={index < levels.length - 1 ? levels[index + 1].id : null} />
      ))}
    </>
  );
}
