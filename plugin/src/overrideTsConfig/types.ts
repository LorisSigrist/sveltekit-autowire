export interface TsConfigPluginConfig {
    /**
     * A list of d.ts files that should also be included in sveltekit's tsconfig
     */
    includeDTSFiles: string[],
    /**
     * The path to sveltekits tsconfig file
     * Usually this is `./.svelte-kit/tsconfig.json`
     */
    tsConfigPath?: string
}