-- Access rules of the blog schema (supabase test db). Runs on the seed data; everything is rolled back.
begin;
create extension if not exists pgtap with schema extensions;
select plan(25);
-- Let the test user act as the blog roles, and let those roles call the pgTAP assertions
-- (rolled back with the rest; the blog schema's own grants are what is under test).
grant blog_reader, blog_writer to postgres;
grant usage on schema extensions to blog_reader, blog_writer;

-- No object in the schema is open to PUBLIC or the Data API roles (catches a future object without revokes).
select is(
  (select count(*)::int from pg_class c, aclexplode(coalesce(c.relacl, acldefault('r', c.relowner))) a
    where c.relnamespace = 'blog'::regnamespace and c.relkind in ('r', 'v', 'm', 'S', 'f', 'p')
      and (a.grantee = 0 or pg_get_userbyid(a.grantee) in ('anon', 'authenticated', 'service_role'))),
  0, 'no table, view or sequence grants to PUBLIC, anon, authenticated or service_role');
select is(
  (select count(*)::int from pg_proc p, aclexplode(coalesce(p.proacl, acldefault('f', p.proowner))) a
    where p.pronamespace = 'blog'::regnamespace
      and (a.grantee = 0 or pg_get_userbyid(a.grantee) in ('anon', 'authenticated', 'service_role'))),
  0, 'no function is executable by PUBLIC, anon, authenticated or service_role');
select ok((select relrowsecurity from pg_class where oid = 'blog.posts'::regclass), 'row level security is enabled on the table');

-- The site's role: published posts only, through the view; nothing else.
set local role blog_reader;
select is((select count(*)::int from blog.published_posts), 4, 'reader sees the four published, due posts');
select is((select count(*)::int from blog.published_posts where slug in ('draft-post', 'scheduled-post')), 0, 'no drafts or scheduled posts');
select is((select count(*)::int from blog.published_posts where lang = 'en'), 1, 'English list has only its own version');
select throws_ok('select * from blog.posts', '42501', null, 'reader cannot read the table');
select throws_ok($$insert into blog.posts (id, lang, slug, title, summary, body_md, body_html) values (gen_random_uuid(), 'en', 'x', 'x', 'x', 'x', 'x')$$, '42501', null, 'reader cannot write');
-- A cheap function of the reader's own in a WHERE clause would see filtered-out rows without security_barrier.
create function pg_temp.peek(body text) returns boolean language plpgsql cost 0.0000001 as $$
begin
  if body like '%还没写完%' or body like '%Not yet%' then raise exception 'leaked: %', body; end if;
  return true;
end
$$;
-- Force a sequential scan: the partial index would otherwise apply the view's filter first and hide the risk.
set local enable_indexscan = off;
set local enable_bitmapscan = off;
select lives_ok('select count(*) from blog.published_posts where pg_temp.peek(body_md)', 'the view filter runs before caller-supplied conditions');
reset enable_indexscan;
reset enable_bitmapscan;
reset role;

-- Row level security on its own: even with a table grant, the reader gets no rows.
grant select on blog.posts to blog_reader;
set local role blog_reader;
select is((select count(*)::int from blog.posts), 0, 'row level security hides every row from the reader');
reset role;
revoke select on blog.posts from blog_reader;

-- The publish script's role: writes the table, can publish and unpublish.
set local role blog_writer;
select lives_ok($$update blog.posts set status = 'published', publish_at = now() - interval '1 minute' where slug = 'draft-post'$$, 'writer publishes a draft');
select is((select updated_at from blog.posts where slug = 'draft-post'), now(), 'updated_at is set by the trigger');
select throws_ok($$insert into blog.posts (id, lang, slug, title, summary, body_md, body_html, status) values (gen_random_uuid(), 'en', 'no-time', 'x', 'x', 'x', 'x', 'published')$$, '23514', null, 'a published post needs a publish time');
select throws_ok($$insert into blog.posts (id, lang, slug, title, summary, body_md, body_html) values (gen_random_uuid(), 'en', 'Bad Slug', 'x', 'x', 'x', 'x')$$, '23514', null, 'slugs are lowercase words joined by hyphens');
select lives_ok($$update blog.posts set cover = '{"webp": "https://s.ar8.top/a.webp", "alt": "", "width": 1440, "height": 900}' where slug = 'draft-post'$$, 'a cover needs only WebP, alt text and size');
select throws_ok($$update blog.posts set cover = '{"webp": "http://s.ar8.top/a.webp", "alt": "", "width": 1440, "height": 900}' where slug = 'draft-post'$$, '23514', null, 'cover URLs must use HTTPS');
select throws_ok($$update blog.posts set cover = '{"webp": "https://s.ar8.top/a.webp", "alt": "", "width": 1440, "height": 900, "src": "x"}' where slug = 'draft-post'$$, '23514', null, 'a cover has no unknown keys');
select throws_ok($$update blog.posts set cover = '{"webp": "https://s.ar8.top/a.webp", "width": 1440, "height": 900}' where slug = 'draft-post'$$, '23514', null, 'a cover needs alt text');
select throws_ok($$update blog.posts set cover = '{"webp": "https://s.ar8.top/a.webp", "alt": ""}' where slug = 'draft-post'$$, '23514', null, 'a cover needs its size');
select throws_ok($$update blog.posts set cover = '{"alt": "", "width": 1440, "height": 900}' where slug = 'draft-post'$$, '23514', null, 'a cover needs WebP');
select throws_ok('select * from auth.users', '42501', null, 'writer cannot read other schemas');
reset role;

set local role blog_reader;
select is((select count(*)::int from blog.published_posts), 5, 'a newly published post appears at once');
reset role;

-- The Data API roles have no access at all, service_role included (BYPASSRLS does not bypass grants).
set local role anon;
select throws_ok('select * from blog.published_posts', '42501', null, 'anon has no access');
reset role;
set local role authenticated;
select throws_ok('select * from blog.posts', '42501', null, 'authenticated has no access');
reset role;
set local role service_role;
select throws_ok('select * from blog.posts', '42501', null, 'service_role has no access');
reset role;

select * from finish();
rollback;
