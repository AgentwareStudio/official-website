// Blog interface strings (the blog is written in Chinese, English and Japanese).
import type { BlogLang } from './types';

export const BLOG_UI: Record<BlogLang, {
  title: string;
  en: string;
  lead: string;
  published: string;
  updated: string;
  reading: string;
  minutes: (n: number) => string;
  contents: string;
  alsoIn: string;
  back: string;
  empty: string;
  latest: string;
  archive: string;
  filter: string;
  all: string;
  none: string;
  shownTag: (n: string, t: string) => string;
  read: string;
  prev: string;
  next: string;
  end: string;
  endNote: string;
  copy: string;
  copied: string;
  toTop: string;
  date: (d: Date) => string;
}> = {
  zh: {
    title: '博客', en: 'Blog',
    lead: '关于 Agentware、智能体软件和我们正在做的事。先给结论，再讲来龙去脉。',
    published: '发布', updated: '更新', reading: '阅读', minutes: (n) => `约 ${n} 分钟`, contents: '目录', alsoIn: '其他语言',
    back: '全部文章', empty: '还没有文章。', latest: '最新', archive: '全部文章',
    filter: '按标签筛选', all: '全部', none: '这个标签下还没有文章。', shownTag: (n, t) => `“${t}”：${n} 篇`,
    read: '阅读全文', prev: '上一篇', next: '下一篇', end: '全文完', endNote: '读到这里，这次交付就完成了。',
    copy: '复制', copied: '已复制', toTop: '回到顶部',
    date: (d) => `${d.getUTCFullYear()} 年 ${d.getUTCMonth() + 1} 月 ${d.getUTCDate()} 日`,
  },
  en: {
    title: 'Blog', en: 'Blog',
    lead: 'On Agentware, agentic software and what we are building. Conclusions first, then the reasoning.',
    published: 'Published', updated: 'Updated', reading: 'Reading', minutes: (n) => `${n} min`, contents: 'Contents', alsoIn: 'Also in',
    back: 'All posts', empty: 'No posts yet.', latest: 'Latest', archive: 'All posts',
    filter: 'Filter by tag', all: 'All', none: 'No posts with this tag yet.', shownTag: (n, t) => `“${t}” · ${n}`,
    read: 'Read the post', prev: 'Previous', next: 'Next', end: 'End', endNote: 'You reached the end. Delivered.',
    copy: 'Copy', copied: 'Copied', toTop: 'Back to top',
    date: (d) => d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }),
  },
  ja: {
    title: 'ブログ', en: 'Blog',
    lead: 'Agentware、エージェント型ソフトウェア、そして私たちが作っているものについて。結論から先に書きます。',
    published: '公開', updated: '更新', reading: '読了', minutes: (n) => `約 ${n} 分`, contents: '目次', alsoIn: '他の言語',
    back: 'すべての記事', empty: 'まだ記事はありません。', latest: '最新', archive: 'すべての記事',
    filter: 'タグで絞り込む', all: 'すべて', none: 'このタグの記事はまだありません。', shownTag: (n, t) => `「${t}」：${n} 本`,
    read: '記事を読む', prev: '前の記事', next: '次の記事', end: 'おわり', endNote: 'ここまで読めば、今回の受け渡しは完了です。',
    copy: 'コピー', copied: 'コピーしました', toTop: 'ページの先頭へ',
    date: (d) => `${d.getUTCFullYear()}年${d.getUTCMonth() + 1}月${d.getUTCDate()}日`,
  },
};

export const LANG_LABEL: Record<BlogLang, string> = { zh: '中文', en: 'English', ja: '日本語' };

/** Reading time: about 400 CJK characters or 220 English words a minute. */
export function readingMinutes(lang: BlogLang, html: string) {
  const text = html.replace(/<pre[\s\S]*?<\/pre>/g, '').replace(/<[^>]+>/g, ' ');
  const units = lang === 'en' ? text.split(/\s+/).filter(Boolean).length / 220 : text.replace(/\s/g, '').length / 400;
  return Math.max(1, Math.round(units));
}

/** 2026.10.20 — the dotted date used in mono labels. */
export const dotted = (d: Date) =>
  `${d.getUTCFullYear()}.${String(d.getUTCMonth() + 1).padStart(2, '0')}.${String(d.getUTCDate()).padStart(2, '0')}`;
