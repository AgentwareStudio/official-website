// All site copy. Source: 04_官网文案定稿_Website_Copy.md (v3.1), part 1 (01–07) + stage A (08–09).
// Headings use "|" between phrases (line may wrap there) and "\n" for a forced line break.

export const LINKS = {
  github: 'https://github.com/AgentwareStudio',
  x: 'https://x.com/AgentwareStudio',
  youtube: 'https://www.youtube.com/@agentwarestudio',
  // all courses live under this one site (the first: /ai-gacha/), so the official site links to its root only
  learn: 'https://learn.agentware.studio',
};

export const hero = {
  // hero lead, as on the gemini version
  intro: 'Agentware 是为 Agent 时代设计的一类软件。你交给它目标，它在授权的边界内组织行动、执行任务，并交付可以验证的结果。',
  eyebrow: '01 // INTENT',
  en: ['From Interface', 'to Intent'],
  zh: '从操作界面，|到委托意图',
  tagEn: 'Agentware — Software that acts on intent.',
  tagZh: '按意图行动的软件。',
  btnWord: '按钮',
  questions: [
    { when: '过去四十年，', who: '软件只问你一个问题：', q: '点击哪个按钮？' },
    { when: '现在，', who: '软件开始回答另一个问题：', q: '你想要什么结果？' },
  ],
  lead:
    'Agentware 是为智能体时代而生的软件范式。你不再逐步操作界面，而是向软件下达委托——说明目标、划定边界、定义完成标准；系统在授权范围内理解上下文、自主组织行动、适应变化，并交付可验证的结果。',
};

export const shift = {
  eyebrow: '02 // THE SHIFT',
  title: ['过去，|人操作软件', '现在，|人委托软件'],
  intro: [
    '几十年来，软件围绕“功能（Features）”构建。软件提供按钮与表单，人类充当唯一的调度中枢——你得知道打开哪个应用、点哪个按钮、填哪张表、按什么顺序做。软件提供零散的能力，人负责把能力串成结果。',
    'Agent 改变了这层关系，重写了人机之间的分工契约：',
  ],
  eras: [
    {
      no: '01',
      ver: '1.0',
      era: '工具时代',
      en: 'Software as Functions',
      zh: '软件即功能',
      motto: 'Humans Operate',
      body: '路径预先写好。人逐步点击操作，软件被动响应。',
      role: 'OPERATOR',
    },
    {
      no: '02',
      ver: '2.0',
      era: '副驾时代',
      en: 'Software as Copilots',
      zh: '软件即辅助',
      motto: 'Humans Prompt',
      body: 'AI 加速了单点任务（写字、画图、写代码），但人依然要把每一步串起来。',
      role: 'PROMPTER',
    },
    {
      no: '03',
      ver: '3.0',
      era: '委托时代',
      en: 'Software as Delegation',
      zh: '软件即委托',
      motto: 'Humans Delegate',
      body: '人托付目标与约束；软件理解任务、自主规划、执行动作、观察反馈并动态调整，直到交付结果。',
      role: 'DELEGATOR',
    },
  ],
  closing: ['这场转变，不是给所有软件加上 AI，', '而是重写软件本身。'],
};

export const notAgentware = {
  eyebrow: '03 // WHAT AGENTWARE IS NOT',
  title: '加了 AI，|不等于 Agentware',
  lead: '区别不在于是否调用了大模型，也不在于有没有聊天窗口，而在于软件底层的运行方式。',
  items: [
    {
      name: 'AI Feature',
      body: '摘要、翻译、搜索、自动补全，只是传统软件里的一项 AI 功能。效率提高了，但工作依然由人自己操作完成。',
    },
    {
      name: 'Chatbot Wrapper',
      body: '给传统软件加一个聊天侧边栏，或者把模型 API 套一层壳，底层仍然是等待人类逐步点击的旧软件。',
    },
    {
      name: 'Rigid Workflow',
      body: 'A → B → C → D 的固定连线是传统自动化。一旦现实情况偏离预设就会卡死的流程，不具备根据上下文和反馈自适应的能力。',
    },
    {
      name: 'Ungoverned Agent',
      body: '在黑盒里盲目循环、成本失控、结果无法验证的野生 Agent，只是实验玩具，不是真正可用的软件。',
    },
  ],
};

export const architecture = {
  eyebrow: '04 // ARCHITECTURE & RUNTIME',
  titleEn: ['Deterministic Core', 'Agentic Control Plane'],
  titleZh: '确定性内核，|智能体控制平面',
  body: 'Agentware 不取代确定性代码，而是接管最高层的控制逻辑。底层依然是严谨的数据库、API 与业务规则；顶层则从“预先写死操作路径”，变成“在运行时围绕目标组织行动”。',
  table: {
    head: ['维度', '传统软件', 'Agentware 系统'],
    headEn: ['', 'Traditional Software', 'Agentware System'],
    rows: [
      ['人的角色', '操作者（Operator）', '委托人（Delegator）'],
      ['设计单位', '功能（Feature）', '委托（Delegation）'],
      ['执行路径', '预先写死|Input → Function → Output', '运行时动态生成|Intent → Plan → Act → Adapt → Verify'],
      ['系统状态', '单次会话、每次归零', '持续沉淀的长期记忆'],
      ['核心价值', '提供可用功能', '交付可验证结果'],
      ['控制方式', '隐含在菜单与权限里', '显式治理、可审计、可随时介入'],
    ],
  },
};

export const loop = {
  eyebrow: '05 // THE EXECUTION LOOP',
  title: '路径在运行时生成，|结果在交付前验证',
  principle: ['目标可以委托，路径可以自适应；', '权限必须明确，结果必须可验，过程必须可治理。'],
  steps: [
    { en: 'Intent', zh: '理解委托', text: '明确想要什么结果、在什么边界内行动，以及怎样才算完成。', code: 'goal · constraints · acceptance' },
    { en: 'Context', zh: '获取上下文', text: '从当前环境和持续沉淀的记忆中，获取与目标相关的事实和经验。', code: 'context · memory · evidence' },
    { en: 'Plan', zh: '规划行动', text: '围绕目标与当前状态组织行动，在运行时生成执行路径。', code: 'state → next action' },
    { en: 'Act', zh: '调用工具执行', text: '在明确授权内调用 API、MCP、浏览器与数据库，让行动作用于真实系统。', code: 'tools · APIs · deterministic core' },
    { en: 'Observe', zh: '观察反馈', text: '读取行动产生的结果和环境变化，检查实际状态与预期的差异。', code: 'action → feedback → state' },
    { en: 'Adapt', zh: '动态调整', text: '根据新信息修正计划。触及权限或风险边界时，将决定权交还人类。', code: 'replan · adapt · escalate' },
    { en: 'Verify', zh: '验证结果', text: '根据委托时定义的验收标准核对结果，保留可追溯的依据。', code: 'acceptance criteria → evidence' },
    { en: 'Deliver', zh: '交付结果', text: '交付可验证的结果；若目标无法在授权范围内完成，清晰说明并交还人类。', code: 'verified outcome / human handoff' },
  ],
  handback: { en: 'Hand back', zh: '交还人类', text: '超出授权边界：系统停止行动，说明原因与已完成的部分，把决定权交还给人。', code: 'out of scope → human decision' },
};

export const pillars = {
  eyebrow: '06 // THE FOUR PILLARS',
  titleEn: ['The Four', 'Pillars'],
  titleZh: '四大支柱',
  lead: '要让软件真正能够接受委托，必须构建在四个核心要素之上：',
  items: [
    {
      code: '01 / DELEGATION',
      en: 'Intent & Delegation',
      zh: '意图与委托',
      lead: '软件的基本单位，从功能变成委托。',
      body: '传统软件从“做什么功能”开始设计；Agentware 从“要把什么结果交给系统”开始设计。一份清晰的委托只定义四件事：想要什么结果、在什么边界内做、怎样算合格、何时交还给人。',
      points: [] as string[][],
    },
    {
      code: '02 / EXECUTION',
      en: 'Planning & Execution',
      zh: '规划与执行',
      lead: '不只给出答案，而是把事情做完。',
      body: '不再要求人类事先写出每一步。系统根据目标和当前状态决定下一步，通过真实工具（API、MCP、命令行、浏览器、数据库、软件系统）作用于现实世界，并在“规划 → 行动 → 观察 → 调整”的闭环中推进。',
      points: [] as string[][],
    },
    {
      code: '03 / GOVERNANCE',
      en: 'Governance & Guardrails',
      zh: '治理与边界',
      lead: '自主越多，治理越重要。',
      body: 'Agentware 不是无限自主的 Agent，而是在明确授权边界内拥有执行能力的软件。治理与执行同等重要——每一次委托都必须清楚：它被允许做什么、实际做了什么、消耗了多少成本、谁可以随时叫停、出错时如何安全退回。',
      points: [] as string[][],
    },
    {
      code: '04 / MEMORY',
      en: 'Evolving Memory',
      zh: '持续演化的记忆',
      lead: '记忆，让软件从一次性工具变成持续演化的系统。',
      body: '没有记忆的软件，每次使用都从零开始；传统的检索（RAG）也只是被动的资料查找。Agentware 的记忆系统不仅用于回答问题，更直接参与规划、决策与行动：',
      points: [
        ['双通道沉淀', '同时保留具体任务的来龙去脉（经历记忆）与抽象的认知规则（语义记忆）。'],
        ['整合与修正', '将知识拆解为最小可理解单位，随新信息自动去重、合并、修正与提炼。'],
        ['可溯源验证', '每一条提炼后的记忆都能追回原始出处，可审计、可信任。'],
      ],
    },
  ],
};

export const future = {
  eyebrow: '06 // THE FUTURE',
  title: '未来的个人与组织，|都将构建在|Agentware 之上',
  people: '强大的个体，不再只是熟练操作几十款软件的人，而是懂得明确意图、定义边界，将工作委托给 Agentware 系统的人。',
  orgs: '强大的组织，也不再只是购买大量软件席位的组织，而是能围绕自身场景沉淀智能体、知识、记忆、工作流与治理体系的组织。',
  shiftLine: '软件形态正在发生代际更替：',
  past: { label: '过去', sub: '围绕应用与表单', words: ['App', 'Form', 'Menu', 'Database', 'Fixed Workflow'] },
  next: { label: '未来', sub: '围绕意图与委托', words: ['Intent', 'Memory', 'Planning', 'Tools', 'Governance', 'Verifiable Delivery'] },
};

export const manifesto = {
  eyebrow: '07 // THE AGENTWARE MANIFESTO',
  intro: '软件曾经是等待被操作的工具。它提供功能，人负责学会它、组织它、为结果负责。现在，软件第一次可以被委托工作。这不是给旧软件加上 AI，而是重新定义：Agent 时代的软件应该是什么。',
  items: <[string, string[], string, string][]>[
    ['I', ['Software should understand intent, not just input'], '软件应该理解意图，而不只是接收输入', '过去，人必须把自己的目标翻译成一连串点击和表单。现在，人说出想要什么、不接受什么，软件负责理解。'],
    ['II', ['Software should execute goals, not just expose functions'], '软件应该完成目标，而不只是暴露功能', '功能再多，把它们串成结果的仍然是人。软件的价值不在于提供了多少功能，而在于交付了什么结果。'],
    ['III', ['Paths may adapt', 'Outcomes must remain verifiable'], '路径可以变化，结果必须可以验证', '现实不会按预设的流程发生，执行路径必须随环境和反馈而变。路径越自由，目标和验收标准就越要明确。'],
    ['IV', ['Autonomy requires governance'], '自主需要治理', '我们不追求无限自主的系统。每一份委托都必须权责明确、过程可查，并始终为人保留介入、回滚与接管的权力。'],
    ['V', ['Memory turns software from a tool into an evolving system'], '记忆让软件从工具变成持续演化的系统', '一次性的执行器每次都从零开始。能记住上下文、沉淀经验、修正自己的软件，会随着使用越来越懂人、懂组织。'],
    ['VI', ['The future unit of software is not the feature', 'It is the delegation'], '未来软件的基本单位不是功能，而是委托', '过去，设计软件是问“这里放什么功能”。现在，设计软件是问“要把什么结果交给它”。写清目标、边界和验收标准，剩下的由系统完成。'],
  ],
};

export const studio = {
  eyebrow: '08 // AGENTWARE STUDIO',
  title: '探索软件新范式，|普及 AI 工程认知，\n构建下一代实用工具',
  sub: 'Agentware Studio 是围绕 Agentware 范式发起的独立研究与创作实验室。在软件从“操作界面”迈向“委托意图”的转折点上，我们致力于通过深度研究、开放课程与产品实验，推动这一范式的普及与演进：',
  items: [
    {
      tag: '01 // OPEN CURRICULUM',
      title: 'AI 公开课',
      body: '好的技术课，自己就该是一件扎实的作品。由一线研发团队编撰制作，用定制可视化动画、网页互动实验与可运行的工程资产，帮你把 AI 真正变成手里的生产力。',
      action: '前往课程网站 ↗',
      href: LINKS.learn,
    },
    {
      tag: '02 // USER TOOLS',
      title: '面向用户的 AI 工具实验',
      body: '理念最终要由产品来验证。我们在 aikit.pro 持续设计与发布面向用户的 AI 工具与应用，探索“按意图行动的软件”在真实日常场景中的交互形态。',
    },
  ] as { tag: string; title: string; body: string; action?: string; href?: string }[],
  seasons: [
    { no: '第一季', zh: '原理篇', en: 'Fundamentals', body: '剥离炒作，从接龙原理、Token、幻觉、上下文窗口讲到 RAG、工具调用与 Agent，弄懂“什么时候能信 AI，怎么把 AI 用进工作”。' },
    { no: '第二季', zh: '实战篇', en: 'AI Coding', body: '当代码变便宜、判断变贵，学习如何为 AI 编写项目说明书、如何先出方案再动代码、如何把个人经验沉淀为可复用的技能（Skills）。' },
    { no: '第三季', zh: '搭建篇', en: 'Building AI Systems', body: '面向真实场景，从上下文工程、工作流编排（n8n / Dify）、MCP 服务开发，到多智能体协作、安全治理与评测上线，亲手把一项业务搭成系统。' },
  ],
};

export const join = {
  eyebrow: '09 // JOIN',
  en: ['Join the shift', 'from interface', 'to intent'],
  zh: '与我们一起，从操作界面走向委托意图。',
  actions: [
    { zh: '观看 AI 公开课', en: 'Start Learning', href: '/learn/' },
  ],
};

export const footer = {
  entity: 'Independent Research & Creation Studio',
  entityZh: '独立研究与创作实验室',
  signature: '[ A↗• ] AGENTWARE CONTROL PLANE INITIALIZED',
};

// /learn — the open curriculum. Lesson lists live on the course site (learn.agentware.studio), not here,
// so this page only names the course and its seasons and does not need updating when episodes change.
export const learn = {
  title: 'AI 公开课',
  en: 'Courses & Labs',
  motto: ['Built by engineers. Crafted to last.', '一线工程团队出品，只做经得起推敲的课。'],
  lead: '好的技术课，自己就该是一件扎实的作品。Agentware Studio 的课程全部由一线研发团队编撰制作——每一个原理都给得出可视化的直觉，每一处演示都标明真实的模型与版本，每一门课都配齐互动练习与可运行的工程资产，帮你把 AI 真正变成手里的生产力。',
  status: '01 号课程《AI 抽卡毕业课》连载中 · 更多工程专项课筹备中',
  course: {
    name: 'AI 抽卡毕业课',
    body: '用 AI 总像在抽卡？模型算不出好结果，多半是交给它的输入没给对。三季课程从大模型的工作机制讲起，到用 AI 写代码，再到亲手把一项业务搭成系统。每集配有网页互动小游戏，以及只根据课程资料回答并标出处的 AI 问答助手。',
    langs: '课程语言',
  },
  // specs: price, episodes and audience, under the season name ('' hides the line)
  seasons: [
    { id: 'ai-fundamentals', no: '第一季', zh: '原理篇', en: 'Fundamentals', specs: '免费 · 14 集动画（含预告）· 零代码基础',
      body: '用一张桌子和一台抽卡机，把大模型的工作机制画出来：它怎么一块字牌一块字牌地接龙、为什么聊久了会变笨、怎么给它参考书和工具、什么时候能信它。每集 5–8 分钟，看完就能改掉一个日常用 AI 的坏习惯。' },
    { id: 'ai-coding', no: '第二季', zh: '实战篇', en: 'AI Coding', specs: '免费 · 7 集 · 面向写代码的人',
      body: '代码变便宜了，判断它写得对不对反而更难了。以 VS Code（GitHub Copilot）和 Claude Code 为例，讲清楚它在项目里看得见哪些文件、怎么写项目说明书（AGENTS.md / CLAUDE.md）、怎么让它先出方案再改代码，以及怎么把团队常做的活写成技能（Skills）和自动检查规则。' },
    { id: 'building-ai-systems', no: '第三季', zh: '搭建篇', en: 'Building AI Systems', specs: '进阶课 · 17 集跟做实操 · 面向业务骨干与工程师',
      body: '围绕一家企业的六项真实需求（周报汇总、来信分拣、规定问答、内部工具服务、多代理调研、跨公司对接），手把手带你画方案、设计上下文、用 n8n / Dify 或代码搭出成品，再做完红队安全测试、出货率评测和 ROI 测算，交付一套能真正上线验收的系统。' },
  ] as { id: string; no: string; zh: string; en: string; specs: string; body: string }[],
  cta: '每门课都配有互动实验与 AI 助教，|现在就可以上手试',
};

// Interface strings (zh-CN). Other locales overwrite these from src/i18n/locales/<locale>.json.
export const ui = {
  skip: '跳到正文', home: 'Agentware Studio 首页', mainNav: '主导航', menuOpen: '打开菜单', menuClose: '关闭菜单',
  follow: '关注', language: '语言',
  nav: { paradigm: '范式', architecture: '架构', manifesto: '宣言', studio: 'Studio', learn: '公开课', blog: '博客' },
  heroCta: '认识 Agentware', heroCta2: '阅读宣言', questionsAria: '软件的两个问题',
  markAria: 'AGENTWARE 标志：方括号代表授权边界，上升的路径代表可以调整的执行路径，终点的圆点代表必须可验证的结果。点击或按回车重新播放标志动画，上下方向键改变路径。',
  markAriaLight: 'AGENTWARE 标志',
  erasAria: '三个时代', eraOf: '第 {n} 个时代，共 3 个', compareAria: '传统软件与 Agentware 系统对比', dimension: '维度', pillarsAria: '四大支柱',
  stage: {
    human: '人', outcome: '结果', manual: '人工拼接', verified: '可验证的结果',
    n1: '人逐步点击操作', n1done: '结果由人亲手拼接', n2ai: 'AI 加速了单点任务', n2manual: '人亲自完成这一步', n2done: '仍由人把每一步串起来',
    intent: '目标·边界·验收标准', blocked: '受阻，改道', verify: '验证', boundary: '授权边界',
    aria: [
      '1.0 工具时代示意：人用光标逐个点开四个功能窗口，再亲手把结果拼起来。',
      '2.0 副驾时代示意：其中两个功能由 AI 加速完成，但每一次提示都从人出发、再回到人，仍由人把各步串起来。',
      '3.0 委托时代示意：人只交出一次意图；在授权边界内，系统规划路径、遇到阻塞后改道、验证结果，最后交付可验证的结果。',
    ],
  },
  loop: {
    local: '运行时闭环', running: '执行中', delivered: '已交付', handback: '已交还人类', idle: '待命',
    aria: '运行时闭环：理解委托、获取上下文，在授权边界内循环规划、执行、观察、调整，然后验证结果，交付或交还人类。底部是确定性内核：记忆、数据库、接口与业务规则。',
    boundary: '授权边界', handbackLabel: '超出边界时交还人类', core: '确定性内核', blocks: ['记忆', '数据库', '接口', '业务规则'],
    human: '委托人', outcome: '交付', outcomeDone: '可验证的结果',
    inspect: '查看第 {n} 步：{name}', traceAria: '执行记录', traceEmpty: '等待一次委托。',
    inside: '授权范围内', touched: '触及边界', out: '超出 · 已交还',
    run: '运行一次委托', rerun: '再运行一次委托', simulate: '模拟超出边界', hint: '运行结束后，可以点按图中的任一步骤查看说明。',
    logs: {
      intent: '收到委托：目标、边界与验收标准已明确', context: '读取当前环境与相关记忆', plan1: '生成执行路径 → 下一步：查询数据',
      act1: '调用工具：读取数据库', observe1: '观察反馈：结果与预期有偏差', adapt: '修正计划：改用另一条路径', plan2: '重新规划 → 下一步：调用接口',
      act2ok: '调用工具：API · MCP（在授权范围内）', observe2ok: '观察反馈：状态符合预期', verifyOk: '对照验收标准核验：通过，依据已留存',
      deliver: '交付可验证的结果', act2warn: '请求的操作超出授权边界，未执行', observe2warn: '观察反馈：目标无法在授权内完成',
      verifyFail: '验收未通过：需要人的决定', handback: '停止行动，说明原因与已完成部分，交还人类',
    },
  },
  learn: { seasonsAria: '三季课程', actions: ['进入课程网站', '订阅 YouTube 频道'] },
  nf: { title: '这个地址没有页面', lead: '链接可能已经改变。可以回到首页，或直接打开公开课。', actions: ['回到首页', 'AI 公开课'] },
};
