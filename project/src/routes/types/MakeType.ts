import { insertDocument } from '$lib/apiRequests';
import type { ToastStore } from '@skeletonlabs/skeleton';

/**
 * Constructs an Asset Type object and saves it to the database
 * @param toastStore The apps toastStore
 * @param fieldsSaved The saved metadataFields for the type to be created
 */
export async function makeType(toastStore: ToastStore, fieldsSaved: any[]) {
	var name = (document.getElementById('typeName') as HTMLInputElement).value;
	if (name == '') {
		toastStore.trigger({
			message: 'Please give the type a name',
			background: 'variant-ghost-error',
			timeout: 3000
		});
	} else {
		var typeObject = { typeName: name, metadataFields: fieldsSaved };
		const data = new FormData();
		data.append('newData', JSON.stringify(typeObject));
		await insertDocument('AssetType', data)
			.then((response) => {
				console.log(response);
				toastStore.trigger({
					message: 'Asset Type created',
					background: 'variant-ghost-success',
					timeout: 3000
				});
			})
			.catch((err) => {
				console.log(err);
				toastStore.trigger({
					message: 'Unable to create type - does one of the same name already exist?',
					background: 'variant-ghost-error',
					timeout: 3000
				});
			});
		// Refresh the page
		location.reload();
	}
}

/**
 * Removes the last field from the list of metadata fields
 * @param fieldsSaved The saved metadataFields for the type to be created
 * @returns The updated fields array
 */
export function removeBottom(fieldsSaved: any[]): any[] {
	return fieldsSaved.pop();
}

/**
 * Adds a metadata field to the list of saved metadata fields for the type to be created
 * @param toastStore The apps toastStore
 * @param fieldsSaved  The saved metadataFields for the type to be created
 * @param fieldListable If the field is multi-value
 * @returns The updated fields array
 */
export function addMetadataField(
	toastStore: ToastStore,
	fieldsSaved: any[],
	fieldListable: boolean
): any[] {
	let name = (document.getElementById('addMetadataFieldName') as HTMLInputElement).value;
	let typeList = document.getElementById('addMetadataFieldDataType') as HTMLSelectElement;
	let type = typeList.options[typeList.selectedIndex].text;
	if (name == '') {
		toastStore.trigger({
			message: 'Please give the field a name',
			background: 'variant-ghost-error',
			timeout: 3000
		});
		return [];
	} else if (type == 'Select data type') {
		toastStore.trigger({
			message: 'Please choose a data type for the field',
			background: 'variant-ghost-error',
			timeout: 3000
		});
		return [];
	} else {
		return (fieldsSaved = [...fieldsSaved, { field: name, dataType: type, list: fieldListable }]);
	}
}
