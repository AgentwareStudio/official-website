-- Ownership of blog posts by publish source (kb-studio, promo, cli, ...).
-- Used by the agentware-blog publish service; see kb-studio spec/contracts/blog-service.md.
-- Existing posts are assigned to cli (the command-line publisher).
create table blog.post_sources (
  post_id uuid primary key,
  source text not null check (source ~ '^[a-z0-9-]{1,32}$'),
  assigned_at timestamptz not null default now()
);
revoke all on blog.post_sources from public, blog_reader;
grant select, insert, update, delete on blog.post_sources to blog_writer;
alter table blog.post_sources enable row level security;
create policy writer_sources on blog.post_sources to blog_writer
  using (true) with check (true);
insert into blog.post_sources (post_id, source)
  select distinct id, 'cli' from blog.posts;
