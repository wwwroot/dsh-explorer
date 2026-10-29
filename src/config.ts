import z from '@deepseek-ai/schemastery'

export interface ExplorerConfig {
  maxListingEntries?: number
  defaultCompactFolders?: boolean
}

export const Config = z.object({
  maxListingEntries: z.natural().default(2000),
  defaultCompactFolders: z.boolean().default(true),
})
