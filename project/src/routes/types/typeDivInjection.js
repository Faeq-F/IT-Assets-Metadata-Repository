//@ts-ignore
import { browser } from '$app/environment'; //Does work
import { onMount } from 'svelte';

export function injectTypeDivs() {
	onMount(() => {
		if (browser) {
			const typesContainer = document.getElementsByClassName('typesContainer')[0];

			for (const [key, value] of Object.entries(window.localStorage)) {
				if (key.startsWith('Type_')) {
					var child = document.createElement('someuniquetag');

					child.innerHTML =
						'<div class="card assetCard variant-ghost-surface" style="padding: 10px; margin: 10px;">' +
						key.replace('Type_', '') +
						'<br /><br />Fields required: ' +
						JSON.parse(value).fields +
						'</div>';

					typesContainer.appendChild(child);

					child.outerHTML = child.outerHTML.replace(/<\/?someuniquetag>/, '');
				}
			}
		}
	});
}
