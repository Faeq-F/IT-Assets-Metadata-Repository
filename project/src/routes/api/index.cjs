var Express = require('express');
var Mongoclient = require('mongodb').MongoClient;
var cors = require('cors');
const multer = require('multer');
const { request, response } = require('express');

var app = Express();
app.use(cors());

var URI = 'mongodb+srv://jack:1234@cluster0.lwomw.mongodb.net/?retryWrites=true&w=majority';
var DATABASEName = 'Teamproject';
/**
 * @type {{ collection: (arg0: string) => { (): any; new (): any; find: { (arg0: {}): { (): any; new (): any; toArray: { (arg0: (error: any, result: any) => void): void; new (): any; }; }; new (): any; }; count: { (arg0: {}, arg1: (error: any, numOfAssets: any) => void): void; new (): any; }; insertOne: { (arg0: { id: any; asset_name: any; }): void; new (): any; }; deleteOne: { (arg0: { id: any; }): void; new (): any; }; }; }}
 */
var database;

app.listen(5038, () => {
	Mongoclient.connect(
		URI,
		(
			/** @type {any} */ error,
			/** @type {{ db: (arg0: string) => { collection: (arg0: string) => { (): any; new (): any; find: { (arg0: {}): { (): any; new (): any; toArray: { (arg0: (error: any, result: any) => void): void; new (): any; }; }; new (): any; }; count: { (arg0: {}, arg1: (error: any, numOfAssets: any) => void): void; new (): any; }; insertOne: { (arg0: { id: any; asset_name: any; }): void; new (): any; }; deleteOne: { (arg0: { id: any; }): void; new (): any; }; }; }; }} */ client
		) => {
			database = client.db(DATABASEName);
			console.log('Connected');
		}
	);
});
app.get(
	'/api/teamproject/GetAssets',
	(/** @type {any} */ request, /** @type {{ send: (arg0: any) => void; }} */ response) => {
		database
			.collection('Teamproject')
			.find({})
			.toArray((error, result) => {
				response.send(result);
			});
	}
);
app.post(
	'/api/teamproject/AddAssets',
	multer().none(),
	(
		/** @type {{ body: { newAssets: any; }; }} */ request,
		/** @type {{ json: (arg0: string) => void; }} */ response
	) => {
		database.collection('Teamproject').count({}, function (error, numOfAssets) {
			database.collection('Teamproject').insertOne({
				id: (numOfAssets + 1).toString(),
				asset_name: request.body.newAssets
			});
			response.json('Added sir');
		});
	}
);
app.delete(
	'/api/teamproject/DeleteAssets',
	(
		/** @type {{ query: { id: any; }; }} */ request,
		/** @type {{ json: (arg0: string) => void; }} */ response
	) => {
		database.collection('Teamproject').deleteOne({
			id: request.query.id
		});
		response.json('Deleted');
	}
);
