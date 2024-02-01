import { browser } from '$app/environment';
import { onMount } from 'svelte';

export function injectTypeDivs() {
	//JSON.stringify(localStorage)
	onMount(() => {
		if (browser) {
			const typesContainer = document.getElementsByClassName('typesContainer')[0];
			console.log(typesContainer);
			let storage = { ...localStorage };
			console.log(storage);

			for (const [key, value] of Object.entries(window.localStorage)) {
				console.log(key, JSON.parse(value));

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
			console.log(typesContainer);
		}
	});
}
