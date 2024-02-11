// var Express = require('express');
// var Mongoclient = require('mongodb').MongoClient;
// var cors = require('cors');
// const multer = require('multer');
// const { request, response } = require('express');

// var app = Express();
// app.use(cors());

// var URI = 'mongodb+srv://zlac241:123@cluster0.hc6vpim.mongodb.net/?retryWrites=true&w=majority';
// var DATABASEName = 'teamproject';
// var database;

// const client = new MongoClient(config.dbUrl, {
// 	useNewUrlParser: true,
// 	useUnifiedTopology: true
// });

// app.listen(5038, () => {
// 	Mongoclient.connect(URI, (error, client) => {
// 		database = client.db(DATABASEName);
// 		console.log('Connected');
// 	});
// });

// app.get('/api/teamproject/GetAssets', (request, reponse) => {
// 	database
// 		.collection('Teamproject')
// 		.find({})
// 		.toArray((error, result) => {
// 			reponse.send(result);
// 		});
// });
// app.post('/api/teamproject/AddAssets', multer().none(), (request, response) => {
// 	const asset = request.body;

// 	database.collection('Asset').insertOne({
// 		title: asset.name,
// 		link: asset.link,
// 		MetaData: asset.metadata,
// 		assetType: asset.assetType
// 	});

// 	response.json('Added sir');
// });

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

const MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv');
//get env vars
const result = dotenv.config();
if (result.error) {
	throw result.error;
}
//save environment vars for current process
const { parsed: envs } = result;

/**
    Draw the connection srv and the db name from the config to return just one instance of that db.
    Now this function call be called wherever a connection is needed.
*/
const getDbInstance = (/** @type {{ dbUrl: string; dbName: string; }} */ config) =>
	new Promise((resolve, reject) => {
		const client = new MongoClient(config.dbUrl, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});

		client.connect((/** @type {any} */ error) => {
			if (error) {
				console.error(error);
				reject(error);
			}
			let db = client.db(config.dbName);
			resolve(db);
		});
	});

//DB operation functions

const insertDocument = async (/** @type {string} */ collection, /** @type {any} */ document) => {
	try {
		const db = await getDbInstance({
			dbUrl: envs.DB_API_URL,
			dbName: envs.DB_NAME
		});
		console.log('Connected to DB for insertDocument');
		db.command({
			insert: collection,
			documents: [document]
		});
		console.log('Document inserted');
	} catch (e) {
		console.error(`ERROR: `, e);
	}
};

// insertDocument('AssetType', {
// 	typeName: 'Source Code File1',
// 	metadataFields: { Language: 'Text', Lines: 'Number' }
// });

// let assets = [];
// let newAssets = '';
// /**
//  * @param {any} db
//  */
// function refreshAssets(db) {
// 	fetch(API_URL + 'api/teamproject/GetAssets')
// 		.then((response) => response.json())
// 		.then((data) => {
// 			assets = data;
// 		});
// }
