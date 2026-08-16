/**
 * dsh-mobile-layout, browser half. Prebuilt client bundle in the exact
 * `window.__ModuleLoader__.load({ id, factory })` CJS-factory format the
 * dsh client module system consumes (hand-written, zero dependencies).
 *
 * Sections:
 *  1. Responsive stylesheet (<1024px, the app shell's SIDEBAR_AUTO_COLLAPSE):
 *     - sidebar → fixed overlay drawer + backdrop;
 *     - reading density: smaller markdown typography (via --dsw-font-markdown-*
 *       token overrides) and tighter margins;
 *     - markdown tables: natural width + horizontal scroll (touch-friendly);
 *     - message header timestamps / composer button row wrap.
 *  2. Skin controller (🎨 fab): transparency + background theming driven by
 *     --dsw-alias-* token overrides (color-mix against the un-overridden
 *     layer-1 token, so light/dark themes keep working live), persisted in
 *     localStorage (like the community dsh-skin plugins).
 *  3. File browser (📁 fab): directory browsing + file preview (text /
 *     markdown / code / images / PDF) over the host's /mobile-files route
 *     registered by this package's node half.
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
			"  /* --- sidebar: no rail at all; whale button opens the overlay drawer --- */",
			"  body :has(> [class*=\"_sidebarCol\"]) {",
			"    grid-template-columns: 0 minmax(0, 1fr) 0 !important;",
			"  }",
			"  body :has(> [class*=\"_sidebarCol\"])[data-sidebar-collapsed] > [class*=\"_sidebarCol\"] {",
			"    display: none;",
			"  }",
			"  body :has(> [class*=\"_sidebarCol\"]) > [class*=\"_sidebarCol\"] {",
			"    grid-column: 1 !important;",
			"  }",
			"  body :has(> [class*=\"_sidebarCol\"]) > [class*=\"_centerCol\"] {",
			"    grid-column: 2 !important;",
			"  }",
			"  body :has(> [class*=\"_sidebarCol\"]) > [class*=\"_detailsCol\"] {",
			"    grid-column: 3 !important;",
			"  }",
			"  body :has(> [class*=\"_sidebarCol\"]):not([data-sidebar-collapsed]) > [class*=\"_sidebarCol\"] {",
			"    position: fixed;",
			"    top: 0; left: 0; bottom: 0;",
			"    width: min(280px, 85vw);",
			"    z-index: 40;",
			"    box-shadow: 16px 0 48px rgb(0 0 0 / 0.45);",
			"  }",
			"  body :has(> [class*=\"_sidebarCol\"]):not([data-sidebar-collapsed]) > [class*=\"_overlayLayer\"] {",
			"    pointer-events: auto;",
			"    background: rgb(0 0 0 / 0.4);",
			"    z-index: 30;",
			"    transition: background-color 0.2s;",
			"  }",
			"  body :has(> [class*=\"_sidebarCol\"]) [data-side=\"sidebar\"] {",
			"    display: none;",
			"  }",
			"  /* --- reading density: smaller typography + tighter margins --- */",
			"  body {",
			"    --dsw-font-markdown-base: 14px/22px var(--dsw-font-family) !important;",
			"    --dsw-font-markdown-base-strong: 600 14px/22px var(--dsw-font-family) !important;",
			"    --dsw-font-markdown-h1: 700 19px/26px var(--dsw-font-family) !important;",
			"    --dsw-font-markdown-h2: 700 18px/25px var(--dsw-font-family) !important;",
			"    --dsw-font-markdown-h3: 700 17px/24px var(--dsw-font-family) !important;",
			"    --dsw-font-markdown-h4: 600 15px/22px var(--dsw-font-family) !important;",
			"    --dsw-font-markdown-code: 12px/19px var(--ds-font-family-code) !important;",
			"  }",
			"  body [class*=\"_markdown\"] p { margin: 10px 0; }",
			"  body [class*=\"_markdown\"] h1,",
			"  body [class*=\"_markdown\"] h2,",
			"  body [class*=\"_markdown\"] h3 { margin: 20px 0 10px; }",
			"  body [class*=\"_markdown\"] h4 { margin: 12px 0 8px; }",
			"  body [class*=\"_markdown\"] :where(ul,ol) { margin: 10px 0; }",
			"  body [class*=\"_markdown\"] hr { margin: 20px 0; }",
			"  body [class*=\"_markdown\"] blockquote { margin: 10px 0 0; }",
			"  body [class*=\"_markdown\"] pre { margin: 10px 0; }",
			"  body [class*=\"_timeEnd\"] { white-space: normal; overflow-wrap: anywhere; font-size: 12px; }",
			"  body [class*=\"_source\"] { white-space: normal; overflow-wrap: anywhere; }",
			"  body [class*=\"_actions\"] { flex-wrap: wrap; }",
			"  /* --- markdown tables: natural width, horizontal scroll, compact --- */",
			"  body [class*=\"_markdown\"] th,",
			"  body [class*=\"_markdown\"] td {",
			"    font-size: 13px;",
			"    padding: 6px 10px 6px 0;",
			"  }",
			"  [class*=\"_tableScroll\"] {",
			"    -webkit-overflow-scrolling: touch;",
			"    overscroll-behavior-x: contain;",
			"    scrollbar-width: thin;",
			"  }",
			"  /* --- long tokens in prose wrap instead of overflowing --- */",
			"  body [class*=\"_markdown\"] code,",
			"  body [class*=\"_markdown\"] a {",
			"    overflow-wrap: anywhere;",
			"  }",
			"  /* --- composer button row: wrap + ellipsize model name --- */",
			"  [class*=\"_composerSeat\"] [class*=\"_row\"] { flex-wrap: wrap; }",
			"  [class*=\"_composerSeat\"] [class*=\"_trigger\"] { min-width: 0; }",
			"  [class*=\"_composerSeat\"] [class*=\"_triggerLabel\"] { overflow: hidden; text-overflow: ellipsis; }",
			"  /* --- header: make room for the whale button + tighter layout --- */",
			"  [class*=\"_centerCol\"] [class*=\"_titleRow\"] { padding-left: 44px; gap: 6px; }",
			"  [class*=\"_centerCol\"] [class*=\"_titleCluster\"] { min-width: 0; }",
			"}",
			"",
			"/* ===== whale button (mobile session drawer trigger) ===== */",
			".dml-whale-btn {",
			"  display: none;",
			"  position: fixed; top: 10px; left: 10px; z-index: 38;",
			"  width: 34px; height: 34px; border-radius: 50%;",
			"  align-items: center; justify-content: center;",
			"  cursor: pointer; color: var(--dsw-alias-label-primary);",
			"  background: var(--dsw-alias-bg-layer-2);",
			"  border: 1px solid rgb(127 127 127 / 0.12);",
			"  box-shadow: 0 2px 10px rgb(0 0 0 / 0.18);",
			"  transition: opacity 0.18s ease;",
			"  -webkit-tap-highlight-color: transparent;",
			"}",
			".dml-whale-btn:active { transform: scale(0.94); }",
			"@media (max-width: 1023.98px) { .dml-whale-btn { display: flex; } }",
			"",
			"/* ===== composer auto-hide on scroll (mobile, button-free) ===== */",
			"@media (max-width: 1023.98px) {",
			"  [class*=\"_composerSeat\"] {",
			"    transition: transform 0.22s ease, opacity 0.22s ease;",
			"  }",
			"  /* phase 1: slide down + fade out (pointer-inert during the slide) */",
			"  body.dml-composer-auto-hidden [class*=\"_composerSeat\"] {",
			"    transform: translateY(48px);",
			"    opacity: 0;",
			"    pointer-events: none;",
			"  }",
			"  /* phase 2: reclaim the reading space */",
			"  body.dml-composer-auto-gone [class*=\"_composerSeat\"] {",
			"    display: none;",
			"  }",
			"  @media (prefers-reduced-motion: reduce) {",
			"    [class*=\"_composerSeat\"] { transition: none; }",
			"  }",
			"}",
			"",
			"/* ===== uniform faint seams: soften every border token inside the app columns ===== */",
			"[class*=\"_centerCol\"],",
			"[class*=\"_sidebarCol\"],",
			"[class*=\"_detailsCol\"] {",
			"  --dsw-alias-border-l1: rgb(127 127 127 / 0.10);",
			"  --dsw-alias-border-l2: rgb(127 127 127 / 0.10);",
			"  --dsw-alias-border-l3: rgb(127 127 127 / 0.10);",
			"  --dsw-alias-border-l2-darkmode-thin: rgb(127 127 127 / 0.12);",
			"}",
			"",
			"/* ===== skin: aurora glass theme (surface alpha set from JS for browser compatibility) ===== */",
			"body[data-dsh-mobile-skin=\"glass\"] [class*=\"_centerCol\"] {",
			"  backdrop-filter: blur(16px) saturate(1.6);",
			"  -webkit-backdrop-filter: blur(16px) saturate(1.6);",
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
			"  backdrop-filter: blur(3px) saturate(1.05);",
			"  -webkit-backdrop-filter: blur(3px) saturate(1.05);",
			"}",
			"body[data-dml-bg=\"custom\"][data-dsh-mobile-skin=\"glass\"] [class*=\"_sidebarCol\"] {",
			"  backdrop-filter: blur(8px) saturate(1.1);",
			"  -webkit-backdrop-filter: blur(8px) saturate(1.1);",
			"}",
			"body[data-dml-bg=\"custom\"][data-dsh-mobile-skin=\"glass\"] [class*=\"_composerSeat\"] {",
			"  backdrop-filter: blur(5px);",
			"  -webkit-backdrop-filter: blur(5px);",
			"}",
			"body[data-dml-bg=\"custom\"][data-dsh-mobile-skin=\"glass\"] .dml-panel {",
			"  backdrop-filter: blur(10px) saturate(1.2);",
			"  -webkit-backdrop-filter: blur(10px) saturate(1.2);",
			"}",
			"body[data-dml-bg=\"custom\"][data-dsh-mobile-skin=\"semi\"] [class*=\"_centerCol\"] {",
			"  backdrop-filter: none;",
			"  -webkit-backdrop-filter: none;",
			"}",
			"/* conversation header: wrap instead of overlapping on narrow columns */",
			"[class*=\"_centerCol\"] [class*=\"_titleRow\"] { flex-wrap: wrap; }",
			"/* Session log button is desktop-only (body-scoped to outrank the",
			"   conversation plugin's runtime-injected style tag) */",
			"@media (max-width: 1023.98px) {",
			"  body [class*=\"_centerCol\"] [class*=\"_sessionLogButton\"] { display: none; }",
			"}",
			"[class*=\"_centerCol\"] [class*=\"_sessionLogButton\"] {",
			"  padding-left: 8px; padding-right: 8px; font-size: 12px;",
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
			".dml-chips { display: flex; gap: 8px; flex-wrap: wrap; }",
			".dml-chip {",
			"  padding: 7px 14px; border-radius: 16px; cursor: pointer; font-size: 13.5px;",
			"  border: 1px solid var(--dsw-alias-border-l2);",
			"  background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-primary);",
			"  -webkit-tap-highlight-color: transparent;",
			"}",
			".dml-chip.on {",
			"  border-color: var(--dsw-alias-state-business-primary);",
			"  color: var(--dsw-alias-state-business-primary);",
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
				if (attempts >= 2) return;
				attempts += 1;
				lastHealAt = now;
				log("heal:attempt" + attempts);
				window.setTimeout(reopen, 600);
				window.clearTimeout(recheckTimer);
				recheckTimer = window.setTimeout(() => {
					const err = document.querySelector('[class*="_openError"]');
					if (err && /abort/i.test(err.textContent || "")) {
						if (attempts >= 2) {
							log("heal:reload");
							window.location.reload();
						} else {
							heal();
						}
					} else {
						attempts = 0;
					}
				}, 4000);
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
			btn.innerHTML = '<svg width="21" height="15" viewBox="0 0 23.16 17.04" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="' + "M22.9168 1.43018C22.6713 1.31018 22.5658 1.53918 22.4223 1.65519C22.3733 1.69269 22.3318 1.74169 22.2903 1.78669C21.9317 2.1697 21.5127 2.42121 20.9657 2.39121C20.1657 2.34621 19.4827 2.59771 18.8787 3.20973C18.7502 2.45521 18.3236 2.0047 17.6746 1.71569C17.3351 1.56568 16.9916 1.41518 16.7536 1.08867C16.5876 0.856163 16.5421 0.597155 16.4591 0.341647C16.4061 0.187643 16.3536 0.0301382 16.1761 0.00363739C15.9836 -0.0263635 15.9081 0.135141 15.8326 0.270145C15.5306 0.822162 15.4136 1.43018 15.4251 2.0462C15.4516 3.43174 16.0366 4.53527 17.1991 5.3203C17.3311 5.4103 17.3651 5.5003 17.3236 5.63181C17.2441 5.90231 17.1501 6.16482 17.0671 6.43533C17.0141 6.60784 16.9351 6.64584 16.7501 6.57033C16.1121 6.30383 15.5611 5.90931 15.074 5.4328C14.2475 4.63328 13.5 3.75075 12.568 3.05973C12.349 2.89822 12.13 2.74822 11.9034 2.60522C10.9524 1.68169 12.028 0.923165 12.277 0.833162C12.5375 0.739159 12.3675 0.41615 11.5259 0.42015C10.6844 0.42365 9.91439 0.705658 8.93286 1.08117C8.78935 1.13767 8.63835 1.17867 8.48384 1.21267C7.59332 1.04367 6.66829 1.00617 5.70226 1.11517C3.88321 1.31768 2.43016 2.1777 1.36213 3.64575C0.0790928 5.4103 -0.222916 7.41536 0.146595 9.50642C0.535106 11.7105 1.66014 13.535 3.38869 14.9616C5.18125 16.4406 7.24581 17.1657 9.60138 17.0266C11.0319 16.9441 12.6245 16.7526 14.421 15.2321C14.874 15.4576 15.3496 15.5476 16.1381 15.6151C16.7456 15.6716 17.3306 15.5851 17.7836 15.4911C18.4931 15.3411 18.4441 14.6841 18.1876 14.5636C16.1081 13.595 16.5646 13.9891 16.1496 13.67C17.2061 12.42 18.8202 10.1979 19.3182 7.17235C19.3672 6.83834 19.4297 6.36783 19.4222 6.09732C19.4182 5.93231 19.4562 5.86831 19.6447 5.84931C20.1657 5.78931 20.6712 5.64681 21.1357 5.3913C22.4833 4.65528 23.0268 3.44624 23.1548 1.9972C23.1738 1.77569 23.1508 1.54668 22.9168 1.43018ZM11.1749 14.4736C9.15936 12.889 8.18184 12.3675 7.77832 12.39C7.40081 12.4125 7.46881 12.8445 7.55182 13.126C7.63882 13.404 7.75182 13.5955 7.91033 13.8396C8.01983 14.0011 8.09533 14.2411 7.80083 14.4216C7.15181 14.8231 6.02327 14.2866 5.97027 14.2601C4.65673 13.4865 3.5587 12.4655 2.78467 11.069C2.03715 9.72493 1.60314 8.28289 1.53164 6.74384C1.51264 6.37233 1.62214 6.24082 1.99215 6.17332C2.47916 6.08332 2.98118 6.06432 3.46769 6.13582C5.52476 6.43633 7.27581 7.35586 8.74385 8.8129C9.58188 9.64243 10.2159 10.634 10.8689 11.6025C11.5634 12.631 12.3105 13.611 13.262 14.4146C13.598 14.6961 13.866 14.9101 14.1225 15.0681C13.349 15.1546 12.058 15.1731 11.1749 14.4746L11.1749 14.4736ZM12.141 8.25988C12.141 8.09488 12.273 7.96338 12.439 7.96338C12.4765 7.96338 12.5105 7.97088 12.541 7.98188C12.5825 7.99688 12.6205 8.01938 12.6505 8.05338C12.7035 8.10588 12.7335 8.18088 12.7335 8.25988C12.7335 8.42489 12.6015 8.55639 12.4355 8.55639C12.2695 8.55639 12.141 8.42489 12.141 8.25988ZM15.1415 9.79893C14.949 9.87793 14.7565 9.94544 14.5715 9.95294C14.2845 9.96794 13.9715 9.85143 13.8015 9.70893C13.5375 9.48742 13.3485 9.36342 13.2695 8.97691C13.2355 8.8119 13.2545 8.55639 13.2845 8.40989C13.3525 8.09438 13.277 7.89187 13.0545 7.70787C12.8735 7.55786 12.643 7.51636 12.39 7.51636C12.2955 7.51636 12.209 7.47486 12.1445 7.44136C12.039 7.38886 11.9519 7.25735 12.035 7.09585C12.0615 7.04335 12.19 6.91584 12.22 6.89334C12.5635 6.69784 12.9595 6.76184 13.326 6.90834C13.6655 7.04735 13.9225 7.30236 14.292 7.66287C14.6695 8.09838 14.7375 8.21838 14.9525 8.54539C15.1225 8.8009 15.277 9.06341 15.3831 9.36392C15.4471 9.55142 15.3641 9.70493 15.1415 9.79893ZM68.416 18.2447H67.0501V16.1272H68.416C69.2619 16.1272 70.1166 15.9163 70.6671 15.3304C71.2181 14.7444 71.426 13.8455 71.426 12.9471C71.426 12.0487 71.2268 11.1498 70.6671 10.5643C70.1083 9.97831 69.2619 9.76744 68.416 9.76744C67.5701 9.76744 66.7154 9.97831 66.1639 10.5643C65.6129 11.1503 65.4049 12.0487 65.4049 12.9471V21.6435H63.009V7.6582H65.4049V8.54883H65.8442C65.8918 8.49393 65.9394 8.44728 65.9875 8.40064C66.5871 7.85353 67.5049 7.6582 68.4072 7.6582C69.8212 7.6582 71.2341 8.00998 72.1607 8.98662C73.0868 9.96325 73.4143 11.4632 73.4143 12.9558C73.4143 14.4485 73.0785 15.9406 72.1607 16.925C71.2424 17.9094 69.8212 18.2457 68.416 18.2457V18.2447ZM31.9551 8.03497H33.3204V10.1525H31.9551C31.1087 10.1525 30.2545 10.3633 29.7035 10.9493C29.1525 11.5353 28.945 12.4342 28.945 13.3326C28.945 14.231 29.1447 15.1294 29.7035 15.7154C30.2623 16.3014 31.1087 16.5122 31.9551 16.5122C32.8015 16.5122 33.6562 16.3014 34.2072 15.7154C34.7582 15.1294 34.9657 14.231 34.9657 13.3326V4.62842H37.3611V18.6219H34.9657V17.7313H34.5264C34.4783 17.7857 34.4307 17.8329 34.3826 17.8795C33.7835 18.4261 32.8652 18.6219 31.9629 18.6219C30.5494 18.6219 29.136 18.2707 28.2099 17.294C27.2838 16.3174 26.9563 14.817 26.9563 13.3248C26.9563 11.8327 27.2916 10.34 28.2099 9.35561C29.136 8.37898 30.5494 8.03497 31.9551 8.03497ZM49.3786 13.1431V13.9948H42.9984V12.2996H47.2305C47.1348 11.6825 46.9113 11.1043 46.5119 10.682C45.9371 10.0727 45.0503 9.85409 44.1723 9.85409C43.2943 9.85409 42.4076 10.0727 41.8328 10.682C41.258 11.2913 41.05 12.2213 41.05 13.1435C41.05 14.0658 41.2575 15.003 41.8328 15.6046C42.4076 16.2061 43.2939 16.433 44.1723 16.433C45.0508 16.433 45.9371 16.2143 46.5119 15.6046C46.5916 15.5186 46.6635 15.4248 46.7354 15.331H49.0992C48.8918 16.0657 48.5643 16.7299 48.0691 17.2454C47.111 18.2531 45.6339 18.6205 44.1723 18.6205C42.7108 18.6205 41.2337 18.2609 40.2755 17.2454C39.3174 16.2299 38.9661 14.6828 38.9661 13.1435C38.9661 11.6043 39.3096 10.0494 40.2755 9.04168C41.242 8.03396 42.7108 7.66663 44.1723 7.66663C45.6339 7.66663 47.111 8.02618 48.0691 9.04168C49.0351 10.0572 49.3786 11.6043 49.3786 13.1435V13.1431ZM61.4045 13.1431V13.9948H55.0243V12.2996H59.2564C59.1602 11.6825 58.9372 11.1043 58.5378 10.682C57.963 10.0727 57.0762 9.85409 56.1982 9.85409C55.3202 9.85409 54.4335 10.0727 53.8587 10.682C53.2839 11.2913 53.0759 12.2213 53.0759 13.1435C53.0759 14.0658 53.2834 15.003 53.8587 15.6046C54.4335 16.2061 55.3202 16.433 56.1982 16.433C57.0762 16.433 57.963 16.2143 58.5378 15.6046C58.6179 15.5186 58.6894 15.4248 58.7608 15.331H61.1251C60.9171 16.0657 60.5897 16.7299 60.0945 17.2454C59.1364 18.2531 57.6593 18.6205 56.1982 18.6205C54.7372 18.6205 53.2596 18.2609 52.3014 17.2454C51.3432 16.2299 50.9919 14.6828 50.9919 13.1435C50.9919 11.6043 51.3355 10.0494 52.3014 9.04168C53.2678 8.03396 54.7367 7.66663 56.1982 7.66663C57.6598 7.66663 59.1364 8.02618 60.0945 9.04168C61.061 10.0572 61.4045 11.6043 61.4045 13.1435V13.1431ZM80.242 18.6214C81.7035 18.6214 83.1801 18.4105 84.1383 17.809C85.0965 17.2075 85.4482 16.2931 85.4482 15.3869C85.4482 14.4807 85.1042 13.5585 84.1383 12.9647C83.1801 12.371 81.703 12.1518 80.242 12.1518C79.6186 12.1518 79.0438 12.0658 78.6366 11.8394C78.2294 11.6047 78.0778 11.2534 78.0778 10.9017C78.0778 10.5499 78.2216 10.1908 78.6366 9.9639C79.0438 9.72921 79.6749 9.65147 80.2973 9.65147C80.9198 9.65147 81.5509 9.73747 81.9591 9.9639C82.3663 10.1986 82.5179 10.5499 82.5179 10.9017H84.9531C84.9531 9.99499 84.6421 9.07327 83.7719 8.47951C82.9017 7.88576 81.5679 7.66663 80.2424 7.66663C78.9169 7.66663 77.5837 7.8775 76.713 8.47951C75.8427 9.08104 75.5308 9.99499 75.5308 10.9017C75.5308 11.8083 75.8423 12.73 76.713 13.3238C77.5832 13.9176 78.9165 14.1367 80.2424 14.1367C80.929 14.1367 81.688 14.2227 82.1428 14.4491C82.5985 14.676 82.7579 15.0351 82.7579 15.3869C82.7579 15.7387 82.5985 16.0977 82.1428 16.3246C81.688 16.5511 80.9931 16.6371 80.3066 16.6371C79.62 16.6371 78.9169 16.5511 78.4694 16.3246C78.0224 16.0982 77.8543 15.7387 77.8543 15.3869H75.0435C75.0435 16.2935 75.3865 17.2153 76.3534 17.809C77.3194 18.4028 78.7809 18.6214 80.2424 18.6214H80.242ZM97.4733 13.1431V13.9948H91.0932V12.2996H95.3252C95.23 11.6825 95.006 11.1043 94.6071 10.682C94.0313 10.0727 93.1456 9.85409 92.2666 9.85409C91.3876 9.85409 90.5018 10.0727 89.927 10.682C89.3522 11.2913 89.1452 12.2213 89.1452 13.1435C89.1452 14.0658 89.3522 15.003 89.927 15.6046C90.5018 16.2061 91.3886 16.433 92.2666 16.433C93.1446 16.433 94.0313 16.2143 94.6071 15.6046C94.6863 15.5186 94.7587 15.4248 94.8301 15.331H97.1935C96.9855 16.0657 96.6585 16.7299 96.1639 17.2454C95.2057 18.2531 93.7281 18.6205 92.2666 18.6205C90.805 18.6205 89.3284 18.2609 88.3703 17.2454C87.4121 16.2299 87.0613 14.6828 87.0613 13.1435C87.0613 11.6043 87.4043 10.0494 88.3703 9.04168C89.3367 8.03396 90.806 7.66663 92.2666 7.66663C93.7272 7.66663 95.2057 8.02618 96.1639 9.04168C97.1298 10.0572 97.4729 11.6043 97.4729 13.1435L97.4733 13.1431ZM109.499 13.1431V13.9948H103.119V12.2996H107.351C107.256 11.6825 107.032 11.1043 106.632 10.682C106.057 10.0727 105.172 9.85409 104.293 9.85409C103.414 9.85409 102.528 10.0727 101.953 10.682C101.378 11.2913 101.17 12.2213 101.17 13.1435C101.17 14.0658 101.378 15.003 101.953 15.6046C102.528 16.2061 103.415 16.433 104.293 16.433C105.171 16.433 106.057 16.2143 106.632 15.6046C106.712 15.5186 106.784 15.4248 106.856 15.331H109.22C109.012 16.0657 108.685 16.7299 108.19 17.2454C107.231 18.2531 105.754 18.6205 104.293 18.6205C102.831 18.6205 101.355 18.2609 100.396 17.2454C99.4382 16.2299 99.0864 14.6828 99.0864 13.1435C99.0864 11.6043 99.4295 10.0494 100.396 9.04168C101.362 8.03396 102.832 7.66663 104.293 7.66663C105.754 7.66663 107.231 8.02618 108.19 9.04168C109.156 10.0572 109.499 11.6043 109.499 13.1435V13.1431ZM113.5 4.62817H111.104V18.6217H113.5V4.62817ZM117.589 12.8154L121.517 18.6208H118.554L114.625 12.8154L118.554 8.15088H121.517L117.589 12.8154ZM23.0584 4.95203C22.8129 4.83203 22.7074 5.06103 22.5639 5.17704C22.5149 5.21454 22.4734 5.26354 22.4319 5.30854C22.0734 5.69155 21.6543 5.94306 21.1073 5.91306C20.3073 5.86806 19.6243 6.11957 19.0203 6.73158C18.8918 5.97706 18.4652 5.52655 17.8162 5.23754C17.4767 5.08753 17.1332 4.93703 16.8952 4.61052C16.7292 4.37801 16.6837 4.11901 16.6007 3.8635C16.5477 3.70949 16.4952 3.55199 16.3177 3.52549C16.1252 3.49549 16.0497 3.65699 15.9742 3.792C15.6722 4.34401 15.5552 4.95203 15.5667 5.56805C15.5932 6.95359 16.1782 8.05712 17.3407 8.84215C17.4727 8.93215 17.5067 9.02215 17.4652 9.15366C17.3857 9.42416 17.2917 9.68667 17.2087 9.95718C17.1557 10.1297 17.0767 10.1677 16.8917 10.0922C16.2537 9.82568 15.7027 9.43117 15.2156 8.95465C14.3891 8.15513 13.6416 7.2726 12.7096 6.58158C12.4906 6.42007 12.2716 6.27007 12.045 6.12707C11.094 5.20354 12.1696 4.44502 12.4186 4.35501C12.6791 4.26101 12.5091 3.938 11.6675 3.942C10.826 3.9455 10.056 4.22751 9.07446 4.60302C8.93096 4.65952 8.77995 4.70052 8.62545 4.73452C7.73492 4.56552 6.80989 4.52802 5.84386 4.63702C4.02481 4.83953 2.57177 5.69955 1.50373 7.1676C0.220694 8.93215 -0.0813148 10.9372 0.288196 13.0283C0.676708 15.2323 1.80174 17.0569 3.53029 18.4834C5.32285 19.9625 7.38741 20.6875 9.74298 20.5485C11.1735 20.466 12.7661 20.2745 14.5626 18.7539C15.0156 18.9795 15.4912 19.0695 16.2797 19.137C16.8872 19.1935 17.4722 19.107 17.9252 19.013C18.6347 18.8629 18.5857 18.2059 18.3292 18.0854C16.2497 17.1169 16.7062 17.5109 16.2912 17.1919C17.3477 15.9419 18.9618 13.7198 19.4598 10.6942C19.5088 10.3602 19.5713 9.88968 19.5638 9.61917C19.5598 9.45417 19.5978 9.39016 19.7863 9.37116C20.3073 9.31116 20.8128 9.16866 21.2773 8.91315C22.6249 8.17713 23.1684 6.96809 23.2964 5.51905C23.3154 5.29754 23.2924 5.06853 23.0584 4.95203ZM11.3165 17.9954C9.30097 16.4109 8.32344 15.8894 7.91992 15.9119C7.54241 15.9344 7.61042 16.3664 7.69342 16.6479C7.78042 16.9259 7.89342 17.1174 8.05193 17.3614C8.16143 17.5229 8.23694 17.7629 7.94243 17.9434C7.29341 18.3449 6.16487 17.8084 6.11187 17.7819C4.79833 17.0084 3.7003 15.9874 2.92628 14.5908C2.17875 13.2468 1.74474 11.8047 1.67324 10.2657C1.65424 9.89418 1.76374 9.76267 2.13375 9.69517C2.62077 9.60517 3.12278 9.58617 3.6093 9.65767C5.66636 9.95818 7.41741 10.8777 8.88545 12.3348C9.72348 13.1643 10.3575 14.1558 11.0105 15.1243C11.705 16.1529 12.4521 17.1329 13.4036 17.9364C13.7396 18.2179 14.0076 18.4319 14.2641 18.5899C13.4906 18.6764 12.1996 18.6949 11.3165 17.9964V17.9954ZM12.2826 11.7817C12.2826 11.6167 12.4146 11.4852 12.5806 11.4852C12.6181 11.4852 12.6521 11.4927 12.6826 11.5037C12.7241 11.5187 12.7621 11.5412 12.7921 11.5752C12.8451 11.6277 12.8751 11.7027 12.8751 11.7817C12.8751 11.9467 12.7431 12.0782 12.5771 12.0782C12.4111 12.0782 12.2826 11.9467 12.2826 11.7817ZM15.2831 13.3208C15.0906 13.3998 14.8981 13.4673 14.7131 13.4748C14.4261 13.4898 14.1131 13.3733 13.9431 13.2308C13.6791 13.0093 13.4901 12.8853 13.4111 12.4988C13.3771 12.3338 13.3961 12.0782 13.4261 11.9317C13.4941 11.6162 13.4186 11.4137 13.1961 11.2297C13.0151 11.0797 12.7846 11.0382 12.5316 11.0382C12.4371 11.0382 12.3506 10.9967 12.2861 10.9632C12.1806 10.9107 12.0936 10.7792 12.1766 10.6177C12.2031 10.5652 12.3316 10.4377 12.3616 10.4152C12.7051 10.2197 13.1011 10.2837 13.4676 10.4302C13.8071 10.5692 14.0641 10.8242 14.4336 11.1847C14.8111 11.6202 14.8791 11.7402 15.0941 12.0672C15.2641 12.3228 15.4186 12.5853 15.5247 12.8858C15.5887 13.0733 15.5057 13.2268 15.2831 13.3208ZM132.848 8.93205H134.08V16.137H132.848V8.93205ZM136.5 8.93205H137.732V16.137H136.5V8.93205ZM133.365 13.024V11.99H137.193V13.024H133.365ZM140.397 14.432L140.672 13.453H143.202L143.532 14.432H140.397ZM140.287 16.137H139.055L141.277 8.93205H142.201L142.146 9.74605L140.947 13.915H140.969L140.287 16.137ZM145.039 16.137H143.741L143.07 13.948L143.081 13.937L141.871 9.74605L141.926 8.93205H142.817L145.039 16.137ZM146.846 8.93205H149.068C149.852 8.93205 150.443 9.11538 150.839 9.48205C151.235 9.84138 151.433 10.3327 151.433 10.956C151.433 11.22 151.396 11.4657 151.323 11.693C151.249 11.9204 151.125 12.1257 150.949 12.309C150.773 12.4924 150.531 12.65 150.223 12.782C149.922 12.9067 149.541 13.0057 149.079 13.079V13.321H146.846V12.639L148.023 12.485C148.631 12.4044 149.09 12.298 149.398 12.166C149.706 12.034 149.915 11.8764 150.025 11.693C150.135 11.5024 150.19 11.2934 150.19 11.066C150.19 10.6994 150.083 10.417 149.871 10.219C149.658 10.021 149.324 9.92205 148.87 9.92205H146.846V8.93205ZM146.395 8.93205H147.627V16.137H146.395V8.93205ZM151.917 16.093V16.137H150.366L149.024 14.322C148.87 14.1094 148.73 13.9407 148.606 13.816C148.481 13.684 148.345 13.5887 148.199 13.53C148.052 13.464 147.872 13.42 147.66 13.398C147.447 13.3687 147.176 13.3504 146.846 13.343V13.145H149.079C149.233 13.211 149.368 13.2844 149.486 13.365C149.61 13.4457 149.735 13.5447 149.86 13.662C149.992 13.7794 150.138 13.937 150.3 14.135L151.917 16.093ZM153.58 9.57005L153.591 8.93205H154.46L157.584 15.51V16.137H156.704L153.58 9.57005ZM158.024 16.137H156.968L156.88 8.93205H158.024V16.137ZM154.24 16.137H153.096V8.93205H154.152L154.24 16.137ZM159.963 8.93205H161.206V16.137H159.963V8.93205ZM160.095 9.96605V8.93205H164.858V9.96605H160.095ZM160.095 16.137V15.103H164.902V16.137H160.095ZM160.095 13.013V11.99H164.374V13.013H160.095ZM169.052 15.257C169.543 15.257 169.895 15.1654 170.108 14.982C170.328 14.7987 170.438 14.5457 170.438 14.223C170.438 14.047 170.405 13.8967 170.339 13.772C170.273 13.6474 170.152 13.5337 169.976 13.431C169.807 13.321 169.558 13.2147 169.228 13.112L168.491 12.881C167.846 12.6757 167.38 12.4044 167.094 12.067C166.808 11.7297 166.665 11.3007 166.665 10.78C166.665 10.428 166.76 10.1017 166.951 9.80105C167.142 9.50038 167.428 9.25838 167.809 9.07505C168.19 8.89172 168.663 8.80005 169.228 8.80005C169.631 8.80005 169.998 8.82938 170.328 8.88805C170.665 8.93938 171.039 9.01638 171.45 9.11905L171.274 10.175C170.834 10.0504 170.442 9.96238 170.097 9.91105C169.76 9.85238 169.463 9.82305 169.206 9.82305C168.737 9.82305 168.403 9.90738 168.205 10.076C168.007 10.2374 167.908 10.439 167.908 10.681C167.908 10.857 167.941 11.0147 168.007 11.154C168.073 11.286 168.19 11.407 168.359 11.517C168.535 11.627 168.784 11.7334 169.107 11.836L169.866 12.078C170.526 12.276 170.995 12.5327 171.274 12.848C171.553 13.156 171.692 13.585 171.692 14.135C171.692 14.5604 171.589 14.9344 171.384 15.257C171.179 15.5797 170.878 15.8327 170.482 16.016C170.093 16.1994 169.609 16.291 169.03 16.291C168.627 16.291 168.212 16.247 167.787 16.159C167.362 16.071 166.9 15.9427 166.401 15.774L166.665 14.718C167.156 14.894 167.6 15.0297 167.996 15.125C168.399 15.213 168.751 15.257 169.052 15.257ZM175.809 15.257C176.3 15.257 176.652 15.1654 176.865 14.982C177.085 14.7987 177.195 14.5457 177.195 14.223C177.195 14.047 177.162 13.8967 177.096 13.772C177.03 13.6474 176.909 13.5337 176.733 13.431C176.564 13.321 176.315 13.2147 175.985 13.112L175.248 12.881C174.603 12.6757 174.137 12.4044 173.851 12.067C173.565 11.7297 173.422 11.3007 173.422 10.78C173.422 10.428 173.517 10.1017 173.708 9.80105C173.899 9.50038 174.185 9.25838 174.566 9.07505C174.947 8.89172 175.42 8.80005 175.985 8.80005C176.388 8.80005 176.755 8.82938 177.085 8.88805C177.422 8.93938 177.796 9.01638 178.207 9.11905L178.031 10.175C177.591 10.0504 177.199 9.96238 176.854 9.91105C176.517 9.85238 176.22 9.82305 175.963 9.82305C175.494 9.82305 175.16 9.90738 174.962 10.076C174.764 10.2374 174.665 10.439 174.665 10.681C174.665 10.857 174.698 11.0147 174.764 11.154C174.83 11.286 174.947 11.407 175.116 11.517C175.292 11.627 175.541 11.7334 175.864 11.836L176.623 12.078C177.283 12.276 177.752 12.5327 178.031 12.848C178.31 13.156 178.449 13.585 178.449 14.135C178.449 14.5604 178.346 14.9344 178.141 15.257C177.936 15.5797 177.635 15.8327 177.239 16.016C176.85 16.1994 176.366 16.291 175.787 16.291C175.384 16.291 174.969 16.247 174.544 16.159C174.119 16.071 173.657 15.9427 173.158 15.774L173.422 14.718C173.913 14.894 174.357 15.0297 174.753 15.125C175.156 15.213 175.508 15.257 175.809 15.257Zdsh-wordmark-whale-clipdsh-wordmark-badge-clip".slice(1, -1) + '" fill="currentColor"/></svg>';
			document.body.append(btn);
			const toggle = () => {
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
			let inited = false;
			let seat = null;
			let scroller = null;
			let hidden = false;
			let gone = false;
			let suppressUntil = 0;
			let mutObs = null;
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
				if (hidden) return;
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
				const atBottom = sc.scrollTop + sc.clientHeight >= sc.scrollHeight - SHOW_BAND;
				if (atBottom) {
					show();
					return;
				}
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
				if (!mq.matches || !seat) return;
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
				if (mq.matches) return;
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
				if (!mq.matches) return;
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
				const onResize = () => evaluate(scroller);
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
				const obs = new MutationObserver(() => {
					if (tryInit()) obs.disconnect();
				});
				obs.observe(document.body, { childList: true, subtree: true });
			}
			ctx.effect(() => () => {
				restoreFooterStats();
				document.removeEventListener("scroll", onScroll, { capture: true });
				document.removeEventListener("click", onTextTap, true);
				window.removeEventListener("resize", onResize);
				mq.removeEventListener("change", onMqChange);
				if (mutObs) mutObs.disconnect();
				document.body.classList.remove("dml-composer-auto-hidden", "dml-composer-auto-gone");
			}, "dsh-mobile-layout: composer auto-hide");
		}

		/** Section 2: transparency + background skinning (localStorage-persisted). */
		function skinController(ctx) {
			const KEY = "dsh-mobile-skin-v1";
			const state = { mode: "off", bg: "aurora1", bgUrl: "", alpha: 60 };
			try {
				Object.assign(state, JSON.parse(localStorage.getItem(KEY) || "{}"));
			} catch {
				/* keep defaults */
			}
			// migrate legacy preset ids + heal the "picked image while mode=off" bug
			if (state.bg === "grad1") state.bg = "aurora1";
			if (state.bg === "grad2") state.bg = "aurora2";
			if (!state.alpha) state.alpha = 60;
			if (state.alpha === 50) state.alpha = 60; // v11 default bump
			if (state.bgUrl && state.mode === "off") state.mode = "glass";
			const AURORA = {
				aurora1: "radial-gradient(44% 40% at 16% 22%, rgba(96,145,255,0.95), transparent 68%), radial-gradient(38% 36% at 84% 16%, rgba(164,112,255,0.9), transparent 68%), radial-gradient(42% 38% at 78% 86%, rgba(255,112,180,0.85), transparent 70%), radial-gradient(36% 34% at 20% 84%, rgba(58,232,207,0.8), transparent 68%)",
				aurora2: "radial-gradient(44% 40% at 16% 20%, rgba(255,144,96,0.92), transparent 68%), radial-gradient(38% 36% at 86% 14%, rgba(255,202,112,0.88), transparent 68%), radial-gradient(42% 38% at 80% 88%, rgba(255,98,162,0.85), transparent 70%), radial-gradient(36% 34% at 18% 82%, rgba(255,240,160,0.75), transparent 68%)",
				aurora3: "radial-gradient(44% 40% at 16% 22%, rgba(52,222,196,0.9), transparent 68%), radial-gradient(38% 36% at 84% 16%, rgba(116,236,184,0.82), transparent 68%), radial-gradient(42% 38% at 78% 86%, rgba(62,196,250,0.8), transparent 70%), radial-gradient(36% 34% at 20% 84%, rgba(136,146,252,0.78), transparent 68%)",
				mono: "radial-gradient(44% 40% at 16% 22%, rgba(176,190,207,0.7), transparent 68%), radial-gradient(38% 36% at 84% 16%, rgba(120,136,155,0.62), transparent 68%), radial-gradient(42% 38% at 78% 86%, rgba(226,234,243,0.5), transparent 70%), radial-gradient(36% 34% at 20% 84%, rgba(88,104,124,0.58), transparent 68%)"
			};
			const BASE = {
				aurora1: "radial-gradient(120% 120% at 50% 0%, #111741 0%, #0a0d24 55%, #130b2b 100%)",
				aurora2: "radial-gradient(120% 120% at 50% 0%, #2e1410 0%, #1c0d14 55%, #130a18 100%)",
				aurora3: "radial-gradient(120% 120% at 50% 0%, #06231e 0%, #041410 60%, #04121c 100%)",
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
			/** The un-overridden surface color source (theme-aware, updated live). */
			let lightValue = "";
			const snapshotLight = () => {
				const v = getComputedStyle(document.body).getPropertyValue("--dsw-alias-bg-layer-1").trim();
				if (v) lightValue = v;
			};
			/** Write translucent surface tokens as plain rgba (works without color-mix). */
			const applySurfaces = () => {
				const mode = state.mode === "off" ? "" : state.mode;
				if (mode && state.bg === "custom") document.body.setAttribute("data-dml-bg", "custom");
				else document.body.removeAttribute("data-dml-bg");
				if (!mode) {
					document.body.style.removeProperty("--dsw-alias-bg-base");
					document.body.style.removeProperty("--dsw-specific-sidebar-fill");
					document.body.style.removeProperty("--dsw-specific-input-major");
					return;
				}
				snapshotLight();
				const [r, g, b] = parseColor(lightValue);
				// custom photos: a slightly firmer base surface keeps text readable with the much lighter blur
				const a = Math.max(0.2, Math.min(1, (state.alpha / 100) + (state.bg === "custom" ? 0.06 : 0)));
				const mix = (aa) => "rgba(" + r + ", " + g + ", " + b + ", " + Math.round(aa * 1000) / 1000 + ")";
				document.body.style.setProperty("--dsw-alias-bg-base", mix(a), "important");
				document.body.style.setProperty("--dsw-specific-sidebar-fill", mix(Math.min(1, a * 0.66)), "important");
				document.body.style.setProperty("--dsw-specific-input-major", mix(Math.min(1, a * 0.85)), "important");
			};
			const themeObs = new MutationObserver(() => {
				window.clearTimeout(themeObs.__t);
				themeObs.__t = window.setTimeout(() => {
					if (state.mode === "off") return;
					const prev = lightValue;
					snapshotLight();
					if (prev !== lightValue) applySurfaces();
				}, 120);
			});
			themeObs.observe(document.body, { attributes: true, attributeFilter: ["data-ds-dark-theme", "style"] });
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
				"</div>",
				'<div class="dml-chips" style="margin-top:8px">',
				'<button class="dml-chip" data-k="pick" type="button">从手机相册选择图片</button>',
				'<input data-k="bgFile" type="file" accept="image/*" style="display:none">',
				"</div></div>",
				'<div><div class="dml-skin-label">背景图 URL</div>',
				'<input class="dml-input" data-k="bgUrl" type="text" placeholder="https://…/wallpaper.jpg">',
				'<div class="dml-hint" style="margin-top:4px">输入后回车或失焦即应用（自动切换到玻璃模式）</div></div>',
				'<div><div class="dml-skin-label">表面不透明度：<span data-k="alphaLabel"></span></div>',
				'<input class="dml-range" data-k="alpha" type="range" min="30" max="100" step="5"></div>',
				'<div class="dml-hint">极光背景为多层模糊光斑缓慢漂移 + 电影颗粒质感；玻璃表面为 JS 计算的半透明色（不依赖 color-mix，全浏览器可用），明暗主题自适应。本浏览器毛玻璃：' + (blurSupported ? "✓ 支持" : "✗ 不支持（无模糊，透明仍生效）") + '。设置仅保存在本浏览器。</div>',
				"</div>"
			].join("");
			document.body.append(panel);
			const modeChips = panel.querySelectorAll('[data-k="mode"] .dml-chip');
			const bgChips = panel.querySelectorAll('[data-k="bg"] .dml-chip');
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
				if (mode) document.body.setAttribute("data-dsh-mobile-skin", mode);
				else document.body.removeAttribute("data-dsh-mobile-skin");
				applySurfaces();
				let bodyBg = "";
				if (mode) {
					if (state.bg === "custom" && state.bgUrl) {
						bodyBg = 'url("' + state.bgUrl.replace(/"/g, "%22") + '") center / cover no-repeat';
					} else {
						bodyBg = BASE[state.bg] || BASE.aurora1;
					}
				}
				document.body.style.background = bodyBg;
				// aurora layer: fade out → swap palette → fade back in
				const showAurora = !!mode && state.bg !== "custom";
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
			ctx.effect(() => {
				apply();
				return () => {
					document.body.removeAttribute("data-dsh-mobile-skin");
					document.body.removeAttribute("data-dml-bg");
					document.body.style.background = "";
					document.body.style.removeProperty("--dsw-alias-bg-base");
					document.body.style.removeProperty("--dsw-specific-sidebar-fill");
					document.body.style.removeProperty("--dsw-specific-input-major");
					themeObs.disconnect();
					aurora.remove();
					grain.remove();
				};
			}, "dsh-mobile-layout: skin runtime");
			return { open };
		}

		/** Section 3: file browser as a third conversation-view tab (文件).
		 *  Registered into the official "conversation.view" list slot alongside
		 *  对话/轨迹; the vanilla list/preview logic mounts into the view's
		 *  container div via a ref effect. */
		function filesViewController(ctx) {
			const LAST_KEY = "dsh-mobile-files-last";
			let currentPath = localStorage.getItem(LAST_KEY) || null;
			const readUrl = (p) => "/mobile-files/read?path=" + encodeURIComponent(p);
			const listUrl = (p) => (p ? "/mobile-files/list?path=" + encodeURIComponent(p) : "/mobile-files/list");
			const build = (container) => {
				container.innerHTML = [
					'<div class="dml-crumbs"></div>',
					'<div class="dml-list"></div>',
					'<div class="dml-preview" hidden>',
					'<div class="dml-preview-head"><button class="dml-back" type="button">‹ 返回</button>',
					'<div class="dml-preview-title"></div><div class="dml-spacer"></div>',
					'<button class="dml-open-tab" type="button">在新标签页打开</button></div>',
					'<div class="dml-preview-body"></div>',
					"</div>"
				].join("");
				const crumbs = container.querySelector(".dml-crumbs");
				const listArea = container.querySelector(".dml-list");
				const preview = container.querySelector(".dml-preview");
				const previewTitle = container.querySelector(".dml-preview-title");
				const previewBody = container.querySelector(".dml-preview-body");
				const setLoading = () => {
					listArea.textContent = "";
					listArea.append(el("div", "dml-empty", "加载中…"));
				};
				const showError = (msg) => {
					listArea.textContent = "";
					listArea.append(el("div", "dml-error", msg));
					const reset = el("button", "dml-row");
					reset.append(el("span", "dml-row-icon", "🏠"), el("span", "dml-row-name", "回到默认目录"));
					reset.addEventListener("click", () => loadList(null));
					listArea.append(reset);
				};
				const renderCrumbs = (data) => {
					crumbs.textContent = "";
					for (const cr of data.crumbs || []) {
						const b = el("button", "dml-crumb", cr.name);
						b.addEventListener("click", () => loadList(cr.path));
						crumbs.append(b, document.createTextNode("/"));
					}
				};
				const renderList = (data) => {
					preview.hidden = true;
					listArea.textContent = "";
					renderCrumbs(data);
					const up = dirname(currentPath);
					if (up && up !== currentPath && data.root && currentPath !== data.root) {
						const row = el("button", "dml-row");
						row.append(el("span", "dml-row-icon", "⬆"), el("span", "dml-row-name", "上一级"));
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
						row.addEventListener("click", () => {
							if (ent.dir) loadList(ent.path);
							else openPreview(ent);
						});
						listArea.append(row);
					}
					if (data.truncated) listArea.append(el("div", "dml-empty", "条目过多，仅显示前 2000 项"));
				};
				const loadList = async (path) => {
					setLoading();
					try {
						const res = await fetch(listUrl(path));
						if (res.ok && !(res.headers.get("content-type") || "").includes("application/json")) {
							showError("文件服务未就绪（dsh web 进程重启后生效）");
							return;
						}
						if (!res.ok) {
							let msg = "HTTP " + res.status;
							try {
								const j = await res.json();
								if (j && j.message) msg = j.message;
							} catch {
								/* non-json error */
							}
							showError(msg);
							return;
						}
						const data = await res.json();
						currentPath = data.path;
						try {
							localStorage.setItem(LAST_KEY, currentPath);
						} catch {
							/* storage unavailable */
						}
						renderList(data);
					} catch (err) {
						showError("网络错误：" + (err && err.message ? err.message : err));
					}
				};
				const openPreview = (ent) => {
					preview.hidden = false;
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
						fetch(url)
							.then(async (res) => {
								if (res.ok && !(res.headers.get("content-type") || "").includes("text/") && !(res.headers.get("content-type") || "").includes("image/") && !(res.headers.get("content-type") || "").includes("pdf")) {
									previewBody.textContent = "";
									previewBody.append(el("div", "dml-error", "文件服务未就绪（dsh web 进程重启后生效）"));
									return;
								}
								if (!res.ok) {
									let msg = "HTTP " + res.status;
									try {
										const j = await res.json();
										if (j && j.message) msg = j.message;
									} catch {
										/* non-json error */
									}
									previewBody.textContent = "";
									previewBody.append(el("div", "dml-error", msg));
									return;
								}
								const ct = res.headers.get("content-type") || "";
								if (ct.includes("text/")) {
									const text = await res.text();
									previewBody.textContent = "";
									if (ext === "md" || ext === "markdown") {
										const md = el("div", "dml-md");
										md.innerHTML = mdToHtml(text);
										previewBody.append(md);
									} else {
										previewBody.append(el("pre", "dml-text", text));
									}
								} else {
									previewBody.textContent = "";
									previewBody.append(el("div", "dml-empty", "无法预览此类型，请用右上角「在新标签页打开」"));
								}
							})
							.catch((err) => {
								previewBody.textContent = "";
								previewBody.append(el("div", "dml-error", "加载失败：" + (err && err.message ? err.message : err)));
							});
					}
				};
				preview.querySelector(".dml-back").addEventListener("click", () => {
					preview.hidden = true;
					if (currentPath) loadList(currentPath);
				});
				preview.querySelector(".dml-open-tab").addEventListener("click", () => {
					if (previewTitle.textContent) {
						window.open(readUrl(currentPath + "/" + previewTitle.textContent), "_blank", "noopener");
					}
				});
				loadList(currentPath);
				return () => {
					container.textContent = "";
				};
			};
			const FilesView = () => {
				const ref = react.useRef(null);
				react.useEffect(() => {
					const unmount = build(ref.current);
					return unmount;
				}, []);
				return react.createElement("div", { ref: ref, className: "dml-files-view" });
			};
			if (ctx.slots && typeof ctx.slots.inject === "function") {
				ctx.slots.inject("conversation.view", () => ctx.slots.register({
					name: "conversation.view",
					id: "files",
					order: 20,
					label: () => "文件",
					inject: () => ({})
				}, FilesView));
			}
		}

		/**
		 * Drawer dismissal on narrow viewports:
		 *  - tapping the dimmed backdrop closes the drawer;
		 *  - tapping a session row / the new-session button also closes it.
		 */
		function apply(ctx) {
			const toggleSidebar = () => {
				if (window.innerWidth >= 1024) return;
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
					if (target.closest('[class*="_treeBody"]') || target.closest('[class*="_newSession"]')) {
						toggleSidebar();
					}
				};
				document.addEventListener("click", onClick, true);
				return () => {
					document.removeEventListener("click", onClick, true);
				};
			}, "dsh-mobile-layout: drawer dismissal");
			abortRetryController(ctx);
			whaleButtonController(ctx);
			composerAutoHideController(ctx);
			filesViewController(ctx);
			const skin = skinController(ctx);
			if (ctx.slots && typeof ctx.slots.inject === "function") {
				const { IconPersonalizationOutline16 } = primitives;
				const MobileActionsRow = ({ wide, openSkin }) => {
					const Btn = ({ icon, label, onClick }) => react.createElement("button", {
						type: "button",
						className: wide ? "dml-side-btn" : "dml-side-btn dml-side-btn-rail",
						title: label,
						onClick
					}, icon, wide ? react.createElement("span", { className: "dml-side-label" }, label) : null);
					return react.createElement("div", { className: "dml-side-actions" },
						react.createElement(Btn, { icon: react.createElement(IconPersonalizationOutline16, { size: wide ? 16 : 18 }), label: "主题与背景", onClick: openSkin })
					);
				};
				ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register({
					name: "sidebar.footer.action",
					id: "dsh-mobile-actions",
					inject: () => ({ openSkin: skin.open })
				}, MobileActionsRow));
			}
		}
		exports.apply = apply;
		exports.inject = ["slots"];
		return module.exports;
	}
});
