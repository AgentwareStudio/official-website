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

-- The trilingual post with a full body (headings, lists, a quote, code, a table and a figure) and a cover,
-- so local pages show every element the blog styles.
update blog.posts set title = '什么是 Agentware：从操作界面，到委托意图', summary = 'Agentware 是你交给它目标的软件：它在授权的边界内组织行动，并交付可以验证的结果。',
  body_html = '<p><strong>结论先说：</strong>Agentware 不是“更聪明的按钮”，而是一种新的分工方式——你交出目标、边界和验收标准，软件负责把行动组织起来，并交回可以验证的结果。</p>
<h2 id="from-buttons">从按钮到目标</h2>
<p>四十年来，软件只问你一个问题：<em>点哪个按钮？</em> 你需要知道打开哪个应用、按什么顺序操作、在哪一步检查结果。软件提供零散的能力，<a href="/zh/">把能力串成结果的始终是人</a>。</p>
<p>现在，软件开始回答另一个问题：<em>你想要什么结果？</em></p>
<h3 id="three-eras">三个时代</h3>
<ol><li><strong>工具时代</strong>：路径预先写好，人逐步操作。</li><li><strong>副驾时代</strong>：AI 加速单点任务，但人仍然要串起每一步。</li><li><strong>委托时代</strong>：人说明目标，系统在授权范围内组织行动。</li></ol>
<figure><picture><source type="image/jxl" srcset="https://s.ar8.top/img/picgo/20261028221833619.jxl"><img src="https://s.ar8.top/img/picgo/20261028221836613.webp" alt="Agentware Studio 官网首页" width="1440" height="900" loading="lazy" decoding="async"></picture><figcaption>官网首页：从操作界面，到委托意图。</figcaption></figure>
<h2 id="what-you-hand-over">你交出去的是什么</h2>
<p>委托不是把控制权扔出去。一份好的委托至少包含三样东西：</p>
<ul><li><strong>目标</strong>：要的结果，而不是步骤。</li><li><strong>边界</strong>：能读什么、能改什么、什么时候必须停下来问你。</li><li><strong>验收标准</strong>：怎样算完成，结果怎样被检查。</li></ul>
<blockquote><p>软件的价值不在于提供了多少功能，而在于交付了什么结果。</p></blockquote>
<p>用代码表达，大概是这样。注意 <code>bounds.write</code> 是空的：这次委托只允许读，不允许改任何东西。</p>
<pre data-lang="ts"><code><span class="tok-k">const</span> task = <span class="tok-k">await</span> agent.<span class="tok-f">delegate</span>({
  goal: <span class="tok-s">''把上周的发布变更整理成报告''</span>,
  bounds: { read: [<span class="tok-s">''repo''</span>, <span class="tok-s">''tickets''</span>], write: [] },
  done: <span class="tok-s">''每一条变更都附上来源链接''</span>,
});</code></pre>
<h2 id="compare">和传统软件的区别</h2>
<table><thead><tr><th>维度</th><th>传统软件</th><th>Agentware</th></tr></thead><tbody><tr><td>输入</td><td>点击与表单</td><td>目标、边界、验收标准</td></tr><tr><td>路径</td><td>预先写死</td><td>执行中组织、遇阻改道</td></tr><tr><td>结果</td><td>人来拼接</td><td>交付可验证的结果</td></tr></tbody></table>
<h2 id="next">接下来</h2>
<p>下一篇会讲执行循环：系统怎样在边界内计划、行动、检查，并在超出授权时停下来。</p>
<hr>
<p class="note">本文是 Agentware 系列的第一篇。</p>',
  tags = '{Agentware,入门}',
  cover = '{"jxl":"https://s.ar8.top/img/picgo/20261028221833619.jxl","webp":"https://s.ar8.top/img/picgo/20261028221836613.webp","width":1440,"height":900,"alt":""}'
  where id = '11111111-1111-4111-8111-111111111111' and lang = 'zh';
update blog.posts set title = 'What is Agentware: from interface to intent', summary = 'Agentware is software you entrust with a goal: it organizes actions within authorized bounds and delivers verifiable results.',
  body_html = '<p><strong>The short version:</strong> Agentware is not a smarter button. It is a new division of labour: you hand over a goal, bounds and a definition of done; the software organizes the actions and hands back a result you can verify.</p>
<h2 id="from-buttons">From buttons to goals</h2>
<p>For forty years software asked you one question: <em>which button?</em> You had to know which app to open, what order to work in, where to check the result. Software offered scattered capabilities; <a href="/">a person always stitched them into a result</a>.</p>
<p>Now software starts answering a different question: <em>what outcome do you want?</em></p>
<h3 id="three-eras">Three eras</h3>
<ol><li><strong>Tools</strong>: the path is written in advance; people operate step by step.</li><li><strong>Copilots</strong>: AI speeds up single tasks, but people still chain every step.</li><li><strong>Delegation</strong>: people state the goal; the system organizes actions within authorized bounds.</li></ol>
<figure><picture><source type="image/jxl" srcset="https://s.ar8.top/img/picgo/20261028221833619.jxl"><img src="https://s.ar8.top/img/picgo/20261028221836613.webp" alt="Agentware Studio home page" width="1440" height="900" loading="lazy" decoding="async"></picture><figcaption>The home page: from interface to intent.</figcaption></figure>
<h2 id="what-you-hand-over">What you hand over</h2>
<p>Delegating is not giving up control. A good delegation carries at least three things:</p>
<ul><li><strong>A goal</strong>: the outcome, not the steps.</li><li><strong>Bounds</strong>: what it may read, what it may change, when it must stop and ask.</li><li><strong>A definition of done</strong>: what finished means and how the result is checked.</li></ul>
<blockquote><p>Software is valued not for the features it offers but for the results it delivers.</p></blockquote>
<p>In code it looks roughly like this. Note that <code>bounds.write</code> is empty: this delegation may read, never change.</p>
<pre data-lang="ts"><code><span class="tok-k">const</span> task = <span class="tok-k">await</span> agent.<span class="tok-f">delegate</span>({
  goal: <span class="tok-s">''把上周的发布变更整理成报告''</span>,
  bounds: { read: [<span class="tok-s">''repo''</span>, <span class="tok-s">''tickets''</span>], write: [] },
  done: <span class="tok-s">''每一条变更都附上来源链接''</span>,
});</code></pre>
<h2 id="compare">How it differs</h2>
<table><thead><tr><th>Dimension</th><th>Traditional software</th><th>Agentware</th></tr></thead><tbody><tr><td>Input</td><td>Clicks and forms</td><td>Goal, bounds, definition of done</td></tr><tr><td>Path</td><td>Fixed in advance</td><td>Organized while running, rerouted when blocked</td></tr><tr><td>Result</td><td>Stitched by people</td><td>Delivered and verifiable</td></tr></tbody></table>
<h2 id="next">Next</h2>
<p>The next post covers the execution loop: how the system plans, acts and checks within its bounds, and stops when it would go beyond them.</p>
<hr>
<p class="note">This is the first post in the Agentware series.</p>',
  tags = '{Agentware,Intro}',
  cover = '{"jxl":"https://s.ar8.top/img/picgo/20261028221833619.jxl","webp":"https://s.ar8.top/img/picgo/20261028221836613.webp","width":1440,"height":900,"alt":""}'
  where id = '11111111-1111-4111-8111-111111111111' and lang = 'en';
update blog.posts set title = 'Agentware とは：操作から委任へ', summary = 'Agentware は目標を任せるソフトウェアです。許可された範囲で行動を組み立て、検証できる結果を届けます。',
  body_html = '<p><strong>結論から：</strong>Agentware は「賢いボタン」ではなく、新しい分業のかたちです。目標・範囲・完了の基準を渡すと、ソフトウェアが行動を組み立て、検証できる結果を返します。</p>
<h2 id="from-buttons">ボタンから目標へ</h2>
<p>40 年のあいだ、ソフトウェアが尋ねてきたのは一つだけでした。<em>どのボタンを押しますか？</em></p>
<p>いま、ソフトウェアは別の問いに答え始めています。<em>どんな結果がほしいですか？</em></p>
<figure><picture><source type="image/jxl" srcset="https://s.ar8.top/img/picgo/20261028221833619.jxl"><img src="https://s.ar8.top/img/picgo/20261028221836613.webp" alt="Agentware Studio のホームページ" width="1440" height="900" loading="lazy" decoding="async"></picture><figcaption>ホームページ：操作から委任へ。</figcaption></figure>
<h2 id="what-you-hand-over">渡すもの</h2>
<ul><li><strong>目標</strong>：手順ではなく、ほしい結果。</li><li><strong>範囲</strong>：読めるもの、変えてよいもの、止まって確認すべきとき。</li><li><strong>完了の基準</strong>：何をもって終わりとし、どう確かめるか。</li></ul>
<blockquote><p>ソフトウェアの価値は、機能の数ではなく、届けた結果にあります。</p></blockquote>
<pre data-lang="ts"><code><span class="tok-k">const</span> task = <span class="tok-k">await</span> agent.<span class="tok-f">delegate</span>({
  goal: <span class="tok-s">''把上周的发布变更整理成报告''</span>,
  bounds: { read: [<span class="tok-s">''repo''</span>, <span class="tok-s">''tickets''</span>], write: [] },
  done: <span class="tok-s">''每一条变更都附上来源链接''</span>,
});</code></pre>
<h2 id="next">次回</h2>
<p>次は実行ループについて書きます。</p>',
  tags = '{Agentware,入門}',
  cover = '{"jxl":"https://s.ar8.top/img/picgo/20261028221833619.jxl","webp":"https://s.ar8.top/img/picgo/20261028221836613.webp","width":1440,"height":900,"alt":""}'
  where id = '11111111-1111-4111-8111-111111111111' and lang = 'ja';
