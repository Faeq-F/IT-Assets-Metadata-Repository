import { browser } from '$app/environment';
import { onMount } from 'svelte';

export function addTypeOptions() {
	onMount(() => {
		if (browser) {
			var typeList = document.getElementById('assetType');
			var metadataForm = document.getElementById('metadataForm');

			// @ts-ignore
			for (const [key, value] of Object.entries(window.localStorage)) {
				if (key.startsWith('Type_')) {
					var child = document.createElement('someuniquetag');

					child.innerHTML = '<option>' + key.replace('Type_', '') + '</option>';

					if (typeList) typeList.appendChild(child);

					child.outerHTML = child.outerHTML.replace(/<\/?someuniquetag>/, '');
				}
			}

			if (typeList) {
				// @ts-ignore
				typeList.addEventListener('change', (event) => {
					if (metadataForm) metadataForm.innerHTML = '';
					// @ts-ignore
					var selectedOption = typeList.options[typeList.selectedIndex].text;
					let metadataKeys = JSON.parse(
						window.localStorage.getItem('Type_' + selectedOption) || ''
					).fields;

					for (let i in metadataKeys) {
						var child = document.createElement('someuniquetag');

						child.innerHTML =
							'<label for="' +
							metadataKeys[i] +
							'" class="formlabel">' +
							metadataKeys[i] +
							': </label>';

						if (metadataForm) metadataForm.appendChild(child);

						child.outerHTML = child.outerHTML.replace(/<\/?someuniquetag>/, '');

						child = document.createElement('someuniquetag');

						child.innerHTML =
							'<input type="text" id="' +
							metadataKeys[i] +
							'" name="' +
							metadataKeys[i] +
							'" /><br />';

						if (metadataForm) metadataForm.appendChild(child);

						child.outerHTML = child.outerHTML.replace(/<\/?someuniquetag>/, '');
					}
				});
			}
		}
	});
}
