import { deleteDocument, fetchDocuments, insertDocument, updateDocument } from '$lib/apiRequests';
import { diff } from 'json-diff-ts';
import Cookies from 'js-cookie';
import { emptyFieldAlert } from '$lib/alerts';
import type { ModalStore, ToastStore } from '@skeletonlabs/skeleton';

/**
 * Sends a request to the database API to delete the asset and its corresponding audit trail
 * @param id the _id of the document to delete
 * @param toastStore the toastStore for the app. used to show success / error toasts
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 * @author Christian-Frederick Cubos - zlac145@live.rhul.ac.uk
 */
export async function deleteAsset(id: string, toastStore: any) {
	var auditid: string;
	await deleteDocument('Asset', id).then(async () => {
		await fetchDocuments('diff')
			.then((fetchedAudits) => {
				for (let i of fetchedAudits) {
					if (i.reference == id) {
						auditid = i._id;
					}
				}
				console.log(auditid);
				return auditid;
			})
			.then(async (auditid) => {
				await deleteDocument('diff', auditid);
				toastStore.trigger({
					message: 'Asset deleted',
					background: 'variant-ghost-success',
					timeout: 3000
				});
			})
			.catch((err) => {
				return err;
			});
	});
	// Refresh the page
	location.reload();
}

/**
 * Gets the assets values, creates the asset object and inserts it into the Asset database collection.
 * Also adds an entry for the asset in the diffs collection.
 * @param type the type of the asset
 * @param toastStore the toastStore for the app. used to show success / error toasts
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 * @author Christian-Frederick Cubos - zlac145@live.rhul.ac.uk
 */
export async function makeAsset(type: string, toastStore: any) {
	//start by checking if the required fields are filled in
	var name = (document.getElementById('assetName') as HTMLInputElement).value;
	var link = (document.getElementById('assetLink') as HTMLInputElement).value;
	if (name == '') {
		toastStore.trigger({
			message: 'Please give the asset a name',
			background: 'variant-ghost-error',
			timeout: 3000
		});
		return;
	} else if (link == '') {
		toastStore.trigger({
			message: 'Please give the asset a link',
			background: 'variant-ghost-error',
			timeout: 3000
		});
		return;
	} else if (type === undefined) {
		toastStore.trigger({
			message: 'Please give the asset a type',
			background: 'variant-ghost-error',
			timeout: 3000
		});
		return;
	}

	//then get the inputs for all metadata fields
	var metadataForm = document.getElementById('metadataForm') as HTMLFormElement;
	let metadataInputs = metadataForm.getElementsByTagName('input');
	var metadataObject = {};
	for (let i of metadataInputs) {
		let key = i.id.replace('-association', '').replace('-InputList', '');
		let value;
		//check if the field is a list of numbers or text
		if (i.id.includes('InputList')) {
			//if so, get the elements with the values
			let collection = document
				.getElementById(key + '-ListInputCollector')
				?.getElementsByTagName('li');
			if (collection) {
				let newArr: any[] = [];
				for (let j of collection) {
					let iVal: any = (j as HTMLLIElement).innerHTML;
					if (!i.placeholder.includes('strings of text')) iVal = parseFloat(iVal);
					newArr.push(iVal);
				}
				value = newArr;
			}
		} else if (i.placeholder.includes('Search for multiple')) {
			//the input is for a list of associations
			let item = document.getElementById(key + '-associationCollector')?.getElementsByTagName('LI');
			if (item) {
				let newArr = [];
				for (let j of item) {
					let object = (j as HTMLElement).dataset.associatedobject;
					if (object) newArr.push('DOCUMENT-ID: ' + JSON.parse(object).value);
				}
				value = newArr;
			}
		} else {
			if (i.placeholder.includes('number')) {
				if (!(i.value == '')) {
					if (Number.isNaN(parseFloat(i.value))) {
						toastStore.trigger({
							message: 'You tried submitting text as a number!',
							background: 'variant-ghost-error',
							timeout: 3000
						});
						return;
					}
					value = parseFloat(i.value);
				}
			} else if (i.placeholder.includes('text')) {
				value = i.value;
			} else if (i.placeholder.includes('Search for a')) {
				let item = document
					.getElementById(key + '-associationCollector')
					?.getElementsByTagName('LI');
				if (!(item == undefined || item.length == 0)) {
					let liItem = (item[0] as HTMLElement).dataset.associatedobject;
					if (liItem) value = 'DOCUMENT-ID: ' + JSON.parse(liItem).value;
				}
			}
		}
		metadataObject = { ...metadataObject, [key]: value };
	}
	//construct the final asset object and send it to the db
	var assetObject = {
		assetName: name,
		assetLink: link,
		assetType: type,
		metadataFields: metadataObject
	};

	const data = new FormData();
	data.append('newData', JSON.stringify(assetObject));
	await insertDocument('Asset', data).then(async (response: any) => {
		// response is the new id of the inserted doc now
		let diffs: any[] = [];
		// constructing audit object
		var auditObject = {
			reference: response,
			original: {
				assetName: name,
				assetLink: link,
				assetType: type,
				metadataFields: metadataObject
			},
			diffs: diffs
		};
		// sending new asset into diff
		const audit = new FormData();
		audit.append('newData', JSON.stringify(auditObject));

		await insertDocument('diff', audit);

		toastStore.trigger({
			message: 'Asset created',
			background: 'variant-ghost-success',
			timeout: 3000
		});
		//Refresh the page
		location.reload();
	});
}

/**
 * Reconstructs the asset object and inserts it in place of the old one in the Asset database collection
 * Adds a diff to the assets entry in the diff collection
 * @param oldAssetDetails the assets old details
 * @param newAssetName the new name for the asset
 * @param newAssetLink the new link to the asset
 * @param toastStore the apps ToastStore
 * @param modalStore the apps ModalStore
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 * @author Christian-Frederick Cubos - zlac145@live.rhul.ac.uk
 */
export async function updateAsset(
	oldAssetDetails: {
		id: string;
		assetName: string;
		assetLink: string;
		assetType: string;
		metadataFields: any;
	},
	newAssetName: string,
	newAssetLink: string,
	toastStore: ToastStore,
	modalStore: ModalStore
) {
	let id = oldAssetDetails.id;
	let assetName = oldAssetDetails.assetName;
	let assetLink = oldAssetDetails.assetLink;
	let assetType = oldAssetDetails.assetType;
	let metadataFields = oldAssetDetails.metadataFields;

	if (newAssetName == '' || newAssetLink == '') {
		emptyFieldAlert(toastStore);
		return;
	}
	let metadataObject = {};
	let inputs = document.getElementById('metadataFieldsDiv')?.getElementsByTagName('input');
	if (inputs) {
		for (let input of inputs) {
			//input is for a list of text or numbers
			if (input.id.endsWith('-InputList')) {
				//get the elements with the values of the list
				let collection = document
					.getElementById(input.id.replace('-InputList', '') + '-ListInputCollector')
					?.getElementsByTagName('li');
				if (collection) {
					// save each value in an array
					let listArr: any[] = [];
					for (let j of collection) {
						//get the value from the element
						let iVal: any = (j as HTMLLIElement).innerHTML;
						//parse it as a number, if needed
						if (input.type != 'text') iVal = parseFloat(iVal);
						//save to array
						listArr.push(iVal);
					}
					//save the list of values as the value for the field
					metadataObject = {
						...metadataObject,
						[input.id.replace('-InputList', '')]: listArr
					};
				}
			} else if (input.id.endsWith('-association')) {
				if (input.placeholder.includes('multiple')) {
					// The input is for a list of associations
					let items = document
						.getElementById(input.id.replace('-association', '') + '-associationCollector')
						?.getElementsByTagName('LI');
					//items is a list of saved associations from the custom input
					if (items) {
						let associationArr = [];
						for (let j of items) {
							//save each association in a list
							let object = (j as HTMLElement).dataset.associatedobject;
							if (object) associationArr.push('DOCUMENT-ID: ' + JSON.parse(object).value);
						}
						//save the list of associations as the value for the field
						metadataObject = {
							...metadataObject,
							[input.id.replace('-association', '')]: associationArr
						};
					}
				} else {
					// The input is for a single association
					let item = document
						.getElementById(input.id.replace('-association', '') + '-associationCollector')
						?.getElementsByTagName('LI');
					//item is the saved association from the custom input
					if (!(item == undefined || item.length == 0)) {
						let liItem = (item[0] as HTMLElement).dataset.associatedobject;
						//save the association
						if (liItem)
							metadataObject = {
								...metadataObject,
								[input.id.replace('-association', '')]: 'DOCUMENT-ID: ' + JSON.parse(liItem).value
							};
					}
				}
			} else {
				if (input.type == 'text') {
					// The input is a normal field for a single string of text
					metadataObject = { ...metadataObject, [input.id]: input.value };
				} else {
					// The input is a normal field for a single number
					metadataObject = { ...metadataObject, [input.id]: parseFloat(input.value) };
				}
			}
		}
	}

	var assetObject = {
		assetName: newAssetName,
		assetLink: newAssetLink,
		assetType: assetType,
		metadataFields: metadataObject
	};

	const data = new FormData();
	data.append('newData', JSON.stringify(assetObject));

	updateDocument('Asset', id, data)
		.then(async (response: any) => {
			console.log(response);
			// formatting date
			let current = new Date();
			let day = current.getDate();
			let month = current.getMonth() + 1;
			let year = current.getFullYear();
			let current_date = `${day}/${month}/${year}`;
			let current_time = current.toLocaleTimeString();

			var originalAsset = {
				assetName: assetName,
				assetLink: assetLink,
				assetType: assetType,
				metadataFields: metadataFields
			};

			// call import for diffs
			let generatedLib = diff(originalAsset, assetObject);

			// formatting diffs
			var diffs = {
				author: Cookies.get('savedLogin-username'),
				date: current_date,
				time: current_time,
				changes: generatedLib
			};

			var presavedDiffs: any[] = [];
			var auditid: any;

			// getting original diff
			await fetchDocuments('diff').then((fetchedDiffs: any) => {
				for (let i of fetchedDiffs) {
					if (i.reference == id) {
						presavedDiffs = i.diffs;
						auditid = i._id;
					}
				}
			});

			// append new diffs onto existing diff document
			presavedDiffs.push(diffs);

			// remaking audit with new diff array
			var auditData = {
				reference: id,
				original: originalAsset,
				diffs: presavedDiffs
			};

			// update the audit with new data
			const audit = new FormData();
			audit.append('newData', JSON.stringify(auditData));
			await updateDocument('diff', auditid, audit).then((response: any) => {
				console.log(response);
				location.reload();
				toastStore.trigger({
					message: 'Asset updated',
					background: 'variant-ghost-success',
					timeout: 3000
				});
				modalStore.close();
			});
		})
		.catch((error) => {
			if (error.message == 'Invalid user credentials') {
				alert(error.message);
			}
		});
}
