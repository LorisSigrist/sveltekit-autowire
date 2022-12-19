import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import { autowire } from 'sveltekit-autowire'

const config: UserConfig = {
	plugins: [autowire({
		autoimport: {
			components: [
				{
					directory: './src/lib/myComponents',
					namingStrategy: "namespaced",
					namespace: "Comp"
				},
				{
					directory: './src/lib/nestedComponents',
					namingStrategy: "directory"
				},
				{
					directory: "./src/lib/Icons",
					namingStrategy: "flat",
					namespace: "Icons"
				}
			],
			module: {
				"svelte": ["onMount"],
			}
		}
	}), sveltekit()]
};

export default config;
