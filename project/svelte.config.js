import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

/**
 * This will add autocompletion if you're working with SvelteKit
 * @type {import('@sveltejs/kit').Config}
 */
const config = {
	extensions: ['.svelte'],
	preprocess: [
		preprocess({
			// ...svelte-preprocess options
		}),
		vitePreprocess({})
	],
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		csp: {
			directives: {
				'script-src': ['self']
			},
			reportOnly: {
				'script-src': ['self']
			}
		}
	}
};

export default config;
