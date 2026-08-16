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
			"  body [class*=\"_timeEnd\"] { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 11px; }",
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
			btn.innerHTML = '<svg width="21" height="15" viewBox="0 0 23.16 17.04" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="' + "M22.9168 1.43018C22.6713 1.31018 22.5658 1.53918 22.4223 1.65519C22.3733 1.69269 22.3318 1.74169 22.2903 1.78669C21.9317 2.1697 21.5127 2.42121 20.9657 2.39121C20.1657 2.34621 19.4827 2.59771 18.8787 3.20973C18.7502 2.45521 18.3236 2.0047 17.6746 1.71569C17.3351 1.56568 16.9916 1.41518 16.7536 1.08867C16.5876 0.856163 16.5421 0.597155 16.4591 0.341647C16.4061 0.187643 16.3536 0.0301382 16.1761 0.00363739C15.9836 -0.0263635 15.9081 0.135141 15.8326 0.270145C15.5306 0.822162 15.4136 1.43018 15.4251 2.0462C15.4516 3.43174 16.0366 4.53527 17.1991 5.3203C17.3311 5.4103 17.3651 5.5003 17.3236 5.63181C17.2441 5.90231 17.1501 6.16482 17.0671 6.43533C17.0141 6.60784 16.9351 6.64584 16.7501 6.57033C16.1121 6.30383 15.5611 5.90931 15.074 5.4328C14.2475 4.63328 13.5 3.75075 12.568 3.05973C12.349 2.89822 12.13 2.74822 11.9034 2.60522C10.9524 1.68169 12.028 0.923165 12.277 0.833162C12.5375 0.739159 12.3675 0.41615 11.5259 0.42015C10.6844 0.42365 9.91439 0.705658 8.93286 1.08117C8.78935 1.13767 8.63835 1.17867 8.48384 1.21267C7.59332 1.04367 6.66829 1.00617 5.70226 1.11517C3.88321 1.31768 2.43016 2.1777 1.36213 3.64575C0.0790928 5.4103 -0.222916 7.41536 0.146595 9.50642C0.535106 11.7105 1.66014 13.535 3.38869 14.9616C5.18125 16.4406 7.24581 17.1657 9.60138 17.0266C11.0319 16.9441 12.6245 16.7526 14.421 15.2321C14.874 15.4576 15.3496 15.5476 16.1381 15.6151C16.7456 15.6716 17.3306 15.5851 17.7836 15.4911C18.4931 15.3411 18.4441 14.6841 18.1876 14.5636C16.1081 13.595 16.5646 13.9891 16.1496 13.67C17.2061 12.42 18.8202 10.1979 19.3182 7.17235C19.3672 6.83834 19.4297 6.36783 19.4222 6.09732C19.4182 5.93231 19.4562 5.86831 19.6447 5.84931C20.1657 5.78931 20.6712 5.64681 21.1357 5.3913C22.4833 4.65528 23.0268 3.44624 23.1548 1.9972C23.1738 1.77569 23.1508 1.54668 22.9168 1.43018ZM11.1749 14.4736C9.15936 12.889 8.18184 12.3675 7.77832 12.39C7.40081 12.4125 7.46881 12.8445 7.55182 13.126C7.63882 13.404 7.75182 13.5955 7.91033 13.8396C8.01983 14.0011 8.09533 14.2411 7.80083 14.4216C7.15181 14.8231 6.02327 14.2866 5.97027 14.2601C4.65673 13.4865 3.5587 12.4655 2.78467 11.069C2.03715 9.72493 1.60314 8.28289 1.53164 6.74384C1.51264 6.37233 1.62214 6.24082 1.99215 6.17332C2.47916 6.08332 2.98118 6.06432 3.46769 6.13582C5.52476 6.43633 7.27581 7.35586 8.74385 8.8129C9.58188 9.64243 10.2159 10.634 10.8689 11.6025C11.5634 12.631 12.3105 13.611 13.262 14.4146C13.598 14.6961 13.866 14.9101 14.1225 15.0681C13.349 15.1546 12.058 15.1731 11.1749 14.4746L11.1749 14.4736ZM12.141 8.25988C12.141 8.09488 12.273 7.96338 12.439 7.96338C12.4765 7.96338 12.5105 7.97088 12.541 7.98188C12.5825 7.99688 12.6205 8.01938 12.6505 8.05338C12.7035 8.10588 12.7335 8.18088 12.7335 8.25988C12.7335 8.42489 12.6015 8.55639 12.4355 8.55639C12.2695 8.55639 12.141 8.42489 12.141 8.25988ZM15.1415 9.79893C14.949 9.87793 14.7565 9.94544 14.5715 9.95294C14.2845 9.96794 13.9715 9.85143 13.8015 9.70893C13.5375 9.48742 13.3485 9.36342 13.2695 8.97691C13.2355 8.8119 13.2545 8.55639 13.2845 8.40989C13.3525 8.09438 13.277 7.89187 13.0545 7.70787C12.8735 7.55786 12.643 7.51636 12.39 7.51636C12.2955 7.51636 12.209 7.47486 12.1445 7.44136C12.039 7.38886 11.9519 7.25735 12.035 7.09585C12.0615 7.04335 12.19 6.91584 12.22 6.89334C12.5635 6.69784 12.9595 6.76184 13.326 6.90834C13.6655 7.04735 13.9225 7.30236 14.292 7.66287C14.6695 8.09838 14.7375 8.21838 14.9525 8.54539C15.1225 8.8009 15.277 9.06341 15.3831 9.36392C15.4471 9.55142 15.3641 9.70493 15.1415 9.79893Z" + '" fill="currentColor"/></svg>';
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
				const a = Math.max(0.2, Math.min(1, (state.alpha / 100) + (state.bg === "custom" ? 0.09 : 0)));
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
					listArea.style.display = "";
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
