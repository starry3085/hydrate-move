# Hydrate Move 项目简介（GPT-5）

Hydrate Move 是一个零安装、隐私优先的浏览器小工具，按固定间隔提醒你喝水与起身活动；支持中英双语、演示模式与“下午茶/午餐”彩蛋，适配桌面与移动端。  
- 在线演示: https://8bbd4e25.hydrate-move.pages.dev  
- 备用访问: https://hydrate-move.lightyearai.info/  
- 源码: https://github.com/starry3085/hydrate-move

---

## 灵感来源（Inspiration）
久坐办公室的人（我们自己也不例外）常常因为专注而忽略补水与微运动，长期下来导致疲劳、注意力下降与肌肉骨骼问题。我们希望提供一个“零摩擦”的健康提醒：不需注册与安装、开页即用、隐私优先，并把中文语境下的“下午茶”文化（“三点几啦，饮茶先啦”）也设计成轻松有趣的彩蛋，鼓励可持续的小习惯。  
在产品理念上，我们把“健康微习惯”抽象为周期事件：以固定间隔 I 触发提醒、以最小打扰方式提示。倒计时数学模型为：
$$
T_{\text{remain}}(t)=\max \bigl(0,\, t_{\text{start}}+I-t \bigr),\quad I=30\text{ min}
$$
并结合个性化饮水量估算作为认知锚点：
$$
Q_{\text{daily}}=35\times \text{体重}_{\text{kg}}\ \text{ml}
$$

## 学到了什么（What you learned）
- 浏览器通知生态：Notification API 的权限状态（default/denied/granted）与各浏览器差异；在权限受限或被拦截时回退到页面内 Toast。  
- 音频播放策略：Web Audio 与 HTML5 Audio 的降级链路，处理自动播放策略限制与上下文 resume。  
- 多语言与“语言纯度”：以 constants 与 locales JSON 管理双语文本，避免中英混杂；演示状态与通知文案均由常量层按 lang 分配。  
- 稳健初始化：index.html 中的类可用性自检 + app.js 的 validateInitialization、错误提示与重试机制。  
- 体验与可访问性：语义化结构、aria 属性与移动端断点；在演示模式中快速验证提醒节奏。  
- 轻量部署与监测：Cloudflare Pages 零构建部署、版本号 cache busting、Baidu Analytics 的容错加载与埋点。

## 如何构建（How you built your project）
- 角度一｜最小可行产品与迭代（Strategy）  
  - MVP 定义：我们把“必须完成的一件事/两件事”明确为「按固定间隔可靠地发出喝水与站立提醒，并提供可见倒计时与一键开始/停止」。所有设计都围绕可靠提醒与最小打扰展开。  
  - 第一天（可工作的丑陋 MVP）：完成统一计时器（毫秒内部、分钟展示）、双通道通知（浏览器通知 + 页内 Toast）、声音降级（Web Audio→HTML5 Audio）、基础 UI 与状态可视化。  
  - 第二天（迭代与美化）：在不破坏核心的前提下叠加次要功能——演示模式、双语与“语言纯度”治理、错误恢复与重试、移动端断点与可访问性、下午茶/午餐彩蛋、Baidu Analytics 容错加载。  
  - 时间管理：以 90 分钟冲刺为单位，关键路径只做“必须有”；果断搁置 PWA 与复杂状态管理，确保 D1 能演示、D2 体验可打分。  
  - 小结：先交付“能用”，再打磨“更好看/更聪明”，持续可演示是我们的最高优先级。  
- 角度二｜如何使用 KIRO 与其他 AI 模型、工具  
  - KIRO：用于里程碑拆分与提交材料结构化，按 Devpost 要求校对“灵感/学习/构建/挑战”四块内容，驱动我们保持叙述与代码的一致性。  
  - LLM 协作：  
    - GPT-5：代码骨架与模块化重组建议、错误恢复与初始化顺序审阅、双语常量抽取。  
    - Claude-4：长文档级别的风控与复盘（见仓库多份 CLAUDE-4 报告），帮助梳理问题清单与修复计划。  
    - Gemini：对 PWA/多端适配与文案一致性的对照检查，以及中文语境彩蛋文案打磨。  
  - 人在回路：所有 AI 产出经人工复核与小样测试（Demo 模式 30s 间隔），只接受可运行、可复现的修改。  
- 角度三｜技术栈与架构选择  
  - 技术栈：原生 HTML/CSS/JavaScript；能力依赖 Notification API、Web Audio API、LocalStorage；静态站部署到 Cloudflare Pages。  
  - 架构要点：  
    - constants.js 统一配置与双语文案；NOTIFICATION_CONSTANTS/DEMO_CONSTANTS 提供语言感知 getter。  
    - reminder-manager.js 采取“单计时器 + 每秒 tick”的统一时钟；触发后自动重启；ack 与重置路径一致。  
    - notification-service.js 提供浏览器通知与页内 Toast 双通道，并内建声音降级与自动隐藏。  
    - app.js 负责初始化顺序校验、类可用性自检、错误提示与指数退避式重试；演示模式与彩蛋在此挂载。  
  - 取舍：保持零构建、无框架，降低引导成本与故障面；PWA 暂缓以换取更稳定的缓存一致性与提交流程可控性。  
- 时间轴（Timeline）  
  - D1：完成 MVP（水/站立提醒、通知/声音、基础 UI、演示可跑）  
  - D2：i18n 与“语言纯度”、错误恢复、移动端与可访问性、彩蛋与分析、样式细化

## 面临的挑战（Challenges you faced）
- 通知权限与声音策略差异  
  - 现象：部分浏览器默认拒绝通知或拦截自动播放；移动端震动/声音策略不一。  
  - 方案：权限引导弹层 + 双通道通知（浏览器通知 + 页内 Toast）；Web Audio 与 HTML5 Audio 双轨降级。  
- 多语言“纯度”与一致性  
  - 现象：功能快速演进时易出现中英混排与文案不一致。  
  - 方案：常量层集中管理、语言感知 getter（如 NOTIFICATION_CONSTANTS.getMessage），演示状态同源化。  
- 初始化顺序与缺失类  
  - 现象：脚本加载顺序或网络抖动可能导致类缺失。  
  - 方案：index.html 中的 expectedClasses 自检 + app.js 的 validateInitialization、错误提示与自动重试。  
- 缓存与发布一致性  
  - 现象：浏览器缓存导致脚本版本不一致。  
  - 方案：统一版本号与查询参数做 cache busting，必要时提示刷新。  
- 体验与轻量的平衡  
  - 取舍：暂不引入框架与复杂状态管理，以可维护的小模块协作达成“开箱即用”。

---

# Hydrate Move Project Story (GPT-5)

Hydrate Move is a zero-install, privacy-first browser tool that reminds you to hydrate and move at fixed intervals. It supports English/Chinese, a demo mode, and playful “afternoon tea/lunch” easter eggs for both desktop and mobile.  
- Live demo: https://8bbd4e25.hydrate-move.pages.dev  
- Alternate URL: https://hydrate-move.lightyearai.info/  
- Source: https://github.com/starry3085/hydrate-move

---

## Inspiration
Office workers (including us) often forget hydration and micro-movements when deeply focused, which leads to fatigue, reduced attention, and musculoskeletal issues. We wanted a “frictionless” wellness reminder: no signup, no install, privacy-first, plus a culturally fun nod to the Chinese “afternoon tea” vibe to encourage sustainable micro-habits.  
Product-wise, we model “wellness micro-habits” as periodic events with minimal-disruption prompts. The countdown is:
$$
T_{\text{remain}}(t)=\max \bigl(0,\, t_{\text{start}}+I-t \bigr),\quad I=30\text{ min}
$$
and we use a simple personalized hydration anchor:
$$
Q_{\text{daily}}=35\times \text{weight}_{\text{kg}}\ \text{ml}
$$

## What you learned
- Browser notification landscape: Notification API states and cross-browser differences; fall back to in-page toasts when blocked.  
- Audio policy handling: Web Audio to HTML5 Audio fallback chain and context resume for autoplay.  
- Bilingual “purity”: drive all texts via constants/locales to avoid mixed languages; demo status and notifications are lang-aware.  
- Robust initialization: class availability checks in index.html plus validateInitialization, friendly errors, and retries in app.js.  
- UX and accessibility: semantic structure, aria attributes, mobile breakpoints; demo mode for rapid validation.  
- Lightweight shipping and telemetry: Cloudflare Pages deployment, cache busting, and resilient Baidu Analytics loading.

## How you built your project
- Angle 1 | MVP and Iteration (Strategy)  
  - MVP definition: we focused on “one/two core jobs” – reliably triggering Hydration and Standup reminders at fixed intervals, with visible countdown and one-tap start/stop. Everything optimizes for reliability and minimal disruption.  
  - Day 1 (ugly but working MVP): unified timer (ms internal, minutes in UI), dual-channel delivery (browser notification + in-page toast), audio fallback (Web Audio→HTML5 Audio), basic UI and status.  
  - Day 2 (iterate and polish): secondary features without risking the core — Demo mode, i18n and language-purity governance, error recovery with retries, mobile breakpoints and a11y, afternoon-tea/lunch easter eggs, and resilient Baidu Analytics.  
  - Time management: 90-minute sprints; only “must-haves” on the critical path; we intentionally parked PWA and complex state so D1 is demoable and D2 is scoreable.  
  - Summary: ship “works now” first, then make it prettier/smarter — continuous demoability was our top priority.  
- Angle 2 | Using KIRO and other AI models/tools  
  - KIRO: milestone planning and submission structuring per Devpost sections, keeping the narrative aligned with the code.  
  - LLM collaboration:  
    - GPT-5: code skeleton and modular refactors, init-order review, extraction of bilingual constants.  
    - Claude-4: long-form risk reviews and postmortems (see multiple CLAUDE-4 reports), helping prioritize fix plans.  
    - Gemini: cross-checks on PWA/multi-device notes and language consistency, plus polishing CN-context easter-egg copy.  
  - Human-in-the-loop: every AI change is reviewed and smoke-tested via the 30s Demo mode; only runnable, reproducible edits are accepted.  
- Angle 3 | Tech stack and architecture choices  
  - Stack: Vanilla HTML/CSS/JavaScript; Notification API, Web Audio API, LocalStorage; static hosting on Cloudflare Pages.  
  - Architecture highlights:  
    - constants.js centralizes config/i18n; NOTIFICATION_CONSTANTS/DEMO_CONSTANTS expose lang-aware getters.  
    - reminder-manager.js uses a single-timer 1s tick; auto-restart after triggers; unified ack/reset path.  
    - notification-service.js delivers both browser notifications and in-page toasts with audio fallback and auto-hide.  
    - app.js enforces init order, class availability checks, friendly errors and exponential backoff retries; demo/easter eggs mounted here.  
  - Trade-offs: no framework and no build to minimize surface area; defer PWA to keep cache consistency and submission flow predictable.  
- Timeline  
  - D1: MVP ready (water/standup reminders, notifications/audio, basic UI, demo runs)  
  - D2: i18n and language purity, recovery, mobile+a11y, easter eggs and analytics, style polish

## Challenges you faced
- Notification permissions and audio policy variance  
  - Issue: default-denied notifications and autoplay restrictions; device-dependent vibration/audio.  
  - Fix: permission prompt + dual-channel delivery (browser + in-page toasts); Web Audio → HTML5 Audio fallback.  
- Bilingual “purity” and consistency  
  - Issue: mixed-language strings during fast iteration.  
  - Fix: centralized constants, lang-aware getters (e.g., NOTIFICATION_CONSTANTS.getMessage), unified demo status.  
- Init order and missing classes  
  - Issue: script order or network flakiness could hide classes.  
  - Fix: expectedClasses checks in index.html plus validateInitialization, friendly prompts, and retries.  
- Cache and release consistency  
  - Issue: stale browser caches caused version mismatches.  
  - Fix: consistent versioning + query-string cache busting and refresh prompts when necessary.  
- Balancing experience with lightness  
  - Tradeoff: no framework or heavy state management; small collaborating modules deliver “works out-of-the-box.”