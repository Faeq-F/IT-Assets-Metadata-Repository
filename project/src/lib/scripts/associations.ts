import { fetchDocumentByID } from "$lib/apiRequests";

export function generatePreSavedAssociations(value: any, associationType: string) {
		let associations: any[] = [];
		const generation = new Promise((resolve) => {
			if (associationType == 'Asset') {
				for (let i of value) {
					fetchDocumentByID(i.replace('DOCUMENT-ID: ', '')).then(
						(document: { assetName: string; assetType: string; _id: any }) => {
							associations.push({
								label: document.assetName + ' (' + document.assetType + ')',
								value: document._id,
								meta: {
									name: document.assetName,
									extraDetail: document.assetType
								}
							});
						}
					);
				}
			} else {
				for (let i of value) {
					fetchDocumentByID(i.replace('DOCUMENT-ID: ', '')).then(
						(document: { username: string; email: string; _id: any }) => {
							associations.push({
								label: document.username + ' (' + document.email + ')',
								value: document._id,
								meta: {
									name: document.username,
									extraDetail: document.email
								}
							});
						}
					);
				}
			}
			resolve(associations);
		});
		Promise.resolve(generation);

		return associations;
	}