import { expect, test } from 'vitest';
import { updateDocument, insertDocument, fetchDocuments } from '$lib/apiRequests';
//insert assetType to test
function insertType() {
	var assetType = {
		typeName: 'testType',
		metadataFields: 'metadataObject'
	};

	const data = new FormData();
	data.append('newData', JSON.stringify(assetType));

	insertDocument('AssetType', data).then((response) => {
		console.log(response);
	});
}

test('adds 2 + 2 to equal 4', () => {
	expect(2 + 2).toBe(4);
});

//insertType();

test('UpdateAssetType', () => {
	var assetType = {
		typeName: 'newTestType',
		metadataFields: 'newMetadataObject'
	};


	const data = new FormData();
	data.append('newData', JSON.stringify(assetType));

	updateDocument('AssetType', '65fca2825da68c6811c53359', data).then(async (response) => {
		console.log(response);
	});


	return fetchDocuments('AssetType').then(async (answer) => {
		console.log(answer[7].typeName);
		return expect(answer[7].typeName).toEqual('newTestType');
	}); 
});