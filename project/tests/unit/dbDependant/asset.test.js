import { expect, test } from 'vitest';
import { fetchDocuments, updateDocument } from '$lib/apiRequests';
/*
async function insertDB() {

	var assetname = "FileOne";
	var	link = "www.random.com";
	var type = "File";
	var metadataObject = "LineNum";

	var assetObject = {
		assetName: assetname,
		assetLink: link,
		assetType: type,
		metadataFields: metadataObject
	};
	const data = new FormData();
	data.append('newData', JSON.stringify(assetObject));
	insertDocument('Asset', data).then((response) => {
		console.log(response);
	});
}
*/

test('SelectAssetName', () => {
	return fetchDocuments('Asset').then((answer) => {
		return expect(answer[8].assetName).toEqual('Test Asset');
	});
});

test('SelectAssetLink', () => {
	return fetchDocuments('Asset').then((answer) => {
		return expect(answer[8].assetLink).toEqual('link.com');
	});
});

test('SelectAssetType', () => {
	return fetchDocuments('Asset').then((answer) => {
		return expect(answer[8].assetType).toEqual('Framework');
	});
});
//Used to test update function
function resetAsset() {
	var asset = {
		assetName: 'AssetName',
		assetLink: 'AssetLink',
		assetType: 'assetType',
		metadataFields: 'metadataObject'
	};

	const data = new FormData();
	data.append('newData', JSON.stringify(asset));
	updateDocument('Asset', '65f4209f2597603d76e946b6', data).then(async (response) => {
		console.log(response);
	});
}


test('UpdateAsset', () => {
	var asset = {
		assetName: 'newAssetName',
		assetLink: 'newAssetLink',
		assetType: 'newAssetType',
		metadataFields: 'newMetadataObject'
	};

	const data = new FormData();
	data.append('newData', JSON.stringify(asset));
	updateDocument('Asset', '65f4209f2597603d76e946b6', data).then(async (response) => {
		console.log(response);
	});


	return fetchDocuments('Asset').then(async (answer) => {
		console.log(answer[11].assetName);
		return expect(answer[11].assetName).toEqual('newAssetName');
	}); 
});
