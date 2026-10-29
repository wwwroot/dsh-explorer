import { randomUUID } from 'node:crypto'
import { once } from 'node:events'
import { createWriteStream } from 'node:fs'
import { access, lstat, mkdir, readFile, rename, rm, unlink, writeFile } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
import { invalidateDirectoryCache } from './fs-tree.ts'
import { assertSingleSegmentName, resolveTarget } from './path-security.ts'
import { ExplorerError } from './wire.ts'

export async function createNewFile(dirPath: string, name: string): Promise<{ path: string }> {
  assertSingleSegmentName(name)
  const fullPath = join(dirPath, name)
  try {
    await access(fullPath)
    throw new ExplorerError('already-exists', `file "${name}" already exists`, 409)
  } catch (err) {
    if (err instanceof ExplorerError) throw err
  }
  await writeFile(fullPath, '', { flag: 'wx' })
  invalidateDirectoryCache(dirPath)
  return { path: fullPath }
}

export async function createDirectory(dirPath: string, name: string): Promise<{ path: string }> {
  assertSingleSegmentName(name)
  const fullPath = join(dirPath, name)
  try {
    await access(fullPath)
    throw new ExplorerError('already-exists', `directory "${name}" already exists`, 409)
  } catch (err) {
    if (err instanceof ExplorerError) throw err
  }
  await mkdir(fullPath, { recursive: true })
  invalidateDirectoryCache(dirPath)
  return { path: fullPath }
}

export async function renameEntry(targetPath: string, newName: string): Promise<{ oldPath: string; newPath: string }> {
  assertSingleSegmentName(newName)
  const parent = dirname(targetPath)
  const newPath = join(parent, newName)
  if (targetPath === newPath) return { oldPath: targetPath, newPath }

  try {
    await access(newPath)
    throw new ExplorerError('already-exists', `destination "${newName}" already exists`, 409)
  } catch (err) {
    if (err instanceof ExplorerError) throw err
  }

  await rename(targetPath, newPath)
  invalidateDirectoryCache(parent)
  return { oldPath: targetPath, newPath }
}

export async function removeEntry(targetPath: string): Promise<void> {
  const parent = dirname(targetPath)
  const st = await lstat(targetPath)
  if (st.isDirectory()) {
    await rm(targetPath, { recursive: true, force: true })
  } else {
    await unlink(targetPath)
  }
  invalidateDirectoryCache(parent)
}

export async function readFileText(filePath: string, maxBytes = 1024 * 1024 * 2): Promise<{ text: string; size: number }> {
  const content = await readFile(filePath)
  if (content.length > maxBytes) {
    throw new ExplorerError('payload-too-large', `file exceeds max preview limit of ${maxBytes} bytes`, 413)
  }
  return {
    text: content.toString('utf-8'),
    size: content.length,
  }
}

export async function writeUpload(
  baseDir: string,
  relativePath: string,
  streamChunks: AsyncIterable<Buffer | Uint8Array>,
): Promise<{ path: string; size: number }> {
  if (!relativePath || relativePath.startsWith('/') || relativePath.startsWith('\\')) {
    throw new ExplorerError('bad-request', 'relativePath must stay within upload target', 400)
  }
  const segments = relativePath.split(/[\\/]/)
  if (segments.some(p => !p || p === '.' || p === '..')) {
    throw new ExplorerError('bad-request', 'relativePath contains invalid path traversal segments', 400)
  }
  const target = join(baseDir, ...segments)
  const tmp = join(dirname(target), `.${basename(target)}.dsh-upload-${randomUUID()}.tmp`)
  await mkdir(dirname(target), { recursive: true })

  const writeStream = createWriteStream(tmp, { flags: 'wx' })
  let bytes = 0

  try {
    for await (const chunk of streamChunks) {
      const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
      bytes += buf.length
      if (!writeStream.write(buf)) {
        await once(writeStream, 'drain')
      }
    }
    writeStream.end()
    await once(writeStream, 'finish')
    await rename(tmp, target)
    invalidateDirectoryCache(dirname(target))
    return { path: target, size: bytes }
  } catch (err) {
    writeStream.destroy()
    try { await unlink(tmp) } catch {}
    throw err
  }
}

