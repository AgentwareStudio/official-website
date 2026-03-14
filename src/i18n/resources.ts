export const supportedLanguages = [
  { code: 'en', nativeLabel: 'English', shortLabel: 'EN' },
  { code: 'zh-CN', nativeLabel: '简体中文', shortLabel: '简' },
  { code: 'ja', nativeLabel: '日本語', shortLabel: 'JA' },
  { code: 'es', nativeLabel: 'Español', shortLabel: 'ES' },
  { code: 'de', nativeLabel: 'Deutsch', shortLabel: 'DE' },
  { code: 'fr', nativeLabel: 'Français', shortLabel: 'FR' },
  { code: 'pt-BR', nativeLabel: 'Português (Brasil)', shortLabel: 'PT' },
  { code: 'ko', nativeLabel: '한국어', shortLabel: 'KO' },
] as const;

export type SupportedLanguageCode = (typeof supportedLanguages)[number]['code'];

const resources = {
  en: {
    translation: {
      meta: {
        title: 'Agentware Studio',
        description: 'Defining the next software paradigm.',
      },
      nav: {
        definition: 'Definition',
        why: 'Why',
        principles: 'Principles',
        vision: 'Vision',
        language: 'Language',
      },
      hero: {
        badge: 'Defining the next software paradigm',
        title: 'Agentware',
        subtitle: 'From interface-driven software to agentic execution.',
        body:
          'Agentware is a class of software systems built around agentic execution, where software operates through intent, constraints, memory, planning, tool use, feedback, and governance rather than direct step-by-step human operation.',
        primaryCta: 'Read the definition',
        secondaryCta: 'View GitHub',
      },
      definition: {
        label: 'Definition',
        body:
          'Agentware is a class of software systems built around agentic execution, where the core operational model is intent interpretation, constraint handling, structured memory, planning, tool use, feedback loops, and governance for reliable outcome delivery.',
        formulaLabel: 'Working Formula',
        formulaLead: 'Agentware',
        formulaBody:
          'Intent + Constraints + Memory + Planning + Tools + Execution + Feedback + Governance',
        formulaNote:
          'Not software that merely executes commands, but software that interprets goals, plans strategy, executes through tools, and continuously adapts under governance.',
      },
      why: {
        label: 'Why Agentware',
        title: 'Traditional software is built around interfaces. Agentware is built around outcomes.',
        description:
          'The prior era optimized for interface navigation and feature interaction under manual operation. The new paradigm optimizes for objectives, constraints, memory, strategy, execution, feedback, and governance, so systems can deliver outcomes within controlled boundaries.',
        items: [
          {
            title: 'From Interface-Centric to Goal-Centric',
            body: 'Traditional software optimizes screens and controls. Agentware optimizes objective interpretation and outcome delivery.',
          },
          {
            title: 'From Manual Steps to Agentic Execution',
            body: 'Traditional systems depend on direct user operation. Agentware accepts objectives and acts within controlled autonomy.',
          },
          {
            title: 'From Features to Outcomes',
            body: 'Traditional software provides functional access. Agentware is evaluated by whether outcomes are actually delivered.',
          },
          {
            title: 'From Fixed Flows to Dynamic Planning',
            body: 'Traditional logic is often predefined. Agentware plans, re-plans, and coordinates execution as conditions change.',
          },
          {
            title: 'From Shallow State to Structured Memory',
            body: 'Traditional state is often session-bound. Agentware maintains durable memory for long-horizon operation.',
          },
          {
            title: 'From Implicit Controls to Explicit Governance',
            body: 'Traditional software emphasizes permissions. Agentware adds policy, auditability, and intervention as first-class controls.',
          },
        ],
      },
      principles: {
        label: 'Principles',
        title: 'The architectural principles of Agentware.',
        description:
          'Agentware is not merely AI-enabled software. It is software deliberately architected for memory, planning, execution, and governance. These principles define what separates an agentic system from a conventional application with an LLM attached.',
        items: [
          {
            title: 'Intent-Driven',
            body: 'Agentware starts from intent and objectives as primary inputs rather than direct step-by-step user operation.',
          },
          {
            title: 'Constraint-Bounded',
            body: 'Execution is shaped by explicit constraints, policy boundaries, and safety conditions, not unconstrained automation.',
          },
          {
            title: 'Memory-Native',
            body: 'It maintains structured, persistent context across tasks, environments, decisions, and prior actions.',
          },
          {
            title: 'Planning-Capable',
            body: 'It transforms goals into executable strategies, subplans, and decision points across time.',
          },
          {
            title: 'Tool-Using',
            body: 'It acts through APIs, browsers, scripts, services, and digital systems to produce operational effects.',
          },
          {
            title: 'Feedback-Driven',
            body: 'It monitors outcomes, detects deviation, and adapts behavior through continuous feedback loops.',
          },
          {
            title: 'Governable',
            body: 'Autonomy is governed through policy, auditability, and intervention controls.',
          },
        ],
      },
      formalization: {
        label: 'Formalization',
        title: 'A formal definition for a new class of systems.',
        formalLabel: 'Formal Definition',
        formalBody:
          'Agentware is a class of software systems architected for agentic execution: a software paradigm in which objectives, constraints, structured memory, planning, tool invocation, feedback loops, and governance form the core operational model of the system. Unlike traditional software centered on interfaces and explicit user commands, Agentware is designed to interpret goals, generate strategies, act across digital environments, and deliver outcomes within controlled boundaries.',
        plainLabel: 'Plain-English Meaning',
        plainBody:
          'Traditional software gives people functions to operate. Agentware lets people hand objectives to systems that can plan, act, adapt, and deliver results under governance.',
      },
      comparison: {
        label: 'Comparison',
        title: 'Agentware vs. traditional software.',
        dimension: 'Dimension',
        traditional: 'Traditional Software',
        agentware: 'Agentware',
        rows: [
          {
            dimension: 'Core Orientation',
            traditional: 'Interface and feature-centric',
            agentware: 'Goal, constraint, and outcome-centric',
          },
          {
            dimension: 'Operation Model',
            traditional: 'Direct step-by-step human operation',
            agentware: 'Agentic execution within controlled autonomy',
          },
          {
            dimension: 'Workflow Model',
            traditional: 'Fixed workflows and predefined sequences',
            agentware: 'Dynamic planning, tool invocation, and adaptation',
          },
          {
            dimension: 'System State',
            traditional: 'Session-bound or shallow state',
            agentware: 'Persistent, structured memory',
          },
          {
            dimension: 'Value Delivery',
            traditional: 'Feature access',
            agentware: 'Outcome delivery',
          },
          {
            dimension: 'Governance',
            traditional: 'Limited or implicit controls',
            agentware: 'Explicit governance, auditability, and intervention',
          },
        ],
      },
      vision: {
        label: 'Vision',
        title: 'Future products built on the Agentware paradigm.',
        description:
          'Agentware is a software paradigm that can take form across personal cognition, education, operations, research, and Multi-Agent infrastructure. As a consequence, these systems can deliver value to individuals, organizations, and other software systems.',
        items: [
          {
            title: 'Personal Intelligence Systems',
            body: 'Software that understands a user over time, builds working memory, and acts as an operational layer for thinking, planning, and decision support.',
          },
          {
            title: 'Agent-Native Browsers',
            body: 'Execution environments where agents navigate, inspect, act, and coordinate across the web as an operational layer for human and organizational outcomes.',
          },
          {
            title: 'AI Tutors and Cognitive Systems',
            body: 'Long-horizon learning systems that adapt curriculum, pacing, practice, and media generation around a persistent model of the learner.',
          },
          {
            title: 'Multi-Agent Workflows',
            body: 'Coordinated systems in which specialized agents share memory, negotiate responsibilities, and complete complex operational tasks together.',
          },
        ],
        domainsLabel: 'Example Domains',
        domains: [
          'Personal intelligence systems',
          'Agent-native browsers and operating systems',
          'AI tutors with memory and curriculum adaptation',
          'Autonomous research and knowledge workflows',
          'Business operations and decision-support agents',
          'Developer toolchains for multi-agent execution',
        ],
        positioningLabel: 'Positioning Statement',
        positioningBody:
          'Agentware is the operational medium through which intent, constraints, memory, planning, tools, execution, feedback, and governance become executable, governable, and scalable outcomes.',
      },
      cta: {
        label: 'Get Involved',
        title: 'Building the foundations of Agentware.',
        body:
          'Agentware Studio is an early effort to define, systematize, and build the conceptual and practical foundations of agent-native software.',
        github: 'Follow on GitHub',
        x: 'Follow on X',
      },
      footer: {
        title: 'Agentware Studio',
        tagline: 'Defining the next software paradigm.',
        github: 'GitHub',
        x: 'X (Twitter)',
        youtube: 'YouTube',
      },
    },
  },
  'zh-CN': {
    translation: {
      meta: {
        title: 'Agentware Studio',
        description: '定义下一代软件范式。',
      },
      nav: {
        definition: '定义',
        why: '为什么是 Agentware',
        principles: '原则',
        vision: '愿景',
        language: '语言',
      },
      hero: {
        badge: '定义下一代软件范式',
        title: 'Agentware',
        subtitle: '从界面驱动的软件，迈向 Agentic Execution。',
        body:
          'Agentware 是一类围绕 Agentic Execution 构建的软件系统。在这种系统中，软件不再依赖人类逐步操作，而是通过意图、约束、记忆、规划、工具使用、反馈与治理来运行。',
        primaryCta: '阅读定义',
        secondaryCta: '查看 GitHub',
      },
      definition: {
        label: '定义',
        body:
          'Agentware 是一类以 Agentic Execution 为核心的软件系统，其核心运行模型由意图理解、约束处理、结构化记忆、规划、工具使用、反馈闭环与治理共同构成，从而实现可靠的结果交付。',
        formulaLabel: '工作公式',
        formulaLead: 'Agentware',
        formulaBody: '意图 + 约束 + 记忆 + 规划 + 工具 + 执行 + 反馈 + 治理',
        formulaNote:
          '它不是只会执行命令的软件，而是能够理解目标、制定策略、借助工具执行，并在治理之下持续适应的软件。',
      },
      why: {
        label: '为什么是 Agentware',
        title: '传统软件围绕界面构建，Agentware 围绕结果构建。',
        description:
          '上一代软件优化的是界面导航与功能交互，并默认人类持续手动操作。新的范式优化的是目标、约束、记忆、策略、执行、反馈与治理，使系统能够在可控边界内交付结果。',
        items: [
          {
            title: '从界面中心到目标中心',
            body: '传统软件优化的是页面与控件。Agentware 优化的是对目标的理解以及结果的达成。',
          },
          {
            title: '从手动步骤到 Agentic Execution',
            body: '传统系统依赖用户逐步操作。Agentware 接收目标，并在受控自治中采取行动。',
          },
          {
            title: '从功能提供到结果交付',
            body: '传统软件提供功能访问。Agentware 的价值标准是结果是否真正被交付。',
          },
          {
            title: '从固定流程到动态规划',
            body: '传统逻辑通常预先写死。Agentware 会随着条件变化进行规划、重规划与协同执行。',
          },
          {
            title: '从浅层状态到结构化记忆',
            body: '传统状态往往局限于会话。Agentware 维护可持续的记忆，以支持长周期运行。',
          },
          {
            title: '从隐式控制到显式治理',
            body: '传统软件强调权限。Agentware 进一步把策略、可审计性与人工干预作为一等控制能力。',
          },
        ],
      },
      principles: {
        label: '原则',
        title: 'Agentware 的软件架构原则。',
        description:
          'Agentware 并不只是“加了 AI 的软件”。它是为记忆、规划、执行与治理而刻意设计的软件。这些原则定义了真正的 Agentic System 与仅仅挂了一个 LLM 的传统应用之间的差别。',
        items: [
          {
            title: '意图驱动',
            body: 'Agentware 以意图和目标作为首要输入，而不是依赖用户逐步发出显式操作。',
          },
          {
            title: '受约束边界约束',
            body: '系统执行由明确的约束、策略边界和安全条件塑造，而不是无限制的自动化。',
          },
          {
            title: '记忆原生',
            body: '它在任务、环境、决策与历史动作之间维持结构化、持久化的上下文。',
          },
          {
            title: '具备规划能力',
            body: '它能够把目标转化为可执行策略、子计划以及跨时间的决策节点。',
          },
          {
            title: '工具使用原生',
            body: '它通过 API、浏览器、脚本、服务和各类数字系统来产生真实的操作效果。',
          },
          {
            title: '反馈驱动',
            body: '它会监测结果、发现偏差，并通过持续反馈循环调整行为。',
          },
          {
            title: '可治理',
            body: '自治能力通过策略、可审计性与干预控制来被治理。',
          },
        ],
      },
      formalization: {
        label: '形式化',
        title: '为一类新系统建立形式化定义。',
        formalLabel: '正式定义',
        formalBody:
          'Agentware 是一类为 Agentic Execution 而架构的软件系统。这是一种软件范式：目标、约束、结构化记忆、规划、工具调用、反馈闭环与治理，共同构成系统的核心运行模型。不同于围绕界面和显式用户命令构建的传统软件，Agentware 被设计为能够理解目标、生成策略、跨数字环境行动，并在受控边界内交付结果。',
        plainLabel: '通俗解释',
        plainBody:
          '传统软件给人提供可操作的功能；Agentware 让人把目标交给系统，由系统在治理之下完成规划、行动、适应与结果交付。',
      },
      comparison: {
        label: '对比',
        title: 'Agentware 与传统软件。',
        dimension: '维度',
        traditional: '传统软件',
        agentware: 'Agentware',
        rows: [
          {
            dimension: '核心导向',
            traditional: '以界面和功能为中心',
            agentware: '以目标、约束与结果为中心',
          },
          {
            dimension: '运行模式',
            traditional: '人类逐步直接操作',
            agentware: '在受控自治中的 Agentic Execution',
          },
          {
            dimension: '工作流模型',
            traditional: '固定流程与预定义顺序',
            agentware: '动态规划、工具调用与自适应',
          },
          {
            dimension: '系统状态',
            traditional: '会话型或浅层状态',
            agentware: '持久化的结构化记忆',
          },
          {
            dimension: '价值交付',
            traditional: '功能访问',
            agentware: '结果交付',
          },
          {
            dimension: '治理机制',
            traditional: '有限或隐式的控制',
            agentware: '显式治理、可审计性与干预',
          },
        ],
      },
      vision: {
        label: '愿景',
        title: '基于 Agentware 范式构建的未来产品。',
        description:
          'Agentware 是一种软件范式，可体现于个人认知、教育、运营、研究以及 Multi-Agent 基础设施之中。因此，这类系统能够为个人、组织以及其他软件系统创造价值。',
        items: [
          {
            title: '个人智能系统',
            body: '这种软件能够长期理解用户、建立工作记忆，并成为思考、规划与决策支持的操作层。',
          },
          {
            title: 'Agent-native 浏览器',
            body: '在这样的执行环境中，Agent 可以在 Web 上导航、检查、行动与协同，作为人和组织结果交付的操作层。',
          },
          {
            title: 'AI 导师与认知系统',
            body: '这类长周期学习系统会围绕对学习者的持续建模，自适应地调整课程、节奏、练习与内容生成。',
          },
          {
            title: 'Multi-Agent 工作流',
            body: '在这类协同系统中，专门化 Agent 共享记忆、协商职责，并共同完成复杂的运营任务。',
          },
        ],
        domainsLabel: '示例领域',
        domains: [
          '个人智能系统',
          'Agent-native 浏览器与 operating systems',
          '具备记忆与课程自适应的 AI 导师',
          '自主研究与知识工作流',
          '业务运营与决策支持 Agent',
          '面向 Multi-Agent 执行的开发者工具链',
        ],
        positioningLabel: '定位陈述',
        positioningBody:
          'Agentware 是一种操作媒介，通过它，意图、约束、记忆、规划、工具、执行、反馈与治理被转化为可执行、可治理、可规模化的结果。',
      },
      cta: {
        label: '参与进来',
        title: '构建 Agentware 的基础。',
        body:
          'Agentware Studio 正在尝试定义、系统化并构建 Agent-native 软件在概念与实践层面的基础。',
        github: '关注 GitHub',
        x: '关注 X',
      },
      footer: {
        title: 'Agentware Studio',
        tagline: '定义下一代软件范式。',
        github: 'GitHub',
        x: 'X（Twitter）',
        youtube: 'YouTube',
      },
    },
  },
  ja: {
    translation: {
      meta: {
        title: 'Agentware Studio',
        description: '次世代ソフトウェアのパラダイムを定義する。',
      },
      nav: {
        definition: '定義',
        why: 'なぜ Agentware か',
        principles: '原則',
        vision: 'ビジョン',
        language: '言語',
      },
      hero: {
        badge: '次世代ソフトウェアのパラダイムを定義する',
        title: 'Agentware',
        subtitle: 'インターフェース駆動のソフトウェアから、Agentic Execution へ。',
        body:
          'Agentware とは、Agentic Execution を中心に構築されたソフトウェアシステムの総称です。そこではソフトウェアは人間の逐次操作に依存するのではなく、意図、制約、記憶、計画、ツール利用、フィードバック、ガバナンスを通じて動作します。',
        primaryCta: '定義を読む',
        secondaryCta: 'GitHub を見る',
      },
      definition: {
        label: '定義',
        body:
          'Agentware とは、Agentic Execution を中核に据えたソフトウェアシステムの一類型であり、その中核的な運用モデルは、意図の解釈、制約処理、構造化記憶、計画、ツール利用、フィードバックループ、ガバナンスによって構成され、信頼できる成果の提供を実現します。',
        formulaLabel: '動作式',
        formulaLead: 'Agentware',
        formulaBody: '意図 + 制約 + 記憶 + 計画 + ツール + 実行 + フィードバック + ガバナンス',
        formulaNote:
          '単にコマンドを実行するソフトウェアではなく、目標を解釈し、戦略を立て、ツールを通じて実行し、ガバナンスのもとで継続的に適応するソフトウェアです。',
      },
      why: {
        label: 'なぜ Agentware か',
        title: '従来のソフトウェアはインターフェース中心。Agentware は成果中心。',
        description:
          'これまでの時代は、手動操作を前提に画面遷移や機能操作を最適化してきました。新しいパラダイムは、目標、制約、記憶、戦略、実行、フィードバック、ガバナンスを最適化し、制御された境界の中で成果を届けます。',
        items: [
          {
            title: 'インターフェース中心から目標中心へ',
            body: '従来のソフトウェアは画面や操作系を最適化します。Agentware は目標解釈と成果提供を最適化します。',
          },
          {
            title: '手作業の手順から Agentic Execution へ',
            body: '従来のシステムは人間の逐次操作に依存します。Agentware は目標を受け取り、制御された自律性の中で行動します。',
          },
          {
            title: '機能提供から成果提供へ',
            body: '従来のソフトウェアは機能へのアクセスを提供します。Agentware は実際に成果を届けられるかで評価されます。',
          },
          {
            title: '固定フローから動的計画へ',
            body: '従来のロジックは事前定義されがちです。Agentware は状況変化に応じて計画し直し、実行を調整します。',
          },
          {
            title: '浅い状態から構造化記憶へ',
            body: '従来の状態はセッションに閉じがちです。Agentware は長期運用のための持続的な記憶を保ちます。',
          },
          {
            title: '暗黙の制御から明示的なガバナンスへ',
            body: '従来のソフトウェアは権限を重視します。Agentware はそこにポリシー、監査可能性、介入を第一級の制御として加えます。',
          },
        ],
      },
      principles: {
        label: '原則',
        title: 'Agentware のアーキテクチャ原則。',
        description:
          'Agentware は単に AI を載せたソフトウェアではありません。記憶、計画、実行、ガバナンスのために意図的に設計されたソフトウェアです。これらの原則が、真の Agentic System と LLM を付け足しただけの従来アプリを分けます。',
        items: [
          {
            title: '意図駆動',
            body: 'Agentware は、ユーザーの逐次操作ではなく、意図と目標を主要な入力として扱います。',
          },
          {
            title: '制約境界内での実行',
            body: '実行は無制限な自動化ではなく、明示的な制約、ポリシー境界、安全条件によって形作られます。',
          },
          {
            title: '記憶ネイティブ',
            body: 'タスク、環境、判断、過去の行動をまたいで、構造化された永続コンテキストを維持します。',
          },
          {
            title: '計画可能',
            body: '目標を実行可能な戦略、サブプラン、時間軸上の意思決定点へと変換します。',
          },
          {
            title: 'ツールを使って実行できる',
            body: 'API、ブラウザ、スクリプト、サービス、各種デジタルシステムを通じて実際の運用効果を生み出します。',
          },
          {
            title: 'フィードバック駆動',
            body: '結果を監視し、逸脱を検知し、継続的なフィードバックループを通じて振る舞いを調整します。',
          },
          {
            title: '統治可能',
            body: '自律性はポリシー、監査可能性、介入制御によって統治されます。',
          },
        ],
      },
      formalization: {
        label: '形式化',
        title: '新しいシステム類型のための形式的定義。',
        formalLabel: '形式的定義',
        formalBody:
          'Agentware とは、Agentic Execution のために設計されたソフトウェアシステムの一類型です。目標、制約、構造化記憶、計画、ツール呼び出し、フィードバックループ、ガバナンスが、システムの中核運用モデルを構成します。インターフェースや明示的なユーザー命令を中心とする従来ソフトウェアとは異なり、Agentware は目標を解釈し、戦略を生成し、デジタル環境をまたいで行動し、制御された境界内で成果を届けるよう設計されています。',
        plainLabel: '平易な意味',
        plainBody:
          '従来のソフトウェアは人に機能を与えます。Agentware は人が目標をシステムに渡し、そのシステムがガバナンスのもとで計画し、行動し、適応し、結果を届けます。',
      },
      comparison: {
        label: '比較',
        title: 'Agentware と従来ソフトウェア。',
        dimension: '観点',
        traditional: '従来ソフトウェア',
        agentware: 'Agentware',
        rows: [
          {
            dimension: '中核指向',
            traditional: 'インターフェースと機能中心',
            agentware: '目標、制約、成果中心',
          },
          {
            dimension: '運用モデル',
            traditional: '人間による逐次的な直接操作',
            agentware: '制御された自律性の中での Agentic Execution',
          },
          {
            dimension: 'ワークフローモデル',
            traditional: '固定ワークフローと事前定義シーケンス',
            agentware: '動的計画、ツール呼び出し、適応',
          },
          {
            dimension: 'システム状態',
            traditional: 'セッション依存または浅い状態',
            agentware: '永続的で構造化された記憶',
          },
          {
            dimension: '価値提供',
            traditional: '機能アクセス',
            agentware: '成果提供',
          },
          {
            dimension: 'ガバナンス',
            traditional: '限定的または暗黙的な制御',
            agentware: '明示的なガバナンス、監査可能性、介入',
          },
        ],
      },
      vision: {
        label: 'ビジョン',
        title: 'Agentware パラダイム上に築かれる未来のプロダクト。',
        description:
          'Agentware は、個人認知、教育、オペレーション、研究、Multi-Agent 基盤にまたがって現れうるソフトウェアパラダイムです。その結果、個人、組織、他のソフトウェアシステムに価値を届けられます。',
        items: [
          {
            title: '個人知能システム',
            body: '時間をかけてユーザーを理解し、作業記憶を築き、思考・計画・意思決定支援の運用レイヤーとして機能するソフトウェアです。',
          },
          {
            title: 'Agent-native ブラウザ',
            body: 'Agent が Web 上を移動し、観察し、行動し、協調できる実行環境であり、人や組織の成果達成を支える運用レイヤーです。',
          },
          {
            title: 'AI チューターと認知システム',
            body: '学習者の持続的なモデルに基づき、カリキュラム、進度、練習、メディア生成を長期的に適応させる学習システムです。',
          },
          {
            title: 'Multi-Agent ワークフロー',
            body: '専門化された Agent が記憶を共有し、役割を調整しながら、複雑な運用タスクを共同で完遂する協調システムです。',
          },
        ],
        domainsLabel: '想定ドメイン',
        domains: [
          '個人知能システム',
          'Agent-native ブラウザと operating systems',
          '記憶とカリキュラム適応を備えた AI チューター',
          '自律的なリサーチと知識ワークフロー',
          '業務運用と意思決定支援 Agent',
          'Multi-Agent 実行のための開発者ツールチェーン',
        ],
        positioningLabel: 'ポジショニング',
        positioningBody:
          'Agentware は、意図、制約、記憶、計画、ツール、実行、フィードバック、ガバナンスを、実行可能で、統治可能で、スケール可能な成果へと変える運用媒体です。',
      },
      cta: {
        label: '参加する',
        title: 'Agentware の基盤をつくる。',
        body:
          'Agentware Studio は、Agent-native ソフトウェアの概念的・実践的基盤を定義し、体系化し、実装するための初期的な取り組みです。',
        github: 'GitHub をフォロー',
        x: 'X をフォロー',
      },
      footer: {
        title: 'Agentware Studio',
        tagline: '次世代ソフトウェアのパラダイムを定義する。',
        github: 'GitHub',
        x: 'X',
        youtube: 'YouTube',
      },
    },
  },
  es: {
    translation: {
      meta: {
        title: 'Agentware Studio',
        description: 'Definiendo el próximo paradigma del software.',
      },
      nav: {
        definition: 'Definición',
        why: 'Por qué Agentware',
        principles: 'Principios',
        vision: 'Visión',
        language: 'Idioma',
      },
      hero: {
        badge: 'Definiendo el próximo paradigma del software',
        title: 'Agentware',
        subtitle: 'Del software guiado por interfaces a Agentic Execution.',
        body:
          'Agentware es una clase de sistemas de software construidos en torno a Agentic Execution, donde el software opera mediante intención, restricciones, memoria, planificación, uso de herramientas, retroalimentación y gobernanza, en lugar de depender de una operación humana paso a paso.',
        primaryCta: 'Leer la definición',
        secondaryCta: 'Ver GitHub',
      },
      definition: {
        label: 'Definición',
        body:
          'Agentware es una clase de sistemas de software construidos en torno a Agentic Execution, cuyo modelo operativo central está compuesto por interpretación de intención, manejo de restricciones, memoria estructurada, planificación, uso de herramientas, bucles de retroalimentación y gobernanza para entregar resultados confiables.',
        formulaLabel: 'Fórmula operativa',
        formulaLead: 'Agentware',
        formulaBody: 'Intención + Restricciones + Memoria + Planificación + Herramientas + Ejecución + Retroalimentación + Gobernanza',
        formulaNote:
          'No es software que solo ejecuta comandos, sino software que interpreta objetivos, diseña estrategia, ejecuta mediante herramientas y se adapta continuamente bajo gobernanza.',
      },
      why: {
        label: 'Por qué Agentware',
        title: 'El software tradicional se construye alrededor de interfaces. Agentware se construye alrededor de resultados.',
        description:
          'La era anterior optimizó la navegación por interfaces y la interacción con funciones bajo operación manual. El nuevo paradigma optimiza objetivos, restricciones, memoria, estrategia, ejecución, retroalimentación y gobernanza, para que los sistemas entreguen resultados dentro de límites controlados.',
        items: [
          {
            title: 'De lo centrado en la interfaz a lo centrado en el objetivo',
            body: 'El software tradicional optimiza pantallas y controles. Agentware optimiza la interpretación del objetivo y la entrega de resultados.',
          },
          {
            title: 'De pasos manuales a Agentic Execution',
            body: 'Los sistemas tradicionales dependen de la operación directa del usuario. Agentware recibe objetivos y actúa dentro de una autonomía controlada.',
          },
          {
            title: 'De funciones a resultados',
            body: 'El software tradicional ofrece acceso funcional. Agentware se evalúa por si realmente entrega resultados.',
          },
          {
            title: 'De flujos fijos a planificación dinámica',
            body: 'La lógica tradicional suele estar predefinida. Agentware planifica, replantea y coordina la ejecución conforme cambian las condiciones.',
          },
          {
            title: 'De estado superficial a memoria estructurada',
            body: 'El estado tradicional suele quedar limitado a la sesión. Agentware mantiene memoria duradera para operar a largo plazo.',
          },
          {
            title: 'De controles implícitos a gobernanza explícita',
            body: 'El software tradicional enfatiza permisos. Agentware añade políticas, auditabilidad e intervención como controles de primer nivel.',
          },
        ],
      },
      principles: {
        label: 'Principios',
        title: 'Los principios arquitectónicos de Agentware.',
        description:
          'Agentware no es simplemente software con IA. Es software diseñado deliberadamente para memoria, planificación, ejecución y gobernanza. Estos principios definen lo que separa a un sistema agéntico de una aplicación convencional a la que solo se le añadió un LLM.',
        items: [
          {
            title: 'Guiado por intención',
            body: 'Agentware parte de la intención y los objetivos como entradas primarias, en lugar de depender de operación explícita paso a paso.',
          },
          {
            title: 'Delimitado por restricciones',
            body: 'La ejecución está moldeada por restricciones explícitas, límites de política y condiciones de seguridad, no por automatización sin control.',
          },
          {
            title: 'Nativo de memoria',
            body: 'Mantiene contexto estructurado y persistente entre tareas, entornos, decisiones y acciones previas.',
          },
          {
            title: 'Capaz de planificar',
            body: 'Transforma objetivos en estrategias ejecutables, subplanes y puntos de decisión a lo largo del tiempo.',
          },
          {
            title: 'Capaz de actuar mediante herramientas',
            body: 'Actúa mediante APIs, navegadores, scripts, servicios y sistemas digitales para producir efectos operativos.',
          },
          {
            title: 'Impulsado por retroalimentación',
            body: 'Supervisa resultados, detecta desviaciones y adapta su comportamiento a través de bucles continuos de retroalimentación.',
          },
          {
            title: 'Gobernable',
            body: 'La autonomía se gobierna mediante políticas, auditabilidad y controles de intervención.',
          },
        ],
      },
      formalization: {
        label: 'Formalización',
        title: 'Una definición formal para una nueva clase de sistemas.',
        formalLabel: 'Definición formal',
        formalBody:
          'Agentware es una clase de sistemas de software arquitectados para Agentic Execution: un paradigma de software en el que objetivos, restricciones, memoria estructurada, planificación, invocación de herramientas, bucles de retroalimentación y gobernanza forman el modelo operativo central del sistema. A diferencia del software tradicional centrado en interfaces y comandos explícitos del usuario, Agentware está diseñado para interpretar metas, generar estrategias, actuar a través de entornos digitales y entregar resultados dentro de límites controlados.',
        plainLabel: 'Significado en claro',
        plainBody:
          'El software tradicional da a las personas funciones para operar. Agentware permite entregar objetivos a sistemas que pueden planificar, actuar, adaptarse y producir resultados bajo gobernanza.',
      },
      comparison: {
        label: 'Comparación',
        title: 'Agentware frente al software tradicional.',
        dimension: 'Dimensión',
        traditional: 'Software tradicional',
        agentware: 'Agentware',
        rows: [
          {
            dimension: 'Orientación central',
            traditional: 'Centrado en la interfaz y las funciones',
            agentware: 'Centrado en objetivos, restricciones y resultados',
          },
          {
            dimension: 'Modelo operativo',
            traditional: 'Operación humana directa paso a paso',
            agentware: 'Agentic Execution dentro de una autonomía controlada',
          },
          {
            dimension: 'Modelo de flujo de trabajo',
            traditional: 'Flujos fijos y secuencias predefinidas',
            agentware: 'Planificación dinámica, invocación de herramientas y adaptación',
          },
          {
            dimension: 'Estado del sistema',
            traditional: 'Estado superficial o ligado a la sesión',
            agentware: 'Memoria persistente y estructurada',
          },
          {
            dimension: 'Entrega de valor',
            traditional: 'Acceso a funciones',
            agentware: 'Entrega de resultados',
          },
          {
            dimension: 'Gobernanza',
            traditional: 'Controles limitados o implícitos',
            agentware: 'Gobernanza explícita, auditabilidad e intervención',
          },
        ],
      },
      vision: {
        label: 'Visión',
        title: 'Productos futuros construidos sobre el paradigma Agentware.',
        description:
          'Agentware es un paradigma de software que puede manifestarse en cognición personal, educación, operaciones, investigación e infraestructura Multi-Agent. Como consecuencia, estos sistemas pueden entregar valor a individuos, organizaciones y otros sistemas de software.',
        items: [
          {
            title: 'Sistemas de inteligencia personal',
            body: 'Software que entiende al usuario con el tiempo, construye memoria de trabajo y actúa como una capa operativa para pensar, planificar y apoyar decisiones.',
          },
          {
            title: 'Navegadores nativos para agentes',
            body: 'Entornos de ejecución donde los agentes navegan, inspeccionan, actúan y coordinan en la web como una capa operativa para resultados humanos y organizacionales.',
          },
          {
            title: 'Tutores de IA y sistemas cognitivos',
            body: 'Sistemas de aprendizaje de largo horizonte que adaptan currículo, ritmo, práctica y generación de medios alrededor de un modelo persistente del aprendiz.',
          },
          {
            title: 'Flujos de trabajo multiagente',
            body: 'Sistemas coordinados en los que agentes especializados comparten memoria, negocian responsabilidades y completan juntos tareas operativas complejas.',
          },
        ],
        domainsLabel: 'Dominios de ejemplo',
        domains: [
          'Sistemas de inteligencia personal',
          'Navegadores Agent-native y sistemas operativos',
          'Tutores de IA con memoria y adaptación curricular',
          'Flujos autónomos de investigación y conocimiento',
          'Agentes para operaciones de negocio y apoyo a decisiones',
          'Toolchains para desarrolladores orientadas a ejecución multiagente',
        ],
        positioningLabel: 'Declaración de posicionamiento',
        positioningBody:
          'Agentware es el medio operativo a través del cual intención, restricciones, memoria, planificación, herramientas, ejecución, retroalimentación y gobernanza se convierten en resultados ejecutables, gobernables y escalables.',
      },
      cta: {
        label: 'Participa',
        title: 'Construyendo las bases de Agentware.',
        body:
          'Agentware Studio es un esfuerzo temprano por definir, sistematizar y construir los fundamentos conceptuales y prácticos del software nativo para agentes.',
        github: 'Seguir en GitHub',
        x: 'Seguir en X',
      },
      footer: {
        title: 'Agentware Studio',
        tagline: 'Definiendo el próximo paradigma del software.',
        github: 'GitHub',
        x: 'X',
        youtube: 'YouTube',
      },
    },
  },
  de: {
    translation: {
      meta: {
        title: 'Agentware Studio',
        description: 'Das nächste Paradigma von Software definieren.',
      },
      nav: {
        definition: 'Definition',
        why: 'Warum Agentware',
        principles: 'Prinzipien',
        vision: 'Vision',
        language: 'Sprache',
      },
      hero: {
        badge: 'Das nächste Paradigma von Software definieren',
        title: 'Agentware',
        subtitle: 'Von interface-getriebener Software zu Agentic Execution.',
        body:
          'Agentware ist eine Klasse von Softwaresystemen, die um Agentic Execution herum aufgebaut sind. Software arbeitet hier über Intention, Rahmenbedingungen, Gedächtnis, Planung, Werkzeugnutzung, Feedback und Governance statt über direkte menschliche Schritt-für-Schritt-Bedienung.',
        primaryCta: 'Definition lesen',
        secondaryCta: 'GitHub ansehen',
      },
      definition: {
        label: 'Definition',
        body:
          'Agentware ist eine Klasse von Softwaresystemen, die um Agentic Execution herum aufgebaut sind. Ihr zentrales Betriebsmodell besteht aus Intentionsinterpretation, Umgang mit Rahmenbedingungen, strukturiertem Gedächtnis, Planung, Werkzeugnutzung, Feedback-Schleifen und Governance, um verlässlich Ergebnisse zu liefern.',
        formulaLabel: 'Arbeitsformel',
        formulaLead: 'Agentware',
        formulaBody: 'Intention + Rahmenbedingungen + Gedächtnis + Planung + Werkzeuge + Ausführung + Feedback + Governance',
        formulaNote:
          'Keine Software, die bloß Befehle ausführt, sondern Software, die Ziele interpretiert, Strategien plant, über Werkzeuge handelt und sich unter Governance fortlaufend anpasst.',
      },
      why: {
        label: 'Warum Agentware',
        title: 'Traditionelle Software wird um Interfaces gebaut. Agentware wird um Ergebnisse gebaut.',
        description:
          'Die vorige Ära optimierte Interface-Navigation und Feature-Interaktion unter manueller Bedienung. Das neue Paradigma optimiert Ziele, Rahmenbedingungen, Gedächtnis, Strategie, Ausführung, Feedback und Governance, damit Systeme innerhalb kontrollierter Grenzen Ergebnisse liefern können.',
        items: [
          {
            title: 'Von Interface-Zentrierung zu Ziel-Zentrierung',
            body: 'Traditionelle Software optimiert Bildschirme und Bedienelemente. Agentware optimiert Zielinterpretation und Ergebnislieferung.',
          },
          {
            title: 'Von manuellen Schritten zu Agentic Execution',
            body: 'Traditionelle Systeme hängen von direkter Nutzerbedienung ab. Agentware nimmt Ziele entgegen und handelt innerhalb kontrollierter Autonomie.',
          },
          {
            title: 'Von Funktionen zu Ergebnissen',
            body: 'Traditionelle Software bietet Funktionszugang. Agentware wird daran gemessen, ob Ergebnisse tatsächlich geliefert werden.',
          },
          {
            title: 'Von festen Abläufen zu dynamischer Planung',
            body: 'Traditionelle Logik ist oft vordefiniert. Agentware plant, plant neu und koordiniert Ausführung, wenn sich Bedingungen ändern.',
          },
          {
            title: 'Von flachem Zustand zu strukturiertem Gedächtnis',
            body: 'Traditioneller Zustand ist oft an Sitzungen gebunden. Agentware hält dauerhaftes Gedächtnis für langfristigen Betrieb vor.',
          },
          {
            title: 'Von impliziter Kontrolle zu expliziter Governance',
            body: 'Traditionelle Software betont Berechtigungen. Agentware ergänzt Richtlinien, Auditierbarkeit und Eingriffsmöglichkeiten als erstklassige Kontrollen.',
          },
        ],
      },
      principles: {
        label: 'Prinzipien',
        title: 'Die Architekturprinzipien von Agentware.',
        description:
          'Agentware ist nicht bloß KI-aktivierte Software. Es ist Software, die gezielt für Gedächtnis, Planung, Ausführung und Governance entworfen wurde. Diese Prinzipien definieren, was ein Agentic System von einer konventionellen Anwendung mit angehängtem LLM unterscheidet.',
        items: [
          {
            title: 'Intentionsgetrieben',
            body: 'Agentware beginnt mit Intention und Zielen als primären Eingaben, statt direkte Schritt-für-Schritt-Bedienung vorauszusetzen.',
          },
          {
            title: 'Durch Rahmenbedingungen begrenzt',
            body: 'Ausführung wird von expliziten Rahmenbedingungen, Policy-Grenzen und Sicherheitsbedingungen geformt, nicht von ungebremster Automatisierung.',
          },
          {
            title: 'Gedächtnis-nativ',
            body: 'Es hält strukturierten, persistenten Kontext über Aufgaben, Umgebungen, Entscheidungen und frühere Aktionen hinweg aufrecht.',
          },
          {
            title: 'Planungsfähig',
            body: 'Es übersetzt Ziele in ausführbare Strategien, Teilpläne und Entscheidungspunkte über die Zeit.',
          },
          {
            title: 'Werkzeugnativ',
            body: 'Es handelt über APIs, Browser, Skripte, Dienste und digitale Systeme, um operative Wirkung zu erzeugen.',
          },
          {
            title: 'Feedback-gesteuert',
            body: 'Es überwacht Ergebnisse, erkennt Abweichungen und passt Verhalten über kontinuierliche Feedback-Schleifen an.',
          },
          {
            title: 'Governierbar',
            body: 'Autonomie wird durch Richtlinien, Auditierbarkeit und Eingriffskontrollen gesteuert.',
          },
        ],
      },
      formalization: {
        label: 'Formalisierung',
        title: 'Eine formale Definition für eine neue Systemklasse.',
        formalLabel: 'Formale Definition',
        formalBody:
          'Agentware ist eine Klasse von Softwaresystemen, die für Agentic Execution entworfen sind: ein Softwareparadigma, in dem Ziele, Rahmenbedingungen, strukturiertes Gedächtnis, Planung, Werkzeugaufrufe, Feedback-Schleifen und Governance das zentrale Betriebsmodell des Systems bilden. Anders als traditionelle Software, die auf Interfaces und explizite Nutzerbefehle ausgerichtet ist, ist Agentware darauf ausgelegt, Ziele zu interpretieren, Strategien zu erzeugen, über digitale Umgebungen hinweg zu handeln und Ergebnisse innerhalb kontrollierter Grenzen zu liefern.',
        plainLabel: 'Einfach erklärt',
        plainBody:
          'Traditionelle Software gibt Menschen Funktionen zur Bedienung. Agentware erlaubt Menschen, Ziele an Systeme zu übergeben, die unter Governance planen, handeln, sich anpassen und Ergebnisse liefern können.',
      },
      comparison: {
        label: 'Vergleich',
        title: 'Agentware vs. traditionelle Software.',
        dimension: 'Dimension',
        traditional: 'Traditionelle Software',
        agentware: 'Agentware',
        rows: [
          {
            dimension: 'Kernorientierung',
            traditional: 'Interface- und funktionszentriert',
            agentware: 'Ziel-, Rahmenbedingungs- und ergebniszentriert',
          },
          {
            dimension: 'Betriebsmodell',
            traditional: 'Direkte menschliche Schritt-für-Schritt-Bedienung',
            agentware: 'Agentische Ausführung innerhalb kontrollierter Autonomie',
          },
          {
            dimension: 'Workflow-Modell',
            traditional: 'Feste Workflows und vordefinierte Sequenzen',
            agentware: 'Dynamische Planung, Werkzeugaufrufe und Anpassung',
          },
          {
            dimension: 'Systemzustand',
            traditional: 'Sitzungsgebundener oder flacher Zustand',
            agentware: 'Persistentes, strukturiertes Gedächtnis',
          },
          {
            dimension: 'Wertbereitstellung',
            traditional: 'Funktionszugang',
            agentware: 'Ergebnisbereitstellung',
          },
          {
            dimension: 'Governance',
            traditional: 'Begrenzte oder implizite Kontrollen',
            agentware: 'Explizite Governance, Auditierbarkeit und Eingriff',
          },
        ],
      },
      vision: {
        label: 'Vision',
        title: 'Zukünftige Produkte auf Basis des Agentware-Paradigmas.',
        description:
          'Agentware ist ein Softwareparadigma, das sich in persönlicher Kognition, Bildung, Betrieb, Forschung und Multi-Agent-Infrastruktur manifestieren kann. Dadurch können diese Systeme Wert für Einzelpersonen, Organisationen und andere Softwaresysteme liefern.',
        items: [
          {
            title: 'Persönliche Intelligenzsysteme',
            body: 'Software, die einen Nutzer über die Zeit versteht, Arbeitsgedächtnis aufbaut und als operative Schicht für Denken, Planung und Entscheidungsunterstützung wirkt.',
          },
          {
            title: 'Agent-native Browser',
            body: 'Ausführungsumgebungen, in denen Agenten im Web navigieren, inspizieren, handeln und koordinieren, als operative Schicht für menschliche und organisationale Ergebnisse.',
          },
          {
            title: 'KI-Tutoren und kognitive Systeme',
            body: 'Langfristige Lernsysteme, die Curriculum, Tempo, Übung und Medienerzeugung um ein persistentes Modell des Lernenden herum anpassen.',
          },
          {
            title: 'Multi-Agenten-Workflows',
            body: 'Koordinierte Systeme, in denen spezialisierte Agenten Gedächtnis teilen, Verantwortlichkeiten aushandeln und komplexe operative Aufgaben gemeinsam abschließen.',
          },
        ],
        domainsLabel: 'Beispieldomänen',
        domains: [
          'Persönliche Intelligenzsysteme',
          'Agent-native Browser und Betriebssysteme',
          'KI-Tutoren mit Gedächtnis und Curriculum-Anpassung',
          'Autonome Forschungs- und Wissensworkflows',
          'Agenten für Geschäftsprozesse und Entscheidungsunterstützung',
          'Entwickler-Toolchains für Multi-Agenten-Ausführung',
        ],
        positioningLabel: 'Positionierung',
        positioningBody:
          'Agentware ist das operative Medium, durch das Intention, Rahmenbedingungen, Gedächtnis, Planung, Werkzeuge, Ausführung, Feedback und Governance zu ausführbaren, governierbaren und skalierbaren Ergebnissen werden.',
      },
      cta: {
        label: 'Mitwirken',
        title: 'Die Grundlagen von Agentware bauen.',
        body:
          'Agentware Studio ist ein früher Versuch, die konzeptionellen und praktischen Grundlagen agent-nativer Software zu definieren, zu systematisieren und aufzubauen.',
        github: 'Auf GitHub folgen',
        x: 'Auf X folgen',
      },
      footer: {
        title: 'Agentware Studio',
        tagline: 'Das nächste Paradigma von Software definieren.',
        github: 'GitHub',
        x: 'X',
        youtube: 'YouTube',
      },
    },
  },
  fr: {
    translation: {
      meta: {
        title: 'Agentware Studio',
        description: 'Définir le prochain paradigme logiciel.',
      },
      nav: {
        definition: 'Définition',
        why: 'Pourquoi Agentware',
        principles: 'Principes',
        vision: 'Vision',
        language: 'Langue',
      },
      hero: {
        badge: 'Définir le prochain paradigme logiciel',
        title: 'Agentware',
        subtitle: 'Du logiciel piloté par interface à Agentic Execution.',
        body:
          'Agentware désigne une classe de systèmes logiciels construits autour de Agentic Execution, où le logiciel opère par intention, contraintes, mémoire, planification, usage d’outils, rétroaction et gouvernance, plutôt que par manipulation humaine étape par étape.',
        primaryCta: 'Lire la définition',
        secondaryCta: 'Voir GitHub',
      },
      definition: {
        label: 'Définition',
        body:
          'Agentware désigne une classe de systèmes logiciels construits autour de Agentic Execution, dont le modèle opérationnel central repose sur l’interprétation de l’intention, la gestion des contraintes, la mémoire structurée, la planification, l’usage d’outils, les boucles de rétroaction et la gouvernance afin de livrer des résultats fiables.',
        formulaLabel: 'Formule opératoire',
        formulaLead: 'Agentware',
        formulaBody: 'Intention + Contraintes + Mémoire + Planification + Outils + Exécution + Rétroaction + Gouvernance',
        formulaNote:
          'Ce n’est pas un logiciel qui se contente d’exécuter des commandes, mais un logiciel qui interprète des objectifs, élabore une stratégie, agit via des outils et s’adapte en continu sous gouvernance.',
      },
      why: {
        label: 'Pourquoi Agentware',
        title: 'Le logiciel traditionnel est construit autour des interfaces. Agentware est construit autour des résultats.',
        description:
          'L’ère précédente optimisait la navigation d’interface et l’interaction fonctionnelle sous pilotage manuel. Le nouveau paradigme optimise les objectifs, les contraintes, la mémoire, la stratégie, l’exécution, la rétroaction et la gouvernance afin que les systèmes délivrent des résultats à l’intérieur de limites contrôlées.',
        items: [
          {
            title: 'D’un modèle centré interface à un modèle centré objectif',
            body: 'Le logiciel traditionnel optimise les écrans et les contrôles. Agentware optimise l’interprétation de l’objectif et la livraison du résultat.',
          },
          {
            title: 'Des étapes manuelles à Agentic Execution',
            body: 'Les systèmes traditionnels dépendent de l’opération directe de l’utilisateur. Agentware reçoit des objectifs et agit dans une autonomie contrôlée.',
          },
          {
            title: 'Des fonctionnalités aux résultats',
            body: 'Le logiciel traditionnel fournit un accès fonctionnel. Agentware est évalué selon sa capacité réelle à livrer des résultats.',
          },
          {
            title: 'Des flux fixes à la planification dynamique',
            body: 'La logique traditionnelle est souvent prédéfinie. Agentware planifie, replanifie et coordonne l’exécution à mesure que les conditions changent.',
          },
          {
            title: 'D’un état superficiel à une mémoire structurée',
            body: 'L’état traditionnel est souvent limité à la session. Agentware maintient une mémoire durable pour une opération de long terme.',
          },
          {
            title: 'De contrôles implicites à une gouvernance explicite',
            body: 'Le logiciel traditionnel met l’accent sur les permissions. Agentware ajoute politiques, auditabilité et intervention comme contrôles de premier ordre.',
          },
        ],
      },
      principles: {
        label: 'Principes',
        title: 'Les principes architecturaux d’Agentware.',
        description:
          'Agentware n’est pas simplement un logiciel enrichi par l’IA. C’est un logiciel délibérément conçu pour la mémoire, la planification, l’exécution et la gouvernance. Ces principes définissent ce qui distingue un Agentic System d’une application conventionnelle à laquelle on a simplement ajouté un LLM.',
        items: [
          {
            title: 'Guidé par l’intention',
            body: 'Agentware prend l’intention et les objectifs comme entrées primaires au lieu de dépendre d’une opération explicite étape par étape.',
          },
          {
            title: 'Délimité par des contraintes',
            body: 'L’exécution est façonnée par des contraintes explicites, des frontières de politique et des conditions de sécurité, et non par une automatisation sans bornes.',
          },
          {
            title: 'Natif de la mémoire',
            body: 'Il maintient un contexte structuré et persistant à travers les tâches, les environnements, les décisions et les actions passées.',
          },
          {
            title: 'Capable de planifier',
            body: 'Il transforme des objectifs en stratégies exécutables, sous-plans et points de décision dans le temps.',
          },
          {
            title: 'Capable d’agir via des outils',
            body: 'Il agit au moyen d’API, de navigateurs, de scripts, de services et de systèmes numériques pour produire des effets opérationnels.',
          },
          {
            title: 'Guidé par la rétroaction',
            body: 'Il surveille les résultats, détecte les écarts et adapte son comportement via des boucles continues de rétroaction.',
          },
          {
            title: 'Gouvernable',
            body: 'L’autonomie est gouvernée par des politiques, l’auditabilité et des contrôles d’intervention.',
          },
        ],
      },
      formalization: {
        label: 'Formalisation',
        title: 'Une définition formelle pour une nouvelle classe de systèmes.',
        formalLabel: 'Définition formelle',
        formalBody:
          'Agentware est une classe de systèmes logiciels architecturés pour Agentic Execution: un paradigme logiciel dans lequel objectifs, contraintes, mémoire structurée, planification, invocation d’outils, boucles de rétroaction et gouvernance forment le modèle opérationnel central du système. Contrairement au logiciel traditionnel centré sur les interfaces et les commandes explicites de l’utilisateur, Agentware est conçu pour interpréter des objectifs, générer des stratégies, agir à travers des environnements numériques et livrer des résultats dans des limites contrôlées.',
        plainLabel: 'En termes simples',
        plainBody:
          'Le logiciel traditionnel donne aux personnes des fonctions à manipuler. Agentware permet de confier des objectifs à des systèmes capables de planifier, agir, s’adapter et livrer des résultats sous gouvernance.',
      },
      comparison: {
        label: 'Comparaison',
        title: 'Agentware face au logiciel traditionnel.',
        dimension: 'Dimension',
        traditional: 'Logiciel traditionnel',
        agentware: 'Agentware',
        rows: [
          {
            dimension: 'Orientation centrale',
            traditional: 'Centré sur l’interface et les fonctionnalités',
            agentware: 'Centré sur les objectifs, les contraintes et les résultats',
          },
          {
            dimension: 'Modèle d’opération',
            traditional: 'Manipulation humaine directe étape par étape',
            agentware: 'Agentic Execution dans une autonomie contrôlée',
          },
          {
            dimension: 'Modèle de workflow',
            traditional: 'Flux fixes et séquences prédéfinies',
            agentware: 'Planification dynamique, invocation d’outils et adaptation',
          },
          {
            dimension: 'État du système',
            traditional: 'État superficiel ou limité à la session',
            agentware: 'Mémoire persistante et structurée',
          },
          {
            dimension: 'Livraison de valeur',
            traditional: 'Accès aux fonctionnalités',
            agentware: 'Livraison de résultats',
          },
          {
            dimension: 'Gouvernance',
            traditional: 'Contrôles limités ou implicites',
            agentware: 'Gouvernance explicite, auditabilité et intervention',
          },
        ],
      },
      vision: {
        label: 'Vision',
        title: 'Les futurs produits construits sur le paradigme Agentware.',
        description:
          'Agentware est un paradigme logiciel qui peut se manifester dans la cognition personnelle, l’éducation, les opérations, la recherche et l’infrastructure Multi-Agent. En conséquence, ces systèmes peuvent créer de la valeur pour les individus, les organisations et d’autres systèmes logiciels.',
        items: [
          {
            title: 'Systèmes d’intelligence personnelle',
            body: 'Des logiciels qui comprennent un utilisateur dans la durée, construisent une mémoire de travail et agissent comme couche opérationnelle pour la pensée, la planification et l’aide à la décision.',
          },
          {
            title: 'Navigateurs natifs pour agents',
            body: 'Des environnements d’exécution où les agents naviguent, inspectent, agissent et se coordonnent sur le web comme couche opérationnelle pour des résultats humains et organisationnels.',
          },
          {
            title: 'Tuteurs IA et systèmes cognitifs',
            body: 'Des systèmes d’apprentissage sur le long terme qui adaptent curriculum, rythme, pratique et génération de médias autour d’un modèle persistant de l’apprenant.',
          },
          {
            title: 'Workflows multi-agents',
            body: 'Des systèmes coordonnés dans lesquels des agents spécialisés partagent la mémoire, négocient les responsabilités et accomplissent ensemble des tâches opérationnelles complexes.',
          },
        ],
        domainsLabel: 'Domaines d’exemple',
        domains: [
          'Systèmes d’intelligence personnelle',
          'Navigateurs Agent-native et systèmes d’exploitation',
          'Tuteurs IA avec mémoire et adaptation du curriculum',
          'Workflows autonomes de recherche et de connaissance',
          'Agents pour les opérations métier et l’aide à la décision',
          'Chaînes d’outils pour développeurs orientées exécution multi-agents',
        ],
        positioningLabel: 'Positionnement',
        positioningBody:
          'Agentware est le médium opérationnel par lequel intention, contraintes, mémoire, planification, outils, exécution, rétroaction et gouvernance deviennent des résultats exécutables, gouvernables et extensibles.',
      },
      cta: {
        label: 'Participer',
        title: 'Construire les fondations d’Agentware.',
        body:
          'Agentware Studio est un effort précoce pour définir, systématiser et construire les fondations conceptuelles et pratiques du logiciel natif pour agents.',
        github: 'Suivre sur GitHub',
        x: 'Suivre sur X',
      },
      footer: {
        title: 'Agentware Studio',
        tagline: 'Définir le prochain paradigme logiciel.',
        github: 'GitHub',
        x: 'X',
        youtube: 'YouTube',
      },
    },
  },
  'pt-BR': {
    translation: {
      meta: {
        title: 'Agentware Studio',
        description: 'Definindo o próximo paradigma de software.',
      },
      nav: {
        definition: 'Definição',
        why: 'Por que Agentware',
        principles: 'Princípios',
        vision: 'Visão',
        language: 'Idioma',
      },
      hero: {
        badge: 'Definindo o próximo paradigma de software',
        title: 'Agentware',
        subtitle: 'Do software guiado por interface para Agentic Execution.',
        body:
          'Agentware é uma classe de sistemas de software construída em torno de Agentic Execution, na qual o software opera por meio de intenção, restrições, memória, planejamento, uso de ferramentas, feedback e governança, em vez de depender de operação humana direta passo a passo.',
        primaryCta: 'Ler a definição',
        secondaryCta: 'Ver GitHub',
      },
      definition: {
        label: 'Definição',
        body:
          'Agentware é uma classe de sistemas de software construída em torno de Agentic Execution, cujo modelo operacional central é formado por interpretação de intenção, tratamento de restrições, memória estruturada, planejamento, uso de ferramentas, ciclos de feedback e governança para entregar resultados confiáveis.',
        formulaLabel: 'Fórmula operacional',
        formulaLead: 'Agentware',
        formulaBody: 'Intenção + Restrições + Memória + Planejamento + Ferramentas + Execução + Feedback + Governança',
        formulaNote:
          'Não é software que apenas executa comandos, mas software que interpreta objetivos, define estratégia, executa por meio de ferramentas e se adapta continuamente sob governança.',
      },
      why: {
        label: 'Por que Agentware',
        title: 'O software tradicional é construído em torno de interfaces. Agentware é construído em torno de resultados.',
        description:
          'A era anterior otimizou a navegação por interfaces e a interação com funcionalidades sob operação manual. O novo paradigma otimiza objetivos, restrições, memória, estratégia, execução, feedback e governança, para que sistemas entreguem resultados dentro de limites controlados.',
        items: [
          {
            title: 'Do foco em interface ao foco em objetivo',
            body: 'O software tradicional otimiza telas e controles. Agentware otimiza interpretação de objetivos e entrega de resultados.',
          },
          {
            title: 'De etapas manuais a Agentic Execution',
            body: 'Sistemas tradicionais dependem da operação direta do usuário. Agentware recebe objetivos e age dentro de uma autonomia controlada.',
          },
          {
            title: 'De funcionalidades a resultados',
            body: 'O software tradicional oferece acesso funcional. Agentware é avaliado por entregar resultados de fato.',
          },
          {
            title: 'De fluxos fixos a planejamento dinâmico',
            body: 'A lógica tradicional costuma ser predefinida. Agentware planeja, replaneja e coordena a execução conforme as condições mudam.',
          },
          {
            title: 'De estado superficial a memória estruturada',
            body: 'O estado tradicional costuma ficar preso à sessão. Agentware mantém memória durável para operação de longo horizonte.',
          },
          {
            title: 'De controles implícitos a governança explícita',
            body: 'O software tradicional enfatiza permissões. Agentware acrescenta políticas, auditabilidade e intervenção como controles de primeira classe.',
          },
        ],
      },
      principles: {
        label: 'Princípios',
        title: 'Os princípios arquiteturais de Agentware.',
        description:
          'Agentware não é apenas software habilitado por IA. É software deliberadamente arquitetado para memória, planejamento, execução e governança. Esses princípios definem o que separa um sistema agêntico de uma aplicação convencional com um LLM apenas acoplado.',
        items: [
          {
            title: 'Guiado por intenção',
            body: 'Agentware parte de intenção e objetivos como entradas primárias, em vez de depender de operação explícita passo a passo.',
          },
          {
            title: 'Delimitado por restrições',
            body: 'A execução é moldada por restrições explícitas, limites de política e condições de segurança, e não por automação irrestrita.',
          },
          {
            title: 'Nativo em memória',
            body: 'Mantém contexto estruturado e persistente entre tarefas, ambientes, decisões e ações anteriores.',
          },
          {
            title: 'Capaz de planejar',
            body: 'Transforma objetivos em estratégias executáveis, subplanos e pontos de decisão ao longo do tempo.',
          },
          {
            title: 'Capaz de agir por meio de ferramentas',
            body: 'Age por meio de APIs, navegadores, scripts, serviços e sistemas digitais para produzir efeitos operacionais.',
          },
          {
            title: 'Guiado por feedback',
            body: 'Monitora resultados, detecta desvios e adapta o comportamento por meio de ciclos contínuos de feedback.',
          },
          {
            title: 'Governável',
            body: 'A autonomia é governada por políticas, auditabilidade e controles de intervenção.',
          },
        ],
      },
      formalization: {
        label: 'Formalização',
        title: 'Uma definição formal para uma nova classe de sistemas.',
        formalLabel: 'Definição formal',
        formalBody:
          'Agentware é uma classe de sistemas de software arquitetados para Agentic Execution: um paradigma de software no qual objetivos, restrições, memória estruturada, planejamento, invocação de ferramentas, ciclos de feedback e governança formam o modelo operacional central do sistema. Diferentemente do software tradicional centrado em interfaces e comandos explícitos do usuário, Agentware é projetado para interpretar metas, gerar estratégias, agir em ambientes digitais e entregar resultados dentro de limites controlados.',
        plainLabel: 'Em linguagem simples',
        plainBody:
          'O software tradicional dá às pessoas funções para operar. Agentware permite entregar objetivos a sistemas que podem planejar, agir, adaptar-se e entregar resultados sob governança.',
      },
      comparison: {
        label: 'Comparação',
        title: 'Agentware versus software tradicional.',
        dimension: 'Dimensão',
        traditional: 'Software tradicional',
        agentware: 'Agentware',
        rows: [
          {
            dimension: 'Orientação central',
            traditional: 'Centrado em interface e funcionalidades',
            agentware: 'Centrado em objetivos, restrições e resultados',
          },
          {
            dimension: 'Modelo operacional',
            traditional: 'Operação humana direta passo a passo',
            agentware: 'Agentic Execution dentro de autonomia controlada',
          },
          {
            dimension: 'Modelo de workflow',
            traditional: 'Fluxos fixos e sequências predefinidas',
            agentware: 'Planejamento dinâmico, invocação de ferramentas e adaptação',
          },
          {
            dimension: 'Estado do sistema',
            traditional: 'Estado superficial ou limitado à sessão',
            agentware: 'Memória persistente e estruturada',
          },
          {
            dimension: 'Entrega de valor',
            traditional: 'Acesso a funcionalidades',
            agentware: 'Entrega de resultados',
          },
          {
            dimension: 'Governança',
            traditional: 'Controles limitados ou implícitos',
            agentware: 'Governança explícita, auditabilidade e intervenção',
          },
        ],
      },
      vision: {
        label: 'Visão',
        title: 'Produtos futuros construídos sobre o paradigma Agentware.',
        description:
          'Agentware é um paradigma de software que pode se manifestar em cognição pessoal, educação, operações, pesquisa e infraestrutura Multi-Agent. Como consequência, esses sistemas podem entregar valor a indivíduos, organizações e outros sistemas de software.',
        items: [
          {
            title: 'Sistemas de inteligência pessoal',
            body: 'Software que compreende um usuário ao longo do tempo, constrói memória de trabalho e atua como camada operacional para pensar, planejar e apoiar decisões.',
          },
          {
            title: 'Navegadores nativos para agentes',
            body: 'Ambientes de execução nos quais agentes navegam, inspecionam, agem e se coordenam na web como camada operacional para resultados humanos e organizacionais.',
          },
          {
            title: 'Tutores de IA e sistemas cognitivos',
            body: 'Sistemas de aprendizagem de longo horizonte que adaptam currículo, ritmo, prática e geração de mídia em torno de um modelo persistente do aprendiz.',
          },
          {
            title: 'Workflows multiagente',
            body: 'Sistemas coordenados nos quais agentes especializados compartilham memória, negociam responsabilidades e concluem juntos tarefas operacionais complexas.',
          },
        ],
        domainsLabel: 'Domínios de exemplo',
        domains: [
          'Sistemas de inteligência pessoal',
          'Navegadores Agent-native e sistemas operacionais',
          'Tutores de IA com memória e adaptação curricular',
          'Workflows autônomos de pesquisa e conhecimento',
          'Agentes de operações de negócio e apoio à decisão',
          'Toolchains para desenvolvedores voltadas à execução multiagente',
        ],
        positioningLabel: 'Declaração de posicionamento',
        positioningBody:
          'Agentware é o meio operacional pelo qual intenção, restrições, memória, planejamento, ferramentas, execução, feedback e governança se tornam resultados executáveis, governáveis e escaláveis.',
      },
      cta: {
        label: 'Participe',
        title: 'Construindo os fundamentos de Agentware.',
        body:
          'Agentware Studio é um esforço inicial para definir, sistematizar e construir os fundamentos conceituais e práticos do software nativo para agentes.',
        github: 'Seguir no GitHub',
        x: 'Seguir no X',
      },
      footer: {
        title: 'Agentware Studio',
        tagline: 'Definindo o próximo paradigma de software.',
        github: 'GitHub',
        x: 'X',
        youtube: 'YouTube',
      },
    },
  },
  ko: {
    translation: {
      meta: {
        title: 'Agentware Studio',
        description: '차세대 소프트웨어 패러다임을 정의합니다.',
      },
      nav: {
        definition: '정의',
        why: '왜 Agentware인가',
        principles: '원칙',
        vision: '비전',
        language: '언어',
      },
      hero: {
        badge: '차세대 소프트웨어 패러다임을 정의합니다',
        title: 'Agentware',
        subtitle: '인터페이스 중심 소프트웨어에서 Agentic Execution 중심으로.',
        body:
          'Agentware는 Agentic Execution을 중심으로 구축된 소프트웨어 시스템의 한 범주입니다. 여기서 소프트웨어는 인간의 단계별 직접 조작에 의존하지 않고, 의도, 제약, 메모리, 계획, 도구 사용, 피드백, 거버넌스를 통해 작동합니다.',
        primaryCta: '정의 읽기',
        secondaryCta: 'GitHub 보기',
      },
      definition: {
        label: '정의',
        body:
          'Agentware는 Agentic Execution을 중심에 둔 소프트웨어 시스템의 한 범주로, 그 핵심 운영 모델은 의도 해석, 제약 처리, 구조화된 메모리, 계획, 도구 사용, 피드백 루프, 거버넌스로 구성되며 신뢰할 수 있는 결과 전달을 목표로 합니다.',
        formulaLabel: '작동 공식',
        formulaLead: 'Agentware',
        formulaBody: '의도 + 제약 + 메모리 + 계획 + 도구 + 실행 + 피드백 + 거버넌스',
        formulaNote:
          '단순히 명령만 실행하는 소프트웨어가 아니라, 목표를 해석하고 전략을 세우며 도구를 통해 실행하고 거버넌스 아래에서 지속적으로 적응하는 소프트웨어입니다.',
      },
      why: {
        label: '왜 Agentware인가',
        title: '전통적인 소프트웨어는 인터페이스를 중심으로 만들어집니다. Agentware는 결과를 중심으로 만들어집니다.',
        description:
          '이전 세대는 수동 조작을 전제로 인터페이스 탐색과 기능 상호작용을 최적화했습니다. 새로운 패러다임은 목표, 제약, 메모리, 전략, 실행, 피드백, 거버넌스를 최적화하여 시스템이 통제된 경계 안에서 결과를 전달하도록 합니다.',
        items: [
          {
            title: '인터페이스 중심에서 목표 중심으로',
            body: '전통적인 소프트웨어는 화면과 컨트롤을 최적화합니다. Agentware는 목표 해석과 결과 전달을 최적화합니다.',
          },
          {
            title: '수동 단계에서 Agentic Execution으로',
            body: '전통적인 시스템은 사용자의 직접 조작에 의존합니다. Agentware는 목표를 받아 통제된 자율성 안에서 행동합니다.',
          },
          {
            title: '기능에서 결과로',
            body: '전통적인 소프트웨어는 기능 접근을 제공합니다. Agentware는 실제로 결과를 전달하는지로 평가됩니다.',
          },
          {
            title: '고정 흐름에서 동적 계획으로',
            body: '전통적인 로직은 미리 정의되어 있는 경우가 많습니다. Agentware는 조건 변화에 따라 계획하고 재계획하며 실행을 조율합니다.',
          },
          {
            title: '얕은 상태에서 구조화된 메모리로',
            body: '전통적인 상태는 세션에 묶이기 쉽습니다. Agentware는 장기 운영을 위한 지속적 메모리를 유지합니다.',
          },
          {
            title: '암묵적 통제에서 명시적 거버넌스로',
            body: '전통적인 소프트웨어는 권한을 강조합니다. Agentware는 여기에 정책, 감사 가능성, 개입을 1급 통제 수단으로 더합니다.',
          },
        ],
      },
      principles: {
        label: '원칙',
        title: 'Agentware의 아키텍처 원칙.',
        description:
          'Agentware는 단순히 AI가 추가된 소프트웨어가 아닙니다. 메모리, 계획, 실행, 거버넌스를 위해 의도적으로 설계된 소프트웨어입니다. 이 원칙들은 진정한 Agentic System과 LLM만 덧붙인 기존 애플리케이션을 구분합니다.',
        items: [
          {
            title: '의도 주도',
            body: 'Agentware는 사용자의 단계별 명시 조작이 아니라 의도와 목표를 핵심 입력으로 삼습니다.',
          },
          {
            title: '제약에 의해 경계 지어짐',
            body: '실행은 무제한 자동화가 아니라 명시적 제약, 정책 경계, 안전 조건에 의해 형성됩니다.',
          },
          {
            title: '메모리 네이티브',
            body: '작업, 환경, 결정, 이전 행동 전반에 걸쳐 구조화되고 지속적인 컨텍스트를 유지합니다.',
          },
          {
            title: '계획 가능',
            body: '목표를 실행 가능한 전략, 하위 계획, 시간에 따른 의사결정 지점으로 전환합니다.',
          },
          {
            title: '도구를 통해 실행 가능',
            body: 'API, 브라우저, 스크립트, 서비스, 디지털 시스템을 통해 실제 운영 효과를 만들어 냅니다.',
          },
          {
            title: '피드백 기반',
            body: '결과를 모니터링하고, 편차를 감지하며, 지속적인 피드백 루프를 통해 행동을 조정합니다.',
          },
          {
            title: '거버넌스 가능',
            body: '자율성은 정책, 감사 가능성, 개입 통제를 통해 관리됩니다.',
          },
        ],
      },
      formalization: {
        label: '형식화',
        title: '새로운 시스템 범주를 위한 형식적 정의.',
        formalLabel: '형식적 정의',
        formalBody:
          'Agentware는 Agentic Execution을 위해 설계된 소프트웨어 시스템의 한 범주입니다. 이 패러다임에서는 목표, 제약, 구조화된 메모리, 계획, 도구 호출, 피드백 루프, 거버넌스가 시스템의 핵심 운영 모델을 이룹니다. 인터페이스와 명시적 사용자 명령에 중심을 두는 전통적인 소프트웨어와 달리, Agentware는 목표를 해석하고 전략을 생성하며 디지털 환경 전반에서 행동하고 통제된 경계 안에서 결과를 전달하도록 설계됩니다.',
        plainLabel: '쉽게 말하면',
        plainBody:
          '전통적인 소프트웨어는 사람이 직접 조작할 기능을 제공합니다. Agentware는 사람이 목표를 넘기면 시스템이 거버넌스 아래에서 계획하고 행동하고 적응하여 결과를 전달하게 합니다.',
      },
      comparison: {
        label: '비교',
        title: 'Agentware와 전통적인 소프트웨어.',
        dimension: '차원',
        traditional: '전통적인 소프트웨어',
        agentware: 'Agentware',
        rows: [
          {
            dimension: '핵심 지향',
            traditional: '인터페이스와 기능 중심',
            agentware: '목표, 제약, 결과 중심',
          },
          {
            dimension: '운영 모델',
            traditional: '인간의 단계별 직접 조작',
            agentware: '통제된 자율성 안의 Agentic Execution',
          },
          {
            dimension: '워크플로 모델',
            traditional: '고정 워크플로와 사전 정의된 순서',
            agentware: '동적 계획, 도구 호출, 적응',
          },
          {
            dimension: '시스템 상태',
            traditional: '세션 기반 또는 얕은 상태',
            agentware: '지속적이고 구조화된 메모리',
          },
          {
            dimension: '가치 전달',
            traditional: '기능 접근',
            agentware: '결과 전달',
          },
          {
            dimension: '거버넌스',
            traditional: '제한적이거나 암묵적인 통제',
            agentware: '명시적 거버넌스, 감사 가능성, 개입',
          },
        ],
      },
      vision: {
        label: '비전',
        title: 'Agentware 패러다임 위에 구축될 미래 제품.',
        description:
          'Agentware는 개인 인지, 교육, 운영, 연구, Multi-Agent 인프라 전반에 걸쳐 구현될 수 있는 소프트웨어 패러다임입니다. 그 결과 이러한 시스템은 개인, 조직, 다른 소프트웨어 시스템에 가치를 전달할 수 있습니다.',
        items: [
          {
            title: '개인 지능 시스템',
            body: '시간에 걸쳐 사용자를 이해하고 작업 메모리를 구축하며 사고, 계획, 의사결정 지원을 위한 운영 계층으로 작동하는 소프트웨어입니다.',
          },
          {
            title: 'Agent-native 브라우저',
            body: 'Agent가 웹을 탐색하고, निरी하고, 행동하고, 협업하는 실행 환경으로서 인간과 조직의 결과 전달을 위한 운영 계층이 됩니다.',
          },
          {
            title: 'AI 튜터와 인지 시스템',
            body: '학습자에 대한 지속적 모델을 바탕으로 커리큘럼, 속도, 연습, 미디어 생성을 장기적으로 적응시키는 학습 시스템입니다.',
          },
          {
            title: 'Multi-Agent 워크플로',
            body: '전문화된 Agent들이 메모리를 공유하고 책임을 조율하며 복잡한 운영 작업을 함께 완수하는 협력 시스템입니다.',
          },
        ],
        domainsLabel: '예시 도메인',
        domains: [
          '개인 지능 시스템',
          'Agent-native 브라우저와 operating systems',
          '메모리와 커리큘럼 적응을 갖춘 AI 튜터',
          '자율 연구 및 지식 워크플로',
          '비즈니스 운영 및 의사결정 지원 Agent',
          'Multi-Agent 실행을 위한 개발자 툴체인',
        ],
        positioningLabel: '포지셔닝 문장',
        positioningBody:
          'Agentware는 의도, 제약, 메모리, 계획, 도구, 실행, 피드백, 거버넌스를 실행 가능하고, 거버넌스 가능하며, 확장 가능한 결과로 바꾸는 운영 매체입니다.',
      },
      cta: {
        label: '함께하기',
        title: 'Agentware의 기반을 구축합니다.',
        body:
          'Agentware Studio는 Agent-native 소프트웨어의 개념적·실천적 기반을 정의하고 체계화하며 구축하려는 초기 노력입니다.',
        github: 'GitHub에서 팔로우',
        x: 'X에서 팔로우',
      },
      footer: {
        title: 'Agentware Studio',
        tagline: '차세대 소프트웨어 패러다임을 정의합니다.',
        github: 'GitHub',
        x: 'X',
        youtube: 'YouTube',
      },
    },
  },
} as const;

export default resources;
