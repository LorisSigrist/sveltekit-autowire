import { Plugin } from "vite";
import { readFileSync, existsSync, writeFileSync } from 'fs'
import path from 'path'
import type { TsConfigPluginConfig } from "./types.js";

export function overrideTsConfig(pluginConfig: TsConfigPluginConfig): Plugin {

    if(!pluginConfig.tsConfigPath) pluginConfig.tsConfigPath = "./.svelte-kit/tsconfig.json"
    pluginConfig.tsConfigPath = path.resolve(pluginConfig.tsConfigPath);

    function createTsConfig() {
        console.log("TODO: createTsConfig")
    }

    function fixTsConfig() {
        try {
            if(!existsSync(pluginConfig.tsConfigPath)) {
                createTsConfig();
                return;
            }

            const content = readFileSync(pluginConfig.tsConfigPath, { encoding: "utf-8" });
            const config: any = JSON.parse(content);

            if (!Array.isArray(config.include)) throw Error("No valid include field specified in tsconfig")
            
            pluginConfig.includeDTSFiles.forEach(file => {
                if(config.include.includes(file)) return;
                config.include.push(file);
            })

            const tsConfig = JSON.stringify(config);
            writeFileSync(pluginConfig.tsConfigPath, tsConfig, {encoding: "utf-8"})

        } catch (e) {
            console.error(e);
        }
    }

    return {
        name: "autowire-tsconfig",
        configureServer(server) {
            server.watcher
                .add(pluginConfig.tsConfigPath)
                .on("change", fixTsConfig)
                .on('add', fixTsConfig)
                .on("ready", fixTsConfig)

        }
    }
}