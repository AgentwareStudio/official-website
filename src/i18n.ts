/*
  Locale runtime. English is served at the site root and zh-CN under /zh/. zh-CN is the source language
  and lives in content.ts; every other locale is a JSON
  file in src/i18n/locales/ whose top-level keys mirror the objects exported from content.ts.
  The HTML entry for each locale sets <body data-locale="..">; we load that file before rendering
  and copy its fields into the shared objects, so components keep importing from content.ts.
*/
import * as C from './content';

export type Locale = 'zh-CN' | 'en' | 'ja' | 'es' | 'de' | 'fr' | 'pt-BR' | 'ko';
export const LOCALES: { code: Locale; path: string; label: string }[] = [
  { code: 'en', path: '', label: 'English' },
  { code: 'zh-CN', path: 'zh', label: '简体中文' },
  { code: 'ja', path: 'ja', label: '日本語' },
  { code: 'es', path: 'es', label: 'Español' },
  { code: 'de', path: 'de', label: 'Deutsch' },
  { code: 'fr', path: 'fr', label: 'Français' },
  { code: 'pt-BR', path: 'pt-br', label: 'Português (Brasil)' },
  { code: 'ko', path: 'ko', label: '한국어' },
];

function detect(): Locale {
  const set = document.body.dataset.locale as Locale | undefined;
  if (set) return set;
  // the single 404 page serves every path: take the locale from the first path segment
  const seg = location.pathname.split('/')[1]?.toLowerCase();
  return LOCALES.find((l) => l.path && l.path === seg)?.code ?? 'en';
}
export const locale = detect();
export const isZh = locale === 'zh-CN';
const entry = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];
export const base = entry.path ? `/${entry.path}` : '';

/** Prefix a site path ("/learn/", "/#manifesto") with the current locale. */
export const href = (p: string) => (p.startsWith('/') ? `${base}${p}` : p);
/** The same page in another locale. */
export function localeHref(code: Locale, page: string) {
  const l = LOCALES.find((x) => x.code === code)!;
  return `${l.path ? `/${l.path}` : ''}${page}`;
}

/** Fill "{n}" style slots. */
export const fmt = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ''));

const files = import.meta.glob('./i18n/locales/*.json');

export async function loadLocale() {
  document.documentElement.lang = locale;
  if (isZh) return;
  const load = files[`./i18n/locales/${locale}.json`];
  if (!load) return;
  const mod = (await load()) as { default: Record<string, Record<string, unknown>> };
  const target = C as unknown as Record<string, Record<string, unknown>>;
  for (const [k, v] of Object.entries(mod.default)) {
    if (target[k]) Object.assign(target[k], v);
  }
}

/* ---------- remembered choice + browser preference ---------- */
const store = {
  get: (k: string) => { try { return window.localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { window.localStorage.setItem(k, v); } catch { /* storage off */ } },
};
/** The language the person explicitly chose (language menu, or the hint). */
export const chosenLocale = () => store.get('aw-lang') as Locale | null;
export const rememberLocale = (code: Locale) => store.set('aw-lang', code);
export const markSeen = () => store.set('aw-seen', '1');

/** Best match for the browser's language list; English when none of ours fits. */
export function browserLocale(): Locale {
  const list = navigator.languages?.length ? navigator.languages : [navigator.language || ''];
  for (const raw of list) {
    const b = String(raw).toLowerCase().split('-')[0];
    if (b === 'zh') return 'zh-CN';
    if (b === 'pt') return 'pt-BR';
    const hit = LOCALES.find((l) => l.code === b);
    if (hit) return hit.code;
  }
  return 'en';
}

/** Short notice shown in the visitor's own language when the page is in another one. */
export const HINT: Record<Locale, { text: string; go: string; close: string }> = {
  en: { text: 'This page is also available in English.', go: 'Switch to English', close: 'Dismiss' },
  'zh-CN': { text: '本页面有简体中文版本。', go: '切换到中文', close: '关闭' },
  ja: { text: 'このページは日本語でもご覧いただけます。', go: '日本語で見る', close: '閉じる' },
  es: { text: 'Esta página también está disponible en español.', go: 'Ver en español', close: 'Cerrar' },
  de: { text: 'Diese Seite gibt es auch auf Deutsch.', go: 'Auf Deutsch ansehen', close: 'Schließen' },
  fr: { text: 'Cette page existe aussi en français.', go: 'Voir en français', close: 'Fermer' },
  'pt-BR': { text: 'Esta página também está disponível em português.', go: 'Ver em português', close: 'Fechar' },
  ko: { text: '이 페이지는 한국어로도 볼 수 있습니다.', go: '한국어로 보기', close: '닫기' },
};
