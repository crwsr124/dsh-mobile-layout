# dsh-mobile-layout

DeepSeek Harness Web UI 移动端体验套件：阅读布局 + 字体密度 + 换肤 + 文件浏览器。
host 半注册一个只读文件 HTTP 路由；client 半注入响应式 CSS 与三个交互控制器。
**零依赖**（node 内建模块 + 注入服务）。

## 功能

### 1. 阅读布局（窄视口 <1024px，对齐 app shell 的 `SIDEBAR_AUTO_COLLAPSE`）

- **侧栏抽屉化**：侧栏改 `position: fixed` 覆盖层 + 半透明遮罩，会话列保持全宽；
  点遮罩 / 会话行 / 「新会话」按钮收起（经 `ctx.layout.toggleSidebar()`，软依赖）；
  显式 pin 三列 `grid-column`（fixed 的 grid item 会被自动布局跳过，否则 centerCol
  被挤进第 1 列）。
- **字体密度**：覆盖 `--dsw-font-markdown-*` token——正文 16→14px、h1-h4 收缩、
  code 14→12px；标题/段落/列表边距收紧；消息头时间串 14→12px。
- **表格**：保持 stock 自然宽度（`table-layout: auto`）+ 横向滚动；单元格
  13px + 紧凑 padding；滚动容器加 `-webkit-overflow-scrolling: touch` 与
  `overscroll-behavior-x: contain` 保证触摸滑动流畅不串滑。
- **长词换行**：行内 code / 链接 `overflow-wrap: anywhere`；消息头时间串、
  composer 按钮行（wrap + 模型名 ellipsis）不再溢出视口。

桌面端（≥1024px）行为完全不变。

### 2. 换肤（侧边栏「主题与背景」按钮）

参考社区换肤插件设计（[dsh-skin](https://github.com/KinGao294/dsh-skin) /
[dsh-theme-plugin](https://github.com/BeiZi6/dsh-theme-plugin) /
[dsh-dream-skin](https://github.com/RevolutionLA/dsh-dream-skin)）：

- 模式：无 / **玻璃**（表面半透明 + 侧栏 backdrop-filter 模糊）/ **半透明**；
- 背景：内置两种渐变 + 自定义图片 URL + **从手机相册选择图片**（本地图片
  canvas 压缩到 1920px JPEG dataURL 存 localStorage，不占服务器）；
- 表面不透明度滑杆（45%–100%）；
- 实现：`color-mix(in srgb, var(--dsw-alias-bg-layer-1) α, transparent)` 覆盖
  `--dsw-alias-bg-base` / `--dsw-specific-sidebar-fill`——引用未覆盖的 token，
  明暗主题自动适配、无需快照；
- 设置存 localStorage（仅本浏览器，与社区插件一致）。

### 3. 文件浏览器（侧边栏「文件」按钮）

手机远程浏览项目目录、读取文件：

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

## 侧边栏按钮

两个入口按钮通过官方 `sidebar.footer.action` 插槽注册（`ctx.slots.inject` +
`ctx.slots.register`），组件用 `require("react")` + `require("@deepseek-ai/dsh-client-ui-primitives")`
（平台种子模块，非包依赖）：图标复用官方 `IconFolderOpen16` /
`IconPersonalizationOutline16`（与 dsh 其他图标风格一致）；窄栏模式圆形
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
- 颜色混合依赖 `color-mix`（Chrome 111+ / Safari 16.2+，2023 年后设备均支持）；
  旧浏览器上换肤不生效但布局功能不受影响。
