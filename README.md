# dsh-mobile-layout

DeepSeek Harness Web UI 移动端阅读布局优化插件（纯客户端，零依赖）。

## 解决的问题

dsh 0.1.0-rc.6 的 web 外壳几乎没有移动端适配（内置 CSS 只有一条
`@media(pointer:coarse)`）。实测 390px 视口下的问题：

1. **侧栏展开挤压主列**：窄视口（<1024px，app shell 的 `SIDEBAR_AUTO_COLLAPSE`
   断点）展开侧栏时，280px 侧栏以静态列挤压会话列至约 110px，输入框只剩
   68px 宽、发送按钮被推出屏幕外；
2. **Markdown 表格横向溢出**：会话内容中 3 列表格固有宽度 415px，在 262px
   的消息列里只能靠内部滚动条侧滑阅读；
3. **长词溢出**：URL / 路径 / 行内 code 等无断词点的 token 直接溢出视口。

## 方案

- **侧栏抽屉化**：窄视口下侧栏改为 `position: fixed` 覆盖层（含半透明遮罩、
  投影），会话列保持全宽；点击遮罩、会话行或「新会话」按钮关闭抽屉（经
  `ctx.layout` 服务的 `toggleSidebar()`，软依赖）；隐藏桌面端才用得上的拖拽
  调宽手柄。配套显式 pin 三列 `grid-column`（fixed 定位的 grid item 会被
  自动布局跳过，否则 centerCol 会被挤进第 1 列）。
- **表格自适应**：窄视口下 Markdown 表格 `table-layout: fixed; width: 100%`，
  单元格 `overflow-wrap: anywhere` 断长词；滚动容器保留触摸滚动兜底。
- **长词换行**：Markdown 内的行内 `code` / 链接同样 `overflow-wrap: anywhere`。
- **消息头部时间串**：stock CSS 是 `white-space: nowrap` 的 ~400px 单行（窄列
  下被视口裁掉）。改为换行（`body` 前缀提权——app 的插件 CSS 是运行时注入的
  style 标签，同 specificity 靠注入顺序决胜）。
- **composer 按钮行**：stock 单行 `nowrap`，模型名+模式+发送按钮合计 ~780px，
  手机上发送按钮被推出屏幕。改为 `flex-wrap: wrap` + 模型名 ellipsis。

断点严格对齐 app shell：`max-width: 1023.98px`。桌面端（≥1024px）行为完全不变。

## 选择器稳定性

只使用两类稳定钩子，不依赖构建哈希前缀：

- app shell 自有属性：`data-sidebar-collapsed`、`data-shell-overlay`、
  `data-side="sidebar"`；
- CSS-module 类名的非哈希后缀：`[class*="_sidebarCol"]`、
  `[class*="_overlayLayer"]`、`[class*="_markdown"]`、`[class*="_tableScroll"]`。

dsh 升级后若布局类改名需复核（插件 CSS 集中在 `lib/client.js` 顶部）。

## 安装

```bash
dsh plugin --profile web add file:<本目录绝对路径>
```

web profile 的 `cordis.patch.yml` 的 insert 列表加一行：

```yaml
- id: dsh-mobile-layout
  name: dsh-mobile-layout
```

- 热生效：client-modules 注册表对 fiber 构造是响应式的（patch HMR 触发增量
  扫描），新安装的 bundle 对**之后加载的页面**生效——已打开的页面刷新即可，
  无需重启 dsh web 进程。
- 改插件源码后：profile 副本需 `dsh plugin --profile web remove dsh-mobile-layout`
  再 `add`（pnpm file: 依赖拷贝幂等，直接 add 不刷新）。

## 已知限制

- 会话轨迹（details）列在 <996px 下被 app shell 强制为 0 宽，手机上无法打开；
  本插件不覆盖该行为（属框架计算逻辑，CSS 无法干预）。
- composer 底部状态行（token 统计）沿用 stock 的 `text-overflow: ellipsis`
  截断行为，不换行展开（设计如此，非移动端缺陷）。
- 桌面端不使用本插件的任何规则。
