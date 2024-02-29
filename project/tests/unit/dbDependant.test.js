import { expect, test } from 'vitest';
import { fetchDocuments } from '../../src/routes/api/apiRequests';
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
		return expect(answer[2].assetName).toEqual('FileOne');
	});
});

test('SelectAssetLink', () => {
	return fetchDocuments('Asset').then((answer) => {
		return expect(answer[2].assetLink).toEqual('www.random.com');
	});
});

test('SelectAssetType', () => {
	return fetchDocuments('Asset').then((answer) => {
		return expect(answer[2].assetType).toEqual('File');
	});
});
