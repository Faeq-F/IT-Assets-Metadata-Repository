export function filterAssets() {
	let container = document.getElementsByClassName('assetsContainer')[0];
	let items = container.getElementsByTagName('*');
	let searchTerm = (document.getElementById('keyword') as HTMLInputElement).value;
	if (searchTerm != '') {
		highlight(searchTerm);
		for (let i in items) {
			if (items[i].tagName == 'DIV') {
				let data = (items[i] as HTMLDivElement).innerText;
				data = data.replace(/(\r\n|\n|\r)/gm, '');
				if (!data.includes(searchTerm)) {
					(items[i] as HTMLDivElement).style.display = 'none';
				} else {
					(items[i] as HTMLDivElement).style.display = '';
				}
			}
		}
	} else {
		highlight(
			'somethingsuperuniquethatcannotbefound1234567890qwertyuiopasdfghjklzxcvbnmpoiuytrewqlkjhgfdsamnbvcxzsomethingsuperuniquethatcannotbefound1234567890qwertyuiopasdfghjklzxcvbnmpoiuytrewqlkjhgfdsamnbvcxz'
		);
		for (let i in items) {
			if (items[i].tagName == 'DIV') {
				(items[i] as HTMLDivElement).style.display = '';
			}
		}
	}
}

/**
 * Highlight the assets with certain terms
 * @param {string} searchTerms - The keywords to be highlighted, separated by a space
 */
function highlight(searchTerms: string) {
	try {
		let keywords = searchTerms.split(/\s\s+/g);
		let container = document.getElementsByClassName('assetsContainer')[0];
		let items = container.getElementsByTagName('div');
		for (let i of items) {
			i.innerHTML = transformContent(i.innerText.replace(/<[^>]*>?/gm, ''), keywords);
		}
	} catch {}
}

/**
 * Adds a highlight to text using a span element
 * @param {*} content - the text to look through and highlight
 * @param {*} keywords - the keywords to highlight
 * @returns the content with the relevant text highlighted
 */
function transformContent(content: string, keywords: any[]) {
	let temp = content;

	keywords.forEach((/** @type {string | RegExp} */ keyword: string | RegExp) => {
		temp = temp.replace(
			new RegExp(keyword, 'g'),
			`<span style="background-color: yellow; border-radius:5px;">${keyword}</span>`
		);
	});

	return temp;
}
