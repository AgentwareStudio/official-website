import React, { startTransition, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Check, ChevronDown, Github, Languages, Twitter, Youtube } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { normalizeLanguage } from '../i18n';
import { supportedLanguages, type SupportedLanguageCode } from '../i18n/resources';

type TextItem = {
  title: string;
  body: string;
};

type ComparisonRow = {
  dimension: string;
  traditional: string;
  agentware: string;
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

function FadeIn({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  key?: React.Key;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-12 max-w-3xl md:mb-16">
      <FadeIn>
        <div className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
          {label}
        </div>
      </FadeIn>
      <FadeIn delay={0.1}>
        <h2 className="text-3xl font-medium tracking-tight text-neutral-100 md:text-5xl md:leading-[1.1]">
          {title}
        </h2>
      </FadeIn>
      {description ? (
        <FadeIn delay={0.2}>
          <p className="mt-6 text-lg leading-relaxed text-neutral-400 md:text-xl">{description}</p>
        </FadeIn>
      ) : null}
    </div>
  );
}

export default function AgentwareDefinitionPage() {
  const { t, i18n } = useTranslation();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement | null>(null);

  const currentLanguageCode = normalizeLanguage(i18n.resolvedLanguage);
  const currentLanguage =
    supportedLanguages.find((language) => language.code === currentLanguageCode) ?? supportedLanguages[0];

  const characteristics = t('why.items', { returnObjects: true }) as TextItem[];
  const principles = t('principles.items', { returnObjects: true }) as TextItem[];
  const comparisonRows = t('comparison.rows', { returnObjects: true }) as ComparisonRow[];
  const visions = t('vision.items', { returnObjects: true }) as TextItem[];
  const domains = t('vision.domains', { returnObjects: true }) as string[];

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!languageMenuRef.current?.contains(event.target as Node)) {
        setIsLanguageMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = currentLanguageCode;
    document.documentElement.dataset.locale = currentLanguageCode;
    document.title = t('meta.title');
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('meta.description'));
    }
  }, [currentLanguageCode, t]);

  const handleLanguageChange = (languageCode: SupportedLanguageCode) => {
    setIsLanguageMenuOpen(false);
    startTransition(() => {
      void i18n.changeLanguage(languageCode);
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-200 selection:bg-white/90 selection:text-black">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 h-[800px] w-[1200px] -translate-x-1/2 rounded-full bg-white/[0.02] blur-[120px]" />
        <div className="absolute top-[40%] left-[-10%] h-[600px] w-[600px] rounded-full bg-indigo-500/[0.02] blur-[120px]" />
        <div className="absolute right-[-10%] bottom-[20%] h-[600px] w-[600px] rounded-full bg-emerald-500/[0.02] blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <header className="fixed top-0 left-0 z-50 w-full border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:px-8">
            <a href="#top" className="font-mono text-sm font-medium uppercase tracking-[0.2em] text-neutral-200 transition-colors hover:text-white">
              Agentware
            </a>
            <div className="flex items-center gap-3 md:gap-6">
              <nav className="hidden items-center gap-8 text-sm font-medium text-neutral-500 md:flex">
                <a href="#definition" className="transition-colors hover:text-white">{t('nav.definition')}</a>
                <a href="#why" className="transition-colors hover:text-white">{t('nav.why')}</a>
                <a href="#principles" className="transition-colors hover:text-white">{t('nav.principles')}</a>
                <a href="#vision" className="transition-colors hover:text-white">{t('nav.vision')}</a>
              </nav>
              <div ref={languageMenuRef} className="relative">
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={isLanguageMenuOpen}
                  aria-label={t('nav.language')}
                  onClick={() => setIsLanguageMenuOpen((open) => !open)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-neutral-200 transition-colors hover:bg-white/[0.06] md:px-4 md:text-sm"
                >
                  <Languages className="h-4 w-4" />
                  <span className="hidden sm:inline">{currentLanguage.nativeLabel}</span>
                  <span className="sm:hidden">{currentLanguage.shortLabel}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isLanguageMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {isLanguageMenuOpen ? (
                  <div
                    role="menu"
                    className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]/95 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl"
                  >
                    {supportedLanguages.map((language) => {
                      const isActive = language.code === currentLanguageCode;

                      return (
                        <button
                          key={language.code}
                          type="button"
                          role="menuitemradio"
                          aria-checked={isActive}
                          onClick={() => handleLanguageChange(language.code)}
                          className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm text-neutral-300 transition-colors hover:bg-white/[0.05] hover:text-white"
                        >
                          <span>{language.nativeLabel}</span>
                          {isActive ? <Check className="h-4 w-4 text-white" /> : null}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </header>

        <main id="top" className="pt-24">
          <section className="relative flex min-h-[85vh] flex-col justify-center py-20">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl">
              <motion.div variants={fadeUp} className="mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/[0.02] px-4 py-1.5 font-mono text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 backdrop-blur-md">
                {t('hero.badge')}
              </motion.div>
              <motion.h1 variants={fadeUp} className="text-6xl font-medium tracking-tighter text-white sm:text-7xl md:text-8xl lg:text-9xl">
                {t('hero.title')}
              </motion.h1>
              <motion.p variants={fadeUp} className="mt-8 max-w-2xl text-xl leading-relaxed text-neutral-300 md:text-2xl">
                {t('hero.subtitle')}
              </motion.p>
              <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-base leading-relaxed text-neutral-400 md:text-lg">
                {t('hero.body')}
              </motion.p>
              <motion.div variants={fadeUp} className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
                <a
                  href="#definition"
                  className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-8 py-3.5 text-sm font-medium text-black transition-transform hover:scale-105 active:scale-95"
                >
                  <span>{t('hero.primaryCta')}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="/knowledge-base-evolution"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-transparent px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/5 active:scale-95"
                >
                  <span>Knowledge Base Evolution</span>
                </a>
                <a
                  href="https://github.com/AgentwareStudio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-transparent px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/5 active:scale-95"
                >
                  <Github className="h-4 w-4" />
                  <span>{t('hero.secondaryCta')}</span>
                </a>
              </motion.div>
            </motion.div>
          </section>

          <section id="definition" className="border-t border-white/5 py-24 md:py-32">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <FadeIn>
                <div className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-8 transition-colors hover:bg-white/[0.03] md:p-12">
                  <div className="mb-6 font-mono text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">{t('definition.label')}</div>
                  <p className="text-2xl leading-relaxed text-neutral-300 md:text-3xl md:leading-snug">{t('definition.body')}</p>
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                <div className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-8 transition-colors hover:bg-white/[0.03] md:p-12">
                  <div className="mb-6 font-mono text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">{t('definition.formulaLabel')}</div>
                  <div className="relative rounded-xl border border-white/10 bg-black/50 p-6 font-mono text-sm leading-relaxed text-neutral-300 shadow-inner">
                    <div className="absolute top-0 left-0 h-full w-1 bg-white/20" />
                    <span className="font-semibold text-white">{t('definition.formulaLead')}</span>{' '}
                    <span className="text-neutral-600">=</span> {t('definition.formulaBody')}
                  </div>
                  <p className="mt-8 text-sm leading-relaxed text-neutral-400">{t('definition.formulaNote')}</p>
                </div>
              </FadeIn>
            </div>
          </section>

          <section id="why" className="border-t border-white/5 py-24 md:py-32">
            <SectionHeading label={t('why.label')} title={t('why.title')} description={t('why.description')} />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {characteristics.map((item, index) => (
                <FadeIn key={`${item.title}-${index}`} delay={index * 0.1}>
                  <div className="group h-full rounded-2xl border border-white/5 bg-white/[0.01] p-8 transition-all hover:border-white/10 hover:bg-white/[0.03]">
                    <h3 className="mb-3 text-lg font-medium tracking-tight text-neutral-100">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-neutral-400">{item.body}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </section>

          <section id="principles" className="border-t border-white/5 py-24 md:py-32">
            <SectionHeading label={t('principles.label')} title={t('principles.title')} description={t('principles.description')} />

            <div className="grid gap-4 md:grid-cols-2">
              {principles.map((item, index) => (
                <FadeIn key={`${item.title}-${index}`} delay={index * 0.1}>
                  <div className="group h-full rounded-3xl border border-white/5 bg-white/[0.01] p-8 transition-all hover:border-white/10 hover:bg-white/[0.03] md:p-10">
                    <h3 className="mb-4 text-xl font-medium tracking-tight text-neutral-100">{item.title}</h3>
                    <p className="text-base leading-relaxed text-neutral-400">{item.body}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </section>

          <section className="border-t border-white/5 py-24 md:py-32">
            <SectionHeading label={t('formalization.label')} title={t('formalization.title')} />

            <div className="mb-24 grid gap-4 lg:grid-cols-2">
              <FadeIn>
                <div className="h-full rounded-3xl border border-white/5 bg-white/[0.01] p-8 md:p-10">
                  <div className="mb-6 font-mono text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">{t('formalization.formalLabel')}</div>
                  <p className="text-base leading-relaxed text-neutral-300">{t('formalization.formalBody')}</p>
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                <div className="h-full rounded-3xl border border-white/5 bg-white/[0.01] p-8 md:p-10">
                  <div className="mb-6 font-mono text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">{t('formalization.plainLabel')}</div>
                  <p className="text-base leading-relaxed text-neutral-300">{t('formalization.plainBody')}</p>
                </div>
              </FadeIn>
            </div>

            <SectionHeading label={t('comparison.label')} title={t('comparison.title')} />

            <FadeIn>
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.01]">
                <div className="grid grid-cols-1 border-b border-white/10 bg-white/[0.02] text-xs font-medium uppercase tracking-wider text-neutral-500 md:grid-cols-3">
                  <div className="p-5 md:p-6">{t('comparison.dimension')}</div>
                  <div className="hidden p-5 md:block md:p-6">{t('comparison.traditional')}</div>
                  <div className="hidden p-5 md:block md:p-6">{t('comparison.agentware')}</div>
                </div>
                {comparisonRows.map((row, index) => (
                  <div key={`${row.dimension}-${index}`} className="grid grid-cols-1 border-b border-white/5 text-sm transition-colors hover:bg-white/[0.02] last:border-b-0 md:grid-cols-3">
                    <div className="p-5 font-medium text-neutral-200 md:p-6">{row.dimension}</div>
                    <div className="p-5 text-neutral-400 md:p-6"><span className="mb-2 block text-xs font-medium uppercase tracking-wider text-neutral-600 md:hidden">{t('comparison.traditional')}</span>{row.traditional}</div>
                    <div className="p-5 text-neutral-300 md:p-6"><span className="mb-2 block text-xs font-medium uppercase tracking-wider text-neutral-600 md:hidden">{t('comparison.agentware')}</span>{row.agentware}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </section>

          <section id="vision" className="border-t border-white/5 py-24 md:py-32">
            <SectionHeading label={t('vision.label')} title={t('vision.title')} description={t('vision.description')} />

            <div className="grid gap-4 md:grid-cols-2">
              {visions.map((item, index) => (
                <FadeIn key={`${item.title}-${index}`} delay={index * 0.1}>
                  <div className="group h-full rounded-3xl border border-white/5 bg-white/[0.01] p-8 transition-all hover:border-white/10 hover:bg-white/[0.03] md:p-10">
                    <h3 className="mb-4 text-xl font-medium tracking-tight text-neutral-100">{item.title}</h3>
                    <p className="text-base leading-relaxed text-neutral-400">{item.body}</p>
                  </div>
                </FadeIn>
              ))}
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
              <FadeIn>
                <div className="h-full rounded-3xl border border-white/5 bg-white/[0.01] p-8 md:p-10">
                  <div className="mb-6 font-mono text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">{t('vision.domainsLabel')}</div>
                  <ul className="space-y-4 text-sm leading-relaxed text-neutral-300">
                    {domains.map((item, index) => (
                      <li key={`${item}-${index}`} className="flex items-start gap-3">
                        <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/20" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:p-12">
                  <div className="absolute top-0 right-0 -z-10 h-[300px] w-[300px] translate-x-1/3 -translate-y-1/3 rounded-full bg-white/[0.03] blur-[80px]" />
                  <div className="mb-6 font-mono text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">{t('vision.positioningLabel')}</div>
                  <p className="text-2xl leading-relaxed text-white md:text-3xl md:leading-snug">{t('vision.positioningBody')}</p>
                </div>
              </FadeIn>
            </div>
          </section>

          <section id="contact" className="border-t border-white/5 py-24 md:py-32">
            <FadeIn>
              <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-10 md:p-16 lg:p-24">
                <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.02] blur-[100px]" />

                <div className="mx-auto max-w-3xl text-center">
                  <div className="mb-6 flex justify-center">
                    <div className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">{t('cta.label')}</div>
                  </div>
                  <h2 className="text-4xl font-medium tracking-tight md:text-6xl">{t('cta.title')}</h2>
                  <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-neutral-400">{t('cta.body')}</p>
                  <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <a
                      href="https://github.com/AgentwareStudio"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-8 py-4 text-sm font-medium text-black transition-transform hover:scale-105 active:scale-95"
                    >
                      <Github className="h-4 w-4" />
                      <span>{t('cta.github')}</span>
                    </a>
                    <a
                      href="https://x.com/AgentwareStudio"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-transparent px-8 py-4 text-sm font-medium text-white transition-colors hover:bg-white/5 active:scale-95"
                    >
                      <Twitter className="h-4 w-4" />
                      <span>{t('cta.x')}</span>
                    </a>
                  </div>
                </div>
              </div>
            </FadeIn>
          </section>
        </main>

        <footer className="border-t border-white/5 py-12 text-sm text-neutral-500">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-mono font-medium uppercase tracking-widest text-neutral-300">{t('footer.title')}</div>
              <div className="mt-2 text-neutral-500">{t('footer.tagline')}</div>
            </div>
            <div className="flex items-center gap-6">
              <a href="https://github.com/AgentwareStudio" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-neutral-300">
                <span className="sr-only">{t('footer.github')}</span>
                <Github className="h-5 w-5" />
              </a>
              <a href="https://x.com/AgentwareStudio" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-neutral-300">
                <span className="sr-only">{t('footer.x')}</span>
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://www.youtube.com/@Agentware-u7w" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-neutral-300">
                <span className="sr-only">{t('footer.youtube')}</span>
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
