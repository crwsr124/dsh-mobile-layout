# dsh-mobile-layout — 设计与开发细节

> 面向维护者与二次开发者的实现文档。用户文档见 [README.md](README.md)。

## 架构

- **host 半**（`lib/index.js`，零 @deepseek-ai 依赖）：注册文件路由
  `GET /mobile-files/list|read?path=<绝对路径>` 与
  `POST /mobile-files/upload?name=<文件名>&dir=<目标目录>`（v23/v24）。`webServer` 经
  `ctx.inject` **可选注入**——没有 web 服务的 profile 也能加载插件（文件
  浏览器/上传降级）。row 本身也负责让包出现在 host Loader 中，
  client-modules 注册表据此发现 `dsh.client` 半。
- **client 半**（`lib/client.js`，手写 `window.__ModuleLoader__.load({id,
  factory})` CJS-factory 格式，零依赖）：注入一段响应式 CSS + 若干控制器
  （见下）。`react` 与 `@deepseek-ai/dsh-client-ui-primitives` 是平台种子模块
  的 `require`，不算包依赖。
- **发布**：`dsh.bundle.patch`（`cordis.patch.yml`）声明 bundle 行，安装即
  注册 profile bundle 层，免手工 insert；bundle 注册是冷路径（首次需重启）。
  唯一源码在 PCAgent 仓库 `tools/dsh-mobile-layout/`，GitHub 是发布面
  （`tools/dsh_mobile_layout_publish.sh` subtree split + force push）。

## 控制器清单（client 半）

| 控制器 | 作用域 | 说明 |
|---|---|---|
| `abortRetryController` | 全端 | 检测 `_openError` 含 abort → `sessions.open(id)` 重开 → 2s 复查 → reload 兜底；30s 冷却，仅 abort 类触发 |
| `whaleButtonController` | <1024px | 固定定位鲸鱼按钮（官方 FishLogo 路径内联，z38 在抽屉 z40 之下），经 `ctx.layout.toggleSidebar()` 软依赖开抽屉；frame `data-sidebar-collapsed` 属性观察器同步淡出 |
| `composerAutoHideController` | <1024px | 滚动上滑或选择已有会话收起输入框（64px 滞回带、聚焦保护、两段式 display:none 释放空间）；会话切换短暂拦截上游 autofocus 以避免手机键盘弹出；点击消息文字开关式唤回；matchMedia 门控 + 切回桌面自动恢复 |
| `skinController` | 全端（功能） | 极光玻璃皮肤 + 文字对比度强制 + token 覆盖，见下节 |
| `filesViewController` | 全端（功能） | `conversation.view` 插槽第三个页签；vanilla 列表/预览逻辑挂进容器 div；监听 `dml-upload-done`，当前目录收到新文件时自动刷新 |
| `uploadController` | 全端（功能） | 侧边栏「上传文件」按钮（IconPaperclipOutline16，与主题按钮同款式）→ 隐藏多选 input → 逐个 XHR POST（raw body + `?name=`，带进度）→ 固定状态卡反馈；见「文件上传」 |
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

## 文件浏览器

- **协议**：`GET /mobile-files/list?path=` 返回 JSON
  `{path, root, defaultPath, crumbs, entries[{name,path,dir,hidden,size,mtime}], truncated}`
  （目录优先排序、2000 条截断）；`GET /mobile-files/read?path=` 按扩展名判
  文本/二进制（2MB / 40MB 上限），`content-disposition: inline`，HEAD 支持；
  `GET /mobile-files/download?path=` 以 attachment 流式下载，不受预览大小上限影响。
- **客户端一致性**：每次目录导航取消上一请求，并以单调 request id 丢弃晚到响应；
  fetch 使用 `cache: no-store`，从预览返回时强制恢复列表显示；面包屑末尾提供手动刷新。
  预览保存条目的完整绝对路径，打开新页和下载不再通过目录+文件名二次拼接。
- **安全**：realpath 后必须落在 `config.roots` 白名单内（穿越/符号链接逃逸
  403）；只读；no-store。
- **SPA fallback 坑**：webServer 对未注册路径回退 index.html（200 +
  text/html）——client fetch 必须校验 content-type 判断「路由未就绪」
  （首次安装未重启 web 进程时显示友好提示；上传 XHR 同样校验）。

## 文件上传（v23/v24/v25/v26）

- **协议**：`POST /mobile-files/upload?name=<单段文件名>`，body 为文件原始
  字节（不做 multipart——零依赖手写解析风险高，客户端每文件一请求）。成功
  返回 `{saved, name, size}`（JSON）。
- **目标目录（服务端决定，不污染根目录）**：固定落到上传目录——
  `config.uploadDir`（如配置）→ 否则 `<defaultPath>/upload`（自动 mkdir，
  最近存在祖先 + final realpath 双重 roots 校验，符号链接逃逸防护）；两者
  皆无 → 403 upload-disabled（fail-closed）。**客户端不携带目录**（v26
  移除 v24/v25 的 `dir` 参数——「文件页签当前目录」设计按用户反馈废弃：
  上传位置应可预期、与浏览状态解耦）。
- **安全**：文件名强制单段（`/`、`\`、`\0`、控制符、`.`/`..`、>255 字符
  全拒）；`open(path, "wx")` 原子独占创建——**绝不覆盖**，EEXIST 自动追加
  ` (n)` 序号（上限 100）；大小上限 `config.uploadMaxBytes`（默认 500MB，
  手机视频量级）：content-length 快速拒绝 + 流式计数双保险，超限/中断一律
  unlink 半截文件；无读回通道。
- **客户端**：XHR（`upload.onprogress` 进度）+ 固定状态卡（头部明示目标
  目录 / 成功显示落盘完整路径 / 失败显示原因 / 8s 自动收起 / 可手动关闭）；
  `dml-upload-done` 事件让正停在目标目录的文件页签刷新。**响应映射三态**：
  ① JSON → host 判决（saved / 错误 message）；② 200 + 非 JSON → SPA
  fallback（host 半冷，提示重启）；③ 非 200 + 非 JSON → 网关错误——**nginx
  默认 `client_max_body_size` 仅 1MB，大文件在网关侧就被 413（HTML 页）**，
  客户端映射为「文件过大，超出网关大小限制」（2026-08-16 用户 19MB 视频
  三连败实锤：nginx error.log `client intended to send too large body`）。
  反代部署必须同时放开网关 body 上限并关闭请求缓冲
  （`client_max_body_size` / `proxy_request_buffering off`）。
- **认证模型**：路由本身无认证（与只读文件路由一致）——公网部署依赖
  nginx basic auth 等外部防护，README 已知限制注明。

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
  owner 空闲时认领，卸载时用 CAS 语义释放。检测到其他布局 owner 时文件、上传、
  换肤和 abort 自愈仍可用。
- 换肤、文件页签、上传文件、弹层逃逸、abort 自愈为跨端功能（有意为之）；
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

## 发布与单源约定

- 唯一源码 = PCAgent 仓库 `tools/dsh-mobile-layout/`；GitHub 仓库
  `crwsr124/dsh-mobile-layout` 是发布面，历史由
  `tools/dsh_mobile_layout_publish.sh` 重建（subtree split + force push
  到 `refs/heads/main`——空仓库首次建分支需完整 refspec）。
- **subtree split 只取已提交内容**：改完必须先 `git commit` 再跑脚本。
- GitHub 图片经 camo 代理**按 URL 永久缓存**：改图必须给 img src 加版本
  查询参数（`docs/banner-*.gif?v=N`）。
- npm 未发布（装命令为 `dsh plugin add github:crwsr124/dsh-mobile-layout`）；
  发布 npm 后可缩短为包名。
