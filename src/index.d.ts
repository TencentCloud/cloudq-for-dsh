import type { Context } from '@deepseek-ai/cordis'

/** CloudQ currently has no persisted Cordis configuration fields. */
export type Config = Record<string, never>

/** Cordis services required by the CloudQ host plugin. */
export declare const inject: readonly ['skills', 'webServer', 'settings', 'sessionQuery']

/** Runtime configuration schema exported for Cordis. */
export declare const Config: unknown

/** Register the CloudQ skill, settings sections, and loopback HTTP routes. */
export declare function apply(ctx: Context, config?: Config): void
