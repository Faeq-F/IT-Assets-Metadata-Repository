import { browser } from '$app/environment';
import { onMount } from 'svelte';
import { addTypeOptions } from './makeAsset';

export function injectAssetDivs() {
	onMount(() => {
		if (browser) {
			const typesContainer = document.getElementsByClassName('assetsContainer')[0];
			let storage = { ...localStorage };

			for (const [key, value] of Object.entries(window.localStorage)) {
				if (key.startsWith('Type_')) {
					var child = document.createElement('someuniquetag');

					child.innerHTML =
						'<div class="card assetCard">' +
						key.replace('Type_', '') +
						'<br /><br />Metadata: ' +
						JSON.parse(value).fields +
						'</div>';

					typesContainer.appendChild(child);

					child.outerHTML = child.outerHTML.replace(/<\/?someuniquetag>/, '');
				}
			}

			addTypeOptions();
		}
	});
}
