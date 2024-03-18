import { expect, test } from 'vitest';
import { fetchDocuments } from '$lib/apiRequests';
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

//console.log(returnDiff());
//parseDiff(returnDiff());
