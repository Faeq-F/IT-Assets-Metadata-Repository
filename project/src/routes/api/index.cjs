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
	database.collection('Teamproject').count({}, function (error, numOfAssets) {
		database.collection('Teamproject').insertOne({
			id: (numOfAssets + 1).toString(),
			asset_name: request.body.newAssets
		});
		response.json('Added sir');
	});
});
app.delete('/api/teamproject/DeleteAssets', (request, response) => {
	database.collection('Teamproject').deleteOne({
		id: request.query.id
	});
	response.json('Deleted');
});
