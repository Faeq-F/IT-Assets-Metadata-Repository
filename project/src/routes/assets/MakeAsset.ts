import { insertDocument } from "$lib/apiRequests";

export async function makeAsset(currentType:string, toastStore:any) {
		//start by checking if the required fields are filled in
		var name = (document.getElementById('assetName') as HTMLInputElement).value;
		var link = (document.getElementById('assetLink') as HTMLInputElement).value;
		var type = currentType;
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
				let item = document
					.getElementById(key + '-associationCollector')
					?.getElementsByTagName('LI');
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