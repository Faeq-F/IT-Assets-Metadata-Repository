//@ts-ignore
import { browser } from '$app/environment'; //Does work

import { onMount } from 'svelte';

export function injectAssetDivs() {
	onMount(() => {
		if (browser) {
			const typesContainer = document.getElementsByClassName('assetsContainer')[0];

			for (const [key, value] of Object.entries(window.localStorage)) {
				if (key.startsWith('Asset_')) {
					var child = document.createElement('someuniquetag');

					child.innerHTML =
						'<div class="card assetCard variant-ghost-surface" style="padding: 10px; margin: 10px;"><pre>' +
						key.replace('Asset_', '') +
						'<br /><br />Link: ' +
						JSON.parse(value).link +
						'<br /><br />Type: ' +
						JSON.parse(value).type +
						'<br /><br />Metadata: ' +
						JSON.stringify(JSON.parse(value).metadata, null, '\n') +
						'</pre></div>';

					typesContainer.appendChild(child);

					child.outerHTML = child.outerHTML.replace(/<\/?someuniquetag>/, '');
				}
			}
		}
	});
}
