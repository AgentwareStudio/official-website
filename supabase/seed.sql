-- Local development data only (supabase db reset runs this after the migrations). Never used elsewhere.

-- Local-only passwords; each real environment sets its own.
alter role blog_reader with login password 'blog_reader_local';
alter role blog_writer with login password 'blog_writer_local';

insert into blog.posts (id, lang, slug, title, summary, body_md, body_html, tags, status, publish_at) values
  -- Published in all three languages.
  ('11111111-1111-4111-8111-111111111111', 'zh', 'what-is-agentware', '什么是 Agentware',
   'Agentware 是你交给它目标的软件：它在授权的边界内组织行动，并交付可以验证的结果。',
   E'Agentware 是你交给它目标的软件。\n\n## 从操作到委托\n\n过去你点按钮，现在你说明目标。',
   '<p>Agentware 是你交给它目标的软件。</p><h2>从操作到委托</h2><p>过去你点按钮，现在你说明目标。</p>',
   '{agentware,intro}', 'published', now() - interval '2 days'),
  ('11111111-1111-4111-8111-111111111111', 'en', 'what-is-agentware', 'What is Agentware',
   'Agentware is software you entrust with a goal: it organizes actions within authorized bounds and delivers verifiable results.',
   E'Agentware is software you entrust with a goal.\n\n## From operating to delegating\n\nYou used to click buttons. Now you state the outcome.',
   '<p>Agentware is software you entrust with a goal.</p><h2>From operating to delegating</h2><p>You used to click buttons. Now you state the outcome.</p>',
   '{agentware,intro}', 'published', now() - interval '2 days'),
  ('11111111-1111-4111-8111-111111111111', 'ja', 'what-is-agentware', 'Agentware とは',
   'Agentware は目標を任せるソフトウェアです。許可された範囲で行動を組み立て、検証できる結果を届けます。',
   E'Agentware は目標を任せるソフトウェアです。\n\n## 操作から委任へ\n\nこれまではボタンを押していました。これからは結果を伝えます。',
   '<p>Agentware は目標を任せるソフトウェアです。</p><h2>操作から委任へ</h2><p>これまではボタンを押していました。これからは結果を伝えます。</p>',
   '{agentware,intro}', 'published', now() - interval '2 days'),
  -- Published in Chinese only: must not appear in the English or Japanese lists.
  ('22222222-2222-4222-8222-222222222222', 'zh', 'only-in-chinese', '只有中文版的文章',
   '这篇文章只有中文版本。', '这篇文章只有中文版本。', '<p>这篇文章只有中文版本。</p>',
   '{}', 'published', now() - interval '1 day'),
  -- Draft: never visible.
  ('33333333-3333-4333-8333-333333333333', 'zh', 'draft-post', '草稿', '还没写完。', '还没写完。', '<p>还没写完。</p>',
   '{}', 'draft', null),
  -- Scheduled for tomorrow: hidden until then.
  ('44444444-4444-4444-8444-444444444444', 'en', 'scheduled-post', 'Scheduled for tomorrow', 'Not yet.', 'Not yet.', '<p>Not yet.</p>',
   '{}', 'published', now() + interval '1 day');

-- A cover on the trilingual post (the image host's JPEG XL and WebP pair).
update blog.posts set cover = '{"jxl": "https://s.ar8.top/img/picgo/20261028221833619.jxl", "webp": "https://s.ar8.top/img/picgo/20261028221836613.webp", "alt": "", "width": 1440, "height": 900}'
  where id = '11111111-1111-4111-8111-111111111111';
