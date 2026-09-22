/**
 * host-smoke.mjs — host 半冒烟测试（零依赖，node 直接跑）。
 *
 * 0.9.0 回归改造覆盖：/mobile-files 路由面只剩 download。
 *  - GET /mobile-files/download?sessionId=…&path=… → 200 流式返回工作区内文件
 *    （attachment + UTF-8 filename*、no-store、content-length 正确）；
 *  - HEAD → 200 空 body；
 *  - list / read / upload → 404 unknown-action（0.1.5 起由内置能力接管）；
 *  - 越权面：缺 sessionId → 400、未注册会话 → 403、工作区外路径 → 403、
 *    符号链接逃逸 → 403、目录 → 400、不存在 → 404、缺 path → 400、NUL → 400。
 *
 * 运行：node test/host-smoke.mjs
 */
import { apply } from "../lib/index.js";
import assert from "node:assert";
import { EventEmitter } from "node:events";
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const root = await mkdtemp(path.join(tmpdir(), "dml-host-smoke-"));
try {
	await mkdir(path.join(root, "dl-test"), { recursive: true });
	const fileBody = "hello dsh-mobile-layout 0.9.0 download\n";
	const filePath = path.join(root, "dl-test", "sample.txt");
	await writeFile(filePath, fileBody);
	const outside = await mkdtemp(path.join(tmpdir(), "dml-host-smoke-out-"));
	await writeFile(path.join(outside, "secret.txt"), "outside");
	await symlink(path.join(root, "dl-test"), path.join(root, "inside-dir"));
	await symlink(outside, path.join(root, "sneaky-dir"));
	await symlink(process.platform === "win32" ? "C:\\Windows\\win.ini" : "/etc/hosts", path.join(root, "sneaky-file"));

	// "Outside the workspace" must be an absolute path that really exists on this
	// platform, otherwise realpath() throws ENOENT and the route answers 404
	// (not-found) before the containment check runs. `/etc/hosts` only exists on
	// POSIX; `C:\Windows\win.ini` is its Windows opposite.
	const outsideAbs = process.platform === "win32" ? "C:\\Windows\\win.ini" : "/etc/hosts";
	let registered = null;
	let capturedDeps = null;
	const registry = { list: () => [{ sessionIds: ["session-1"], path: root }] };
	apply({
		inject: (deps, fn) => {
			capturedDeps = deps;
			fn({
				effect: (f) => f(),
				webServer: { register: (spec) => { registered = spec; } },
				workspaceRegistry: registry
			});
		}
	});
	assert.deepEqual(capturedDeps, ["webServer", "workspaceRegistry"]);
	assert.equal(registered.kind, "prefix");
	assert.equal(registered.path, "/mobile-files");
	const handler = registered.handler;

	const call = async (method, url, body) => {
		const res = new EventEmitter();
		const state = { status: null, headers: null, chunks: [], ended: false };
		res.writeHead = (status, headers) => { state.status = status; state.headers = headers; };
		res.write = (chunk) => { state.chunks.push(Buffer.from(chunk)); return true; };
		res.end = (chunk) => {
			if (chunk) state.chunks.push(Buffer.from(chunk));
			state.ended = true;
			res.emit("finish");
		};
		res.destroy = (err) => { state.destroyed = err ?? true; res.emit("error", err ?? new Error("destroyed")); };
		const done = new Promise((resolve) => res.once("finish", resolve));
		const req = { method, url, headers: {} };
		if (body !== undefined) {
			req.headers["content-length"] = String(Buffer.byteLength(body));
			req[Symbol.asyncIterator] = async function* () { yield Buffer.from(body); };
		}
		await handler(req, res);
		await done;
		return { ...state, body: Buffer.concat(state.chunks).toString("utf8"), json: () => JSON.parse(Buffer.concat(state.chunks).toString("utf8")) };
	};

	// ---- happy path：流式下载 ----
	const ok = await call("GET", `/mobile-files/download?sessionId=session-1&path=${encodeURIComponent(filePath)}`);
	assert.equal(ok.status, 200);
	assert.equal(ok.headers["content-type"], "application/octet-stream");
	assert.equal(ok.headers["cache-control"], "no-store");
	assert.equal(ok.headers["content-length"], String(Buffer.byteLength(fileBody)));
	assert.ok(ok.headers["content-disposition"].includes("attachment"));
	assert.ok(ok.headers["content-disposition"].includes(encodeURIComponent("sample.txt")));
	assert.equal(ok.body, fileBody, "下载内容必须与源文件一致");

	// ---- HEAD ----
	const head = await call("HEAD", `/mobile-files/download?sessionId=session-1&path=${encodeURIComponent(filePath)}`);
	assert.equal(head.status, 200);
	assert.equal(head.body, "");

	// ---- 旧动作彻底退役（0.1.5 内置接管；upload 于 0.9.1 恢复，见下节）----
	for (const url of [
		`/mobile-files/list?sessionId=session-1&path=${encodeURIComponent(root)}`,
		`/mobile-files/read?sessionId=session-1&path=${encodeURIComponent(filePath)}`
	]) {
		const r = await call("GET", url);
		assert.equal(r.status, 404, `旧动作必须 404: ${url}`);
		assert.equal(r.json().error, "unknown-action");
	}
	const bare = await call("GET", "/mobile-files/");
	assert.equal(bare.status, 404);
	assert.ok(bare.json().message.includes("/mobile-files/upload"), "404 消息须说明现存 download+upload 两动作");

	// ---- upload（0.9.1 恢复；上传能力从不属于被退役的文件浏览器）----
	const uploadBody = "uploaded from the phone\n";
	const up = await call("POST", "/mobile-files/upload?sessionId=session-1&name=photo%20a.txt", uploadBody);
	assert.equal(up.status, 200, "合法上传必须 200");
	assert.equal(up.json().name, "photo a.txt");
	assert.equal(await readFile(path.join(root, "upload", "photo a.txt"), "utf8"), uploadBody, "默认必须落 <workspace>/upload");
	// 重名不覆盖：自动 (1)
	const up2 = await call("POST", "/mobile-files/upload?sessionId=session-1&name=photo%20a.txt", "second");
	assert.equal(up2.status, 200);
	assert.equal(up2.json().name, "photo a (1).txt", "重名必须改名而非覆盖");
	assert.equal(await readFile(path.join(root, "upload", "photo a.txt"), "utf8"), uploadBody, "原文件不得被覆盖");
	// dir 目标（目录行按钮）：落进指定目录
	const up3 = await call("POST", `/mobile-files/upload?sessionId=session-1&name=nested.txt&dir=${encodeURIComponent(path.join(root, "dl-test"))}`, "nested body");
	assert.equal(up3.status, 200, "工作区内目录必须 200");
	assert.equal(await readFile(path.join(root, "dl-test", "nested.txt"), "utf8"), "nested body", "必须落进 dir 指定目录");
	// 越权/边界
	assert.equal((await call("POST", "/mobile-files/upload?name=x.txt", "x")).status, 400, "缺 sessionId");
	assert.equal((await call("POST", "/mobile-files/upload?sessionId=session-404&name=x.txt", "x")).status, 403, "未注册会话");
	assert.equal((await call("POST", "/mobile-files/upload?sessionId=session-1&name=../evil.txt", "x")).status, 400, "name 穿越拒绝");
	assert.equal((await call("POST", "/mobile-files/upload?sessionId=session-1&name=a%2Fb.txt", "x")).status, 400, "name 含分隔符拒绝");
	assert.equal((await call("POST", `/mobile-files/upload?sessionId=session-1&name=x.txt&dir=${encodeURIComponent(path.dirname(outsideAbs))}`, "x")).status, 403, "dir 工作区外拒绝");
	assert.equal((await call("POST", `/mobile-files/upload?sessionId=session-1&name=x.txt&dir=${encodeURIComponent(path.join(root, "sneaky-dir"))}`, "x")).status, 403, "dir 符号链接逃逸拒绝");
	assert.equal((await call("POST", `/mobile-files/upload?sessionId=session-1&name=x.txt&dir=${encodeURIComponent(path.join(root, "nope"))}`, "x")).status, 404, "dir 不存在 → 404");
	assert.equal((await call("GET", "/mobile-files/upload?sessionId=session-1&name=x.txt")).status, 405, "upload 非 POST 拒绝");

	// ---- 上限：独立 apply（uploadMaxBytes 16），超限 413 且不留半截文件 ----
	let smallHandler = null;
	apply(
		{
			inject: (deps, fn) => fn({
				effect: (f) => f(),
				webServer: { register: (spec) => { smallHandler = spec.handler; } },
				workspaceRegistry: registry
			})
		},
		{ uploadMaxBytes: 16 }
	);
	const capRes = await (async () => {
		const res = new EventEmitter();
		const state = { status: null, chunks: [] };
		res.writeHead = (status) => { state.status = status; };
		res.write = () => true;
		res.end = (chunk) => { if (chunk) state.chunks.push(Buffer.from(chunk)); res.emit("finish"); };
		res.destroy = () => {};
		const done = new Promise((resolve) => res.once("finish", resolve));
		await smallHandler(
			{ method: "POST", url: "/mobile-files/upload?sessionId=session-1&name=big.bin", headers: { "content-length": "32" }, [Symbol.asyncIterator]: async function* () { yield Buffer.alloc(32); } },
			res
		);
		await done;
		return state;
	})();
	assert.equal(capRes.status, 413, "超过 uploadMaxBytes 必须 413");
	assert.equal(await readFile(path.join(root, "upload", "big.bin"), "utf8").catch(() => null), null, "超限不得留下半截文件");

	// ---- 越权/边界面 ----
	assert.equal((await call("GET", "/mobile-files/download?path=%2Fetc%2Fhosts")).status, 400, "缺 sessionId");
	assert.equal((await call("GET", "/mobile-files/download?sessionId=session-404&path=%2Fetc%2Fhosts")).status, 403, "未注册会话");
	assert.equal((await call("GET", `/mobile-files/download?sessionId=session-1&path=${encodeURIComponent(outsideAbs)}`)).status, 403, "工作区外路径");
	assert.equal((await call("GET", `/mobile-files/download?sessionId=session-1&path=${encodeURIComponent(path.join(root, "sneaky-file"))}`)).status, 403, "符号链接逃逸（文件）");
	assert.equal((await call("GET", `/mobile-files/download?sessionId=session-1&path=${encodeURIComponent(path.join(root, "sneaky-dir"))}`)).status, 403, "符号链接逃逸（目录）");
	assert.equal((await call("GET", "/mobile-files/download?sessionId=session-1")).status, 400, "缺 path");
	const nul = await call("GET", `/mobile-files/download?sessionId=session-1&path=${encodeURIComponent(root)}%00`);
	assert.equal(nul.status, 400, "NUL 字节拒绝");
	const dir = await call("GET", `/mobile-files/download?sessionId=session-1&path=${encodeURIComponent(root)}`);
	assert.equal(dir.status, 400, "目录拒绝");
	assert.equal(dir.json().error, "is-a-directory");
	const missing = await call("GET", `/mobile-files/download?sessionId=session-1&path=${encodeURIComponent(path.join(root, "nope.txt"))}`);
	assert.equal(missing.status, 404, "不存在路径");
	const bad = await call("GET", "/mobile-files/download?sessionId=session-1&path=relative.txt");
	assert.equal(bad.status, 400, "相对路径拒绝");
	const method = await call("DELETE", `/mobile-files/download?sessionId=session-1&path=${encodeURIComponent(filePath)}`);
	assert.equal(method.status, 405, "非 GET/HEAD 拒绝");

	console.log("host-smoke: all assertions passed");
} finally {
	await rm(root, { recursive: true, force: true });
	for (const d of await import("node:fs/promises").then((m) => m.readdir(tmpdir()))) {
		if (d.startsWith("dml-host-smoke-out-")) await rm(path.join(tmpdir(), d), { recursive: true, force: true });
	}
}
