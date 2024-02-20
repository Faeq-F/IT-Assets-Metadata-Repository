// import { response } from 'express';
// import { MongoClient } from 'mongodb';
import { expect, test } from 'vitest';
import { hashCode, containNumbers } from '../../src/routes/register/validate';
import { insertDocument, fetchDocuments } from '../../src/routes/api/apiRequests'; 

test('adds 1 + 2 to equal 3', () => {
	expect(1 + 2).toBe(3);
});

 var URI = 'mongodb+srv://teamProject:teamProject@cluster0.hc6vpim.mongodb.net/?retryWrites=true&w=majority';

 async function insertDB() {

	var assetname = "FileOne";
	var	link = "www.random.com";
	var type = "File";
	//metadataFields = "LineNum";

	var assetObject = {
		assetName: assetname,
		assetLink: link,
		assetType: type,
		//metadataFields: metadataObject
	};
	const data = new FormData();
	data.append('newData', JSON.stringify(assetObject));
	insertDocument('Asset', data).then((response) => {
		console.log(response);
	});
 }

test("SelectAssetTitle", async () => {
	insertDB();
	var assetname = "";
	fetchDocuments('User').then((documentsReturned) => {
		assetname += documentsReturned[3].assetName;
		expect(assetname).toEqual("FileOne");
	});
});

test('HashCode', () => {
	const result = hashCode('test');
	expect(result).toEqual(3556498);
});

test('ContainNumbersFail', () => {
	const check = containNumbers(3);
	const result = check('test1');
	expect(result).toEqual({ containNumbers: 3 });
});

test('ContainNumersPass', () => {
	const check = containNumbers(1);
	const result = check('test2');
	expect(result).toEqual(undefined);
});
