//@ts-ignore
import { browser } from '$app/environment'; //Does work
import { onMount } from 'svelte';

import { fetchDocuments } from '../api/apiRequests';

/**
 * Dynamically adds the saved types for assets into the dropdown in the makeAsset ui
 */
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

					var selectedOption = typeList.options[typeList.selectedIndex].text;
					fetchDocuments('AssetType')
						.then((assetTypeDocuments) => {
							for (let i of assetTypeDocuments) {
								if (i.typeName == selectedOption) {
									return i.metadataFields;
								}
							}
						})
						.then((metadataFields) => {
							for (let i of metadataFields) {
								var child = document.createElement('someuniquetag');

								child.innerHTML =
									'<label for="' + i.field + '" class="formlabel"><p>' + i.field + ':</p></label>';

								if (metadataForm) metadataForm.appendChild(child);

								child.outerHTML = child.outerHTML.replace(/<\/?someuniquetag>/, '');

								child = document.createElement('someuniquetag');

								child.innerHTML = generateInputForType(i);

								if (metadataForm) metadataForm.appendChild(child);

								child.outerHTML = child.outerHTML.replace(/<\/?someuniquetag>/, '');
							}
						});
				});
			});
		}
	});
}

/**
 * Creates the relevant input for a metadata field based on its data type
 * @param fieldObject the metadata field to create an input for
 * @returns the innerHTML for a child node in the metadataForm, resembling the input(s) for the metadata field
 */
function generateInputForType(fieldObject: any): string {
	let input = '';
	if (fieldObject.list) {
		switch (fieldObject.dataType) {
			case 'Text':
				input =
					'<p></p><input type="text" placeholder="please ensure there is a \', \' (Comma + Space) between the text values" class="input w-11/12" id="' +
					fieldObject.field +
					'-Text-ListIDaddon" name="' +
					fieldObject.field +
					'" /><br /><br />';
				break;
			case 'Number':
				input =
					'<input type="text" placeholder="please ensure there is a \', \' (Comma + Space) between the number values" pattern="d*" class="input w-11/12" id="' +
					fieldObject.field +
					'-Number-ListIDaddon" name="' +
					fieldObject.field +
					'" /><br /><br />';
				break;
			case 'Asset':
				input = 'The application cannot associate assets yet - coming soon!<br><br>';
				break;
			case 'Account':
				input = 'The application cannot associate accounts yet - coming soon!<br><br>';
				break;
		}
	} else {
		switch (fieldObject.dataType) {
			case 'Text':
				input =
					'<input type="text" class="input w-96" id="' +
					fieldObject.field +
					'" name="' +
					fieldObject.field +
					'" /><br /><br />';
				break;
			case 'Number':
				input =
					'<input type="number" class="input w-96" id="' +
					fieldObject.field +
					'" name="' +
					fieldObject.field +
					'" /><br /><br />';
				break;
			case 'Asset':
				input = 'The application cannot associate assets yet - coming soon!<br><br>';
				break;
			case 'Account':
				input = 'The application cannot associate accounts yet - coming soon!<br><br>';
				break;
		}
	}
	return input;
}
