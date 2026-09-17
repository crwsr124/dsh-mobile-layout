# dsh-mobile-layout — 设计与开发细节

> 面向维护者与二次开发者的实现文档。用户文档见 [README.md](README.md)。

## 架构

- **host 半**（`lib/index.js`，零 @deepseek-ai 依赖）：注册两条文件路由
  `GET /mobile-files/download?sessionId=&path=<绝对路径>` 与
  `POST /mobile-files/upload?sessionId=&name=<名>[&dir=<绝对路径>]`（list/read
  已随文件浏览器退役并从代码移除；upload 于 0.9.1 恢复，`dir` 供目录行按钮用）。`webServer` 经
  `ctx.inject` **可选注入**——没有 web 服务的 profile 也能加载插件（下载
  挂接降级）。row 本身也负责让包出现在 host Loader 中，
  client-modules 注册表据此发现 `dsh.client` 半。
- **client 半**（`lib/client.js`，手写 `window.__ModuleLoader__.load({id,
  factory})` CJS-factory 格式，零依赖）：注入一段响应式 CSS + 若干控制器
  （见下）。`react` 与 `@deepseek-ai/dsh-client-ui-primitives` 是平台种子模块
  的 `require`，不算包依赖。
- **发布**：`dsh.bundle.patch`（`cordis.patch.yml`）声明 bundle 行，安装即
  注册 profile bundle 层，免手工 insert；bundle 注册是冷路径（首次需重启）。
  唯一源码在 PCAgent 仓库 `agents/dsh/plugins/mobile-layout/`，GitHub 是发布面
  （`agents/dsh/scripts/dsh_mobile_layout_publish.sh` subtree split + force push）。

## 控制器清单（client 半）

| 控制器 | 作用域 | 说明 |
|---|---|---|
| `abortRetryController` | 全端 | 检测 `_openError` 含 abort → `sessions.open(id)` 重开 → 2s 复查 → reload 兜底；30s 冷却，仅 abort 类触发 |
| `whaleButtonController` | <1024px | 固定定位鲸鱼按钮（官方 FishLogo 路径内联，z38 在抽屉 z40 之下），经 `ctx.layout.toggleSidebar()` 软依赖开抽屉；frame `data-sidebar-collapsed` 属性观察器同步淡出 |
| `composerAutoHideController` | <1024px | 滚动上滑或选择已有会话收起输入框（64px 滞回带、聚焦保护、两段式 display:none 释放空间）；页面初始化只判定一次：恢复到 `active` 已有会话时默认收起并拦截 autofocus，初始 `hero` 则保持可见且取消后续首次消息误收起；点击“新会话”时预恢复，并监听稳定属性 `data-phase=hero` 在异步切换完成后再次恢复；点击消息文字显示并聚焦；matchMedia 门控 + 切回桌面自动恢复 |
| `skinController` | 全端（功能） | 极光玻璃皮肤 + 文字对比度强制 + token 覆盖，见下节 |
| `filesDownloadController` | 全端（功能） | 给 0.1.5 内置右栏文件树的文件行与文档预览头注入「下载到设备」按钮（MutationObserver + `data-dml-*`），走 `/mobile-files/download`；见「0.1.5 适配」 |
| `filesUploadController` | 全端（功能） | 给 0.1.5 内置文件树的目录行与工具栏注入上传按钮（同一 MutationObserver 体系），共用一个隐藏多选 file input → `POST /mobile-files/upload`；工具栏不带 `dir`（服务端落 `<workspace>/upload`），目录行带 `dir`（落该目录）；成功后点 `[data-files-reload]` 刷新树；见「0.1.5 适配」 |
| `settingsOverlayEscapeController` | 全端 | 见「设置弹层逃逸」 |
| drawer dismissal | <1024px | 点遮罩、会话标题主体或新会话收起抽屉；工作区展开、状态/时间和会话操作菜单保持抽屉展开 |

## 换肤实现

- **表面半透明 = JS 计算 rgba + 官方主题 override layer**（不依赖
  `color-mix`，Chrome 111 之前的浏览器可用）：解析当前
  `--dsw-alias-bg-layer-1` 计算值（`parseColor` 处理 #hex / rgb() /
  color(srgb) 三种形态）→ 按滑杆 alpha 生成 rgba → 通过
  `theme.overrideTokens()` 发布成具名可撤销层。关闭皮肤或卸载时移除本层，
  自动恢复下一层主题，不直接删除其他插件的 inline 值。覆盖 token 包括：
  `--dsw-alias-bg-base`、`--dsw-specific-sidebar-fill`（×0.66）、
  `--dsw-specific-input-major`（×0.85）、`--dsw-specific-bubble`（用户气泡）、
  `--dsw-alias-markdown-code-block` / `-banner` / `-inline-code`（代码块，
  色向中性灰偏 12% 保高透明度边界）、`--dsw-alias-scrollbar-bg/hover-l1/l2`
  （滑杆 clamp(0.45, a+0.25, 0.9) 保可抓取）、`--dml-header-bg` /
  `--dml-toolbar-bg`（85%→0 渐变）。
- **接缝无缝的数学**：半透明层是叠加合成而非替换——头部渐变的终点必须是
  alpha 0（全透明），接缝处可视值才等于底层原值；任何「淡到目标值」都会
  在接缝处形成可见台阶。
- **Chromium 渐变底缘缺陷**：透明 1px 边框 + background-image 渐变会把底缘
  行渲染成渐变首色（1px 白线）——玻璃化元素一律 `border-bottom: none`
  （截图像素扫描消融实验定位）。
- **明暗自适应**：背景预设或图片亮度决定临时呈现的明暗 palette；
  `theme/change` 只在皮肤仍持有明暗所有权时重新断言，表面 token 随最终测光结果
  重新发布。背景和明暗分别使用 owner attribute + compare-and-restore 语义，检测到
  其他视觉插件 owner 时整套皮肤自动退让。
- **边框柔化**：玻璃/半透明皮肤激活时在三列作用域覆盖
  `--dsw-alias-border-l1/l2/l3/l2-darkmode-thin` 为 10-12% 半透明灰
  （自定义属性按继承解析，范围内所有用 token 的边框一次性变淡）。

## 文字对比度强制（v20）

皮肤激活时按背景明暗驱动应用主题呈现：极光蓝紫/暖阳/青绿=浅色主题、
单色·墨=深色主题、自定义图片=canvas 24×24 感知亮度采样（≥128 判浅）。
机制：基础明暗仍由 `body[data-ds-dark-theme]` + `documentElement.style.colorScheme`
选择，插件只做临时呈现，不改用户外观偏好。写入前检查
`data-dsh-color-scheme-owner`，释放时仅在 owner 和当前值仍属于本插件时恢复
`ctx.theme.getTheme().active.colorScheme`；若其他插件已接管则不覆盖。跨域图片采样：先
`crossOrigin="anonymous"`，失败降级无 CORS 重试，canvas 被污染则回退深色。

## 设置弹层逃逸（v19）

应用把设置 overlay（`position:fixed`）渲染为侧栏 DOM 后代；玻璃皮肤给侧栏的
`backdrop-filter` 按 CSS 包含块规则成为 fixed 后代的包含块 → 弹层被钉在
280px 抽屉里。修复：MutationObserver（120ms debounce）找固定 overlay → 祖先链
backdrop-filter 临时置 none（Map 记原值）→ 关闭恢复。判据必须用「Map 里有
记录」而非「computed bf 非 none」（后者会因自己刚置的 none 误判恢复，形成
闪烁循环）。≤640px 面板另加纵向重排（导航横排芯片行）。内容列必须形成完整的
flex 收缩链（`content min-height:0` → `options flex:1; min-height:0`），并由
`options` 独立承担 `overflow-y:auto`；否则模型编辑器等长表单只会撑出固定高度
panel，触摸手势找不到可滚动祖先。滚动区保留 iOS safe-area 底部留白。

## 0.1.5 适配：下载/上传挂接内置文件面板（0.9.0 下载 / 0.9.1 上传）

dsh 0.1.5 内置工作区文件能力（`workspace-files` + `file-upload` +
`ui-sidebar-files` / `ui-sidebar-documentpreview` 右侧边栏）。本插件的
「文件」页签在 0.9.0 退役（浏览交内置），但**上传并非浏览的一部分**，故
0.9.1 把它恢复为内置面板上的按钮；host 半保留 `GET /mobile-files/download`
与 `POST /mobile-files/upload`（list/read 路由代码移除；**运行中的 web 进程
在下次重启前仍挂载旧四动作路由面，属冷路径过渡态**）。

- **下载入口注入**：MutationObserver（150ms debounce）装饰两类锚点——
  文件树行 `li[data-files-entry="file"][data-files-path="<绝对路径>"]`
  （树根自带 `data-files-root`）与文档预览头 `[data-textpreview-path][title="<绝对路径>"]`
  （按钮 `insertBefore` 到 `[data-textpreview-tool="reload"]` 之前）。
  路径完全取自面板自身 DOM，不复活浏览 UI；行内按钮绝对定位右侧、
  `li.dml-dl-host` 补 `padding-right` 防止与文件名省略号重叠。
- **下载链路**：`GET /mobile-files/download?sessionId=&path=` + XHR blob
  （`data-dml-state=busy/done/fail`，进度写按钮文本）→ objectURL +
  `a[download]` 派发。sessionId 取 `sessions.list` 快照当前会话，
  fallback `localStorage["dsh.sessions.current"]`；Host 服务端重新解析
  工作区根并拒绝越界，会话过期退化为可见报错而非错文件。
- **清理**：dispose 时移除全部注入按钮、回收 `dml-dl-host`、断开 observer；
  React 重渲染移除节点后由 observer 重扫补挂（`isConnected` 剪枝防泄漏）。
- **上传入口注入（0.9.1）**：同一 observer 体系再装饰两类锚点——目录行
  `li[data-files-entry="directory"][data-files-path]`（按钮带 `data-dml-dir`，
  样式 `.dml-ul`）与树工具栏（`insertBefore` 到 `[data-files-reload]` 之前，
  不带 `dir`）。全部按钮共用一个隐藏 `<input type="file" multiple>`
  （`data-dml-upload-input`，按需创建并在 DOM 中复用）；选毕逐文件 `POST`
  原始 body（XHR 上传进度写按钮文本 `0%…100%`），成功后延迟 1.2s 复位并
  点 `[data-files-reload]` 刷新树。
- **上传安全（host 半）**：`name` 强制单段（拒 `/`、`\`、NUL、控制符、`.`/`..`、
  >255 字符）；`dir` 必须 realpath 落在会话工作区内且为已存在目录（越界 403、
  不存在 404、非目录 400）；重名用 `open(…, "wx")` 独占创建、EEXIST 时自动
  ` (n)`（最多 100 次），**绝不覆盖**；content-length 与流式计数双重大小上限
  （`config.uploadMaxBytes`，默认 500 MB），超限 413 并清理半截文件。

### 内置文件面板透明问题（0.9.0 修复，实机归因）

- **现象**：390×844 + 玻璃皮肤下，新右栏文件面板完全透明（会话文字透过
  面板重叠在文件名上）。
- **归因**：`P3OORG_panel`（ui-sidebar-right）与 `pI_x6G_frame`（app frame）
  直接 `background: var(--dsw-alias-bg-base)`；皮肤 token 层把该 token 覆盖为
  `rgba(255,255,255,0.35)`（inline on body，**不经 style 标签**——移除
  mobile.css 复测不恢复，中和 token 后恢复 `rgb(255,255,255)` stock 值）。
  旧玻璃模糊规则只写了 `_sidebarCol/_detailsCol`，新列类是 `_rightbarCol`，
  全链 backdrop-filter=none → 35% 半透明白无磨砂直达极光背景。
- **修复**：glass/semi（含 custom 底降档）给 `[class*="_rightbarCol"]`
  补 backdrop-filter（与 `_detailsCol` 同参数）；设置弹层逃逸控制器对
  fixed overlay 祖先链的 backdrop-filter 临时置 none 机制自动覆盖新列。

## 兼容性清单

- `color-mix`（Chrome 111+/Safari 16.2+）：表面色全部由 JS 计算 rgba 规避；
  `.dml-chip.on` 保留 color-mix 但带纯 rgba fallback 行（老内核丢弃声明时
  用 fallback）。
- `inset` 简写（Chrome 87+）：插件自身定位全部显式 top/left/right/bottom；
  另给应用弹层补 `[class*="_overlay"],[class*="_mask"]` 显式四边（老内核下
  应用自己的 `inset:0` 被丢弃会导致设置弹层塌缩偏出屏幕——v18 的教训）。
- `backdrop-filter`：不支持时透明与背景照常生效，仅无模糊；面板底部有
  支持诊断（含 -webkit- 前缀判断）。
- `background-attachment: fixed`：iOS 有坑，不用。
- `:has()` 选择器：仅用于皮肤增强规则；不支持时该规则整条丢弃、其余照常。
- `prefers-reduced-motion`：光斑动画自动关闭（用户明确要求动画时已移除
  该开关——取舍由用户拍板）。

## 选择器稳定性约定

只使用两类稳定钩子，不依赖构建哈希前缀：

- app shell 自有属性：`data-sidebar-collapsed`、`data-shell-overlay`、
  `data-side="sidebar"`、`data-ds-dark-theme`；
- CSS-module 类名的非哈希后缀（Lightning CSS 命名 `<hash>_<name>`，后缀即
  源类名）：`[class*="_sidebarCol"]`、`[class*="_markdown"]`、
  `[class$="_nav"]` 等。

注意：`[class*="_x"]` 是子串匹配（`[class*="_action"]` 会命中 `_actions`
容器本身，需用 `[class$="_action"]`）；`_actions`/`_overlay` 是语义化通用
后缀，裸用做布局改写必翻车（v22 教训：`[class*="_actions"]{flex-wrap:wrap}`
误伤消息操作行导致时间串压进下一条消息）。对抗应用插件运行时注入的 style
标签（同 specificity 靠注入顺序决胜）时用 `body` 前缀提权或 `!important`。

## 作用域契约

- 阅读布局/输入框行为全部媒体查询门控（<1024px），且仅在
  `body[data-dsh-mobile-layout-owner="dsh-mobile-layout"]` 下生效；插件启动时只在
  owner 空闲时认领，卸载时用 CAS 语义释放。检测到其他布局 owner 时下载挂接、
  换肤和 abort 自愈仍可用。
- 换肤、下载挂接、弹层逃逸、abort 自愈为跨端功能（有意为之）；
- 表面 token 由 `theme.overrideTokens()` 分层管理；背景、明暗呈现和布局各自使用
  owner 属性，关闭/卸载仅恢复本插件仍拥有的值，不会清空后写入者状态。边框柔化
  挂在 `body[data-dsh-mobile-skin]` 下。仅 `_overlay/_mask` 显式四边为无条件兼容
  规则（现代浏览器与 stock 等价）。

## 版本历史摘要

| 版本 | 内容 |
|---|---|
| v4/v5 | 输入框滚动自动收起（免按钮） |
| v6/v7 | 极光玻璃换肤；表面 JS rgba 计算（color-mix 兼容性重构） |
| v8 | 显式四边（弃 inset 简写） |
| v9 | 历史加载 abort 自动愈合 |
| v10/v12 | 视觉细调：边框 token 批量柔化、标题行换行、自定义壁纸降模糊 |
| v13 | 无窄栏化 + 鲸鱼按钮（侧栏抽屉化终稿） |
| v14 | 文件浏览器改第三页签 |
| v15-v17 | 输入框「点击才出现」语义；默认透明度 30%、滑杆 0-100% |
| v18 | 弹层显式四边（老内核 inset 兜底） |
| v19 | 设置弹层逃逸 + 移动端面板纵向重排 |
| v20 | 文字对比度按背景明暗自动适配 |
| v21 | 气泡/滚动条/代码块透明化 |
| v22 | 修复时间串与气泡重叠（宽泛 `_actions` 规则回滚） |
| v23 | 侧边栏上传文件按钮 + `POST /mobile-files/upload`（防穿越防覆盖、100MB 上限） |
| v24 | 上传目录动态化（文件页签当前目录）+ 500MB 上限 + 网关 413 错误映射 |
| v25 | 回退目录不再落根目录：`uploadDir` 配置或自动创建 `<defaultPath>/upload`（专用子目录） |
| v26 | 移除 `dir` 参数（文件页签当前目录设计废弃），上传位置固定由服务端决定；上传按钮图标改回形针（与主题按钮同款式） |
| v27 / 0.7.0 | 高风险共存修复：theme override layer、背景/明暗/布局 owner + CAS 恢复、完整热卸载；目录请求取消与防缓存、手动刷新、流式下载到设备 |
| 0.7.2 | 修复移动端设置模型编辑长表单无法滚动：补齐 flex 收缩链、内容区惯性滚动与底部安全区 |
| 0.7.3 | 曾按 root-slot/HMR 假设加入空根刷新；后续精确复现证明与本问题无关，0.7.4 已撤销 |
| 0.7.4 | 修复移动端阅读态的 composer 隐藏类跨会话残留：新建空白会话进入 hero 时强制恢复唯一输入主体 |
| 0.7.5 | 刷新恢复已有会话时默认进入阅读态：初始化 active 仅自动收起一次，点击消息正文后显示并聚焦；初始 hero 保持可见 |
| 0.8.0 | 文件浏览器根目录自动跟随当前会话工作区；Host 按 sessionId 从 Workspace 注册表解析可信根，删除 roots/defaultPath/uploadDir 配置；上传进入 `<workspace>/upload` |
| 0.8.1 | 同工作区切换会话保留目录缓存，并按 workspace+directory 恢复文件列表滚动位置；跨工作区才回根请求 |
| 0.8.2 | 文件 view 独立滚动区修复：补齐 viewArea/dml-files-view/list flex 收缩链，切换页签不再复用 conversation scrollBody 的底部位置；按 workspace+directory 双帧恢复 scrollTop |
| 0.8.3 | 收窄文件 viewArea CSS 作用域：仅文件页签挂载 `dml-files-view-area`，修复误伤对话页滚动 |
| 0.8.4 | rc.1 客户端服务守卫适配：inject 声明补 `sessions`（未声明服务 `ctx.get()` 拿不到） |
| 0.9.0 | dsh 0.1.5 移动端回归：移除文件页签（浏览交 0.1.5 内置），host 半只保留 `/mobile-files/download`；新增 `filesDownloadController` 给内置右栏文件行与文档预览头注入下载入口；修复玻璃/半透明皮肤下新右栏列（`_rightbarCol`）无磨砂导致的面板透明 |
| 0.9.1 | **恢复上传**（它不是文件浏览器的一部分）：工具栏「上传」维持 `<workspace>/upload` 原语义，目录行新增「上传到此目录」（`dir` 参数）；host 半恢复 `POST /mobile-files/upload` 并补 `dir` 校验（越界 403 / 不存在 404 / 非目录 400）；新增 `filesUploadController` 与 `.dml-ul*` 样式，与下载按钮同款 |

## 发布与单源约定

- 唯一源码 = PCAgent 仓库 `agents/dsh/plugins/mobile-layout/`；GitHub 仓库
  `crwsr124/dsh-mobile-layout` 是发布面，历史由
  `agents/dsh/scripts/dsh_mobile_layout_publish.sh` 重建（subtree split + force push
  到 `refs/heads/main`——空仓库首次建分支需完整 refspec）。
- **subtree split 只取已提交内容**：改完必须先 `git commit` 再跑脚本。
- GitHub 图片经 camo 代理**按 URL 永久缓存**：改图必须给 img src 加版本
  查询参数（`docs/banner-*.gif?v=N`）。
- npm 未发布（装命令为 `dsh plugin add github:crwsr124/dsh-mobile-layout`）；
  发布 npm 后可缩短为包名。
