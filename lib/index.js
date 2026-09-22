/**
 * dsh-mobile-layout, node half.
 *
 * Registers one HTTP surface for the mobile file tools:
 *   GET  /mobile-files/download?sessionId=<id>&path=<abs>       — streamed download
 *   POST /mobile-files/upload?sessionId=<id>&name=<n>[&dir=<abs>] — streamed upload
 *
 * History: 0.8.x also served /mobile-files/list and /read for this package's own
 * file browser tab; dsh 0.1.5 ships browsing natively (workspace-files +
 * ui-sidebar-files / ui-sidebar-documentpreview), so 0.9.0 retired that tab and
 * decorates the built-in panel with download buttons. 0.9.1 restores upload —
 * the 上传文件 capability was never part of the removed browser — as an upload
 * control injected into the same built-in panel: a toolbar button keeps the
 * original target (`<workspace>/upload`, auto-created, never the root) and each
 * directory row gets an "upload into this directory" button that passes `dir`.
 * Dropping the dead list/read routes is a cold change: a running web host keeps
 * serving the old four-action surface until its next natural restart.
 *
 * The row itself also makes the package appear in the host Loader so the
 * client-modules registry discovers its `dsh.client` half.
 *
 * Security: every request carries a sessionId, but the browser never supplies
 * its root. The Host resolves that session through workspaceRegistry and uses
 * the registered canonical Workspace path as the sole read boundary — path
 * traversal and symlink escape are refused. No-cache.
 *
 * Platform contract (0.9.11): `path`/`dir` are validated with node:path
 * `isAbsolute()`, never a `startsWith("/")` POSIX test, so Windows drive
 * (`C:\...`), drive-relative-to-slash (`C:/...`) and UNC (`\\server\share`)
 * forms are accepted alongside POSIX. Containment compares case-folded on
 * win32 because realpath() preserves on-disk casing while the registry path
 * may differ in case for the same directory. Before this, every Windows
 * download and every directory-scoped upload answered 400.
 *
 * Zero @deepseek-ai dependencies on purpose (profile plugin iron rule).
 */
import { createReadStream } from "node:fs";
import { mkdir, open, realpath, stat, unlink } from "node:fs/promises";
import { basename, dirname, isAbsolute, join, sep } from "node:path";

const UPLOAD_MAX_DEFAULT = 500 * 1024 * 1024; // 500 MB per file: phone videos fit
const UPLOAD_RENAME_CAP = 100;

function humanSize(n) {
	if (n < 1024) return `${n} B`;
	if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
	if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
	return `${(n / 1024 / 1024 / 1024).toFixed(1)} GB`;
}
/** "name.ext" → "name (1).ext"; "name" → "name (1)". */
function suffixedName(name, n) {
	const e = name.includes(".") ? name.slice(name.lastIndexOf(".")) : "";
	const stem = e ? name.slice(0, -e.length) : name;
	return `${stem} (${n})${e}`;
}
/** True when the name is one clean single path segment. */
function badSegment(name) {
	return !name || name === "." || name === ".." || name.length > 255 || /[/\\\0]/.test(name) || /[\u0000-\u001f\u007f]/.test(name);
}

function sendJson(res, status, value) {
	res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-cache" });
	res.end(JSON.stringify(value));
}

export const name = "dsh-mobile-layout";
// webServer is acquired optionally: profiles without the web server still
// load the plugin (the file routes are the only consumer of the surface).
export const inject = [];

export function apply(ctx, config) {
	const uploadMaxBytes = Number.isFinite(config?.uploadMaxBytes) && config.uploadMaxBytes > 0 ? config.uploadMaxBytes : UPLOAD_MAX_DEFAULT;
	/** Resolve a client session id to its server-owned Workspace and canonical root. */
	const workspaceRoot = async (registry, sessionId) => {
		if (!sessionId) return { error: "missing-session", message: "sessionId is required" };
		const workspace = registry.list().find((entry) => entry.sessionIds.includes(sessionId));
		if (workspace === void 0) return { error: "unknown-workspace-session", message: "session is not attached to a registered workspace" };
		try {
			const root = await realpath(workspace.path);
			if (!(await stat(root)).isDirectory()) return { error: "workspace-unavailable", message: "workspace root is not a directory" };
			return { workspace, root };
		} catch {
			return { error: "workspace-unavailable", message: "workspace root is unavailable" };
		}
	};

	/**
	 * Containment test for a resolved path against a resolved root.
	 * Windows paths are case-insensitive, while realpath() preserves the on-disk
	 * casing and the registry may hold a differently-cased path for the same
	 * directory (e.g. `...\projects\SequenceNet` vs `...\projects\sequencenet`),
	 * so compare case-folded on Windows. POSIX keeps the plain comparison.
	 */
	const sameOrInside = (root, path) => {
		const candidate = process.platform === "win32" ? path.toLowerCase() : path;
		const base = process.platform === "win32" ? root.toLowerCase() : root;
		return candidate === base || candidate.startsWith(base.endsWith(sep) ? base : base + sep);
	};

	/** Resolve an existing path and require it to remain inside one Workspace root. */
	const pathInside = async (root, path) => {
		const real = await realpath(path);
		return sameOrInside(root, real) ? real : null;
	};

	/** Create and validate this Workspace's dedicated upload directory (legacy target). */
	const resolveUploadDir = async (root) => {
		const abs = join(root, "upload");
		let probe = abs;
		for (;;) {
			try {
				if (!(await stat(probe)).isDirectory()) return null;
				break;
			} catch {
				const parent = dirname(probe);
				if (parent === probe) return null;
				probe = parent;
			}
		}
		const realProbe = await realpath(probe).catch(() => null);
		if (!realProbe || !sameOrInside(root, realProbe)) return null;
		try {
			await mkdir(abs, { recursive: true });
		} catch {
			return null;
		}
		return await pathInside(root, abs).catch(() => null);
	};

	/**
	 * Resolve the upload destination: no `dir` = the legacy `<workspace>/upload`
	 * (auto-created, never the root); `dir` = that existing directory, required to
	 * realpath inside the session's Workspace (the directory-row buttons use this).
	 */
	const resolveTargetDir = async (root, rawDir) => {
		if (!rawDir) {
			const legacy = await resolveUploadDir(root);
			return legacy ?? { error: "upload-disabled", message: "workspace upload directory is unavailable" };
		}
		if (!isAbsolute(rawDir) || rawDir.includes("\0")) return { error: "bad-dir", message: "dir must be an absolute path" };
		let real = null;
		try {
			real = await realpath(rawDir);
		} catch {
			return { error: "not-found", message: "dir does not exist" };
		}
		if (!sameOrInside(root, real)) {
			return { error: "forbidden", message: "dir is outside the current workspace" };
		}
		try {
			if (!(await stat(real)).isDirectory()) return { error: "not-a-directory", message: "dir is not a directory" };
		} catch {
			return { error: "not-found", message: "dir does not exist" };
		}
		return real;
	};

	/** Stream one upload into the resolved directory, never overwriting a file. */
	const handleUpload = async (req, res, u, root) => {
		const dir = await resolveTargetDir(root, (u.searchParams.get("dir") ?? "").trim());
		if (typeof dir !== "string") {
			const status = dir.error === "forbidden" ? 403 : dir.error === "not-found" ? 404 : 400;
			sendJson(res, status, dir);
			return;
		}
		let rawName = (u.searchParams.get("name") ?? "").trim();
		if (badSegment(rawName)) {
			sendJson(res, 400, { error: "bad-name", message: "name must be a single path segment (no separators), 1-255 chars" });
			return;
		}
		const lenHeader = Number(req.headers["content-length"]);
		if (Number.isFinite(lenHeader) && lenHeader > uploadMaxBytes) {
			sendJson(res, 413, { error: "too-large", message: `file exceeds the ${humanSize(uploadMaxBytes)} upload cap` });
			return;
		}
		let target = null;
		let handle = null;
		for (let i = 0; i < UPLOAD_RENAME_CAP; i++) {
			const candidate = i === 0 ? rawName : suffixedName(rawName, i);
			const full = join(dir, candidate);
			try {
				handle = await open(full, "wx");
				target = full;
				break;
			} catch (err) {
				if (err && err.code === "EEXIST") continue;
				sendJson(res, err && err.code === "EACCES" ? 403 : 500, {
					error: err && err.code === "EACCES" ? "permission-denied" : "internal",
					message: String((err && err.message) || err)
				});
				return;
			}
		}
		if (!handle || !target) {
			sendJson(res, 409, { error: "name-conflict", message: "too many existing files with the same name" });
			return;
		}
		let size = 0;
		let failed = null;
		let tooBig = false;
		try {
			for await (const chunk of req) {
				size += chunk.length;
				if (size > uploadMaxBytes) {
					tooBig = true;
					break;
				}
				await handle.write(chunk);
			}
		} catch (err) {
			failed = err;
		}
		try {
			await handle.close();
		} catch {
			/* already closed by a failed write */
		}
		if (tooBig || failed) {
			await unlink(target).catch(() => {});
			sendJson(res, tooBig ? 413 : 400, {
				error: tooBig ? "too-large" : "upload-failed",
				message: tooBig ? `file exceeds the ${humanSize(uploadMaxBytes)} upload cap` : `upload interrupted: ${String((failed && failed.message) || failed)}`
			});
			return;
		}
		sendJson(res, 200, { saved: target, name: basename(target), size: humanSize(size) });
	};

	ctx.inject(["webServer", "workspaceRegistry"], (httpCtx) => httpCtx.effect(() => httpCtx.webServer.register({
		kind: "prefix",
		path: "/mobile-files",
		handler: async (req, res) => {
			const u = new URL(req.url ?? "/", "http://x");
			const action = u.pathname.replace(/^\/mobile-files\/?/, "");
			if (action !== "download" && action !== "upload") {
				sendJson(res, 404, { error: "unknown-action", message: `unknown action: ${action || "(empty)"} — 0.9.x serves /mobile-files/download (GET|HEAD) and /mobile-files/upload (POST); list/read moved into dsh 0.1.5 built-ins` });
				return;
			}
			const wantMethods = action === "upload" ? ["POST"] : ["GET", "HEAD"];
			if (!wantMethods.includes(req.method ?? "GET")) {
				res.writeHead(405);
				res.end();
				return;
			}
			const sessionId = (u.searchParams.get("sessionId") ?? "").trim();
			const binding = await workspaceRoot(httpCtx.workspaceRegistry, sessionId);
			if (binding.error !== void 0) {
				sendJson(res, binding.error === "missing-session" ? 400 : 403, binding);
				return;
			}
			const { root } = binding;
			if (action === "upload") {
				await handleUpload(req, res, u, root);
				return;
			}
			const rawPath = u.searchParams.get("path");
			if (!rawPath) {
				sendJson(res, 400, { error: "missing-path", message: "path is required" });
				return;
			}
			if (!isAbsolute(rawPath) || rawPath.includes("\0")) {
				sendJson(res, 400, { error: "bad-path", message: "path must be an absolute path" });
				return;
			}
			try {
				const scopedPath = await pathInside(root, rawPath);
				if (!scopedPath) {
					sendJson(res, 403, { error: "forbidden", message: "path is outside the current workspace" });
					return;
				}
				const st = await stat(scopedPath);
				if (st.isDirectory()) {
					sendJson(res, 400, { error: "is-a-directory", message: "path is a directory" });
					return;
				}
				res.writeHead(200, {
					"content-type": "application/octet-stream",
					"content-length": String(st.size),
					"cache-control": "no-store",
					"content-disposition": `attachment; filename*=UTF-8''${encodeURIComponent(basename(scopedPath))}`
				});
				if (req.method === "HEAD") {
					res.end();
					return;
				}
				const stream = createReadStream(scopedPath);
				stream.on("error", (err) => res.destroy(err));
				stream.pipe(res);
			} catch (err) {
				if (err && (err.code === "ENOENT" || err.code === "ENOTDIR")) {
					sendJson(res, 404, { error: "not-found", message: "path does not exist" });
					return;
				}
				if (err && err.code === "EACCES") {
					sendJson(res, 403, { error: "permission-denied", message: "permission denied" });
					return;
				}
				sendJson(res, 500, { error: "internal", message: String((err && err.message) || err) });
			}
		}
	}), "dsh-mobile-layout: workspace-scoped mobile-files download route"));
}
