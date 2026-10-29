// A row of blog.published_posts (supabase/migrations/…_blog.sql).
export type BlogLang = 'zh' | 'en' | 'ja';

export interface Post {
  id: string;
  lang: BlogLang;
  slug: string;
  title: string;
  summary: string;
  body_md: string;
  body_html: string;
  cover: { jxl?: string; webp: string; alt: string; width: number; height: number } | null;
  tags: string[];
  publish_at: Date;
  updated_at: Date;
}

/** The site locale (src/i18n.ts) and URL prefix of each blog language. */
export const BLOG_LANGS: Record<BlogLang, { locale: 'zh-CN' | 'en' | 'ja'; prefix: string }> = {
  en: { locale: 'en', prefix: '' },
  zh: { locale: 'zh-CN', prefix: '/zh' },
  ja: { locale: 'ja', prefix: '/ja' },
};
export const blogIndex = (lang: BlogLang) => `${BLOG_LANGS[lang].prefix}/blog/`;
export const postPath = (lang: BlogLang, slug: string) => `${BLOG_LANGS[lang].prefix}/blog/${slug}/`;
