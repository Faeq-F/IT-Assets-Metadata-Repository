import { fetchDocuments } from '$lib/apiRequests';
import getRandomColor from '$lib/scripts/randomThemeColor';

let data = {
	labels: [''],
	datasets: [
		{
			data: [0],
			backgroundColor: [''],
			label: ' assets of this type'
		}
	]
};

/**
 * Generates the data required to display the Types graph data
 * @returns the generated data
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 */
export async function generateTypesGraphData() {
	await fetchDocuments('Asset').then(async (AssetDocs) => {
		await fetchDocuments('AssetType').then(async (TypeDocs) => {
			const myMap = new Map();
			for (let i of TypeDocs) {
				myMap.set(i.typeName, 0);
			}
			for (let i of AssetDocs) {
				myMap.set(i.assetType, myMap.get(i.assetType) + 1);
			}
			data.labels.pop();
			data.datasets[0].data.pop();
			data.datasets[0].backgroundColor.pop();
			for (let [key, value] of myMap) {
				if (value > 0) {
					data.labels.push(key);
					data.datasets[0].data.push(value);
					data.datasets[0].backgroundColor.push(getRandomColor());
				}
			}
		});
	});
	return data;
}
