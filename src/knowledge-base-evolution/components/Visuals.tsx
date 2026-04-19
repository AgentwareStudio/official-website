"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Search, Database, FileText, Target, Radio, Box } from "lucide-react";
import { useLocale } from "../i18n/provider";

// --- LEVEL 1: KEYWORD VISUAL ---
export function KeywordVisual() {
  const { messages } = useLocale();

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[2.5rem] border border-slate-100 bg-slate-50 p-4 font-mono shadow-inner md:p-10">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-50"></div>
      
      <div className="relative z-10 flex w-full max-w-lg flex-col gap-6 md:gap-10">
        <div className="relative flex items-center gap-3 overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-xl md:gap-4 md:p-4">
          <motion.div 
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-blue-100 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <Search size={24} className="text-blue-500 relative z-10" />
          <div className="flex items-center relative z-10">
            <span className="mr-2 text-sm font-medium text-slate-400 md:text-base">{messages.visuals.keyword.query}</span>
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2, ease: "linear" }}
              className="overflow-hidden whitespace-nowrap border-r-2 border-blue-500 pr-1 text-base font-bold tracking-[0.2em] text-blue-600 md:text-lg"
              style={{ display: "inline-block" }}
            >
              &quot;AGENTWARE&quot;
            </motion.span>
          </div>
        </div>

        <div className="flex h-auto flex-col gap-4 md:h-60 md:flex-row md:items-stretch md:justify-between md:gap-6">
          <div className="flex w-full flex-col gap-3 md:w-[40%]">
            <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <Database size={14} className="text-slate-400"/> {messages.visuals.keyword.invertedIndex}
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 font-mono text-[11px] text-slate-500 flex flex-col justify-around h-full shadow-lg relative overflow-hidden">
              <div className="flex justify-between items-center opacity-50">
                <span className="font-semibold text-slate-600">AI_MODEL</span> <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-400">[D2]</span>
              </div>
              <motion.div 
                className="flex justify-between items-center bg-blue-50 px-3 py-2 -mx-3 rounded-lg relative z-10 border border-blue-100"
                animate={{ 
                  backgroundColor: ["rgba(239,246,255,0.5)", "rgba(219,234,254,1)", "rgba(239,246,255,0.5)"],
                  boxShadow: ["0 0 0px rgba(59,130,246,0)", "0 0 15px rgba(59,130,246,0.15)", "0 0 0px rgba(59,130,246,0)"]
                }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2, delay: 1.5 }}
              >
                <span className="text-blue-600 font-black tracking-wider text-[10px]">AGENTWARE</span> 
                <span className="bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-bold shadow-sm">[D1,D3]</span>
              </motion.div>
              <div className="flex justify-between items-center opacity-50">
                <span className="font-semibold text-slate-600">SYSTEM</span> <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-400">[D1,D4]</span>
              </div>
            </div>
          </div>

          <div className="relative hidden flex-1 flex-col items-center justify-center md:flex">
             <motion.div 
               className="absolute top-[30%] left-0 w-full h-[2px] bg-gradient-to-r from-blue-400 to-transparent origin-left"
               initial={{ scaleX: 0, opacity: 0 }}
               animate={{ scaleX: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
               transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2, delay: 1.8 }}
             />
             <motion.div 
               className="absolute top-[85%] left-0 w-full h-[2px] bg-gradient-to-r from-blue-400 to-transparent origin-left"
               initial={{ scaleX: 0, opacity: 0 }}
               animate={{ scaleX: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
               transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2, delay: 1.9 }}
             />
          </div>

          <div className="flex w-full flex-col gap-3 md:w-[40%]">
             <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] flex items-center gap-2">
               <FileText size={14} className="text-slate-400"/> {messages.visuals.keyword.documents}
             </div>
             <div className="bg-white border border-slate-200 p-3 rounded-xl flex flex-col gap-2.5 shadow-lg relative">
                <div className="text-[10px] text-slate-600 font-bold flex items-center justify-between">
                  Doc_01.txt
                  <motion.div className="w-1.5 h-1.5 rounded-full bg-blue-500" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2, delay: 2 }} />
                </div>
                <div className="flex flex-wrap gap-1.5">
                   <div className="h-1.5 w-8 bg-slate-200 rounded-sm"></div>
                   <motion.div className="h-1.5 w-14 bg-blue-400 rounded-sm" animate={{ opacity: [0.4, 1, 0.4], boxShadow: ["0 0 0px #60a5fa", "0 0 8px #60a5fa", "0 0 0px #60a5fa"] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2, delay: 2 }} />
                   <div className="h-1.5 w-5 bg-slate-200 rounded-sm"></div>
                </div>
             </div>
             <div className="bg-white/50 border border-slate-100 p-3 rounded-xl flex flex-col gap-2.5 opacity-50">
                <div className="text-[10px] text-slate-400 font-bold">Doc_02.txt</div>
                <div className="flex flex-wrap gap-1.5">
                   <div className="h-1.5 w-10 bg-slate-100 rounded-sm"></div>
                   <div className="h-1.5 w-12 bg-slate-100 rounded-sm"></div>
                </div>
             </div>
             <div className="bg-white border border-slate-200 p-3 rounded-xl flex flex-col gap-2.5 shadow-lg relative">
                <div className="text-[10px] text-slate-600 font-bold flex items-center justify-between">
                  Doc_03.txt
                  <motion.div className="w-1.5 h-1.5 rounded-full bg-blue-500" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2, delay: 2.1 }} />
                </div>
                <div className="flex flex-wrap gap-1.5">
                   <div className="h-1.5 w-6 bg-slate-200 rounded-sm"></div>
                   <div className="h-1.5 w-4 bg-slate-200 rounded-sm"></div>
                   <motion.div className="h-1.5 w-14 bg-blue-400 rounded-sm" animate={{ opacity: [0.4, 1, 0.4], boxShadow: ["0 0 0px #60a5fa", "0 0 8px #60a5fa", "0 0 0px #60a5fa"] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2, delay: 2.1 }} />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- LEVEL 2: SEMANTIC VISUAL ---
export function SemanticVisual() {
  const { messages } = useLocale();
  const [queryState, setQueryState] = useState(0); 

  useEffect(() => {
    const interval = setInterval(() => {
      setQueryState((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const points = [
    { x: 20, y: 30, color: "blue", label: "Agent" },
    { x: 35, y: 45, color: "blue", label: "LLM" },
    { x: 25, y: 60, color: "blue", label: "Memory" },
    { x: 70, y: 20, color: "emerald", label: "Image" },
    { x: 80, y: 35, color: "emerald", label: "Pixel" },
    { x: 60, y: 80, color: "rose", label: "Audio" },
    { x: 75, y: 70, color: "rose", label: "Wave" },
  ];

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[2.5rem] border border-slate-100 bg-slate-50 shadow-inner">
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
        <div className="w-full h-px bg-slate-300" />
        <div className="h-full w-px bg-slate-300" />
        <div className="absolute top-1/2 left-1/2 w-[80%] h-[80%] -translate-x-1/2 -translate-y-1/2 border border-slate-200 rounded-full border-dashed" />
      </div>

      <div className="relative w-[80%] h-[80%]">
        {points.map((p, i) => {
          const isNearest = p.color === "blue" && queryState >= 1;
          return (
            <div key={i} className="absolute" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
              <motion.div animate={{ scale: isNearest ? 1.5 : 1, backgroundColor: isNearest ? "#3b82f6" : "#cbd5e1" }} className="w-3 h-3 rounded-full shadow-sm relative z-10" />
              {isNearest && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] font-black text-blue-600 bg-white/80 backdrop-blur-sm px-1.5 py-0.5 rounded border border-blue-100 shadow-sm">
                  {p.label} <span className="opacity-50 ml-1">0.{90 - i * 2}</span>
                </motion.div>
              )}
            </div>
          );
        })}

        <motion.div 
          className="absolute z-20 flex flex-col items-center gap-2"
          initial={{ left: "0%", top: "0%", opacity: 0 }}
          animate={{ left: queryState >= 1 ? "30%" : "0%", top: queryState >= 1 ? "40%" : "0%", opacity: 1 }}
          transition={{ duration: 1, ease: "circOut" }}
        >
          <div className="w-5 h-5 bg-blue-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center">
             <Target size={10} className="text-white" />
          </div>
          <span className="text-[10px] font-black text-slate-900 bg-white px-2 py-1 rounded-full shadow-sm border border-slate-200">{messages.visuals.semantic.queryVector}</span>
          <AnimatePresence>
            {queryState === 1 && (
              <motion.div key="scan" initial={{ scale: 0, opacity: 0.5 }} animate={{ scale: 4, opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }} className="absolute top-2.5 left-2.5 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-blue-400 rounded-full pointer-events-none" />
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-4 md:bottom-6 md:right-10">
         <div className="flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
            <Radio size={14} className={queryState === 1 ? "text-blue-500 animate-pulse" : "text-slate-300"} />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {queryState === 0 ? messages.visuals.semantic.idle : queryState === 1 ? messages.visuals.semantic.calculating : messages.visuals.semantic.found}
            </span>
         </div>
      </div>
    </div>
  );
}

// --- LEVEL 3: HYBRID VISUAL ---
export function HybridVisual() {
  const { messages } = useLocale();
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-[2.5rem] border border-slate-100 bg-slate-50 p-6 shadow-inner md:p-8">
      <div className="flex items-center gap-4 w-full">
        <div className="h-px bg-slate-200 flex-1 relative overflow-hidden">
           <motion.div className="absolute inset-y-0 left-0 w-1/3 bg-slate-400" animate={{ x: ["-100%", "300%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
        </div>
        <div className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-mono text-slate-500 shadow-sm font-bold tracking-tight">{messages.visuals.hybrid.keyword}</div>
        <div className="h-px bg-slate-200 flex-1" />
      </div>
      <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center relative shadow-2xl my-4">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="w-14 h-14 rounded-full border-2 border-blue-500 border-t-transparent border-b-transparent"></motion.div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
           <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">{messages.visuals.hybrid.rerank}</span>
           <span className="text-[10px] font-black text-white">{messages.visuals.hybrid.fusion}</span>
        </div>
      </div>
      <div className="flex items-center gap-4 w-full">
        <div className="h-px bg-blue-100 flex-1 relative overflow-hidden">
           <motion.div className="absolute inset-y-0 left-0 w-1/3 bg-blue-500" animate={{ x: ["-100%", "300%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.5 }} />
        </div>
        <div className="px-3 py-1 bg-white border border-blue-200 rounded text-xs font-mono text-blue-600 shadow-sm font-bold tracking-tight">{messages.visuals.hybrid.semantic}</div>
        <div className="h-px bg-blue-100 flex-1" />
      </div>
    </div>
  );
}

// --- LEVEL 4: STRUCTURED VISUAL ---
export function StructuredVisual() {
  const { messages } = useLocale();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[2.5rem] border border-slate-100 bg-slate-50 p-5 shadow-inner md:p-10">
      {/* Engineering Blueprint Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="blueprint" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="#64748b" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#blueprint)" />
        </svg>
      </div>

      {/* Phase 1: Raw Text Extraction (Top) */}
      <div className="absolute top-6 flex w-full justify-center px-5 md:top-10 md:px-10">
        <motion.div 
          className="bg-white border border-slate-200 p-4 rounded-xl shadow-lg w-full max-w-[280px] relative overflow-hidden"
          animate={{ opacity: activeStep === 0 ? 1 : 0.3 }}
        >
          <div className="flex items-center gap-2 mb-2 text-slate-400">
             <FileText size={12} /> <span className="text-[9px] font-bold uppercase tracking-widest">{messages.visuals.structured.unstructuredText}</span>
          </div>
          <div className="space-y-1.5">
             <div className="h-1 bg-slate-100 rounded w-full" />
             <div className="h-1 bg-slate-100 rounded w-4/5" />
             <div className="flex gap-1.5">
                <motion.div 
                  className="h-1.5 bg-purple-400 rounded w-12"
                  animate={activeStep === 0 ? { scale: [1, 1.1, 1], backgroundColor: ["#e2e8f0", "#a855f7", "#e2e8f0"] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="h-1 bg-slate-100 rounded w-16" />
             </div>
          </div>
          {activeStep === 0 && (
            <motion.div 
              className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-50/50"
              initial={{ y: "100%" }}
              animate={{ y: "-100%" }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          )}
        </motion.div>
      </div>

      {/* Phase 2: Knowledge Graph (Center) */}
      <div className="relative mt-6 flex h-full w-full items-center justify-center md:mt-10">
        <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
          <AnimatePresence>
            {activeStep >= 1 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Relationship Lines */}
                {[
                  { x1: "50%", y1: "50%", x2: "25%", y2: "35%" },
                  { x1: "50%", y1: "50%", x2: "75%", y2: "35%" },
                  { x1: "50%", y1: "50%", x2: "50%", y2: "75%" },
                ].map((line, i) => (
                  <motion.line
                    key={i}
                    x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                    stroke="#d8b4fe" strokeWidth="2" strokeDasharray="5 5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                  />
                ))}
              </motion.g>
            )}
          </AnimatePresence>
        </svg>

        {/* Central Entity */}
        <motion.div 
          className="z-20 bg-white border-2 border-purple-500 p-4 rounded-2xl shadow-xl flex flex-col items-center gap-2 w-32"
          animate={{ 
            scale: activeStep >= 1 ? 1 : 0.8,
            borderColor: activeStep === 2 ? "#a855f7" : "#e2e8f0"
          }}
        >
          <Box size={20} className="text-purple-500" />
          <div className="text-center">
             <div className="text-[10px] font-black text-slate-900 leading-none mb-1">AGENTWARE</div>
             <div className="text-[8px] font-bold text-purple-400 uppercase tracking-tighter">{messages.visuals.structured.entityConcept}</div>
          </div>
        </motion.div>

        {/* Related Nodes */}
        {activeStep >= 1 && (
          <>
            <motion.div 
              initial={{ scale: 0, x: -80, y: -60 }}
              animate={{ scale: 1 }}
              className="absolute bg-white border border-purple-200 p-2 rounded-xl shadow-md flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[9px] font-bold text-slate-600">{messages.visuals.structured.memory}</span>
            </motion.div>
            <motion.div 
              initial={{ scale: 0, x: 80, y: -60 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute bg-white border border-purple-200 p-2 rounded-xl shadow-md flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-[9px] font-bold text-slate-600">{messages.visuals.structured.cognition}</span>
            </motion.div>
            <motion.div 
              initial={{ scale: 0, y: 100 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute bg-white border border-purple-200 p-2 rounded-xl shadow-md flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-[9px] font-bold text-slate-600">{messages.visuals.structured.reasoning}</span>
            </motion.div>
          </>
        )}

        {/* Phase 3: Property Inspection (JSON feel) */}
        <AnimatePresence>
          {activeStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-0 top-1/2 z-30 hidden -translate-y-1/2 rounded-2xl border border-purple-500/30 bg-slate-900 p-4 font-mono text-[9px] text-purple-300 shadow-2xl md:block"
            >
              <div className="text-purple-500 mb-2 font-black uppercase tracking-widest text-[8px]">{messages.visuals.structured.metadataExplorer}</div>
              <div className="space-y-1">
                <div>{'{'}</div>
                <div className="pl-3">&quot;type&quot;: <span className="text-emerald-400">&quot;{messages.visuals.structured.mechanism}&quot;</span>,</div>
                <div className="pl-3">&quot;relations&quot;: [</div>
                <div className="pl-6 text-emerald-400">&quot;{messages.visuals.structured.cognition}&quot;,</div>
                <div className="pl-6 text-emerald-400">&quot;{messages.visuals.structured.memory}&quot;</div>
                <div className="pl-3">],</div>
                <div className="pl-3">&quot;active&quot;: <span className="text-amber-400">true</span></div>
                <div>{'}'}</div>
              </div>
              <motion.div 
                className="mt-3 pt-2 border-t border-slate-800 flex items-center gap-2 text-purple-400/50"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Database size={10} /> <span>{messages.visuals.structured.queryingSchema}</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer step indicator */}
      <div className="absolute bottom-6 flex gap-2">
         {[0, 1, 2].map(step => (
           <div key={step} className={`h-1 rounded-full transition-all duration-500 ${activeStep === step ? 'w-8 bg-purple-500' : 'w-2 bg-slate-200'}`} />
         ))}
      </div>
    </div>
  );
}
