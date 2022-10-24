import type { preprocess, parse } from 'svelte/compiler'
import type { Plugin } from 'vite'

//@ts-ignore
export type Config = Parameters<Plugin["configResolved"]>[0];
export type Preprocessor = Parameters<typeof preprocess>[1];
export type Ast = ReturnType<typeof parse>
export type ImportMapping = Record<string, ((target: string) => string)>;
export type TypeDeclarationMapping = Record<string, ((target: string) => string)>;

export type ComponentsUserConfig = string | {
    /** 
     * A relative or absolute path to a component, or a directory in which to look for components 
     */
    directory: string,

    /**
     * Which strategy to use for generating Tag names
     * @description
     * - `flat` - Use the CamelCased Component name      
     * - `directory` - Use a CamelCased version of the relative Path to the component    
     * - `namespaced` Use the folders in the relative path to the component as namespaces     
     * @example
     * - flat : `folder/My-Component.svelte` -> `<MyComponent>`
     * - directory : `folder/My-Component.svelte` -> `<FolderMyComponent>`
     * - namespaced : `folder/My-Component.svelte` -> `<Folder.MyComponent>`
     * 
     * @default "namespaced"
     */
    namingStrategy: "flat" | "namespaced" | "directory"

    /** 
     * Prefix for the components in `directory`
     */
    prefix?: string,
}[]

export type ComponentsConfig = {
    /**  ABSOLUTE path to the directory */
    directory: string,
    namingStrategy: "flat" | "namespaced" | "directory"
    prefix: string,
}[]

export type MappingUserConfig = Record<string, string>;
export type MappingConfig = MappingUserConfig;

export type ModuleConfig = Record<string, string[]>;
export type ModuleUserConfig = Record<string, string[] | string>;

export interface AutoimportUserConfig {
    components?: ComponentsUserConfig;
    mapping?: MappingUserConfig,
    module?: ModuleUserConfig,
    include?: string[],
    exclude?: string[]
}

export interface AutoimportConfig {
    /**  A list of places to look for components */
    components: ComponentsConfig,
    /** Some magic strings to import from */
    mapping: MappingConfig,
    /**  A list of modules from which to make imports available */
    module: ModuleConfig
    /** Glob patterns which to include in component search */
    include: string[]
    /** Glob patterns which to exclude when looking for components*/
    exclude: string[]
}