import { fetchDocuments } from '$lib/apiRequests';
import type { AutocompleteOption } from '@skeletonlabs/skeleton';

/**
 * Produces a list of options corresponding to the assets / users the user can associate with; used in the Autocomplete components
 * @param associationType the type of association the user will input; "Asset" or "User"
 * @returns a list of the possible options (assets or users) that can be inputted as an association
 * @author Faeq Faisal
 * @email faeqfaisal@hotmail.co.uk
 * @email zlac318@live.rhul.ac.uk
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
