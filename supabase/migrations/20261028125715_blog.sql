-- Blog posts. Publishing is writing a row: no rebuild, and no article or draft ever lands in the public repo.
--
-- Roles (created here without LOGIN; give each environment its own password, never in Git):
--   blog_reader  the site Worker, through Hyperdrive: reads only the published_posts view
--   blog_writer  the publish script: writes blog.posts
--   alter role blog_reader with login password '...';
--   alter role blog_writer with login password '...';
-- The blog schema is not exposed through the Supabase Data API.

do $$
begin
  if not exists (select from pg_roles where rolname = 'blog_reader') then
    create role blog_reader nologin;
  end if;
  if not exists (select from pg_roles where rolname = 'blog_writer') then
    create role blog_writer nologin;
  end if;
end
$$;

create schema blog;
revoke all on schema blog from public;

create table blog.posts (
  id          uuid        not null,         -- one id for all language versions of a post
  lang        text        not null check (lang in ('zh', 'en', 'ja')),
  slug        text        not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title       text        not null,
  summary     text        not null,         -- also the meta description and the llms.txt blurb
  body_md     text        not null,         -- source Markdown, served as is by the .md endpoint
  body_html   text        not null,         -- HTML rendered by the publish script
  cover       jsonb,                        -- optional image on the image host: {webp, jxl?, alt, width, height}
  tags        text[]      not null default '{}',
  status      text        not null default 'draft' check (status in ('draft', 'published')),
  publish_at  timestamptz,                  -- scheduled publishing: visible from this time on
  updated_at  timestamptz not null default now(),
  primary key (id, lang),
  unique (lang, slug),
  constraint published_has_time check (status = 'draft' or publish_at is not null),
  -- WebP for every browser, JPEG XL where supported (both HTTPS URLs); alt text and the intrinsic size for layout.
  -- coalesce: a missing key makes the test NULL, which a CHECK would accept.
  constraint cover_shape check (cover is null or coalesce(
    jsonb_typeof(cover) = 'object'
    and cover - array['webp', 'jxl', 'alt', 'width', 'height'] = '{}'::jsonb
    and coalesce(cover->>'webp' ~ '^https://', false)
    and (not cover ? 'jxl' or coalesce(cover->>'jxl' ~ '^https://', false))
    and jsonb_typeof(cover->'alt') = 'string'
    and jsonb_typeof(cover->'width') = 'number' and (cover->>'width')::numeric between 1 and 20000
    and jsonb_typeof(cover->'height') = 'number' and (cover->>'height')::numeric between 1 and 20000,
    false))
);

create index posts_published_idx on blog.posts (lang, publish_at desc) where status = 'published';

create function blog.touch_updated_at() returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end
$$;

create trigger posts_touch_updated_at
  before update on blog.posts
  for each row execute function blog.touch_updated_at();

-- Only published posts whose time has come. Pages, RSS, sitemaps and llms.txt all read this view, so a wrong
-- query in the site can never expose a draft or a scheduled post: blog_reader has no access to the table.
-- The view runs with its owner's privileges (no security_invoker), which is what lets blog_reader read it.
-- security_barrier: the view's filter runs before any condition the caller adds, so a caller-supplied function
-- in a WHERE clause never sees a draft or a scheduled post (not even through an error message).
create view blog.published_posts with (security_barrier = true) as
  select id, lang, slug, title, summary, body_md, body_html, cover, tags, publish_at, updated_at
  from blog.posts
  where status = 'published' and publish_at <= now();

-- Second line of defence: row level security with no policy for blog_reader on the table itself.
alter table blog.posts enable row level security;
create policy posts_writer_all on blog.posts for all to blog_writer using (true) with check (true);

-- Revokes cover existing objects only, and new functions are executable by PUBLIC by default: revoke the same way
-- for anything added to this schema later. supabase/tests/blog_access_test.sql fails if any object is left open.
revoke all on all tables in schema blog from public, anon, authenticated, service_role;
revoke all on all functions in schema blog from public, anon, authenticated, service_role;

grant usage on schema blog to blog_reader, blog_writer;
grant select on blog.published_posts to blog_reader;
grant select, insert, update, delete on blog.posts to blog_writer;
