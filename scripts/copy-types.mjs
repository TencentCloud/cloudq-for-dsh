import { copyFile, mkdir } from 'node:fs/promises'

await mkdir(new URL('../lib/types/client/', import.meta.url), { recursive: true })
await copyFile(new URL('../src/index.d.ts', import.meta.url), new URL('../lib/types/index.d.ts', import.meta.url))
await copyFile(new URL('../src/client/index.d.ts', import.meta.url), new URL('../lib/types/client/index.d.ts', import.meta.url))
