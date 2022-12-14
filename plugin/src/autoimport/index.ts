import { createFilter } from '@rollup/pluginutils';
import type { Plugin } from 'vite'
import { enforcePluginOrdering, resolveSvelteConfig } from './lib/configHelpers.js';
import type { ImportMapping, AutoimportUserConfig, TypeDeclarationMapping } from './types.js';
import { genrateAST } from './lib/transformHelpers.js';
import { transformCode } from './lib/transformCode.js';
import { createMapping } from './lib/importMapping/createMapping.js';
import { standardizeConfing } from './lib/config/standardizedConfig.js';
import { writeTypeDeclarations } from './lib/writeTypeDeclarations.js';
import { type  Config as SvelteConfig } from '@sveltejs/kit';

export default function autowire(userConfig: AutoimportUserConfig = {}): Plugin {

  const { components, mapping, module, include, exclude } = standardizeConfing(userConfig)

  const filter = createFilter(include, [
    ...exclude,
    '**/node_modules/**',
    '**/.git/**',
    '**/.svelte-kit/**',
    '**/.svelte/**'
  ]);

  /* The directories in which componenty may be present. Watch these for changes */
  const componentPaths: any[] = components.map(comp => comp.directory);

  let importMapping: ImportMapping = {};
  let svelteConfig : SvelteConfig;

  function updateMapping() {
    let componentTypeDeclarations : TypeDeclarationMapping; 
    [importMapping, componentTypeDeclarations] = createMapping(components, module, mapping, filter);
    writeTypeDeclarations(componentTypeDeclarations);
  }


  return {
    name: 'sveltekit-autowire',

    enforce: 'pre',

    // Must be processed before vite-plugin-svelte
    async configResolved(config) {
      enforcePluginOrdering(config.plugins);
      svelteConfig = await resolveSvelteConfig(config);
      updateMapping();
    },

    async transform(code, filename) {
      if (!filter(filename)) return;
      const ast = await genrateAST(code, svelteConfig.preprocess, filename)
      const result = transformCode(code, ast, filename, importMapping);
      return result;
    },

    configureServer(server) {
      if (componentPaths.length) {
        server.watcher
          .add(componentPaths)
          .on('add', updateMapping)
          .on('unlink', updateMapping)
          .on('ready', updateMapping)
      }
    }
  }
}
