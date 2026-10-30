// What each blog route reads, in one connection per request. Pages render nothing themselves when these return
// null: they answer 404, and Astro serves the prerendered 404 page.
import { withBlog } from './source';
import { BLOG_LANGS, type BlogLang, type Post } from './types';

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** The blog language of a `[locale]` route parameter (the zh and ja prefixes; English has none). */
export function blogLang(param: string | undefined): BlogLang | null {
  const lang = (Object.keys(BLOG_LANGS) as BlogLang[]).find((l) => l !== 'en' && BLOG_LANGS[l].prefix === `/${param}`);
  return lang ?? null;
}

export const indexData = (lang: BlogLang) => withBlog((blog) => blog.listPosts(lang));

/** A post and its other language versions (its Markdown page). */
export async function postVersions(lang: BlogLang, slug: string | undefined): Promise<{ post: Post; others: Post[] } | null> {
  if (!slug || !SLUG.test(slug)) return null;
  return withBlog(async (blog) => {
    const post = await blog.getPost(lang, slug);
    return post && { post, others: await blog.translations(post) };
  });
}

export async function postData(lang: BlogLang, slug: string | undefined): Promise<{ post: Post; others: Post[]; list: Post[] } | null> {
  if (!slug || !SLUG.test(slug)) return null;
  return withBlog(async (blog) => {
    const post = await blog.getPost(lang, slug);
    if (!post) return null;
    const [others, list] = await Promise.all([blog.translations(post), blog.listPosts(lang)]);
    return { post, others, list };
  });
}
