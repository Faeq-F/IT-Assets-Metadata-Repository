// import { response } from 'express';
// import { MongoClient } from 'mongodb';
import { expect, test } from 'vitest';
import { hashCode, containNumbers } from '../../src/routes/register/validate';

test('adds 1 + 2 to equal 3', () => {
	expect(1 + 2).toBe(3);
});

// var Express = require('express');
// var Mongoclient = require('mongodb').MongoClient;
// var cors = require('cors');

// const multer = require('multer');

// var app = Express();
// app.use(cors());

// var URI = 'mongodb+srv://zlac241:1234@cluster0.hc6vpim.mongodb.net/?retryWrites=true&w=majority';
// var DATABASEName = 'teamproject';
// var database;
// let assets = [];

// function refreshAssets() {
//     fetch(URI + 'api/teamproject/GetAssets')
//         .then((response) => response.json())
//         .then((data) => {
//             assets = data;
//         });
// }

// async function connectToDatabase() {
//     const client = await MongoClient.connect(URI);
//     database = client.db(DATABASEName);
// }

// async function insertDB() {
//     let assetTypeId;

//     try {
//         // Insert AssetType and get its _id
//         const assetTypeResult = await database.collection('AssetType').insertOne({
//             typeTitle: "File",
//             MetaData: {
//                 lineNum: "int",
//                 'programming-language': "string"
//             }
//         });
//         assetTypeId = assetTypeResult.insertedId; // Store the _id of the inserted AssetType

//     } catch (error) {
//         console.error("Could not insert into AssetType collection: ", error);
//         throw error; // If error occurs here, we throw it to avoid inconsistent data
//     }

//     try {
//         // Insert Asset with a reference to the AssetType's _id
//         await database.collection('Asset').insertOne({
//             asset_id: 1,
//             title: "FileNumberOne",
//             link: "www.w3schools.com",
//             MetaData: {
//                 lineNum: 50,
//                 'programming-language': "Java"
//             },
//             assetTypeId: assetTypeId // Reference to AssetType document
//         });

//     } catch (error) {
//         console.error("Could not insert into Asset collection: ", error);
//         throw error;
//     }
// }

// async function initialiseDatabase() {
//     await connectToDatabase();
//     await insertDB();
// }

// initialiseDatabase()

// async function select(query) {
//     try {
//         const asset = await database.collection('Asset').findOne(query);
//         return asset;
//     }  catch (error) {
//         console.log("Could not query db: ", error);
//         throw error;
//     }
// }

// async function selectType(query) {
// 	try {
// 		const assetType = await database.collection('AssetType').findOne(query);
// 		return assetType;
// 	} catch (error) {
// 		console.log("Could not query assetType: ", error);
// 		throw error;
// 	}
// }

// beforeAll(async () => {
//     await connectToDatabase();
//     await insertDB();
//   });

// test("SelectAssetID", async () => {
//     let query = {asset_id: 1}
//     const result = await select(query)
//     expect(result.asset_id).toEqual(1);
// })

// test("SelectAssetTitle", async () => {
//     let query = {title: "FileNumberOne"}
//     const result = await select(query)
//     expect(result.title).toEqual("FileNumberOne");
// })

// test("SelectAssetProgrammingLanguage", async () => {
//     let query = {asset_id: 1}
// 	const result = await select(query)
// 	expect(result.MetaData['programming-language']).toEqual("Java");
// })

// test("SelectAssetLineNum", async () => {
//     let query = {asset_id: 1}
// 	const result = await select(query)
// 	expect(result.MetaData.lineNum).toEqual(50);
// })

// test("SelectAssetLink", async () => {
//     let query = {asset_id: 1}
// 	const result = await select(query)
// 	expect(result.link).toEqual("www.w3schools.com");
// })

// test("SelectAssetType", async () => {
// 	let query = {typeTitle: "File"}
// 	const result = await selectType(query)
// 	expect(result.typeTitle).toEqual("File");
// })

// test("SelectTypeLineNum", async () => {
// 	let query = {"MetaData.lineNum": "int"}
// 	const result = await selectType(query)
// 	expect(result.MetaData.lineNum).toEqual("int");
// })

// test("SelectTypeLang", async () => {
// 	let query = {"MetaData.programming-language": "string"}
// 	const result = await selectType(query)
// 	expect(result.MetaData['programming-language']).toEqual("string");
// })

// test("DeleteWithAPI", async () => {
//     const resp = fetch(URI + '/api/teamproject/DeleteAssets', {
//         method: 'DELETE',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             name: "Login API",
//             link: "www.api.com",
//             metadata: {
//                 "programming-language": "Python",
//                 "line-num": 30
//             }
//         })
//     })
//     .then(response => {
//         if (response.ok) {
//             return response.json();
//         } else {
//             throw new Error('Failed to delete asset');
//         }
//     })
//     .then(data => {
//         console.log(data); // Output the response from the server
//     })
//     .catch(error => {
//         console.error('Error deleting asset:', error);
//     });

//     let query = {title: "FileNumberOne"}
//     const result = await selectType(query)
//     expect(result).toEqual(null);
// })
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
