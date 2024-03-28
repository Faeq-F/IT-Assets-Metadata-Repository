import { updateDocument } from '$lib/apiRequests';

/**
 * Creates an error toast with the message "Please fill in all of the fields"
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 */
export function emptyFieldAlert(toastStore: {
	trigger: (arg0: { message: string; background: string; timeout: number }) => void;
}): void {
	console.log('Clicked');
	toastStore.trigger({
		message: 'Please fill in all of the fields',
		background: 'variant-ghost-error',
		timeout: 3000
	});
}

/**
 * Constructs the type object, sends it to the database, and reloads the page for viewing
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 */
export function updateType(
	toastStore: { trigger: (arg0: { message: string; background: string; timeout: number }) => void },
	NewTypeName: string,
	id: string,
	modalStore: { close: () => void }
): void {
	console.log('Clicked');
	if (NewTypeName == '') {
		emptyFieldAlert(toastStore);
		return;
	}
	let tempNewTypeFields = [];
	let ul = document.getElementById('createdMetadataFieldsList')?.getElementsByTagName('li');
	if (ul) {
		for (let i of ul) {
			let inputs = i.getElementsByTagName('input');
			let select = i.getElementsByTagName('select');
			let checkbox = false;
			let name = '';
			if (select[0].value == 'Select data type') {
				emptyFieldAlert(toastStore);
				return;
			}
			for (let i of inputs) {
				if (i.classList.contains('checkbox')) {
					//the input is a checkbox for if the field is multi-value or not
					checkbox = i.checked;
				} else {
					//the input is a standard text field
					if (i.value == '') {
						emptyFieldAlert(toastStore);
						return;
					}
					name = i.value;
				}
			}
			tempNewTypeFields.push({ field: name, dataType: select[0].value, list: checkbox });
		}
	}
	let NewTypeObject = { typeName: NewTypeName, metadataFields: tempNewTypeFields };
	//send to db
	const data = new FormData();
	data.append('newData', JSON.stringify(NewTypeObject));
	updateDocument('AssetType', id, data).then((response) => {
		console.log(response);
		location.reload();
		modalStore.close();
	});
}

/**
 * Adds a metadata field to the array of metadata fields for the new Type object
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 */
export function addMetadataField(
	toastStore: { trigger: (arg0: { message: string; background: string; timeout: number }) => void },
	NewTypeFields: any[],
	fieldListable: boolean
): any {
	console.log('Clicked');
	let name = (document.getElementById('addMetadataFieldName') as HTMLInputElement).value;
	let typeList = document.getElementById('addMetadataFieldDataType') as HTMLSelectElement;
	let type = typeList.options[typeList.selectedIndex].text;
	if (name == '') {
		toastStore.trigger({
			message: 'Please give the field a name',
			background: 'variant-ghost-error',
			timeout: 3000
		});
	} else if (type == 'Select data type') {
		toastStore.trigger({
			message: 'Please choose a data type for the field',
			background: 'variant-ghost-error',
			timeout: 3000
		});
	} else {
		return (NewTypeFields = [
			...NewTypeFields,
			{ field: name, dataType: type, list: fieldListable }
		]);
	}
}

/**
 * Removes a metadata field to the array of metadata fields for the new Type object
 * @author Faeq Faisal
 * @param event The event from the button (currentTarget) of the field that needs to be removed
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 */
export function removeField(
	event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement },
	NewTypeFields: any[]
): any {
	console.log('Clicked');
	const fieldSpan = event.currentTarget.parentElement;
	let inputs = fieldSpan?.getElementsByTagName('input');
	let select = fieldSpan?.getElementsByTagName('select');
	let name = '';
	if (inputs && select) {
		for (let i of inputs) {
			if (!i.classList.contains('checkbox')) {
				name = i.placeholder;
			}
		}
		return (NewTypeFields = NewTypeFields.filter(
			(field: { field: string }) => field.field != name
		));
	}
}
