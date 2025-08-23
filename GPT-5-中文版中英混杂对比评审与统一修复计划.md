# GPT-5：中文版中英混杂问题方案对比评审与统一修复计划

更新时间：2025-08-23  
适用范围：hydrate-move 仓库（中文版路径与 zh-CN 国际化）

## 结论（先导）

- 更合理、更可落地的方案：QODER
- 采用策略：以 QODER 的“工程化与可执行性”为主线，融合 CLAUDE-4 的“优先级分级、质量保障与长期机制”，形成可交付的一体化实施方案。

理由：
- QODER 给出了明确的文件与行级定位、清晰的 i18n 工具与键名体系、阶段化时间表和成功标准，执行阻力小、回归验证路径明确。
- CLAUDE-4 在优先级划分、质量保证与维护制度上更完善，适合作为工程实践的流程补强。
- 两者在“消除硬编码英文、统一通过 i18n 提供用户可见文案”上方向一致，整合成本低。

---

## 一、两方案对比评审

维度 | QODER | CLAUDE-4 | 评审结论
---|---|---|---
问题覆盖 | 列出按钮、通知、演示文本等具体枚举，含文件与行号 | 列出类别，覆盖面完整 | QODER更精确、可直接执行；CLAUDE概况清晰
定位与可执行性 | 提供逐文件、逐行改造清单，给出 i18n 工具与键设计 | 倾向“用国际化函数替换硬编码”，缺少落地细节 | QODER优
与现有架构契合 | 明确基于 locales/zh-CN.json，引入 js/i18n.js，兼容现状 | 指出需完善 zh-CN.json 与 content-map | 两者均可，QODER路线更明确
验证与度量 | 提供成功标准（语言纯度、性能指标、UX），自动化检查思路 | 提供 QA 流程与自动化检测方向 | 可合并，作为统一QA门禁
风险与回滚 | 列出性能、兼容、翻译准确风险与缓解 | 提出流程与工具化保障 | 可互补
实施成本 | 阶段化周计划与任务拆分清晰 | 优先级分层合理 | 组合后执行成本最优

综合判断：以 QODER 为主，融合 CLAUDE-4 的优先级与质量保障，能最短路径达成“零英文混杂”，且具备持续守护能力。

---

## 二、统一修复计划（结合与对齐）

### 1. 键名与文案规范（统一约定）
- 根命名空间：ui, notifications, demo
- 统一键路径（与 QODER一致，兼容 CLAUDE-4 分类）：
  - ui.buttons.{start,stop,demo,stopDemo,loading}
  - notifications.water.{title,body}
  - notifications.standup.{title,body}
  - demo.status.{ready,starting,waterStarting,standupStarting,running,completed}
- 风格规范：
  - 用户可见文本一律经 i18n 输出，禁止硬编码
  - 表情符号作为文案一部分，进入翻译；保持中英文一致风格
  - 语气与标点中文本地化（如：加载中...、该喝水啦！）

建议补充到 locales/zh-CN.json 的增量示例：
```json
{
  "ui": {
    "buttons": {
      "start": "开始",
      "stop": "停止",
      "demo": "演示",
      "stopDemo": "停止演示",
      "loading": "加载中..."
    }
  },
  "notifications": {
    "water": {
      "title": "💧 该喝水啦！",
      "body": "长时间工作可能导致脱水，记得喝水！"
    },
    "standup": {
      "title": "🧘 该站起来了！",
      "body": "久坐对健康有害，起来活动一下！"
    }
  },
  "demo": {
    "status": {
      "ready": "点击演示查看提醒如何工作",
      "starting": "演示启动中...",
      "waterStarting": "正在启动喝水提醒（演示模式 - 30秒间隔）",
      "standupStarting": "正在启动站立提醒（演示模式 - 30秒间隔）",
      "running": "演示运行中 - 留意通知！",
      "completed": "演示完成 - 提醒已重置为正常"
    }
  }
}
```

### 2. i18n 工具与用法（最小可行实现）
新增 js/i18n.js（示意）：
```javascript
// js/i18n.js
export class I18n {
  constructor() {
    this.locale = this.detectLocale();
    this.translations = {};
  }

  detectLocale() {
    // 基于路径判断：/zh/ 下强制 zh-CN，否则英文
    return window.location.pathname.startsWith('/zh/') ? 'zh-CN' : 'en';
  }

  async init() {
    const url = `/locales/${this.locale}.json`;
    const res = await fetch(url);
    this.translations = await res.json();
  }

  t(key, fallback = '') {
    const val = key.split('.').reduce((acc, k) => (acc && acc[k] != null ? acc[k] : undefined), this.translations);
    return (val != null ? val : (fallback || key));
  }
}
```

使用示例：
```javascript
// 修改前
btnElement.textContent = 'Stop';
// 修改后
btnElement.textContent = i18n.t('ui.buttons.stop');
```

说明：
- 初始化在入口脚本尽早执行：await i18n.init()
- 若未来支持运行时语言切换，可加入缓存与重新渲染机制

### 3. 改造清单（紧贴现有代码）
高优先级（按钮、通知、演示入口）：
- js/ui-controller.js
  - L240: 'Loading...' → i18n.t('ui.buttons.loading')
  - L263: 'Stop' → i18n.t('ui.buttons.stop')
  - L271: 'Start' → i18n.t('ui.buttons.start')
  - L323: 'Loading...' → i18n.t('ui.buttons.loading')
  - L325: 'Start' → i18n.t('ui.buttons.start')
  - L369: 'Stop Demo' → i18n.t('ui.buttons.stopDemo')
  - L371: 'Demo' → i18n.t('ui.buttons.demo')
- js/demo-controller.js
  - L275: 'Demo' → i18n.t('ui.buttons.demo')
- js/constants.js
  - L54-L59: 演示状态文案 → i18n 键 demo.status.*
  - L76-L81: 通知标题/内容 → i18n 键 notifications.*.*

中优先级（其他动态提示统一 i18n）：
- js/notification-service.js、js/reminder-manager.js、js/water-reminder.js、js/standup-reminder.js
  - 确保通知 payload 由 i18n 提供，不保留英文硬编码

低优先级（开发者可见）：
- console 与调试输出暂不强制，但建议逐步本地化或标准化为英文并标注不可见

### 4. 验证与度量（门禁融合）
- 语言纯度检查（脚本思路）
  - 扫描 js/ 目录中的用户可见硬编码英文（正则近似匹配引号内英文单词，排除白名单如变量、URL、标识符）
  - 校验 locales/zh-CN.json 键完整性（keys 由扫描产出清单对齐）
- 手工验收
  - 页面初始状态按钮文本
  - Demo 按钮切换与状态提示全流程
  - 两种通知弹窗（标题+正文）
- 成功标准（QODER 基准）
  - 用户可见文本 100% 中文
  - 翻译准确性 ≥ 95%
  - 首次加载与运行时性能无显著回退（切换文案渲染开销 < 100ms）

### 5. 风险与回滚
- 翻译不准：采用 CLAUDE-4 的复审流程（术语表 + 评审人）
- 兼容性：i18n 加载失败时 fallback 为 key，避免阻断功能
- 回滚：逐文件提交，可按模块回退（ui-controller → constants → demo-controller）

### 6. 实施优先级（融合 CLAUDE-4 分层）
- 高：通知弹窗、核心按钮、Demo 入口文案
- 中：状态说明与细节引导
- 低：开发者调试、日志

### 7. 里程碑（QODER 周计划精简版）
- Week 1
  - D1-D2：引入 i18n 工具、补齐 zh-CN.json 键
  - D3-D4：改造 ui-controller、constants（含通知/演示）
  - D5：基础联调与手测
- Week 2
  - D1-D2：改造 demo-controller、通知/提醒链路
  - D3：语言纯度脚本与门禁
  - D4-D5：全量回归、性能与移动端检查

---

## 三、与现有仓库的对齐说明

- 仓库已存在 locales/zh-CN.json、locales/en.json，新增/补齐键即可，避免破坏结构
- 入口脚本需在首屏前 init i18n（不在本计划中改代码，仅作为后续实施说明）
- js/constants.js 内的用户可见文案，应迁移为 i18n 键访问（保持通知 API 数据结构不变）

---

## 四、产出物与验收

- 文案键清单与 zh-CN.json 增量
- i18n 工具文件 js/i18n.js
- 改造提交 PR（按模块拆分）
- 语言纯度检查脚本及 CI 门禁
- 验收用例清单与结果

---

## 五、结语

本统一方案以 QODER 的可执行与工程深度为主线，结合 CLAUDE-4 的优先级、质量保障与长期维护策略，能在最短时间内实现“零英文混杂”的中文版体验，并通过工具化与门禁机制持续守护体验一致性。