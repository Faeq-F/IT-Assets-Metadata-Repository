//▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰

//get env vars - only used in this file - everything else will go through the port open for server-side processing
const dotenv = require('dotenv');
const result = dotenv.config();
if (result.error) {
	throw result.error;
}
const { parsed: envs } = result;

//▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰

//Setup db connection
var Express = require('express');
var MongoClient = require('mongodb').MongoClient;
const app = Express();
const cors = require('cors');
app.use(cors());
app.set('case sensitive routing', true); //required to pass the correct names of collections, etc.

/** reusable instance of db @type{any} */
var database;

app.listen(5038, () => {
	MongoClient.connect(
		envs.DB_API_URL,
		(/** @type {any} */ error, /** @type {{ db: (arg0: any) => any; }} */ client) => {
			database = client.db(envs.DB_NAME);
			if (error) console.error(error);
			console.log(`server-side is running at port 5038\nConnected`);
		}
	);
});

//▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰

const multer = require('multer'); // used for accessing form data
//Define db routes

//get documents from a collection
app.get(
	'/api/get/collection/:name',
	(/** @type {any} */ request, /** @type {{ send: (arg0: any) => void; }} */ response) => {
		let result = async (/** @type {string} */ collection) => {
			let dbCollection = database.collection(collection);
			let result = await dbCollection.find();
			return await result.toArray();
		};
		result(request.params.name.toString()).then((result) => response.send(result));
	}
);

//▰▰▰▰▰▰▰▰▰

//insert a document into a collection
app.post(
	'/api/insert/collection/:name',
	multer().none(),
	(/** @type {any} */ request, /** @type {{ send: (arg0: any) => void; }} */ response) => {
		let result = async (/** @type {string} */ collection) => {
			const formData = request.body;
			database
				.collection(collection)
				.insertOne(JSON.parse(formData.newData))
				.then((/** @type {any} */ result) => {
					return result;
				})
				.catch((/** @type {any} */ err) => {
					return err;
				});
		};
		result(request.params.name.toString()).then((result) => response.send(result));
	}
);
//▰▰▰▰▰▰▰▰▰

// update a document in a collection
app.put(
	'/api/update/collection/:name',
	multer().none(),
	(/** @type {any} */ request, /** @type {{ send: (arg0: any) => void; }} */ response) => {
		let result = async (/** @type {string} */ collection) => {
			const formData = request.body;
			database.collection(collection).updateOne(JSON.parse(formData.newData));
		};
		result(request.params.name.toString()).then((result) => response.send(result));
	}
);

/*
	a response looks like:
	{
		"acknowledged" : true,
		"insertedId" : ObjectId("56fc40f9d735c28df206d078")
	}


	you can use the acknowledged field to do error handling
 */

//▰▰▰▰▰▰▰▰▰

// app.delete('/api/teamproject/DeleteAssets', (request, response) => {
// 	const asset = request.body;

// 	database.collection('Asset').deleteOne({
// 		title: asset.name,
// 		link: asset.link,
// 		'MetaData.lineNum': asset.metadata[line - num],
// 		'MetaData.programming-language': asset.metadata[programming - language]
// 	});
// 	response.json('Deleted');
// });

// var cors = require('cors');
// const multer = require('multer');
// const { request, response } = require('express');

// var app = Express();
// app.use(cors());

// //DB operation functions

// const insertDocument = async (/** @type {string} */ collection, /** @type {any} */ document) => {
// 	const db = await getDbInstance({
// 		dbUrl: envs.DB_API_URL,
// 		dbName: envs.DB_NAME
// 	});
// 	db.command({
// 		insert: collection,
// 		documents: [document]
// 	});
// };

// //General use of insertDocument
// // insertDocument('AssetType', {
// // 	typeName: 'Source Code File1',
// // 	metadataFields: { Language: 'Text', Lines: 'Number' }
// // }).catch((err) => {
// // 	console.error(err);
// // });

// const readDocuments = async (/** @type {string} */ collection) => {
// 	const db = await getDbInstance({
// 		dbUrl: envs.DB_API_URL,
// 		dbName: envs.DB_NAME
// 	});
// 	let dbCollection = db.collection(collection);
// 	let result = await dbCollection.find();
// 	return await result.toArray();
// };

// //General use of readDocuments
// // readDocuments('AssetType')
// // 	.then((result) => console.log(result))
// // 	.catch((err) => {
// // 		console.error(err);
// // 	});

// module.exports = { insertDocument };
