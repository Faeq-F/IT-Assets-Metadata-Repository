import { fetchDocumentByID, fetchDocuments } from '$lib/apiRequests';
import getRandomColor from '$lib/scripts/randomThemeColor';

let data = {
	datasets: [
		{
			data: [0],
			backgroundColor: ['#FFE6E6'],
			label: ' associations'
		}
	],
	labels: ['']
};

export async function generateAssociationsGraphData() {
	await fetchDocuments('Asset').then(async (AssetDocs) => {
		const myMap = new Map();
		for (let i of AssetDocs) {
			myMap.set(i.assetName, 0);
		}
		for (let i of AssetDocs) {
			for (let key of Object.keys(i.metadataFields)) {
				if ((i.metadataFields[key] + '').startsWith('DOCUMENT-ID: ')) {
					if (Array.isArray(i.metadataFields[key])) {
						for (let k of i.metadataFields[key]) {
							await fetchDocumentByID(k.replace('DOCUMENT-ID: ', '')).then((Document) => {
								if (Document.assetName != undefined) {
									myMap.set(Document.assetName, myMap.get(Document.assetName) + 1);
								}
							});
						}
					} else {
						await fetchDocumentByID(i.metadataFields[key].replace('DOCUMENT-ID: ', '')).then(
							(Document) => {
								if (Document.assetName != undefined) {
									myMap.set(Document.assetName, myMap.get(Document.assetName) + 1);
								}
							}
						);
					}
				}
			}
		}
		var array = [];
		for (let [key, value] of myMap) {
			array.push({
				name: key,
				value: value
			});
		}
		var sorted = array.sort(function (a, b) {
			return a.value < b.value ? 1 : b.value < a.value ? -1 : 0;
		});
		data.labels.pop();
		data.datasets[0].data.pop();
		data.datasets[0].backgroundColor.pop();
		let count = 0;
		for (let i of sorted) {
			if (count < 20) {
				if (i.value > 0) {
					data.labels.push(i.name);
					data.datasets[0].data.push(i.value);
					data.datasets[0].backgroundColor.push(getRandomColor());
				}
				count++;
			} else break;
		}
	});
	return data;
}
