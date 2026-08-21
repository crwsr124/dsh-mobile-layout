/**
 * dsh-mobile-layout, node half.
 *
 * Registers one HTTP surface for the mobile file tools:
 *   GET  /mobile-files/list?sessionId=<id>&path=<abs>     — workspace-scoped listing
 *   GET  /mobile-files/read?sessionId=<id>&path=<abs>     — workspace-scoped preview
 *   GET  /mobile-files/download?sessionId=<id>&path=<abs> — streamed download
 *   POST /mobile-files/upload?sessionId=<id>&name=<n>     — upload to <workspace>/upload
 *
 * The row itself also makes the package appear in the host Loader so the
 * client-modules registry discovers its `dsh.client` half.
 *
 * Security: every request carries a sessionId, but the browser never supplies
 * its root. The Host resolves that session through workspaceRegistry and uses
 * the registered canonical Workspace path as the sole read boundary. Uploads
 * land only in an auto-created `<workspace>/upload`, never the root. The file
 * name is a sanitized single segment, the size is capped and conflicts
 * auto-rename — no path traversal, no overwrite, no read-back. No-cache.
 *
 * Zero @deepseek-ai dependencies on purpose (profile plugin iron rule).
 */
import { createReadStream } from "node:fs";
import { mkdir, open, opendir, readFile, realpath, stat, unlink } from "node:fs/promises";
import { basename, dirname, extname, join, resolve, sep } from "node:path";

const TEXT_MAX = 2_000_000; // 2 MB: enough for any source file
const BINARY_MAX = 40_000_000; // 40 MB: images/PDFs
const LIST_MAX_ENTRIES = 2000;
const UPLOAD_MAX_DEFAULT = 500 * 1024 * 1024; // 500 MB per file: phone videos fit
const UPLOAD_RENAME_CAP = 100;

const TEXT_EXTS = new Set([
	"md", "markdown", "txt", "text", "log", "env", "gitignore", "gitattributes",
	"js", "mjs", "cjs", "ts", "tsx", "jsx", "json", "jsonc", "yaml", "yml",
	"toml", "ini", "conf", "cfg", "py", "pyw", "sh", "bash", "zsh", "fish",
	"css", "scss", "sass", "less", "html", "htm", "xml", "svg", "vue", "svelte",
	"c", "h", "cc", "cpp", "cxx", "hpp", "java", "kt", "go", "rs", "rb",
	"php", "sql", "swift", "m", "mm", "pl", "lua", "r", "cmake", "makefile",
	"dockerfile", "csv", "tsv", "diff", "patch", "proto", "graphql", "prisma"
]);

const MIME_BY_EXT = {
	png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif",
	webp: "image/webp", avif: "image/avif", svg: "image/svg+xml", bmp: "image/bmp",
	ico: "image/x-icon", pdf: "application/pdf", json: "application/json",
	html: "text/html", htm: "text/html", xml: "application/xml", css: "text/css",
	csv: "text/csv"
};

function extOf(name) {
	return extname(name).slice(1).toLowerCase();
}
function isText(name) {
	const e = extOf(name);
	if (e && TEXT_EXTS.has(e)) return true;
	const lower = name.toLowerCase();
	return lower === "makefile" || lower === "dockerfile" || lower.startsWith("dockerfile.") || lower === "license" || lower === "readme";
}
function mimeOf(name) {
	const e = extOf(name);
	if (e && MIME_BY_EXT[e]) return MIME_BY_EXT[e];
	return isText(name) ? "text/plain" : "application/octet-stream";
}
function humanSize(n) {
	if (n < 1024) return `${n} B`;
	if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
	if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
	return `${(n / 1024 / 1024 / 1024).toFixed(1)} GB`;
}
function sendJson(res, status, value) {
	res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-cache" });
	res.end(JSON.stringify(value));
}
async function ancestors(root, target) {
	const crumbs = [];
	let current = target;
	for (;;) {
		crumbs.unshift({ name: current === root ? basename(root) || root : basename(current), path: current });
		if (current === root) break;
		const parent = dirname(current);
		if (parent === current) break;
		current = parent;
	}
	return crumbs;
}
/** "name.ext" → "name (1).ext"; "name" → "name (1)". */
function suffixedName(name, n) {
	const e = extname(name);
	const stem = e ? name.slice(0, -e.length) : name;
	return `${stem} (${n})${e}`;
}
/** True when the name is one clean single path segment. */
function badSegment(name) {
	return !name || name === "." || name === ".." || name.length > 255 || /[/\\\0]/.test(name) || /[\u0000-\u001f\u007f]/.test(name);
}

export const name = "dsh-mobile-layout";
// webServer is acquired optionally: profiles without the web server still
// load the plugin (the file browser is the only consumer of the route).
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

	/** Resolve an existing path and require it to remain inside one Workspace root. */
	const pathInside = async (root, path) => {
		const real = await realpath(path);
		return real === root || real.startsWith(root.endsWith(sep) ? root : root + sep) ? real : null;
	};

	/** Create and validate this Workspace's dedicated upload directory. */
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
		if (!realProbe || !(realProbe === root || realProbe.startsWith(root.endsWith(sep) ? root : root + sep))) return null;
		try {
			await mkdir(abs, { recursive: true });
		} catch {
			return null;
		}
		return pathInside(root, abs).catch(() => null);
	};

	/** Stream one upload into `<workspace>/upload`, never overwriting a file. */
	const handleUpload = async (req, res, u, root) => {
		const dir = await resolveUploadDir(root);
		if (!dir) {
			sendJson(res, 403, { error: "upload-disabled", message: "workspace upload directory is unavailable" });
			return;
		}
		let rawName = u.searchParams.get("name") ?? "";
		rawName = rawName.trim();
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
			const action = u.pathname.replace(/^\/mobile-files\/?/, "") || "list";
			const sessionId = (u.searchParams.get("sessionId") ?? "").trim();
			const binding = await workspaceRoot(httpCtx.workspaceRegistry, sessionId);
			if (binding.error !== void 0) {
				sendJson(res, binding.error === "missing-session" ? 400 : 403, binding);
				return;
			}
			const { root, workspace } = binding;
			if (req.method === "POST") {
				if (action !== "upload") {
					res.writeHead(405);
					res.end();
					return;
				}
				await handleUpload(req, res, u, root);
				return;
			}
			if (req.method !== "GET" && req.method !== "HEAD") {
				res.writeHead(405);
				res.end();
				return;
			}
			const rawPath = u.searchParams.get("path") || root;
			if (!rawPath.startsWith("/") || rawPath.includes("\0")) {
				sendJson(res, 400, { error: "bad-path", message: "path must be an absolute path" });
				return;
			}
			try {
				const scopedPath = await pathInside(root, rawPath);
				if (!scopedPath) {
					sendJson(res, 403, { error: "forbidden", message: "path is outside the current workspace" });
					return;
				}
				if (action === "list") {
					const st = await stat(scopedPath);
					if (!st.isDirectory()) {
						sendJson(res, 400, { error: "not-a-directory", message: "path is not a directory" });
						return;
					}
					const dir = await opendir(scopedPath);
					const entries = [];
					let truncated = false;
					for await (const ent of dir) {
						if (entries.length >= LIST_MAX_ENTRIES) {
							truncated = true;
							break;
						}
						const childPath = join(scopedPath, ent.name);
						let size = null;
						let mtime = null;
						try {
							const cst = await stat(childPath);
							size = cst.size;
							mtime = cst.mtimeMs;
						} catch {
							/* dangling symlink etc. */
						}
						entries.push({
							name: ent.name,
							path: childPath,
							dir: ent.isDirectory(),
							hidden: ent.name.startsWith("."),
							size: size === null ? null : humanSize(size),
							mtime
						});
					}
					entries.sort((a, b) => (a.dir === b.dir ? a.name.localeCompare(b.name) : a.dir ? -1 : 1));
					sendJson(res, 200, {
						sessionId,
						workspaceId: workspace.id,
						path: scopedPath,
						root,
						crumbs: await ancestors(root, scopedPath),
						entries,
						truncated
					});
					return;
				}
				if (action === "read" || action === "download") {
					const st = await stat(scopedPath);
					if (st.isDirectory()) {
						sendJson(res, 400, { error: "is-a-directory", message: "path is a directory" });
						return;
					}
					const downloading = action === "download";
					const text = isText(scopedPath);
					if (!downloading && st.size > (text ? TEXT_MAX : BINARY_MAX)) {
						sendJson(res, 413, { error: "too-large", message: text ? "text file exceeds 2 MB cap" : "binary file exceeds 40 MB cap" });
						return;
					}
					const headers = {
						"content-type": downloading ? "application/octet-stream" : text ? `${mimeOf(scopedPath)}; charset=utf-8` : mimeOf(scopedPath),
						"content-length": String(st.size),
						"cache-control": "no-store",
						"content-disposition": `${downloading ? "attachment" : "inline"}; filename*=UTF-8''${encodeURIComponent(basename(scopedPath))}`
					};
					res.writeHead(200, headers);
					if (req.method === "HEAD") {
						res.end();
						return;
					}
					if (downloading) {
						const stream = createReadStream(scopedPath);
						stream.on("error", (err) => res.destroy(err));
						stream.pipe(res);
					} else {
						res.end(await readFile(scopedPath));
					}
					return;
				}
				sendJson(res, 404, { error: "unknown-action", message: `unknown action: ${action}` });
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
	}), "dsh-mobile-layout: workspace-scoped mobile-files route"));
}
