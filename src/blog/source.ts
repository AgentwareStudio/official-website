// Where blog posts come from: the view blog.published_posts in Supabase, read as blog_reader through Hyperdrive
// (wrangler.jsonc). The view shows only published posts whose time has come, so nothing here filters by status.
import { env } from 'cloudflare:workers';
import pg from 'pg';
import type { BlogLang, Post } from './types';

const COLUMNS = 'id, lang, slug, title, summary, body_md, body_html, cover, tags, publish_at, updated_at';

export interface Blog {
  /** Newest first. */
  listPosts(lang: BlogLang): Promise<Post[]>;
  getPost(lang: BlogLang, slug: string): Promise<Post | null>;
  /** The other language versions of a post. */
  translations(post: Post): Promise<Post[]>;
  /** Every published post in every language, newest first. */
  allPosts(): Promise<Post[]>;
}

/** Runs `fn` with one connection (Hyperdrive pools the real ones) and closes it afterwards. */
export async function withBlog<T>(fn: (blog: Blog) => Promise<T>): Promise<T> {
  const client = new pg.Client({ connectionString: env.HYPERDRIVE.connectionString });
  await client.connect();
  const rows = async (sql: string, params: unknown[] = []) => (await client.query<Post>(sql, params)).rows;
  try {
    return await fn({
      listPosts: (lang) => rows(`select ${COLUMNS} from blog.published_posts where lang = $1 order by publish_at desc`, [lang]),
      getPost: async (lang, slug) =>
        (await rows(`select ${COLUMNS} from blog.published_posts where lang = $1 and slug = $2`, [lang, slug]))[0] ?? null,
      translations: (post) =>
        rows(`select ${COLUMNS} from blog.published_posts where id = $1 and lang <> $2 order by lang`, [post.id, post.lang]),
      allPosts: () => rows(`select ${COLUMNS} from blog.published_posts order by publish_at desc, lang`),
    });
  } finally {
    await client.end();
  }
}
