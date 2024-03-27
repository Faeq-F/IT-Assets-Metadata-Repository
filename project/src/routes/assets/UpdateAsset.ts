import { fetchDocuments, updateDocument } from "$lib/apiRequests";
import { diff } from 'json-diff-ts';
import Cookies from 'js-cookie';

/**
	 * Gets edited asset values and inserts new asset into required databases
	 * @author ...
	 * @email
	 * @author Christian-Frederick Cubos
	 * @email zlac145@live.rhul.ac.uk
	 */
export async function updateAsset(NewAssetName:string, NewAssetLink:string, toastStore:any, assetType:string, id:string, assetName:string, assetLink:string, metadataFields:any, modalStore:any) {
		if (NewAssetName == '' || NewAssetLink == '') {
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
			assetName: NewAssetName,
			assetLink: NewAssetLink,
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
				let diffslib = diff(originalAsset, assetObject);

				// formatting diffs
				var diffs = {
					author: Cookies.get('savedLogin-username'),
					date: current_date,
					time: current_time,
					changes: diffslib
				};

				var dbdiffs: any[] = [];
				var auditid: any;

				// getting original diff
				await fetchDocuments('diff').then((fetchdiffs: any) => {
					for (let i of fetchdiffs) {
						if (i.reference == id) {
							dbdiffs = i.diffs;
							auditid = i._id;
						}
					}
				});

				// append new diffs onto existing diff document
				dbdiffs.push(diffs);

				// remaking audit with new diff array
				var auditData = {
					reference: id,
					original: originalAsset,
					diffs: dbdiffs
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