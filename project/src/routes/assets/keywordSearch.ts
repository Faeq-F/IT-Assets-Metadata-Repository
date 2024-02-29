/**
 * Adds spans with a highlighted background to matching keywords
 * @param text The text to look through, & highlight, for certain keywords
 * @param keywordSearchInput The array of strings inputted in the search bar
 * @returns The text with the relevant keywords highlighted
 */
export function highlight(text: any, keywordSearchInput: string[]) {
	text = (text as string) + '';
	keywordSearchInput.forEach((/** @type {string | RegExp} */ keyword: string | RegExp) => {
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
 * @returns whether or not the asset should be shown
 */
export function keywordFilter(object: JSON, keywordSearchInput: string[]) {
	if (keywordSearchInput.length > 0) {
		for (let keyword of keywordSearchInput) {
			if (JSON.stringify(object).toLowerCase().includes(keyword)) return true;
		}
		return false;
	}
	return true;
}
