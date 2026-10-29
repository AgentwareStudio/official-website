// Where blog posts come from. Pages call these functions only; the sample data serves local development and
// design prototypes, and the Supabase source (Hyperdrive, blog_reader on blog.published_posts) replaces it.
import { SAMPLE_POSTS } from './sample';
import type { BlogLang, Post } from './types';

const published = () => SAMPLE_POSTS.filter((p) => p.publish_at <= new Date());

/** Newest first. */
export async function listPosts(lang: BlogLang): Promise<Post[]> {
  return published().filter((p) => p.lang === lang).sort((a, b) => +b.publish_at - +a.publish_at);
}

export async function getPost(lang: BlogLang, slug: string): Promise<Post | null> {
  return published().find((p) => p.lang === lang && p.slug === slug) ?? null;
}

/** The other language versions of a post. */
export async function translations(post: Post): Promise<Post[]> {
  return published().filter((p) => p.id === post.id && p.lang !== post.lang);
}

/** Every published post, for static paths while the blog is built from sample data. */
export async function allPosts(): Promise<Post[]> {
  return published();
}
