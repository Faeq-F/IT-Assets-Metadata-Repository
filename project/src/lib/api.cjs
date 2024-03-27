//▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰

//get env vars - only used in this file - everything else will go through the port open for server-side processing
const dotenv = require('dotenv');
const result = dotenv.config();
if (result.error) {
	throw result.error;
}
/**
 * The environment variables from the .env file.
 */
const { parsed: envs } = result;

//▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰

//Setup db connection
var Express = require('express');
var MongoClient = require('mongodb').MongoClient;
const app = Express();
const cors = require('cors');
const multer = require('multer'); // used for accessing form data
app.use(cors());
app.set('case sensitive routing', true); //required to pass the correct names of collections, etc.

/** reusable instance of db @type{any} */
var database;

app.listen(5038, () => {
	MongoClient.connect(
		envs.DB_API_URL,
		async (/** @type {any} */ error, /** @type {{ db: (arg0: any) => any; }} */ client) => {
			database = client.db(envs.DB_NAME);
			if (error) console.error(error);
			console.log(`server-side is running at port 5038\nConnected`);
		}
	);
});

//▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
//Define db routes
//▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰

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

//get a single document
app.get(
	'/api/get/document/:id',
	(/** @type {any} */ request, /** @type {{ send: (arg0: any) => void; }} */ response) => {
		let result = async (/** @type {string} */ id) => {
			let collections = await database.listCollections().toArray();
			for (let i of collections) {
				let document = await database
					.collection(i.name)
					.findOne({ $expr: { $eq: ['$_id', { $toObjectId: id }] } });
				if (document != null) {
					return await document;
				}
			}
			return {};
		};
		result(request.params.id.toString()).then((result) => response.send(result));
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
			let call = await validUser(formData.userData);
			if (call) {
				const rec = await database.collection(collection).insertOne(JSON.parse(formData.newData));
				return rec.insertedId;
			}
		};
		result(request.params.name.toString())
			.then((result) => {
				response.send(result);
			})
			.catch((error) => {
				console.log(error);
				return error;
			});
	}
);
//▰▰▰▰▰▰▰▰▰

// update a document in a collection
app.put(
	'/api/update/collection/:name/document/:id',
	multer().none(),
	(/** @type {any} */ request, /** @type {{ send: (arg0: any) => void; }} */ response) => {
		let result = async (/** @type {string} */ collection, /** @type {string} */ documentID) => {
			const formData = request.body;
			let call = await validUser(formData.userData);
			if (call) {
				database
					.collection(collection)
					.replaceOne(
						{ $expr: { $eq: ['$_id', { $toObjectId: documentID }] } },
						JSON.parse(formData.newData)
					)
					.catch((/** @type {any} */ err) => {
						return err;
					});
			}
		};

		result(request.params.name.toString(), request.params.id.toString())
			.then((result) => response.send(result))
			.catch((/** @type {any} */ error) => {
				console.log(error);
				return error;
			});
	}
);

//▰▰▰▰▰▰▰▰▰

// delete a document in a collection
app.delete(
	'/api/delete/collection/:name/document/:id',
	multer().none(),
	(/** @type {any} */ request, /** @type {{ send: (arg0: any) => void; }} */ response) => {
		let result = async (/** @type {string} */ collection, /** @type {string} */ documentID) => {
			const formData = request.body;

			let call = await validUser(formData.userData);
			if (call) {
				database
					.collection(collection)
					.remove({ $expr: { $eq: ['$_id', { $toObjectId: documentID }] } });
			}
		};

		result(request.params.name.toString(), request.params.id.toString())
			.then((result) => response.send(result))
			.catch((/** @type {any} */ error) => {
				console.log(error);
				return error;
			});
	}
);

//▰▰▰▰▰▰▰▰▰

/**
 * Checks whether if the cookie sent has valid user credentials in the database
 * @param {*} user JSON object of user details stored in cookie
 * @returns {Promise<Boolean>} true if valid user false if not
 * @author Christian-Frederick Cubos
 * @email zlac145@live.rhul.ac.uk
 */
async function validUser(user) {
	try {
		const userString = JSON.parse(user);

		// Extract values from the user object
		var username = userString.username;
		var password = parseInt(userString.passwordHash);
		var role = userString.role;

		// Query the database checking if there are credentials for user obj
		var count = await database.collection('User').countDocuments({
			username: username,
			passwordHash: password,
			role: role
		});

		return count == 1;
	} catch (error) {
		console.error('Error checking user:', error);
		return false;
	}
}
