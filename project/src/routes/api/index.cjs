var Express = require('express');
var Mongoclient = require('mongodb').MongoClient;
var cors = require('cors');
const multer = require('multer');
const { request, response } = require('express');

var app = Express();
app.use(cors());

var URI = 'mongodb+srv://jack:1234@cluster0.lwomw.mongodb.net/?retryWrites=true&w=majority';
var DATABASEName = 'Teamproject';
var database;

app.listen(5038, () => {
	Mongoclient.connect(URI, (error, client) => {
		database = client.db(DATABASEName);
		console.log('Connected');
	});
});

app.get('/api/teamproject/GetAssets', (request, reponse) => {
	database
		.collection('Teamproject')
		.find({})
		.toArray((error, result) => {
			reponse.send(result);
		});
});
app.post('/api/teamproject/AddAssets', multer().none(), (request, response) => {
	const asset = request.body;

	database.collection('Asset').insertOne({
		title: asset.name,
		link: asset.link,
		MetaData: asset.metadata,
		assetType: asset.assetType
	});

	response.json('Added sir');
});

app.delete('/api/teamproject/DeleteAssets', (request, response) => {
	const asset = request.body;

	database.collection('Asset').deleteOne({
		title: asset.name,
		link: asset.link,
		'MetaData.lineNum': asset.metadata[line-num],
		'MetaData.programming-language': asset.metadata[programming-language] 
	});
	response.json('Deleted');
});
