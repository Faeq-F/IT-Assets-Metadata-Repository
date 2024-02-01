import { describe, it, expect, test } from 'vitest';

var Express = require('express');
var Mongoclient = require('mongodb').MongoClient;
var cors = require('cors');
// @ts-ignore
const multer = require('multer');
// @ts-ignore
const { request, response } = require('express');

var app = Express();
app.use(cors());

var URI = 'mongodb+srv://jack:1234@cluster0.lwomw.mongodb.net/?retryWrites=true&w=majority';
var DATABASEName = 'Teamproject';
// @ts-ignore
var database;

app.listen(5038, () => {
	// @ts-ignore
	Mongoclient.connect(URI, (error, client) => {
		database = client.db(DATABASEName);
		console.log('Connected');
	});
});

// @ts-ignore
function sum(a, b) {
	return a + b;
}

// @ts-ignore
async function select(num) {
    let client;

    try {
        // Connect to the database
        client = await Mongoclient.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db(DATABASEName);

        // Perform the database query
        await db.collection('Asset').insertOne({
            asset_id: 1,
            title: "FileNumberOne",
            link: "www.w3schools.com",
            MetaData: {
                lineNum: 50,
                "programming-language": "Java"
            }
        });

        const asset = await db.collection('Asset').findOne({ asset_id: num });
		const asset_id = asset ? asset.asset_id : null;
        console.log(asset);
        return asset_id;
    } finally {
        // Close the database connection if it was opened
        if (client) {
            await client.close();
        }
    }
}

test("SelectAssetName", async () => {
	const result = await select(1)
	expect(result).toEqual(1);
})

describe('sum test', () => {
	it('adds 1 + 2 to equal 3', () => {
		expect(1 + 2).toBe(3);
	});
});


test("add 2 numbers", () => {
	expect(sum(2,3)).toEqual(5);
});
	