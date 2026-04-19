"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Layers, RefreshCw, ShieldCheck, Search, Brain, Cpu, Activity } from "lucide-react";
import { useLocale } from "../i18n/provider";

type Particle = {
  x: number;
  y: number;
  z: number;
  size: number;
};

type Capacity = {
  icon: ReactNode;
  title: string;
  desc: string;
  span: string;
};

const createParticle = (): Particle => ({
  x: Math.random() * 2 - 1,
  y: Math.random() * 2 - 1,
  z: Math.random() * 2 - 1,
  size: Math.random() * 1.5,
});

const drawParticle = (
  particle: Particle,
  t: number,
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
) => {
  const rotationX = t * 0.0003;
  const rotationY = t * 0.0002;
  const x = particle.x;
  const y = particle.y;
  const z = particle.z;
  const x1 = x * Math.cos(rotationY) - z * Math.sin(rotationY);
  const z1 = x * Math.sin(rotationY) + z * Math.cos(rotationY);
  const y2 = y * Math.cos(rotationX) - z1 * Math.sin(rotationX);
  const z2 = y * Math.sin(rotationX) + z1 * Math.cos(rotationX);
  const perspective = 1000 / (1000 + z2 * 500);
  const px = x1 * 500 * perspective + canvas.width / 2;
  const py = y2 * 500 * perspective + canvas.height / 2;

  ctx.beginPath();
  ctx.arc(px, py, particle.size * perspective, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + perspective * 0.2})`;
  ctx.fill();
};

// --- BACKGROUND: 3D PARTICLE CORE ---
function MemoryCore() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const particles = Array.from({ length: 120 }, createParticle);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const render = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => drawParticle(particle, t, ctx, canvas));
      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener("resize", resize);
    resize();
    render(0);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />;
}

// --- LIFE CORE MANDALA ---
function DigitalLifeCore() {
  const steps = [
    { label: "Behavioral Input", icon: "IN" },
    { label: "Working Memory", icon: "WM" },
    { label: "Consolidation", icon: "CS" },
    { label: "Atomic Notes", icon: "AN" },
    { label: "LTM Storage", icon: "LT" },
  ];

  return (
    <div className="relative w-full max-w-4xl aspect-square mx-auto flex items-center justify-center scale-75 md:scale-100">
      <motion.div 
        animate={{ scale: [1, 1.02, 1], boxShadow: ["0 0 40px rgba(255,255,255,0.05)", "0 0 100px rgba(255,255,255,0.15)", "0 0 40px rgba(255,255,255,0.05)"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="z-20 w-56 h-56 rounded-full bg-black flex flex-col items-center justify-center border border-white/20 shadow-2xl relative"
      >
        <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent,white,transparent)] opacity-10 animate-[spin_10s_linear_infinite]" />
        <Activity size={40} className="text-white mb-3" />
        <span className="text-white font-black text-2xl tracking-[0.2em] uppercase">Reasoning</span>
        <div className="h-px w-12 bg-white/20 my-2" />
        <span className="text-[8px] font-bold text-white/40 tracking-[0.4em] uppercase">Digital Nucleus</span>
      </motion.div>

      {steps.map((step, i) => {
        const angle = (i / steps.length) * Math.PI * 2 - Math.PI / 2;
        const x = Math.cos(angle) * 320;
        const y = Math.sin(angle) * 320;
        return (
          <motion.div key={step.label} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.1 }} className="absolute z-30 flex flex-col items-center gap-4" style={{ x, y }}>
            <div className="w-14 h-14 rounded-2xl bg-black border border-white/30 flex items-center justify-center shadow-2xl backdrop-blur-xl">
               <span className="text-white font-mono text-sm font-black">{step.icon}</span>
            </div>
            <span className="text-[9px] font-black text-white/60 uppercase tracking-[0.3em] whitespace-nowrap">{step.label}</span>
          </motion.div>
        );
      })}

      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
        <circle cx="50%" cy="50%" r="320" stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none" strokeDasharray="10 10" />
        {steps.map((_, i) => {
          const angle = (i / steps.length) * Math.PI * 2 - Math.PI / 2;
          const x2 = 50 + Math.cos(angle) * 40; const y2 = 50 + Math.sin(angle) * 40;
          return <motion.line key={i} x1="50%" y1="50%" x2={`${x2}%`} y2={`${y2}%`} stroke="white" strokeWidth="0.5" strokeOpacity="0.1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 1 }} />;
        })}
      </svg>
    </div>
  );
}

// --- PRECISION MODULE COMPONENT ---
function NeuralModule({ cap, index }: { cap: Capacity; index: number; key?: number }) {
  const moduleCode = `0x${(index + 1).toString(16).padStart(4, "0").toUpperCase()}`;

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className={`group relative flex min-h-[300px] flex-col justify-between overflow-hidden border border-white/10 bg-black/40 p-6 transition-all duration-700 hover:border-white/40 md:min-h-[380px] md:p-8 xl:p-12 ${cap.span}`}
    >
      <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/20 group-hover:border-white/60 transition-colors" />
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/20 group-hover:border-white/60 transition-colors" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      <div className="relative z-10 text-left">
        <div className="mb-10 flex items-start justify-between md:mb-12">
           <div className="rounded-sm bg-white p-3 text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] md:p-4">
              {cap.icon}
           </div>
           <div className="text-right font-mono">
              <div className="text-[8px] text-white/20 tracking-tighter uppercase">Status: Active</div>
              <div className="text-[10px] text-white/40">{moduleCode}</div>
           </div>
        </div>
        <h3 className="mb-4 text-xl font-bold uppercase tracking-tight text-white md:text-2xl">{cap.title}</h3>
        <p className="text-base font-light leading-relaxed text-slate-500 transition-colors group-hover:text-slate-300 md:text-lg">
          {cap.desc}
        </p>
      </div>
      <div className="relative z-10 flex justify-between items-end mt-10">
         <div className="h-px flex-1 bg-white/10 mr-10 group-hover:bg-white/30 transition-colors" />
         <span className="text-[9px] font-black text-white/20 group-hover:text-white/60 transition-colors tracking-widest uppercase">Capacity_{index + 1}</span>
      </div>
    </motion.div>
  );
}

export default function Climax() {
  const { messages } = useLocale();
  const [showSignal, setShowSignal] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const updateSignal = () => {
      const rect = section.getBoundingClientRect();
      setShowSignal(rect.top <= window.innerHeight * 0.45);
    };

    updateSignal();
    window.addEventListener("scroll", updateSignal, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateSignal);
    };
  }, []);

  const capacities: Capacity[] = messages.climax.capacities.map((capacity, index) => ({
    ...capacity,
    icon: [
      <Layers key="layers" size={24} />,
      <Brain key="brain" size={24} />,
      <RefreshCw key="refresh" size={24} />,
      <ShieldCheck key="shield" size={24} />,
      <Search key="search" size={24} />,
    ][index],
  }));

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden bg-[#050505] py-24 text-slate-100 md:py-48">
      <MemoryCore />
      
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 md:px-10 xl:px-20">
        
        {/* SIGNAL LEVEL 5 (STAYS VISIBLE) */}
        <div className={`pointer-events-none fixed inset-x-0 top-1/2 z-[100] hidden -translate-y-1/2 transition-opacity duration-300 md:block ${showSignal ? "opacity-100" : "opacity-0"}`}>
            <div className="max-w-7xl mx-auto w-full px-10 xl:px-20">
            <div className="-translate-x-[92px] xl:-translate-x-[92px] flex w-fit items-center gap-[40px]">
                <div className="flex flex-col items-center gap-0 text-left">
                   {"LEVEL".split('').map((letter, i) => (
                     <div key={i} className="text-3xl xl:text-5xl font-black text-white/5 tracking-tighter leading-none mb-1">{letter}</div>
                   ))}
                   <div className="h-4"></div>
                   <div className="text-5xl xl:text-7xl font-black text-white drop-shadow-[0_0_12px_white]">5</div>
                </div>
                <div className="flex flex-col gap-3">
                   {[1, 2, 3, 4, 5].map((n) => (
                     <div key={n} className={`w-1.5 rounded-full ${n === 5 ? 'bg-white h-24 shadow-[0_0_20px_white]' : 'bg-white/10 h-4'}`} />
                   ))}
                </div>
            </div>
          </div>
        </div>

        <div className="md:pl-28 xl:pl-32">
          {/* Restored Header Section */}
          <div className="mb-24 text-center md:mb-60 md:text-left">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-black tracking-[0.4em] uppercase mb-12">
              <Cpu size={12} className="text-blue-400" /> {messages.climax.badge}
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-10 text-4xl font-black leading-[0.9] tracking-tighter text-white sm:text-5xl md:mb-16 md:text-7xl xl:text-[9rem]"
            >
              {messages.climax.titleLine1}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-500">
                {messages.climax.titleLine2}
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="max-w-4xl text-lg font-light leading-tight text-slate-500 sm:text-xl md:text-4xl"
            >
              {messages.climax.description.before}<span className="text-white font-medium">{messages.climax.description.highlight}</span>{messages.climax.description.after}
            </motion.p>
          </div>

          {/* THE MANDALA CORE */}
          <div className="mb-28 scale-110 md:mb-80">
             <DigitalLifeCore />
          </div>

          {/* PRECISION MODULE ARRAY */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-collapse border border-white/5">
            {capacities.map((cap, i) => (
              <NeuralModule key={i} cap={cap} index={i} />
            ))}
          </div>

          {/* Final Thesis */}
          <motion.div className="mt-24 mb-12 text-center md:mt-80 md:mb-20" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
             <h2 className="mb-8 text-3xl font-black tracking-tighter text-white sm:text-4xl md:mb-12 md:text-7xl">
               {messages.climax.finalTitle}
             </h2>
             <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8" />
             <p className="text-slate-600 font-mono tracking-widest text-xs uppercase">{messages.climax.finalCaption}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
