// src/config.ts
import z from "@deepseek-ai/schemastery";
var Config = z.object({
  maxListingEntries: z.natural().default(2e3),
  defaultCompactFolders: z.boolean().default(true)
});

// src/fs-watch.ts
import { watch } from "node:fs";

// src/fs-tree.ts
import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";

// src/wire.ts
var ExplorerError = class extends Error {
  code;
  status;
  constructor(code, message, status = 400) {
    super(message);
    this.name = "ExplorerError";
    this.code = code;
    this.status = status;
  }
};
function writeJson(res, data, status = 200) {
  const payload = JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(payload),
    "Cache-Control": "no-store"
  });
  res.end(payload);
}
function writeOk(res, data = {}) {
  writeJson(res, { ok: true, ...data });
}
function writeError(res, error) {
  if (error instanceof ExplorerError) {
    writeJson(res, { ok: false, code: error.code, message: error.message }, error.status);
    return;
  }
  const message = error instanceof Error ? error.message : String(error);
  writeJson(res, { ok: false, code: "internal-error", message }, 500);
}
async function readJsonBody(req, limitBytes = 10 * 1024 * 1024) {
  const text = await readTextBody(req, limitBytes);
  if (!text.trim()) {
    throw new ExplorerError("bad-request", "empty request body", 400);
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new ExplorerError("bad-request", "invalid json body", 400);
  }
}
async function readTextBody(req, limitBytes = 10 * 1024 * 1024) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buf.length;
    if (size > limitBytes) {
      throw new ExplorerError("payload-too-large", `request body exceeded ${limitBytes} bytes`, 413);
    }
    chunks.push(buf);
  }
  return Buffer.concat(chunks).toString("utf-8");
}

// src/fs-tree.ts
function compareEntries(a, b) {
  if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
  const la = a.name.toLowerCase();
  const lb = b.name.toLowerCase();
  if (la !== lb) return la < lb ? -1 : 1;
  if (a.name === b.name) return 0;
  return a.name < b.name ? -1 : 1;
}
var directoryCache = /* @__PURE__ */ new Map();
var DIRECTORY_CACHE_TTL_MS = 300;
function invalidateDirectoryCache(_dir) {
  directoryCache.clear();
}
async function listDirectory(dirPath, maxEntries = 2e3) {
  const now = Date.now();
  const key = `${dirPath}\0${maxEntries}`;
  const cached = directoryCache.get(key);
  if (cached && now - cached.at < DIRECTORY_CACHE_TTL_MS) {
    return cached.listing;
  }
  let dirEnts;
  try {
    dirEnts = await readdir(dirPath, { withFileTypes: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new ExplorerError("not-found", `cannot read directory "${dirPath}": ${message}`, 404);
  }
  const entries = [];
  const truncated = dirEnts.length > maxEntries;
  const slice = truncated ? dirEnts.slice(0, maxEntries) : dirEnts;
  for (const dirent of slice) {
    const name2 = dirent.name;
    const fullPath = join(dirPath, name2);
    const isSymlink = dirent.isSymbolicLink();
    let isDir = dirent.isDirectory();
    let broken = false;
    if (isSymlink) {
      try {
        const targetStat = await stat(fullPath);
        isDir = targetStat.isDirectory();
      } catch {
        broken = true;
      }
    }
    const hidden = name2.startsWith(".");
    let compact = false;
    let compactName = void 0;
    let compactPath = void 0;
    let compactChain = void 0;
    if (isDir && !isSymlink) {
      try {
        let currPath = fullPath;
        const chain = [{ name: name2, path: fullPath }];
        let depth = 0;
        while (depth < 6) {
          const sub = await readdir(currPath, { withFileTypes: true });
          const visibleSub = sub.filter((s) => !s.name.startsWith("."));
          if (visibleSub.length === 1 && visibleSub[0].isDirectory() && !visibleSub[0].isSymbolicLink()) {
            const childName = visibleSub[0].name;
            currPath = join(currPath, childName);
            chain.push({ name: childName, path: currPath });
            depth++;
          } else {
            break;
          }
        }
        if (chain.length > 1) {
          compact = true;
          compactName = chain.map((c) => c.name).join("/");
          compactPath = currPath;
          compactChain = chain;
        }
      } catch {
      }
    }
    entries.push({
      name: name2,
      path: fullPath,
      isDir,
      hidden,
      isSymlink,
      broken,
      compact,
      compactName,
      compactPath,
      compactChain
    });
  }
  entries.sort(compareEntries);
  const listing = {
    path: dirPath,
    entries,
    truncated
  };
  directoryCache.set(key, { at: now, listing });
  return listing;
}
async function listDirectoryBatch(paths, maxEntriesPerDir = 1e3) {
  const result = {};
  await Promise.all(
    paths.map(async (p) => {
      try {
        result[p] = await listDirectory(p, maxEntriesPerDir);
      } catch {
      }
    })
  );
  return result;
}

// src/fs-watch.ts
var dirWatchers = /* @__PURE__ */ new Map();
function normalizeDirPath(d) {
  return d.replace(/\\/g, "/").replace(/\/+$/, "").toLowerCase();
}
function subscribeToDir(dir, subscriber) {
  const norm = normalizeDirPath(dir);
  let entry = dirWatchers.get(norm);
  if (!entry) {
    try {
      const watcher = watch(dir, { recursive: true }, (eventType, filename) => {
        invalidateDirectoryCache();
        const payload = {
          event: eventType,
          filename: filename ? String(filename) : void 0,
          timestamp: Date.now()
        };
        const current = dirWatchers.get(norm);
        if (current) {
          for (const sub of current.subscribers) {
            try {
              sub.send(payload);
            } catch {
            }
          }
        }
      });
      entry = { watcher, subscribers: /* @__PURE__ */ new Set() };
      dirWatchers.set(norm, entry);
    } catch (err) {
      console.warn("[dsh-explorer] recursive watch failed on", dir, err);
    }
  }
  if (entry) {
    entry.subscribers.add(subscriber);
  }
  return () => {
    if (entry) {
      entry.subscribers.delete(subscriber);
      if (entry.subscribers.size === 0) {
        try {
          entry.watcher.close();
        } catch {
        }
        dirWatchers.delete(norm);
      }
    }
  };
}
function createFsWatcherServer() {
  let wssPromise = null;
  const getWss = async () => {
    if (!wssPromise) {
      wssPromise = (async () => {
        try {
          const wsModule = await import("ws");
          const Server = wsModule.WebSocketServer ?? wsModule.default?.WebSocketServer;
          if (!Server) return null;
          const server = new Server({ noServer: true });
          server.on("connection", (ws, req) => {
            const url = new URL(req.url ?? "/", "http://localhost");
            const dir = url.searchParams.get("dir");
            if (!dir) {
              ws.close(1008, "missing dir parameter");
              return;
            }
            const subscriber = {
              send: (data) => {
                if (ws.readyState === 1) {
                  ws.send(JSON.stringify(data));
                }
              },
              close: () => {
                try {
                  ws.close();
                } catch {
                }
              }
            };
            const unsubscribe = subscribeToDir(dir, subscriber);
            ws.on("close", () => {
              unsubscribe();
            });
          });
          return server;
        } catch {
          return null;
        }
      })();
    }
    return wssPromise;
  };
  return {
    handleSse: (req, res, dir) => {
      res.writeHead(200, {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*"
      });
      res.write(`data: ${JSON.stringify({ type: "connected", dir, timestamp: Date.now() })}

`);
      const subscriber = {
        send: (data) => {
          try {
            res.write(`data: ${JSON.stringify(data)}

`);
          } catch {
          }
        },
        close: () => {
          try {
            res.end();
          } catch {
          }
        }
      };
      const unsubscribe = subscribeToDir(dir, subscriber);
      req.on("close", () => {
        unsubscribe();
      });
    },
    handleUpgrade: (req, socket, head) => {
      getWss().then((server) => {
        if (server) {
          server.handleUpgrade(req, socket, head, (ws) => {
            server.emit("connection", ws, req);
          });
        } else {
          socket.destroy();
        }
      }).catch(() => {
        socket.destroy();
      });
    },
    close: () => {
      for (const entry of dirWatchers.values()) {
        for (const sub of entry.subscribers) {
          sub.close();
        }
        try {
          entry.watcher.close();
        } catch {
        }
      }
      dirWatchers.clear();
      if (wssPromise) {
        wssPromise.then((server) => {
          try {
            server?.close();
          } catch {
          }
        });
      }
    }
  };
}

// src/fs-operations.ts
import { randomUUID } from "node:crypto";
import { once } from "node:events";
import { createWriteStream } from "node:fs";
import { access, lstat, mkdir, readFile, rename, rm, unlink, writeFile } from "node:fs/promises";
import { basename, dirname, join as join2 } from "node:path";

// src/path-security.ts
import { homedir } from "node:os";
import { isAbsolute, normalize, resolve } from "node:path";
function resolveTarget(cwd, targetPath) {
  if (!targetPath) return cwd;
  if (targetPath === "~" || targetPath.startsWith("~/") || targetPath.startsWith("~\\")) {
    const home = homedir();
    return normalize(resolve(home, targetPath.slice(targetPath.startsWith("~") ? targetPath[1] ? 2 : 1 : 0)));
  }
  if (isAbsolute(targetPath)) {
    return normalize(targetPath);
  }
  return normalize(resolve(cwd, targetPath));
}
function assertSingleSegmentName(name2) {
  if (!name2 || name2 === "." || name2 === ".." || name2.includes("/") || name2.includes("\\")) {
    throw new ExplorerError("bad-request", "name must be a single path segment without separators", 400);
  }
}

// src/fs-operations.ts
async function createNewFile(dirPath, name2) {
  assertSingleSegmentName(name2);
  const fullPath = join2(dirPath, name2);
  try {
    await access(fullPath);
    throw new ExplorerError("already-exists", `file "${name2}" already exists`, 409);
  } catch (err) {
    if (err instanceof ExplorerError) throw err;
  }
  await writeFile(fullPath, "", { flag: "wx" });
  invalidateDirectoryCache(dirPath);
  return { path: fullPath };
}
async function createDirectory(dirPath, name2) {
  assertSingleSegmentName(name2);
  const fullPath = join2(dirPath, name2);
  try {
    await access(fullPath);
    throw new ExplorerError("already-exists", `directory "${name2}" already exists`, 409);
  } catch (err) {
    if (err instanceof ExplorerError) throw err;
  }
  await mkdir(fullPath, { recursive: true });
  invalidateDirectoryCache(dirPath);
  return { path: fullPath };
}
async function renameEntry(targetPath, newName) {
  assertSingleSegmentName(newName);
  const parent = dirname(targetPath);
  const newPath = join2(parent, newName);
  if (targetPath === newPath) return { oldPath: targetPath, newPath };
  try {
    await access(newPath);
    throw new ExplorerError("already-exists", `destination "${newName}" already exists`, 409);
  } catch (err) {
    if (err instanceof ExplorerError) throw err;
  }
  await rename(targetPath, newPath);
  invalidateDirectoryCache(parent);
  return { oldPath: targetPath, newPath };
}
async function removeEntry(targetPath) {
  const parent = dirname(targetPath);
  const st = await lstat(targetPath);
  if (st.isDirectory()) {
    await rm(targetPath, { recursive: true, force: true });
  } else {
    await unlink(targetPath);
  }
  invalidateDirectoryCache(parent);
}
async function readFileText(filePath, maxBytes = 1024 * 1024 * 2) {
  const content = await readFile(filePath);
  if (content.length > maxBytes) {
    throw new ExplorerError("payload-too-large", `file exceeds max preview limit of ${maxBytes} bytes`, 413);
  }
  return {
    text: content.toString("utf-8"),
    size: content.length
  };
}
async function writeUpload(baseDir, relativePath, streamChunks) {
  if (!relativePath || relativePath.startsWith("/") || relativePath.startsWith("\\")) {
    throw new ExplorerError("bad-request", "relativePath must stay within upload target", 400);
  }
  const segments = relativePath.split(/[\\/]/);
  if (segments.some((p) => !p || p === "." || p === "..")) {
    throw new ExplorerError("bad-request", "relativePath contains invalid path traversal segments", 400);
  }
  const target = join2(baseDir, ...segments);
  const tmp = join2(dirname(target), `.${basename(target)}.dsh-upload-${randomUUID()}.tmp`);
  await mkdir(dirname(target), { recursive: true });
  const writeStream = createWriteStream(tmp, { flags: "wx" });
  let bytes = 0;
  try {
    for await (const chunk of streamChunks) {
      const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      bytes += buf.length;
      if (!writeStream.write(buf)) {
        await once(writeStream, "drain");
      }
    }
    writeStream.end();
    await once(writeStream, "finish");
    await rename(tmp, target);
    invalidateDirectoryCache(dirname(target));
    return { path: target, size: bytes };
  } catch (err) {
    writeStream.destroy();
    try {
      await unlink(tmp);
    } catch {
    }
    throw err;
  }
}

// src/git-status.ts
import { execFile } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { join as join3, relative } from "node:path";
import { promisify } from "node:util";
var execFileAsync = promisify(execFile);
var gitCache = /* @__PURE__ */ new Map();
var GIT_CACHE_TTL_MS = 2e3;
var IGNORED_SCAN_DIRS = /* @__PURE__ */ new Set([
  "node_modules",
  ".agent",
  ".git",
  "dist",
  "target",
  "build",
  ".system_generated",
  ".cache",
  ".dsh",
  ".gemini",
  ".vscode",
  ".idea"
]);
function parsePorcelainLines(stdout, prefix = "") {
  let branch;
  const entries = [];
  for (const rawLine of stdout.split("\n")) {
    const line = rawLine.replace(/\r$/, "");
    if (!line) continue;
    if (line.startsWith("## ")) {
      const branchMatch = line.slice(3).match(/^([^.\s]+)/);
      if (branchMatch) branch = branchMatch[1];
      continue;
    }
    if (line.length < 4) continue;
    const xy = line.slice(0, 2);
    let p = line.slice(3).trim();
    if (p.startsWith('"') && p.endsWith('"')) {
      p = p.slice(1, -1);
    }
    if (xy.startsWith("R") || xy.endsWith("R")) {
      const arrowIdx = p.indexOf(" -> ");
      if (arrowIdx !== -1) {
        p = p.slice(arrowIdx + 4).trim();
        if (p.startsWith('"') && p.endsWith('"')) {
          p = p.slice(1, -1);
        }
      }
    }
    const cleanPath = p.replace(/\\/g, "/");
    const finalPath = prefix ? `${prefix.replace(/\\/g, "/").replace(/\/+$/, "")}/${cleanPath}` : cleanPath;
    entries.push({ path: finalPath, xy });
  }
  return { branch, entries };
}
function findSubRepos(root, depth = 1, maxDepth = 3) {
  if (depth > maxDepth) return [];
  const repos = [];
  try {
    const entries = readdirSync(root, { withFileTypes: true });
    for (const ent of entries) {
      if (!ent.isDirectory() || ent.name.startsWith(".") || IGNORED_SCAN_DIRS.has(ent.name)) {
        continue;
      }
      const full = join3(root, ent.name);
      if (existsSync(join3(full, ".git"))) {
        repos.push(full);
      } else {
        repos.push(...findSubRepos(full, depth + 1, maxDepth));
      }
    }
  } catch {
  }
  return repos;
}
async function getGitStatus(cwd) {
  const now = Date.now();
  const cached = gitCache.get(cwd);
  if (cached && now - cached.at < GIT_CACHE_TTL_MS) {
    return cached.data;
  }
  try {
    const { stdout } = await execFileAsync(
      "git",
      ["status", "--porcelain", "-b", "-unormal", "--ignored=matching"],
      { cwd, maxBuffer: 10 * 1024 * 1024, timeout: 3500 }
    );
    const parsed = parsePorcelainLines(stdout);
    const data = {
      isRepo: true,
      branch: parsed.branch,
      entries: parsed.entries
    };
    gitCache.set(cwd, { at: now, data });
    return data;
  } catch {
  }
  try {
    const subRepos = findSubRepos(cwd);
    if (subRepos.length > 0) {
      const allEntries = [];
      const subResults = await Promise.all(
        subRepos.map(async (repoDir) => {
          const rel = relative(cwd, repoDir).replace(/\\/g, "/");
          try {
            const { stdout } = await execFileAsync(
              "git",
              ["status", "--porcelain", "-b", "-unormal", "--ignored=matching"],
              { cwd: repoDir, maxBuffer: 5 * 1024 * 1024, timeout: 3e3 }
            );
            return parsePorcelainLines(stdout, rel).entries;
          } catch {
            return [];
          }
        })
      );
      for (const res of subResults) {
        allEntries.push(...res);
      }
      const data = {
        isRepo: true,
        entries: allEntries
      };
      gitCache.set(cwd, { at: now, data });
      return data;
    }
  } catch {
  }
  const fallback = { isRepo: false, entries: [] };
  gitCache.set(cwd, { at: now, data: fallback });
  return fallback;
}

// src/session-path.ts
import { homedir as homedir2 } from "node:os";
function resolveSessionCwd(ctx, sessionId) {
  try {
    const sessionService = ctx.get("sessions") ?? ctx.sessions;
    if (sessionService) {
      if (sessionId) {
        const direct = sessionService.get?.(sessionId);
        if (direct?.header?.cwd) return direct.header.cwd;
        if (direct?.cwd) return direct.cwd;
        if (direct?.workingDirectory) return direct.workingDirectory;
      }
      if (typeof sessionService.list === "function") {
        const all = sessionService.list();
        for (let i = all.length - 1; i >= 0; i--) {
          const s = all[i];
          if (s?.header?.cwd) return s.header.cwd;
          if (s?.cwd) return s.cwd;
          if (s?.workingDirectory) return s.workingDirectory;
        }
      }
    }
  } catch {
  }
  return homedir2();
}

// src/index.ts
var name = "dsh-explorer";
var inject = ["webServer", "sessions"];
function apply(ctx, config) {
  const watcher = createFsWatcherServer();
  ctx.effect(() => {
    return () => {
      watcher.close();
    };
  });
  ctx.effect(() => {
    return ctx.webServer.registerUpgrade({
      path: "/dsh-explorer/api/watch",
      handler: (req, socket, head) => {
        watcher.handleUpgrade(req, socket, head);
        return true;
      }
    });
  });
  ctx.effect(() => {
    return ctx.webServer.register({
      kind: "prefix",
      path: "/dsh-explorer/api",
      handler: async (req, res) => {
        const url = new URL(req.url ?? "/", "http://localhost");
        const pathname = url.pathname;
        try {
          if (pathname === "/dsh-explorer/api/events") {
            const sessionId = url.searchParams.get("sessionId") ?? void 0;
            const cwd = resolveSessionCwd(ctx, sessionId);
            const dirParam = url.searchParams.get("dir");
            const targetDir = resolveTarget(cwd, dirParam ?? cwd);
            watcher.handleSse(req, res, targetDir);
            return true;
          }
          if (pathname === "/dsh-explorer/api/tree") {
            const sessionId = url.searchParams.get("sessionId") ?? void 0;
            const cwd = resolveSessionCwd(ctx, sessionId);
            const dirParam = url.searchParams.get("dir");
            const targetDir = resolveTarget(cwd, dirParam ?? cwd);
            const max = config?.maxListingEntries ?? 2e3;
            const listing = await listDirectory(targetDir, max);
            writeOk(res, { listing });
            return true;
          }
          if (pathname === "/dsh-explorer/api/batch-tree" && req.method === "POST") {
            const body = await readJsonBody(req);
            if (!Array.isArray(body?.paths)) {
              throw new ExplorerError("bad-request", "paths must be an array", 400);
            }
            const results = await listDirectoryBatch(body.paths);
            writeOk(res, { results });
            return true;
          }
          if (pathname === "/dsh-explorer/api/git-status") {
            const sessionId = url.searchParams.get("sessionId") ?? void 0;
            const cwd = resolveSessionCwd(ctx, sessionId);
            const dirParam = url.searchParams.get("dir");
            const targetDir = resolveTarget(cwd, dirParam ?? cwd);
            const git = await getGitStatus(targetDir);
            writeOk(res, { git });
            return true;
          }
          if (pathname === "/dsh-explorer/api/read-file") {
            const pathParam = url.searchParams.get("path");
            if (!pathParam) {
              throw new ExplorerError("bad-request", "missing path parameter", 400);
            }
            const data = await readFileText(pathParam);
            writeOk(res, data);
            return true;
          }
          if (pathname === "/dsh-explorer/api/new-file" && req.method === "POST") {
            const body = await readJsonBody(req);
            const created = await createNewFile(body.dir, body.name);
            writeOk(res, created);
            return true;
          }
          if (pathname === "/dsh-explorer/api/mkdir" && req.method === "POST") {
            const body = await readJsonBody(req);
            const created = await createDirectory(body.dir, body.name);
            writeOk(res, created);
            return true;
          }
          if (pathname === "/dsh-explorer/api/rename" && req.method === "POST") {
            const body = await readJsonBody(req);
            const renamed = await renameEntry(body.path, body.newName);
            writeOk(res, renamed);
            return true;
          }
          if (pathname === "/dsh-explorer/api/delete" && req.method === "POST") {
            const body = await readJsonBody(req);
            await removeEntry(body.path);
            writeOk(res);
            return true;
          }
          if (pathname === "/dsh-explorer/api/upload" && req.method === "POST") {
            const dirParam = url.searchParams.get("dir");
            const relParam = url.searchParams.get("relativePath");
            if (!dirParam || !relParam) {
              throw new ExplorerError("bad-request", "dir and relativePath are required", 400);
            }
            const uploaded = await writeUpload(dirParam, relParam, req);
            writeOk(res, uploaded);
            return true;
          }
          writeJson(res, { ok: false, message: "Not found" }, 404);
          return true;
        } catch (err) {
          writeError(res, err);
          return true;
        }
      }
    });
  });
}
export {
  Config,
  apply,
  inject,
  name
};
