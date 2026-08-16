/**
 * dsh-mobile-layout, node half.
 *
 * Registers one read-only HTTP surface for the mobile file browser:
 *   GET /mobile-files/list?path=<abs>   — directory listing + ancestor crumbs
 *   GET /mobile-files/read?path=<abs>   — file content (text/images/pdf/binary)
 *
 * The row itself also makes the package appear in the host Loader so the
 * client-modules registry discovers its `dsh.client` half.
 *
 * Security: every path must resolve (realpath) inside one of the configured
 * `roots` allowlist entries. Read-only, size-capped, no-cache.
 *
 * Zero @deepseek-ai dependencies on purpose (profile plugin iron rule).
 */
import { opendir, readFile, realpath, stat } from "node:fs/promises";
import { basename, dirname, extname, join, sep } from "node:path";

const TEXT_MAX = 2_000_000; // 2 MB: enough for any source file
const BINARY_MAX = 40_000_000; // 40 MB: images/PDFs
const LIST_MAX_ENTRIES = 2000;

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

export const name = "dsh-mobile-layout";
export const inject = ["webServer"];

export function apply(ctx, config) {
	const roots = Array.isArray(config?.roots) ? config.roots.filter((r) => typeof r === "string" && r) : [];
	const defaultPath = typeof config?.defaultPath === "string" && config.defaultPath ? config.defaultPath : roots[0];

	/** Realpath-check a path and return its containing root (or null). */
	const matchingRoot = async (p) => {
		let real;
		try {
			real = await realpath(p);
		} catch {
			return null;
		}
		for (const root of roots) {
			const rr = await realpath(root).catch(() => null);
			if (rr && (real === rr || real.startsWith(rr.endsWith(sep) ? rr : rr + sep))) return root;
		}
		return null;
	};

	ctx.effect(() => ctx.webServer.register({
		kind: "prefix",
		path: "/mobile-files",
		handler: async (req, res) => {
			if (req.method !== "GET" && req.method !== "HEAD") {
				res.writeHead(405);
				res.end();
				return;
			}
			const u = new URL(req.url ?? "/", "http://x");
			const action = u.pathname.replace(/^\/mobile-files\/?/, "") || "list";
			let rawPath = u.searchParams.get("path") ?? "";
			if (!rawPath) rawPath = defaultPath ?? "";
			if (!rawPath || !rawPath.startsWith("/") || rawPath.includes("\0")) {
				sendJson(res, 400, { error: "bad-path", message: "path must be an absolute path" });
				return;
			}
			const root = await matchingRoot(rawPath);
			if (!root) {
				sendJson(res, 403, { error: "forbidden", message: "path is outside the configured roots" });
				return;
			}
			try {
				if (action === "list") {
					const st = await stat(rawPath);
					if (!st.isDirectory()) {
						sendJson(res, 400, { error: "not-a-directory", message: "path is not a directory" });
						return;
					}
					const dir = await opendir(rawPath);
					const entries = [];
					let truncated = false;
					for await (const ent of dir) {
						if (entries.length >= LIST_MAX_ENTRIES) {
							truncated = true;
							break;
						}
						const childPath = join(rawPath, ent.name);
						let size = null;
						let mtime = null;
						try {
							const cst = await stat(childPath);
							size = cst.size;
							mtime = cst.mtimeMs;
						} catch {
							// dangling symlink etc. — keep the entry without metadata
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
						path: rawPath,
						root,
						defaultPath: defaultPath ?? null,
						crumbs: await ancestors(root, rawPath),
						entries,
						truncated
					});
					return;
				}
				if (action === "read") {
					const st = await stat(rawPath);
					if (st.isDirectory()) {
						sendJson(res, 400, { error: "is-a-directory", message: "path is a directory" });
						return;
					}
					const text = isText(rawPath);
					if (st.size > (text ? TEXT_MAX : BINARY_MAX)) {
						sendJson(res, 413, { error: "too-large", message: text ? "text file exceeds 2 MB cap" : "binary file exceeds 40 MB cap" });
						return;
					}
					const body = await readFile(rawPath);
					const headers = {
						"content-type": text ? `${mimeOf(rawPath)}; charset=utf-8` : mimeOf(rawPath),
						"content-length": String(body.length),
						"cache-control": "no-cache",
						"content-disposition": text ? "inline" : "inline; filename*=UTF-8''" + encodeURIComponent(basename(rawPath))
					};
					res.writeHead(200, headers);
					res.end(req.method === "HEAD" ? undefined : body);
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
	}), "dsh-mobile-layout: mobile-files route");
}
