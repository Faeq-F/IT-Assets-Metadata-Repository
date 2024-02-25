export function highlight(text: any, keywordSearchInput: string[]) {
	text = (text as string)+"";
		keywordSearchInput.forEach((/** @type {string | RegExp} */ keyword: string | RegExp) => {
		text = text.replace(
			new RegExp(keyword, 'gi'),
			`<span style="background-color: orange; border-radius:5px;">$&</span>`
		);
	});
	return text;
}

export function keywordFilter(object: JSON, keywordSearchInput: string[]) {
	if (keywordSearchInput.length > 0) {
		for (let keyword of keywordSearchInput) {
			if (JSON.stringify(object).toLowerCase().includes(keyword)) return true;
		}
		return false;
	}
	return true;
}