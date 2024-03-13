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
/*
const diff = [
	{
		"type": "UPDATE",
		"key": "assetName",
		"value": "test",
		"oldValue": "Testing12"
	},
	{
		"type": "UPDATE",
		"key": "assetLink",
		"value": "testing12.com",
		"oldValue": "testing12.co.uk"
	},
	{
		"type": "UPDATE",
		"key": "metadataFields",
		"changes": [
			{
				"type": "UPDATE",
				"key": "Language",
				"value": "Python",
				"oldValue": "java"
			},
			{
				"type": "ADD",
				"key": "Test",
				"value": "hi"
			},
			{
				"type": "REMOVE",
				"key": "FPA Points",
				"value": "33"
			}
		]
	}
];
function returnDiff() {
	fetchDocuments('diff').then((diffs) => {
		for (let i of diffs) {
			if (i.reference == '65f060be8a25527b4154eabf') {
				for (let j of i.diffs) {
					parseDiff(j.changes);
				}
			}
		}
	}); 
	
}

function parseDiff(diff) {
	for (const item of diff) {
		if (item.changes && Array.isArray(item.changes)) {
			parseChanges(item.changes);
		} else {
			console.log(`Type: ${item.type}, Key: ${item.key}, Value: ${item.value}, Old Value: ${item.oldValue}`);
		}
	}
}

function parseChanges(changes) {
	for (const change of changes) {
		if (change.changes && Array.isArray(change.changes)) {
			parseChanges(change.changes);
		} else {
			console.log(`Type: ${change.type}, Key: ${change.key}, Value: ${change.value}, Old Value: ${change.oldValue}`);
		}
	}
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

//console.log(returnDiff());
//parseDiff(returnDiff());

