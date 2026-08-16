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
			"  /* --- sidebar: fixed overlay drawer --- */",
			"  body :has(> [class*=\"_sidebarCol\"]) {",
			"    grid-template-columns: 56px minmax(0, 1fr) 0 !important;",
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
			"    inset: 0 auto 0 0;",
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
			"}",
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
			"/* ===== skin: aurora glass theme ===== */",
			"body[data-dsh-mobile-skin=\"glass\"],",
			"body[data-dsh-mobile-skin=\"semi\"] {",
			"  --dsw-alias-bg-base: color-mix(in srgb, var(--dsw-alias-bg-layer-1, #ffffff) var(--dsh-skin-alpha, 62%), transparent) !important;",
			"  --dsw-specific-sidebar-fill: color-mix(in srgb, var(--dsw-alias-bg-layer-1, #ffffff) var(--dsh-skin-alpha, 62%), transparent) !important;",
			"  --dsw-specific-input-major: color-mix(in srgb, var(--dsw-alias-bg-layer-1, #ffffff) var(--dsh-skin-alpha, 62%), transparent) !important;",
			"}",
			"body[data-dsh-mobile-skin=\"glass\"] [class*=\"_centerCol\"] {",
			"  backdrop-filter: blur(24px) saturate(1.5);",
			"  -webkit-backdrop-filter: blur(24px) saturate(1.5);",
			"}",
			"body[data-dsh-mobile-skin=\"glass\"] [class*=\"_sidebarCol\"] {",
			"  backdrop-filter: blur(24px) saturate(1.5);",
			"  -webkit-backdrop-filter: blur(24px) saturate(1.5);",
			"  border-right: 1px solid rgb(255 255 255 / 0.08);",
			"}",
			"body[data-dsh-mobile-skin=\"glass\"] [class*=\"_composerSeat\"] {",
			"  backdrop-filter: blur(16px) saturate(1.4);",
			"  -webkit-backdrop-filter: blur(16px) saturate(1.4);",
			"}",
			"body[data-dsh-mobile-skin=\"glass\"] .dml-panel {",
			"  backdrop-filter: blur(28px) saturate(1.5);",
			"  -webkit-backdrop-filter: blur(28px) saturate(1.5);",
			"}",
			"body[data-dsh-mobile-skin=\"semi\"] [class*=\"_centerCol\"] {",
			"  backdrop-filter: blur(6px);",
			"  -webkit-backdrop-filter: blur(6px);",
			"}",
			"/* aurora backdrop + film grain */",
			".dml-aurora {",
			"  position: fixed; inset: 0; z-index: -1; pointer-events: none;",
			"  opacity: 0; transition: opacity 0.5s ease; overflow: hidden;",
			"}",
			".dml-aurora-inner {",
			"  position: absolute; inset: -25%;",
			"  opacity: 1; transition: opacity 0.25s ease;",
			"  filter: blur(48px) saturate(1.5);",
			"  animation: dml-aurora-drift 26s ease-in-out infinite alternate;",
			"  will-change: transform;",
			"}",
			"@keyframes dml-aurora-drift {",
			"  0% { transform: translate3d(-2.5%, -2%, 0) rotate(-2deg) scale(1.02); }",
			"  100% { transform: translate3d(2.5%, 2.5%, 0) rotate(2.5deg) scale(1.09); }",
			"}",
			".dml-grain {",
			"  position: fixed; inset: 0; z-index: 60; pointer-events: none;",
			"  opacity: 0; transition: opacity 0.5s ease;",
			"  background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\");",
			"  background-size: 180px 180px;",
			"  mix-blend-mode: overlay;",
			"}",
			"body[data-dsh-mobile-skin=\"glass\"] .dml-aurora,",
			"body[data-dsh-mobile-skin=\"semi\"] .dml-aurora { opacity: 1; }",
			"body[data-dsh-mobile-skin=\"glass\"] .dml-grain,",
			"body[data-dsh-mobile-skin=\"semi\"] .dml-grain { opacity: 0.05; }",
			"@media (prefers-reduced-motion: reduce) {",
			"  .dml-aurora-inner { animation: none; }",
			"}",
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
			"  position: fixed; inset: 0; z-index: 50;",
			"  display: flex; flex-direction: column;",
			"  background: var(--dsw-alias-bg-base);",
			"  color: var(--dsw-alias-label-primary);",
			"  font-size: 14px;",
			"}",
			".dml-panel[hidden] { display: none; }",
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
			"    inset: 50% auto auto 50%;",
			"    transform: translate(-50%, -50%);",
			"    width: min(720px, 92vw); height: min(80vh, 680px);",
			"    border-radius: 14px;",
			"    border: 1px solid var(--dsw-alias-border-l2);",
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
			const onMqChange = () => {
				if (mq.matches) return;
				document.body.classList.remove("dml-composer-auto-hidden", "dml-composer-auto-gone");
				hidden = false;
				gone = false;
			};
			const tryInit = () => {
				if (inited) return true;
				if (!mq.matches) return false;
				const s = document.querySelector('[class*="_composerSeat"]');
				if (!s) return false;
				seat = s;
				scroller = findScroller(seat);
				document.addEventListener("scroll", onScroll, { capture: true, passive: true });
				const onResize = () => evaluate(scroller);
				window.addEventListener("resize", onResize);
				mq.addEventListener("change", onMqChange);
				if (scroller) {
					mutObs = new MutationObserver(() => {
						window.clearTimeout(mutObs.__t);
						mutObs.__t = window.setTimeout(() => evaluate(scroller), 180);
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
				document.removeEventListener("scroll", onScroll, { capture: true });
				window.removeEventListener("resize", onResize);
				mq.removeEventListener("change", onMqChange);
				if (mutObs) mutObs.disconnect();
				document.body.classList.remove("dml-composer-auto-hidden", "dml-composer-auto-gone");
			}, "dsh-mobile-layout: composer auto-hide");
		}

		/** Section 2: transparency + background skinning (localStorage-persisted). */
		function skinController(ctx) {
			const KEY = "dsh-mobile-skin-v1";
			const state = { mode: "off", bg: "aurora1", bgUrl: "", alpha: 62 };
			try {
				Object.assign(state, JSON.parse(localStorage.getItem(KEY) || "{}"));
			} catch {
				/* keep defaults */
			}
			// migrate legacy preset ids + heal the "picked image while mode=off" bug
			if (state.bg === "grad1") state.bg = "aurora1";
			if (state.bg === "grad2") state.bg = "aurora2";
			if (!state.alpha) state.alpha = 62;
			if (state.bgUrl && state.mode === "off") state.mode = "glass";
			const AURORA = {
				aurora1: "radial-gradient(42% 38% at 18% 24%, rgba(91,140,255,0.85), transparent 70%), radial-gradient(36% 34% at 82% 18%, rgba(157,107,255,0.8), transparent 70%), radial-gradient(40% 36% at 76% 84%, rgba(255,111,174,0.7), transparent 72%), radial-gradient(34% 32% at 22% 82%, rgba(53,224,200,0.65), transparent 70%)",
				aurora2: "radial-gradient(42% 38% at 18% 22%, rgba(255,138,92,0.8), transparent 70%), radial-gradient(36% 34% at 84% 16%, rgba(255,196,107,0.75), transparent 70%), radial-gradient(40% 36% at 78% 86%, rgba(255,95,158,0.68), transparent 72%), radial-gradient(34% 32% at 20% 80%, rgba(255,237,158,0.55), transparent 70%)",
				aurora3: "radial-gradient(42% 38% at 18% 24%, rgba(45,212,191,0.75), transparent 70%), radial-gradient(36% 34% at 82% 18%, rgba(110,231,183,0.65), transparent 70%), radial-gradient(40% 36% at 76% 84%, rgba(56,189,248,0.6), transparent 72%), radial-gradient(34% 32% at 22% 82%, rgba(129,140,248,0.55), transparent 70%)",
				mono: "radial-gradient(42% 38% at 18% 24%, rgba(148,163,184,0.55), transparent 70%), radial-gradient(36% 34% at 82% 18%, rgba(100,116,139,0.5), transparent 70%), radial-gradient(40% 36% at 76% 84%, rgba(203,213,225,0.42), transparent 72%), radial-gradient(34% 32% at 22% 82%, rgba(71,85,105,0.45), transparent 70%)"
			};
			const BASE = {
				aurora1: "radial-gradient(120% 120% at 50% 0%, #111741 0%, #0a0d24 55%, #130b2b 100%)",
				aurora2: "radial-gradient(120% 120% at 50% 0%, #2e1410 0%, #1c0d14 55%, #130a18 100%)",
				aurora3: "radial-gradient(120% 120% at 50% 0%, #06231e 0%, #041410 60%, #04121c 100%)",
				mono: "#0b0e14"
			};
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
				'<input class="dml-range" data-k="alpha" type="range" min="40" max="100" step="5"></div>',
				'<div class="dml-hint">极光背景为多层模糊光斑缓慢漂移 + 电影颗粒质感；玻璃表面覆盖会话区/侧栏/输入框（backdrop 模糊 + 饱和提升），明暗主题自适应；设置仅保存在本浏览器。</div>',
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
				document.body.style.setProperty("--dsh-skin-alpha", state.alpha + "%");
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
					document.body.style.background = "";
					document.body.style.removeProperty("--dsh-skin-alpha");
					aurora.remove();
					grain.remove();
				};
			}, "dsh-mobile-layout: skin runtime");
			return { open };
		}

		/** Section 3: file browser (list + preview over /mobile-files). */
		function filesController(ctx) {
			const LAST_KEY = "dsh-mobile-files-last";
			let currentPath = localStorage.getItem(LAST_KEY) || null;
			const panel = el("div", "dml-panel dml-panel-files");
			panel.hidden = true;
			panel.innerHTML = [
				'<div class="dml-panel-head"><div class="dml-panel-title">文件</div><div class="dml-spacer"></div>',
				'<button class="dml-close" type="button">✕</button></div>',
				'<div class="dml-crumbs"></div>',
				'<div class="dml-list"></div>',
				'<div class="dml-preview" hidden>',
				'<div class="dml-preview-head"><button class="dml-back" type="button">‹ 返回</button>',
				'<div class="dml-preview-title"></div><div class="dml-spacer"></div>',
				'<button class="dml-open-tab" type="button">在新标签页打开</button></div>',
				'<div class="dml-preview-body"></div>',
				"</div>"
			].join("");
			document.body.append(panel);
			const crumbs = panel.querySelector(".dml-crumbs");
			const listArea = panel.querySelector(".dml-list");
			const preview = panel.querySelector(".dml-preview");
			const previewTitle = panel.querySelector(".dml-preview-title");
			const previewBody = panel.querySelector(".dml-preview-body");
			const readUrl = (p) => "/mobile-files/read?path=" + encodeURIComponent(p);
			const listUrl = (p) => (p ? "/mobile-files/list?path=" + encodeURIComponent(p) : "/mobile-files/list");
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
			const open = () => {
				panel.hidden = false;
				loadList(currentPath);
			};
			panel.querySelector(".dml-close").addEventListener("click", () => {
				panel.hidden = true;
			});
			panel.querySelector(".dml-back").addEventListener("click", () => {
				preview.hidden = true;
				if (currentPath) loadList(currentPath);
			});
			panel.querySelector(".dml-open-tab").addEventListener("click", () => {
				if (previewTitle.textContent) {
					window.open(readUrl(currentPath + "/" + previewTitle.textContent), "_blank", "noopener");
				}
			});
			return { open };
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
			composerAutoHideController(ctx);
			const files = filesController(ctx);
			const skin = skinController(ctx);
			if (ctx.slots && typeof ctx.slots.inject === "function") {
				const { IconFolderOpen16, IconPersonalizationOutline16 } = primitives;
				const MobileActionsRow = ({ wide, openFiles, openSkin }) => {
					const Btn = ({ icon, label, onClick }) => react.createElement("button", {
						type: "button",
						className: wide ? "dml-side-btn" : "dml-side-btn dml-side-btn-rail",
						title: label,
						onClick
					}, icon, wide ? react.createElement("span", { className: "dml-side-label" }, label) : null);
					return react.createElement("div", { className: "dml-side-actions" },
						react.createElement(Btn, { icon: react.createElement(IconFolderOpen16, { size: wide ? 16 : 18 }), label: "文件", onClick: openFiles }),
						react.createElement(Btn, { icon: react.createElement(IconPersonalizationOutline16, { size: wide ? 16 : 18 }), label: "主题与背景", onClick: openSkin })
					);
				};
				ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register({
					name: "sidebar.footer.action",
					id: "dsh-mobile-actions",
					inject: () => ({ openFiles: files.open, openSkin: skin.open })
				}, MobileActionsRow));
			}
		}
		exports.apply = apply;
		exports.inject = ["slots"];
		return module.exports;
	}
});
