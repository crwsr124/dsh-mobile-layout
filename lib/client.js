/**
 * dsh-mobile-layout, browser half. Prebuilt client bundle in the exact
 * `window.__ModuleLoader__.load({ id, factory })` CJS-factory format the
 * dsh client module system consumes (same shape as the shipped
 * @deepseek-ai/dsh-client-ui-* bundles, but hand-written: zero dependencies).
 *
 * What it does:
 *  1. Injects a responsive stylesheet (narrow viewports only, <1024px —
 *     the same breakpoint as the app shell's SIDEBAR_AUTO_COLLAPSE):
 *     - the sidebar becomes a fixed overlay drawer with a dimmed backdrop
 *       instead of squeezing the conversation column to ~110px;
 *     - markdown tables use fixed layout and fit the column width, cells
 *       wrap long tokens (URLs / paths / code) instead of overflowing;
 *  2. A document-level click handler closes the drawer when the user taps
 *     the backdrop (via the ctx.layout service — soft dependency).
 *
 * Stable selectors only: `data-*` attributes owned by the app shell
 * (data-sidebar-collapsed / data-shell-overlay / data-side) and the
 * non-hashed class-name suffixes of CSS-module classes
 * ([class*="_sidebarCol"], [class*="_overlayLayer"], [class*="_markdown"]).
 * The hashed prefixes are build-specific and must never be targeted.
 */
window.__ModuleLoader__.load({
	id: "dsh-mobile-layout",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		const css = [
			"/* dsh-mobile-layout — responsive reading layout for narrow viewports */",
			"@media (max-width: 1023.98px) {",
			"  /* 1. Sidebar: fixed overlay drawer instead of squeezing the conversation column */",
			"  body :has(> [class*=\"_sidebarCol\"]) {",
			"    grid-template-columns: 56px minmax(0, 1fr) 0 !important;",
			"  }",
			"  /* pin grid placement: a fixed-position sidebar is skipped by grid",
			"     auto-placement, which would otherwise shift centerCol into column 1 */",
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
			"  /* drag-resize handle is useless on touch */",
			"  body :has(> [class*=\"_sidebarCol\"]) [data-side=\"sidebar\"] {",
			"    display: none;",
			"  }",
			"  /* 2. Markdown tables fit the column width; cells wrap long tokens */",
			"  [class*=\"_markdown\"] table {",
			"    table-layout: fixed;",
			"    width: 100%;",
			"  }",
			"  [class*=\"_markdown\"] th,",
			"  [class*=\"_markdown\"] td {",
			"    overflow-wrap: anywhere;",
			"    padding: 8px 12px 8px 0;",
			"  }",
			"  [class*=\"_tableScroll\"] {",
			"    -webkit-overflow-scrolling: touch;",
			"    overscroll-behavior-x: contain;",
			"  }",
			"  /* 3. Long tokens (URLs, paths, inline code) wrap instead of overflowing */",
			"  [class*=\"_markdown\"] code,",
			"  [class*=\"_markdown\"] a {",
			"    overflow-wrap: anywhere;",
			"  }",
			"  /* 4. Message header: the timestamp string (nowrap, ~400px in stock CSS)",
			"     wraps instead of being clipped at the viewport edge */",
			"  [class*=\"_actions\"] {",
			"    flex-wrap: wrap;",
			"  }",
			"  body [class*=\"_timeEnd\"],",
			"  body [class*=\"_source\"] {",
			"    white-space: normal;",
			"    overflow-wrap: anywhere;",
			"  }",
			"  /* 5. Composer button row: wrap + ellipsize the model name so the send",
			"     button is never pushed offscreen */",
			"  [class*=\"_composerSeat\"] [class*=\"_row\"] {",
			"    flex-wrap: wrap;",
			"  }",
			"  [class*=\"_composerSeat\"] [class*=\"_trigger\"] {",
			"    min-width: 0;",
			"  }",
			"  [class*=\"_composerSeat\"] [class*=\"_triggerLabel\"] {",
			"    overflow: hidden;",
			"    text-overflow: ellipsis;",
			"  }",
			"}"
		].join("\n");
		const tagId = "dsh-mobile-layout/mobile.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-mobile-layout";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		/**
		 * Drawer dismissal on narrow viewports:
		 *  - tapping the dimmed backdrop closes the drawer (only the bare overlay
		 *    layer itself counts — its slot children, e.g. the command palette,
		 *    keep their own hit handling);
		 *  - tapping a session row / the new-session button also closes it so the
		 *    chosen conversation is immediately readable.
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
		}
		exports.apply = apply;
		exports.inject = [];
		return module.exports;
	}
});
