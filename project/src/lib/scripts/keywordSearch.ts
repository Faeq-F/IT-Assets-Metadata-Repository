import { fetchDocumentByID } from '$lib/apiRequests';

/**
 * Adds spans with a highlighted background to matching keywords
 * @param text The text to look through, & highlight, for certain keywords
 * @param keywordSearchInput The array of strings inputted in the search bar
 * @returns The text with the relevant keywords highlighted
 * @author Faeq Faisal
 * @email faeqfaisal@hotmail.co.uk
 * @email zlac318@live.rhul.ac.uk
 */
export function highlight(text: any, keywordSearchInput: string[]): string {
	text = text + '';
	keywordSearchInput.forEach((/** @type {string | RegExp} */ keyword: string | RegExp) => {
		//$& places the keyword found within the span element, preserving case
		text = text.replace(
			new RegExp(keyword, 'gi'),
			`<span style="background-color: orange; border-radius:5px;">$&</span>`
		);
	});
	return text;
}

/**
 * Decides whether or not to show a certain asset
 * @param object The asset to check
 * @param keywordSearchInput The array of strings inputted in the search bar
 * @returns Whether or not the asset should be shown
 * @author Faeq Faisal
 * @email faeqfaisal@hotmail.co.uk
 * @email zlac318@live.rhul.ac.uk
 */
export async function keywordFilter(object: any, keywordSearchInput: string[]): Promise<boolean> {
	if (keywordSearchInput.length > 0) {
		for (let keyword of keywordSearchInput) {
			if (JSON.stringify(object).toLowerCase().includes(keyword)) return true;
			//if the plain text of the JSON does not have the searched value, check the displayed value of associations
			for (var key of Object.keys(object.metadataFields)) {
				if (('' + object.metadataFields[key]).startsWith('DOCUMENT-ID: ')) {
					//check if it is a list of associations
					if (Array.isArray(object.metadataFields[key])) {
						for (let i of object.metadataFields[key]) {
							if (await checkAssociation(i, keyword)) return true;
						}
					} else {
						if (await checkAssociation(object.metadataFields[key], keyword)) return true;
					}
				}
			}
		}
		return false;
	}
	return true;
}

/**
 * Checks if an associations displayed value has a keyword being looked for
 * @param DocID The association id with "DOCUMENT-ID: " at the beginning
 * @param keyword The keyword to look for in the association
 * @returns Whether or not the displayed value of an association has the keyword
 * @author Faeq Faisal
 * @email faeqfaisal@hotmail.co.uk
 * @email zlac318@live.rhul.ac.uk
 */
async function checkAssociation(DocID: string, keyword: string): Promise<boolean> {
	return fetchDocumentByID(DocID.replace('DOCUMENT-ID: ', '')).then<boolean>((document) => {
		//check if the association is an asset or a user
		if (document.assetName != undefined) {
			return document.assetName.toLowerCase().includes(keyword);
		} else {
			return document.username.toLowerCase().includes(keyword);
		}
	});
}
