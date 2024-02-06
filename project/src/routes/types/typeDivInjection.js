import { browser } from '$app/environment';
import { onMount } from 'svelte';

export function injectTypeDivs() {
	onMount(() => {
		if (browser) {
			const typesContainer = document.getElementsByClassName('typesContainer')[0];
			let storage = { ...localStorage };

			for (const [key, value] of Object.entries(window.localStorage)) {
				if (key.startsWith('Type_')) {
					var child = document.createElement('someuniquetag');

					child.innerHTML =
						'<div class="card typeCard">' +
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
