/*
  Locale runtime. English is served at the site root and zh-CN under /zh/. zh-CN is the source language
  and lives in content.ts; every other locale is a JSON
  file in src/i18n/locales/ whose top-level keys mirror the objects exported from content.ts.
  A page applies its locale before rendering (setLocale): the shared objects are reset to the zh-CN
  source and the locale's fields are copied over them, so components keep importing from content.ts.
  The reset matters when one process renders every locale in turn (static build); in the browser a
  page applies its locale once.
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

export type Messages = Record<string, Record<string, unknown>>;

/** The locale a browser page was built for; the single 404 page takes it from the first path segment. */
export function detect(): Locale {
  if (typeof document === 'undefined') return 'en';
  const set = document.body.dataset.locale as Locale | undefined;
  if (set) return set;
  const seg = location.pathname.split('/')[1]?.toLowerCase();
  return LOCALES.find((l) => l.path && l.path === seg)?.code ?? 'en';
}

// Live bindings: components read these at render time, after the page has applied its locale.
export let locale: Locale = detect();
export let isZh = locale === 'zh-CN';
export let base = '';

const content = C as unknown as Messages;
// Clone each export: a module namespace object itself cannot be structured-cloned in native ESM.
const source: Messages = Object.fromEntries(Object.entries(content).map(([k, v]) => [k, structuredClone(v)]));

/** Switch the shared copy to `code`: zh-CN source first, then the locale's fields (shallow, per top-level object). */
export function setLocale(code: Locale, messages: Messages | null) {
  locale = code;
  isZh = code === 'zh-CN';
  const entry = LOCALES.find((l) => l.code === code) ?? LOCALES[0];
  base = entry.path ? `/${entry.path}` : '';
  for (const [k, v] of Object.entries(source)) {
    const target = content[k];
    for (const key of Object.keys(target)) delete target[key];
    Object.assign(target, structuredClone(v));
  }
  // Cloned so that later edits to the shared copy never reach the cached messages.
  for (const [k, v] of Object.entries(messages ?? {})) {
    if (content[k]) Object.assign(content[k], structuredClone(v));
  }
}
setLocale(locale, null);

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

/** The locale's messages (null for the zh-CN source). */
export async function messagesFor(code: Locale): Promise<Messages | null> {
  if (code === 'zh-CN') return null;
  const load = files[`./i18n/locales/${code}.json`];
  if (!load) return null;
  return ((await load()) as { default: Messages }).default;
}

/** Browser pages without server-rendered copy: detect the locale, then load and apply it. */
export async function loadLocale() {
  document.documentElement.lang = locale;
  setLocale(locale, await messagesFor(locale));
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
