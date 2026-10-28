// Page titles and descriptions per locale (ported from tools/gen_html.py).
// zh-CN is the source language and has its own wording; other locales take the title from
// tools/meta.json and the description from the page's lead copy, shortened for search results.
import meta from '../tools/meta.json';
import type { Locale, Messages } from './i18n';

export type Page = 'home' | 'learn' | 'notfound';

export const SITE = 'https://agentware.studio';
/** Language versions in the order the pages' hreflang links and the sitemap list them. */
export const ALTERNATES: Locale[] = ['en', 'zh-CN', 'ja', 'ko', 'es', 'fr', 'de', 'pt-BR'];
/** Absolute URL of a page (`sub`: '' or 'learn/') in the locale whose path segment is `path` ('' for English). */
export const pageUrl = (path: string, sub: string) => `${SITE}/${path ? `${path}/` : ''}${sub}`;

const ZH: Record<Page, [string, string]> = {
  home: [
    'Agentware Studio — From Interface to Intent · 从操作界面，到委托意图',
    'Agentware 是为智能体时代而生的软件范式：你说明目标、划定边界、定义完成标准，系统在授权范围内组织行动，并交付可验证的结果。',
  ],
  learn: [
    'AI 体系化公开课 — Agentware Studio',
    'We teach what we build. Agentware Studio 的 AI 体系化公开课。首门课程《AI 抽卡毕业课》分三季：原理篇、实战篇、搭建篇。',
  ],
  notfound: ['页面不存在 — Agentware Studio', '这个地址没有页面。'],
};

/** Collapse whitespace; cut at the last space before `n` characters and add an ellipsis. */
export function short(s: string, n = 158) {
  s = s.split(/\s+/).filter(Boolean).join(' ');
  const chars = Array.from(s);
  if (chars.length <= n) return s;
  const head = chars.slice(0, n - 1).join('');
  const cut = head.lastIndexOf(' ');
  return (cut >= 0 ? head.slice(0, cut) : head).replace(/[，,、;；:：]+$/, '') + '…';
}

export function pageMeta(page: Page, code: Locale, messages: Messages | null): { title: string; description: string } {
  if (code === 'zh-CN') {
    const [title, description] = ZH[page];
    return { title, description };
  }
  const m = (meta as Record<string, Record<string, string>>)[code];
  const title = m[page === 'notfound' ? 'nf' : page];
  const lead = {
    home: (messages?.hero as { intro: string }).intro,
    learn: (messages?.learn as { lead: string }).lead,
    notfound: ((messages?.ui as { nf: { title: string } }).nf).title,
  }[page];
  return { title, description: short(lead) };
}
