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
	const db = await getDbInstance({
		dbUrl: envs.DB_API_URL,
		dbName: envs.DB_NAME
	});
	db.command({
		insert: collection,
		documents: [document]
	});
};

//General use of insertDocument
// insertDocument('AssetType', {
// 	typeName: 'Source Code File1',
// 	metadataFields: { Language: 'Text', Lines: 'Number' }
// }).catch((err) => {
// 	console.error(err);
// });

const readDocuments = async (/** @type {string} */ collection) => {
	const db = await getDbInstance({
		dbUrl: envs.DB_API_URL,
		dbName: envs.DB_NAME
	});
	let dbCollection = db.collection(collection);
	let result = await dbCollection.find();
	return await result.toArray();
};

//General use of readDocuments
// readDocuments('AssetType')
// 	.then((result) => console.log(result))
// 	.catch((err) => {
// 		console.error(err);
// 	});
