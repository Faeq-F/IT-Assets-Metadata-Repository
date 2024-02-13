//@ts-ignore
import { browser } from '$app/environment'; //Does work
import { onMount } from 'svelte';

import { fetchDocuments } from '../api/apiRequests';

export function addTypeOptions() {
	onMount(() => {
		if (browser) {
			fetchDocuments('AssetType').then((assetTypeDocuments) => {
				var typeList = document.getElementById('assetType') as HTMLSelectElement;
				var metadataForm = document.getElementById('metadataForm') as HTMLFormElement;

				for (let i of assetTypeDocuments) {
						var child = document.createElement('someuniquetag');

						child.innerHTML = '<option>' + i.typeName + '</option>';
						typeList.appendChild(child);

						child.outerHTML = child.outerHTML.replace(/<\/?someuniquetag>/, '');
				}

					// eslint-disable-line no-unused-vars
					typeList.addEventListener('change', () => {
						metadataForm.innerHTML = '';

						var selectedOption = (typeList).options[(typeList).selectedIndex].text;
						fetchDocuments('AssetType').then((assetTypeDocuments) => {
							for (let i of assetTypeDocuments) {
								if (i.typeName == selectedOption) {
									return i.metadataFields;
								}
							}
						}).then((metadataFields) => {
							for (let i of metadataFields) {
								var child = document.createElement('someuniquetag');

								child.innerHTML =
									'<label for="' +
									i.field +
									'" class="formlabel"><p>' +
									i.field +
									':</p></label>';

								if (metadataForm) metadataForm.appendChild(child);

								child.outerHTML = child.outerHTML.replace(/<\/?someuniquetag>/, '');

								child = document.createElement('someuniquetag');

								child.innerHTML =
									'<input type="text" class="input w-96" id="' +
									i.field +
									'" name="' +
									i.field +
									'" /><br /><br />';

								if (metadataForm) metadataForm.appendChild(child);

								child.outerHTML = child.outerHTML.replace(/<\/?someuniquetag>/, '');
							}
						});
					});
			});
		}
	});
}
