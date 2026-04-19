"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Languages } from "lucide-react";
import EvolutionScroll from "./components/EvolutionScroll";
import Climax from "./components/Climax";
import { LocaleProvider, useLocale } from "./i18n/provider";
import type { SupportedLanguageCode } from "./i18n/resources";

import "./styles.css";

function LanguageSwitcher() {
  const { languageCode, setLanguageCode, supportedLanguages, messages } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const currentLanguage =
    supportedLanguages.find((language) => language.code === languageCode) ?? supportedLanguages[0];

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLanguageChange = (nextLanguage: SupportedLanguageCode) => {
    setIsOpen(false);
    startTransition(() => {
      setLanguageCode(nextLanguage);
    });
  };

  return (
    <div className="fixed top-6 right-6 z-[200] md:right-8" ref={menuRef}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={messages.nav.language}
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/85 px-3 py-2 text-xs font-medium text-slate-700 shadow-lg shadow-slate-200/70 backdrop-blur md:px-4 md:text-sm"
      >
        <Languages className="h-4 w-4" />
        <span className="hidden sm:inline">{currentLanguage.nativeLabel}</span>
        <span className="sm:hidden">{currentLanguage.shortLabel}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen ? (
        <div
          role="menu"
          className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-black/10 bg-white/95 p-2 shadow-2xl shadow-slate-300/60 backdrop-blur"
        >
          {supportedLanguages.map((language) => {
            const isActive = language.code === languageCode;

            return (
              <button
                key={language.code}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => handleLanguageChange(language.code)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                <span>{language.nativeLabel}</span>
                {isActive ? <Check className="h-4 w-4 text-slate-900" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function HomeContent() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const sectionIds = ["hero", "level-1", "level-2", "level-3", "level-4"] as const;
    const levelFive = document.getElementById("level-5");
    if (!levelFive) return;
    const shouldUseWheelPaging =
      typeof window !== "undefined" && window.matchMedia("(min-width: 768px) and (pointer: fine)").matches;

    let accumulatedDelta = 0;
    let isLocked = false;
    let unlockTimer: number | undefined;
    let animationFrameId: number | undefined;

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animateScrollTo = (targetY: number, duration = 900) => {
      const startY = window.scrollY;
      const distance = targetY - startY;
      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeInOutCubic(progress);

        window.scrollTo({
          top: startY + distance * eased,
          behavior: "auto",
        });

        if (progress < 1) {
          animationFrameId = window.requestAnimationFrame(tick);
          return;
        }

        isLocked = false;
      };

      isLocked = true;
      animationFrameId = window.requestAnimationFrame(tick);
    };

    const getCurrentSectionIndex = () => {
      const viewportCenter = window.innerHeight / 2;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      sectionIds.forEach((id, index) => {
        const element = document.getElementById(id);
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      return closestIndex;
    };

    const scrollToSection = (index: number) => {
      const target = document.getElementById(sectionIds[index]);
      if (!target) return;

      window.clearTimeout(unlockTimer);
      window.cancelAnimationFrame(animationFrameId ?? 0);
      animateScrollTo(target.offsetTop, 1050);
      unlockTimer = window.setTimeout(() => {
        isLocked = false;
      }, 1150);
    };

    const handleWheel = (event: WheelEvent) => {
      if (isLocked) {
        event.preventDefault();
        return;
      }

      const levelFiveTop = levelFive.offsetTop;
      const isInsideLevelFive = window.scrollY >= levelFiveTop - 4;
      const isAtLevelFiveTop = window.scrollY <= levelFiveTop + 4;

      if (isInsideLevelFive) {
        if (event.deltaY < 0 && isAtLevelFiveTop) {
          accumulatedDelta += event.deltaY;

          if (Math.abs(accumulatedDelta) >= 240) {
            event.preventDefault();
            accumulatedDelta = 0;
            scrollToSection(sectionIds.length - 1);
          }
        } else {
          accumulatedDelta = 0;
        }

        return;
      }

      accumulatedDelta += event.deltaY;
      const threshold = 260;

      if (Math.abs(accumulatedDelta) < threshold) {
        return;
      }

      event.preventDefault();

      const direction = accumulatedDelta > 0 ? 1 : -1;
      accumulatedDelta = 0;

      const currentIndex = getCurrentSectionIndex();
      const nextIndex = Math.max(0, Math.min(sectionIds.length - 1, currentIndex + direction));

      if (nextIndex !== currentIndex) {
        scrollToSection(nextIndex);
        return;
      }

      if (direction > 0 && currentIndex === sectionIds.length - 1) {
        window.clearTimeout(unlockTimer);
        window.cancelAnimationFrame(animationFrameId ?? 0);
        animateScrollTo(levelFiveTop, 1150);
        unlockTimer = window.setTimeout(() => {
          isLocked = false;
        }, 1250);
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      setIsDark(entry.isIntersecting);
    }, {
      threshold: 0.35,
    });

    observer.observe(levelFive);
    if (shouldUseWheelPaging) {
      window.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (shouldUseWheelPaging) {
        window.removeEventListener("wheel", handleWheel);
      }
      window.clearTimeout(unlockTimer);
      window.cancelAnimationFrame(animationFrameId ?? 0);
      observer.disconnect();
      setIsDark(false);
    };
  }, []);

  return (
    <main className={`kbe-root relative transition-colors duration-1000 ${isDark ? "kbe-dark" : ""}`}>
      <LanguageSwitcher />
      <EvolutionScroll />
      <section id="level-5" className="relative min-h-screen">
         <Climax />
      </section>
    </main>
  );
}

export default function Home() {
  return (
    <LocaleProvider>
      <HomeContent />
    </LocaleProvider>
  );
}
