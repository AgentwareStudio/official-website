// Sample posts for local development and design prototypes (BLOG_SOURCE=sample). Production reads Supabase.
import type { BlogLang, Post } from './types';

const IMG = {
  jxl: 'https://s.ar8.top/img/picgo/20261028221833619.jxl',
  webp: 'https://s.ar8.top/img/picgo/20261028221836613.webp',
  width: 1440,
  height: 900,
};
const figure = (alt: string, caption: string) =>
  `<figure><picture><source type="image/jxl" srcset="${IMG.jxl}"><img src="${IMG.webp}" alt="${alt}" width="${IMG.width}" height="${IMG.height}" loading="lazy" decoding="async"></picture><figcaption>${caption}</figcaption></figure>`;

const code = `<pre data-lang="ts"><code><span class="tok-k">const</span> task = <span class="tok-k">await</span> agent.<span class="tok-f">delegate</span>({
  goal: <span class="tok-s">'把上周的发布变更整理成报告'</span>,
  bounds: { read: [<span class="tok-s">'repo'</span>, <span class="tok-s">'tickets'</span>], write: [] },
  done: <span class="tok-s">'每一条变更都附上来源链接'</span>,
});</code></pre>`;

const ZH_BODY = `<p><strong>结论先说：</strong>Agentware 不是“更聪明的按钮”，而是一种新的分工方式——你交出目标、边界和验收标准，软件负责把行动组织起来，并交回可以验证的结果。</p>
<h2 id="from-buttons">从按钮到目标</h2>
<p>四十年来，软件只问你一个问题：<em>点哪个按钮？</em> 你需要知道打开哪个应用、按什么顺序操作、在哪一步检查结果。软件提供零散的能力，<a href="/zh/">把能力串成结果的始终是人</a>。</p>
<p>现在，软件开始回答另一个问题：<em>你想要什么结果？</em></p>
<h3 id="three-eras">三个时代</h3>
<ol><li><strong>工具时代</strong>：路径预先写好，人逐步操作。</li><li><strong>副驾时代</strong>：AI 加速单点任务，但人仍然要串起每一步。</li><li><strong>委托时代</strong>：人说明目标，系统在授权范围内组织行动。</li></ol>
${figure('Agentware Studio 官网首页', '官网首页：从操作界面，到委托意图。')}
<h2 id="what-you-hand-over">你交出去的是什么</h2>
<p>委托不是把控制权扔出去。一份好的委托至少包含三样东西：</p>
<ul><li><strong>目标</strong>：要的结果，而不是步骤。</li><li><strong>边界</strong>：能读什么、能改什么、什么时候必须停下来问你。</li><li><strong>验收标准</strong>：怎样算完成，结果怎样被检查。</li></ul>
<blockquote><p>软件的价值不在于提供了多少功能，而在于交付了什么结果。</p></blockquote>
<p>用代码表达，大概是这样。注意 <code>bounds.write</code> 是空的：这次委托只允许读，不允许改任何东西。</p>
${code}
<h2 id="compare">和传统软件的区别</h2>
<table><thead><tr><th>维度</th><th>传统软件</th><th>Agentware</th></tr></thead><tbody><tr><td>输入</td><td>点击与表单</td><td>目标、边界、验收标准</td></tr><tr><td>路径</td><td>预先写死</td><td>执行中组织、遇阻改道</td></tr><tr><td>结果</td><td>人来拼接</td><td>交付可验证的结果</td></tr></tbody></table>
<h2 id="next">接下来</h2>
<p>下一篇会讲执行循环：系统怎样在边界内计划、行动、检查，并在超出授权时停下来。</p>
<hr>
<p class="note">本文是 Agentware 系列的第一篇。</p>`;

const EN_BODY = `<p><strong>The short version:</strong> Agentware is not a smarter button. It is a new division of labour: you hand over a goal, bounds and a definition of done; the software organizes the actions and hands back a result you can verify.</p>
<h2 id="from-buttons">From buttons to goals</h2>
<p>For forty years software asked you one question: <em>which button?</em> You had to know which app to open, what order to work in, where to check the result. Software offered scattered capabilities; <a href="/">a person always stitched them into a result</a>.</p>
<p>Now software starts answering a different question: <em>what outcome do you want?</em></p>
<h3 id="three-eras">Three eras</h3>
<ol><li><strong>Tools</strong>: the path is written in advance; people operate step by step.</li><li><strong>Copilots</strong>: AI speeds up single tasks, but people still chain every step.</li><li><strong>Delegation</strong>: people state the goal; the system organizes actions within authorized bounds.</li></ol>
${figure('Agentware Studio home page', 'The home page: from interface to intent.')}
<h2 id="what-you-hand-over">What you hand over</h2>
<p>Delegating is not giving up control. A good delegation carries at least three things:</p>
<ul><li><strong>A goal</strong>: the outcome, not the steps.</li><li><strong>Bounds</strong>: what it may read, what it may change, when it must stop and ask.</li><li><strong>A definition of done</strong>: what finished means and how the result is checked.</li></ul>
<blockquote><p>Software is valued not for the features it offers but for the results it delivers.</p></blockquote>
<p>In code it looks roughly like this. Note that <code>bounds.write</code> is empty: this delegation may read, never change.</p>
${code}
<h2 id="compare">How it differs</h2>
<table><thead><tr><th>Dimension</th><th>Traditional software</th><th>Agentware</th></tr></thead><tbody><tr><td>Input</td><td>Clicks and forms</td><td>Goal, bounds, definition of done</td></tr><tr><td>Path</td><td>Fixed in advance</td><td>Organized while running, rerouted when blocked</td></tr><tr><td>Result</td><td>Stitched by people</td><td>Delivered and verifiable</td></tr></tbody></table>
<h2 id="next">Next</h2>
<p>The next post covers the execution loop: how the system plans, acts and checks within its bounds, and stops when it would go beyond them.</p>
<hr>
<p class="note">This is the first post in the Agentware series.</p>`;

const JA_BODY = `<p><strong>結論から：</strong>Agentware は「賢いボタン」ではなく、新しい分業のかたちです。目標・範囲・完了の基準を渡すと、ソフトウェアが行動を組み立て、検証できる結果を返します。</p>
<h2 id="from-buttons">ボタンから目標へ</h2>
<p>40 年のあいだ、ソフトウェアが尋ねてきたのは一つだけでした。<em>どのボタンを押しますか？</em></p>
<p>いま、ソフトウェアは別の問いに答え始めています。<em>どんな結果がほしいですか？</em></p>
${figure('Agentware Studio のホームページ', 'ホームページ：操作から委任へ。')}
<h2 id="what-you-hand-over">渡すもの</h2>
<ul><li><strong>目標</strong>：手順ではなく、ほしい結果。</li><li><strong>範囲</strong>：読めるもの、変えてよいもの、止まって確認すべきとき。</li><li><strong>完了の基準</strong>：何をもって終わりとし、どう確かめるか。</li></ul>
<blockquote><p>ソフトウェアの価値は、機能の数ではなく、届けた結果にあります。</p></blockquote>
${code}
<h2 id="next">次回</h2>
<p>次は実行ループについて書きます。</p>`;

const LOOP = (h: [string, string, string, string], p: [string, string, string, string, string]) => `<p>${p[0]}</p>
<h2 id="plan">${h[0]}</h2>
<p>${p[1]}</p>
<h2 id="act">${h[1]}</h2>
<p>${p[2]}</p>
<pre data-lang="log"><code>01  plan     <span class="tok-s">collect release notes</span>  → 3 steps
02  act      read repo@main            <span class="tok-k">ok</span>
03  check    every change has a link   <span class="tok-k">ok</span>
04  deliver  report.md                 <span class="tok-f">verified</span></code></pre>
<h2 id="check">${h[2]}</h2>
<p>${p[3]}</p>
<blockquote><p>${h[3]}</p></blockquote>
<p>${p[4]}</p>`;

const ZH_LOOP = LOOP(['计划', '行动', '检查', '停下来问你，也是交付的一部分。'], [
  '执行循环是 Agentware 的心跳：计划、行动、检查，然后决定继续、改道还是停下。',
  '系统先把目标拆成可以检查的步骤，并标出每一步需要的权限。计划不是一次写死的路径，而是随时可以修订的草稿。',
  '每一步行动都在授权边界内进行。读到的资料、调用的接口、产生的中间结果，都会写进执行记录，方便事后追溯。',
  '检查对照的是你给出的验收标准，而不是系统自己的感觉。检查不通过就回到计划；触及边界就停下来，把选择交还给你。',
  '下一篇讲四大支柱，看看这个循环靠什么撑起来。',
]);
const EN_LOOP = LOOP(['Plan', 'Act', 'Check', 'Stopping to ask is part of delivering.'], [
  'The execution loop is the heartbeat of Agentware: plan, act, check, then continue, reroute or stop.',
  'The system first breaks the goal into steps that can be checked, and marks the permissions each step needs. The plan is a draft that can be revised at any time, not a path fixed in advance.',
  'Every action happens within the authorized bounds. What it reads, which interfaces it calls and every intermediate result go into the run log, so the work can be traced afterwards.',
  'Checks are made against your definition of done, not against the system’s own impression. A failed check goes back to planning; reaching a bound stops the run and hands the choice back to you.',
  'The next post covers the four pillars that hold this loop up.',
]);
const JA_LOOP = LOOP(['計画', '実行', '確認', '立ち止まって尋ねることも、受け渡しの一部です。'], [
  '実行ループは Agentware の心拍です。計画し、実行し、確認し、続けるか、迂回するか、止まるかを決めます。',
  'まず目標を確認できるステップに分け、それぞれに必要な権限を示します。計画は固定された道筋ではなく、いつでも直せる下書きです。',
  'すべての行動は許可された範囲の中で行われます。読んだ資料、呼び出したインターフェース、途中の結果は実行記録に残り、あとから追跡できます。',
  '確認の基準は、あなたが渡した完了の基準です。確認に通らなければ計画に戻り、範囲の端に触れたら止まって、判断をあなたに返します。',
  '次回は、このループを支える 4 つの柱について書きます。',
]);

const COVER = { ...IMG, alt: '' };
const t = (s: string) => new Date(s);
const MAIN_ID = '11111111-1111-4111-8111-111111111111';
const LOOP_ID = '22222222-2222-4222-8222-222222222222';
const short = (lang: BlogLang, id: string, slug: string, title: string, summary: string, date: string, tags: string[]): Post => ({
  id, lang, slug, title, summary, body_md: summary, body_html: `<p>${summary}</p>`, cover: null, tags, publish_at: t(date), updated_at: t(date),
});

export const SAMPLE_POSTS: Post[] = [
  { id: MAIN_ID, lang: 'zh', slug: 'what-is-agentware', title: '什么是 Agentware：从操作界面，到委托意图',
    summary: 'Agentware 是你交给它目标的软件：它在授权的边界内组织行动，并交付可以验证的结果。',
    body_md: '', body_html: ZH_BODY, cover: COVER, tags: ['Agentware', '入门'], publish_at: t('2026-10-20T01:00:00Z'), updated_at: t('2026-10-26T03:00:00Z') },
  { id: MAIN_ID, lang: 'en', slug: 'what-is-agentware', title: 'What is Agentware: from interface to intent',
    summary: 'Agentware is software you entrust with a goal: it organizes actions within authorized bounds and delivers verifiable results.',
    body_md: '', body_html: EN_BODY, cover: COVER, tags: ['Agentware', 'Intro'], publish_at: t('2026-10-20T01:00:00Z'), updated_at: t('2026-10-26T03:00:00Z') },
  { id: MAIN_ID, lang: 'ja', slug: 'what-is-agentware', title: 'Agentware とは：操作から委任へ',
    summary: 'Agentware は目標を任せるソフトウェアです。許可された範囲で行動を組み立て、検証できる結果を届けます。',
    body_md: '', body_html: JA_BODY, cover: COVER, tags: ['Agentware', '入門'], publish_at: t('2026-10-20T01:00:00Z'), updated_at: t('2026-10-20T01:00:00Z') },
  { ...short('zh', LOOP_ID, 'execution-loop', '执行循环：计划、行动、检查', '系统怎样在授权边界内计划、行动、检查，并在超出边界时停下来问你。', '2026-10-12T01:00:00Z', ['架构']), body_html: ZH_LOOP },
  { ...short('en', LOOP_ID, 'execution-loop', 'The execution loop: plan, act, check', 'How the system plans, acts and checks within its bounds, and stops to ask when it would go beyond them.', '2026-10-12T01:00:00Z', ['Architecture']), body_html: EN_LOOP },
  { ...short('ja', LOOP_ID, 'execution-loop', '実行ループ：計画、実行、確認', '許可された範囲の中で計画・実行・確認し、範囲を超えそうなときは止まって尋ねる仕組み。', '2026-10-12T01:00:00Z', ['アーキテクチャ']), body_html: JA_LOOP },
  short('zh', '33333333-3333-4333-8333-333333333333', 'four-pillars', 'Agentware 的四大支柱', '意图与委托、计划与执行、治理与护栏、持续演进的记忆。', '2026-10-02T01:00:00Z', ['架构']),
  short('en', '33333333-3333-4333-8333-333333333333', 'four-pillars', 'The four pillars of Agentware', 'Intent and delegation, planning and execution, governance and guardrails, evolving memory.', '2026-10-02T01:00:00Z', ['Architecture']),
  short('ja', '33333333-3333-4333-8333-333333333333', 'four-pillars', 'Agentware の 4 つの柱', '意図と委任、計画と実行、ガバナンスとガードレール、進化する記憶。', '2026-10-02T01:00:00Z', ['アーキテクチャ']),
  short('zh', '44444444-4444-4444-8444-444444444444', 'why-we-teach', '为什么我们做公开课', 'We teach what we build：把做产品时踩过的坑整理成课程。', '2026-09-18T01:00:00Z', ['公开课']),
  short('zh', '55555555-5555-4555-8555-555555555555', 'studio-2025', 'Studio 2025：一年的交付记录', '这一年我们做了什么、放弃了什么，以及为什么把“可验证的结果”当作唯一的标准。', '2025-12-28T01:00:00Z', ['Studio']),
  short('en', '55555555-5555-4555-8555-555555555555', 'studio-2025', 'Studio 2025: a year of deliveries', 'What we built this year, what we dropped, and why a verifiable result became our only standard.', '2025-12-28T01:00:00Z', ['Studio']),
  short('ja', '55555555-5555-4555-8555-555555555555', 'studio-2025', 'Studio 2025：一年の受け渡し記録', '今年つくったもの、やめたもの、そして「検証できる結果」を唯一の基準にした理由。', '2025-12-28T01:00:00Z', ['Studio']),
];
