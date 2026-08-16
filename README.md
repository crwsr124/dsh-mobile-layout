# dsh-mobile-layout

DeepSeek Harness Web UI 移动端体验套件：阅读布局 + 字体密度 + 换肤 + 文件浏览器。
host 半注册一个只读文件 HTTP 路由；client 半注入响应式 CSS 与三个交互控制器。
**零依赖**（node 内建模块 + 注入服务）。

## 功能

### 1. 阅读布局（窄视口 <1024px，对齐 app shell 的 `SIDEBAR_AUTO_COLLAPSE`）

- **侧栏无窄栏化（v13）**：手机端不再显示常驻缩减侧栏——网格第一列归零、
  收起态侧栏 `display: none`，会话区占满全宽；顶栏左上角有**鲸鱼按钮**
  （官方 FishLogo 路径 + 玻璃圆钮样式），点击直接展开完整侧栏抽屉（点遮罩 /
  会话行 / 「新会话」收起，经 `ctx.layout.toggleSidebar()` 软依赖）；抽屉打开
  时鲸鱼按钮淡出（z 38 位于抽屉 z 40 之下 + 属性观察器同步）。桌面端保留
  原侧栏行为，鲸鱼按钮不显示。
- **字体密度**：覆盖 `--dsw-font-markdown-*` token——正文 16→14px、h1-h4 收缩、
  code 14→12px；标题/段落/列表边距收紧；消息头时间串 14→12px。
- **表格**：保持 stock 自然宽度（`table-layout: auto`）+ 横向滚动；单元格
  13px + 紧凑 padding；滚动容器加 `-webkit-overflow-scrolling: touch` 与
  `overscroll-behavior-x: contain` 保证触摸滑动流畅不串滑。
- **长词换行**：行内 code / 链接 `overflow-wrap: anywhere`；消息头时间串
  单行不折行（11px nowrap，超长省略）、composer 按钮行（wrap + 模型名
  ellipsis）不再溢出视口。

桌面端（≥1024px）行为完全不变。

### 2. 换肤（侧边栏「主题与背景」按钮，v6 极光玻璃主题）

参考社区换肤插件设计（[dsh-skin](https://github.com/KinGao294/dsh-skin) /
[dsh-theme-plugin](https://github.com/BeiZi6/dsh-theme-plugin) /
[dsh-dream-skin](https://github.com/RevolutionLA/dsh-dream-skin)），并升级为
完整的「极光玻璃」视觉方案：

- **模式**：无 / **玻璃** / 半透明；
- **极光背景**：四套预设（蓝紫 / 暖阳 / 青绿 / 单色·墨）——深色基底渐变之上
  是多层高饱和彩色光斑（26px 高斯模糊，光斑透明度 0.7-0.95），以 12s 周期
  漂移旋转缩放（幅度 5% + rotate ±4° + scale 1.05-1.2 + 透明度呼吸 + 18s
  hue-rotate 色相循环，肉眼清晰可感知）；切换预设时光斑淡出-换色-淡入
  （250ms）；
- **电影颗粒**：SVG feTurbulence 噪点层，overlay 混合 5% 透明度，覆盖全屏
  增加质感；
- **玻璃表面**（v7 兼容性重构）：表面半透明由 **JS 实时计算 rgba** 写入 token
  （`--dsw-alias-bg-base` / `--dsw-specific-sidebar-fill` /
  `--dsw-specific-input-major`，inline `important` 优先级）——**不依赖
  `color-mix()`，所有浏览器可用**；色源取未覆盖的 `bg-layer-1` token，主题
  切换时自动重算（明暗自适应）；默认 60% 不透明度（滑杆 30%–100%），侧栏更
  通透（×0.66）、输入框略实（×0.85）形成层次；毛玻璃 blur：会话区 16px /
  侧栏 26px / 输入框 14px / 面板 24px（+ saturate 1.5-1.7），不支持
  backdrop-filter 的浏览器透明仍生效；**无硬边框**：侧栏/详情列的实线边框
  移除，以柔和深度阴影（12px 32px -18px）+ 输入框卡片 8% 半透明白描边做
  "若隐若现"的分隔；
- **自定义图片**：URL 或**手机相册选图**（canvas 压 1920px JPEG dataURL 存
  localStorage）；选图/填 URL 时**自动从「无」切换到玻璃模式**（修复了选图
  不生效的问题）；iOS 兼容（不用 `background-attachment: fixed`）；
- `prefers-reduced-motion` 用户自动关闭光斑动画；设置存 localStorage；
  面板底部显示本浏览器毛玻璃支持诊断（✓/✗）。

### 3. 文件浏览器（「文件」页签，与对话/轨迹并列）

通过官方 `conversation.view` 列表插槽注册为第三个页签（对话 | 轨迹 | 文件），
点击页签即在会话区内切换；手机远程浏览项目目录、读取文件：

- host 路由 `GET /mobile-files/list|read?path=<绝对路径>`（本包 node 半注册，
  经 `ctx.webServer`，只读、大小上限 2MB 文本 / 40MB 二进制、no-cache）；
- **安全**：每个路径 realpath 后必须落在 patch 配置的 `roots` 白名单内
  （目录穿越 / 符号链接逃逸均被拦，403）；
- 客户端全屏面板：面包屑导航 + 上一级 + 目录列表（类型图标/大小、目录优先）；
- 预览：md（内置轻量 markdown 渲染：标题/列表/引用/代码块/加粗斜体/链接）、
  代码与文本（等宽 pre）、图片（img 直出）、PDF（iframe 内嵌）；
- 所有文件均可「在新标签页打开」（交给浏览器原生查看器）；
- 记住上次浏览目录；403/404/413 等错误就地提示，可一键回默认目录。

## 安装

```bash
dsh plugin --profile web add file:<本目录绝对路径>
```

web profile 的 `cordis.patch.yml` insert 列表加一行（**config 必填 roots**）：

```yaml
- id: dsh-mobile-layout
  name: dsh-mobile-layout
  config:
    roots:
      - /Users/cairui/PCAgent
      - /Users/cairui/git
    defaultPath: /Users/cairui/PCAgent
```

生效方式：

- **客户端（布局/换肤/文件面板 UI）热生效**：client-modules 注册表对 fiber
  构造响应式（patch HMR 触发增量扫描），改 client 代码后 remove+add 刷新副本，
  新加载的页面刷新即可拿到，无需重启 web 进程；
- **host 代码（文件路由）冷生效**：node 半的 `apply` 只在进程 boot 时执行，
  首次安装或改 `lib/index.js` 后需要重启一次 dsh web 进程。

### 4. 输入框滚动自动收起（手机端，v4/v5，免按钮）

**无按钮设计**：上滑阅读时输入框自动滑出屏幕（0.22s 滑落+淡出，随后完全
释放布局空间）；恢复方式仅**点击消息文字**（开关式）——滑回底部不自动弹出
（阅读到底也不会被输入框打断）。防抖与优雅性细节：

- 底部 64px 滞回带：小幅抖动不会误隐藏；
- 输入框有**焦点**（正在输入）时不收起；
- 滑出动画完成后才 `display: none` 释放阅读空间；回到底部先恢复布局再滑入；
- `prefers-reduced-motion` 用户自动关闭动画；
- 只作用于手机视口（<1024px），桌面端完全不受影响；
- **点击消息文字区域收起/展开**（开关式；按钮/链接/工具行等交互元素
  不受影响；正在输入时不收起）；
- 手机端隐藏「Session log」按钮（桌面端保留，桌面窄列时标题行自动换行）；
  标题行为鲸鱼按钮让位（左内边距 44px + 收紧间距）；composer 底部的 token
  统计提示行在手机端隐藏（桌面端保留，切回桌面时自动恢复）。

状态不持久化——每次刷新从可见状态开始，滚一下即进入阅读模式。

### 5. 历史加载 abort 错误自动愈合（v9）

dsh 0.1.0-rc.6 上游竞态：断连/重连或快速切换会话时，在途的历史请求被中止，
`Session.doOpen` 把 AbortError 当作终态错误渲染成「历史加载失败：The user
aborted a request.（internal）」且无重试入口。本插件检测到该错误行后自动
重新打开当前会话（id 取自 `localStorage["dsh.sessions.current"]`，经
`ctx.get("sessions").open(id)`，回退为点击侧边栏选中行）；4 秒后仍失败则
重试一次，再失败则刷新页面兜底。仅对 abort 类错误生效（历史损坏等其他错误
不干预），30 秒冷却防循环。

### 6. 视觉细调（v10/v12）

- **全部线条统一柔化（v12 全局方案）**：在会话区/侧栏/轨迹栏作用域内覆盖
  `--dsw-alias-border-l1/l2/l3/l2-darkmode-thin` 四个边框 token 为 10-12%
  半透明灰——范围内所有分隔线（轨迹工具栏、时间线绘图区、标签列、表格分隔、
  输入框描边、侧栏边线等）一次性变为"若隐若现"，无需逐元素修补；
- **会话头部防重叠**：标题行允许换行（`flex-wrap`），窄列（打开轨迹/小窗口）
  时「标准模式 / 3 个后台任务 / Session log」不再互相挤压；Session log 按钮
  收紧内边距与字号；
- **自定义图片不再糊**：玻璃模式下自定义壁纸的模糊极低——会话区 1px、
  侧栏 4px、输入框 2px、面板 6px（`data-dml-bg="custom"` 门控），图片几乎
  原样显示；表面不透明度微增 9% 补偿文字可读性。

## 侧边栏按钮

「主题与背景」按钮通过官方 `sidebar.footer.action` 插槽注册（`ctx.slots.inject` +
`ctx.slots.register`），组件用 `require("react")` + `require("@deepseek-ai/dsh-client-ui-primitives")`
（平台种子模块，非包依赖）：图标复用官方 `IconPersonalizationOutline16`
（与 dsh 其他图标风格一致）；窄栏模式圆形
36px 图标钮、宽栏模式图标+文字行（样式对齐设置按钮）。面板在桌面端
（≥1024px）自动变为居中对话框。⚠️ 客户端插件用到 `ctx.slots` 必须在
`exports.inject` 声明 `"slots"`，否则服务不可达（静默拿不到，按钮不渲染）。

## 选择器稳定性

只使用两类稳定钩子，不依赖构建哈希前缀：

- app shell 自有属性：`data-sidebar-collapsed`、`data-shell-overlay`、
  `data-side="sidebar"`；
- CSS-module 类名的非哈希后缀：`[class*="_sidebarCol"]`、`[class*="_markdown"]`
  等（Lightning CSS 命名 `<hash>_<name>`，后缀即源类名）。

对抗 app 插件运行时注入的 style 标签（同 specificity 靠注入顺序决胜）时用
`body` 前缀提权或 `!important`。

## 已知限制

- 会话轨迹（details）列在 <996px 下被 app shell 强制为 0 宽，手机上无法打开
  （框架计算逻辑，CSS 无法干预）。
- composer 底部状态行沿用 stock 的 `text-overflow: ellipsis` 截断。
- 文件浏览默认目录为 `defaultPath`（静态配置），不感知当前会话 cwd。
- 旧浏览器兼容：v7 起表面半透明改由 JS 计算 rgba（不依赖 `color-mix`）；
  v8 起布局定位全部用显式 top/left/right/bottom（弃 `inset` 简写，Chrome 87+
  才有——老内核下极光/颗粒层会塌缩为 0 尺寸不可见）；`backdrop-filter`
  不支持的浏览器无模糊但透明与背景照常生效（面板内有诊断）。
