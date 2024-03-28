import { fetchDocumentByID, fetchDocuments } from '$lib/apiRequests';
import type { AutocompleteOption } from '@skeletonlabs/skeleton';

/**
 * Produces a list of options corresponding to the assets / users the user can associate with; used in the Autocomplete components
 * @param associationType the type of association the user will input; "Asset" or "User"
 * @returns a list of the possible options (assets or users) that can be inputted as an association
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 */
export async function addAutocompleteOptions(
	associationType: string
): Promise<AutocompleteOption<string>[]> {
	if (associationType == 'Asset') {
		return await fetchDocuments('Asset').then((documents) => {
			let options: AutocompleteOption<string>[] = [];
			for (let i of documents) {
				options.push({
					label: i.assetName + ' (' + i.assetType + ')',
					value: i._id,
					meta: {
						name: i.assetName,
						extraDetail: i.assetType
					}
				});
			}
			return options;
		});
	} else {
		return await fetchDocuments('User').then((documents) => {
			let options: AutocompleteOption<string>[] = [];
			for (let i of documents) {
				options.push({
					label: i.username + ' (' + i.email + ')',
					value: i._id,
					meta: {
						name: i.username,
						extraDetail: i.email
					}
				});
			}
			return options;
		});
	}
}

/**
 * Produces a list of AutoCompleteOptions to be used as the saved values for Autocomplete components when updating associations
 * @param value
 * @param associationType
 * @returns A list of AutoCompleteOptions that correspond to associations that have already been added to the asset
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 */
export function generatePreSavedAssociations(value: any, associationType: string): any[] {
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
