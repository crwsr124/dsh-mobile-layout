/**
 * dsh-mobile-layout, browser half. Prebuilt client bundle in the exact
 * `window.__ModuleLoader__.load({ id, factory })` CJS-factory format the
 * dsh client module system consumes (hand-written, zero dependencies).
 *
 * Sections:
 *  1. Responsive stylesheet (<1024px, the app shell's SIDEBAR_AUTO_COLLAPSE):
 *     drawer sidebar + whale button, reading density, tables, header rows.
 *  2. Skin controller: aurora glass theme (JS-computed rgba surfaces for
 *     old-kernel compatibility), background presets + custom images,
 *     readability-contrast pinning (the app's dark/light palette follows
 *     the background luminance), persisted in localStorage.
 *  3. File browser (文件 tab): directory browsing + preview over the host's
 *     /mobile-files route registered by this package's node half.
 *  4. Composer auto-hide (mobile), abort-error auto-heal, settings-dialog
 *     escape + mobile settings layout, drawer dismissal.
 *
 * Scope contract: the reading layout and composer behaviour are media-gated
 * (<1024px); the skin, the files tab and the settings-dialog fix work on
 * every viewport on purpose (features, not layout hacks). With the skin off
 * or the plugin uninstalled, the app is fully stock.
 *
 * Stable selectors only: app-shell data-* attributes and the non-hashed
 * CSS-module class-name suffixes ([class*="_sidebarCol"] etc.).
 */
window.__ModuleLoader__.load({
	id: "dsh-mobile-layout",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		const css = [
			"/* ===== dsh-mobile-layout ===== */",
			"@media (max-width: 1023.98px) {",
			"  /* --- visual rules apply only while this plugin owns mobile layout --- */",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] :has(> [class*=\"_sidebarCol\"]) {",
			"    grid-template-columns: 0 minmax(0, 1fr) 0 !important;",
			"  }",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] :has(> [class*=\"_sidebarCol\"])[data-sidebar-collapsed] > [class*=\"_sidebarCol\"] { display: none; }",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] :has(> [class*=\"_sidebarCol\"]) > [class*=\"_sidebarCol\"] { grid-column: 1 !important; }",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] :has(> [class*=\"_sidebarCol\"]) > [class*=\"_centerCol\"] { grid-column: 2 !important; }",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] :has(> [class*=\"_sidebarCol\"]) > [class*=\"_detailsCol\"] { grid-column: 3 !important; }",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] :has(> [class*=\"_sidebarCol\"]):not([data-sidebar-collapsed]) > [class*=\"_sidebarCol\"] {",
			"    position: fixed; top: 0; left: 0; bottom: 0; width: min(280px, 85vw);",
			"    z-index: 40; box-shadow: 16px 0 48px rgb(0 0 0 / 0.45);",
			"  }",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] :has(> [class*=\"_sidebarCol\"]):not([data-sidebar-collapsed]) > [class*=\"_overlayLayer\"] {",
			"    pointer-events: auto; background: rgb(0 0 0 / 0.4); z-index: 30; transition: background-color 0.2s;",
			"  }",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] :has(> [class*=\"_sidebarCol\"]) [data-side=\"sidebar\"] { display: none; }",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] {",
			"    --dsw-font-markdown-base: 14px/22px var(--dsw-font-family) !important;",
			"    --dsw-font-markdown-base-strong: 600 14px/22px var(--dsw-font-family) !important;",
			"    --dsw-font-markdown-h1: 700 19px/26px var(--dsw-font-family) !important;",
			"    --dsw-font-markdown-h2: 700 18px/25px var(--dsw-font-family) !important;",
			"    --dsw-font-markdown-h3: 700 17px/24px var(--dsw-font-family) !important;",
			"    --dsw-font-markdown-h4: 600 15px/22px var(--dsw-font-family) !important;",
			"    --dsw-font-markdown-code: 12px/19px var(--ds-font-family-code) !important;",
			"  }",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] [class*=\"_markdown\"] p { margin: 10px 0; }",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] [class*=\"_markdown\"] h1,",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] [class*=\"_markdown\"] h2,",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] [class*=\"_markdown\"] h3 { margin: 20px 0 10px; }",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] [class*=\"_markdown\"] h4 { margin: 12px 0 8px; }",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] [class*=\"_markdown\"] :where(ul,ol) { margin: 10px 0; }",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] [class*=\"_markdown\"] hr { margin: 20px 0; }",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] [class*=\"_markdown\"] blockquote { margin: 10px 0 0; }",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] [class*=\"_markdown\"] pre { margin: 10px 0; }",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] [class*=\"_timeEnd\"] { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 11px; }",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] [class*=\"_timeStart\"] { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] [class*=\"_source\"] { white-space: normal; overflow-wrap: anywhere; }",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] [class*=\"_actions\"] [class$=\"_action\"] { flex: none; }",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] [class*=\"_markdown\"] th,",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] [class*=\"_markdown\"] td { font-size: 13px; padding: 6px 10px 6px 0; }",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] [class*=\"_tableScroll\"] { -webkit-overflow-scrolling: touch; overscroll-behavior-x: contain; scrollbar-width: thin; }",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] [class*=\"_markdown\"] code,",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] [class*=\"_markdown\"] a { overflow-wrap: anywhere; }",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] [class*=\"_composerSeat\"] [class*=\"_row\"] { flex-wrap: wrap; }",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] [class*=\"_composerSeat\"] [class*=\"_trigger\"] { min-width: 0; }",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] [class*=\"_composerSeat\"] [class*=\"_triggerLabel\"] { overflow: hidden; text-overflow: ellipsis; }",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] [class*=\"_centerCol\"] [class*=\"_titleRow\"] { padding-left: 44px; gap: 6px; }",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] [class*=\"_centerCol\"] [class*=\"_titleCluster\"] { min-width: 0; }",
			"}",
			"",
			"/* ===== whale button (mobile session drawer trigger) ===== */",
			".dml-whale-btn {",
			"  display: none;",
			"  position: fixed; top: 12px; left: 12px; z-index: 38;",
			"  width: 32px; height: 32px;",
			"  align-items: center; justify-content: center;",
			"  cursor: pointer; color: var(--dsw-alias-label-secondary);",
			"  background: transparent;",
			"  border: none;",
			"  padding: 0;",
			"  transition: opacity 0.18s ease, color 0.15s ease;",
			"  -webkit-tap-highlight-color: transparent;",
			"}",
			".dml-whale-btn:active { color: var(--dsw-alias-label-primary); transform: scale(0.94); }",
			"@media (max-width: 1023.98px) { body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] .dml-whale-btn { display: flex; } }",
			"",
			"/* ===== composer auto-hide on scroll (mobile, button-free) ===== */",
			"@media (max-width: 1023.98px) {",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] [class*=\"_composerSeat\"] {",
			"    transition: transform 0.22s ease, opacity 0.22s ease;",
			"  }",
			"  /* phase 1: slide down + fade out (pointer-inert during the slide) */",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"].dml-composer-auto-hidden [class*=\"_composerSeat\"] {",
			"    transform: translateY(48px);",
			"    opacity: 0;",
			"    pointer-events: none;",
			"  }",
			"  /* phase 2: reclaim the reading space */",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"].dml-composer-auto-gone [class*=\"_composerSeat\"] {",
			"    display: none;",
			"  }",
			"  @media (prefers-reduced-motion: reduce) {",
			"    body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] [class*=\"_composerSeat\"] { transition: none; }",
			"  }",
			"}",
			"",
			"/* ===== uniform faint seams: soften every border token inside the app",
			"   columns — skin-gated so that with the skin off the app is fully",
			"   stock (this plugin never restyles the app outside its own skin) ==== */",
			"body[data-dsh-mobile-skin=\"glass\"] [class*=\"_centerCol\"],",
			"body[data-dsh-mobile-skin=\"glass\"] [class*=\"_sidebarCol\"],",
			"body[data-dsh-mobile-skin=\"glass\"] [class*=\"_detailsCol\"],",
			"body[data-dsh-mobile-skin=\"semi\"] [class*=\"_centerCol\"],",
			"body[data-dsh-mobile-skin=\"semi\"] [class*=\"_sidebarCol\"],",
			"body[data-dsh-mobile-skin=\"semi\"] [class*=\"_detailsCol\"] {",
			"  --dsw-alias-border-l1: rgb(127 127 127 / 0.10);",
			"  --dsw-alias-border-l2: rgb(127 127 127 / 0.10);",
			"  --dsw-alias-border-l3: rgb(127 127 127 / 0.10);",
			"  --dsw-alias-border-l2-darkmode-thin: rgb(127 127 127 / 0.12);",
			"}",
			"",
			"/* ===== old-kernel inset fix: app overlays/masks use the inset shorthand,",
			"   which unsupported browsers collapse to zero size (settings dialog",
			"   shows incompletely). Explicit sides restore full-screen overlays. ==== */",
			"[class*=\"_overlay\"],",
			"[class*=\"_mask\"] {",
			"  top: 0; left: 0; right: 0; bottom: 0;",
			"}",
			"",
			"/* ===== mobile settings dialog layout: the app's settings panel is a",
			"   fixed 188px nav column + content row — inside a phone viewport the",
			"   content column shrinks to ~90-150px and sections break apart. On",
			"   narrow screens restack: nav becomes a horizontal chip row on top,",
			"   content takes the full width. (The overlay itself is un-pinned",
			"   from the drawer by settingsOverlayEscapeController.) ==== */",
			"@media (max-width: 639.98px) {",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] [class*=\"_overlay\"] > [class$=\"_panel\"] {",
			"    flex-direction: column;",
			"    width: calc(100vw - 16px);",
			"    max-width: calc(100vw - 16px);",
			"    height: calc(100vh - 16px);",
			"  }",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] [class*=\"_overlay\"] > [class$=\"_panel\"] [class$=\"_nav\"] {",
			"    flex-direction: row;",
			"    width: 100%;",
			"    height: auto;",
			"    gap: 2px;",
			"    padding: 10px 12px 0;",
			"    overflow-x: auto;",
			"    overflow-y: visible;",
			"    scrollbar-width: none;",
			"    -webkit-overflow-scrolling: touch;",
			"  }",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] [class*=\"_overlay\"] > [class$=\"_panel\"] [class$=\"_nav\"]::-webkit-scrollbar { display: none; }",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] [class*=\"_overlay\"] > [class$=\"_panel\"] [class$=\"_navTitle\"] { display: none; }",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] [class*=\"_overlay\"] > [class$=\"_panel\"] [class$=\"_navList\"] { flex-direction: row; }",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] [class*=\"_overlay\"] > [class$=\"_panel\"] [class$=\"_navCell\"] { flex: none; height: 34px; padding: 7px 14px; }",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] [class*=\"_overlay\"] > [class$=\"_panel\"] [class$=\"_header\"] { height: auto; min-height: 42px; padding: 12px 14px 4px 10px; }",
			"}",
			"",
			"/* ===== skin: aurora glass theme (surface alpha set from JS for browser compatibility) ===== */",
			"body[data-dsh-mobile-skin=\"glass\"] [class*=\"_centerCol\"] {",
			"  backdrop-filter: blur(16px) saturate(1.6);",
			"  -webkit-backdrop-filter: blur(16px) saturate(1.6);",
			"}",
			"/* top bar: fixed 70% fading into the content alpha — seamless */",
			"body[data-dsh-mobile-skin=\"glass\"] [class*=\"_centerCol\"] [class$=\"_header\"],",
			"body[data-dsh-mobile-skin=\"semi\"] [class*=\"_centerCol\"] [class$=\"_header\"] {",
			"  background: var(--dml-header-bg, transparent);",
			"  border-bottom: none; /* transparent border triggers the Chromium gradient edge artifact (1px white line at the bottom edge) */",
			"}",
			"body[data-dsh-mobile-skin=\"glass\"] [class*=\"_centerCol\"] [class$=\"_header\"]::after,",
			"body[data-dsh-mobile-skin=\"semi\"] [class*=\"_centerCol\"] [class$=\"_header\"]::after {",
			"  display: none;",
			"}",
			"/* trajectory toolbar: frosted pill (fades in/out at both edges, no border)",
			"   so it blends seamlessly; older kernels keep the stock surface */",
			"body[data-dsh-mobile-skin=\"glass\"] [class*=\"_centerCol\"] [class*=\"_root\"]:has([class*=\"_toggle\"]),",
			"body[data-dsh-mobile-skin=\"semi\"] [class*=\"_centerCol\"] [class*=\"_root\"]:has([class*=\"_toggle\"]) {",
			"  background: var(--dml-toolbar-bg, transparent);",
			"  border-bottom: none;",
			"}",
			"body[data-dsh-mobile-skin=\"glass\"] [class*=\"_sidebarCol\"],",
			"body[data-dsh-mobile-skin=\"semi\"] [class*=\"_sidebarCol\"] {",
			"  backdrop-filter: blur(26px) saturate(1.7);",
			"  -webkit-backdrop-filter: blur(26px) saturate(1.7);",
			"  border-right: none !important;",
			"  box-shadow: 12px 0 32px -18px rgb(0 0 0 / 0.45);",
			"}",
			"body[data-dsh-mobile-skin=\"glass\"] [class*=\"_composerSeat\"],",
			"body[data-dsh-mobile-skin=\"semi\"] [class*=\"_composerSeat\"] {",
			"  backdrop-filter: blur(14px) saturate(1.5);",
			"  -webkit-backdrop-filter: blur(14px) saturate(1.5);",
			"}",
			"body[data-dsh-mobile-skin=\"glass\"] [class*=\"_detailsCol\"],",
			"body[data-dsh-mobile-skin=\"semi\"] [class*=\"_detailsCol\"] {",
			"  border-left: none !important;",
			"}",
			"body[data-dsh-mobile-skin=\"glass\"] [class*=\"_composerSeat\"] [class*=\"_card\"],",
			"body[data-dsh-mobile-skin=\"semi\"] [class*=\"_composerSeat\"] [class*=\"_card\"] {",
			"  border-color: rgb(255 255 255 / 0.08);",
			"}",
			"body[data-dsh-mobile-skin=\"glass\"] .dml-panel {",
			"  backdrop-filter: blur(24px) saturate(1.6);",
			"  -webkit-backdrop-filter: blur(24px) saturate(1.6);",
			"}",
			"body[data-dsh-mobile-skin=\"semi\"] [class*=\"_centerCol\"] {",
			"  backdrop-filter: blur(5px);",
			"  -webkit-backdrop-filter: blur(5px);",
			"}",
			"/* custom image: keep it sharp (much lighter surface blur) */",
			"body[data-dml-bg=\"custom\"][data-dsh-mobile-skin=\"glass\"] [class*=\"_centerCol\"] {",
			"  backdrop-filter: blur(1px) saturate(1.02);",
			"  -webkit-backdrop-filter: blur(1px) saturate(1.02);",
			"}",
			"body[data-dml-bg=\"custom\"][data-dsh-mobile-skin=\"glass\"] [class*=\"_sidebarCol\"] {",
			"  backdrop-filter: blur(4px) saturate(1.05);",
			"  -webkit-backdrop-filter: blur(4px) saturate(1.05);",
			"}",
			"body[data-dml-bg=\"custom\"][data-dsh-mobile-skin=\"glass\"] [class*=\"_composerSeat\"] {",
			"  backdrop-filter: blur(2px);",
			"  -webkit-backdrop-filter: blur(2px);",
			"}",
			"body[data-dml-bg=\"custom\"][data-dsh-mobile-skin=\"glass\"] .dml-panel {",
			"  backdrop-filter: blur(6px) saturate(1.1);",
			"  -webkit-backdrop-filter: blur(6px) saturate(1.1);",
			"}",
			"body[data-dml-bg=\"custom\"][data-dsh-mobile-skin=\"semi\"] [class*=\"_centerCol\"] {",
			"  backdrop-filter: none;",
			"  -webkit-backdrop-filter: none;",
			"}",
			"/* conversation header: wrap instead of overlapping on narrow columns",
			"   (defensive on every viewport — opening the details column squeezes",
			"   the center column on desktop too) */",
			"body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] [class*=\"_centerCol\"] [class*=\"_titleRow\"] { flex-wrap: wrap; }",
			"/* Session log button is hidden on mobile (body-scoped to outrank the",
			"   conversation plugin's runtime-injected style tag); desktop keeps",
			"   the stock button */",
			"@media (max-width: 1023.98px) {",
			"  body[data-dsh-mobile-layout-owner=\"dsh-mobile-layout\"] [class*=\"_centerCol\"] [class*=\"_sessionLogButton\"] { display: none; }",
			"}",
			"/* aurora backdrop + film grain */",
			".dml-aurora {",
			"  position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: -1; pointer-events: none;",
			"  opacity: 0; transition: opacity 0.5s ease; overflow: hidden;",
			"}",
			".dml-aurora-inner {",
			"  position: absolute; top: -25%; left: -25%; right: -25%; bottom: -25%;",
			"  opacity: 1; transition: opacity 0.25s ease;",
			"  filter: blur(26px) saturate(1.6);",
			"  animation: dml-aurora-drift 12s ease-in-out infinite alternate, dml-aurora-hue 18s linear infinite;",
			"  will-change: transform, filter;",
			"}",
			"@keyframes dml-aurora-hue {",
			"  0% { filter: blur(26px) saturate(1.6) hue-rotate(0deg); }",
			"  50% { filter: blur(26px) saturate(1.6) hue-rotate(24deg); }",
			"  100% { filter: blur(26px) saturate(1.6) hue-rotate(0deg); }",
			"}",
			"@keyframes dml-aurora-drift {",
			"  0% { transform: translate3d(-5%, -3.5%, 0) rotate(-4deg) scale(1.05); opacity: 0.85; }",
			"  50% { transform: translate3d(0.5%, 2%, 0) rotate(0.5deg) scale(1.12); opacity: 1; }",
			"  100% { transform: translate3d(5%, 4%, 0) rotate(4deg) scale(1.2); opacity: 0.9; }",
			"}",
			".dml-grain {",
			"  position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 60; pointer-events: none;",
			"  opacity: 0; transition: opacity 0.5s ease;",
			"  background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\");",
			"  background-size: 180px 180px;",
			"  mix-blend-mode: overlay;",
			"}",
			"body[data-dsh-mobile-skin=\"glass\"] .dml-aurora,",
			"body[data-dsh-mobile-skin=\"semi\"] .dml-aurora { opacity: 1; }",
			"body[data-dsh-mobile-skin=\"glass\"] .dml-grain,",
			"body[data-dsh-mobile-skin=\"semi\"] .dml-grain { opacity: 0.07; }",
			"",
			"/* ===== sidebar action buttons (match the settings-trigger style) ===== */",
			".dml-side-btn {",
			"  box-sizing: border-box; cursor: pointer;",
			"  width: calc(100% + 8px); height: 34px;",
			"  color: var(--dsw-alias-label-primary);",
			"  background: transparent; border: none; border-radius: 12px;",
			"  flex: none; align-items: center; gap: 8px;",
			"  margin: 4px -4px; padding: 6px 2px 6px 10px;",
			"  font-family: inherit; font-size: 14px; line-height: 22px;",
			"  display: flex; overflow: hidden;",
			"  -webkit-tap-highlight-color: transparent;",
			"}",
			".dml-side-btn:hover { background: var(--dsw-alias-interactive-bg-hover); }",
			".dml-side-btn:active { background: var(--dsw-alias-interactive-bg-active, var(--dsw-alias-interactive-bg-hover)); }",
			".dml-side-btn svg { flex: none; }",
			".dml-side-label { white-space: nowrap; overflow: hidden; }",
			".dml-side-btn-rail {",
			"  border-radius: 50%; justify-content: center; gap: 0;",
			"  width: 36px; height: 36px; margin: 8px 0 10px; padding: 0;",
			"}",
			".dml-side-btn-rail .dml-side-label { display: none; }",
			".dml-side-actions { display: flex; flex-direction: column; align-items: stretch; width: 100%; }",
			"",
			"/* ===== panels (files / skin) ===== */",
			".dml-panel {",
			"  position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 50;",
			"  display: flex; flex-direction: column;",
			"  background: var(--dsw-alias-bg-base);",
			"  color: var(--dsw-alias-label-primary);",
			"  font-size: 14px;",
			"}",
			".dml-panel[hidden] { display: none; }",
			".dml-preview[hidden] { display: none; }",
			".dml-files-view { height: 100%; min-height: 0; display: flex; flex-direction: column; }",
			".dml-panel-head {",
			"  display: flex; align-items: center; gap: 8px; flex: none;",
			"  padding: 13px 14px; border-bottom: 1px solid var(--dsw-alias-border-l1);",
			"}",
			".dml-panel-title { font-weight: 600; font-size: 15px; }",
			".dml-spacer { flex: 1; }",
			".dml-close {",
			"  width: 32px; height: 32px; border: none; border-radius: 8px;",
			"  background: transparent; color: var(--dsw-alias-label-secondary);",
			"  font-size: 18px; cursor: pointer;",
			"}",
			".dml-crumbs {",
			"  display: flex; flex-wrap: wrap; align-items: center; gap: 2px; flex: none;",
			"  padding: 8px 12px; border-bottom: 1px solid var(--dsw-alias-border-l1);",
			"  font-size: 12.5px; color: var(--dsw-alias-label-secondary);",
			"}",
			".dml-crumb {",
			"  background: none; border: none; padding: 2px 3px; cursor: pointer;",
			"  color: var(--dsw-alias-state-business-primary); font-size: 12.5px;",
			"}",
			".dml-crumb:active { opacity: 0.7; }",
			".dml-refresh, .dml-download {",
			"  width: 32px; height: 32px; flex: none; display: inline-flex; align-items: center; justify-content: center;",
			"  border: none; border-radius: 8px; background: transparent; cursor: pointer;",
			"  color: var(--dsw-alias-state-business-primary); font: 18px/1 inherit; padding: 0;",
			"}",
			".dml-refresh { margin-left: auto; }",
			".dml-refresh:hover, .dml-download:hover { background: var(--dsw-alias-interactive-bg-hover); }",
			".dml-download:disabled { cursor: wait; opacity: 0.72; }",
			".dml-list { flex: 1; overflow-y: auto; padding: 6px 0; -webkit-overflow-scrolling: touch; }",
			".dml-row {",
			"  display: flex; align-items: center; gap: 10px; width: 100%;",
			"  padding: 10px 14px; border: none; background: none;",
			"  color: inherit; font-size: 14px; text-align: left; cursor: pointer;",
			"  box-sizing: border-box; -webkit-tap-highlight-color: transparent;",
			"}",
			".dml-row:active { background: var(--dsw-alias-interactive-bg-active, rgb(127 127 127 / 0.12)); }",
			".dml-row-icon { flex: none; width: 22px; text-align: center; }",
			".dml-row-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }",
			".dml-row-size { flex: none; color: var(--dsw-alias-label-tertiary); font-size: 12px; }",
			".dml-row-hidden { opacity: 0.55; }",
			".dml-empty { padding: 28px 16px; color: var(--dsw-alias-label-tertiary); text-align: center; }",
			".dml-error { padding: 20px 16px; color: var(--dsw-alias-state-error-primary); }",
			".dml-preview { flex: 1; min-height: 0; display: flex; flex-direction: column; }",
			".dml-preview-head {",
			"  display: flex; align-items: center; gap: 8px; flex: none;",
			"  padding: 8px 12px; border-bottom: 1px solid var(--dsw-alias-border-l1);",
			"}",
			".dml-back {",
			"  border: none; background: none; cursor: pointer; flex: none;",
			"  color: var(--dsw-alias-state-business-primary); font-size: 13.5px; padding: 6px 4px;",
			"}",
			".dml-preview-title { flex: 1; min-width: 0; font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }",
			".dml-open-tab {",
			"  border: none; background: none; cursor: pointer; flex: none; padding: 6px 8px;",
			"  color: var(--dsw-alias-state-business-primary); font-size: 13px;",
			"}",
			".dml-preview-body { flex: 1; min-height: 0; overflow: auto; -webkit-overflow-scrolling: touch; }",
			".dml-preview-body img { max-width: 100%; display: block; margin: 0 auto; }",
			".dml-preview-body iframe { width: 100%; height: 100%; border: none; display: block; }",
			".dml-text {",
			"  margin: 0; padding: 14px;",
			"  font: 12.5px/1.7 var(--ds-font-family-code, ui-monospace, SFMono-Regular, Menlo, monospace);",
			"  white-space: pre-wrap; word-break: break-word; color: var(--dsw-alias-label-primary);",
			"}",
			".dml-md { padding: 2px 16px 28px; font: 14px/1.75 var(--dsw-font-family, system-ui, sans-serif); overflow-wrap: anywhere; }",
			".dml-md h1 { font-size: 20px; margin: 18px 0 8px; }",
			".dml-md h2 { font-size: 18px; margin: 16px 0 8px; }",
			".dml-md h3 { font-size: 16px; margin: 14px 0 6px; }",
			".dml-md h4 { font-size: 14.5px; margin: 12px 0 4px; }",
			".dml-md p { margin: 8px 0; }",
			".dml-md pre.dml-code {",
			"  background: var(--dsw-alias-markdown-inline-code, rgb(127 127 127 / 0.15));",
			"  border-radius: 8px; padding: 10px 12px; overflow-x: auto;",
			"  font: 12px/1.6 var(--ds-font-family-code, ui-monospace, Menlo, monospace);",
			"  white-space: pre;",
			"}",
			".dml-md code {",
			"  background: var(--dsw-alias-markdown-inline-code, rgb(127 127 127 / 0.15));",
			"  border-radius: 4px; padding: 0 4px; font-size: 0.9em;",
			"}",
			".dml-md a { color: var(--dsw-alias-state-business-primary); }",
			".dml-md blockquote { border-left: 2px solid var(--dsw-alias-border-l2); margin: 8px 0; padding-left: 10px; color: var(--dsw-alias-label-secondary); }",
			".dml-md ul, .dml-md ol { padding-left: 22px; margin: 8px 0; }",
			".dml-md li { margin: 3px 0; }",
			".dml-md hr { border: none; height: 1px; background: var(--dsw-alias-border-l2); margin: 14px 0; }",
			"",
			"/* ===== skin panel ===== */",
			".dml-skin-body { padding: 16px; display: flex; flex-direction: column; gap: 16px; overflow-y: auto; }",
			".dml-skin-label { font-size: 12.5px; color: var(--dsw-alias-label-secondary); margin-bottom: 7px; }",
			".dml-chips { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }",
			".dml-chip {",
			"  padding: 7px 4px; border-radius: 16px; cursor: pointer; font-size: 13.5px;",
			"  text-align: center;",
			"  border: 1px solid var(--dsw-alias-border-l2);",
			"  background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-primary);",
			"  -webkit-tap-highlight-color: transparent;",
			"}",
			".dml-chip.on {",
			"  border-color: var(--dsw-alias-state-business-primary);",
			"  color: var(--dsw-alias-state-business-primary);",
			"  background: rgb(127 127 127 / 0.16); /* old-kernel fallback (color-mix unsupported) */",
			"  background: color-mix(in srgb, var(--dsw-alias-state-business-primary) 12%, transparent);",
			"}",
			".dml-input {",
			"  width: 100%; box-sizing: border-box; padding: 9px 12px;",
			"  border-radius: 10px; border: 1px solid var(--dsw-alias-border-l2);",
			"  background: var(--dsw-alias-bg-layer-2); color: inherit; font-size: 13.5px;",
			"}",
			".dml-range { width: 100%; accent-color: var(--dsw-alias-state-business-primary); }",
			".dml-hint { font-size: 12px; color: var(--dsw-alias-label-tertiary); }",
			"",
			"/* ===== panels as dialogs on desktop ===== */",
			"@media (min-width: 1024px) {",
			"  .dml-panel {",
			"    top: 50%; left: 50%;",
			"    transform: translate(-50%, -50%);",
			"    width: min(720px, 92vw); height: min(80vh, 680px);",
			"    border-radius: 14px;",
			"    border: 1px solid rgb(255 255 255 / 0.08);",
			"    box-shadow: 0 24px 64px rgb(0 0 0 / 0.35);",
			"  }",
			"}",
			"",
			"/* ===== upload status card (sidebar upload button feedback) ===== */",
			".dml-upload-status {",
			"  position: fixed; left: 50%; bottom: 96px; transform: translateX(-50%);",
			"  z-index: 55; width: min(420px, calc(100vw - 24px)); box-sizing: border-box;",
			"  background: var(--dsw-alias-bg-layer-2, rgb(38 40 46 / 0.97));",
			"  border: 1px solid var(--dsw-alias-border-l2);",
			"  border-radius: 12px; box-shadow: 0 12px 40px rgb(0 0 0 / 0.4);",
			"  padding: 10px 12px; font-size: 12.5px; line-height: 1.6;",
			"  color: var(--dsw-alias-label-primary);",
			"  display: flex; flex-direction: column; gap: 6px;",
			"  max-height: 40vh; overflow-y: auto; -webkit-overflow-scrolling: touch;",
			"}",
			".dml-upload-status[hidden] { display: none; }",
			".dml-upload-head { display: flex; align-items: center; gap: 8px; font-weight: 600; flex: none; }",
			".dml-upload-row { display: flex; gap: 7px; align-items: flex-start; overflow-wrap: anywhere; }",
			".dml-upload-row .dml-row-name { flex: 1; min-width: 0; }",
			".dml-upload-row.err { color: var(--dsw-alias-state-error-primary, #e5484d); }",
			"@media (min-width: 1024px) { .dml-upload-status { bottom: 24px; } }",
			""
		].join("\n");
		const tagId = "dsh-mobile-layout/mobile.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-mobile-layout";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		/** Escape text for safe HTML interpolation. */
		const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
		const el = (tag, cls, text) => {
			const node = document.createElement(tag);
			if (cls) node.className = cls;
			if (text !== undefined) node.textContent = text;
			return node;
		};
		const FILE_ICON = (name, dir) => {
			if (dir) return "📁";
			const e = name.includes(".") ? name.slice(name.lastIndexOf(".") + 1).toLowerCase() : "";
			if (["png", "jpg", "jpeg", "gif", "webp", "avif", "svg", "bmp", "ico"].includes(e)) return "🖼";
			if (e === "pdf") return "📕";
			if (e === "md" || e === "markdown") return "📝";
			return "📄";
		};
		const IMAGE_EXTS = ["png", "jpg", "jpeg", "gif", "webp", "avif", "svg", "bmp", "ico"];
		/** Compact markdown → HTML for the file preview. Input is escaped first. */
		function mdToHtml(src) {
			const lines = String(src).replace(/\r\n?/g, "\n").split("\n");
			const out = [];
			let i = 0;
			const inline = (s) => {
				let t = esc(s);
				t = t.replace(/`([^`]+)`/g, "<code>$1</code>");
				t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
				t = t.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");
				t = t.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
				return t;
			};
			while (i < lines.length) {
				const line = lines[i];
				if (line.startsWith("```")) {
					const buf = [];
					i++;
					while (i < lines.length && !lines[i].startsWith("```")) {
						buf.push(lines[i]);
						i++;
					}
					i++;
					out.push('<pre class="dml-code">' + esc(buf.join("\n")) + "</pre>");
					continue;
				}
				const h = /^(#{1,6})\s+(.*)$/.exec(line);
				if (h) {
					const n = h[1].length;
					out.push("<h" + n + ">" + inline(h[2]) + "</h" + n + ">");
					i++;
					continue;
				}
				if (/^\s*([-*_])\s*\1\s*$/.test(line)) {
					out.push("<hr/>");
					i++;
					continue;
				}
				if (/^\s*>\s?/.test(line)) {
					out.push("<blockquote>" + inline(line.replace(/^\s*>\s?/, "")) + "</blockquote>");
					i++;
					continue;
				}
				if (/^\s*[-*+]\s+/.test(line)) {
					const items = [];
					while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
						items.push("<li>" + inline(lines[i].replace(/^\s*[-*+]\s+/, "")) + "</li>");
						i++;
					}
					out.push("<ul>" + items.join("") + "</ul>");
					continue;
				}
				if (/^\s*\d+[.)]\s+/.test(line)) {
					const items = [];
					while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
						items.push("<li>" + inline(lines[i].replace(/^\s*\d+[.)]\s+/, "")) + "</li>");
						i++;
					}
					out.push("<ol>" + items.join("") + "</ol>");
					continue;
				}
				if (line.trim() === "") {
					i++;
					continue;
				}
				let para = line;
				i++;
				while (i < lines.length && lines[i].trim() !== "" && !/^(#{1,6}\s|```|[-*+]\s|\d+[.)]\s|>\s)/.test(lines[i])) {
					para += "\n" + lines[i];
					i++;
				}
				out.push("<p>" + inline(para).replace(/\n/g, "<br/>") + "</p>");
			}
			return out.join("\n");
		}
		/** Downscale an image file to a compact JPEG data URL (localStorage-safe). */
		function resizeImage(file, maxDim, quality) {
			return new Promise((resolve, reject) => {
				const url = URL.createObjectURL(file);
				const img = new Image();
				img.onload = () => {
					try {
						let w = img.naturalWidth, h = img.naturalHeight;
						const scale = Math.min(1, maxDim / Math.max(w, h));
						w = Math.max(1, Math.round(w * scale));
						h = Math.max(1, Math.round(h * scale));
						const canvas = document.createElement("canvas");
						canvas.width = w;
						canvas.height = h;
						const c = canvas.getContext("2d");
						c.drawImage(img, 0, 0, w, h);
						const out = canvas.toDataURL("image/jpeg", quality);
						URL.revokeObjectURL(url);
						resolve(out);
					} catch (err) {
						URL.revokeObjectURL(url);
						reject(err);
					}
				};
				img.onerror = () => {
					URL.revokeObjectURL(url);
					reject(new Error("cannot decode image"));
				};
				img.src = url;
			});
		}
		const dirname = (p) => {
			const i = p.replace(/\/+$/, "").lastIndexOf("/");
			return i <= 0 ? null : p.slice(0, i) || "/";
		};

		/** Section 1a: heal the upstream "history load aborted" race.
		 *  dsh rc's Session.doOpen surfaces an aborted history fetch as a
		 *  terminal "历史加载失败：The user aborted a request.（internal）"
		 *  error (reconnect/session-switch race). This controller detects the
		 *  abort-flavoured error row and re-opens the current session (the
		 *  current id is persisted at localStorage["dsh.sessions.current"]),
		 *  falling back to a page reload — bounded and cooled down. */
		function abortRetryController(ctx) {
			const KEY = "dsh.sessions.current";
			let sessions = null;
			try {
				sessions = ctx.get("sessions");
			} catch {
				sessions = null;
			}
			const log = (evt) => {
				if (window.__DML_DEBUG) (window.__dml_heal_log || (window.__dml_heal_log = [])).push(evt);
			};
			const currentId = () => {
				try {
					const raw = localStorage.getItem(KEY);
					if (!raw) return null;
					const parsed = JSON.parse(raw);
					const id = typeof parsed === "string" ? parsed : parsed && parsed.sessionId;
					return typeof id === "string" && id ? id : null;
				} catch {
					return null;
				}
			};
			const reopen = () => {
				const id = currentId();
				if (!id) return;
				if (sessions && typeof sessions.open === "function") {
					try {
						sessions.open(id);
						log("reopen:" + id);
						return;
					} catch {
						/* fall through to the DOM click */
					}
				}
				const sel = document.querySelector('[class*="_selected"]');
				if (sel && typeof sel.click === "function") {
					sel.click();
					log("reopen:row-click");
				}
			};
			let lastHealAt = 0;
			let attempts = 0;
			let recheckTimer = null;
			let debounceTimer = null;
			const heal = () => {
				const now = Date.now();
				if (now - lastHealAt < 30000) return;
				if (attempts >= 1) return;
				attempts += 1;
				lastHealAt = now;
				log("heal:attempt" + attempts);
				window.setTimeout(reopen, 500);
				window.clearTimeout(recheckTimer);
				recheckTimer = window.setTimeout(() => {
					const err = document.querySelector('[class*="_openError"]');
					if (err && /abort/i.test(err.textContent || "")) {
						log("heal:reload");
						window.location.reload();
					} else {
						attempts = 0;
					}
				}, 2000);
			};
			ctx.effect(() => {
				const check = () => {
					const err = document.querySelector('[class*="_openError"]');
					if (err && /abort/i.test(err.textContent || "")) {
						log("detect:abort-error");
						heal();
					}
				};
				const obs = new MutationObserver(() => {
					window.clearTimeout(debounceTimer);
					debounceTimer = window.setTimeout(check, 400);
				});
				obs.observe(document.body, { childList: true, subtree: true });
				return () => {
					obs.disconnect();
					window.clearTimeout(debounceTimer);
					window.clearTimeout(recheckTimer);
				};
			}, "dsh-mobile-layout: abort-retry healer");
		}

		/** Section 1e: whale button — opens the session drawer on mobile
		 *  (there is no rail anymore). Sits at z-index 38: above the content
		 *  but below the open drawer (z 40), and fades out while the drawer
		 *  is open (attribute observer on the app frame). */
		function whaleButtonController(ctx) {
			const btn = el("button", "dml-whale-btn");
			btn.type = "button";
			btn.title = "会话列表";
			btn.innerHTML = '<svg width="21" height="15" viewBox="0 0 23.16 17.04" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="' + "M22.9168 1.43018C22.6713 1.31018 22.5658 1.53918 22.4223 1.65519C22.3733 1.69269 22.3318 1.74169 22.2903 1.78669C21.9317 2.1697 21.5127 2.42121 20.9657 2.39121C20.1657 2.34621 19.4827 2.59771 18.8787 3.20973C18.7502 2.45521 18.3236 2.0047 17.6746 1.71569C17.3351 1.56568 16.9916 1.41518 16.7536 1.08867C16.5876 0.856163 16.5421 0.597155 16.4591 0.341647C16.4061 0.187643 16.3536 0.0301382 16.1761 0.00363739C15.9836 -0.0263635 15.9081 0.135141 15.8326 0.270145C15.5306 0.822162 15.4136 1.43018 15.4251 2.0462C15.4516 3.43174 16.0366 4.53527 17.1991 5.3203C17.3311 5.4103 17.3651 5.5003 17.3236 5.63181C17.2441 5.90231 17.1501 6.16482 17.0671 6.43533C17.0141 6.60784 16.9351 6.64584 16.7501 6.57033C16.1121 6.30383 15.5611 5.90931 15.074 5.4328C14.2475 4.63328 13.5 3.75075 12.568 3.05973C12.349 2.89822 12.13 2.74822 11.9034 2.60522C10.9524 1.68169 12.028 0.923165 12.277 0.833162C12.5375 0.739159 12.3675 0.41615 11.5259 0.42015C10.6844 0.42365 9.91439 0.705658 8.93286 1.08117C8.78935 1.13767 8.63835 1.17867 8.48384 1.21267C7.59332 1.04367 6.66829 1.00617 5.70226 1.11517C3.88321 1.31768 2.43016 2.1777 1.36213 3.64575C0.0790928 5.4103 -0.222916 7.41536 0.146595 9.50642C0.535106 11.7105 1.66014 13.535 3.38869 14.9616C5.18125 16.4406 7.24581 17.1657 9.60138 17.0266C11.0319 16.9441 12.6245 16.7526 14.421 15.2321C14.874 15.4576 15.3496 15.5476 16.1381 15.6151C16.7456 15.6716 17.3306 15.5851 17.7836 15.4911C18.4931 15.3411 18.4441 14.6841 18.1876 14.5636C16.1081 13.595 16.5646 13.9891 16.1496 13.67C17.2061 12.42 18.8202 10.1979 19.3182 7.17235C19.3672 6.83834 19.4297 6.36783 19.4222 6.09732C19.4182 5.93231 19.4562 5.86831 19.6447 5.84931C20.1657 5.78931 20.6712 5.64681 21.1357 5.3913C22.4833 4.65528 23.0268 3.44624 23.1548 1.9972C23.1738 1.77569 23.1508 1.54668 22.9168 1.43018ZM11.1749 14.4736C9.15936 12.889 8.18184 12.3675 7.77832 12.39C7.40081 12.4125 7.46881 12.8445 7.55182 13.126C7.63882 13.404 7.75182 13.5955 7.91033 13.8396C8.01983 14.0011 8.09533 14.2411 7.80083 14.4216C7.15181 14.8231 6.02327 14.2866 5.97027 14.2601C4.65673 13.4865 3.5587 12.4655 2.78467 11.069C2.03715 9.72493 1.60314 8.28289 1.53164 6.74384C1.51264 6.37233 1.62214 6.24082 1.99215 6.17332C2.47916 6.08332 2.98118 6.06432 3.46769 6.13582C5.52476 6.43633 7.27581 7.35586 8.74385 8.8129C9.58188 9.64243 10.2159 10.634 10.8689 11.6025C11.5634 12.631 12.3105 13.611 13.262 14.4146C13.598 14.6961 13.866 14.9101 14.1225 15.0681C13.349 15.1546 12.058 15.1731 11.1749 14.4746L11.1749 14.4736ZM12.141 8.25988C12.141 8.09488 12.273 7.96338 12.439 7.96338C12.4765 7.96338 12.5105 7.97088 12.541 7.98188C12.5825 7.99688 12.6205 8.01938 12.6505 8.05338C12.7035 8.10588 12.7335 8.18088 12.7335 8.25988C12.7335 8.42489 12.6015 8.55639 12.4355 8.55639C12.2695 8.55639 12.141 8.42489 12.141 8.25988ZM15.1415 9.79893C14.949 9.87793 14.7565 9.94544 14.5715 9.95294C14.2845 9.96794 13.9715 9.85143 13.8015 9.70893C13.5375 9.48742 13.3485 9.36342 13.2695 8.97691C13.2355 8.8119 13.2545 8.55639 13.2845 8.40989C13.3525 8.09438 13.277 7.89187 13.0545 7.70787C12.8735 7.55786 12.643 7.51636 12.39 7.51636C12.2955 7.51636 12.209 7.47486 12.1445 7.44136C12.039 7.38886 11.9519 7.25735 12.035 7.09585C12.0615 7.04335 12.19 6.91584 12.22 6.89334C12.5635 6.69784 12.9595 6.76184 13.326 6.90834C13.6655 7.04735 13.9225 7.30236 14.292 7.66287C14.6695 8.09838 14.7375 8.21838 14.9525 8.54539C15.1225 8.8009 15.277 9.06341 15.3831 9.36392C15.4471 9.55142 15.3641 9.70493 15.1415 9.79893Z" + '" fill="currentColor"/></svg>';
			document.body.append(btn);
			const toggle = () => {
				if (document.body.getAttribute("data-dsh-mobile-layout-owner") !== "dsh-mobile-layout") return;
				let layout;
				try {
					layout = ctx.get("layout");
				} catch {
					layout = null;
				}
				if (layout && typeof layout.toggleSidebar === "function") layout.toggleSidebar();
			};
			const sync = () => {
				const overlay = document.querySelector("[data-shell-overlay]");
				const frame = overlay && overlay.parentElement;
				const open = !!frame && !frame.hasAttribute("data-sidebar-collapsed");
				btn.style.opacity = open ? "0" : "1";
				btn.style.pointerEvents = open ? "none" : "";
			};
			btn.addEventListener("click", () => {
				toggle();
				window.setTimeout(sync, 350);
			});
			ctx.effect(() => {
				let obs = null;
				let bodyObs = null;
				const attach = () => {
					const overlay = document.querySelector("[data-shell-overlay]");
					const frame = overlay && overlay.parentElement;
					if (!frame) return false;
					obs = new MutationObserver(sync);
					obs.observe(frame, { attributes: true, attributeFilter: ["data-sidebar-collapsed"] });
					sync();
					return true;
				};
				if (!attach()) {
					bodyObs = new MutationObserver(() => {
						if (attach()) bodyObs.disconnect();
					});
					bodyObs.observe(document.body, { childList: true, subtree: true });
				}
				return () => {
					if (obs) obs.disconnect();
					if (bodyObs) bodyObs.disconnect();
					btn.remove();
				};
			}, "dsh-mobile-layout: whale button");
		}

		/** Section 1b: button-free composer auto-hide (mobile).
		 *  Scrolling up to read hides the composer (slide+fade, then the space
		 *  is reclaimed); scrolling back down to the bottom reveals it. A 60px
		 *  hysteresis band above the bottom absorbs jitter, and the hide is
		 *  skipped while the input has focus. */
		function composerAutoHideController(ctx) {
			const mq = window.matchMedia("(max-width: 1023.98px)");
			const ownsLayout = () => document.body.getAttribute("data-dsh-mobile-layout-owner") === "dsh-mobile-layout";
			let inited = false;
			let seat = null;
			let scroller = null;
			let hidden = false;
			let gone = false;
			let suppressUntil = 0;
			let mutObs = null;
			let initObs = null;
			let ownerObs = null;
			let onResize = null;
			const SHOW_BAND = 8; // px: within this distance of the bottom → show
			const HIDE_BAND = 64; // px: further than this above the bottom → hide
			const show = () => {
				if (!hidden && !gone) return;
				suppressUntil = Date.now() + 450;
				document.body.classList.remove("dml-composer-auto-gone");
				hidden = false;
				gone = false;
				requestAnimationFrame(() => requestAnimationFrame(() => {
					document.body.classList.remove("dml-composer-auto-hidden");
				}));
			};
			const hide = () => {
				if (!ownsLayout() || hidden) return;
				hidden = true;
				suppressUntil = Date.now() + 450;
				document.body.classList.add("dml-composer-auto-hidden");
				window.setTimeout(() => {
					if (hidden) {
						gone = true;
						document.body.classList.add("dml-composer-auto-gone");
					}
				}, 260);
			};
			const evaluate = (sc) => {
				if (!sc || Date.now() < suppressUntil) return;
				if (hidden) return;
				const above = sc.scrollHeight - sc.clientHeight - sc.scrollTop;
				if (above > HIDE_BAND) {
					if (document.activeElement && seat && seat.contains(document.activeElement)) return;
					hide();
				}
			};
			/** Mobile: hide the composer's token-stats footer line (the
			 *  ellipsized hint row clutters the bottom area; desktop keeps it). */
			const hideFooterStats = () => {
				if (!mq.matches || !ownsLayout() || !seat) return;
				const sep = seat.querySelector('[class*="_sep"]');
				if (sep && sep.parentElement) sep.parentElement.style.display = "none";
			};
			const findScroller = (start) => {
				let p = start;
				while (p && p !== document.body) {
					const c = getComputedStyle(p);
					if (/(auto|scroll)/.test(c.overflowY) && p.scrollHeight > p.clientHeight + 50) return p;
					p = p.parentElement;
				}
				return start.parentElement;
			};
			const onScroll = (e) => {
				const t = e.target;
				if (!(t instanceof Element)) return;
				if (scroller && t === scroller) evaluate(scroller);
				else if (seat && t.contains(seat)) evaluate(t);
			};
			const restoreFooterStats = () => {
				if (!seat) return;
				const sep = seat.querySelector('[class*="_sep"]');
				if (sep && sep.parentElement) sep.parentElement.style.display = "";
			};
			const onMqChange = () => {
				if (mq.matches && ownsLayout()) return;
				document.body.classList.remove("dml-composer-auto-hidden", "dml-composer-auto-gone");
				hidden = false;
				gone = false;
				restoreFooterStats();
			};
			/** Tapping the message/text area toggles the composer (collapse to
			 *  read, tap again to bring it back — this also covers the case
			 *  where the user is already at the bottom and scrolling cannot
			 *  fire the reveal). Interactive controls (buttons/links/tool
			 *  rows) keep their own behaviour. */
			const onTextTap = (event) => {
				if (!mq.matches || !ownsLayout()) return;
				const target = event.target;
				if (!(target instanceof Element)) return;
				if (target.closest("button, a, input, textarea, [role=\"button\"], [class*=\"_callRow\"], [class*=\"_action\"], [class*=\"_trigger\"], [class*=\"_toBottom\"]")) return;
				if (!target.closest('[class*=\"_markdown\"], [data-chat-flow], [class*=\"_flowItem\"]')) return;
				if (document.activeElement && seat && seat.contains(document.activeElement)) return;
				if (hidden) show();
				else hide();
			};
			const tryInit = () => {
				if (inited) return true;
				if (!mq.matches) return false;
				const s = document.querySelector('[class*="_composerSeat"]');
				if (!s) return false;
				seat = s;
				hideFooterStats();
				scroller = findScroller(seat);
				document.addEventListener("scroll", onScroll, { capture: true, passive: true });
				document.addEventListener("click", onTextTap, true);
				onResize = () => evaluate(scroller);
				window.addEventListener("resize", onResize);
				mq.addEventListener("change", onMqChange);
				if (scroller) {
					mutObs = new MutationObserver(() => {
						window.clearTimeout(mutObs.__t);
						mutObs.__t = window.setTimeout(() => {
							evaluate(scroller);
							hideFooterStats();
						}, 180);
					});
					mutObs.observe(scroller, { childList: true, subtree: true });
				}
				inited = true;
				return true;
			};
			if (!tryInit()) {
				initObs = new MutationObserver(() => {
					if (tryInit()) {
						initObs.disconnect();
						initObs = null;
					}
				});
				initObs.observe(document.body, { childList: true, subtree: true });
			}
			ownerObs = new MutationObserver(() => onMqChange());
			ownerObs.observe(document.body, { attributes: true, attributeFilter: ["data-dsh-mobile-layout-owner"] });
			ctx.effect(() => () => {
				restoreFooterStats();
				document.removeEventListener("scroll", onScroll, { capture: true });
				document.removeEventListener("click", onTextTap, true);
				if (onResize) window.removeEventListener("resize", onResize);
				mq.removeEventListener("change", onMqChange);
				if (mutObs) mutObs.disconnect();
				if (initObs) initObs.disconnect();
				if (ownerObs) ownerObs.disconnect();
				document.body.classList.remove("dml-composer-auto-hidden", "dml-composer-auto-gone");
			}, "dsh-mobile-layout: composer auto-hide");
		}

		/** Section 2: transparency + background skinning (localStorage-persisted). */
		function skinController(ctx) {
			const KEY = "dsh-mobile-skin-v1";
			const state = { mode: "off", bg: "aurora1", bgUrl: "", alpha: 30 };
			try {
				Object.assign(state, JSON.parse(localStorage.getItem(KEY) || "{}"));
			} catch {
				/* keep defaults */
			}
			// migrate legacy preset ids + heal the "picked image while mode=off" bug
			if (state.bg === "grad1") state.bg = "aurora1";
			if (state.bg === "grad2") state.bg = "aurora2";
			if (!state.alpha) state.alpha = 30;
			if (state.alpha === 50) state.alpha = 30; // v17 default: 30
			if (state.bgUrl && state.mode === "off") state.mode = "glass";
			const AURORA = {
				aurora1: "radial-gradient(44% 40% at 16% 22%, rgba(112,152,255,0.62), transparent 68%), radial-gradient(38% 36% at 84% 16%, rgba(176,130,255,0.58), transparent 68%), radial-gradient(42% 38% at 78% 86%, rgba(255,130,190,0.55), transparent 70%), radial-gradient(36% 34% at 20% 84%, rgba(72,232,200,0.52), transparent 68%)",
				aurora2: "radial-gradient(44% 40% at 16% 20%, rgba(255,160,100,0.6), transparent 68%), radial-gradient(38% 36% at 86% 14%, rgba(255,205,110,0.55), transparent 68%), radial-gradient(42% 38% at 80% 88%, rgba(255,110,170,0.52), transparent 70%), radial-gradient(36% 34% at 18% 82%, rgba(255,215,140,0.46), transparent 68%)",
				aurora3: "radial-gradient(44% 40% at 16% 22%, rgba(64,222,190,0.58), transparent 68%), radial-gradient(38% 36% at 84% 16%, rgba(120,235,180,0.54), transparent 68%), radial-gradient(42% 38% at 78% 86%, rgba(80,200,250,0.5), transparent 70%), radial-gradient(36% 34% at 20% 84%, rgba(140,150,255,0.48), transparent 68%)",
				mono: "radial-gradient(44% 40% at 16% 22%, rgba(176,190,207,0.7), transparent 68%), radial-gradient(38% 36% at 84% 16%, rgba(120,136,155,0.62), transparent 68%), radial-gradient(42% 38% at 78% 86%, rgba(226,234,243,0.5), transparent 70%), radial-gradient(36% 34% at 20% 84%, rgba(88,104,124,0.58), transparent 68%)"
			};
			const BASE = {
				aurora1: "radial-gradient(120% 120% at 50% 0%, #e9edff 0%, #f4f6ff 45%, #fbf7ff 100%)",
				aurora2: "radial-gradient(120% 120% at 50% 0%, #fff3e8 0%, #fff7f2 50%, #fff0f4 100%)",
				aurora3: "radial-gradient(120% 120% at 50% 0%, #e8fdf6 0%, #f0fcf8 50%, #eef8ff 100%)",
				mono: "#0b0e14"
			};
			/** Parse any common CSS color form into [r,g,b]. */
			const parseColor = (v) => {
				if (!v) return [255, 255, 255];
				let m = /^#([0-9a-f]{6})$/i.exec(v);
				if (m) {
					const n = parseInt(m[1], 16);
					return [n >> 16 & 255, n >> 8 & 255, n & 255];
				}
				m = /^#([0-9a-f]{3})$/i.exec(v);
				if (m) {
					const n = parseInt(m[1], 16);
					return [(n >> 8 & 15) * 17, (n >> 4 & 15) * 17, (n & 15) * 17];
				}
				m = /^color\(srgb\s+([^)]+)\)/.exec(v);
				if (m) {
					const parts = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
					if (parts.length >= 3) return parts.slice(0, 3).map((x) => Math.max(0, Math.min(255, Math.round(x * 255))));
				}
				m = /^rgba?\(([^)]+)\)/.exec(v);
				if (m) {
					const parts = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
					if (parts.length >= 3) return parts.slice(0, 3).map((x) => Math.max(0, Math.min(255, Math.round(x))));
				}
				return [255, 255, 255];
			};
			/** Surface tokens ride DSH's official override layer. The layer composes
			 *  with other theme plugins and retracts to the next layer on disable or
			 *  unload instead of deleting somebody else's inline values. */
			let disposeTokenLayer = null;
			const rgba = ([r, g, b], alpha) => "rgba(" + r + ", " + g + ", " + b + ", " + Math.round(alpha * 1000) / 1000 + ")";
			const surfaceValues = (rgb) => {
				const a = Math.max(0, Math.min(1, (state.alpha / 100) + (state.bg === "custom" ? 0.09 : 0)));
				const mix = (alpha) => rgba(rgb, Math.min(1, alpha));
				const p = 0.12;
				const codeRgb = [
					Math.round(rgb[0] + (150 - rgb[0]) * p),
					Math.round(rgb[1] + (154 - rgb[1]) * p),
					Math.round(rgb[2] + (158 - rgb[2]) * p)
				];
				const codeMix = (alpha) => rgba(codeRgb, Math.min(1, alpha));
				const thumbA = Math.min(0.9, Math.max(0.45, a + 0.25));
				const hoverA = Math.min(0.95, thumbA + 0.15);
				return {
					"--dsw-alias-bg-base": mix(a),
					"--dsw-specific-sidebar-fill": mix(a * 0.66),
					"--dsw-specific-input-major": mix(a * 0.85),
					"--dsw-specific-bubble": mix(a),
					"--dsw-alias-markdown-code-block": codeMix(a),
					"--dsw-alias-markdown-code-block-banner": codeMix(a * 0.85),
					"--dsw-alias-markdown-inline-code": codeMix(a * 0.75),
					"--dsw-alias-scrollbar-bg-l1": mix(thumbA),
					"--dsw-alias-scrollbar-bg-l2": mix(thumbA),
					"--dsw-alias-scrollbar-hover-l1": mix(hoverA),
					"--dsw-alias-scrollbar-hover-l2": mix(hoverA),
					"--dml-header-bg": "linear-gradient(to bottom, " + mix(0.85) + " 0%, transparent 100%)",
					"--dml-toolbar-bg": "linear-gradient(to bottom, transparent 0%, " + mix(0.85) + " 25%, " + mix(0.85) + " 75%, transparent 100%)"
				};
			};
			const clearSurfaces = () => {
				if (disposeTokenLayer) disposeTokenLayer();
				disposeTokenLayer = null;
			};
			const applySurfaces = () => {
				if (state.mode === "off") {
					clearSurfaces();
					return;
				}
				const base = getComputedStyle(document.body).getPropertyValue("--dsw-alias-bg-layer-1").trim();
				const values = surfaceValues(parseColor(base));
				const overrides = {};
				// The forced presenter already selects the intended base palette. Repeat
				// its computed surface in both branches so DSH's durable preference cannot
				// select the opposite value while the temporary skin is active.
				for (const [name, value] of Object.entries(values)) overrides[name] = { light: value, dark: value };
				// Reusing one source atomically replaces this plugin's previous layer.
				disposeTokenLayer = ctx.theme.overrideTokens("dsh-mobile-layout", overrides);
			};
			const blurSupported = !!(window.CSS && window.CSS.supports && (window.CSS.supports("backdrop-filter", "blur(1px)") || window.CSS.supports("-webkit-backdrop-filter", "blur(1px)")));
			const aurora = el("div", "dml-aurora");
			const auroraInner = el("div", "dml-aurora-inner");
			aurora.append(auroraInner);
			const grain = el("div", "dml-grain");
			document.body.append(aurora, grain);
			const panel = el("div", "dml-panel dml-panel-skin");
			panel.hidden = true;
			panel.innerHTML = [
				'<div class="dml-panel-head"><div class="dml-panel-title">主题与背景</div><div class="dml-spacer"></div>',
				'<button class="dml-close" type="button">✕</button></div>',
				'<div class="dml-skin-body">',
				'<div><div class="dml-skin-label">皮肤</div><div class="dml-chips" data-k="mode">',
				'<button class="dml-chip" data-v="off" type="button">无</button>',
				'<button class="dml-chip" data-v="glass" type="button">玻璃</button>',
				'<button class="dml-chip" data-v="semi" type="button">半透明</button>',
				"</div></div>",
				'<div><div class="dml-skin-label">背景</div><div class="dml-chips" data-k="bg">',
				'<button class="dml-chip" data-v="aurora1" type="button">极光·蓝紫</button>',
				'<button class="dml-chip" data-v="aurora2" type="button">极光·暖阳</button>',
				'<button class="dml-chip" data-v="aurora3" type="button">极光·青绿</button>',
				'<button class="dml-chip" data-v="mono" type="button">单色·墨</button>',
				'<button class="dml-chip" data-v="custom" type="button">自定义图片</button>',
				'<button class="dml-chip" data-k="pick" type="button">手机相册选择</button>',
				"</div>",
				'<input data-k="bgFile" type="file" accept="image/*" style="display:none">',
				"</div>",
				'<div><div class="dml-skin-label">背景图 URL</div>',
				'<input class="dml-input" data-k="bgUrl" type="text" placeholder="https://…/wallpaper.jpg">',
				'<div class="dml-hint" style="margin-top:4px">输入后回车或失焦即应用（自动切换到玻璃模式）</div></div>',
				'<div><div class="dml-skin-label">表面不透明度：<span data-k="alphaLabel"></span></div>',
				'<input class="dml-range" data-k="alpha" type="range" min="0" max="100" step="5"></div>',
				'<div class="dml-hint">极光背景为多层模糊光斑缓慢漂移 + 电影颗粒质感；玻璃表面为 JS 计算的半透明色（不依赖 color-mix，全浏览器可用）。本浏览器毛玻璃：' + (blurSupported ? "✓ 支持" : "✗ 不支持（无模糊，透明仍生效）") + '。<span data-k="contrastLabel"></span>设置仅保存在本浏览器。</div>',
				"</div>"
			].join("");
			document.body.append(panel);

			/* ===== readability contrast: temporarily pin the presented palette to
			   the background luminance. The durable theme preference remains owned by
			   DSH. A CAS-style owner marker prevents release from overwriting a newer
			   DOM writer, while theme/change keeps the forced palette stable. ==== */
			const DARK_ATTR = "data-ds-dark-theme";
			const SCHEME_OWNER_ATTR = "data-dsh-color-scheme-owner";
			const SKIN_OWNER_ATTR = "data-dsh-background-owner";
			const OWNER = "dsh-mobile-layout";
			let forceLum = null; // "dark" | "light" | null
			let forcedScheme = null;
			let forcedDark = null;
			let ownsScheme = false;
			let backgroundBefore = "";
			let backgroundExpected = null;
			let ownsBackground = false;
			const contrastLabel = panel.querySelector('[data-k="contrastLabel"]');
			const resolveAppScheme = () => {
				const snapshot = ctx.theme.getTheme();
				return snapshot && snapshot.active && snapshot.active.colorScheme === "dark" ? "dark" : "light";
			};
			const releaseScheme = () => {
				if (!ownsScheme) return;
				const ownerStillOurs = document.body.getAttribute(SCHEME_OWNER_ATTR) === OWNER;
				const untouched = document.documentElement.style.colorScheme === forcedScheme
					&& document.body.hasAttribute(DARK_ATTR) === forcedDark;
				if (ownerStillOurs) document.body.removeAttribute(SCHEME_OWNER_ATTR);
				if (ownerStillOurs && untouched) {
					const scheme = resolveAppScheme();
					document.body.toggleAttribute(DARK_ATTR, scheme === "dark");
					document.documentElement.style.colorScheme = scheme;
				}
				ownsScheme = false;
				forcedScheme = null;
				forcedDark = null;
			};
			const present = () => {
				if (!forceLum) {
					releaseScheme();
					return;
				}
				const owner = document.body.getAttribute(SCHEME_OWNER_ATTR);
				if (owner && owner !== OWNER) return;
				document.body.setAttribute(SCHEME_OWNER_ATTR, OWNER);
				ownsScheme = true;
				forcedScheme = forceLum;
				forcedDark = forceLum === "dark";
				document.body.toggleAttribute(DARK_ATTR, forcedDark);
				document.documentElement.style.colorScheme = forcedScheme;
			};
			const setBackground = (value) => {
				const owner = document.body.getAttribute(SKIN_OWNER_ATTR);
				if (owner && owner !== OWNER) return false;
				if (!ownsBackground) backgroundBefore = document.body.style.background;
				document.body.setAttribute(SKIN_OWNER_ATTR, OWNER);
				ownsBackground = true;
				document.body.style.background = value;
				backgroundExpected = document.body.style.background;
				return true;
			};
			const releaseBackground = () => {
				if (!ownsBackground) return;
				const ownerStillOurs = document.body.getAttribute(SKIN_OWNER_ATTR) === OWNER;
				const untouched = document.body.style.background === backgroundExpected;
				if (ownerStillOurs) document.body.removeAttribute(SKIN_OWNER_ATTR);
				if (ownerStillOurs && untouched) document.body.style.background = backgroundBefore;
				ownsBackground = false;
				backgroundExpected = null;
			};
			const updateContrastLabel = () => {
				if (!contrastLabel) return;
				contrastLabel.textContent = forceLum === "dark" ? "深色背景已自动启用深色文字主题。" : forceLum === "light" ? "浅色背景已自动启用浅色文字主题。" : "";
			};
			const offThemeChange = ctx.on("theme/change", () => {
				if (forceLum) present();
			});
			/** Average perceived luminance of an image dataURL. */
			const imageLuminance = (dataUrl, cb) => {
				const attempt = (cross) => {
					const img = new Image();
					if (cross) img.crossOrigin = "anonymous";
					img.onload = () => {
						try {
							const c = document.createElement("canvas");
							c.width = 24;
							c.height = 24;
							const g = c.getContext("2d");
							g.drawImage(img, 0, 0, 24, 24);
							const d = g.getImageData(0, 0, 24, 24).data;
							let sum = 0;
							for (let i = 0; i < d.length; i += 4) sum += 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
							cb(sum / (d.length / 4) >= 128 ? "light" : "dark");
						} catch {
							if (cross && !dataUrl.startsWith("data:")) {
								attempt(false); // CORS failed — retry without (tainted canvas → fallback)
							} else {
								cb("dark");
							}
						}
					};
					img.onerror = () => {
						if (cross && !dataUrl.startsWith("data:")) attempt(false);
						else cb("dark");
					};
					img.src = dataUrl;
				};
				attempt(!dataUrl.startsWith("data:"));
			};
			let lumToken = 0;
			const syncContrast = () => {
				const mode = state.mode === "off" ? "" : state.mode;
				if (!mode || !state.bg) {
					forceLum = null;
					present();
					updateContrastLabel();
					return;
				}
				if (state.bg === "custom" && state.bgUrl) {
					const myToken = ++lumToken;
					imageLuminance(state.bgUrl, (lum) => {
						if (myToken !== lumToken) return;
						forceLum = lum;
						present();
						applySurfaces();
						updateContrastLabel();
					});
					return;
				}
				lumToken++; // invalidate any pending image sample
				forceLum = state.bg === "mono" ? "dark" : "light"; // three light aurora presets + one dark mono
				present();
				updateContrastLabel();
			};
			const modeChips = panel.querySelectorAll('[data-k="mode"] .dml-chip');
			const bgChips = panel.querySelectorAll('[data-k="bg"] .dml-chip[data-v]');
			const urlInput = panel.querySelector('[data-k="bgUrl"]');
			const range = panel.querySelector('[data-k="alpha"]');
			const alphaLabel = panel.querySelector('[data-k="alphaLabel"]');
			const fileInput = panel.querySelector('[data-k="bgFile"]');
			const pickBtn = panel.querySelector('[data-k="pick"]');
			const setChips = (list, key) => {
				for (const c of list) c.classList.toggle("on", c.getAttribute("data-v") === state[key]);
			};
			let lastBg = null;
			let bgTimer = null;
			const apply = () => {
				const mode = state.mode === "off" ? "" : state.mode;
				const backgroundOwner = document.body.getAttribute(SKIN_OWNER_ATTR);
				const schemeOwner = document.body.getAttribute(SCHEME_OWNER_ATTR);
				const blocked = !!mode && ((backgroundOwner && backgroundOwner !== OWNER) || (schemeOwner && schemeOwner !== OWNER));
				const activeMode = blocked ? "" : mode;
				if (activeMode) document.body.setAttribute("data-dsh-mobile-skin", activeMode);
				else document.body.removeAttribute("data-dsh-mobile-skin");
				if (activeMode && state.bg === "custom") document.body.setAttribute("data-dml-bg", "custom");
				else document.body.removeAttribute("data-dml-bg");
				let backgroundActive = false;
				if (activeMode) {
					syncContrast();
					applySurfaces();
					const bodyBg = state.bg === "custom" && state.bgUrl
						? 'url("' + state.bgUrl.replace(/"/g, "%22") + '") center / cover no-repeat'
						: BASE[state.bg] || BASE.aurora1;
					backgroundActive = setBackground(bodyBg);
				} else {
					lumToken++;
					forceLum = null;
					present();
					clearSurfaces();
					releaseBackground();
				}
				// Aurora is shown only while this plugin owns the page background.
				const showAurora = backgroundActive && state.bg !== "custom";
				if (showAurora && state.bg !== lastBg) {
					window.clearTimeout(bgTimer);
					auroraInner.style.opacity = "0";
					bgTimer = window.setTimeout(() => {
						auroraInner.style.background = AURORA[state.bg] || AURORA.aurora1;
						auroraInner.style.opacity = "1";
					}, 240);
				} else if (showAurora && !auroraInner.style.background) {
					auroraInner.style.background = AURORA[state.bg] || AURORA.aurora1;
				} else if (!showAurora && auroraInner.style.background) {
					auroraInner.style.background = "";
				}
				lastBg = state.bg;
				setChips(modeChips, "mode");
				setChips(bgChips, "bg");
				urlInput.value = state.bgUrl && !state.bgUrl.startsWith("data:") ? state.bgUrl : "";
				range.value = String(state.alpha);
				alphaLabel.textContent = state.alpha + "%";
				try {
					localStorage.setItem(KEY, JSON.stringify(state));
				} catch {
					/* storage unavailable */
				}
			};
			for (const c of modeChips) {
				c.addEventListener("click", () => {
					state.mode = c.getAttribute("data-v");
					apply();
				});
			}
			for (const c of bgChips) {
				c.addEventListener("click", () => {
					state.bg = c.getAttribute("data-v");
					apply();
				});
			}
			range.addEventListener("input", () => {
				state.alpha = Number(range.value);
				apply();
			});
			urlInput.addEventListener("change", () => {
				state.bgUrl = urlInput.value.trim();
				if (state.bgUrl) {
					state.bg = "custom";
					if (state.mode === "off") state.mode = "glass";
				}
				apply();
			});
			pickBtn.addEventListener("click", () => fileInput.click());
			fileInput.addEventListener("change", async () => {
				const file = fileInput.files && fileInput.files[0];
				if (!file) return;
				try {
					const dataUrl = await resizeImage(file, 1920, 0.85);
					state.bgUrl = dataUrl;
					state.bg = "custom";
					if (state.mode === "off") state.mode = "glass";
					apply();
				} catch (err) {
					window.alert("图片处理失败：" + (err && err.message ? err.message : err));
				}
			});
			const open = () => {
				panel.hidden = false;
				apply();
			};
			panel.querySelector(".dml-close").addEventListener("click", () => {
				panel.hidden = true;
			});
			let ownerSignature = "";
			const ownerObs = new MutationObserver(() => {
				const next = (document.body.getAttribute(SKIN_OWNER_ATTR) || "") + "\n" + (document.body.getAttribute(SCHEME_OWNER_ATTR) || "");
				if (next === ownerSignature) return;
				ownerSignature = next;
				apply();
			});
			ownerObs.observe(document.body, { attributes: true, attributeFilter: [SKIN_OWNER_ATTR, SCHEME_OWNER_ATTR] });
			ctx.effect(() => {
				apply();
				ownerSignature = (document.body.getAttribute(SKIN_OWNER_ATTR) || "") + "\n" + (document.body.getAttribute(SCHEME_OWNER_ATTR) || "");
				return () => {
					ownerObs.disconnect();
					lumToken++;
					forceLum = null;
					releaseScheme();
					releaseBackground();
					clearSurfaces();
					offThemeChange();
					window.clearTimeout(bgTimer);
					document.body.removeAttribute("data-dsh-mobile-skin");
					document.body.removeAttribute("data-dml-bg");
					aurora.remove();
					grain.remove();
					panel.remove();
				};
			}, "dsh-mobile-layout: skin runtime");
			return { open };
		}

		/** Section 3: file browser as a third conversation-view tab (文件).
		 *  Navigation is latest-request-wins: a stale directory response can never
		 *  replace the newer path, and every navigation bypasses browser caches. */
		function filesViewController(ctx) {
			const LAST_KEY = "dsh-mobile-files-last";
			let currentPath = null;
			try { currentPath = localStorage.getItem(LAST_KEY) || null; } catch { /* storage unavailable */ }
			let reloadCurrentList = null;
			const fileUrl = (action, p) => "/mobile-files/" + action + "?path=" + encodeURIComponent(p);
			const readUrl = (p) => fileUrl("read", p);
			const downloadUrl = (p) => fileUrl("download", p);
			const listUrl = (p) => (p ? fileUrl("list", p) : "/mobile-files/list");
			ctx.effect(() => {
				const onUploaded = (e) => {
					const p = e && e.detail && e.detail.path;
					if (p && reloadCurrentList && currentPath && dirname(p) === currentPath) reloadCurrentList();
				};
				window.addEventListener("dml-upload-done", onUploaded);
				return () => window.removeEventListener("dml-upload-done", onUploaded);
			}, "dsh-mobile-layout: files refresh on upload");
			const build = (container) => {
				container.innerHTML = [
					'<div class="dml-crumbs"></div>',
					'<div class="dml-list"></div>',
					'<div class="dml-preview" hidden>',
					'<div class="dml-preview-head"><button class="dml-back" type="button">‹ 返回</button>',
					'<div class="dml-preview-title"></div><div class="dml-spacer"></div>',
					'<button class="dml-download" type="button" title="下载到设备">下载</button>',
					'<button class="dml-open-tab" type="button">新标签页打开</button></div>',
					'<div class="dml-preview-body"></div>',
					"</div>"
				].join("");
				const crumbs = container.querySelector(".dml-crumbs");
				const listArea = container.querySelector(".dml-list");
				const preview = container.querySelector(".dml-preview");
				const previewTitle = container.querySelector(".dml-preview-title");
				const previewBody = container.querySelector(".dml-preview-body");
				let listController = null;
				let downloadXhr = null;
				let downloadResetTimer = null;
				let listRequest = 0;
				let previewRequest = 0;
				let previewPath = null;
				let disposed = false;
				const showList = () => {
					preview.hidden = true;
					listArea.style.display = "";
				};
				const setLoading = () => {
					showList();
					listArea.textContent = "";
					listArea.append(el("div", "dml-empty", "加载中…"));
				};
				const showError = (msg) => {
					showList();
					listArea.textContent = "";
					listArea.append(el("div", "dml-error", msg));
					const reset = el("button", "dml-row");
					reset.append(el("span", "dml-row-icon", "⌂"), el("span", "dml-row-name", "回到默认目录"));
					reset.addEventListener("click", () => loadList(null));
					listArea.append(reset);
				};
				const renderCrumbs = (data) => {
					crumbs.textContent = "";
					for (const cr of data.crumbs || []) {
						const b = el("button", "dml-crumb", cr.name);
						b.type = "button";
						b.addEventListener("click", () => loadList(cr.path));
						crumbs.append(b, document.createTextNode("/"));
					}
					const refresh = el("button", "dml-refresh", "↻");
					refresh.type = "button";
					refresh.title = "刷新当前目录";
					refresh.setAttribute("aria-label", "刷新当前目录");
					refresh.addEventListener("click", () => loadList(currentPath));
					crumbs.append(refresh);
				};
				const renderList = (data) => {
					showList();
					listArea.textContent = "";
					renderCrumbs(data);
					const up = dirname(currentPath);
					if (up && up !== currentPath && data.root && currentPath !== data.root) {
						const row = el("button", "dml-row");
						row.append(el("span", "dml-row-icon", "↑"), el("span", "dml-row-name", "上一级"));
						row.addEventListener("click", () => loadList(up));
						listArea.append(row);
					}
					if (!data.entries.length) {
						listArea.append(el("div", "dml-empty", "空目录"));
						return;
					}
					for (const ent of data.entries) {
						const row = el("button", "dml-row" + (ent.hidden ? " dml-row-hidden" : ""));
						row.append(
							el("span", "dml-row-icon", FILE_ICON(ent.name, ent.dir)),
							el("span", "dml-row-name", ent.name),
							el("span", "dml-row-size", ent.dir ? "" : ent.size || "")
						);
						row.addEventListener("click", () => ent.dir ? loadList(ent.path) : openPreview(ent));
						listArea.append(row);
					}
					if (data.truncated) listArea.append(el("div", "dml-empty", "条目过多，仅显示前 2000 项"));
				};
				const loadList = async (path) => {
					const request = ++listRequest;
					if (listController) listController.abort();
					listController = new AbortController();
					setLoading();
					try {
						const res = await fetch(listUrl(path), { cache: "no-store", signal: listController.signal });
						if (disposed || request !== listRequest) return;
						if (res.ok && !(res.headers.get("content-type") || "").includes("application/json")) {
							showError("文件服务未就绪（dsh web 进程重启后生效）");
							return;
						}
						if (!res.ok) {
							let msg = "HTTP " + res.status;
							try {
								const j = await res.json();
								if (j && j.message) msg = j.message;
							} catch { /* non-json error */ }
							if (request === listRequest) showError(msg);
							return;
						}
						const data = await res.json();
						if (disposed || request !== listRequest) return;
						currentPath = data.path;
						try { localStorage.setItem(LAST_KEY, currentPath); } catch { /* storage unavailable */ }
						renderList(data);
					} catch (err) {
						if (!disposed && request === listRequest && (!err || err.name !== "AbortError")) {
							showError("网络错误：" + (err && err.message ? err.message : err));
						}
					}
				};
				const openPreview = (ent) => {
					const request = ++previewRequest;
					previewPath = ent.path;
					preview.hidden = false;
					listArea.style.display = "none";
					previewTitle.textContent = ent.name;
					previewBody.textContent = "";
					const url = readUrl(ent.path);
					const ext = ent.name.includes(".") ? ent.name.slice(ent.name.lastIndexOf(".") + 1).toLowerCase() : "";
					if (IMAGE_EXTS.includes(ext)) {
						const img = document.createElement("img");
						img.src = url;
						img.alt = ent.name;
						previewBody.append(img);
					} else if (ext === "pdf") {
						const frame = document.createElement("iframe");
						frame.src = url;
						previewBody.append(frame);
					} else {
						previewBody.append(el("div", "dml-empty", "加载中…"));
						fetch(url, { cache: "no-store" }).then(async (res) => {
							if (disposed || request !== previewRequest) return;
							const ct = res.headers.get("content-type") || "";
							if (res.ok && !ct.includes("text/") && !ct.includes("image/") && !ct.includes("pdf")) {
								previewBody.textContent = "";
								previewBody.append(el("div", "dml-error", "文件服务未就绪（dsh web 进程重启后生效）"));
								return;
							}
							if (!res.ok) {
								let msg = "HTTP " + res.status;
								try {
									const j = await res.json();
									if (j && j.message) msg = j.message;
								} catch { /* non-json error */ }
								if (request === previewRequest) {
									previewBody.textContent = "";
									previewBody.append(el("div", "dml-error", msg));
								}
								return;
							}
							const text = await res.text();
							if (disposed || request !== previewRequest) return;
							previewBody.textContent = "";
							if (ext === "md" || ext === "markdown") {
								const md = el("div", "dml-md");
								md.innerHTML = mdToHtml(text);
								previewBody.append(md);
							} else {
								previewBody.append(el("pre", "dml-text", text));
							}
						}).catch((err) => {
							if (disposed || request !== previewRequest) return;
							previewBody.textContent = "";
							previewBody.append(el("div", "dml-error", "加载失败：" + (err && err.message ? err.message : err)));
						});
					}
				};
				preview.querySelector(".dml-back").addEventListener("click", () => {
					previewRequest++;
					previewPath = null;
					loadList(currentPath);
				});
				preview.querySelector(".dml-open-tab").addEventListener("click", () => {
					if (previewPath) window.open(readUrl(previewPath), "_blank", "noopener");
				});
				const downloadButton = preview.querySelector(".dml-download");
				const resetDownloadButton = () => {
					window.clearTimeout(downloadResetTimer);
					downloadResetTimer = null;
					downloadButton.disabled = false;
					downloadButton.textContent = "下载";
					downloadButton.title = "下载到设备";
				};
				downloadButton.addEventListener("click", () => {
					if (!previewPath || downloadXhr) return;
					const path = previewPath;
					const name = previewTitle.textContent || "download";
					const xhr = new XMLHttpRequest();
					downloadXhr = xhr;
					downloadButton.disabled = true;
					downloadButton.textContent = "0%";
					downloadButton.title = "正在下载到设备";
					xhr.open("GET", downloadUrl(path));
					xhr.responseType = "blob";
					xhr.onprogress = (event) => {
						if (xhr !== downloadXhr) return;
						if (event.lengthComputable && event.total > 0) {
							const percent = Math.min(100, Math.floor(event.loaded / event.total * 100));
							downloadButton.textContent = percent + "%";
							downloadButton.title = "已下载 " + Math.round(event.loaded / 1024 / 1024 * 10) / 10 + " MB / " + Math.round(event.total / 1024 / 1024 * 10) / 10 + " MB";
						} else {
							downloadButton.textContent = Math.round(event.loaded / 1024 / 1024 * 10) / 10 + " MB";
						}
					};
					xhr.onload = () => {
						if (xhr !== downloadXhr) return;
						downloadXhr = null;
						if (xhr.status !== 200) {
							downloadButton.textContent = "失败";
							downloadButton.title = "下载失败（HTTP " + xhr.status + "）";
							downloadResetTimer = window.setTimeout(resetDownloadButton, 2500);
							return;
						}
						const objectUrl = URL.createObjectURL(xhr.response);
						const link = document.createElement("a");
						link.href = objectUrl;
						link.download = name;
						document.body.append(link);
						link.click();
						window.setTimeout(() => {
							link.remove();
							URL.revokeObjectURL(objectUrl);
						}, 1000);
						downloadButton.textContent = "完成";
						downloadButton.title = "已保存到设备";
						downloadResetTimer = window.setTimeout(resetDownloadButton, 1800);
					};
					xhr.onerror = () => {
						if (xhr !== downloadXhr) return;
						downloadXhr = null;
						downloadButton.textContent = "失败";
						downloadButton.title = "下载网络错误";
						downloadResetTimer = window.setTimeout(resetDownloadButton, 2500);
					};
					xhr.onabort = () => {
						if (xhr !== downloadXhr) return;
						downloadXhr = null;
						resetDownloadButton();
					};
					xhr.send();
				});
				loadList(currentPath);
				reloadCurrentList = () => loadList(currentPath);
				return () => {
					disposed = true;
					listRequest++;
					previewRequest++;
					if (listController) listController.abort();
					if (downloadXhr) downloadXhr.abort();
					window.clearTimeout(downloadResetTimer);
					reloadCurrentList = null;
					container.textContent = "";
				};
			};
			const FilesView = () => {
				const ref = react.useRef(null);
				react.useEffect(() => build(ref.current), []);
				return react.createElement("div", { ref: ref, className: "dml-files-view" });
			};
			ctx.slots.inject("conversation.view", () => ctx.slots.register({
				name: "conversation.view",
				id: "files",
				order: 20,
				label: () => "文件",
				inject: () => ({})
			}, FilesView));
		}

		/** Section 3b: file upload (sidebar 「上传文件」 button).
		 *  Hidden multiple-file input → POST each file (raw body, name in the
		 *  query) to the host's /mobile-files/upload route, sequentially, with
		 *  XHR upload-progress. The target is the host's dedicated upload
		 *  directory (config.uploadDir or <defaultPath>/upload — never the
		 *  root); the client never picks a directory. Results render in a fixed
		 *  status card (bottom center, above the composer) and auto-dismiss
		 *  after 8s; a success dispatches dml-upload-done so an open 文件 tab
		 *  showing the target directory refreshes. Response mapping: JSON →
		 *  host verdict (saved / error message); 200 + non-JSON → SPA fallback
		 *  ("route not ready — restart"); non-200 + non-JSON → gateway/proxy
		 *  error (nginx 413 client_max_body_size comes back as an HTML page). */
		function uploadController(ctx) {
			const input = document.createElement("input");
			input.type = "file";
			input.multiple = true;
			input.style.display = "none";
			document.body.append(input);
			const status = el("div", "dml-upload-status");
			status.hidden = true;
			document.body.append(status);
			let rows = [];
			let hideTimer = null;
			const show = () => {
				status.hidden = false;
				window.clearTimeout(hideTimer);
				hideTimer = window.setTimeout(() => {
					status.hidden = true;
				}, 8000);
			};
			const render = () => {
				status.textContent = "";
				const head = el("div", "dml-upload-head");
				const ok = rows.filter((r) => r.state === "ok").length;
				const err = rows.filter((r) => r.state === "err").length;
				head.append(
					el("span", "", "上传文件"),
					el("span", "dml-spacer", (ok || err ? ok + " 成功 / " + err + " 失败" : rows.length + " 个排队中"))
				);
				const close = el("button", "dml-close", "✕");
				close.type = "button";
				close.addEventListener("click", () => {
					status.hidden = true;
					window.clearTimeout(hideTimer);
				});
				head.append(close);
				status.append(head);
				for (const r of rows) {
					const row = el("div", "dml-upload-row" + (r.state === "err" ? " err" : ""));
					row.append(el("span", "", r.state === "ok" ? "✓" : r.state === "err" ? "✗" : "⏫"));
					row.append(el("span", "dml-row-name", r.label));
					status.append(row);
				}
			};
			const post = (file, row) => new Promise((resolve) => {
				const xhr = new XMLHttpRequest();
				xhr.open("POST", "/mobile-files/upload?name=" + encodeURIComponent(file.name));
				xhr.upload.onprogress = (e) => {
					if (e.lengthComputable) {
						row.label = file.name + "  " + Math.round(e.loaded / e.total * 100) + "%";
						render();
					}
				};
				xhr.onload = () => {
					const ct = xhr.getResponseHeader("content-type") || "";
					if (!ct.includes("application/json")) {
						row.state = "err";
						if (xhr.status === 200) {
							// SPA fallback: route not registered (host half cold)
							row.label = file.name + " — 文件服务未就绪（dsh web 进程重启后生效）";
						} else if (xhr.status === 413) {
							row.label = file.name + " — 文件过大，超出网关大小限制（HTTP 413）";
						} else {
							row.label = file.name + " — 网关/代理错误（HTTP " + xhr.status + "）";
						}
						render();
						resolve();
						return;
					}
					let data = null;
					try {
						data = JSON.parse(xhr.responseText);
					} catch {
						data = null;
					}
					if (xhr.status === 200 && data && data.saved) {
						row.state = "ok";
						row.label = file.name + " → " + data.saved;
						render();
						window.dispatchEvent(new CustomEvent("dml-upload-done", { detail: { path: data.saved } }));
						resolve();
						return;
					}
					row.state = "err";
					row.label = file.name + " — " + (data && data.message ? data.message : "HTTP " + xhr.status);
					render();
					resolve();
				};
				xhr.onerror = () => {
					row.state = "err";
					row.label = file.name + " — 网络错误";
					render();
					resolve();
				};
				xhr.send(file);
			});
			const run = async (files) => {
				rows = [];
				show();
				for (const file of files) {
					const row = { state: "up", label: file.name };
					rows.push(row);
					render();
					await post(file, row);
				}
			};
			input.addEventListener("change", () => {
				const files = Array.from(input.files || []);
				input.value = ""; // clear so re-selecting the same file fires change again
				if (files.length) run(files);
			});
			ctx.effect(() => () => {
				input.remove();
				status.remove();
				window.clearTimeout(hideTimer);
			}, "dsh-mobile-layout: upload");
			return { open: () => input.click() };
		}

		/**
		 * Settings-dialog escape from the glass sidebar:
		 * the app renders the settings overlay (position:fixed) as a DOM
		 * descendant of the sidebar column. A backdrop-filter on an ancestor
		 * turns it into the containing block for fixed descendants (CSS spec),
		 * so with the glass skin the overlay is pinned to the 280px drawer
		 * instead of the viewport — "settings opens inside the slide-out
		 * drawer and displays incompletely". While any fixed overlay is open,
		 * temporarily clear backdrop-filter on its ancestors; restore when
		 * closed. (Backdrop-filter is the only containing-block creator in
		 * play here — transform/filter/will-change are all neutral at rest.)
		 */
		function settingsOverlayEscapeController() {
			let neutralized = new Map(); // element -> original inline backdropFilter
			let timer = 0;
			const sync = () => {
				timer = 0;
				const skinActive = document.body.hasAttribute("data-dsh-mobile-skin");
				const overlays = skinActive
					? [...document.querySelectorAll('[class*="_overlay"]')].filter(el => getComputedStyle(el).position === "fixed")
					: [];
				const stillNeeded = new Set();
				for (const ov of overlays) {
					let a = ov.parentElement;
					while (a && a !== document.body && a !== document.documentElement) {
						if (neutralized.has(a)) {
							stillNeeded.add(a);
						} else {
							const cs = getComputedStyle(a);
							if (cs.backdropFilter && cs.backdropFilter !== "none") {
								neutralized.set(a, a.style.backdropFilter);
								a.style.backdropFilter = "none";
								stillNeeded.add(a);
							}
						}
						a = a.parentElement;
					}
				}
				for (const el of [...neutralized.keys()]) {
					if (!stillNeeded.has(el)) {
						el.style.backdropFilter = neutralized.get(el);
						neutralized.delete(el);
					}
				}
			};
			const obs = new MutationObserver(() => {
				if (!timer) timer = setTimeout(sync, 120);
			});
			obs.observe(document.body, { childList: true, subtree: true });
			return () => {
				obs.disconnect();
				clearTimeout(timer);
				for (const [el, prev] of neutralized) el.style.backdropFilter = prev;
				neutralized.clear();
			};
		}

		/**
		 * Drawer dismissal on narrow viewports:
		 *  - tapping the dimmed backdrop closes the drawer;
		 *  - tapping a session title or the new-session button also closes it.
		 *
		 * The session row also contains status/time and an actions menu. Those
		 * controls must keep the drawer open so users can expand workspaces and
		 * archive or manage a session without the drawer disappearing first.
		 */
		function apply(ctx) {
			const LAYOUT_OWNER_ATTR = "data-dsh-mobile-layout-owner";
			const OWNER = "dsh-mobile-layout";
			let claimingLayout = false;
			const claimLayout = () => {
				if (claimingLayout || document.body.hasAttribute(LAYOUT_OWNER_ATTR)) return;
				claimingLayout = true;
				document.body.setAttribute(LAYOUT_OWNER_ATTR, OWNER);
				claimingLayout = false;
			};
			claimLayout();
			const layoutOwnerObs = new MutationObserver(() => claimLayout());
			layoutOwnerObs.observe(document.body, { attributes: true, attributeFilter: [LAYOUT_OWNER_ATTR] });
			ctx.effect(() => () => {
				layoutOwnerObs.disconnect();
				if (document.body.getAttribute(LAYOUT_OWNER_ATTR) === OWNER) document.body.removeAttribute(LAYOUT_OWNER_ATTR);
			}, "dsh-mobile-layout: layout ownership");
			const toggleSidebar = () => {
				if (document.body.getAttribute(LAYOUT_OWNER_ATTR) !== OWNER || window.innerWidth >= 1024) return;
				let layout;
				try {
					layout = ctx.get("layout");
				} catch {
					layout = null;
				}
				if (layout && typeof layout.toggleSidebar === "function") layout.toggleSidebar();
			};
			const drawerOpen = () => {
				const overlay = document.querySelector("[data-shell-overlay]");
				const frame = overlay && overlay.parentElement;
				return !!frame && !frame.hasAttribute("data-sidebar-collapsed");
			};
			ctx.effect(() => {
				const onClick = (event) => {
					const target = event.target;
					if (!target || target.nodeType !== 1) return;
					if (target.hasAttribute("data-shell-overlay")) {
						toggleSidebar();
						return;
					}
					if (!drawerOpen()) return;
					const newSession = target.closest('[class*="_newSession"]');
					const sessionTitle = target.closest('[class*="_sessionRow"] [class*="_title"]');
					if (newSession || sessionTitle) toggleSidebar();
				};
				document.addEventListener("click", onClick, true);
				return () => {
					document.removeEventListener("click", onClick, true);
				};
			}, "dsh-mobile-layout: drawer dismissal");
			abortRetryController(ctx);
			// These controllers stay mounted so they resume if a competing layout
			// releases ownership; every interaction checks the owner attribute.
			whaleButtonController(ctx);
			composerAutoHideController(ctx);
			filesViewController(ctx);
			ctx.effect(() => settingsOverlayEscapeController(), "dsh-mobile-layout: settings overlay escape");
			const skin = skinController(ctx);
			const upload = uploadController(ctx);
			if (ctx.slots && typeof ctx.slots.inject === "function") {
				const { IconPersonalizationOutline16, IconPaperclipOutline16 } = primitives;
				const MobileActionsRow = ({ wide, openSkin, openUpload }) => {
					const Btn = ({ icon, label, onClick }) => react.createElement("button", {
						type: "button",
						className: wide ? "dml-side-btn" : "dml-side-btn dml-side-btn-rail",
						title: label,
						onClick
					}, icon, wide ? react.createElement("span", { className: "dml-side-label" }, label) : null);
					return react.createElement("div", { className: "dml-side-actions" },
						react.createElement(Btn, { icon: react.createElement(IconPaperclipOutline16, { size: wide ? 16 : 18 }), label: "上传文件", onClick: openUpload }),
						react.createElement(Btn, { icon: react.createElement(IconPersonalizationOutline16, { size: wide ? 16 : 18 }), label: "主题与背景", onClick: openSkin })
					);
				};
				ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register({
					name: "sidebar.footer.action",
					id: "dsh-mobile-actions",
					inject: () => ({ openSkin: skin.open, openUpload: upload.open })
				}, MobileActionsRow));
			}
		}
		exports.apply = apply;
		exports.inject = ["slots", "theme"];
		return module.exports;
	}
});
