//@ts-ignore
import { browser } from '$app/environment'; //Does work

import { onMount } from 'svelte';

export function addTypeOptions() {
	onMount(() => {
		if (browser) {
			var typeList = document.getElementById('assetType');
			var metadataForm = document.getElementById('metadataForm');

			// @ts-ignore
			for (const [key] of Object.entries(window.localStorage)) {
				if (key.startsWith('Type_')) {
					var child = document.createElement('someuniquetag');

					child.innerHTML = '<option>' + key.replace('Type_', '') + '</option>';

					if (typeList) typeList.appendChild(child);

					child.outerHTML = child.outerHTML.replace(/<\/?someuniquetag>/, '');
				}
			}

			if (typeList) {
				// eslint-disable-line no-unused-vars
				typeList.addEventListener('change', () => {
					if (metadataForm) metadataForm.innerHTML = '';

					var selectedOption = (typeList as HTMLSelectElement).options[
						(typeList as HTMLSelectElement).selectedIndex
					].text;
					let metadataKeys = JSON.parse(
						window.localStorage.getItem('Type_' + selectedOption) || ''
					).fields;

					for (let i in metadataKeys) {
						var child = document.createElement('someuniquetag');

						child.innerHTML =
							'<label for="' +
							metadataKeys[i] +
							'" class="formlabel"><p>' +
							metadataKeys[i] +
							':</p></label>';

						if (metadataForm) metadataForm.appendChild(child);

						child.outerHTML = child.outerHTML.replace(/<\/?someuniquetag>/, '');

						child = document.createElement('someuniquetag');

						child.innerHTML =
							'<input type="text" class="input w-96" id="' +
							metadataKeys[i] +
							'" name="' +
							metadataKeys[i] +
							'" /><br /><br />';

						if (metadataForm) metadataForm.appendChild(child);

						child.outerHTML = child.outerHTML.replace(/<\/?someuniquetag>/, '');
					}
				});
			}
		}
	});
}
