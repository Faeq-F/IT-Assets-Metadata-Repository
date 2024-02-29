// @ts-check
import { join } from 'path';
import forms from '@tailwindcss/forms';

// 1. Import the Skeleton plugin
import { skeleton } from '@skeletonlabs/tw-plugin';

/** @type {import('tailwindcss').Config} */
export default {
	// 2. Opt for dark mode to be handled via the class method
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		// 3. Append the path to the Skeleton package
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {},
		colors: {
			modern: {
				50: '#ffffff',
				100: '#F2F0FF',
				200: '#E4E0FF',
				300: '#DCD6FF',
				400: '#CEC7FF',
				500: '#C2B8FF',
				600: '#7661FF',
				700: '#2B0AFF',
				800: '#1700AD',
				900: '#0C0057',
				950: '#06002E'
			}
		}
	},
	plugins: [
		forms,
		// 4. Append the Skeleton plugin (after other plugins)
		skeleton({
			themes: {
				custom: [],
				preset: [
					{
						name: 'modern',
						enhancements: true
					}
				]
			}
		})
	]
};
