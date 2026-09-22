/**
 * client-smoke.mjs — DOM-stub 冒烟测试 for lib/client.js（零依赖，node 直接跑）。
 *
 * 0.9.0 回归改造（dsh 0.1.5-rc.1 移动端回归）覆盖：
 *  - 模块装载 → apply 全控制器挂载不抛错；
 *  - 旧「文件」页签与「上传文件」按钮彻底消失（源码无 filesViewController/
 *    uploadController 残留；不注册 conversation.view slot；侧栏动作行只剩
 *    「主题与背景」；CSS 无 dml-upload-status / dml-crumbs / dml-files-view / dml-md）；
 *  - filesDownloadController（0.9.7 起仅预览头单入口；0.9.8 路径来源权威化）：
 *    只对 [data-textpreview-path] 预览头注入下载按钮（文件树行不再注入），路径
 *    优先取预览根 data-textpreview-url（contentId，dsh-resource://file/…）经
 *    parseFileAddress + 工作区根化为绝对路径，其次回退 title 绝对值；定不出
 *    绝对路径时移除按钮（绝不留会下错文件的旧按钮）。点击发起
 *    GET /mobile-files/download?sessionId=…&path=…（XHR 进度 → blob → a[download]
 *    触发下载），sessionId 优先 sessions 服务、fallback localStorage；
 *  - filesUploadController（0.9.8）：目录行上传按钮只在文件夹展开
 *    （aria-expanded=true）时出现、锚定到行元素 [class*='_row']（不再相对整个
 *    li 定位，消除展开后飘移）；收起即移除；树工具栏「上传文件」入口不变；
 *  - dispose 清理：注入按钮全部移除、observer 断开；
 *  - 透明修复在案：CSS 含新右栏 _rightbarCol 的玻璃/半透明 backdrop-filter 覆盖。
 *
 * 运行：node test/client-smoke.mjs
 */
import { readFileSync } from "node:fs";
import vm from "node:vm";
import assert from "node:assert";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const code = readFileSync(path.join(here, "..", "lib", "client.js"), "utf8");

// ---------- 0. 静态断言：旧 UI 不得复活 ----------
assert.ok(!/filesViewController|uploadController/.test(code), "旧 filesViewController/uploadController 不得残留");
assert.ok(!/dml-upload-status|dml-upload-head|dml-upload-row/.test(code), "上传状态卡残留");
assert.ok(!/dml-crumbs|dml-files-view|dml-preview-head|dml-open-tab/.test(code), "旧文件浏览器 UI/CSS 残留");
assert.ok(!/mobile-files\/list|mobile-files\/read/.test(code), "client 不得引用已退役的 list/read 路由");
assert.ok(code.includes("/mobile-files/upload?"), "client 必须引用 upload 路由（0.9.1 恢复的上传按钮）");

// ---------- 1. DOM stubs ----------
const timers = new Map();
let timerSeq = 0;
const flushTimers = () => {
	for (let guard = 0; guard < 200; guard++) {
		const next = [...timers.values()].sort((a, b) => a.at - b.at)[0];
		if (!next) return;
		timers.delete(next.id);
		next.fn();
	}
};
const rafQueue = [];
const vivified = new Map();
// 真实 DOM 的 isConnected 沿子树传播；stub 也同步传播，否则「节点被移除后
// isConnected 仍为 true」会让插件的 stale-entry 清理判断失真（0.9.7 起依赖）。
function setConnected(node, value) {
	node.isConnected = value;
	for (const c of node.children ?? []) setConnected(c, value);
}
function makeElement(tag) {
	const attrs = new Map();
	const classSet = new Set();
	const node = {
		tagName: String(tag).toUpperCase(),
		children: [],
		dataset: {},
		style: { cssText: "", setProperty() {}, removeProperty() {} },
		type: "",
		value: "",
		disabled: false,
		hidden: false,
		title: "",
		_text: "",
		_handlers: {},
		parentElement: null,
		isConnected: false,
		getAttribute: (k) => (attrs.has(k) ? attrs.get(k) : null),
		setAttribute: (k, v) => attrs.set(k, String(v)),
		removeAttribute: (k) => attrs.delete(k),
		hasAttribute: (k) => attrs.has(k),
		get textContent() { return this._text; },
		set textContent(v) { this._text = String(v); this.children = []; },
		set innerHTML(v) {
			this.children = [];
			this._html = String(v);
			// 按源码里出现的 class / attr token 生成占位子节点：
			// 模拟「解析后的 DOM 查询得到元素」，皮肤面板的 .dml-close /
			// [data-k="…"] 等查询依赖这一点。
			const seen = new Set();
			const add = (m) => {
				if (seen.has(m.key + "=" + m.value)) return;
				seen.add(m.key + "=" + m.value);
				const child = makeElement("div");
				if (m.key === "class") child.className = m.value;
				else child.setAttribute(m.key, m.value);
				this.appendChild(child);
			};
			for (const [, cls] of this._html.matchAll(/class="([^"]*)"/g)) {
				for (const c of cls.split(/\s+/).filter(Boolean)) add({ key: "class", value: c });
			}
			for (const [, k, v] of this._html.matchAll(/([a-zA-Z-]+)\s*=\s*"([^"]*)"/g)) {
				if (!["class"].includes(k)) add({ key: k, value: v });
			}
		},
		get innerHTML() { return this._html ?? ""; },
		appendChild(child) { this.children.push(child); child.parentElement = this; setConnected(child, this.isConnected); return child; },
		append(...kids) { for (const k of kids) this.appendChild(k); },
		insertBefore(child, ref) {
			const at = ref ? this.children.indexOf(ref) : -1;
			if (at >= 0) this.children.splice(at, 0, child);
			else this.children.push(child);
			child.parentElement = this;
			setConnected(child, this.isConnected);
			return child;
		},
		remove() {
			const p = this.parentElement;
			if (p) p.children = p.children.filter((c) => c !== this);
			this.parentElement = null;
			setConnected(this, false);
		},
		click() { (this._handlers.click ??= []).forEach((h) => h({ stopPropagation() {}, preventDefault() {} })); },
		addEventListener(type, handler) { (this._handlers[type] ??= []).push(handler); },
		removeEventListener(type, handler) {
			this._handlers[type] = (this._handlers[type] ?? []).filter((h) => h !== handler);
		},
		querySelector(sel) {
			return descendants(this).find((n) => matchesSel(n, sel)) ?? null;
		},
		querySelectorAll(sel) {
			return descendants(this).filter((n) => matchesSel(n, sel));
		},
		closest(sel) {
			let cur = this;
			while (cur) {
				if (matchesSel(cur, sel)) return cur;
				cur = cur.parentElement;
			}
			return null;
		}
	};
	node.classList = {
		add: (...cs) => cs.forEach((c) => classSet.add(c)),
		remove: (...cs) => cs.forEach((c) => classSet.delete(c)),
		toggle: (c, force) => {
			const on = force === undefined ? !classSet.has(c) : !!force;
			if (on) classSet.add(c);
			else classSet.delete(c);
			return on;
		},
		contains: (c) => classSet.has(c)
	};
	Object.defineProperty(node, "className", {
		get: () => [...classSet].join(" "),
		set: (v) => {
			classSet.clear();
			String(v).split(/\s+/).filter(Boolean).forEach((c) => classSet.add(c));
		}
	});
	return node;
}
function vivify(sel) {
	if (!vivified.has(sel)) vivified.set(sel, makeElement("div"));
	return vivified.get(sel);
}
const matchesSel = (node, sel) => {
	try {
		sel = String(sel).trim();
		if (!sel || /[\s>,~+]/.test(sel)) return false; // 组合器不支持 → 一律视为不匹配
		const tagM = sel.match(/^[a-zA-Z][\w-]*/);
		if (tagM) {
			if (node.tagName !== tagM[0].toUpperCase()) return false;
			sel = sel.slice(tagM[0].length);
		}
		const tokens = sel.match(/\.[\w-]+|\[[^\]]+\]/g) ?? [];
		if (tokens.join("") !== sel) return false; // 未识别语法 → 保守不匹配
		for (const tok of tokens) {
			if (tok.startsWith(".")) {
				if (!String(node.className ?? "").split(/\s+/).includes(tok.slice(1))) return false;
				continue;
			}
			const inner = tok.slice(1, -1);
			const op = (inner.match(/[~^$*|]?=/) ?? [])[0];
			const name = op ? inner.slice(0, inner.indexOf(op)) : inner;
			const want = op ? inner.slice(inner.indexOf(op) + op.length).replace(/^['"]|['"]$/g, "") : null;
			if (name === "class") {
				const v = String(node.className ?? "");
				if (op === "*=" ? !v.includes(want) : v !== want) return false;
				continue;
			}
			const have = node.getAttribute ? node.getAttribute(name) : undefined;
			if (!op) {
				if (have === undefined || have === null) return false;
			} else if (op === "*=") {
				if (!String(have ?? "").includes(want)) return false;
			} else if (String(have ?? "") !== want) return false;
		}
		return true;
	} catch {
		return false;
	}
};
const descendants = (node, out = []) => {
	for (const c of node.children ?? []) {
		out.push(c);
		descendants(c, out);
	}
	return out;
};

const observers = [];
globalThis.MutationObserver = class {
	constructor(cb) { this.cb = cb; }
	observe() { observers.push(this); }
	disconnect() { this.disconnected = true; }
};
const fireMutations = () => observers.filter((o) => !o.disconnected).forEach((o) => o.cb([], o));

const styleTags = [];
const body = makeElement("body");
const head = makeElement("head");
head.appendChild = function (child) {
	this.children.push(child);
	child.parentElement = this;
	child.isConnected = true;
	if (child.tagName === "STYLE") {
		styleTags.push(child);
		for (const [k, v] of Object.entries(child.dataset ?? {})) {
			child.setAttribute("data-" + k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase()), String(v));
		}
	}
	return child;
};
const htmlEl = makeElement("html");
htmlEl.style = {};

globalThis.document = {
	createElement: (tag) => makeElement(tag),
	createTextNode: (t) => ({ _text: String(t) }),
	querySelector(sel) {
		if (sel.startsWith("style[")) return styleTags.find((s) => matchesSel(s, sel)) ?? null;
		return descendants(body).find((n) => matchesSel(n, sel))
			?? descendants(head).find((n) => matchesSel(n, sel))
			?? vivify(sel);
	},
	querySelectorAll(sel) {
		return [...descendants(body).filter((n) => matchesSel(n, sel)), ...descendants(head).filter((n) => matchesSel(n, sel))];
	},
	addEventListener(type, handler) { (this._handlers[type] ??= []).push(handler); },
	removeEventListener(type, handler) { this._handlers[type] = (this._handlers[type] ?? []).filter((h) => h !== handler); },
	_handlers: {},
	documentElement: htmlEl,
	head,
	body,
	activeElement: null
};

const store = new Map();
globalThis.localStorage = {
	getItem: (k) => (store.has(k) ? store.get(k) : null),
	setItem: (k, v) => store.set(k, String(v)),
	removeItem: (k) => store.delete(k)
};
globalThis.window = {
	__ModuleLoader__: { load(def) { captured = def; } },
	setTimeout: (fn, ms) => {
		const id = ++timerSeq;
		timers.set(id, { fn, at: Date.now() + (ms ?? 0), id });
		return id;
	},
	clearTimeout: (id) => timers.delete(id),
	addEventListener() {},
	removeEventListener() {},
	matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }),
	requestAnimationFrame: (fn) => rafQueue.push(fn),
	location: { reload() {} },
	innerWidth: 390,
	alert() {},
	CSS: { supports: () => true },
	__DML_DEBUG: false
};
globalThis.requestAnimationFrame = (fn) => rafQueue.push(fn);
globalThis.getComputedStyle = () => ({ backdropFilter: "none", position: "static", backgroundColor: "rgba(0, 0, 0, 0)" });
globalThis.HTMLTextAreaElement = function HTMLTextAreaElement() {};
globalThis.CustomEvent = class CustomEvent { constructor(type, opts) { this.type = type; this.detail = opts?.detail; } };
globalThis.Image = class Image { set src(v) { this._src = v; } };
globalThis.XMLHttpRequest = class {
	constructor() { this.upload = {}; }
	open(m, u) { this.method = m; this.url = u; xhrLog.push(this); }
	setRequestHeader(k, v) { this.headers = { ...(this.headers ?? {}), [k]: v }; }
	send(body) { this.sent = true; this.body = body; }
};
const xhrLog = [];
const realCreateObjectURL = globalThis.URL.createObjectURL;
const realRevokeObjectURL = globalThis.URL.revokeObjectURL;
globalThis.URL.createObjectURL = () => "blob:fake-url";
globalThis.URL.revokeObjectURL = () => {};

// ---------- 2. module load ----------
let captured = null;
vm.runInThisContext(code, { filename: "dsh-mobile-layout-client.js" });
assert.equal(captured.id, "dsh-mobile-layout");
// 顶层 shim/早期错误缓冲必须真被执行（语法通过≠执行）
assert.ok(Array.isArray(globalThis.window.__DML_SHIMS__), "顶层引擎 shim 必须执行（window.__DML_SHIMS__ 为数组）");
const fakeReact = {
	createElement: (type, props, ...children) => {
		const merged = { ...(props ?? {}) };
		if (children.length === 1) merged.children = children[0];
		else if (children.length > 1) merged.children = children;
		return { type, props: merged, children };
	}
};
const primitives = {
	IconPersonalizationOutline16: function Icon() {},
	IconPaperclipOutline16: function IconPaperclip() {}
};
const exportsObj = captured.factory((name) => (name === "react" ? fakeReact : primitives));
assert.deepEqual(exportsObj.inject, ["slots", "theme", "sessions"], "inject 声明不得回退（rc.1 客户端服务守卫）");
assert.equal(typeof exportsObj.apply, "function");

// ---------- 3. fake ctx + 0.1.5 内置面板 fixtures ----------
const SESSION_ID = "session-svc-7";
const FILE_PATH = "/ws/dl-test/sample.txt";
const disposers = [];
const effectLabels = [];
const slotInjects = [];
const slotRegistrations = [];
const makeCtx = ({ sessions }) => ({
	effect: (fn, label) => {
		effectLabels.push(label);
		const d = fn();
		if (typeof d === "function") disposers.push(d);
		return d;
	},
	get(name) {
		if (name !== "sessions" || !sessions) throw new Error("service unavailable: " + name);
		return sessions;
	},
	on: () => () => {},
	theme: { overrideTokens: () => () => {}, getTheme: () => ({ active: { colorScheme: "light" } }) },
	slots: {
		inject: (name, factory) => slotInjects.push({ name, factory }),
		register: (def, Component) => slotRegistrations.push({ def, Component })
	}
});
const sessionsService = {
	list: {
		getSnapshot: () => ({ current: SESSION_ID, byId: { [SESSION_ID]: { cwd: "/ws" } } }),
		subscribe: () => () => {}
	}
};

const treeRoot = makeElement("div");
treeRoot.setAttribute("data-files-state", "tree");
treeRoot.setAttribute("data-files-root", "/ws");
const li = makeElement("li");
li.setAttribute("data-files-entry", "file");
li.setAttribute("data-files-path", FILE_PATH);
const rowBtn = makeElement("button");
rowBtn.className = "k-1LKG_row";
const nameSpan = makeElement("span");
nameSpan.className = "k-1LKG_name";
nameSpan.textContent = "sample.txt";
rowBtn.appendChild(nameSpan);
li.appendChild(rowBtn);
treeRoot.appendChild(li);
body.appendChild(treeRoot);

const header = makeElement("div");
header.className = "dhJKeW_header";
const pathEl = makeElement("div");
pathEl.setAttribute("data-textpreview-path", "");
pathEl.setAttribute("title", FILE_PATH);
const reloadBtn = makeElement("button");
reloadBtn.setAttribute("data-textpreview-tool", "reload");
header.appendChild(pathEl);
header.appendChild(reloadBtn);
body.appendChild(header);

// 0.9.1：上传（目录行 + 树工具栏的旧「上传文件」入口）
const DIR_PATH = "/ws/dl-test";
const dirLi = makeElement("li");
dirLi.setAttribute("data-files-entry", "directory");
dirLi.setAttribute("data-files-path", DIR_PATH);
const dirRowBtn = makeElement("button");
dirRowBtn.className = "k-1LKG_row";
dirRowBtn.setAttribute("aria-expanded", "false");
dirLi.appendChild(dirRowBtn);
treeRoot.appendChild(dirLi);

const toolbar = makeElement("div");
toolbar.className = "toolbar_x";
const treeReload = makeElement("button");
treeReload.setAttribute("data-files-reload", "");
toolbar.appendChild(treeReload);
body.appendChild(toolbar);
let reloadClicks = 0;
treeReload.addEventListener("click", () => { reloadClicks++; });

// ---------- 4. apply：不抛错 + 旧 UI 断绝 + 透明修复在案 ----------
exportsObj.apply(makeCtx({ sessions: sessionsService }));
assert.ok(styleTags.length > 0, "apply 时必须注入样式");
const cssText = styleTags.map((s) => s.textContent ?? "").join("\n");
assert.ok(/_rightbarCol[^{}]*\{[^}]*backdrop-filter/.test(cssText), "透明修复：新右栏列必须带 backdrop-filter（玻璃模糊）");
assert.ok(cssText.includes(".dml-dl"), "下载按钮样式必须在案");
assert.ok(!slotInjects.some((s) => s.name === "conversation.view"), "「文件」页签（conversation.view slot）不得再注册");
assert.equal(slotInjects.filter((s) => s.name === "sidebar.footer.action").length, 1, "侧栏动作 slot 保留（主题按钮）");
assert.ok(effectLabels.some((l) => /built-in files panel download/.test(l)), "filesDownloadController 必须挂载");
assert.ok(effectLabels.some((l) => /built-in files panel upload/.test(l)), "filesUploadController 必须挂载（0.9.1 恢复上传）");

// 渲染侧栏动作行：只剩「主题与背景」
const footerEntry = slotInjects.find((s) => s.name === "sidebar.footer.action");
footerEntry.factory();
assert.equal(slotRegistrations.length, 1, "侧栏动作行注册一次");
const actionsRow = slotRegistrations[0].Component({ wide: true, openSkin: () => {} });
const labels = [];
const walkLabels = (n) => {
	if (n == null || typeof n !== "object") return;
	if (typeof n.props?.label === "string") labels.push(n.props.label);
	for (const c of Array.isArray(n.children) ? n.children : n.children ? [n.children] : []) {
		if (typeof c === "string") labels.push(c);
		else walkLabels(c);
	}
	const p = n.props?.children;
	if (typeof p === "string") labels.push(p);
	if (Array.isArray(p)) p.forEach((c) => typeof c === "string" && labels.push(c));
};
walkLabels(actionsRow);
assert.ok(labels.includes("主题与背景"), "「主题与背景」按钮保留");
assert.ok(!labels.includes("上传文件"), "「上传文件」按钮必须消失，实际: " + JSON.stringify(labels));

// ---------- 5. 首轮扫描：文件树行不注入；预览头注入唯一下载按钮 ----------
assert.ok(!li.classList.contains("dml-dl-host"), "文件树行不得带 dml-dl-host（0.9.7 移除行内下载）");
assert.equal(li.children.length, 1, "文件树行保持原始单按钮，不注入下载按钮");
assert.ok(!li.querySelector("[data-dml-download]"), "文件树行内不得有 data-dml-download");
assert.equal(li.querySelectorAll("[data-dml-download]").length, 0, "树行下载按钮必须为空");
const hasDlMark = (c) => c.getAttribute && c.getAttribute("data-dml-download") !== null;
const headerDl = header.children.find(hasDlMark);
assert.ok(headerDl, "预览头必须注入下载按钮");
assert.equal(header.children.indexOf(headerDl), header.children.indexOf(reloadBtn) - 1, "预览头下载按钮应插在刷新工具之前");
const dlBtn = headerDl;
assert.equal(dlBtn.getAttribute("data-dml-download"), "", "下载按钮必须带 data-dml-download");
assert.equal(dlBtn.getAttribute("data-dml-path"), FILE_PATH, "下载按钮必须携带预览头 title 的绝对路径");
assert.equal(dlBtn.getAttribute("aria-label"), "下载到设备");

// ---------- 6. 点击 → /mobile-files/download + 进度 + blob 下载链路 ----------
dlBtn.click();
assert.equal(xhrLog.length, 1, "点击必须发起一次 XHR");
const xhr = xhrLog[0];
assert.equal(xhr.method, "GET");
assert.equal(xhr.url.split("?")[0], "/mobile-files/download");
const q = new URLSearchParams(xhr.url.split("?")[1]);
assert.equal(q.get("sessionId"), SESSION_ID, "sessionId 必须来自 sessions 服务快照");
assert.equal(q.get("path"), FILE_PATH, "path 必须来自预览头 title 的绝对路径");
assert.equal(dlBtn.getAttribute("data-dml-state"), "busy");
const xhrCountAfterFirstClick = xhrLog.length;
dlBtn.click();
assert.equal(xhrLog.length, xhrCountAfterFirstClick, "busy 态重复点击必须被忽略");
xhr.onprogress({ lengthComputable: true, loaded: 50, total: 100 });
assert.equal(dlBtn.textContent, "50%", "XHR 进度必须反映在按钮上");
xhr.status = 200;
xhr.response = new Blob(["hello download"]);
xhr.onload();
assert.equal(dlBtn.getAttribute("data-dml-state"), "done", "成功后按钮进入 done 态");
const link = body.children[body.children.length - 1];
assert.equal(link.download, "sample.txt", "必须以文件名触发 a[download]");
assert.equal(link.href, "blob:fake-url");
assert.equal(link.parentElement, body, "下载必须真实派发 click（link 已挂 body）");
flushTimers();
assert.equal(dlBtn.getAttribute("data-dml-state"), null, "完成后定时器必须把按钮复位");

// ---------- 7. 失败路径：非 200 → fail 态 → 复位 ----------
dlBtn.click();
const xhr2 = xhrLog[xhrLog.length - 1];
assert.notEqual(xhr2, xhr, "复位后可再次发起下载");
xhr2.status = 403;
xhr2.onload();
assert.equal(dlBtn.getAttribute("data-dml-state"), "fail", "非 200 必须进入 fail 态");
flushTimers();
assert.equal(dlBtn.getAttribute("data-dml-state"), null, "失败提示必须自动复位");

// ---------- 7b. 上传入口（0.9.1 恢复：目录行 + 工具栏；0.9.8 起目录行=展开+锚定行）----------
// dirLi 的 aria-expanded 在 fixture 里是 false → 首轮扫描不应注入
assert.ok(!dirLi.querySelector("[data-dml-upload]"), "未展开的文件夹行不得有上传按钮（0.9.8）");
assert.ok(!dirLi.classList.contains("dml-ul-host"), "未展开的文件夹行不得带 dml-ul-host");
// 展开 → 注入到行元素（DOM-stub 无真实属性观察回调，fireMutations 仅触发回调、
// scan 走 150ms debounce → 必须 flushTimers）
dirRowBtn.setAttribute("aria-expanded", "true");
fireMutations();
flushTimers();
assert.ok(dirLi.classList.contains("dml-ul-host"), "展开的目录行必须带 dml-ul-host（右侧留白）");
const ulBtn = dirRowBtn.querySelector("[data-dml-upload]");
assert.ok(ulBtn, "展开的目录行必须注入上传按钮");
assert.equal(ulBtn.parentElement, dirRowBtn, "上传按钮必须挂在行元素（[class*='_row']）而非 li");
assert.equal(ulBtn.getAttribute("data-dml-dir"), DIR_PATH, "目录行按钮必须携带该目录绝对路径");
assert.equal(ulBtn.getAttribute("aria-label"), "上传到此目录");
// 收起 → 移除（0.9.8 新行为）
dirRowBtn.setAttribute("aria-expanded", "false");
fireMutations();
flushTimers();
assert.ok(!dirLi.querySelector("[data-dml-upload]"), "收起后上传按钮必须移除");
assert.ok(!dirLi.classList.contains("dml-ul-host"), "收起后必须回收 dml-ul-host");
// 重新展开供后续上传流程用例
dirRowBtn.setAttribute("aria-expanded", "true");
fireMutations();
flushTimers();
const ulBtnRow = dirRowBtn.querySelector("[data-dml-upload]");
assert.ok(ulBtnRow, "重新展开后上传按钮必须恢复");
// 收起/展开重建了新按钮，后续流程一律用这个引用
const ulBtnF = ulBtnRow;
const toolbarUl = toolbar.children.find((c) => c.getAttribute && c.getAttribute("data-dml-upload") !== null);
assert.ok(toolbarUl, "工具栏必须注入上传按钮（旧「上传文件」入口）");
assert.equal(toolbarUl.getAttribute("data-dml-dir"), "", "工具栏按钮不带 dir → 服务端解析 <workspace>/upload");
assert.equal(toolbar.children.indexOf(toolbarUl), toolbar.children.indexOf(treeReload) - 1, "工具栏上传按钮须插在刷新工具之前");

const xhrBeforeUpload = xhrLog.length;
ulBtnF.click();
const uploadInput = body.querySelector("[data-dml-upload-input]");
assert.ok(uploadInput, "点击必须创建隐藏 file input");
assert.equal(uploadInput.type, "file");
assert.equal(uploadInput.multiple, true);
assert.equal(xhrLog.length, xhrBeforeUpload, "选文件前不得发请求");
uploadInput.files = [{ name: "phone photo.jpg", size: 12 }];
for (const h of uploadInput._handlers.change) h({});
await new Promise((r) => setImmediate(r));
const upXhr = xhrLog[xhrLog.length - 1];
assert.equal(upXhr.method, "POST");
assert.equal(upXhr.url.split("?")[0], "/mobile-files/upload");
const uq = new URLSearchParams(upXhr.url.split("?")[1]);
assert.equal(uq.get("sessionId"), SESSION_ID, "上传 sessionId 必须来自 sessions 服务");
assert.equal(uq.get("name"), "phone photo.jpg", "文件名必须进 query");
assert.equal(uq.get("dir"), DIR_PATH, "目录行按钮必须带 dir");
assert.equal(upXhr.body.name, "phone photo.jpg", "原始文件体必须交给 send()");
assert.equal(upXhr.headers["content-type"], "application/octet-stream");
upXhr.upload.onprogress({ lengthComputable: true, loaded: 6 });
assert.equal(ulBtnF.textContent, "50%", "上传进度必须反映在按钮上");
upXhr.status = 200;
upXhr.onload();
await new Promise((r) => setImmediate(r));
assert.equal(ulBtnF.getAttribute("data-dml-state"), "done", "上传成功必须进入 done 态");
flushTimers();
assert.equal(ulBtnF.getAttribute("data-dml-state"), null, "成功提示必须自动复位");
assert.equal(reloadClicks, 1, "上传成功后必须触发内置树的刷新");

toolbarUl.click();
assert.equal(body.querySelectorAll("[data-dml-upload-input]").length, 1, "隐藏 input 必须复用，不得重复创建");
uploadInput.files = [{ name: "b.txt", size: 3 }];
for (const h of uploadInput._handlers.change) h({});
await new Promise((r) => setImmediate(r));
const upXhr2 = xhrLog[xhrLog.length - 1];
assert.equal(new URLSearchParams(upXhr2.url.split("?")[1]).get("dir"), null, "工具栏按钮不得带 dir");
upXhr2.status = 200;
upXhr2.onload();
await new Promise((r) => setImmediate(r));
flushTimers();
assert.equal(reloadClicks, 2, "工具栏上传成功同样刷新树");

toolbarUl.click();
uploadInput.files = [{ name: "c.txt", size: 3 }];
for (const h of uploadInput._handlers.change) h({});
await new Promise((r) => setImmediate(r));
const upXhr3 = xhrLog[xhrLog.length - 1];
upXhr3.status = 403;
upXhr3.onload();
await new Promise((r) => setImmediate(r));
assert.equal(toolbarUl.getAttribute("data-dml-state"), "fail", "非 200 必须进入 fail 态");
flushTimers();
assert.equal(toolbarUl.getAttribute("data-dml-state"), null, "失败提示必须自动复位");
assert.equal(reloadClicks, 2, "失败不得触发刷新");

// ---------- 7c. 路径来源（0.9.8）：contentId 权威 + title 回退 + 定不出即移除 ----------
// (a) data-textpreview-url（session 相对路径）+ 树根 → 权威绝对路径，title 无关
const headerB = makeElement("div");
headerB.className = "dhJKeW_header";
const previewRootB = makeElement("div");
previewRootB.className = "x_preview";
previewRootB.setAttribute("data-textpreview-url", "dsh-resource://file/session/" + SESSION_ID + "/sub/dir/deep.txt");
const pathElB = makeElement("div");
pathElB.setAttribute("data-textpreview-path", "");
pathElB.setAttribute("title", "ignored-not-absolute.txt"); // 展示用 title，不采用
const reloadB = makeElement("button");
reloadB.setAttribute("data-textpreview-tool", "reload");
headerB.appendChild(pathElB);
headerB.appendChild(reloadB);
previewRootB.appendChild(headerB);
body.appendChild(previewRootB);
fireMutations();
flushTimers();
const dlB = headerB.children.find(hasDlMark);
assert.ok(dlB, "有 contentId 时必须注入下载按钮");
assert.equal(dlB.getAttribute("data-dml-path"), "/ws/sub/dir/deep.txt", "session 相对 contentId 必须经树根化为绝对路径（不采 title）");

// (b) contentId 变化（切换文件）→ 按钮路径跟随权威来源重装饰
previewRootB.setAttribute("data-textpreview-url", "dsh-resource://file/session/" + SESSION_ID + "/other/new.md");
pathElB.setAttribute("title", "/ws/other/new.md");
fireMutations();
flushTimers();
const dlB2 = headerB.children.find(hasDlMark);
assert.ok(dlB2, "切换文件后仍有下载按钮");
assert.equal(dlB2.getAttribute("data-dml-path"), "/ws/other/new.md", "contentId 变化后按钮必须指向新文件");
assert.equal(headerB.children.filter(hasDlMark).length, 1, "重装饰不得产生重复按钮");

// (c) contentId 指向相对路径且工作区根不可得 → 移除按钮（宁可没有，不下错文件）
treeRoot.remove(); // 摘掉树根，workspaceRoot 只剩 sessions cwd（/ws）——仍存在，先覆盖另一种 null 形态
// 直接构造一个「session contentId + 无根」的场景不易；改为验证 title 绝对回退 + null 移除两条
previewRootB.setAttribute("data-textpreview-url", "dsh-resource://file/absolute//ws/docs/abs.md"); // absolute scope
pathElB.setAttribute("title", "should-be-ignored");
fireMutations();
flushTimers();
const dlB3 = headerB.children.find(hasDlMark);
assert.ok(dlB3, "absolute contentId 必须可用");
assert.equal(dlB3.getAttribute("data-dml-path"), "/ws/docs/abs.md", "absolute scope contentId 必须直接给绝对路径");
previewRootB.remove();
body.appendChild(treeRoot); // 还原树根供后续用例

// (d) 无 contentId + title 非绝对 → 移除按钮（0.9.7 会留旧按钮 → 下错文件）
const headerC = makeElement("div");
headerC.className = "dhJKeW_header";
const pathElC = makeElement("div");
pathElC.setAttribute("data-textpreview-path", "");
pathElC.setAttribute("title", "relative/only.txt"); // 相对、无 contentId、无 absolute
const reloadC = makeElement("button");
reloadC.setAttribute("data-textpreview-tool", "reload");
headerC.appendChild(pathElC);
headerC.appendChild(reloadC);
body.appendChild(headerC);
fireMutations();
flushTimers();
assert.ok(!headerC.querySelector("[data-dml-download]"), "定不出绝对路径时不得注入按钮");
// 补：先有按钮、再变成定不出 → 必须移除
pathElC.setAttribute("title", "/ws/has-abs.txt");
fireMutations();
flushTimers();
assert.ok(headerC.querySelector("[data-dml-download]"), "title 绝对时必须注入按钮");
pathElC.setAttribute("title", "relative/again.txt");
fireMutations();
flushTimers();
assert.ok(!headerC.querySelector("[data-dml-download]"), "路径变为不可解析时必须移除按钮（防下载错文件）");
headerC.remove();

// ---------- 8. dispose 清理 ----------
for (const d of disposers.splice(0)) d();
assert.ok(!header.children.includes(headerDl), "dispose 必须移除预览头下载按钮");
assert.ok(observers.every((o) => o.disconnected), "dispose 必须断开全部 observer");
assert.ok(!dirLi.classList.contains("dml-ul-host"), "dispose 必须回收 dml-ul-host 类");
assert.ok(!dirRowBtn.querySelector("[data-dml-upload]"), "dispose 必须移除目录行（行元素上的）上传按钮");
assert.ok(!toolbar.children.includes(toolbarUl), "dispose 必须移除工具栏上传按钮");
assert.ok(!body.querySelector("[data-dml-upload-input]"), "dispose 必须移除隐藏 file input");

// ---------- 9. fallback：sessions 服务缺席 → localStorage 当前会话；重扫幂等 ----------
store.set("dsh.sessions.current", JSON.stringify("session-ls-42"));
observers.length = 0;
const exports2 = captured.factory((name) => (name === "react" ? fakeReact : primitives));
exports2.apply(makeCtx({ sessions: null }));
const dlBtn2 = header.children.find(hasDlMark);
assert.ok(dlBtn2, "服务缺席时仍必须注入下载按钮（挂载即扫描）");
assert.equal(dlBtn2.getAttribute("data-dml-path"), FILE_PATH);
fireMutations();
flushTimers();
fireMutations();
flushTimers();
assert.equal(header.children.filter(hasDlMark).length, 1, "重复扫描不得产生重复按钮");
dlBtn2.click();
const xhr3 = xhrLog[xhrLog.length - 1];
assert.equal(new URLSearchParams(xhr3.url.split("?")[1]).get("sessionId"), "session-ls-42", "sessionId 必须 fallback 到 localStorage 当前会话");
xhr3.status = 200;
xhr3.response = new Blob(["x"]);
xhr3.onload();
for (const d of disposers.splice(0)) d();

// ---------- 10. 引擎差异回归：new URL("dsh-resource://…") 解析不出 host ----------
// 复现真机（小米浏览器）行为：dsh-resource:// 地址 hostname 为空 → 资源注册表认不出协议
// → 预览报「文件资源服务不可用」。断言顶层补丁自动介入，且不影响正常 URL。
const realURL = globalThis.URL;
const brokenURL = function (input, base) {
	const text = String(input);
	if (text.slice(0, 13).toLowerCase() === "dsh-resource:") {
		return { protocol: "dsh-resource:", hostname: "", host: "", href: text, toString: () => text };
	}
	return base === undefined ? new realURL(input) : new realURL(input, base);
};
brokenURL.prototype = realURL.prototype;
globalThis.URL = brokenURL;
// 顶层 shim 只在脚本被求值时执行 → 必须重新求值整个 client.js
vm.runInThisContext(code, { filename: "dsh-mobile-layout-client-broken-url.js" });
assert.equal(globalThis.window.__DML_URL_PATCHED__, true, "检测到 host 解析缺失时必须安装补丁");
assert.equal(globalThis.window.__DML_URL_PROBE__.hostname, "", "探针必须记录原始（损坏的）解析结果");
assert.equal(new globalThis.window.URL("dsh-resource://file/absolute/x").hostname, "file", "补丁后 dsh-resource 地址必须解析出 host");
assert.equal(new globalThis.window.URL("dsh-resource://file/session/s1/docs/a.md").hostname, "file");
assert.equal(new globalThis.window.URL("https://example.com/a").hostname, "example.com", "普通 URL 解析不得受影响");
assert.equal(new globalThis.window.URL("https://example.com/a").protocol, "https:");
globalThis.URL = realURL;

console.log("client-smoke: all assertions passed");
